import type {
  DragEndEvent,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import type { LucideProps } from "lucide-react";

export declare type QuotationData = {
  referenceNo?: string;
  date: Date; // ISO string format
  expirationAt: Date; // ISO string format
  companyName: string;
  attention: string;
  designation?: string;
  email: string;
  address: string;
  website?: string;
  subject: string;
  project: string;
  title: string;
  phone: string;
  alpha2?: string | undefined;
  alpha3?: string | undefined;
  rows: QuotationRow[];
  columns: QuotationColumn[];
};

export declare type QuotationRow = {
  rowIndex: number;
  cells: Record<string, string>;
};

export declare type QuotationColumn = {
  columnId: string;
  columnName: string;
  required?: boolean;
  inputType: string;
  options?: string[];
  width?: string;
  formula?: string;
};

export declare type QuotationDataWithoutRowColumn = {
  mode: "E" | "F";
  referenceNo: string;
  date: Date; // ISO string format
  expirationAt: Date; // ISO string format
  companyName: string;
  attention: string;
  designation: string;
  email: string;
  address: string;
  website: string;
  subject: string;
  project: string;
  phone: string;
  alpha2?: string | undefined;
  alpha3?: string | undefined;
};

export declare type ColumnType =
  | "text"
  | "number"
  | "select"
  | "date"
  | "calculated";

export declare type Column = {
  id: string;
  label: string;
  type: ColumnType;
  width?: string;
  options?: string[];
  formula?: string;
  required?: boolean;
};

export declare type QuotationItem = {
  id: number;
  [key: string]: string | number;
};

export declare type Summary = {
  total: number;
  subtotal: number;
  vatAmount: number;
};

export declare interface Table {
  addColumn: () => void;
  addItem: () => void;
  updateItem: (id: number, field: string, value: string | number) => void;
  sensors: SensorDescriptor<SensorOptions>[];
  handleDragEnd: (event: DragEndEvent) => void;
  columns: Column[];
  items: QuotationItem[];
  editColumn: (column: Column) => void;
  removeItem: (id: number) => void;
  calculateTotal: () => Summary;
}

export declare type User = {
  id: string;
  fullName: string;
  email: string;
  employeeId: string;
  role: "ADMIN" | "MANAGER" | "USER";
};

export declare type Country = {
  value: string;
  label: string;
  flag: string;
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
  phoneCode: string;
  timezone: string;
  dateFormat: string;
  region: string;
  continent: string;
};

export declare type BillItem = {
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
};

export declare type BillPayload = {
  invoiceDate: string;
  customerName: string;
  customerCompany: string;
  customerAddress: string;
  contactNumber: string;
  customerEmail: string;
  subtotal: number;
  gstPercent: number;
  gstAmount: number;
  totalAmount: number;
  amountReceived: number;
  balanceDue: number;
  paymentMode: string;
  createdBy?: string;
  items: BillItem[];
  currencyCode?: string;
};

// types/invoice.ts
export type PaymentMode = "Cash" | "Card" | "UPI";

export interface Invoice {
  id: string;
  subtotal: number;
  createdAt: string; // ISO datetime string, e.g. "2025-08-11T16:14:18.972626"
  createdBy: string;
  gstAmount: number;
  invoiceNo: string;
  balanceDue: number;
  gstPercent: number;
  invoiceDate: string; // ISO date string, e.g. "2025-07-25"
  paymentMode: PaymentMode;
  totalAmount: number;
  customerName: string;
  contactNumber: string;
  amountReceived: number;
  customerAddress: string;
  customerEmail?: string;
  currencyCode?: string;
}

export declare type OfferLetter = {
  employeeName: string;
  position: string;
  salary: string;
  joiningDate: Date;
  salaryBreakdown: {
    label: string;
    amount: string;
  }[];
};

interface SalaryBreakdown {
  // Adjust fields according to the actual structure of breakdown items
  [key: string]: string | number;
}

export interface OfferLetterBackend {
  candidate_name: string;
  created_at: string; // ISO date string
  created_by: string;
  ctc: string; // "1,222,222" — can keep as string or number if cleaned
  doc_version: string;
  id: string;
  joining_date: string; // YYYY-MM-DD
  position: string;
  salary_breakdown: SalaryBreakdown[];
  status: "GENERATED" | string;
  currency_code?: string;
}

export interface startGrid {
  title: string;
  count: number;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  color: string;
  bgColor: string;
}
