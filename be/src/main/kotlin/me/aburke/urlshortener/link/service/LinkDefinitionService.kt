package me.aburke.urlshortener.link.service

import me.aburke.urlshortener.errors.ResourceNotFoundError
import me.aburke.urlshortener.link.store.LinkDefinitionModel
import me.aburke.urlshortener.link.store.LinkDefinitionStore
import me.aburke.urlshortener.link.store.LinkRouteStore
import me.aburke.urlshortener.link.store.LinkStatus
import me.aburke.urlshortener.logging.LoggingContext
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.*

@Service
class LinkDefinitionService(
    private val linkDefinitionStore: LinkDefinitionStore,
    private val linkRouteStore: LinkRouteStore,
) {

    companion object {
        private val logger = LoggerFactory.getLogger(LinkDefinitionService::class.java)
    }

    fun createLink(userId: String, spec: LinkDefinitionSpec, loggingContext: LoggingContext): LinkDefinitionModel {
        val pathName = generatePathName()
        linkRouteStore.reservePathName(pathName, loggingContext)

        return LinkDefinitionModel(
            userId = userId,
            id = UUID.randomUUID().toString(),
            label = spec.label,
            pathName = pathName,
            status = spec.status,
            linkTarget = spec.linkTarget,
        ).also { linkDefinitionStore.insertLinkDefinition(it, loggingContext) }
            .also { linkRouteStore.bindRoute(pathName, it.linkTarget, it.status.routeStatus, loggingContext) }
            .also {
                loggingContext.with(
                    mapOf(
                        "linkId" to it.id,
                        "pathName" to it.pathName,
                    )
                ).writeLog { logger.info("LinkDefinition created") }
            }
    }

    fun getLinksForUser(
        userId: String,
        onlyWithStatus: LinkStatus?,
        loggingContext: LoggingContext,
    ): List<LinkDefinitionModel> {
        loggingContext.writeLog { logger.info("Searching LinkDefinitions for user") }
        return linkDefinitionStore.getLinksSortedByLabelName(userId, onlyWithStatus, loggingContext)
    }

    fun getLink(userId: String, linkId: String, loggingContext: LoggingContext): LinkDefinitionModel {
        return linkDefinitionStore.findLink(userId, linkId, loggingContext) ?: throw ResourceNotFoundError
    }

    fun updateLinkLabel(userId: String, linkId: String, label: String, loggingContext: LoggingContext) {
        linkDefinitionStore.updateLabel(userId, linkId, label, loggingContext)
    }

    fun updateLinkStatus(userId: String, linkId: String, status: LinkStatus, loggingContext: LoggingContext) {
        val linkDefinition = getLink(userId, linkId, loggingContext)
        linkDefinitionStore.updateStatus(userId, linkId, status, loggingContext)
        linkRouteStore.updateStatus(linkDefinition.pathName, status.routeStatus, loggingContext)
    }
}
