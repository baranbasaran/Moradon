package com.baranbasaran.cheaperbook.exception;

public class BookNotFoundException extends RuntimeException {
    public BookNotFoundException(Long id) {
        super("Book not found with ID: " + id);
    }

    public BookNotFoundException(String message) {
        super(message);
    }
}
