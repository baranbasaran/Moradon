package com.baranbasaran.cheaperbook.exception;

import com.baranbasaran.cheaperbook.controller.dto.ErrorResponse;
import com.baranbasaran.cheaperbook.controller.dto.Response;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ApiException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Response<ErrorResponse> handleApiException(ApiException e) {
        return Response.error(new ErrorResponse.Builder()
                .errorCode(e.getErrorCode())
                .errorMessage(e.getMessage())
                .build());
    }
}