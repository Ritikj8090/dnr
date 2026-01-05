import { Button } from "@/components/ui/button";
import { TableHead } from "@/components/ui/table";
import type { Column } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { Edit3, GripVertical } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";

export default function SortableTableHeader({
  column,
  onEdit,
}: {
  column: Column;
  onEdit: (column: Column) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={{ ...style, width: column.width }}
      className="p-3 text-center border-r last:border-r-0 relative truncate group"
    >
      {/* Drag handle - pinned left */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-1.5 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4 text-slate-400" />
      </div>

      {/* Centered label */}
      <div className="flex w-full items-center justify-center pointer-events-none">
        <span className="font-semibold">{column.label}</span>
        {column.required && (
          <span className="text-red-500 text-xs ml-1">*</span>
        )}
      </div>

      {/* Edit button - pinned right */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(column)}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
      >
        <Edit3 className="h-3 w-3" />
      </Button>
    </TableHead>
  );
}
