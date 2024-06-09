package com.baranbasaran.cheaperbook.dto;

import com.baranbasaran.cheaperbook.enums.Status;
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
    private String username;
    private String profilePicture;
    private BigDecimal price;
    private Status status;
    private String isbn;
    private String coverImage;
    private String publisher;
    private Integer publicationYear;

    public static BookDto from(Book book) {
        return BookDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .genre(book.getGenre())
                .description(book.getDescription())
                .price(book.getPrice())
                .status(book.getStatus())
                .isbn(book.getIsbn())
                .coverImage(book.getCoverImage())
                .publisher(book.getPublisher())
                .publicationYear(book.getPublicationYear())
                .username(book.getOwner().getUsername())
                .profilePicture(book.getOwner().getProfilePicture())
                .build();
    }
}