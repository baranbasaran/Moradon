package com.baranbasaran.cheaperbook.repository;

import com.baranbasaran.cheaperbook.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    @Query("SELECT b FROM books b WHERE b.deleted = false")
    List<Book> findAll();

    @Query("SELECT b FROM books b WHERE b.id = ?1 AND b.deleted = false")
    Optional<Book> findById(Long id);
}