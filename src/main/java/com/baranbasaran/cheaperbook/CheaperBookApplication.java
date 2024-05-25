package com.baranbasaran.cheaperbook;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableAutoConfiguration
@EnableFeignClients
public class CheaperBookApplication {

	public static void main(String[] args) {
		SpringApplication.run(CheaperBookApplication.class, args);
	}
}