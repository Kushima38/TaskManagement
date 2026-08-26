package com.taskmanagement.backend.repository;

import com.taskmanagement.backend.entity.Card;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Card, UUID> {
}
