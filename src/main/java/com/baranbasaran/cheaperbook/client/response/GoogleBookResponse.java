package com.baranbasaran.cheaperbook.client.response;

import com.baranbasaran.cheaperbook.model.Book;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GoogleBookResponse {

    @JsonProperty("items")
    private List<Item> items;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Item {
        @JsonProperty("volumeInfo")
        private VolumeInfo volumeInfo;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VolumeInfo {
        private String title;
        private List<String> authors;
        private String publisher;
        private String description;
        private List<String> categories;

        public static Book from(VolumeInfo volumeInfo) {
            Book book = new Book();
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
    }

    public Book getFirstBook() {
        return VolumeInfo.from(items.get(0).getVolumeInfo());
    }

    public List<Book> getBooks() {
        return items.stream().map(item -> VolumeInfo.from(item.getVolumeInfo())).toList();
    }
}