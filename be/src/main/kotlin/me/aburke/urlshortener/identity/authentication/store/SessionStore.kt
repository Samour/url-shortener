package me.aburke.urlshortener.identity.authentication.store

import me.aburke.urlshortener.logging.LoggingContext
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.AttributeValue
import java.time.Instant

@Repository
class SessionStore(private val dynamoDbClient: DynamoDbClient, sessionStoreProperties: SessionStoreProperties) {

    companion object {
        private val logger = LoggerFactory.getLogger(SessionStore::class.java)
    }

    private val tableName = sessionStoreProperties.tableName

    fun createSession(session: SessionModel, loggingContext: LoggingContext) {
        loggingContext.with(
            mapOf(
                "dbTable" to tableName,
                "itemIdPrefix" to session.sessionId.take(8),
            )
        ).writeLog { logger.debug("Inserting session into DB") }

        dynamoDbClient.putItem { b ->
            b.tableName(tableName)
                .item(
                    mapOf(
                        "sessionId" to AttributeValue.builder().s(session.sessionId).build(),
                        "userId" to AttributeValue.builder().s(session.userId).build(),
                        "username" to AttributeValue.builder().s(session.username).build(),
                        "createdAt" to AttributeValue.builder().s(session.createdAt.toString()).build(),
                    )
                ).conditionExpression("attribute_not_exists(sessionId)")
        }
    }

    fun findSession(sessionId: String, loggingContext: LoggingContext): SessionModel? {
        loggingContext.with(
            mapOf(
                "dbTable" to tableName,
                "itemIdPrefix" to sessionId.take(8),
            )
        ).writeLog { logger.debug("Querying session by id") }

        return dynamoDbClient.getItem { b ->
            b.tableName(tableName)
                .key(mapOf("sessionId" to AttributeValue.builder().s(sessionId).build()))
        }.takeIf { it.hasItem() }
            ?.item()
            ?.let {
                SessionModel(
                    sessionId = it["sessionId"]!!.s(),
                    userId = it["userId"]!!.s(),
                    username = it["username"]!!.s(),
                    createdAt = Instant.parse(it["createdAt"]!!.s()),
                )
            }
    }

    fun deleteSession(sessionId: String, loggingContext: LoggingContext) {
        loggingContext.with(
            mapOf(
                "dbTable" to tableName,
                "itemIdPrefix" to sessionId.take(8),
            )
        ).writeLog { logger.debug("Deleting session from DB") }

        dynamoDbClient.deleteItem { b ->
            b.tableName(tableName)
                .key(mapOf("sessionId" to AttributeValue.builder().s(sessionId).build()))
        }
    }
}
