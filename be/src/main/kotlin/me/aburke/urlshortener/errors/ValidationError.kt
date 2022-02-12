package me.aburke.urlshortener.errors

sealed class ValidationError(val errorCode: String) : Error() {
    object UsernameNotAvailableError : ValidationError("username_not_available")
}
