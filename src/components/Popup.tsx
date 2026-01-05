import { CheckCircle, Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { resetPopUp, setFailed } from "@/store/popupSlice";
import { useEffect } from "react";
import type { RootState } from "@/store";

const PopUp = () => {
  const dispatch = useDispatch();
  const { title, description, failed, showPopUp } = useSelector(
    (state: RootState) => state.popup
  );

  useEffect(() => {
    if (!showPopUp) return;
    const timer = setTimeout(() => {
      dispatch(resetPopUp());
    }, 3000);
    const timer2 = setTimeout(() => {
      dispatch(setFailed(false));
    }, 3500);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [dispatch, showPopUp]);

  return (
    <Dialog
      open={showPopUp}
      onOpenChange={() => {
        dispatch(resetPopUp());
        setTimeout(() => {
          dispatch(setFailed(false));
        }, 500);
      }}
    >
      <DialogContent
        className={cn(
          "sm:max-w-[425px] bg-gradient-to-tr  p-6 text-white border-none",
          failed ? "from-red-500 to-red-700" : "from-green-500 to-green-700"
        )}
      >
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription aria-describedby=""></DialogDescription>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            {failed ? (
              <X className="h-8 w-8 text-white" />
            ) : (
              <CheckCircle className="h-8 w-8 text-white" />
            )}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-center mb-2"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-green-100 text-center"
          >
            {description}
          </motion.p>
        </DialogHeader>

        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          >
            <Sparkles className="h-4 w-4 text-white/60" />
          </motion.div>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default PopUp;
