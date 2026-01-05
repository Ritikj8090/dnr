import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Ellipsis, Settings2Icon } from "lucide-react";
import generateOfferLetterHtml from "@/html/offer-letter";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ToWords } from "to-words";
import { useDispatch } from "react-redux";
import PageHeader from "@/components/PageHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PdfConvertor from "@/components/PdfConvertor";
import { setAlertShowPopUp } from "@/store/alertPopupSlice";
import { createOfferLetter, getOfferLetterById } from "@/lib/apis";
import { setFailed, setShowPopUp } from "@/store/popupSlice";
import { containerVariants, currency, itemVariants } from "@/constant";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const formSchema = z.object({
  id: z.string().optional(),
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  position: z.string().min(2, { message: "Position is required." }),
  nationality: z.string().min(2, { message: "Nationality is required." }),
  date: z.date({ required_error: "A date of joining is required." }),
  basicSalary: z
    .number({ invalid_type_error: "Basic Salary is required" })
    .nonnegative("Cannot be negative"),
  functionalAllowance: z
    .number({ invalid_type_error: "Functional Allowance is required" })
    .nonnegative("Cannot be negative"),
  operationalAllowance: z
    .number({ invalid_type_error: "Operational Allowance is required" })
    .nonnegative("Cannot be negative"),
  currencyCode: z.string().optional(),
});

const OfferLetterForm = () => {
  const dispatch = useDispatch();
  const toWords = new ToWords();
  const { id } = useParams();
  const isEditLocked = Boolean(id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      fullName: "",
      position: "",
      nationality: "",
      date: new Date(),
      basicSalary: undefined,
      functionalAllowance: undefined,
      operationalAllowance: undefined,
      currencyCode: currency.code || "",
    },
    mode: "onChange",
  });

  // Derived totals
  const basic = form.watch("basicSalary") ?? 0;
  const functional = form.watch("functionalAllowance") ?? 0;
  const operational = form.watch("operationalAllowance") ?? 0;

  const monthlyTotal = basic + functional + operational;
  const annualCTC = monthlyTotal * 12;

  const handleBackend = async () => {
    const o = form.getValues();

    const payload = {
      employeeName: o.fullName,
      position: o.position,
      nationality: o.nationality?.trim(),

      salary: String(annualCTC),
      joiningDate: o.date,
      salaryBreakdown: [
        { label: "Basic Salary", amount: basic || 0 },
        { label: "Functional Allowance", amount: functional || 0 },
        { label: "Operational Allowance", amount: operational || 0 },
      ],
      currencyCode: currency.code,
    };

    try {
      const response = await createOfferLetter(payload as any);
      if (response.data?.resultStatus === "S") {
        dispatch(
          setShowPopUp({
            title: "Offer Letter Created Successfully!",
            description:
              "Your new offer letter has been created and saved successfully.",
          })
        );
        form.setValue("id", response.data?.offerLetterId);
      } else if (response.data?.resultStatus === "F") {
        // Could be unique constraint violation, etc.
        dispatch(
          setShowPopUp({
            title: "Failed to generate offer letter",
            description: response.data?.resultMessage ?? "Unknown error",
          })
        );
        dispatch(setFailed(true));
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.resultMessage ||
        err?.message ||
        "Unexpected error";
      dispatch(
        setShowPopUp({
          title: "Failed to generate offer letter",
          description: msg,
        })
      );
      dispatch(setFailed(true));
    }
  };

  const handleOfferLetterSubmit = async () => {
    const ok = await form.trigger();
    if (!ok) return;

    dispatch(
      setAlertShowPopUp({
        title: "Are you sure?",
        description: "Want to generate offer letter.",
        isSubmitting: form.formState.isSubmitting,
        onClick: handleBackend,
      })
    );
  };

  const parseNum = (v: string) => (v === "" ? "" : Number(v));

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await getOfferLetterById({ offerLetterId: id });
      const row =
        res?.data?.resultContent?.content?.[0] ??
        res?.data?.resultContent ??
        res?.data;

      const sb = row?.salary_breakdown;
      const pick = (label: string) =>
        Array.isArray(sb)
          ? Number(
              sb.find(
                (x: any) =>
                  (x.label ?? "").toLowerCase() === label.toLowerCase()
              )?.amount
            ) || undefined
          : Number(sb?.[label]) ||
            Number(sb?.[label.replace(" ", "_")]) ||
            undefined;

      form.reset({
        id: row?.id,
        fullName: row?.candidate_name,
        position: row?.position,
        nationality: row?.nationality ?? row?.candidate_nationality ?? "",
        date: row?.joining_date ? new Date(row.joining_date) : new Date(),
        basicSalary: pick("basic salary"),
        functionalAllowance: pick("functional allowance"),
        operationalAllowance: pick("operational allowance"),
        currencyCode: row?.currencyCode ?? row?.currency_code ?? "",
      });
    })();
  }, [id]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container h-full mx-auto px-6 py-8 max-w-[110rem] relative z-10"
      >
        <PageHeader
          title="Offer Letter Generator"
          description="Create professional offer letters with automatic CTC calculation."
        >
          <div className="flex gap-3">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="px-8" onClick={handleOfferLetterSubmit}>
                  <Settings2Icon className="h-4 w-4" />
                  Generate Offer Letter
                </Button>
              </motion.div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant={"outline"}>
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-40">
                  <DropdownMenuItem>
                    <PdfConvertor
                      disabled={!form.watch("id")}
                      endPoint="api/offer-letters/generate"
                      htmlFunction={async () => {
                        const {
                          fullName,
                          position,
                          date,
                          basicSalary,
                          functionalAllowance,
                          operationalAllowance,
                        } = form.getValues();

                        const monthlyTotal =
                          Number(basicSalary) +
                          Number(functionalAllowance) +
                          Number(operationalAllowance);
                        const annualCtc = monthlyTotal * 12;

                        return generateOfferLetterHtml({
                          name: fullName,
                          position,
                          nationality: form.getValues().nationality,
                          joiningDate: format(date, "MMMM dd, yyyy"),
                          basic: Number(basicSalary) || 0,
                          functional: Number(functionalAllowance) || 0,
                          operational: Number(operationalAllowance) || 0,
                          monthlyTotal,
                          annualCtc,
                        });
                      }}
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </PageHeader>

        <motion.div
          variants={itemVariants}
          className="w-full h-full flex items-center justify-center"
        >
          <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-sm">
            <CardContent className="w-full sm:w-[520px]">
              <Form {...form}>
                <form className="space-y-8">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Senior Software Engineer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Salary Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="basicSalary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Basic Salary</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="5000"
                              type="number"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(parseNum(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="functionalAllowance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Functional Allowance</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="2000"
                              type="number"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? ""
                                    : parseFloat(e.target.value)
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="operationalAllowance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operational Allowance</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="1000"
                              type="number"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? ""
                                    : parseFloat(e.target.value)
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Emirati"
                              type="text"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Computed Totals */}
                  <div className="rounded-lg border p-4 bg-white/60">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Monthly Total</span>
                      <span>{monthlyTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="font-medium">Annual CTC (×12)</span>
                      <span>{annualCTC.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {annualCTC > 0 ? toWords.convert(annualCTC) : ""}
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Joining</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[220px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
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
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              fromYear={2025}
                              toYear={2050}
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OfferLetterForm;
