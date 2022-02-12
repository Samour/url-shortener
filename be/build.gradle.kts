import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "2.5.5"
    id("io.spring.dependency-management") version "1.0.11.RELEASE"
    kotlin("jvm") version "1.5.31"
    kotlin("plugin.spring") version "1.5.31"
}

group = "me.aburke.urlshortener"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_11

allprojects {
    repositories {
        mavenCentral()
    }

    tasks.withType<KotlinCompile> {
        kotlinOptions {
            freeCompilerArgs = listOf("-Xjsr305=strict")
            jvmTarget = "11"
        }
    }

//	tasks.withType<Test> {
//		useJUnitPlatform()
//	}
}

sourceSets {
    create("localUtils") {
        compileClasspath += sourceSets.main.get().output
        runtimeClasspath += sourceSets.main.get().output
    }
}

configurations.getByName("localUtilsImplementation")
    .extendsFrom(configurations.implementation.get())
configurations.getByName("localUtilsRuntimeOnly")
    .extendsFrom(configurations.runtimeOnly.get())

task<JavaExec>("createTables") {
    dependsOn(tasks.getByName("classes"))
    dependsOn(tasks.getByName("localUtilsClasses"))
    classpath = sourceSets["localUtils"].runtimeClasspath
    environment["SERVICE_NAME"] = "urls-local"
    environment["DYNAMODB_ENDPOINT"] = "http://localhost:8000"
    mainClass.set("me.aburke.urlshortener.store.CreateTablesKt")
}

task("writeVersionFile") {
    doLast {
        val version = System.getenv("VERSION") ?: "no_version"
        file("$projectDir/src/main/resources/version.properties").writeText("version=$version")
    }
}
tasks.processResources.get().dependsOn("writeVersionFile")

dependencies {
    // Kotlin
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

    // Spring
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-security")

    // Logging
    implementation("ch.qos.logback.contrib:logback-json-classic:0.1.5")
    implementation("ch.qos.logback.contrib:logback-jackson:0.1.5")
    implementation("net.logstash.logback:logstash-logback-encoder:7.0.1")

    // AWS
    implementation("software.amazon.awssdk:dynamodb:2.17.128")
}
