import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import QuoteDetailsComp from "./QuoteDetails";
import ClientInformationComp from "./ClientInformation";
import type { Column, QuotationItem } from "@/types";
import { useNavigate, useParams } from "react-router-dom";
import { createQuotation, editQuotation, getQuotationsById } from "@/lib/apis";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/authSlice";
import PageHeader from "@/components/PageHeader";
import ColumnEditor from "./ColumnEdit";
import { Button } from "@/components/ui/button";
import { Ellipsis, FolderClock, Settings2Icon } from "lucide-react";
import Table from "@/components/Table";
import PdfConvertor from "@/components/PdfConvertor";
import QuotationHTML from "@/html/quotation";
import { calculateTotal, containerVariants, currency, VAT_RATE } from "@/constant";
import { setAlertShowPopUp } from "@/store/alertPopupSlice";
import { setFailed, setShowPopUp } from "@/store/popupSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ShowLogs from "@/components/ShowLogs";
import QuotationLog from "./QuotationLog";

const defaultColumns: Column[] = [
  {
    id: "description",
    label: "Description",
    type: "text",
    width: "300px",
    required: true,
  },
  {
    id: "quantity",
    label: "Quantity",
    type: "number",
    width: "100px",
    required: true,
  },
  {
    id: "unit_rate",
    label: "Unit Rate",
    type: "number",
    width: "120px",
    required: true,
  },
  {
    id: "amount",
    label: "Amount",
    type: "calculated",
    width: "120px",
    formula: "quantity * unit_rate",
  },
];

export const clientInformationSchema = z.object({
  companyName: z.string().min(1, { message: "Company name is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  attention: z.string().min(1, { message: "Recipient name is required" }),
  designation: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  address: z.string().min(1, { message: "Address is required" }),
  website: z.string().optional(),
  subject: z.string().min(1, { message: "Subject is required" }),
  project: z.string().min(1, { message: "Project is required" }),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  scopes: z.array(z.string()).optional(),
});

export const quoteDetailsSchema = z.object({
  referenceNo: z.string().optional(),
  date: z.date({
    required_error: "A creation date is required.",
  }),
  expirationAt: z.date({
    required_error: "A expiry date is required.",
  }),
  currencyCode: z.string().optional(),
});

export default function QuotationGeneratePage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [items, setItems] = useState<QuotationItem[]>([
    {
      id: 1,
      description: "Fire Safety System",
      quantity: 2,
      unit_rate: 1000,
    },
    {
      id: 2,
      description: "Security Cameras",
      quantity: 3,
      unit_rate: 3000,
    },
  ]);

  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const clientInformation = useForm<z.infer<typeof clientInformationSchema>>({
    resolver: zodResolver(clientInformationSchema),
    mode: "onChange",
    defaultValues: {
      companyName: "",
      attention: "",
      designation: "",
      email: "",
      project: "",
      phone: "",
      address: "",
      website: "",
      subject: "",
      title: "",
      scopes: [],
    },
  });

  const quoteDetails = useForm<z.infer<typeof quoteDetailsSchema>>({
    resolver: zodResolver(quoteDetailsSchema),
    mode: "onChange",
    defaultValues: {
      referenceNo: "",
      date: today,
      expirationAt: tomorrow,
      currencyCode: currency.code || "",
    },
  });

  useEffect(() => {
    if (id) {
      // Fetch quotation details by ID
      const fetchQuotation = async () => {
        const res = (await getQuotationsById({ quotationId: id })).data
          .resultContent;
        console.log(res);
        // -----------------------------
        // Client & header fields
        // -----------------------------
        clientInformation.reset({
          companyName: res.quotation?.company_name || "",
          attention: res.quotation?.attention || "",
          designation: res.quotation?.designation || "",
          email: res.quotation?.email || "",
          project: res.quotation?.project || "",
          phone: res.quotation?.phone || "",
          address: res.quotation?.address || "",
          website: res.quotation?.website || "",
          subject: res.quotation?.subject || "",
          title: res.quotation?.title || "",
          scopes: res.quotation?.scopes || [],
        });
        quoteDetails.reset({
          referenceNo: res.quotation?.reference_no || "",
          date: today,
          expirationAt:
            new Date(res.quotation?.expiration_at) > tomorrow
              ? new Date(res.quotation?.expiration_at)
              : tomorrow,
          currencyCode: res.quotation?.currency_code || "",
        });

        // -----------------------------
        // Columns - ensure creation order (order_index)
        // -----------------------------
        const apiCols = Array.isArray(res.columns) ? [...res.columns] : [];
        apiCols.sort((a: any, b: any) => {
          const ao = (a.order_index ?? Number.MAX_SAFE_INTEGER) as number;
          const bo = (b.order_index ?? Number.MAX_SAFE_INTEGER) as number;
          // stable fallback by name if no index
          return (
            ao - bo ||
            String(a.column_name).localeCompare(String(b.column_name))
          );
        });

        const uiColumns: Column[] = apiCols.map((col: any) => ({
          id: col.column_id,
          label: col.column_name,
          type: col.input_type,
          width: col.width,
          options: [],
          formula: col.formula,
          required: col.required,
        }));
        setColumns(uiColumns);

        // -----------------------------
        // Rows & cells - respect row_index and column order
        // -----------------------------
        const cellsByRow: Record<string, Record<string, string>> = {};
        (res.cells ?? []).forEach((cell: any) => {
          const { row_id, column_id, value } = cell;
          (cellsByRow[row_id] ??= {})[column_id] = value;
        });

        const sortedRows = (res.rows ?? [])
          .slice()
          .sort((a: any, b: any) => (a.row_index ?? 0) - (b.row_index ?? 0));

        const fetchedItems: QuotationItem[] = sortedRows.map(
          (r: any, idx: number) => {
            const raw = cellsByRow[r.id] ?? {};
            const item: any = { id: idx + 1 };
            for (const col of apiCols) {
              const v = raw[col.column_id];
              // convert likely numeric fields to numbers
              const isNum =
                col.input_type === "number" ||
                col.column_id === "quantity" ||
                col.column_id === "unit_rate";
              item[col.column_id] = isNum ? Number(v ?? 0) : v ?? "";
            }
            return item as QuotationItem;
          }
        );

        setItems(fetchedItems);
      };

      fetchQuotation();
    }
    dispatch(setLoading(false));
  }, [id, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveColumn = (column: Column) => {
    if (editingColumn) {
      // Update existing column
      setColumns((prev) =>
        prev.map((col) => (col.id === editingColumn.id ? column : col))
      );
    } else {
      // Add new column
      const updatedItems = items.map((item) => ({ ...item, [column.id]: 0 }));
      setItems(updatedItems);
      setColumns((prev) => [...prev, column]);
    }
    setIsColumnDialogOpen(false);
    setEditingColumn(null);
  };

  const removeColumn = (columnId: string) => {
    setColumns((prev) => prev.filter((col) => col.id !== columnId));
    setItems((prev) =>
      prev.map((row) => {
        const newRow = { ...row } as any;
        delete newRow[columnId];
        return newRow as QuotationItem;
      })
    );
    setIsColumnDialogOpen(false);
    setEditingColumn(null);
  };

  const { subtotal, vatAmount, total } = calculateTotal({ items, columns });

  const handleBackend = async () => {
    const q = quoteDetails.getValues();
    const c = clientInformation.getValues();

    const payload = {
      referenceNo: q.referenceNo || "",
      date: q.date,
      expirationAt: q.expirationAt,
      companyName: c.companyName,
      attention: c.attention,
      designation: c.designation,
      email: c.email,
      address: c.address,
      website: c.website,
      subject: c.subject,
      project: c.project,
      title: c.title,
      phone: c.phone,
      vat: VAT_RATE,
      scopes: c.scopes || [],
      currencyCode: q.currencyCode || "",
      // IMPORTANT: Build cells in the exact column order
      rows: items.map((row, index) => ({
        rowIndex: index,
        cells: columns.reduce((acc, col) => {
          acc[col.id] = String((row as any)[col.id] ?? "");
          return acc;
        }, {} as Record<string, string>),
      })),
      // columns go out in the same left-to-right order the user sees
      columns: columns.map((col: Column) => ({
        columnId: col.id,
        columnName: col.label,
        required: col.required,
        inputType: col.type,
        options: col.options,
        width: col.width,
        formula: col.formula,
      })),
    }; 
    const res = id
      ? await editQuotation(payload)
      : await createQuotation(payload);

    if (res.data?.resultStatus === "S") {
      dispatch(
        setShowPopUp({
          title: `Quotation ${id ? "Updated" : "Created"} Successfully!`,
          description: `Your quotation has been ${
            id ? "updated" : "created"
          } and saved successfully.`,
        })
      );
      quoteDetails.setValue("referenceNo", res.data?.referenceNo);
      setTimeout(() => {
        navigate("/quotations-log");
      }, 1200);
    } else if (res.data?.resultStatus === "F") {
      dispatch(
        setShowPopUp({
          title: "Duplicate Quotation",
          description:
            "Duplicate quotation: ORIGINAL version already exists for this reference number and user",
        })
      );
      dispatch(setFailed(true));
    }
  };

  const handleQuotationSubmit = async () => {
    try {
      const q = await quoteDetails.trigger();
      const c = await clientInformation.trigger();
      if (!q || !c) return;

      dispatch(
        setAlertShowPopUp({
          title: "Are you sure?",
          description: `Want to ${id ? "update" : "create"} this quotation.`,
          onClick: handleBackend,
          isSubmitting:
            quoteDetails.formState.isSubmitting ||
            clientInformation.formState.isSubmitting,
        })
      );
    } catch (error) {
      dispatch(
        setShowPopUp({
          title: `Quotation ${id ? "Updation" : "Creation"} Failed!`,
          description: `An error occurred while ${
            id ? "updating" : "creating"
          } the quotation. Please try again later.`,
        })
      );
      dispatch(setFailed(true));
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen ">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-8 max-w-[110rem]"
      >
        {/* Header */}
        <PageHeader
          title="Quotation Generator"
          description="Create professional quotations with customizable columns"
        >
          <div className="flex gap-3">
            <div className=" flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="px-8" onClick={handleQuotationSubmit}>
                  <Settings2Icon className="h-4 w-4" />
                  {id ? "Update" : "Create"} Quotation
                </Button>
              </motion.div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant={"outline"}>
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className=" min-w-40">
                  <DropdownMenuItem>
                    <PdfConvertor
                      disabled={!quoteDetails.watch("referenceNo")}
                      endPoint="api/quotations/generate-html-pdf"
                      htmlFunction={async () => {
                        return await QuotationHTML({
                          columns,
                          items,
                          total,
                          subtotal,
                          vatAmount,
                          quoteDetails,
                          clientInformation,
                        });
                      }}
                    />
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLogs(true)}>
                    <FolderClock className=" h-4 w-4" />
                    View Logs
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </PageHeader>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <Table
            title="Quotation Items"
            columns={columns}
            setColumns={setColumns}
            items={items}
            setItems={setItems}
            setEditingColumn={setEditingColumn}
            setIsColumnDialogOpen={setIsColumnDialogOpen}
            currencyCode={quoteDetails.watch("currencyCode") || ""}
          />

          {/* Sidebar */}
          <div className="space-y-6">
            <QuoteDetailsComp quoteDetails={quoteDetails} />
            <ClientInformationComp clientInformation={clientInformation} />
          </div>
        </div>
      </motion.div>

      <ColumnEditor
        column={editingColumn}
        columns={columns}
        onSave={saveColumn}
        onCancel={() => {
          setIsColumnDialogOpen(false);
          setEditingColumn(null);
        }}
        ondelete={removeColumn}
        isColumnDialogOpen={isColumnDialogOpen}
        setIsColumnDialogOpen={setIsColumnDialogOpen}
        editingColumn={!!editingColumn}
      />

      <ShowLogs
        title="Quotations Log"
        description=""
        showLogs={showLogs}
        setShowLogs={setShowLogs}
        element={
          <QuotationLog
            defaultStatGrid={[]}
            setShowLogs={setShowLogs}
            setStartGrid={() => {}}
          />
        }
      />
    </div>
  );
}
