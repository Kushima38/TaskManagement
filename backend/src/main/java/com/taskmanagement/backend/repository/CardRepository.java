package com.taskmanagement.backend.repository;

import com.taskmanagement.backend.entity.Card;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

// jparepository crud処理を実装してくれるインターフェース
// JpaRepository<Entity,Entityの主キーの型>
// CardEntityの@Id(フィールドの型がUUID)をキーとして処理する
public interface CardRepository extends JpaRepository<Card, UUID> {
}
