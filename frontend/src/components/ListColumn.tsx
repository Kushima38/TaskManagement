import type { TaskList } from "../types/board";
import { CardItem } from "./CardItem";

interface ListColumnProps {
  list: TaskList;
}

export function ListColumn({ list }: ListColumnProps) {
  return (
    <div className="flex w-72 shrink-0 flex-col gap-2 rounded bg-gray-100 p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{list.title}</h2>
        <span className="text-xs text-gray-500">{list.cards.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {list.cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
