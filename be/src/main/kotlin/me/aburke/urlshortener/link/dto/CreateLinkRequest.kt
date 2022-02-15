package me.aburke.urlshortener.link.dto

import me.aburke.urlshortener.link.store.LinkStatus

data class CreateLinkRequest(
    val label: String,
    val status: LinkStatus,
    val linkTarget: String,
)
