package com.baranbasaran.cheaperbook.repository;

import com.baranbasaran.cheaperbook.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM users u WHERE u.deleted = false")
    List<User> findAll();

    @Query("SELECT u FROM users u WHERE u.id = ?1 AND u.deleted = false")
    Optional<User> findById(Long id);
}