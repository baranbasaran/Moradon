package com.baranbasaran.cheaperbook.repository;

import com.baranbasaran.cheaperbook.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Book, Long> {
}
