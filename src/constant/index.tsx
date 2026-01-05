import type { Column, Country, QuotationItem } from "@/types";
import {
  ChartCandlestickIcon,
  ContactIcon,
  FileCheckIcon,
  FileClock,
  FileUser,
  FolderClock,
  HomeIcon,
  InfoIcon,
  LayoutDashboardIcon,
  LockKeyhole,
  LogInIcon,
  ReceiptIcon,
  Settings,
  User2Icon,
  UserCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import type { Variants } from "framer-motion";
import LOGO_IMG from "@/assets/logo1.png";

interface CountryData {
  value: string;
  label: string;
  flag: string;
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
  phoneCode: string;
  timezone: string[]; // note: array in your data
  dateFormat: string;
  language: string[];
  region: string;
  continent: string;
}

export const LOGO = LOGO_IMG;
const general = localStorage.getItem("general");
const storedCountry = localStorage.getItem("selectedCountry");

export const currency = storedCountry
  ? (JSON.parse(storedCountry) as Country).currency
  : { code: "AED", symbol: "د.إ", name: "UAE Dirham" };

export const DEFAULT_COUNTRY_CODE = "AE";
export const PAGE_SIZE = 20;
export const BASE_URL = import.meta.env.VITE_API_URL;
export const VAT_RATE = general ? JSON.parse(general).vat : 5;
export const PAYMENT_MODE = ["Cash", "Card", "UPI"] as const;

export const navbarList = [
  { name: "Home", url: "/", icon: <HomeIcon size={18} /> },
  { name: "About", url: "/about", icon: <InfoIcon size={18} /> },
  { name: "Contact", url: "/contact", icon: <ContactIcon size={18} /> },
  { name: "Login", url: "/login", icon: <LogInIcon size={18} /> },
];

export const authNavbarList = [
  { name: "Dashboard", url: "/dashboard", icon: <LayoutDashboardIcon size={18} /> },
  { name: "Generate credential for user", url: "/generate-credential", icon: <User2Icon size={18} /> },
];

/** Role-aware sidebar. Call like: const items = sidebarList(role) */
export const sidebarList = (role: "ADMIN" | "USER" | "MANAGER") => {
  const isAdmin = role === "ADMIN";
  return [
    {
      name: "Bill Generator",
      url: "/bill-generator",
      icon: <ReceiptIcon size={18} />,
      access: ["ADMIN", "USER", "MANAGER"],
    },
    {
      name: "Quotation Generator",
      url: "/quotation-generator",
      icon: <ChartCandlestickIcon size={18} />,
      access: ["ADMIN", "USER", "MANAGER"],
    },
    {
      name: "Offer Letter Generator",
      url: "/offer-letter-generator",
      icon: <FileCheckIcon size={18} />,
      access: ["ADMIN"],
    },
    {
      name: isAdmin ? "Admin Dashboard" : "User Dashboard",
      url: isAdmin ? "/admin-dashboard" : "/dashboard",
      icon: <UserCircle2 size={18} />,
      access: ["ADMIN", "USER", "MANAGER"],
      subMenu: [
        {
          name: "Quotations Log",
          url: "/quotations-log",
          icon: <FolderClock size={18} />,
          access: ["ADMIN", "USER", "MANAGER"],
        },
        {
          name: "Bills Log",
          url: "/bills-log",
          icon: <FileClock size={18} />,
          access: ["ADMIN", "USER", "MANAGER"],
        },
        ...(isAdmin
          ? [
              {
                name: "Offer Letter Log",
                url: "/offer-letter-log",
                icon: <FileUser size={18} />,
                access: ["ADMIN"],
              },
              {
                name: "Users Credentials",
                url: "/users-credentials",
                icon: <LockKeyhole size={18} />,
                access: ["ADMIN"],
              },
            ]
          : []),
      ],
    },
    {
      name: "Settings",
      url: "/settings",
      icon: <Settings size={18} />,
      access: ["ADMIN", "USER", "MANAGER"],
    },
  ];
};

export function calculateFormula(data: QuotationItem, formula: string) {
  try {
    const keys = Object.keys(data);
    const args = keys.join(", ");
    const values = keys.map((k) => (data as any)[k]);
    const fn = new Function(args, `return ${formula}`);
    const result = fn(...values);
    return { system: (data as any).system || "Unknown", result };
  } catch (err) {
    return { error: `Invalid formula or data: ${err}` as string };
  }
}

export const countryData: CountryData[] = [
  { value: "us", label: "United States", flag: "🇺🇸", currency: { code: "USD", symbol: "$", name: "US Dollar" }, phoneCode: "+1", timezone: ["America/New_York","America/Chicago","America/Denver","America/Los_Angeles"], dateFormat: "MM/dd/yyyy", language: ["English"], region: "North America", continent: "North America" },
  { value: "gb", label: "United Kingdom", flag: "🇬🇧", currency: { code: "GBP", symbol: "£", name: "British Pound" }, phoneCode: "+44", timezone: ["Europe/London"], dateFormat: "dd/MM/yyyy", language: ["English"], region: "Western Europe", continent: "Europe" },
  { value: "ca", label: "Canada", flag: "🇨🇦", currency: { code: "CAD", symbol: "C$", name: "Canadian Dollar" }, phoneCode: "+1", timezone: ["America/Toronto","America/Vancouver","America/Edmonton"], dateFormat: "dd/MM/yyyy", language: ["English","French"], region: "North America", continent: "North America" },
  { value: "au", label: "Australia", flag: "🇦🇺", currency: { code: "AUD", symbol: "A$", name: "Australian Dollar" }, phoneCode: "+61", timezone: ["Australia/Sydney","Australia/Melbourne","Australia/Perth"], dateFormat: "dd/MM/yyyy", language: ["English"], region: "Oceania", continent: "Australia" },
  { value: "de", label: "Germany", flag: "🇩🇪", currency: { code: "EUR", symbol: "€", name: "Euro" }, phoneCode: "+49", timezone: ["Europe/Berlin"], dateFormat: "dd.MM.yyyy", language: ["German"], region: "Western Europe", continent: "Europe" },
  { value: "fr", label: "France", flag: "🇫🇷", currency: { code: "EUR", symbol: "€", name: "Euro" }, phoneCode: "+33", timezone: ["Europe/Paris"], dateFormat: "dd/MM/yyyy", language: ["French"], region: "Western Europe", continent: "Europe" },
  { value: "jp", label: "Japan", flag: "🇯🇵", currency: { code: "JPY", symbol: "¥", name: "Japanese Yen" }, phoneCode: "+81", timezone: ["Asia/Tokyo"], dateFormat: "yyyy/MM/dd", language: ["Japanese"], region: "East Asia", continent: "Asia" },
  { value: "in", label: "India", flag: "🇮🇳", currency: { code: "INR", symbol: "₹", name: "Indian Rupee" }, phoneCode: "+91", timezone: ["Asia/Kolkata"], dateFormat: "dd/MM/yyyy", language: ["Hindi","English"], region: "South Asia", continent: "Asia" },
  { value: "br", label: "Brazil", flag: "🇧🇷", currency: { code: "BRL", symbol: "R$", name: "Brazilian Real" }, phoneCode: "+55", timezone: ["America/Sao_Paulo","America/Manaus"], dateFormat: "dd/MM/yyyy", language: ["Portuguese"], region: "South America", continent: "South America" },
  { value: "mx", label: "Mexico", flag: "🇲🇽", currency: { code: "MXN", symbol: "$", name: "Mexican Peso" }, phoneCode: "+52", timezone: ["America/Mexico_City"], dateFormat: "dd/MM/yyyy", language: ["Spanish"], region: "North America", continent: "North America" },
  { value: "ae", label: "United Arab Emirates", flag: "🇦🇪", currency: { code: "AED", symbol: "د.إ", name: "UAE Dirham" }, phoneCode: "+971", timezone: ["Asia/Dubai"], dateFormat: "dd/MM/yyyy", language: ["Arabic"], region: "Middle East", continent: "Asia" },
];

export function GetTimeByTimezone() {
  const [time, setTime] = useState("");
  const stored = localStorage.getItem("selectedCountry");
  const tzField = stored ? (JSON.parse(stored) as Country).timezone : "Asia/Dubai";
  const tz = Array.isArray(tzField) ? tzField[0] : tzField;

  useEffect(() => {
    const updateTime = () => {
      const t = new Date().toLocaleString("en-US", {
        timeZone: tz as any,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setTime(t);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [tz]);

  return time;
}

export function GetDateByTimezone() {
  const stored = localStorage.getItem("selectedCountry");
  const tzField = stored ? (JSON.parse(stored) as Country).timezone : "Asia/Dubai";
  const tz = Array.isArray(tzField) ? tzField[0] : tzField;
  const formatString = stored
    ? (JSON.parse(stored) as Country).dateFormat
    : "dd/MM/yyyy";
  const date = new Date().toLocaleDateString("en-US", { timeZone: tz as any });
  return format(date, formatString);
}

export const calculateTotal = ({
  items,
  columns,
}: {
  items: QuotationItem[];
  columns: Column[];
}) => {
  const subtotal = items.reduce((sum, item) => {
    const amountColumn = columns.find((col) => col.id === "amount");
    if (amountColumn) {
      const { result: amount } = calculateFormula(
        item,
        amountColumn.formula || ""
      );
      return sum + amount;
    }
    return sum + ((item as any).amount || 0);
  }, 0);
  const vatAmount = (subtotal * VAT_RATE) / 100;
  const total = subtotal + vatAmount;
  return { subtotal, vatAmount, total };
};

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "ORIGINAL":
      return "bg-green-100/70 text-green-800/80 border-green-200/70";
    case "REVISE":
      return "bg-yellow-100/70 text-yellow-800/80 border-yellow-200/70";
    case "EXPIRED":
      return "bg-red-100/70 text-red-800/80 border-red-200/70";
    default:
      return "bg-gray-100/70 text-gray-800/80 border-gray-200/70";
  }
};

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
