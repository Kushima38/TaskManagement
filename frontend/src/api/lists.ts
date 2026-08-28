import type { TaskList } from "../types/board";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchLists(): Promise<TaskList[]> {
  const response = await fetch(`${API_BASE_URL}/api/lists`);
  if (!response.ok) {
    throw new Error(`リスト一覧の取得に失敗しました (status: ${response.status})`);
  }
  return response.json();
}
