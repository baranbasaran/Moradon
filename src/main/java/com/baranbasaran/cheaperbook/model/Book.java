package com.baranbasaran.cheaperbook.model;

import com.baranbasaran.cheaperbook.common.model.BaseEntity;
import com.baranbasaran.cheaperbook.enums.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Filter;

import java.math.BigDecimal;

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
    private String genre;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String owner;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status; // added status field
}
