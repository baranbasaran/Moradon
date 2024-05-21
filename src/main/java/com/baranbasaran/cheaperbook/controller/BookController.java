package com.baranbasaran.cheaperbook.controller;

import com.baranbasaran.cheaperbook.controller.dto.Response;
import com.baranbasaran.cheaperbook.controller.request.BookRequest;
import com.baranbasaran.cheaperbook.controller.request.CreateBookRequest;
import com.baranbasaran.cheaperbook.controller.request.UpdateBookRequest;
import com.baranbasaran.cheaperbook.model.Book;
import com.baranbasaran.cheaperbook.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public Response<List<Book>> getBooks() {
        return Response.success(bookService.findAll());
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Response<Book> getBookById(@PathVariable Long id) {
        return Response.success(bookService.findById(id));
    }

    @PostMapping
    public Response<Book> addBook(@RequestBody @Validated CreateBookRequest bookRequest) {
        return Response.success(bookService.create(bookRequest));
    }

    @PutMapping("/{id}")
    public Response<Book> updateBook(@PathVariable Long id, @RequestBody @Validated BookRequest bookRequest) {
        UpdateBookRequest updatedBookRequest = (UpdateBookRequest) bookRequest;
        updatedBookRequest.setId(id);
        return Response.success(bookService.update(updatedBookRequest));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Response<Void> deleteBook(@PathVariable Long id) {
        bookService.delete(id);
        return Response.success(null);
    }
}