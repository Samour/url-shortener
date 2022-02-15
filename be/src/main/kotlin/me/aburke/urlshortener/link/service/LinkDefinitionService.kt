package me.aburke.urlshortener.link.service

import me.aburke.urlshortener.link.store.LinkDefinitionModel
import me.aburke.urlshortener.link.store.LinkDefinitionStore
import me.aburke.urlshortener.link.store.LinkStatus
import me.aburke.urlshortener.logging.LoggingContext
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.*

@Service
class LinkDefinitionService(private val linkDefinitionStore: LinkDefinitionStore) {

    companion object {
        private val logger = LoggerFactory.getLogger(LinkDefinitionService::class.java)
    }

    fun createLink(userId: String, spec: LinkDefinitionSpec, loggingContext: LoggingContext): LinkDefinitionModel {
        return LinkDefinitionModel(
            userId = userId,
            id = UUID.randomUUID().toString(),
            label = spec.label,
            pathName = generatePathName(),
            status = spec.status,
            linkTarget = spec.linkTarget,
        ).also { linkDefinitionStore.insertLinkDefinition(it, loggingContext) }
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
}
