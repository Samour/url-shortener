package me.aburke.urlshortener.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConfigurationProperties("web.cors")
@ConstructorBinding
data class CorsConfig(val allowedOrigins: List<String>?)
