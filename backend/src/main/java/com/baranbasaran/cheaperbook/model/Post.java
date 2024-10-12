package com.baranbasaran.cheaperbook.model;

import com.baranbasaran.cheaperbook.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity(name = "posts")
@Table(name = "posts")
@Where(clause = "deleted = false")
public class Post extends BaseEntity {

    @Column(nullable = false, length = 280)
    private String content;

    @Column(nullable = true, length = 100)
    private String title;

    @Column(nullable = true)
    private String mediaUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Many posts can belong to one user

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @Builder.Default
    @Column(nullable = false)
    private boolean deleted = false;

    @Builder.Default
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    @Builder.Default
    @Column(nullable = false)
    private int likes = 0;

    public boolean isValid() {
        return this.content != null && !this.content.trim().isEmpty();
    }
}
