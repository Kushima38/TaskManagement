package com.taskmanagement.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "card")
@Getter
@Setter
@NoArgsConstructor

// cardテーブルの作成
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

// list_idを外部キーにしてtaskListと連携
// tasklistが1 cardが多
    @ManyToOne(optional = false)
    @JoinColumn(name = "list_id", nullable = false)
    private TaskList list;

    @Column(nullable = false, length = 30)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(name = "due_date")
    private LocalDate dueDate;

// Priority.javaで定義されているenum
    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Priority priority;

    @Column(name = "position", nullable = false)
    private int order;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
