import { Separator } from "@/components/ui/separator";
import { VAT_RATE } from "@/constant";
import { motion } from "framer-motion";

interface Summary {
  total: number;
  subtotal: number;
  vatAmount: number;
}

const SummaryComp = ({ total, subtotal, vatAmount }: Summary) => {
  return (
    <div className="space-y-3 px-4 pb-5">
      <div className="flex justify-between items-center">
        <span>Subtotal</span>
        <span className="font-semibold">{subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center">
        <span>VAT ({VAT_RATE}%)</span>
        <span className="font-semibold">{vatAmount.toLocaleString()}</span>
      </div>
      <Separator />
      <div className="flex justify-between items-center text-lg font-bold">
        <span>Total Amount</span>
        <motion.span
          key={total}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className=" text-primary"
        >
          {total.toLocaleString()}
        </motion.span>
      </div>
    </div>
  );
};

export default SummaryComp;
