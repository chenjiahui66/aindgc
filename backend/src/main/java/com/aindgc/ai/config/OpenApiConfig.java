package com.aindgc.ai.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI aindgcOpenAPI() {
        return new OpenAPI().info(new Info()
            .title("Aindgc API")
            .description("Aindgc - AI Product Lab backend API")
            .version("0.1.0")
            .contact(new Contact().name("Aindgc").url("https://aindgc.com"))
            .license(new License().name("MIT").url("https://opensource.org/licenses/MIT"))
        );
    }
}
