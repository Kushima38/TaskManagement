# Git運用ルール

このプロジェクトでは、Claude Codeは以下のルールに従うこと。

## Issue駆動開発

- 機能追加・修正など全ての作業に着手する前に、必ずGitHub Issueを1件作成する（タイトルと目的を簡潔に）。

## ブランチ命名規則

`種別/Issue番号-概要` の形式で作成する。

- `feature/12-login-form`（機能追加）
- `fix/15-null-check`（バグ修正）
- `docs/20-update-readme`（ドキュメント）
- `chore/23-deps-update`（雑務・設定変更）

## mainブランチ運用

- mainへの直接コミット・pushは禁止。必ず作業ブランチ → PR作成 → マージの流れを踏む。
- GitHub側でmainブランチ保護が設定されており、直接pushはOwnerであっても拒否される。

## Claude Codeの振る舞い

- Issue作成・ブランチ作成・PR作成を行う前には、必ず作成内容（タイトル、ブランチ名、対象Issue番号など）を提示し、ユーザーの承認を得てから実行する。
