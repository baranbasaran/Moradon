package com.example.CheaperBook;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.example.CheaperBook.Model")
@EnableJpaRepositories("com.example.CheaperBook.Repository")

public class CheaperBookApplication {

	public static void main(String[] args) {
		SpringApplication.run(CheaperBookApplication.class, args);
	}
}