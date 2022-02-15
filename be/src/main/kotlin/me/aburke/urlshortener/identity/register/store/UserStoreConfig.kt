package me.aburke.urlshortener.identity.register.store

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConfigurationProperties("dynamodb.tables.user")
@ConstructorBinding
data class UserStoreConfig(
    val tableName: String,
    val canonicalUsernameIndex: String,
)
