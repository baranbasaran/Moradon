package com.example.CheaperBook.Model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import com.example.CheaperBook.enums.Status;
@Entity
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String title;
    private String author;
    private String genre;
    private String description;
    private String owner;
    private int price;
    private Status status; // added status field

    public Book(String title, String author, String genre, int price, String description, String owner, Status status) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.price = price;
        this.description = description;
        this.owner = owner;
        this.status = status; // initialize status
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public String getGenre() {
        return genre;
    }

    public int getPrice() {
        return price;
    }
    public String getDescription() {
        return description;
    }
    public String getOwner() {
        return owner;
    }
    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    public void setGenre(String genre) {
        this.genre = genre;
    }
    public void setPrice(int price) {
        this.price = price;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setOwner(String owner) {
        this.owner = owner;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
}
