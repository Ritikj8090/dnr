import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  FileText,
  Users,
  Activity,
  DollarSign,
  Zap,
  BarChart3,
  Settings,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatsCard from "@/components/StatsCard";
import MonthlyProgress from "@/components/MonthlyProgress";
import QuickAccess from "@/components/QuickAccess";
import BillLog from "@/pages/billGenerator/BillLog";

const defaultStatGrid = [
  {
    title: "Total Documents",
    count: 0,
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
  },
  {
    title: "Active Documents",
    count: 0,
    icon: Activity,
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50",
  },
  {
    title: "Revenue",
    count: 0,
    icon: DollarSign,
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50",
  },
  {
    title: "Avg Processing",
    count: 0,
    icon: Zap,
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-50 to-red-50",
  },
];

const progressData = [
  { label: "Bills", value: 80, max: 100, color: "from-blue-500 to-blue-600" },
  {
    label: "Quotes",
    value: 72,
    max: 100,
    color: "from-green-500 to-green-600",
  },
  {
    label: "Offers",
    value: 43,
    max: 80,
    color: "from-purple-500 to-purple-600",
  },
];

const quickActions = [
  {
    title: "New Bill",
    icon: FileText,
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100",
    path: "/bill-generator",
  },
  {
    title: "New Quote",
    icon: BarChart3,
    color: "from-green-500 to-green-600",
    bgColor: "from-green-50 to-green-100",
    path: "/quotation-generator",
  },
  {
    title: "Offer Letter",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100",
    path: "/offer-letter-generator", // admin-only route
  },
  {
    title: "Manage Users",
    icon: Settings,
    color: "from-orange-500 to-orange-600",
    bgColor: "from-orange-50 to-orange-100",
    path: "/users-credentials", // admin-only route
  },
];

export interface QuotationData {
  id: string;
  date: string;
  expiration_at: string;
  author_name: string;
  email: string;
  phone: string;
  status: string;
  address: string;
  pdf_url: string | null;
  project: string;
  subject: string;
  website: string;
  company_name: string;
  attention: string;
  created_at: string;
  created_by: string;
  doc_version: string;
  designation: string;
  reference_no: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function BillsLog() {
  const [startGrid, setStartGrid] = useState(defaultStatGrid);
  return (
    <div className="min-h-screen relative overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-6 py-8 max-w-[110rem] relative z-10"
      >
        {/* Header */}
        <PageHeader
          title="Bills Log"
          description="Welcome to your dashboard! Here you can manage your documents, track progress, and access quick actions."
        />

        {/* Stats Cards */}
        <StatsCard statGrid={startGrid} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Documents */}
          <BillLog
            defaultStatGrid={defaultStatGrid}
            setShowLogs={() => {}}
            setStartGrid={setStartGrid}
          />

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Monthly Progress */}
            <MonthlyProgress progressData={progressData} />

            {/* Quick Actions */}
            <QuickAccess quickActions={quickActions} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
