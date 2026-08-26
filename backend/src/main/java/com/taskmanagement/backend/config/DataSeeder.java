package com.taskmanagement.backend.config;

import com.taskmanagement.backend.entity.Card;
import com.taskmanagement.backend.entity.Priority;
import com.taskmanagement.backend.entity.TaskList;
import com.taskmanagement.backend.repository.CardRepository;
import com.taskmanagement.backend.repository.TaskListRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final TaskListRepository taskListRepository;
    private final CardRepository cardRepository;

    @Override
    public void run(String... args) {
        if (taskListRepository.count() > 0) {
            return;
        }

        TaskList todo = newList("未着手", 0);
        TaskList inProgress = newList("進行中", 1);
        TaskList done = newList("完了", 2);

        addCard(todo, "要件定義書を作成する", "機能要件・業務ルールをまとめる", null, Priority.HIGH, 0);
        addCard(todo, "画面デザインを検討する", null, LocalDate.now().plusDays(7), Priority.MEDIUM, 1);
        addCard(todo, "テストデータを準備する", "READ API確認用のサンプルデータ", null, null, 2);

        addCard(inProgress, "バックエンド環境を構築する", "Spring Boot + PostgreSQL", LocalDate.now().plusDays(3), Priority.HIGH, 0);
        addCard(inProgress, "READ APIを実装する", "一覧取得・キーワード検索", LocalDate.now().plusDays(1), Priority.HIGH, 1);

        addCard(done, "GitHub運用ルールを整備する", "Issue駆動開発のルールを策定", null, Priority.LOW, 0);
        addCard(done, "Dockerでpostgresを起動する", null, null, null, 1);
    }

    private TaskList newList(String title, int order) {
        TaskList list = new TaskList();
        list.setTitle(title);
        list.setOrder(order);
        return taskListRepository.save(list);
    }

    private void addCard(TaskList list, String title, String description, LocalDate dueDate, Priority priority, int order) {
        Card card = new Card();
        card.setList(list);
        card.setTitle(title);
        card.setDescription(description);
        card.setDueDate(dueDate);
        card.setPriority(priority);
        card.setOrder(order);
        cardRepository.save(card);
    }
}
