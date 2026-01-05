import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, type Variants } from "framer-motion";
import { Zap, type LucideProps } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickActionProps {
  quickActions: {
    title: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    color: string;
    bgColor: string;
    path?: string; 
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

const QuickAccess = ({ quickActions }: QuickActionProps) => {
  const navigate = useNavigate();

  return (
    <motion.div variants={itemVariants}>
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Generate new documents or manage existing ones
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const clickable = Boolean(action.path);
              return (
                <motion.div
                  key={action.title}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    role={clickable ? "link" : undefined}
                    tabIndex={clickable ? 0 : -1}
                    aria-label={clickable ? `Go to ${action.title}` : undefined}
                    className={`${
                      clickable
                        ? "cursor-pointer hover:ring-2 hover:ring-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        : ""
                    }`}
                    onClick={() => action.path && navigate(action.path)}
                    onKeyDown={(e) => {
                      if (!clickable) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(action.path!);
                      }
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <div
                        className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg`}
                      >
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <p className="font-medium text-sm">{action.title}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuickAccess;
