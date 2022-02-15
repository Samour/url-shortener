package me.aburke.urlshortener.store

import me.aburke.urlshortener.identity.register.store.UserStore
import me.aburke.urlshortener.logging.LoggingContextImpl
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration
import javax.annotation.PostConstruct

@Configuration
class WarmDb {

    @Autowired
    lateinit var userStore: UserStore

    @PostConstruct
    fun warmDbConnection() {
        userStore.findUserByUsername(
            "not-a-user",
            LoggingContextImpl(mapOf("action" to "warmDb")),
        )
    }
}