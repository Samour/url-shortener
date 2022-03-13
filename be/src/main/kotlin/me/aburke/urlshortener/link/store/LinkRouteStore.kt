package me.aburke.urlshortener.link.store

import me.aburke.urlshortener.logging.LoggingContext
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.AttributeValue
import java.time.Instant

@Repository
class LinkRouteStore(
    private val dynamoDbClient: DynamoDbClient,
    linkRouteStoreConfig: LinkRouteStoreConfig,
) {

    companion object {
        private val logger = LoggerFactory.getLogger(LinkRouteStore::class.java)
    }

    private val tableName = linkRouteStoreConfig.tableName
    private val reservationPeriod = linkRouteStoreConfig.reservationPeriod

    fun reservePathName(pathName: String, loggingContext: LoggingContext) {
        loggingContext.with(
            mapOf(
                "dbAction" to "insert",
                "dbTable" to tableName,
                "itemKey" to pathName,
            )
        ).writeLog { logger.debug("Reserving path name in LinkRoute table") }

        dynamoDbClient.putItem { b ->
            b.tableName(tableName)
                .item(
                    mapOf(
                        "pathName" to AttributeValue.builder().s(pathName).build(),
                        "status" to AttributeValue.builder().s(LinkRouteStatus.RESERVED.name).build(),
                        "reservationEndAt" to AttributeValue.builder().n(
                            Instant.now().plus(reservationPeriod).epochSecond.toString()
                        ).build(),
                    )
                ).conditionExpression("attribute_not_exists(pathName)")
        }
    }

    fun bindRoute(pathName: String, linkTarget: String, status: LinkRouteStatus, loggingContext: LoggingContext) {
        loggingContext.with(
            mapOf(
                "dbAction" to "updateItem",
                "dbTable" to tableName,
                "itemKey" to pathName,
                "update" to "bindRoute",
                "linkTarget" to linkTarget,
            )
        ).writeLog { logger.debug("Binding linkTarget to LinkRoute") }

        dynamoDbClient.updateItem { b ->
            b.tableName(tableName)
                .key(mapOf("pathName" to AttributeValue.builder().s(pathName).build()))
                .updateExpression(
                    "SET linkTarget = :linkTarget, #status = :status " +
                            "REMOVE reservationEndAt"
                ).conditionExpression(
                    "attribute_exists(pathName) AND #status = :reservedStatus AND " +
                            "reservationEndAt > :now"
                ).expressionAttributeNames(mapOf("#status" to "status"))
                .expressionAttributeValues(
                    mapOf(
                        ":linkTarget" to AttributeValue.builder().s(linkTarget).build(),
                        ":status" to AttributeValue.builder().s(status.name).build(),
                        ":reservedStatus" to AttributeValue.builder().s(LinkRouteStatus.RESERVED.name).build(),
                        ":now" to AttributeValue.builder().n(Instant.now().epochSecond.toString()).build(),
                    )
                )
        }
    }

    fun updateStatus(pathName: String, status: LinkRouteStatus, loggingContext: LoggingContext) {
        loggingContext.with(
            mapOf(
                "dbAction" to "updateItem",
                "dbTable" to tableName,
                "itemKey" to pathName,
                "update" to "status",
                "status" to status.name,
            )
        ).writeLog { logger.debug("Updating LinkRoute status") }

        dynamoDbClient.updateItem { b ->
            b.tableName(tableName)
                .key(mapOf("pathName" to AttributeValue.builder().s(pathName).build()))
                .updateExpression("SET #status = :status")
                .conditionExpression("attribute_exists(pathName)")
                .expressionAttributeNames(mapOf("#status" to "status"))
                .expressionAttributeValues(mapOf(":status" to AttributeValue.builder().s(status.name).build()))
        }
    }
}
