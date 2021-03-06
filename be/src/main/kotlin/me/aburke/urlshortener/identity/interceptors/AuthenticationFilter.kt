package me.aburke.urlshortener.identity.interceptors

import com.fasterxml.jackson.databind.ObjectMapper
import me.aburke.urlshortener.errors.ErrorResponse
import me.aburke.urlshortener.identity.IdentityConsts.SESSION_COOKIE_KEY
import me.aburke.urlshortener.identity.authentication.service.SessionCache
import me.aburke.urlshortener.logging.LoggingContext
import me.aburke.urlshortener.timer.Timer
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.util.AntPathMatcher
import javax.servlet.Filter
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class AuthenticationFilter(
    private val excludePaths: Collection<String>,
    private val objectMapper: ObjectMapper,
    private val sessionCache: SessionCache,
) : Filter {

    companion object {
        private val logger = LoggerFactory.getLogger(AuthenticationFilter::class.java)
    }

    private val antPathMatcher = AntPathMatcher()

    override fun doFilter(request: ServletRequest?, response: ServletResponse?, chain: FilterChain?) {
        val timer = Timer.start()
        val loggingContext = request?.getAttribute("loggingContext") as LoggingContext
        val path = (request as? HttpServletRequest)?.servletPath
        if (path != null && excludePaths.any { antPathMatcher.match(it, path) }) {
            loggingContext.with("AuthenticationFilter.time" to timer.get().toString())
                .writeLog {
                    logger.debug("Endpoint is excluded from authorization; skipping authorization")
                }
            chain?.doFilter(request, response)
            return
        }

        val sessionId = (request as? HttpServletRequest)?.cookies
            ?.firstOrNull { it.name == SESSION_COOKIE_KEY }
            ?.value

        if (sessionId == null) {
            loggingContext.with("AuthenticationFilter.time" to timer.get().toString())
                .writeLog { logger.debug("Session cookie absent; denying access") }
            writeUnauthorizedResponse(response)
            return
        }

        val session = sessionCache.loadActiveSession(sessionId, loggingContext)
        if (session == null) {
            loggingContext.with("AuthenticationFilter.time" to timer.get().toString())
                .writeLog { logger.debug("Session key not found; denying access") }
            writeUnauthorizedResponse(response)
            return
        }

        val updatedLoggingContext = loggingContext.withAttributes(
            mapOf(
                "sessionId" to session.sessionId.take(8),
                "userId" to session.userId,
                "username" to session.username,
            )
        )
        request.setAttribute("loggingContext", updatedLoggingContext)
        request.setAttribute("session", session)
        updatedLoggingContext.with("AuthenticationFilter.time" to timer.get().toString())
            .writeLog { logger.debug("User authenticated; proceeding to controller") }

        chain?.doFilter(request, response)
    }

    private fun writeUnauthorizedResponse(response: ServletResponse?) {
        (response as? HttpServletResponse)?.apply {
            status = HttpStatus.UNAUTHORIZED.value()
            objectMapper.writeValue(
                outputStream,
                ErrorResponse(
                    errorType = "AuthorizationFailure",
                    errorCode = "bad_session_id",
                )
            )
        }
    }
}
