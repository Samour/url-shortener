package me.aburke.urlshortener.identity.register.service

import me.aburke.urlshortener.errors.ValidationError
import me.aburke.urlshortener.identity.register.store.UserModel
import me.aburke.urlshortener.identity.register.store.UserStore
import me.aburke.urlshortener.logging.LoggingContext
import org.slf4j.LoggerFactory
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.util.*

@Service
class RegisterUserService(private val passwordEncoder: PasswordEncoder, private val userStore: UserStore) {

    companion object {
        private val logger = LoggerFactory.getLogger(RegisterUserService::class.java)
    }

    fun registerUser(username: String, rawPassword: String, loggingContext: LoggingContext): UserModel {
        val normalizedUsername = username.trim()
        val canonicalUsername = normalizedUsername.lowercase()

        if (userStore.findUserByUsername(canonicalUsername, loggingContext) != null) {
            loggingContext.writeLog { logger.debug("Conflicting user found by username; rejecting request") }
            throw ValidationError.UsernameNotAvailableError
        }

        return UserModel(
            id = UUID.randomUUID().toString(),
            username = normalizedUsername,
            canonicalUsername = canonicalUsername,
            password = passwordEncoder.encode(rawPassword),
        ).also { userStore.insertUser(it, loggingContext) }
            .also {
                loggingContext.withAttributes(
                    mapOf(
                        "userId" to it.id,
                        "username" to it.username,
                    )
                ).writeLog { logger.info("User successfully created") }
            }
    }
}
