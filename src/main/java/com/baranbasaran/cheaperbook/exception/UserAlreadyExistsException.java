package com.baranbasaran.cheaperbook.exception;

import com.baranbasaran.cheaperbook.common.exceptionhandling.exception.ApiException;
import org.springframework.http.HttpStatus;

public class UserAlreadyExistsException extends ApiException {
    public UserAlreadyExistsException(String message) {
        super("USER_ALREADY_EXISTS", message, HttpStatus.BAD_REQUEST);
    }
}