package me.aburke.urlshortener.logging

import org.slf4j.MDC

class LoggingContextImpl(
    private val details: MutableMap<String, String?> = mutableMapOf(),
    private val canonicalContext: LoggingContextImpl? = null,
) : LoggingContext {

    override fun plus(append: Pair<String, String?>): LoggingContext =
        LoggingContextImpl(details.plus(append).toMutableMap(), canonicalContext)

    override fun plus(append: Map<String, String?>): LoggingContext =
        LoggingContextImpl(details.plus(append).toMutableMap(), canonicalContext)

    override fun with(append: Pair<String, String?>): LoggingContext =
        LoggingContextImpl(details.plus(append).toMutableMap(), canonicalContext)

    override fun with(append: Map<String, String?>): LoggingContext =
        LoggingContextImpl(details.plus(append).toMutableMap(), canonicalContext)

    override fun withAttribute(append: Pair<String, String?>): LoggingContext {
        canonicalContext?.let { it.details[append.first] = append.second }
        return with(append)
    }

    override fun withAttributes(append: Map<String, String?>): LoggingContext {
        canonicalContext?.details?.putAll(append)
        return with(append)
    }

    override fun writeLog(logInstruction: () -> Unit) {
        details.forEach { (k, v) -> MDC.put(k, v) }
        logInstruction()
        details.keys.forEach { k -> MDC.remove(k) }
    }
}
