package me.aburke.urlshortener.identity

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class IdentityBeans {

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()
}
