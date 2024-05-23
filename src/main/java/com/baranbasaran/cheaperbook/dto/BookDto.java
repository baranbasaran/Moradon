package com.baranbasaran.cheaperbook.dto;

import com.baranbasaran.cheaperbook.model.Book;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookDto {
    private Long id;
    private String title;
    private String author;
    private List<String> genre;
    private String description;
    private String owner;
    private BigDecimal price;

    public static BookDto from(Book book) {
        return BookDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .genre(book.getGenre())
                .description(book.getDescription())
                .owner(book.getOwner())
                .price(book.getPrice())
                .build();
    }
}