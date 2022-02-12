package me.aburke.urlshortener.identity.authentication.store

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConfigurationProperties("dynamodb.tables.session")
@ConstructorBinding
data class SessionStoreProperties(val tableName: String)
