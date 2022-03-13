package me.aburke.urlshortener.link.store

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding
import java.time.Duration

@ConfigurationProperties("dynamodb.tables.link-route")
@ConstructorBinding
data class LinkRouteStoreConfig(
    val tableName: String,
    val reservationPeriod: Duration,
)
