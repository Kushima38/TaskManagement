package com.taskmanagement.backend.dto;

import com.taskmanagement.backend.entity.Card;
import com.taskmanagement.backend.entity.Priority;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record CardResponse(
        UUID id,
        UUID listId,
        String title,
        String description,
        LocalDate dueDate,
        Priority priority,
        int order,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static CardResponse from(Card card) {
        return new CardResponse(
                card.getId(),
                card.getList().getId(),
                card.getTitle(),
                card.getDescription(),
                card.getDueDate(),
                card.getPriority(),
                card.getOrder(),
                card.getCreatedAt(),
                card.getUpdatedAt());
    }
}
