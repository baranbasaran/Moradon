package com.baranbasaran.cheaperbook.client.response;

import com.baranbasaran.cheaperbook.dto.BookDto;
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
        private String title = "Title is not available";
        private List<String> authors = List.of();
        private String description = "Description is not available";
        private List<String> categories = List.of();

        @JsonProperty("imageLinks")
        private ImageLinks imageLinks;

        @JsonProperty("publishedDate")
        private String publishedDate = "0000";

        private String publisher = "Publisher is not available";

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class ImageLinks {
            @JsonProperty("thumbnail")
            private String thumbnail = "";
        }

        public static BookDto from(VolumeInfo volumeInfo) {
            BookDto result = new BookDto();

            if (StringUtils.hasText(volumeInfo.getTitle())) {
                result.setTitle(volumeInfo.getTitle());
            }
            if (!volumeInfo.getAuthors().isEmpty()
                    && volumeInfo.getAuthors().stream().anyMatch(StringUtils::hasText)) {
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
            if (Objects.nonNull(volumeInfo.getPublishedDate())) {
                result.setPublicationYear(Integer.parseInt(volumeInfo.getPublishedDate().substring(0, 4)));
            }
            if (Objects.nonNull(volumeInfo.getImageLinks()) && StringUtils.hasText(volumeInfo.getImageLinks().getThumbnail())) {
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

    public Optional<Book> getBook() {
        List<Book> books = getBooks();
        if (books.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(books.get(0));
    }

}
