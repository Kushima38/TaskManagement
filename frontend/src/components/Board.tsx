import type { TaskList } from "../types/board";
import { ListColumn } from "./ListColumn";

interface BoardProps {
  lists: TaskList[];
}

export function Board({ lists }: BoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {lists.map((list) => (
        <ListColumn key={list.id} list={list} />
      ))}
    </div>
  );
}
