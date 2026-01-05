import { useEffect, useRef, useState } from "react";
import {
  Trash2,
  X,
  Check,
  Calculator,
  Type,
  Hash,
  Calendar,
  DollarSign,
  Plus,
  Minus,
  Divide,
  Percent,
  Parentheses,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import type { Column } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const columnEditSchema = z.object({
  id: z.string(),
  label: z.string().min(2, {
    message: "Label must be at least 2 characters.",
  }),
  type: z.enum(["text", "number", "select", "date", "calculated"]),
  width: z
    .string()
    .min(2, {
      message: "Width must be at least 2 characters.",
    })
    .optional(),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  formula: z.string().optional(),
});

const inputTypes = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "select", label: "Dropdown" },
  { value: "date", label: "Date" },
  { value: "calculated", label: "Calculated" },
];

export default function ColumnEditor({
  column,
  onSave,
  onCancel,
  ondelete,
  columns,
  isColumnDialogOpen,
  setIsColumnDialogOpen,
  editingColumn = false,
}: {
  column: Column | null;
  onSave: (column: Column) => void;
  onCancel: () => void;
  ondelete: (columnId: string) => void;
  columns: Column[];
  isColumnDialogOpen: boolean;
  setIsColumnDialogOpen: (open: boolean) => void;
  editingColumn?: boolean;
}) {
  const columnEdit = useForm<z.infer<typeof columnEditSchema>>({
    resolver: zodResolver(columnEditSchema),
    defaultValues: {
      id: "",
      label: "",
      type: "text",
      width: "120px",
      required: false,
      options: [],
      formula: "",
    },
  });

  useEffect(() => {
    // Reset form values when the dialog opens
    if (isColumnDialogOpen) {
      columnEdit.reset({
        id: column?.id || "",
        label: column?.label || "",
        type: column?.type || "text",
        width: column?.width || "120px",
        required: column?.required || false,
        options: column?.options || [],
        formula: column?.formula || "",
      });
    }
  }, [isColumnDialogOpen, column, columnEdit]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof columnEditSchema>) {
    console.log("Submitted values:", values);
    onSave(values);
  }

  useEffect(() => {
    if (editingColumn)
      return;
    const subscription = columnEdit.watch((value, { name }) => {
      if (name === "label" && value.label) {
        columnEdit.setValue("id", value.label.toLowerCase().replace(/\s+/g, "_"));
      }
    });

    return () => subscription.unsubscribe(); // cleanup
  }, [columnEdit, editingColumn]);

  return (
    <Dialog open={isColumnDialogOpen} onOpenChange={setIsColumnDialogOpen}>
      <DialogContent className="min-w-[800px]">
        <DialogHeader>
          <DialogTitle className=" text-2xl font-semibold">
            {editingColumn ? "Edit Column" : "Add New Column"}
          </DialogTitle>
          <DialogDescription>
            {editingColumn
              ? "Edit the details of the selected column."
              : "Add a new column to your quotation."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <div className="space-y-4 max-h-[500px] pr-4">
            <Form {...columnEdit}>
              <form
                onSubmit={columnEdit.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={columnEdit.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Column Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter column label" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={columnEdit.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Column Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className=" w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select type for input" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {inputTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={columnEdit.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Width (px)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 120px, 200px" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {columnEdit.watch("type") === "select" && (
                  <FormField
                    control={columnEdit.control}
                    name="options"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Options (comma-separated)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Option 1, Option 2, Option 3"
                            {...field}
                            onChange={(e) =>
                              columnEdit.setValue(
                                "options",
                                e.target.value
                                  .split(",")
                                  .map((opt) => opt.trim())
                              )
                            }
                            value={columnEdit.watch("options")?.join(", ")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {columnEdit.watch("type") === "calculated" && (
                  <FormulaBuilder columns={columns} columnEdit={columnEdit} />
                )}
                <FormField
                  control={columnEdit.control}
                  name="required"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-row items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Required field</FormLabel>
                      </FormItem>
                    );
                  }}
                />

                <div className=" flex items-center gap-2">
                  <Button type="submit" className=" flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Save Column
                  </Button>
                  {editingColumn && (
                    <Button
                      type="button"
                      className=" bg-red-500 hover:bg-red-600"
                      onClick={() => ondelete(column?.id || "")}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  )}

                  <Button type="button" variant="secondary" onClick={onCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

const FormulaBuilder = ({
  columns,
  columnEdit,
}: {
  columns: Column[];
  columnEdit: UseFormReturn<z.infer<typeof columnEditSchema>>;
}) => {
  const validateFormula = () => {
    // Basic validation - check for balanced parentheses
    const openParens = (columnEdit.watch("formula")?.match(/\(/g) || []).length;
    const closeParens = (columnEdit.watch("formula")?.match(/\)/g) || [])
      .length;
    return openParens === closeParens;
  };
  const getColumnIcon = (type: string) => {
    switch (type) {
      case "text":
        return Type;
      case "number":
        return Hash;
      case "date":
        return Calendar;
      case "currency":
        return DollarSign;
      case "calculated":
        return Calculator;
      default:
        return Hash;
    }
  };

  const getColumnColor = (type: string) => {
    switch (type) {
      case "text":
        return "from-blue-500 to-cyan-500";
      case "number":
        return "from-green-500 to-emerald-500";
      case "date":
        return "from-purple-500 to-pink-500";
      case "currency":
        return "from-yellow-500 to-orange-500";
      case "calculated":
        return "from-red-500 to-rose-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const operators = [
    { symbol: "+", name: "Add", icon: Plus, color: "text-green-500" },
    { symbol: "-", name: "Subtract", icon: Minus, color: "text-red-500" },
    { symbol: "*", name: "Multiply", icon: X, color: "text-blue-500" },
    { symbol: "/", name: "Divide", icon: Divide, color: "text-purple-500" },
    { symbol: "%", name: "Modulo", icon: Percent, color: "text-orange-500" },
    {
      symbol: "(",
      name: "Open Parenthesis",
      icon: Parentheses,
      color: "text-gray-500",
    },
    {
      symbol: ")",
      name: "Close Parenthesis",
      icon: Parentheses,
      color: "text-gray-500",
    },
  ];

  const formulaRef = useRef<HTMLTextAreaElement>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (
    item: string,
    type: "column" | "operator" | "function"
  ) => {
    setDraggedItem(`${type}:${item}`);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    const [type, item] = draggedItem.split(":");
    let insertText = "";

    switch (type) {
      case "column":
        insertText = `${item}`;
        break;
      case "operator":
        insertText = ` ${item} `;
        break;
    }

    const textarea = formulaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newFormula =
        columnEdit.getValues("formula")?.substring(0, start) +
        insertText +
        columnEdit.getValues("formula")?.substring(end);
      columnEdit.setValue("formula", newFormula);

      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + insertText.length,
          start + insertText.length
        );
      }, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const insertAtCursor = (text: string) => {
    const textarea = formulaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newFormula =
        columnEdit.getValues("formula")?.substring(0, start) +
        text +
        columnEdit.getValues("formula")?.substring(end);
      //setFormula(newFormula);
      columnEdit.setValue("formula", newFormula);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    }
  };

  const clearFormula = () => {
    columnEdit.setValue("formula", "");
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className=" flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Formula Builder
            <Badge
              variant="secondary"
              className="ml-auto bg-primary text-primary-foreground"
            >
              {validateFormula() ? "Valid" : "Invalid"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label className=" text-primary">Formula Expression</Label>
          <div className="relative">
            <Textarea
              ref={formulaRef}
              value={columnEdit.watch("formula") || ""}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="min-h-24 font-mono text-sm"
              placeholder="Drag columns, operators, and functions here or type your formula..."
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={clearFormula}
              className="h-6 w-6 p-0 absolute top-2 right-2"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-6">
        {/* Available Columns */}
        <Card>
          <CardHeader>
            <CardTitle className=" text-lg">Available Columns</CardTitle>
            <p className="text-muted-foreground text-sm">
              Drag columns into your formula
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {columns
                .filter((col) => col.type === "number")
                .map((column) => {
                  const IconComponent = getColumnIcon(column.type);
                  return (
                    <motion.div
                      key={column.id}
                      draggable
                      onDragStart={() =>
                        handleDragStart(column.id, "column")
                      }
                      onDragEnd={handleDragEnd}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileDrag={{ scale: 1.05, rotate: 5 }}
                      className="flex items-center gap-3 p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all"
                    >
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${getColumnColor(
                          column.type
                        )} shadow-lg`}
                      >
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className=" font-medium text-sm">{column.label}</p>
                        <p className="text-muted-foreground text-xs capitalize">
                          {column.type}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => insertAtCursor(`${column.id}`)}
                        className="h-6 w-6 p-0 "
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className=" text-lg">Operators</CardTitle>
            <p className="text-muted-foreground text-sm">
              Mathematical and logical operators
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {operators.map((operator) => (
                <motion.div
                  key={operator.symbol}
                  draggable
                  onDragStart={() =>
                    handleDragStart(operator.symbol, "operator")
                  }
                  onDragEnd={handleDragEnd}
                  whileHover={{ scale: 1.05 }}
                  whileDrag={{ scale: 1.1, rotate: 5 }}
                  className="flex items-center gap-2 p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all"
                >
                  <operator.icon className={`h-4 w-4 ${operator.color}`} />
                  <div className="flex-1">
                    <p className=" font-medium text-sm">{operator.symbol}</p>
                    <p className="text-muted-foreground text-xs">
                      {operator.name}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => insertAtCursor(` ${operator.symbol} `)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
