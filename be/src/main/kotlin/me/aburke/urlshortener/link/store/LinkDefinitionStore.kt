package me.aburke.urlshortener.link.store

import me.aburke.urlshortener.logging.LoggingContext
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.AttributeValue

@Repository
class LinkDefinitionStore(
    private val dynamoDbClient: DynamoDbClient,
    linkDefinitionStoreConfig: LinkDefinitionStoreConfig,
) {

    companion object {
        private val logger = LoggerFactory.getLogger(LinkDefinitionStore::class.java)
    }

    private val tableName = linkDefinitionStoreConfig.tableName
    private val labelIndex = linkDefinitionStoreConfig.labelIndex

    fun insertLinkDefinition(linkDefinition: LinkDefinitionModel, loggingContext: LoggingContext) {
        loggingContext.with(
            mapOf(
                "dbAction" to "insert",
                "dbTable" to tableName,
                "itemHashKey" to linkDefinition.userId,
                "itemRangeKey" to linkDefinition.id,
            )
        ).writeLog { logger.debug("Inserting LinkDefinition into DB") }

        dynamoDbClient.putItem { b ->
            b.tableName(tableName)
                .item(
                    mapOf(
                        "userId" to AttributeValue.builder().s(linkDefinition.userId).build(),
                        "id" to AttributeValue.builder().s(linkDefinition.id).build(),
                        "label" to AttributeValue.builder().s(linkDefinition.label).build(),
                        "pathName" to AttributeValue.builder().s(linkDefinition.pathName).build(),
                        "status" to AttributeValue.builder().s(linkDefinition.status.name).build(),
                        "linkTarget" to AttributeValue.builder().s(linkDefinition.linkTarget).build(),
                    )
                ).conditionExpression("attribute_not_exists(userId)")
        }
    }

    fun getLinksSortedByLabelName(
        userId: String,
        onlyWithStatus: LinkStatus? = null,
        loggingContext: LoggingContext,
    ): List<LinkDefinitionModel> {
        loggingContext.with(
            mapOf(
                "dbAction" to "query",
                "dbTable" to tableName,
                "dbIndex" to labelIndex,
                "queryKey" to userId,
                "sortBy" to "label",
            )
        ).writeLog { logger.debug("Querying table by userId") }

        return dynamoDbClient.queryPaginator { b ->
            b.tableName(tableName)
                .indexName(labelIndex)
                .keyConditionExpression("userId = :userId")
                .also {
                    onlyWithStatus?.let {
                        b.filterExpression("#status = :status")
                            .expressionAttributeNames(mapOf("#status" to "status"))
                    }
                }.expressionAttributeValues(
                    mapOf(
                        ":userId" to AttributeValue.builder().s(userId).build(),
                        ":status" to onlyWithStatus?.let { AttributeValue.builder().s(it.name).build() },
                    ).filterValues { it != null }
                )
        }.items()
            .map {
                LinkDefinitionModel(
                    userId = it["userId"]!!.s(),
                    id = it["id"]!!.s(),
                    label = it["label"]!!.s(),
                    pathName = it["pathName"]!!.s(),
                    status = LinkStatus.valueOf(it["status"]!!.s()),
                    linkTarget = it["linkTarget"]!!.s(),
                )
            }
    }
}
