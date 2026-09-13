import type { Card, Priority } from "../types/board";
import { formatMonthDay, isOverdue } from "../utils/date";

const PRIORITY_LABEL: Record<Priority, string> = {
  HIGH: "優先度:高",
  MEDIUM: "優先度:中",
  LOW: "優先度:低",
};

interface CardItemProps {
  card: Card;
}

export function CardItem({ card }: CardItemProps) {
  const overdue = isOverdue(card.dueDate);

  return (
    <div
      className={
        overdue
          ? "rounded border border-red-300 bg-red-100 p-2 text-red-800 shadow-sm"
          : "rounded border border-gray-200 bg-white p-2 shadow-sm"
      }
    >
      <p className="text-sm font-medium">{card.title}</p>
      {card.priority && <p className="text-xs">{PRIORITY_LABEL[card.priority]}</p>}
      {card.dueDate && <p className="text-xs">期限:{formatMonthDay(card.dueDate)}</p>}
    </div>
  );
}
