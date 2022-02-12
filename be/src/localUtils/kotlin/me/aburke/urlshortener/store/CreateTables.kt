package me.aburke.urlshortener.store

import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.*
import java.net.URI
import java.util.function.Consumer

fun main(args: Array<String>) {
    val dynamoDbClient = DynamoDbClient.builder()
        .endpointOverride(URI(System.getenv("DYNAMODB_ENDPOINT")))
        .build()
    val serviceName = System.getenv("SERVICE_NAME")

    fun createTable(tableName: String, additional: ((CreateTableRequest.Builder) -> Unit)? = null) {
        val fullName = "$serviceName-$tableName"
        try {
            dynamoDbClient.describeTable { b ->
                b.tableName(fullName)
            }
            System.out.println("Table $fullName already exists")
        } catch (e: Throwable) {
            dynamoDbClient.createTable { b ->
                b.tableName(fullName)
                    .billingMode(BillingMode.PAY_PER_REQUEST)
                    .let { _ ->
                        additional?.let { it(b) }
                    }
            }
            System.out.println("Table $fullName created")
        }
    }

    createTable("user") { b ->
        b.attributeDefinitions(
            Consumer { a -> a.attributeName("id").attributeType(ScalarAttributeType.S) },
            Consumer { a -> a.attributeName("canonicalUsername").attributeType(ScalarAttributeType.S) },
        ).keySchema(Consumer { k ->
            k.attributeName("id").keyType(KeyType.HASH)
        }).globalSecondaryIndexes(Consumer { i ->
            i.indexName("$serviceName-user-canonical-username")
                .keySchema(Consumer { k ->
                    k.attributeName("canonicalUsername").keyType(KeyType.HASH)
                }).projection { p -> p.projectionType(ProjectionType.ALL) }
        })
    }

    createTable("session") { b ->
        b.attributeDefinitions(
            Consumer { a -> a.attributeName("sessionId").attributeType(ScalarAttributeType.S) }
        ).keySchema(Consumer { k ->
            k.attributeName("sessionId").keyType(KeyType.HASH)
        })
    }
}
