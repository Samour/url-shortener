package me.aburke.urlshortener.identity.authentication.store

import me.aburke.urlshortener.logging.LoggingContext
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.AttributeValue

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
                "itemId" to session.sessionId.substring(0, 8),
            )
        ).writeLog { logger.debug("Inserting session into DB") }
        dynamoDbClient.putItem { b ->
            b.tableName(tableName)
                .item(
                    mapOf(
                        "sessionId" to AttributeValue.builder().s(session.sessionId).build(),
                        "userId" to AttributeValue.builder().s(session.sessionId).build(),
                        "username" to AttributeValue.builder().s(session.username).build(),
                        "createdAt" to AttributeValue.builder().s(session.createdAt.toString()).build(),
                    )
                ).conditionExpression("attribute_not_exists(sessionId)")
        }
    }
}
