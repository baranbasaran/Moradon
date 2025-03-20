package com.baranbasaran.cheaperbook.service;

import com.baranbasaran.cheaperbook.dto.request.book.CreateBookRequest;
import com.baranbasaran.cheaperbook.dto.request.book.UpdateBookRequest;
import com.baranbasaran.cheaperbook.dto.response.book.BookResponse;
import com.baranbasaran.cheaperbook.model.Book;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BookService {
    BookResponse createBook(CreateBookRequest request);
    BookResponse findBookById(Long id);
    Page<BookResponse> getAllBooks(int page, int size);
    BookResponse updateBook(Long id, UpdateBookRequest request);
    void deleteBook(Long id);
    BookResponse addBookUser(Long bookId, Long userId);
    BookResponse findBookByIdAndUserId(Long bookId, Long userId);
    void deleteBookForUser(Long bookId, Long userId);
    Book findBookByIsbn(String isbn);
    Page<BookResponse> searchBooks(String query, int page, int size);
    BookResponse updateBookForUser(Long bookId, UpdateBookRequest request);
    List<BookResponse> findAllBooksByUserId(Long userId);
}
