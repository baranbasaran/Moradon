package com.baranbasaran.cheaperbook.controller.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class BookRequest {

    private Long id;

    @NonNull
    private String title;

    @NonNull
    private String author;

    @NonNull
    private String genre;

    @NonNull
    private String description;

    @NonNull
    private String owner;

    @NonNull
    private Integer price;
}
