import { Card, CardContent } from "@/components/ui/card";
import { motion, type Variants } from "framer-motion";
import { type LucideProps } from "lucide-react";
import { Link } from "react-router-dom";

interface StatsCardProps {
  statGrid: {
    title: string;
    count: number;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    color: string;
    bgColor: string;
    path?: string; // <-- important
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
  return (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {statGrid.map((stat) => {
        const CardInner = (
          <Card
            className={`relative overflow-hidden shadow-xl ${
              stat.path ? "cursor-pointer hover:ring-2 hover:ring-primary/50" : ""
            }`}
          >
            {/* Make sure any overlay does NOT block clicks */}
            <div className="absolute inset-0 pointer-events-none" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1 text-muted-foreground">
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
        );

        return (
          <motion.div
            key={stat.title}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {stat.path ? (
              <Link to={stat.path} aria-label={stat.title} className="block">
                {CardInner}
              </Link>
            ) : (
              CardInner
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StatsCard;
