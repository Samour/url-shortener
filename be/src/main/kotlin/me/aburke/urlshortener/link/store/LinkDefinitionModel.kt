package me.aburke.urlshortener.link.store

data class LinkDefinitionModel(
    val userId: String,
    val id: String,
    val label: String,
    val pathName: String,
    val status: LinkStatus,
    val linkTarget: String,
)
