package me.aburke.urlshortener.link.dto

import me.aburke.urlshortener.link.store.LinkStatus

data class LinkResponse(
    val id: String,
    val label: String,
    val pathName: String,
    val status: LinkStatus,
    val linkTarget: String,
)
