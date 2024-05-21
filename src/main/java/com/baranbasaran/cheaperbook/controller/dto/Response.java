package com.baranbasaran.cheaperbook.controller.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor
public class Response<T> {
    private T data;

    private Response(T data) {
        this.data = data;
    }

    public static <T> Response<T> success(T data) {
        return new Response<>(data);
    }

    public static <T> Response<T> error(T data) {
        return new Response<>(data);
    }

    public static <T> Response<ErrorResponse> error(ErrorResponse errors) {
        return new Response<>(errors);
    }
}