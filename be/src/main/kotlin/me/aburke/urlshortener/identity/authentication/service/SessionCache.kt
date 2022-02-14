package me.aburke.urlshortener.identity.authentication.service

import me.aburke.urlshortener.config.SessionCacheConfig
import me.aburke.urlshortener.identity.authentication.store.SessionModel
import me.aburke.urlshortener.logging.LoggingContext
import org.ehcache.Cache
import org.ehcache.CacheManager
import org.ehcache.config.builders.CacheConfigurationBuilder
import org.ehcache.config.builders.ExpiryPolicyBuilder
import org.ehcache.config.builders.ResourcePoolsBuilder
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class SessionCache(
    val sessionService: SessionService,
    sessionCacheConfig: SessionCacheConfig,
    cacheManager: CacheManager,
) : ActiveSessionLoader {

    companion object {
        private val logger = LoggerFactory.getLogger(SessionCache::class.java)
    }

    private val cache: Cache<String, SessionModel> = cacheManager.createCache(
        "sessions",
        CacheConfigurationBuilder.newCacheConfigurationBuilder(
            String::class.java,
            SessionModel::class.java,
            ResourcePoolsBuilder.heap(10_000)
        ).withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(sessionCacheConfig.ttl))
    )

    override fun loadActiveSession(sessionId: String, loggingContext: LoggingContext): SessionModel? {
        loggingContext.writeLog { logger.debug("Searching cache for session ID") }
        val cacheEntry = cache.get(sessionId);
        if (cacheEntry != null) {
            loggingContext.writeLog { logger.debug("Session found in cache") }
            return cacheEntry
        }

        loggingContext.writeLog { logger.debug("Cache miss; loading from DB") }
        return sessionService.loadActiveSession(sessionId, loggingContext)
            ?.also { cache.put(it.sessionId, it) }
    }
}
