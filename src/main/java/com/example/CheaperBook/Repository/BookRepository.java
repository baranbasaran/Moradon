package com.example.CheaperBook.Repository;

import com.example.CheaperBook.Model.Book;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BookRepository extends JpaRepository<Book, Long> {

}