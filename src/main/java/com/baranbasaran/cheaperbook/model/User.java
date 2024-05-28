package com.baranbasaran.cheaperbook.model;

import com.baranbasaran.cheaperbook.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Filter;

import java.util.List;

@Getter
@Setter
@Entity(name = "users")
@Table(name = "users")
@Filter(name = "deletedFilter", condition = "deleted = false")
public class User extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String profilePicture;

    // assuming a user can have many books
    @OneToMany(mappedBy = "owner")
    private List<Book> books;

    public boolean isValid() {
        return this.getUsername() != null && this.getPassword() != null && this.getEmail() != null;
    }
}