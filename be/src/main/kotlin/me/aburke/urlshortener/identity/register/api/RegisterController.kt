package me.aburke.urlshortener.identity.register.api

import me.aburke.urlshortener.identity.register.dto.RegisterUserRequest
import me.aburke.urlshortener.identity.register.dto.RegisterUserResponse
import me.aburke.urlshortener.identity.register.service.RegisterUserService
import me.aburke.urlshortener.logging.LoggingContext
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/v1/identity/register")
class RegisterController(private val registerUserService: RegisterUserService) {

    companion object {
        private val logger = LoggerFactory.getLogger(RegisterController::class.java)
    }

    @PostMapping
    fun createUser(
        @RequestAttribute("loggingContext") loggingContext: LoggingContext,
        @RequestBody registerRequest: RegisterUserRequest,
    ): RegisterUserResponse {
        val contextWithAction = loggingContext.withAttribute("apiAction" to "createUser")
        contextWithAction.writeLog { logger.info("API call received to create user") }

        return registerUserService.registerUser(
            username = registerRequest.username,
            rawPassword = registerRequest.password,
            loggingContext = contextWithAction,
        ).let {
            RegisterUserResponse(
                userId = it.id,
                username = it.username,
            )
        }
    }
}
