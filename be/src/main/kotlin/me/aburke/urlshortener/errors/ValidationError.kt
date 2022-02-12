package me.aburke.urlshortener.errors

sealed class ValidationError(val errorCode: String) : RuntimeException() {
    object UsernameNotAvailableError : ValidationError("username_not_available")
}
