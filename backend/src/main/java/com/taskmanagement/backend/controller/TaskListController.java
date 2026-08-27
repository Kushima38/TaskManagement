package com.taskmanagement.backend.controller;

import com.taskmanagement.backend.dto.TaskListResponse;
import com.taskmanagement.backend.service.TaskListService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
public class TaskListController {

    private final TaskListService taskListService;

    @GetMapping
    public List<TaskListResponse> getAllLists() {
        return taskListService.getAllLists();
    }
}
