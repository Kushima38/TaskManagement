package com.taskmanagement.backend.repository;

import com.taskmanagement.backend.entity.TaskList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

// TaskListEntityの@ID(型がUUID)をキーとしてcrud処理を実装する
public interface TaskListRepository extends JpaRepository<TaskList, UUID> {

// 全件検索taskListをすべて返す
// @QueryはDBの操作をするアノテーション
// FROM TaskList l これはTaskListをlという別名(エイリアス)を付ける
// つまりLEFT JOIN FETCH l　もTaskListに対してということ
    @Query("SELECT DISTINCT l FROM TaskList l LEFT JOIN FETCH l.cards ORDER BY l.order ASC")
    List<TaskList> findAllWithCardsOrdered();
}
