package com.baranbasaran.cheaperbook.model;

import com.baranbasaran.cheaperbook.common.model.BaseEntity;
import com.baranbasaran.cheaperbook.dto.response.book.BookResponse;
import com.baranbasaran.cheaperbook.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity(name = "books")
@Table(name = "books")
@Where(clause = "deleted = false")
public class Book extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @ElementCollection
    @Column(nullable = false)
    private List<String> genre;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column
    private String isbn;

    @Column
    private String coverImageUrl;

    @Column
    private String publisher;

    @Column
    private Integer publishYear;

    @Column(name = "`condition`")
    private String condition;

    @Column
    private String location;

    @Column
    private String category;

    @Column
    private String language;

    @Column
    private Integer pageCount;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public void transferOwnership(User newOwner) {
        this.owner = newOwner;
    }

    public Book mergeFromDto(BookResponse book) {
        if (book.getTitle() != null) this.title = book.getTitle();
        if (book.getAuthor() != null) this.author = book.getAuthor();
        if (book.getGenre() != null) this.genre = book.getGenre();
        if (book.getDescription() != null) this.description = book.getDescription();
        if (book.getPrice() != null) this.price = book.getPrice();
        if (book.getIsbn() != null) this.isbn = book.getIsbn();
        if (book.getCoverImageUrl() != null) this.coverImageUrl = book.getCoverImageUrl();
        if (book.getPublisher() != null) this.publisher = book.getPublisher();
        if (book.getPublishYear() != null) this.publishYear = book.getPublishYear();
        if (book.getCondition() != null) this.condition = book.getCondition();
        if (book.getLocation() != null) this.location = book.getLocation();
        if (book.getCategory() != null) this.category = book.getCategory();
        if (book.getLanguage() != null) this.language = book.getLanguage();
        if (book.getPageCount() != null) this.pageCount = book.getPageCount();
        return this;
    }

    public boolean isValid() {
        return this.getTitle() != null && !this.getTitle().trim().isEmpty() &&
               this.getAuthor() != null && !this.getAuthor().trim().isEmpty() &&
               this.getPrice() != null && this.getPrice().compareTo(BigDecimal.ZERO) > 0 &&
               this.getIsbn() != null && !this.getIsbn().trim().isEmpty() &&
               this.getGenre() != null && !this.getGenre().isEmpty() &&
               this.getDescription() != null && !this.getDescription().trim().isEmpty();
    }
}
