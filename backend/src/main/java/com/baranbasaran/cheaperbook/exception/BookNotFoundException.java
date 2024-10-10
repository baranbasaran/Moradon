package com.baranbasaran.cheaperbook.exception;

import com.baranbasaran.cheaperbook.common.exceptionhandling.exception.ApiException;
import org.springframework.http.HttpStatus;

public class BookNotFoundException extends ApiException {
    public BookNotFoundException(Long id) {
        super("BOOK_NOT_FOUND", "Book with id %d not found.".formatted(id), HttpStatus.NOT_FOUND);
    }
}
