package com.taskmanagement.backend.dto;

import com.taskmanagement.backend.entity.TaskList;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TaskListResponse(
        UUID id,
        String title,
        int order,
        List<CardResponse> cards,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static TaskListResponse from(TaskList list) {
        return new TaskListResponse(
                list.getId(),
                list.getTitle(),
                list.getOrder(),
                list.getCards().stream().map(CardResponse::from).toList(),
                list.getCreatedAt(),
                list.getUpdatedAt());
    }
}
