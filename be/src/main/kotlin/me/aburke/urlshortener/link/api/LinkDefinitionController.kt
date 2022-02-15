package me.aburke.urlshortener.link.api

import me.aburke.urlshortener.identity.authentication.store.SessionModel
import me.aburke.urlshortener.link.dto.CreateLinkRequest
import me.aburke.urlshortener.link.dto.LinkResponse
import me.aburke.urlshortener.link.dto.LinksResponse
import me.aburke.urlshortener.link.service.LinkDefinitionService
import me.aburke.urlshortener.link.service.LinkDefinitionSpec
import me.aburke.urlshortener.link.store.LinkStatus
import me.aburke.urlshortener.logging.LoggingContext
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/v1/links")
class LinkDefinitionController(private val linkDefinitionService: LinkDefinitionService) {

    companion object {
        private val logger = LoggerFactory.getLogger(LinkDefinitionController::class.java)
    }

    @PostMapping
    fun createLink(
        @RequestAttribute("loggingContext") loggingContext: LoggingContext,
        @RequestAttribute("session") session: SessionModel,
        @RequestBody createRequest: CreateLinkRequest,
    ): LinkResponse {
        val contextWithAction = loggingContext.withAttribute("apiAction" to "createLink")
        contextWithAction.writeLog { logger.info("Request received to create link") }

        return linkDefinitionService.createLink(
            userId = session.userId,
            spec = LinkDefinitionSpec(
                label = createRequest.label,
                status = createRequest.status,
                linkTarget = createRequest.linkTarget,
            ),
            loggingContext = contextWithAction,
        ).let {
            LinkResponse(
                id = it.id,
                label = it.label,
                pathName = it.pathName,
                status = it.status,
                linkTarget = it.linkTarget,
            )
        }
    }

    @GetMapping
    fun getLinks(
        @RequestAttribute("loggingContext") loggingContext: LoggingContext,
        @RequestAttribute("session") session: SessionModel,
        @RequestParam(name = "status", required = false) status: LinkStatus?,
    ): LinksResponse {
        val contextWithAction = loggingContext.withAttribute("apiAction" to "getLinks")
        contextWithAction.with("queryStatus" to status?.name)
            .writeLog { logger.info("Request received to retrieve links") }

        return linkDefinitionService.getLinksForUser(
            userId = session.userId,
            onlyWithStatus = status,
            loggingContext = contextWithAction,
        ).map {
            LinkResponse(
                id = it.id,
                label = it.label,
                pathName = it.pathName,
                status = it.status,
                linkTarget = it.linkTarget,
            )
        }.let { LinksResponse(it) }
    }
}
