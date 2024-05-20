package com.baranbasaran.cheaperbook.service;

import com.baranbasaran.cheaperbook.model.Book;
import com.baranbasaran.cheaperbook.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public List<Book> getBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElse(null);
    }

    public Book addBook(Book newBook) {
        return bookRepository.save(newBook);
    }

    public Book updateBook(Long id, Book updatedBook) {
        return bookRepository.findById(id)
                .map(book -> {
                    book.setTitle(updatedBook.getTitle());
                    book.setAuthor(updatedBook.getAuthor());
                    book.setGenre(updatedBook.getGenre());
                    book.setPrice(updatedBook.getPrice());
                    book.setDescription(updatedBook.getDescription());
                    book.setOwner(updatedBook.getOwner());
                    book.setStatus(updatedBook.getStatus());
                    return bookRepository.save(book);
                })
                .orElseGet(() -> {
                    updatedBook.setId(id);
                    return bookRepository.save(updatedBook);
                });
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}
