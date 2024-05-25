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
        private String description;
        private List<String> categories;

        @JsonProperty("imageLinks")
        private ImageLinks imageLinks;

        @JsonProperty("publishedDate")
        private String publishedDate;

        private String publisher;

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class ImageLinks {
            @JsonProperty("thumbnail")
            private String thumbnail;
        }
        public static Book from(VolumeInfo volumeInfo, Book result) {
            if (volumeInfo.getTitle() != null && result.getTitle() == null) {
                result.setTitle(volumeInfo.getTitle());
            }
            if (volumeInfo.getAuthors() != null && !volumeInfo.getAuthors().isEmpty() && result.getAuthor() == null) {
                result.setAuthor(volumeInfo.getAuthors().get(0));
            }
            if (volumeInfo.getPublisher() != null && result.getPublisher() == null) {
                result.setPublisher(volumeInfo.getPublisher());
            }
            if (volumeInfo.getImageLinks() != null && volumeInfo.getImageLinks().getThumbnail() != null && result.getCoverImage() == null) {
                result.setCoverImage(volumeInfo.getImageLinks().getThumbnail());
            }
            if (volumeInfo.getPublishedDate() != null && result.getPublicationYear() == null) {
                String publishedDate = volumeInfo.getPublishedDate();
                if (publishedDate.length() >= 4) {
                    result.setPublicationYear(Integer.valueOf(publishedDate.substring(0, 4)));
                }
            }
            if (volumeInfo.getCategories() != null && result.getGenre() == null) {
                result.setGenre(volumeInfo.getCategories());
            }
            if (volumeInfo.getDescription() != null && result.getDescription() == null) {
                result.setDescription(volumeInfo.getDescription());
            }

            return result;
        }
    }
    public Book getBook() {
        if (items == null || items.isEmpty()) {
            return new Book();
        }
        Book result = new Book();

        for (Item item : items) {
            VolumeInfo volumeInfo = item.getVolumeInfo();
            VolumeInfo.from(volumeInfo, result);

            // Check if all fields have been set, if so, break the loop
            if (result.getTitle() != null && result.getAuthor() != null && result.getPublisher() != null && result.getCoverImage() != null && result.getPublicationYear() != null && result.getGenre() != null && result.getDescription() != null) {
                break;
            }
        }

        if (result.getTitle() == null) result.setTitle("Title not available");
        if (result.getAuthor() == null) result.setAuthor("Author information not available");
        if (result.getPublisher() == null) result.setPublisher("Publisher not available");
        if (result.getCoverImage() == null) result.setCoverImage("Cover image not available");
        if (result.getPublicationYear() == null) result.setPublicationYear(null);
        if (result.getGenre() == null) result.setGenre(List.of("No genre available"));
        if (result.getDescription() == null) result.setDescription("No description available");

        return result;
    }

}
