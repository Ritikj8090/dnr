import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { FileText, Activity, DollarSign, Zap } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { GetDateByTimezone, GetTimeByTimezone } from "@/constant";
import type { Country } from "@/types";
import StatsCard from "@/components/StatsCard";
import { getTotalDocCount } from "@/lib/apis";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const defaultStatGrid = [
  {
    title: "Total Quotations",
    count: 0,
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
    path: "/quotations-log", 
  },
  {
    title: "Total Bills",
    count: 0,
    icon: Activity,
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50",
    path: "/bills-log", 
  },
  {
    title: "Total Offer letters",
    count: 0,
    icon: DollarSign,
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50",
    path: "/offer-letter-log", 
  },
  {
    title: "Avg Processing",
    count: 0,
    icon: Zap,
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-50 to-red-50",
    
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

export default function DashboardPage() {
  const [startGrid, setStartGrid] = useState(defaultStatGrid);
  const { user } = useSelector((state: RootState) => state.auth);

  const storedCountry = localStorage.getItem("selectedCountry");

  const timezone = storedCountry
    ? (JSON.parse(storedCountry) as Country).timezone
    : "Asia/Dubai";

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

  useEffect(() => {
    const fetchCount = async () => {
      const res = await getTotalDocCount({ createdBy: user.id as string });
      const offerCount = res.o.resultContent.total;
      const billCount = res.b.resultContent.total;
      const quotationCount = res.q.totalCount;
      const count = [quotationCount, billCount, offerCount, 0];

      const updatedStatGrid = defaultStatGrid.map((item, index) => ({
        ...item,
        count: count[index],
      }));

      setStartGrid(updatedStatGrid);
    };
    fetchCount();
  }, [user.id]);

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
          title="Dashboard"
          description="Welcome to your dashboard! Here you can manage your documents, track progress, and access quick actions."
        >
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current Time</p>
              <p className="font-bold font-mono text-primary text-2xl">
                {GetTimeByTimezone()}
              </p>
              <p className=" text-primary text-sm font-bold">
                {GetDateByTimezone()}
              </p>
              <p className=" text-sm font-bold text-muted-foreground">
                {timezone}
              </p>
            </div>
          </div>
        </PageHeader>

        {/* Stats Cards */}
        <StatsCard statGrid={startGrid} />
      </motion.div>
    </div>
  );
}
