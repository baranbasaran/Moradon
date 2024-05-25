package com.baranbasaran.cheaperbook.model;

import com.baranbasaran.cheaperbook.common.model.BaseEntity;
import com.baranbasaran.cheaperbook.enums.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Filter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Entity(name = "books")
@Table(name = "books")
@Filter(name = "deletedFilter", condition = "deleted = false")
public class Book extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private List<String> genre;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private String owner;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column
    private String isbn;

    @Column
    private String coverImage;

    @Column
    private String publisher;

    @Column
    private Integer publicationYear;
}
