package com.baranbasaran.cheaperbook.dto.request.book;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookRequest {

    private Long id;

    private String title;

    private String author;

    private List<String> genre;

    @Size(min = 1, max = 1000, message = "must be between 1 and 1000 characters")
    private String description;

    @DecimalMin(value = "0.0", message = "must be greater than 0")
    private BigDecimal price;

    @Pattern(regexp = "^[0-9-]{10,17}$", message = "must be a valid ISBN-10 or ISBN-13 format")
    private String isbn;

}