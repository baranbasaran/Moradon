package com.baranbasaran.cheaperbook.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${cors.allowed-origins:http://localhost:3000,http://localhost:3001}")
    private String[] allowedOrigins;

    @Value("${cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS,PATCH}")
    private String[] allowedMethods;

    @Value("${cors.allowed-headers:*}")
    private String[] allowedHeaders;

    @Value("${cors.exposed-headers:Authorization,Link,X-Total-Count,X-${spring.application.name}-alert,X-${spring.application.name}-error,X-${spring.application.name}-params}")
    private String[] exposedHeaders;

    @Value("${cors.max-age:1800}")
    private Long maxAge;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/v1/**")  // More specific mapping for your API endpoints
            .allowedOrigins(allowedOrigins)
            .allowedMethods(allowedMethods)
            .allowedHeaders(allowedHeaders)
            .exposedHeaders(exposedHeaders)
            .allowCredentials(true)
            .maxAge(maxAge);

        // Add a separate mapping for auth endpoints if needed
        registry.addMapping("/v1/auth/**")
            .allowedOrigins(allowedOrigins)
            .allowedMethods("POST", "OPTIONS")  // Restrict methods for auth endpoints
            .allowedHeaders(allowedHeaders)
            .exposedHeaders(exposedHeaders)
            .allowCredentials(true)
            .maxAge(maxAge);
    }
} 