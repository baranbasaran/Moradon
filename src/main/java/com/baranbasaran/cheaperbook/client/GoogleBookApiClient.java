package com.baranbasaran.cheaperbook.client;

import com.baranbasaran.cheaperbook.client.response.GoogleBookResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "google-book-api-client", url = "https://www.googleapis.com/books/v1")
public interface GoogleBookApiClient {

    @GetMapping("/volumes?q=isbn:{isbn}")
    GoogleBookResponse getBookByIsbn(@PathVariable String isbn);
}
