package me.aburke.urlshortener.identity.authentication.store

import java.time.Instant

data class SessionModel(
    val sessionId: String,
    val userId: String,
    val username: String,
    val createdAt: Instant,
)
