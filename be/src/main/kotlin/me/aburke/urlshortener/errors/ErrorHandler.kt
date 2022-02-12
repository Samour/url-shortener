package me.aburke.urlshortener.errors

import me.aburke.urlshortener.logging.LoggingContext
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import javax.servlet.http.HttpServletRequest

@ControllerAdvice("me.aburke.urlshortener")
class ErrorHandler {

    companion object {
        private val logger = LoggerFactory.getLogger(ErrorHandler::class.java)
    }

    @ExceptionHandler(ValidationError::class)
    fun handleValidationError(e: ValidationError, request: HttpServletRequest): ResponseEntity<ErrorResponse> =
        ErrorResponse(
            errorType = "ValidationError",
            errorCode = e.errorCode,
        ).also { logError(request, it) { logger.warn("ValidationError encountered", e) } }
            .let { ResponseEntity.badRequest().body(it) }

    @ExceptionHandler(LoginFailureError::class)
    fun handleLoginFailure(e: LoginFailureError, request: HttpServletRequest): ResponseEntity<ErrorResponse> =
        ErrorResponse(
            errorType = "LoginFailure",
            errorCode = "login_failure",
        ).also { logError(request, it) { logger.info("Login attempt failed") } }
            .let { ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(it) }

    @ExceptionHandler(Throwable::class)
    fun handleException(e: Throwable, request: HttpServletRequest): ResponseEntity<ErrorResponse> =
        ErrorResponse(
            errorType = e.javaClass.simpleName,
            errorCode = "unknown_error",
        ).also { logError(request, it) { logger.error("Unhandled exception occurred", e) } }
            .let { ResponseEntity.internalServerError().body(it) }

    private fun logError(request: HttpServletRequest, errorResponse: ErrorResponse, logAction: () -> Unit) {
        request.getAttribute("loggingContext")?.let {
            (it as? LoggingContext)?.withAttributes(
                mapOf(
                    "errorType" to errorResponse.errorType,
                    "errorCode" to errorResponse.errorCode,
                )
            )?.writeLog(logAction)
        }
    }
}
