package me.aburke.urlshortener.identity.register.store

data class UserModel(
    val id: String,
    val username: String,
    val canonicalUsername: String,
    val password: String,
)
