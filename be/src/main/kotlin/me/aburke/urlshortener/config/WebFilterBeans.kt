package me.aburke.urlshortener.config

import com.fasterxml.jackson.databind.ObjectMapper
import me.aburke.urlshortener.identity.authentication.service.SessionCache
import me.aburke.urlshortener.identity.interceptors.AuthenticationFilter
import me.aburke.urlshortener.logging.LoggingFilter
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter

@Configuration
class WebFilterBeans {

    @Bean
    fun loggingFilter() = FilterRegistrationBean<LoggingFilter>()
        .apply {
            filter = LoggingFilter()
            order = 1
            urlPatterns = listOf("/*")
        }

    @Bean
    fun corsFilter(corsConfig: CorsConfig) = CorsConfiguration()
        .apply {
            allowedOrigins = corsConfig.allowedOrigins
            addAllowedMethod("*")
            addAllowedHeader("*")
            allowCredentials = true
        }.let {
            val source = UrlBasedCorsConfigurationSource()
            source.registerCorsConfiguration("/**", it)
            FilterRegistrationBean(CorsFilter(source))
        }.apply { order = 2 }

    @Bean
    fun authorizationFilter(objectMapper: ObjectMapper, sessionCache: SessionCache) =
        FilterRegistrationBean<AuthenticationFilter>()
            .apply {
                filter = AuthenticationFilter(
                    excludePaths = listOf(
                        "/v1/identity/register",
                        "/v1/identity/login",
                        "/actuator/*",
                    ),
                    objectMapper = objectMapper,
                    sessionCache = sessionCache,
                )
                order = 3
            }
}
