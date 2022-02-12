package me.aburke.urlshortener

import com.fasterxml.jackson.databind.ObjectMapper
import me.aburke.urlshortener.identity.authentication.store.SessionStore
import me.aburke.urlshortener.identity.interceptors.AuthenticationFilter
import me.aburke.urlshortener.logging.LoggingInterceptor
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class WebFilterConfig {

    @Bean
    fun loggingInterceptor() = FilterRegistrationBean<LoggingInterceptor>()
        .apply {
            filter = LoggingInterceptor()
            order = 1
            urlPatterns = listOf("/*")
        }

    @Bean
    fun authorizationInterceptor(objectMapper: ObjectMapper, sessionStore: SessionStore) =
        FilterRegistrationBean<AuthenticationFilter>()
            .apply {
                filter = AuthenticationFilter(
                    excludePaths = listOf(
                        "/v1/identity/register",
                        "/v1/identity/login"
                    ),
                    objectMapper = objectMapper,
                    sessionStore = sessionStore,
                )
                order = 2
            }
}
