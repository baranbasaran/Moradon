package com.baranbasaran.cheaperbook.controller.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookRequest {

    private Long id;

    @NotEmpty(message = "cannot be empty")
    private String title;

    @NotEmpty(message = "cannot be empty")
    private String author;

    @NotEmpty(message = "cannot be empty")
    private String genre;

    @NotEmpty(message = "cannot be empty")
    @Size(min = 1, max = 1000, message = " must be between 1 and 1000 characters")
    private String description;

    @NotEmpty(message = "cannot be empty")
    private String owner;

    @DecimalMin(value = "0.0", message = "must be greater than 0")
    private BigDecimal price;
}
