package com.baranbasaran.cheaperbook.contoller;

import com.baranbasaran.cheaperbook.contoller.request.BookRequest;
import com.baranbasaran.cheaperbook.contoller.request.CreateBookRequest;
import com.baranbasaran.cheaperbook.contoller.request.UpdateBookRequest;
import com.baranbasaran.cheaperbook.model.Book;
import com.baranbasaran.cheaperbook.service.BookService;
import lombok.RequiredArgsConstructor;
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
    public Book getBookById(@PathVariable Long id) {
        return bookService.findById(id);
    }

    @PostMapping
    public Book addBook(@RequestBody CreateBookRequest createBookRequest) {
        return bookService.create(createBookRequest);
    }

    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody BookRequest bookRequest) {
        UpdateBookRequest updateBookRequest = (UpdateBookRequest) bookRequest;
        updateBookRequest.setId(id);
        return bookService.update(updateBookRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id) {
        bookService.delete(id);
    }
}