package com.baranbasaran.cheaperbook.model;

import com.baranbasaran.cheaperbook.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;

import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor  // Add this line
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

    // assuming a user can have many books
    @OneToMany(mappedBy = "owner")
    private List<Book> books;

    @Column(nullable = false)
    private LocalDate birthDate;

    @Column
    private String phoneNumber;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address address;

    public boolean isValid() {
        return this.getUsername() != null && this.getPassword() != null && this.getEmail() != null;
    }
}