import { useEffect, useState } from "react";
import { fetchLists } from "./api/lists";
import { Board } from "./components/Board";
import type { TaskList } from "./types/board";

function App() {
  const [lists, setLists] = useState<TaskList[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLists()
      .then(setLists)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3">
        <span aria-hidden="true">📋</span>
        <h1 className="text-lg font-semibold">Trello風タスク管理アプリ</h1>
      </header>

      {error && <p className="p-4 text-red-600">{error}</p>}
      {!error && !lists && <p className="p-4 text-gray-500">読み込み中...</p>}
      {lists && <Board lists={lists} />}
    </div>
  );
}

export default App;
