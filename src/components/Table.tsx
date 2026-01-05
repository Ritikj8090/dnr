import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table as MainTable,
  TableBody,
  TableCell as TableCellComponent,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calculator, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Column, QuotationItem } from "@/types";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import SummaryComp from "./Summary";
import SortableTableHeader from "@/pages/quotationGenerator/SortableTableHeader";
import QuotationItemCell from "@/pages/quotationGenerator/QuotationItemCell";
import { calculateTotal, itemVariants, currency } from "@/constant";
import type { SetStateAction } from "react";

export declare interface TableProps {
  title: string;
  columns: Column[];
  setColumns: React.Dispatch<SetStateAction<Column[]>>;
  items: QuotationItem[];
  showAddColumn?: boolean;
  setItems: React.Dispatch<SetStateAction<QuotationItem[]>>;
  setEditingColumn: React.Dispatch<SetStateAction<Column | null>>;
  setIsColumnDialogOpen: React.Dispatch<SetStateAction<boolean>>;
  currencyCode?: string;
}

const Table = ({
  title,
  columns,
  setColumns,
  items,
  showAddColumn = true,
  setItems,
  setEditingColumn,
  setIsColumnDialogOpen,
  currencyCode,
}: TableProps) => {
  const { total, subtotal, vatAmount } = calculateTotal({ items, columns });
  // Header-only view: if column is "amount", append the currency CODE (not symbol)
  console.log(currencyCode)
  const headerColumns: Column[] = columns.map((c) =>
    c.id === "amount" ? { ...c, label: `${c.label} (${currencyCode || currency.code})` } : c
  );

  const addColumn = () => {
    setEditingColumn(null);
    setIsColumnDialogOpen(true);
  };

  const editColumn = (column: Column) => {
    setEditingColumn(column);
    setIsColumnDialogOpen(true);
  };

  const addItem = () => {
    const newItem: QuotationItem = { id: Date.now() };
    // Initialize all column fields based on type
    columns.forEach((col) => {
      if (col.type === "number") {
        newItem[col.id] = 0;
      } else if (col.type === "text") {
        newItem[col.id] = "";
      }
    });
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setColumns((cols) => {
        const oldIndex = cols.findIndex((col) => col.id === active.id);
        const newIndex = cols.findIndex((col) => col.id === over?.id);
        return arrayMove(cols, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="xl:col-span-2 space-y-6">
      {/* Items Table */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-xl pb-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                {title}
              </CardTitle>
              <div className="flex gap-2">
                {showAddColumn && (
                  <Button
                    onClick={addColumn}
                    variant="outline"
                    className="gap-2 bg-transparent cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Add Column
                  </Button>
                )}

                <Button onClick={addItem} className="gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="custom-scrollbar h-[680px] overflow-auto border rounded-md">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <MainTable className="text-center">

                  <TableHeader className="bg-primary-foreground capitalize text-center">
                    <TableRow>
                      <TableHead className="p-3 text-center border-r truncate">
                        SI. No.
                      </TableHead>

                      {/* Sortable header with currency code appended for "amount" */}
                      <SortableContext
                        items={columns.map((col) => col.id)}
                        strategy={horizontalListSortingStrategy}
                      >
                        {headerColumns.map((column) => (
                          <SortableTableHeader
                            key={column.id}
                            column={column}
                            onEdit={editColumn}
                          />
                        ))}
                      </SortableContext>

                      <TableHead className="p-3 text-center truncate">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="border-b text-center">
                    <AnimatePresence>
                      {items.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                          className="even:bg-primary-foreground/40 border-b"
                        >
                          <TableCellComponent className="p-2 text-center border-r text-sm text-muted-foreground">
                            {index + 1}
                          </TableCellComponent>

                          {/* Use ORIGINAL columns here so inputs/placeholders stay clean */}
                          {columns.map((column) => (
                            <QuotationItemCell
                              key={column.id}
                              item={item}
                              column={column}
                              onUpdate={(field, value) =>
                                updateItem(item.id, field, value)
                              }
                            />
                          ))}

                          <TableCellComponent>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-primary-foreground"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </TableCellComponent>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </MainTable>
              </DndContext>
            </div>

            <Separator className="my-6" />

            <SummaryComp
              total={total}
              subtotal={subtotal}
              vatAmount={vatAmount}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Table;
