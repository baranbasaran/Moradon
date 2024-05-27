package com.baranbasaran.cheaperbook.service;

import com.baranbasaran.cheaperbook.client.GoogleBookApiClient;
import com.baranbasaran.cheaperbook.controller.request.BookRequest;
import com.baranbasaran.cheaperbook.controller.request.CreateBookRequest;
import com.baranbasaran.cheaperbook.controller.request.UpdateBookRequest;
import com.baranbasaran.cheaperbook.dto.BookDto;
import com.baranbasaran.cheaperbook.enums.Status;
import com.baranbasaran.cheaperbook.exception.BookNotFoundException;
import com.baranbasaran.cheaperbook.model.Book;
import com.baranbasaran.cheaperbook.repository.BookRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookService {
    private final GoogleBookApiClient bookApiClient;
    private final BookRepository bookRepository;

    public List<BookDto> findAll() {
        return bookRepository.findAll().stream().map(BookDto::from).toList();
    }

    public BookDto findById(Long id) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new BookNotFoundException(id));
        return BookDto.from(book);
    }

    public BookDto create(CreateBookRequest bookRequest) {
        return BookDto.from(merge(bookRequest));
    }

    public BookDto update(Long id, UpdateBookRequest bookRequest) {
        bookRequest.setId(id);
        return BookDto.from(merge(bookRequest));
    }

    public void delete(Long id) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new BookNotFoundException(id));
        book.setDeleted(true);
        bookRepository.save(book);
    }

    @Transactional
    private Book merge(BookRequest request) {
        Book book = null;
        if (request.getId() != null) {
            book = bookRepository.findById(request.getId())
                    .orElseThrow(() -> new BookNotFoundException(request.getId()));
        }
        if (book == null) {
            book = getBookFromApi(request.getIsbn());
        }
        book.setIsbn(request.getIsbn());
        book.setOwner(request.getOwner());
        book.setPrice(request.getPrice());
        book.setStatus(Status.AVAILABLE);
        return bookRepository.save(book);
    }

    private Book getBookFromApi(String isbn) {
        Optional<Book> book = bookApiClient.getBookByIsbn(isbn).getBook();
        return book.orElse(new Book());
    }
}
