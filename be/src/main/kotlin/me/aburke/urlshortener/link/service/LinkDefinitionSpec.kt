package me.aburke.urlshortener.link.service

import me.aburke.urlshortener.link.store.LinkStatus

data class LinkDefinitionSpec(
    val label: String,
    val status: LinkStatus,
    val linkTarget: String,
)
