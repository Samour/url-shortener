package me.aburke.urlshortener.store

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import java.net.URI

@Configuration
class DynamoConfig {

    @Bean
    fun dynamoDbClient(dynamoProperties: DynamoProperties) = DynamoDbClient.builder()
        .apply {
            dynamoProperties.url?.let {
                endpointOverride(URI(it))
            }
        }.build()
}
