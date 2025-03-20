package com.baranbasaran.cheaperbook.service.impl;

import com.baranbasaran.cheaperbook.client.GoogleBookApiClient;
import com.baranbasaran.cheaperbook.dto.request.book.CreateBookRequest;
import com.baranbasaran.cheaperbook.dto.request.book.UpdateBookRequest;
import com.baranbasaran.cheaperbook.dto.response.book.BookResponse;
import com.baranbasaran.cheaperbook.enums.Status;
import com.baranbasaran.cheaperbook.exception.BookNotFoundException;
import com.baranbasaran.cheaperbook.model.Book;
import com.baranbasaran.cheaperbook.model.User;
import com.baranbasaran.cheaperbook.repository.BookRepository;
import com.baranbasaran.cheaperbook.service.BookService;
import com.baranbasaran.cheaperbook.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final GoogleBookApiClient bookApiClient;
    private final BookRepository bookRepository;
    private final UserService userService;

    @Override
    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        log.info("Creating new book with ISBN: {}", request.getIsbn());
        log.debug("Book creation request details - price: {}", request.getPrice());

        log.debug("Fetching book details from Google Books API");
        Book book = getBookByIsbnFromApi(request.getIsbn());
        
        book.setIsbn(request.getIsbn());
        book.setPrice(request.getPrice());
        book.setStatus(Status.AVAILABLE);
        
        // Set the authenticated user as the owner
        User authenticatedUser = userService.getAuthenticatedUser();
        book.setOwner(authenticatedUser);

        Book savedBook = bookRepository.save(book);
        log.info("Book created successfully with ID: {}", savedBook.getId());
        log.debug("Created book details - ID: {}, title: {}, author: {}, price: {}", 
            savedBook.getId(), savedBook.getTitle(), savedBook.getAuthor(), savedBook.getPrice());
        return BookResponse.from(savedBook);
    }

    @Override
    public BookResponse findBookById(Long id) {
        log.info("Finding book with ID: {}", id);
        log.debug("Attempting to find book in database");
        
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Book not found with ID: {}", id);
                    return new BookNotFoundException(id);
                });
        
        log.debug("Found book - ID: {}, title: {}, author: {}", 
            book.getId(), book.getTitle(), book.getAuthor());
        return BookResponse.from(book);
    }

    @Override
    public Page<BookResponse> getAllBooks(int page, int size) {
        log.info("Fetching all books with pagination - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Book> books = bookRepository.findAll(pageable);
        Page<BookResponse> response = books.map(BookResponse::from);
        log.debug("Found {} total books", response.getContent().size());
        return response;
    }

    @Override
    @Transactional
    public BookResponse updateBook(Long id, UpdateBookRequest request) {
        log.info("Updating book with ID: {}", id);
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
        
        if (request.getPrice() != null) {
            book.setPrice(request.getPrice());
        }

        Book updatedBook = bookRepository.save(book);
        log.info("Book updated successfully with ID: {}", updatedBook.getId());
        return BookResponse.from(updatedBook);
    }

    @Override
    @Transactional
    public void deleteBook(Long id) {
        log.info("Deleting book with ID: {}", id);
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
        bookRepository.delete(book);
        log.info("Book deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional
    public BookResponse addBookUser(Long bookId, Long userId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException(bookId));
        User user = userService.getUserById(userId);
        book.setOwner(user);
        Book savedBook = bookRepository.save(book);
        return BookResponse.from(savedBook);
    }

    @Override
    public BookResponse findBookByIdAndUserId(Long bookId, Long userId) {
        Book book = bookRepository.findByIdAndOwnerId(bookId, userId)
                .orElseThrow(() -> new BookNotFoundException(bookId));
        return BookResponse.from(book);
    }

    @Override
    @Transactional
    public void deleteBookForUser(Long bookId, Long userId) {
        Book book = bookRepository.findByIdAndOwnerId(bookId, userId)
                .orElseThrow(() -> new BookNotFoundException(bookId));
        bookRepository.delete(book);
    }

    @Override
    public Book findBookByIsbn(String isbn) {
        log.info("Finding book with ISBN: {}", isbn);
        log.debug("Attempting to find book in local database first");
        
        return bookRepository.findByIsbn(isbn)
                .orElseGet(() -> {
                    log.debug("Book not found in database, fetching from Google Books API");
                    Book book = getBookByIsbnFromApi(isbn);
                    log.debug("Retrieved book from API - title: {}, author: {}", 
                        book.getTitle(), book.getAuthor());
                    return book;
                });
    }

    @Override
    public Page<BookResponse> searchBooks(String query, int page, int size) {
        log.info("Searching books with query: {}", query);
        log.debug("Creating pageable request with sorting by createdAt DESC");
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Book> books = bookRepository.findByTitleContainingOrAuthorContaining(query, query, pageable);
        Page<BookResponse> response = books.map(BookResponse::from);
        
        log.debug("Search results - total matches: {}, current page: {}, total pages: {}", 
            response.getTotalElements(), response.getNumber(), response.getTotalPages());
        return response;
    }

    @Override
    @Transactional
    public BookResponse updateBookForUser(Long bookId, UpdateBookRequest request) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException(bookId));
        
        if (request.getPrice() != null) {
            book.setPrice(request.getPrice());
        }

        Book updatedBook = bookRepository.save(book);
        return BookResponse.from(updatedBook);
    }

    @Override
    public List<BookResponse> findAllBooksByUserId(Long userId) {
        return bookRepository.findAllByOwnerId(userId).stream()
                .map(BookResponse::from)
                .collect(Collectors.toList());
    }

    private Book getBookByIsbnFromApi(String isbn) {
        return bookApiClient.getBookDataByIsbn(isbn).getBook()
                .orElseThrow(() -> new BookNotFoundException("Book not found with ISBN: " + isbn));
    }
} 