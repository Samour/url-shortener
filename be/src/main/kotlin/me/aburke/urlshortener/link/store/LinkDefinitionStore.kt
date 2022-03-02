package me.aburke.urlshortener.link.store

import me.aburke.urlshortener.errors.ResourceNotFoundError
import me.aburke.urlshortener.logging.LoggingContext
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.AttributeValue
import software.amazon.awssdk.services.dynamodb.model.ConditionalCheckFailedException

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
            .map(::deserialise)
    }

    fun findLink(userId: String, linkId: String, loggingContext: LoggingContext): LinkDefinitionModel? {
        loggingContext.with(
            mapOf(
                "dbAction" to "getItem",
                "dbTable" to tableName,
                "itemHashKey" to userId,
                "itemRangeKey" to linkId,
            )
        ).writeLog { logger.debug("Fetching LinkDefinition from DB") }

        return dynamoDbClient.getItem { b ->
            b.tableName(tableName)
                .key(
                    mapOf(
                        "userId" to AttributeValue.builder().s(userId).build(),
                        "id" to AttributeValue.builder().s(linkId).build(),
                    )
                )
        }.takeIf { it.hasItem() }
            ?.item()
            ?.let(::deserialise)
    }

    fun updateLabel(userId: String, id: String, label: String, loggingContext: LoggingContext) {
        updateLinkDefinition(
            userId,
            id,
            "label",
            label,
            loggingContext,
        )
    }

    fun updateStatus(userId: String, id: String, status: LinkStatus, loggingContext: LoggingContext) {
        updateLinkDefinition(
            userId,
            id,
            "status",
            status.name,
            loggingContext,
        )
    }

    private fun updateLinkDefinition(
        userId: String,
        id: String,
        fieldName: String,
        fieldValue: String,
        loggingContext: LoggingContext,
    ) {
        val context = loggingContext.with(
            mapOf(
                "dbAction" to "updateItem",
                "dbTable" to tableName,
                "itemHashKey" to userId,
                "itemRangeKey" to id,
                "field" to fieldName,
                "value" to fieldValue,
            )
        );
        context.writeLog { logger.debug("Updating LinkDefinition item") }

        try {
            dynamoDbClient.updateItem { b ->
                b.tableName(tableName)
                    .key(
                        mapOf(
                            "userId" to AttributeValue.builder().s(userId).build(),
                            "id" to AttributeValue.builder().s(id).build(),
                        )
                    ).updateExpression("SET #field = :value")
                    .expressionAttributeNames(mapOf("#field" to fieldName))
                    .expressionAttributeValues(
                        mapOf(
                            ":value" to AttributeValue.builder().s(fieldValue).build(),
                        )
                    ).conditionExpression("attribute_exists(userId)")
            }
        } catch (e: ConditionalCheckFailedException) {
            context.writeLog { logger.info("Attempted to update item that does not exist") }
            throw ResourceNotFoundError
        }
    }

    private fun deserialise(item: Map<String, AttributeValue>): LinkDefinitionModel =
        LinkDefinitionModel(
            userId = item["userId"]!!.s(),
            id = item["id"]!!.s(),
            label = item["label"]!!.s(),
            pathName = item["pathName"]!!.s(),
            status = LinkStatus.valueOf(item["status"]!!.s()),
            linkTarget = item["linkTarget"]!!.s(),
        )
}
