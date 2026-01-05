import { useState } from "react";
import { motion } from "framer-motion";
import StatsCard from "./StatsCard";
import SearchFilter from "./SearchFilter";
import { Crown, Shield, Upload, UserCheck, Users } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { containerVariants } from "@/constant";
import UserCredentialLog from "./user-credential-log";

const defaultStatGrid = [
  {
    title: "Admins",
    count: 1,
    icon: Crown,
    color: "from-red-500 to-pink-500",
    bgColor: "from-red-50 to-pink-50",
  },
  {
    title: "Managers",
    count: 1,
    icon: Shield,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
  },
  {
    title: "Employees",
    count: 2,
    icon: Users,
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50",
  },
  {
    title: "Total Users",
    count: 4,
    icon: UserCheck,
    color: "from-purple-500 to-indigo-500",
    bgColor: "from-purple-50 to-indigo-50",
  },
];

export default function AdminDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
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
          title="Users Credential"
          description="Manage user accounts and permissions with advanced controls"
        />
        
        {/* Stats Cards */}
        <StatsCard statGrid={startGrid} />

        {/* Search and Filters */}
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
        />

        {/* User Management Table */}
        <UserCredentialLog
          title="User Management"
          logo={Users}
          roleFilter={roleFilter}
          defaultStatGrid={defaultStatGrid}
          searchTerm={searchTerm}
          setShowLogs={() => {}}
          setStartGrid={setStartGrid}
        />
      </motion.div>
    </div>
  );
}
