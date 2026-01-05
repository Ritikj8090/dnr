import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, type Variants } from "framer-motion";
import { BarChart3 } from "lucide-react";

interface MonthlyProgressProps {
  progressData: {
    label: string;
    value: number;
    max: number;
    color: string;
  }[];
}

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const MonthlyProgress = ({ progressData }: MonthlyProgressProps) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Monthly Progress
          </CardTitle>
          <p className="text-sm text-muted-foreground">Document generation targets</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {progressData.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">
                  {item.value}/{item.max}
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={(item.value / item.max) * 100}
                  className="h-3"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-full opacity-80`}
                  style={{ width: `${(item.value / item.max) * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MonthlyProgress;
