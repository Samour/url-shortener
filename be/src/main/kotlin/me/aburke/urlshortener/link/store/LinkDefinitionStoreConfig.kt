package me.aburke.urlshortener.link.store

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConfigurationProperties("dynamodb.tables.link-definition")
@ConstructorBinding
data class LinkDefinitionStoreConfig(
    val tableName: String,
    val labelIndex: String,
)
