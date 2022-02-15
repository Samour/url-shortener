package me.aburke.urlshortener.link.service

import java.security.SecureRandom

private fun intToChar(i: Int): Char =
    if (i < 26) {
        'a' + i
    } else {
        'A' + (i - 26)
    }

fun generatePathName(): String {
    val random = SecureRandom()
    return (0..9)
        .map { random.nextInt(52) }
        .map { intToChar(it) }
        .joinToString(separator = "")
}
