import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Ellipsis, FolderClock, Settings2Icon } from "lucide-react";
import type { BillPayload, Column, QuotationItem } from "@/types";
import { useEffect, useState } from "react";
import Table from "@/components/Table";
import PdfConvertor from "@/components/PdfConvertor";
import InvoiceHTML from "@/html/invoice";
import BillDetails from "./BillDetails";
import ClientInformation from "./ClientInformation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import {
  calculateTotal,
  containerVariants,
  currency,
  PAYMENT_MODE,
  VAT_RATE,
} from "@/constant";
import { useDispatch, useSelector } from "react-redux";
import { setAlertShowPopUp } from "@/store/alertPopupSlice";
import { setShowPopUp, setFailed } from "@/store/popupSlice";
import { createBill, getBillById, updateBill } from "@/lib/apis";
import type { RootState } from "@/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ShowLogs from "@/components/ShowLogs";
import BillLog from "./BillLog";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";

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

export const billDetailsSchema = z.object({
  invoiceNo: z.string().optional(),
  date: z.date({
    required_error: "A creation date is required.",
  }),
  paymentMode: z.enum(PAYMENT_MODE),
  amountReceived: z
    .number({ invalid_type_error: "Received amount must be a number" })
    .nonnegative("Cannot be negative")
    .optional()
    .default(0),
  currencyCode: z.string().optional(),
});

export const clientInformationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  companyName: z.string().min(1, { message: "Company name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  address: z.string().min(1, { message: "Address is required" }),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});

const BillGenerator = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const primaryCtaLabel = isEditing ? "Update Bill" : "Generate Bill";
  const navigate = useNavigate();

  const [items, setItems] = useState<QuotationItem[]>(
    isEditing
      ? []
      : [
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
        ]
  );

  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const { subtotal, vatAmount, total } = calculateTotal({ items, columns });

  const today = new Date();

  const billDetails = useForm<z.infer<typeof billDetailsSchema>>({
    resolver: zodResolver(billDetailsSchema),
    mode: "onChange",
    defaultValues: {
      invoiceNo: "",
      date: today,
      paymentMode: "Cash",
      amountReceived: undefined,
      currencyCode: currency.code || "",
    },
  });

  const clientInformation = useForm<z.infer<typeof clientInformationSchema>>({
    resolver: zodResolver(clientInformationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      companyName: "",
      email: "",
      phone: "",
      address: "N/A",
    },
  });

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await getBillById(id); // <-- USE THE NEW API
        // console.log("🔍 getBillById(single):", res.data);

        // Support both shapes: {resultContent: {...}} or the object directly
        const data = res.data?.resultContent ?? res.data;
        const bill = data?.content?.[0] ?? data;
        if (!bill) return;

        billDetails.reset({
          invoiceNo: bill.invoiceNo ?? bill.invoice_no ?? "",
          date: bill.invoiceDate
            ? new Date(`${bill.invoiceDate}T00:00:00`)
            : new Date(),
          paymentMode: bill.paymentMode ?? bill.payment_mode ?? "Cash",
          amountReceived: (() => {
            const raw = Number(
              bill.amountReceived ??
                bill.amount_received ??
                bill.receivedAmount ??
                NaN
            );
            if (!Number.isFinite(raw) || raw === 0) return undefined; // ⬅️ treat 0/missing as blank in edit mode
            return raw;
          })(),
          currencyCode: bill.currencyCode ?? bill.currency_code,
        });

        clientInformation.reset({
          name: bill.customerName ?? bill.customer_name ?? bill.name ?? "",
          companyName:
            bill.customerCompany ??
            bill.customer_company ??
            bill.companyName ??
            "",
          email: bill.customerEmail ?? bill.customer_email ?? bill.email ?? "",
          phone: bill.contactNumber ?? bill.contact_number ?? bill.phone ?? "",
          address:
            bill.customerAddress ??
            bill.customer_address ??
            bill.address ??
            "N/A",
        });

        const raw =
          bill.items ??
          bill.itemsJson ??
          bill.items_json ??
          bill.lineItems ??
          bill.line_items ??
          [];

        const arr = typeof raw === "string" ? JSON.parse(raw) : raw;

        setItems(
          (Array.isArray(arr) ? arr : []).map((it: any, i: number) => ({
            id: i + 1,
            description: it.description ?? it.desc ?? "",
            quantity: Number(it.qty ?? it.quantity ?? 0),
            unit_rate: Number(it.unitPrice ?? it.unit_rate ?? it.rate ?? 0),
          }))
        );
      } catch (e) {
        console.error("Failed to load bill", e);
      }
    })();
  }, [id, billDetails, clientInformation]);

  const handleBackend = async () => {
    const b = billDetails.getValues();
    const c = clientInformation.getValues();

    const invoiceDate = format(b.date, "yyyy-MM-dd");

    const itemsPayload = items.map((row) => {
      const qty = Number(row.quantity ?? 0);
      const unitPrice = Number(row.unit_rate ?? 0);
      return {
        description: String(row.description ?? ""),
        qty,
        unitPrice,
        amount: qty * unitPrice,
      };
    });

    const amountReceived = Number(b.amountReceived ?? 0);
    const balanceDue = Math.max(total - amountReceived, 0);

    const payload: BillPayload = {
      invoiceDate,
      customerName: c.name,
      customerCompany: c.companyName,
      contactNumber: c.phone,
      customerAddress: c.address || "N/A",
      customerEmail: c.email, // ⬅️ make sure BillPayload has this field
      subtotal,
      gstPercent: VAT_RATE,
      gstAmount: vatAmount,
      totalAmount: total,
      amountReceived,
      balanceDue,
      paymentMode: b.paymentMode,
      items: itemsPayload,
      currencyCode: b.currencyCode || "USD",
    };

    try {
      // ⬅️ key switch: update when editing, create otherwise
      const res = isEditing
        ? await updateBill({ id: id!, ...payload })
        : await createBill(payload);

      console.log(
        isEditing ? "UPDATE BILL RESULT:" : "CREATE BILL RESULT:",
        res
      );

      if (res.data?.resultStatus === "S") {
        dispatch(
          setShowPopUp({
            title: isEditing
              ? "Bill Updated Successfully!"
              : "Bill Created Successfully!",
            description: `Invoice ${res.data.invoiceNo} has been saved.`,
          })
        );
        billDetails.setValue("invoiceNo", res.data.invoiceNo ?? "");
        setTimeout(() => navigate("/bills-log"), 1200);
      } else {
        dispatch(
          setShowPopUp({
            title: isEditing ? "Bill Update Failed" : "Bill Creation Failed",
            description: res.data?.resultMessage ?? "Unknown error",
          })
        );
        dispatch(setFailed(true));
      }
    } catch (error: any) {
      console.error(
        isEditing ? "UPDATE BILL ERROR:" : "CREATE BILL ERROR:",
        error
      );
      dispatch(
        setShowPopUp({
          title: isEditing ? "Bill Update Failed" : "Bill Creation Failed",
          description:
            error?.response?.data?.message ?? error.message ?? "Error",
        })
      );
      dispatch(setFailed(true));
    }
  };

  const handleBillSubmit = async () => {
    // ✅ Hard stop in EDIT mode if Amount Received is blank (undefined)
    if (isEditing) {
      const ar = billDetails.getValues().amountReceived;
      const asNumber =
        typeof ar === "string"
          ? ar.trim() === ""
            ? undefined
            : Number(ar)
          : ar;

      if (asNumber === undefined || Number.isNaN(asNumber)) {
        billDetails.setError("amountReceived", {
          type: "manual",
          message: "Amount received is required.",
        });
        // @ts-ignore
        billDetails.setFocus?.("amountReceived");
        return; // ⛔ don't proceed to confirm/update
      }
    }

    // ✅ Run RHF/Zod validations for both forms
    const [billOk, clientOk] = await Promise.all([
      billDetails.trigger(undefined, { shouldFocus: true }),
      clientInformation.trigger(undefined, { shouldFocus: true }),
    ]);
    if (!billOk || !clientOk) return;

    // ⬇️ put this BEFORE opening the confirm dialog
    {
      // pull the latest entered value (can be number | undefined | string)
      const raw = billDetails.getValues().amountReceived ?? 0;
      const ar =
        typeof raw === "string"
          ? Number(raw.replace(/[^\d.]/g, "")) // keep digits/decimal if any
          : Number(raw);

      if (Number.isFinite(ar) && ar > total) {
        billDetails.setError("amountReceived", {
          type: "manual",
          message: "Amount received cannot exceed the total amount.",
        });
        // @ts-ignore
        billDetails.setFocus?.("amountReceived");
        return; 
      }
    }

    // ✅ Open confirm dialog; proceed only if user confirms
    dispatch(
      setAlertShowPopUp({
        title: "Are you sure?",
        description: isEditing
          ? "Want to update this bill?"
          : "Want to generate bill?",
        isSubmitting:
          billDetails.formState.isSubmitting ||
          clientInformation.formState.isSubmitting,
        onClick: handleBackend,
      })
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-6 py-8 max-w-[110rem] relative z-10"
      >
        <PageHeader
          title="Bill Generator"
          description="A digital tool for creating, managing, and customizing bills, invoices, and receipts efficiently online."
        >
          <div className="flex gap-3">
            <div className=" flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="px-8" onClick={handleBillSubmit}>
                  <Settings2Icon className="h-4 w-4" />
                  {primaryCtaLabel}{" "}
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
                      disabled={!billDetails.watch("invoiceNo")}
                      endPoint="api/bills/generate"
                      htmlFunction={async () => {
                        const c = clientInformation.getValues();
                        const b = billDetails.getValues();
                        return await InvoiceHTML({
                          invoiceNo: b.invoiceNo || "",
                          invoiceDate: b.date.toDateString(),
                          customerName: c.name,
                          customerCompany: c.companyName,
                          contactNumber: c.phone,
                          customerEmail: c.email,
                          customerAddress: c.address,
                          items,
                          columns,
                          currencyCode: b.currencyCode || currency.code,
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
            title="Bill Items"
            items={items}
            setItems={setItems}
            columns={columns}
            setColumns={setColumns}
            setEditingColumn={setEditingColumn}
            setIsColumnDialogOpen={setIsColumnDialogOpen}
            showAddColumn={false}
            currencyCode={billDetails.watch("currencyCode") || "USD"}
          />

          {/* Sidebar */}
          <div className="space-y-6">
            <BillDetails
              billDetails={billDetails}
              isEditing={isEditing}
              totalAmount={total}
            />
            <ClientInformation
              clientInformation={clientInformation}
              isEditing={isEditing}
            />
          </div>
        </div>
      </motion.div>
      <ShowLogs
        title="Bills Log"
        description=""
        showLogs={showLogs}
        setShowLogs={setShowLogs}
        element={
          <BillLog
            defaultStatGrid={[]}
            setShowLogs={setShowLogs}
            setStartGrid={() => {}}
          />
        }
      />
    </div>
  );
};

export default BillGenerator;
