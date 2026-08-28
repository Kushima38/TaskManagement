package com.taskmanagement.backend.dto;

import com.taskmanagement.backend.entity.TaskList;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

// entityのtaskListとcardの関係1対多の関係を写し取る
// いまはしていないがここで外部公開用の形にできる。IDを隠す等
/* recordはclassの仲間　recordにすることによりコンストラクタやgetterなどの機能を
　 代わりに実装してくれる
　 ()の中でフィールドを宣言している
　 コンストラクタで呼び出す場合は引数の順番が()の中身通りになっているかチェック */
public record TaskListResponse(
        UUID id,
        String title,
        int order,
        List<CardResponse> cards,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

// コンストラクタの呼び出し引数の順番が一致している
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
