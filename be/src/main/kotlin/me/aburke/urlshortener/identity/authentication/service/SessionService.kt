package me.aburke.urlshortener.identity.authentication.service

import me.aburke.urlshortener.errors.LoginFailureError
import me.aburke.urlshortener.identity.authentication.store.SessionModel
import me.aburke.urlshortener.identity.authentication.store.SessionStore
import me.aburke.urlshortener.identity.register.store.UserStore
import me.aburke.urlshortener.logging.LoggingContext
import org.slf4j.LoggerFactory
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.security.SecureRandom
import java.time.Instant
import java.util.*

@Service
class SessionService(
    private val passwordEncoder: PasswordEncoder,
    private val userStore: UserStore,
    private val sessionStore: SessionStore,
) {

    companion object {
        private val logger = LoggerFactory.getLogger(SessionService::class.java)
    }

    fun createSession(username: String, password: String, loggingContext: LoggingContext): SessionModel {
        val canonicalUsername = username.trim().lowercase()
        loggingContext.with("username" to canonicalUsername)
            .writeLog { logger.debug("Searching for user by username") }
        val user = userStore.findUserByUsername(canonicalUsername, loggingContext)
        if (user == null) {
            loggingContext.with("username" to canonicalUsername)
                .writeLog { logger.debug("User not found for username; login failed") }
            throw LoginFailureError()
        } else if (!passwordEncoder.matches(password, user.password)) {
            loggingContext.with("username" to canonicalUsername)
                .writeLog { logger.debug("Password provided did not match DB; login failed") }
            throw LoginFailureError()
        }

        return SessionModel(
            sessionId = createSessionKey(),
            userId = user.id,
            username = user.username,
            createdAt = Instant.now(),
        ).also { sessionStore.createSession(it, loggingContext) }
            .also {
                loggingContext.withAttributes(
                    mapOf(
                        "sessionId" to it.sessionId.substring(0, 8),
                        "userId" to it.userId,
                        "username" to it.username,
                    )
                ).writeLog { logger.info("Session successfully created") }
            }
    }

    private fun createSessionKey(): String {
        val bytes = ByteArray(20)
        SecureRandom().nextBytes(bytes)
        return Base64.getEncoder().encodeToString(bytes)
    }

    fun loadActiveSession(sessionId: String, loggingContext: LoggingContext): SessionModel? {
        loggingContext.writeLog { logger.debug("Searching DB for session key") }
        return sessionStore.findSession(sessionId, loggingContext)
    }

    fun endSession(sessionId: String, loggingContext: LoggingContext) {
        sessionStore.deleteSession(sessionId, loggingContext)
        loggingContext.writeLog { logger.info("Session removed from DB") }
    }
}
