package com.baranbasaran.cheaperbook.common.exceptionhandling;

import com.baranbasaran.cheaperbook.common.dto.ErrorResponse;
import com.baranbasaran.cheaperbook.common.exceptionhandling.exception.ApiException;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    @ResponseBody
    public ResponseEntity<ErrorResponse> handleApiException(ApiException e) {
        return ResponseEntity.status(e.getHttpStatus())
            .body(new ErrorResponse(e.getErrorCode(), List.of(e.getErrorMessage())));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(Exception e) {
        if (e instanceof MethodArgumentNotValidException) {
            return ResponseEntity.badRequest().body(new ErrorResponse("BAD_REQUEST",
                    getErrors((MethodArgumentNotValidException) e)));
        }
        return ResponseEntity.internalServerError()
            .body(new ErrorResponse("INTERNAL_SERVER_ERROR",
                List.of("An error occurred. Please try again later.")));
    }

    private List<String> getErrors(MethodArgumentNotValidException e) {
        return e.getBindingResult().getAllErrors().stream()
            .map(error -> ((FieldError) error).getField() + " " + error.getDefaultMessage())
            .toList();
    }
}