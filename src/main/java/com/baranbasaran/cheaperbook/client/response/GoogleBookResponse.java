package com.baranbasaran.cheaperbook.client.response;

import com.baranbasaran.cheaperbook.dto.BookDto;
import com.baranbasaran.cheaperbook.model.Book;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

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
        public static BookDto from(VolumeInfo volumeInfo) {
            BookDto result = new BookDto();

            if (StringUtils.hasText(volumeInfo.getTitle())) {
                result.setTitle(volumeInfo.getTitle());
            }
            if (volumeInfo.getAuthors().stream().anyMatch(StringUtils::hasText)) {
                result.setAuthor(volumeInfo.getAuthors().get(0));
            }
            if (!volumeInfo.getCategories().isEmpty()){
                result.setGenre(volumeInfo.getCategories());
            }
            if (StringUtils.hasText(volumeInfo.getDescription())) {
                result.setDescription(volumeInfo.getDescription());
            }
            if (StringUtils.hasText(volumeInfo.getPublisher())) {
                result.setPublisher(volumeInfo.getPublisher());
            }
            if (StringUtils.hasText(volumeInfo.getPublishedDate())) {
                result.setPublicationYear(LocalDateTime.parse(volumeInfo.getPublishedDate()).getYear());
            }
            if (volumeInfo.getImageLinks() != null && StringUtils.hasText(volumeInfo.getImageLinks().getThumbnail())) {
                result.setCoverImage(volumeInfo.getImageLinks().getThumbnail());
            }

            return result;
        }
    }
    public List<Book> getBooks() {
        if (items.isEmpty()) {
            return List.of();
        }
        return items.stream()
                .map(Item::getVolumeInfo)
                .map(VolumeInfo::from)
            .map(bookDto -> {
                Book book = new Book();
                return book.mergeFromDto(bookDto);
            })
                .filter(Book::isValid)
                .toList();
    }

    public Book getBook() {
        if (items.isEmpty()) {
            return null;
        }
        return getBooks().get(0);
    }

}
