package me.aburke.urlshortener.identity.authentication.api

import me.aburke.urlshortener.identity.authentication.dto.LoginRequest
import me.aburke.urlshortener.identity.authentication.dto.LoginResponse
import me.aburke.urlshortener.identity.authentication.service.SessionService
import me.aburke.urlshortener.logging.LoggingContext
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import javax.servlet.http.Cookie
import javax.servlet.http.HttpServletResponse

@RestController
@RequestMapping("/v1/identity")
class AuthenticationController(private val sessionService: SessionService) {

    companion object {
        private const val SESSION_COOKIE_KEY = "SessionId"

        private val logger = LoggerFactory.getLogger(AuthenticationController::class.java)
    }

    @PostMapping("/login")
    fun logIn(
        @RequestAttribute("loggingContext") loggingContext: LoggingContext,
        @RequestBody loginRequest: LoginRequest,
        httpResponse: HttpServletResponse,
    ): LoginResponse {
        val contextWithAction = loggingContext.withAttribute("apiAction" to "login")
        contextWithAction.writeLog { logger.info("API call received to log in") }

        return sessionService.createSession(
            username = loginRequest.username,
            password = loginRequest.password,
            loggingContext = loggingContext,
        ).also { httpResponse.addCookie(createSessionCookie(it.sessionId)) }
            .let {
                LoginResponse(
                    userId = it.userId,
                    username = it.username,
                )
            }
    }

    private fun createSessionCookie(sessionId: String): Cookie =
        Cookie(SESSION_COOKIE_KEY, sessionId)
            .apply {
                secure = true
                isHttpOnly = true
            }
}
