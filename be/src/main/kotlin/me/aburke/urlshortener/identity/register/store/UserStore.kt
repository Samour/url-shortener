package me.aburke.urlshortener.identity.register.store

import me.aburke.urlshortener.logging.LoggingContext
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.AttributeValue

@Repository
class UserStore(private val dynamoDbClient: DynamoDbClient, userStoreProperties: UserStoreProperties) {

    companion object {
        private val logger = LoggerFactory.getLogger(UserStore::class.java)
    }

    private val tableName: String = userStoreProperties.tableName
    private val canonicalUsernameIndex: String = userStoreProperties.canonicalUsernameIndex

    fun insertUser(user: UserModel, loggingContext: LoggingContext) {
        loggingContext.with(
            mapOf(
                "dbTable" to tableName,
                "itemId" to user.id,
            )
        ).writeLog { logger.debug("Inserting user into DB") }

        dynamoDbClient.putItem { b ->
            b.tableName(tableName)
                .item(
                    mapOf(
                        "id" to AttributeValue.builder().s(user.id).build(),
                        "username" to AttributeValue.builder().s(user.username).build(),
                        "canonicalUsername" to AttributeValue.builder().s(user.canonicalUsername).build(),
                        "password" to AttributeValue.builder().s(user.password).build(),
                    )
                ).conditionExpression("attribute_not_exists(id)")
        }
    }

    fun findUserByUsername(username: String, loggingContext: LoggingContext): UserModel? {
        loggingContext.with(
            mapOf(
                "dbTable" to tableName,
                "dbIndex" to canonicalUsernameIndex,
                "queryKey" to username,
            )
        ).writeLog { logger.debug("Querying table by username") }

        return dynamoDbClient.query { b ->
            b.tableName(tableName)
                .indexName(canonicalUsernameIndex)
                .keyConditionExpression("canonicalUsername = :canonicalUsername")
                .expressionAttributeValues(
                    mapOf(
                        ":canonicalUsername" to AttributeValue.builder().s(username).build()
                    )
                )
        }.items()?.firstOrNull()?.let {
            UserModel(
                id = it["id"]!!.s(),
                username = it["username"]!!.s(),
                canonicalUsername = it["canonicalUsername"]!!.s(),
                password = it["password"]!!.s(),
            )
        }
    }
}
