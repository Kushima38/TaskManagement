package com.taskmanagement.backend.service;

import com.taskmanagement.backend.dto.TaskListResponse;
import com.taskmanagement.backend.repository.TaskListRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskListService {

    private final TaskListRepository taskListRepository;

    public List<TaskListResponse> getAllLists() {
        return taskListRepository.findAllWithCardsOrdered().stream()
                .map(TaskListResponse::from)
                .toList();
    }
}
