package com.baranbasaran.cheaperbook.client.response;

import com.baranbasaran.cheaperbook.dto.response.book.BookResponse;
import com.baranbasaran.cheaperbook.model.Book;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GoogleBookResponse {

    @JsonProperty("items")
    private List<Item> items = List.of();

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Item {
        @JsonProperty("volumeInfo")
        private VolumeInfo volumeInfo;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VolumeInfo {
        @JsonProperty("title")
        private String title;

        @JsonProperty("authors")
        private List<String> authors;

        @JsonProperty("categories")
        private List<String> categories;

        @JsonProperty("description")
        private String description;

        @JsonProperty("industryIdentifiers")
        private List<IndustryIdentifier> industryIdentifiers;

        @JsonProperty("imageLinks")
        private ImageLinks imageLinks;

        @JsonProperty("publisher")
        private String publisher;

        @JsonProperty("publishedDate")
        private String publishedDate;

        @JsonProperty("language")
        private String language;

        @JsonProperty("pageCount")
        private Integer pageCount;

        public BookResponse toBookResponse() {
            BookResponse result = new BookResponse();
            result.setTitle(this.title);
            result.setAuthor(this.authors != null && !this.authors.isEmpty() 
                ? this.authors.get(0) 
                : null);
            result.setGenre(this.categories);
            result.setDescription(this.description);
            result.setIsbn(this.industryIdentifiers != null 
                ? this.industryIdentifiers.stream()
                    .filter(id -> "ISBN_13".equals(id.getType()) || "ISBN_10".equals(id.getType()))
                    .map(IndustryIdentifier::getIdentifier)
                    .findFirst()
                    .orElse(null)
                : null);
            result.setCoverImageUrl(this.imageLinks != null 
                ? this.imageLinks.getThumbnail() 
                : null);
            result.setPublisher(this.publisher);
            result.setPublishYear(this.publishedDate != null 
                ? Integer.parseInt(this.publishedDate.substring(0, 4)) 
                : null);
            result.setLanguage(this.language);
            result.setPageCount(this.pageCount);
            return result;
        }
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class IndustryIdentifier {
        @JsonProperty("type")
        private String type;

        @JsonProperty("identifier")
        private String identifier;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ImageLinks {
        @JsonProperty("thumbnail")
        private String thumbnail;
    }

    public Optional<Book> getBook() {
        return items.stream()
            .map(item -> item.getVolumeInfo())
            .filter(Objects::nonNull)
            .map(volumeInfo -> {
                Book book = new Book();
                book.setTitle(volumeInfo.getTitle());
                book.setAuthor(volumeInfo.getAuthors() != null && !volumeInfo.getAuthors().isEmpty() 
                    ? volumeInfo.getAuthors().get(0) 
                    : null);
                book.setGenre(volumeInfo.getCategories());
                book.setDescription(volumeInfo.getDescription());
                book.setIsbn(volumeInfo.getIndustryIdentifiers() != null 
                    ? volumeInfo.getIndustryIdentifiers().stream()
                        .filter(id -> "ISBN_13".equals(id.getType()) || "ISBN_10".equals(id.getType()))
                        .map(IndustryIdentifier::getIdentifier)
                        .findFirst()
                        .orElse(null)
                    : null);
                book.setCoverImageUrl(volumeInfo.getImageLinks() != null 
                    ? volumeInfo.getImageLinks().getThumbnail() 
                    : null);
                book.setPublisher(volumeInfo.getPublisher());
                book.setPublishYear(volumeInfo.getPublishedDate() != null 
                    ? Integer.parseInt(volumeInfo.getPublishedDate().substring(0, 4)) 
                    : null);
                book.setLanguage(volumeInfo.getLanguage());
                book.setPageCount(volumeInfo.getPageCount());
                return book;
            })
            .findFirst();
    }
}

