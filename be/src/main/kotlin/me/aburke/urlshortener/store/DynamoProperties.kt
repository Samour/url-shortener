package me.aburke.urlshortener.store

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConfigurationProperties("dynamodb")
@ConstructorBinding
data class DynamoProperties(val url: String?)
