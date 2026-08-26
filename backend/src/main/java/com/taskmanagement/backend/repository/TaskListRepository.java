package com.taskmanagement.backend.repository;

import com.taskmanagement.backend.entity.TaskList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TaskListRepository extends JpaRepository<TaskList, UUID> {

    @Query("SELECT DISTINCT l FROM TaskList l LEFT JOIN FETCH l.cards ORDER BY l.order ASC")
    List<TaskList> findAllWithCardsOrdered();
}
