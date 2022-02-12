package me.aburke.urlshortener

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
}
