package me.aburke.urlshortener.link.dto

import me.aburke.urlshortener.link.store.LinkStatus

data class UpdateLinkRequest(
    val label: String?,
    val status: LinkStatus?,
)
