package me.aburke.urlshortener.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding
import java.time.Duration

@ConfigurationProperties("cache.sessions")
@ConstructorBinding
data class SessionCacheConfig(val ttl: Duration)
