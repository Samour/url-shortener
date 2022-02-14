package me.aburke.urlshortener.identity.authentication.service

import me.aburke.urlshortener.identity.authentication.store.SessionModel
import me.aburke.urlshortener.logging.LoggingContext

interface ActiveSessionLoader {

    fun loadActiveSession(sessionId: String, loggingContext: LoggingContext): SessionModel?
}
