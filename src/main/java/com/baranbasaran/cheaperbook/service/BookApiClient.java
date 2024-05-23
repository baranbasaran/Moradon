package com.baranbasaran.cheaperbook.service;

import com.baranbasaran.cheaperbook.model.Book;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class BookApiClient {

    private final RestTemplate restTemplate;

    public BookApiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    private Book convertGoogleBookResponseToBook(GoogleBookResponse googleBookResponse) {
        Book book = new Book();
        GoogleBookResponse.VolumeInfo volumeInfo = googleBookResponse.getItems().get(0).getVolumeInfo();
        book.setTitle(volumeInfo.getTitle());
        book.setAuthor(volumeInfo.getAuthors().get(0));
        book.setPublisher(volumeInfo.getPublisher());

        List<String> genre = volumeInfo.getCategories();
        String description = volumeInfo.getDescription();
        if (description == null) {
            description = "No description available";
        }
        if(genre == null ){
            genre = List.of("No genre available");
        }

        book.setDescription(description);

        book.setGenre(genre);

        return book;
    }
    public Book getBookByIsbn(String isbn) {
        String url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        ObjectMapper mapper = new ObjectMapper();
        GoogleBookResponse googleBookResponse = null;
        try {
            googleBookResponse = mapper.readValue(response.getBody(), GoogleBookResponse.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }


        return convertGoogleBookResponseToBook(googleBookResponse);
    }
}