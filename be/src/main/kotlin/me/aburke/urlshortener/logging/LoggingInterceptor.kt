package me.aburke.urlshortener.logging

import org.slf4j.LoggerFactory
import java.util.*
import javax.servlet.Filter
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class LoggingInterceptor : Filter {

    companion object {
        private val logger = LoggerFactory.getLogger(LoggingInterceptor::class.java)
    }

    override fun doFilter(request: ServletRequest?, response: ServletResponse?, chain: FilterChain?) {
        val canonicalContext = LoggingContextImpl(
            mutableMapOf(
                "traceId" to UUID.randomUUID().toString(),
                "endpoint" to (request as? HttpServletRequest)?.servletPath,
            )
        )
        val loggingContext = LoggingContextImpl(canonicalContext = canonicalContext)
        request?.setAttribute("loggingContext", loggingContext)

        canonicalContext.writeLog { logger.info("HTTP Request received") }

        try {
            chain?.doFilter(request, response)
        } finally {
            canonicalContext.with(
                "responseCode" to (response as? HttpServletResponse)?.status?.toString()
            ).writeLog { logger.info("Request handling completed") }
        }
    }
}
