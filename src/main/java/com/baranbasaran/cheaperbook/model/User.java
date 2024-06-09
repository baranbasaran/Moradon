package com.baranbasaran.cheaperbook.model;

import com.baranbasaran.cheaperbook.common.model.BaseEntity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.util.List;


@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Entity(name = "users")
@Table(name = "users")
@Filter(name = "deletedFilter", condition = "deleted = false")
public class User extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String surname;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String profilePicture;

    @OneToMany(mappedBy = "owner")
    @JsonManagedReference
    private List<Book> books;

    @Column(nullable = false)
    private LocalDate birthDate;

    @Column
    private String phoneNumber;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address address;

    public void addBook(Book book) {
        this.books.add(book);
        book.setOwner(this);
    }

    public void removeBook(Book book) {
        this.books.remove(book);
        book.setOwner(null);
    }

    public boolean isValid() {
        return this.getUsername() != null && this.getPassword() != null && this.getEmail() != null;
    }
}
