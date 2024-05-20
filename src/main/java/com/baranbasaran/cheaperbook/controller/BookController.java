package com.baranbasaran.cheaperbook.controller;

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
    public List<Book> getBooks() {
        return bookService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Book getBookById(@PathVariable Long id) {
        return bookService.findById(id);
    }

    @PostMapping
    public Book addBook(@RequestBody @Validated CreateBookRequest bookRequest) {
        return bookService.create(bookRequest);
    }

    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody @Validated BookRequest bookRequest) {
        UpdateBookRequest updatedBookRequest = (UpdateBookRequest) bookRequest;
        updatedBookRequest.setId(id);
        return bookService.update(updatedBookRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBook(@PathVariable Long id) {
        bookService.delete(id);
    }
}