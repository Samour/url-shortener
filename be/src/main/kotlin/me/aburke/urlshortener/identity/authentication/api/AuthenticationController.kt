package me.aburke.urlshortener.identity.authentication.api

import me.aburke.urlshortener.identity.IdentityConsts.SESSION_COOKIE_KEY
import me.aburke.urlshortener.identity.authentication.dto.AuthInfoResponse
import me.aburke.urlshortener.identity.authentication.dto.LoginRequest
import me.aburke.urlshortener.identity.authentication.dto.LoginResponse
import me.aburke.urlshortener.identity.authentication.service.SessionService
import me.aburke.urlshortener.identity.authentication.store.SessionModel
import me.aburke.urlshortener.logging.LoggingContext
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import javax.servlet.http.Cookie
import javax.servlet.http.HttpServletResponse

@RestController
@RequestMapping("/v1/identity")
class AuthenticationController(private val sessionService: SessionService) {

    companion object {
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
            loggingContext = contextWithAction,
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

    @GetMapping("/info")
    fun getAuthInfo(
        @RequestAttribute("loggingContext") loggingContext: LoggingContext,
        @RequestAttribute("session") session: SessionModel,
    ): AuthInfoResponse {
        loggingContext.withAttribute("apiAction" to "getAuthInfo")
            .writeLog { logger.info("Sending authentication info back to user") }

        return AuthInfoResponse(
            userId = session.userId,
            username = session.username,
        )
    }
}
