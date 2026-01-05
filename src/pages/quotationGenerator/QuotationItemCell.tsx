import { TableCell as TableCellComponent } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Column, QuotationItem } from "@/types"; // ⬅ removed Country (unused)
import { Input } from "@/components/ui/input";
import { calculateFormula } from "@/constant"; // ⬅ no currency import

export default function QuotationItemCell({
  item,
  column,
  onUpdate,
}: {
  item: QuotationItem;
  column: Column;
  onUpdate: (field: string, value: string | number) => void;
}) {
  const value = item[column.id] ?? "";

  // ⬇⬇ Calculated column: show PLAIN number (no currency symbol)
  if (column.type === "calculated") {
    const { result } = calculateFormula(item, column.formula || "");
    const n = Number(result);
    const display = Number.isFinite(n) ? n.toLocaleString() : "0";

    return (
      <TableCellComponent className="font-semibold border-r opacity-70 cursor-not-allowed text-center">
        {display}
      </TableCellComponent>
    );
  }

  if (column.type === "select") {
    return (
      <TableCellComponent className="border-r text-center">
        <Select
          value={(value as string) ?? ""}
          onValueChange={(val) => onUpdate(column.id, val)}
        >
          <SelectTrigger className="justify-center">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {column.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCellComponent>
    );
  }

  return (
    <TableCellComponent className="border-r">
      <Input
        type={
          column.type === "number"
            ? "number"
            : column.type === "date"
            ? "date"
            : "text"
        }
        value={value as any}
        onChange={(e) => {
          const newValue =
            column.type === "number"
              ? Number.parseFloat(e.target.value || "0") || 0
              : e.target.value;
          onUpdate(column.id, newValue);
        }}
        className="border-0 bg-transparent text-center"
        placeholder={`Enter ${column.label.toLowerCase()}...`}
      />
    </TableCellComponent>
  );
}
