package com.baranbasaran.cheaperbook.exception;

import com.baranbasaran.cheaperbook.common.exceptionhandling.exception.ApiException;
import org.springframework.http.HttpStatus;

public class PostNotFoundException extends ApiException {


    public PostNotFoundException(Long id) {
        super("POST_NOT_FOUND", "Post with id %d not found.".formatted(id), HttpStatus.NOT_FOUND);
    }
}
