package com.baranbasaran.cheaperbook.controller;

import com.baranbasaran.cheaperbook.common.dto.Response;
import com.baranbasaran.cheaperbook.controller.request.Book.CreateBookRequest;
import com.baranbasaran.cheaperbook.controller.request.Book.UpdateBookRequest;
import com.baranbasaran.cheaperbook.dto.BookDto;
import com.baranbasaran.cheaperbook.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/users/{userId}/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping("/api/search")
    public Response<BookDto> getBookByIsbn(@RequestParam String isbn) {
        return Response.success(bookService.getBookByIsbn(isbn));
    }
    @GetMapping
    public Response<List<BookDto>> getBooksByUserId(@PathVariable Long userId) {
        return Response.success(bookService.findAllBooksByUserId(userId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Response<BookDto> createBookForUser(@PathVariable Long userId, @RequestBody @Valid CreateBookRequest bookRequest) {
        return Response.success(bookService.addBookUser(userId, bookRequest));
    }

    @GetMapping("{bookId}")
    public Response<BookDto> getBookByUserIdAndBookId(@PathVariable Long userId, @PathVariable Long bookId) {
        return Response.success(bookService.findBookByIdAndUserId(bookId, userId));
    }


    @PutMapping("{bookId}")
    public Response<BookDto> updateBookForUser(@PathVariable Long userId, @PathVariable Long bookId, @RequestBody @Valid UpdateBookRequest bookRequest) {
        return Response.success(bookService.updateBookForUser(bookId, bookRequest));
    }

    @DeleteMapping("{bookId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBookForUser(@PathVariable Long userId, @PathVariable Long bookId) {
        bookService.deleteBookForUser(userId, bookId);
    }

}