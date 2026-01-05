import { Card, CardContent } from "@/components/ui/card";
import { motion, type Variants } from "framer-motion";
import { type LucideProps } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatsCardProps {
  statGrid: {
    title: string;
    count: number;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    color: string;
    bgColor: string;
    path?: string; // <-- add this
  }[];
}

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const StatsCard = ({ statGrid }: StatsCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {statGrid.map((stat) => {
        const clickable = Boolean(stat.path);
        return (
          <motion.div
            key={stat.title}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card
              role={clickable ? "link" : undefined}
              tabIndex={clickable ? 0 : -1}
              className={`relative overflow-hidden shadow-xl ${
                clickable ? "cursor-pointer hover:ring-2 hover:ring-primary/50" : ""
              }`}
              onClick={() => stat.path && navigate(stat.path)}
              onKeyDown={(e) => {
                if (!clickable) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(stat.path!);
                }
              }}
            >
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.count}</p>
                  </div>
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StatsCard;
