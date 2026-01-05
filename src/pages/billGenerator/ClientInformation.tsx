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
import { PhoneInput } from "@/components/ui/phone-input";
import { Building } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { Input } from "@/components/ui/input";
import type { clientInformationSchema } from "./BillGenerator";
import { DEFAULT_COUNTRY_CODE } from "@/constant";

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

interface ClientInformationProps {
  clientInformation: UseFormReturn<z.infer<typeof clientInformationSchema>>;
  /** When true, lock all inputs on this card */
  isEditing?: boolean;
}

const ClientInformation = ({
  clientInformation,
  isEditing = false,
}: ClientInformationProps) => {
  const locked = !!isEditing;

  return (
    <motion.div variants={itemVariants}>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Client Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...clientInformation}>
            <form className="space-y-8">
              {/* Name */}
              <FormField
                control={clientInformation.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authorised Person</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        disabled={locked}
                        readOnly={locked}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={clientInformation.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="XYZ Pvt Ltd"
                        {...field}
                        disabled={locked}
                        readOnly={locked}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={clientInformation.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          {...field}
                          disabled={locked}
                          readOnly={locked}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={clientInformation.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          defaultCountry={DEFAULT_COUNTRY_CODE}
                          className="max-w-72"
                          placeholder="Enter phone number"
                          {...field}
                          disabled={locked}
                          // some phone inputs don't honor readOnly; disabled covers it
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <FormField
                control={clientInformation.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full Address"
                        {...field}
                        disabled={locked}
                        readOnly={locked}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientInformation;
