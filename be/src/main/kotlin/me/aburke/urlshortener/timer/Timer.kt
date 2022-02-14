package me.aburke.urlshortener.timer

import java.time.Duration
import java.time.Instant

class Timer(private val start: Instant) {

    companion object {
        fun start() = Timer(Instant.now())
    }

    fun get() = Duration.between(start, Instant.now()).toMillis()
}
