---
name: restart-dev-server
description: Cleanly stop and (re)start this project's backend (Spring Boot, port 8080) or frontend (Vite, port 5173) dev server on its configured port instead of moving to a different port when the port is already in use. Use whenever asked to start, run, or restart the backend/frontend dev server, or when a dev server fails to bind because the port is already in use.
---

# 開発サーバーの起動・再起動

このプロジェクトでは、バックエンド(Spring Boot)はポート **8080**、フロントエンド(Vite)はポート **5173** で起動する運用とする。

## ルール

- サーバーを起動する前に、対象ポートが既に使用されていないか確認する。
- 使用中の場合は、そのプロセスを停止してから、指定ポートで起動し直す。**空いている別のポート番号にずらして起動しない。**
- 停止しようとしているプロセスが自分(Claude)がこのセッションで起動したものか判別できない場合は、停止してよいかユーザーに確認してから停止する。ユーザーの他の作業中プロセスを無断で落とさない。

## 手順

### 1. ポート使用状況の確認

PowerShellの場合:

```powershell
Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue | Select-Object OwningProcess
Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue | Select-Object OwningProcess
```

Bashツール(git bash)の場合:

```bash
netstat -ano | grep ':8080.*LISTENING'
netstat -ano | grep ':5173.*LISTENING'
```

該当プロセスがなければ何も表示されない。その場合は手順3(起動)へ進む。

### 2. 該当プロセスの停止

上記で取得したPID(プロセスID)を使って停止する。

PowerShell:

```powershell
Stop-Process -Id <PID> -Force
```

git bash:

```bash
taskkill //PID <PID> //F
```

### 3. 起動

バックエンド(ポート8080、`backend/src/main/resources/application.yml` に `server.port` の指定なし=デフォルト8080):

```bash
cd backend
./gradlew bootRun
```

フロントエンド(ポート5173、Viteのデフォルト):

```bash
cd frontend
npm run dev
```

長時間起動しっぱなしにする場合はバックグラウンド実行にする。

### 4. 起動確認

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/api/lists
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173
```

いずれも200が返れば、設定ポートで正しく起動できている。
