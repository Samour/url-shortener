package me.aburke.urlshortener.identity.register.store

import org.springframework.stereotype.Repository
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.AttributeValue

@Repository
class UserStore(private val dynamoDbClient: DynamoDbClient, private val userStoreProperties: UserStoreProperties) {

    fun insertUser(user: UserModel) {
        dynamoDbClient.putItem { b ->
            b.tableName(userStoreProperties.tableName)
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

    fun findUserByUsername(username: String): UserModel? {
        return dynamoDbClient.query { b ->
            b.tableName(userStoreProperties.tableName)
                .indexName(userStoreProperties.canonicalUsernameIndex)
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
