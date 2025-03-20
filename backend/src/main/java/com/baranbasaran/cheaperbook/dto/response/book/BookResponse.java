package com.baranbasaran.cheaperbook.dto.response.book;

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
public class BookResponse {
    private Long id;
    private String title;
    private String author;
    private List<String> genre;
    private String description;
    private BigDecimal price;
    private String isbn;
    private String coverImageUrl;
    private String publisher;
    private Integer publishYear;
    private String condition;
    private String location;
    private String category;
    private String language;
    private Integer pageCount;
    private String username;
    private String profilePicture;

    public static BookResponse from(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .genre(book.getGenre())
                .description(book.getDescription())
                .price(book.getPrice())
                .isbn(book.getIsbn())
                .coverImageUrl(book.getCoverImageUrl())
                .publisher(book.getPublisher())
                .publishYear(book.getPublishYear())
                .username(book.getOwner() != null ? book.getOwner().getUsername() : null)
                .profilePicture(book.getOwner() != null ? book.getOwner().getAvatarUrl() : null)
                .build();
    }
} 