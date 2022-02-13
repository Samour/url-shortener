package me.aburke.urlshortener.logging

import org.slf4j.LoggerFactory
import java.util.*
import javax.servlet.Filter
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class LoggingFilter : Filter {

    companion object {
        private val logger = LoggerFactory.getLogger(LoggingFilter::class.java)
    }

    override fun doFilter(request: ServletRequest?, response: ServletResponse?, chain: FilterChain?) {
        val attributes = mapOf(
            "traceId" to UUID.randomUUID().toString(),
            "endpoint" to (request as? HttpServletRequest)?.servletPath,
        )
        val canonicalContext = LoggingContextImpl(attributes)
        val loggingContext = LoggingContextImpl(
            details = attributes,
            canonicalContext = canonicalContext,
        )
        request?.setAttribute("loggingContext", loggingContext)

        val additionalDetails = mapOf(
            "httpMethod" to (request as? HttpServletRequest)?.method,
            "webOrigin" to (request as? HttpServletRequest)?.getHeader("Origin"),
        );
        canonicalContext.with(additionalDetails)
            .writeLog { logger.info("HTTP Request received") }

        try {
            chain?.doFilter(request, response)
        } finally {
            canonicalContext.with(
                additionalDetails +
                        ("responseCode" to (response as? HttpServletResponse)?.status?.toString())
            ).writeLog { logger.info("Request handling completed") }
        }
    }
}
