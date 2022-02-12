package me.aburke.urlshortener.identity.register.api

import me.aburke.urlshortener.identity.register.dto.RegisterUserRequest
import me.aburke.urlshortener.identity.register.dto.RegisterUserResponse
import me.aburke.urlshortener.identity.register.service.RegisterUserService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/identity/register")
class RegisterController(private val registerUserService: RegisterUserService) {

    @PostMapping
    fun createUser(@RequestBody registerRequest: RegisterUserRequest): RegisterUserResponse {
        return registerUserService.registerUser(
            username = registerRequest.username,
            rawPassword = registerRequest.password
        ).let {
            RegisterUserResponse(
                userId = it.id,
                username = it.username,
            )
        }
    }
}
