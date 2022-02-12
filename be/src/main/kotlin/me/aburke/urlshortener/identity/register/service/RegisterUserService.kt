package me.aburke.urlshortener.identity.register.service

import me.aburke.urlshortener.errors.ValidationError
import me.aburke.urlshortener.identity.register.store.UserModel
import me.aburke.urlshortener.identity.register.store.UserStore
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.util.*

@Service
class RegisterUserService(private val passwordEncoder: PasswordEncoder, private val userStore: UserStore) {

    fun registerUser(username: String, rawPassword: String): UserModel {
        val normalizedUsername = username.trim()
        val canonicalUsername = normalizedUsername.lowercase()

        if (userStore.findUserByUsername(canonicalUsername) != null) {
            throw ValidationError.UsernameNotAvailableError
        }

        return UserModel(
            id = UUID.randomUUID().toString(),
            username = normalizedUsername,
            canonicalUsername = canonicalUsername,
            password = passwordEncoder.encode(rawPassword),
        ).also { userStore.insertUser(it) }
    }
}
