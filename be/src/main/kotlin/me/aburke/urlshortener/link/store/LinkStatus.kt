package me.aburke.urlshortener.link.store

enum class LinkStatus(val routeStatus: LinkRouteStatus) {
    ACTIVE(LinkRouteStatus.ACTIVE),
    INACTIVE(LinkRouteStatus.INACTIVE),
}
