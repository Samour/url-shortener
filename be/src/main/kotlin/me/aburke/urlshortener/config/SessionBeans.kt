package me.aburke.urlshortener.config

import org.ehcache.config.builders.CacheManagerBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SessionBeans {

    @Bean
    fun cacheManager() = CacheManagerBuilder.newCacheManagerBuilder().build(true)
}
