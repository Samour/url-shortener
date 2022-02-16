package me.aburke.urlshortener.link.dto

import me.aburke.urlshortener.link.store.LinkStatus

data class UpdateLinkStatusRequest(val status: LinkStatus)
