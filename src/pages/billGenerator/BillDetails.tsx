import { motion, type Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { z } from "zod";
import { type UseFormReturn } from "react-hook-form";
import type { billDetailsSchema } from "./BillGenerator";
import { PAYMENT_MODE } from "@/constant";

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
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

interface BillDetailsProps {
  billDetails: UseFormReturn<z.infer<typeof billDetailsSchema>>;
  /** When true, locks all fields except "Amount Received" and shows that field */
  isEditing?: boolean;
  totalAmount: number;
}

const BillDetails = ({
  billDetails,
  isEditing,
  totalAmount,
}: BillDetailsProps) => {
  // Sanitize to numerals only and convert to number (undefined when empty)
  const toDigitsNumber = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    return digits === "" ? undefined : Number(digits);
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Bill Details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...billDetails}>
            <form className="space-y-8">
              {/* Invoice No. (locked in edit mode; you can enable on create if desired) */}
              <FormField
                control={billDetails.control}
                name="invoiceNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice No.</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="DNR/FA/2025/007"
                        {...field}
                        className="w-full"
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date + Payment Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Creation Date (locked always per your earlier setup) */}
                <FormField
                  control={billDetails.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Creation Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled
                            >
                              {field.value ? (
                                format(field.value, "yyyy-MM-dd")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Mode (locked when editing) */}
                <FormField
                  control={billDetails.control}
                  name="paymentMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Mode</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isEditing} // <— locked in edit mode
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a payment mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PAYMENT_MODE.map((mode) => (
                            <SelectItem key={mode} value={mode}>
                              {mode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Amount Received (edit mode only; numerals only; no prefilled 0) */}
              {isEditing && (
                <FormField
                  control={billDetails.control}
                  name="amountReceived"
                  render={({ field }) => {
                    const displayValue =
                      field.value === 0 || field.value === undefined
                        ? ""
                        : String(field.value);

                    return (
                      <FormItem>
                        <FormLabel>Amount Received</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl className="flex-1">
                            <Input
                              type="text"
                              placeholder="Enter amount"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              className="flex-1"
                              value={displayValue}
                              onChange={(e) => {
                                const digits = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                                const next =
                                  digits === "" ? undefined : Number(digits);

                                // clear any previous error first
                                billDetails.clearErrors("amountReceived");

                                // live cap: cannot exceed totalAmount from props
                                if (
                                  next !== undefined &&
                                  Number.isFinite(next) &&
                                  next > totalAmount
                                ) {
                                  billDetails.setError("amountReceived", {
                                    type: "manual",
                                    message:
                                      "Amount received cannot exceed the total amount.",
                                  });
                                  // clamp the value to totalAmount
                                  field.onChange(totalAmount);
                                  return;
                                }

                                field.onChange(next);
                              }}
                              onBlur={() => {
                                const v =
                                  billDetails.getValues().amountReceived;
                                if (v === undefined || Number.isNaN(v)) {
                                  billDetails.setError("amountReceived", {
                                    type: "manual",
                                    message: "Amount received is required.",
                                  });
                                }
                              }}
                            />
                          </FormControl>

                          {/* Paid button AFTER the input */}
                          <div className="shrink-0">
                            <motion.div
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <Button
                                type="button"
                                aria-label="Mark as fully paid"
                                className="bg-black text-white hover:bg-black/90"
                                onClick={() => {
                                  billDetails.setValue(
                                    "amountReceived",
                                    totalAmount,
                                    {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                    }
                                  );
                                  billDetails.clearErrors("amountReceived");
                                }}
                              >
                                Paid
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BillDetails;
