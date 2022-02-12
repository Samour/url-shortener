package me.aburke.urlshortener.logging

interface LoggingContext {

    operator fun plus(append: Pair<String, String?>): LoggingContext

    operator fun plus(append: Map<String, String?>): LoggingContext

    fun with(append: Pair<String, String?>): LoggingContext

    fun with(append: Map<String, String?>): LoggingContext

    fun withAttribute(append: Pair<String, String?>): LoggingContext

    fun withAttributes(append: Map<String, String?>): LoggingContext

    fun writeLog(logInstruction: () -> Unit)
}
