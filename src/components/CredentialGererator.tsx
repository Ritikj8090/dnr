import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setIsAddUserOpen } from "@/store/globalSlice";
import { useState } from "react";
import { setAlertShowPopUp, setIsSubmitting } from "@/store/alertPopupSlice";
import { signup } from "@/lib/apis";
import { setFailed, setShowPopUp } from "@/store/popupSlice";
import type { AxiosError } from "axios";

const formSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(5, {
    message: "Username must be at least 5 characters.",
  }),
  password: z.string().min(8, {
    message: "Pasword must be at least 8 characters.",
  }),
  employeeId: z.string().min(1, {
    message: "Employee Id is required.",
  }),
  role: z.enum(["ADMIN", "MANAGER", "USER"]),
});

const CredentialGererator = () => {
  const dispatch = useDispatch();
  const { isAddUserOpen } = useSelector((state: RootState) => state.global);
  const [showPassword, setShowPassword] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      employeeId: "",
      role: "USER",
    },
  });

  const generatePassword = () => {
    if (!form.getValues("fullName").trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      // Clean the name (remove spaces, special characters) and take first part
      const cleanName = form
        .getValues("fullName")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
      const baseName = cleanName.slice(0, 8); // Take first 8 characters

      // Generate 4 random numbers
      const randomNumbers = Math.floor(1000 + Math.random() * 9000).toString();

      const newPassword = baseName + randomNumbers;
      form.setValue("password", newPassword, { shouldValidate: true });
      setIsGenerating(false);
    }, 500);
  };

  async function onSubmit() {
    dispatch(
      setAlertShowPopUp({
        title: "Are you absolutely sure?",
        description:
          "This action cannot be undone. This will create a new account and send credentials to the provided email.",
        isSubmitting: false,
        onClick: handleFormSubmit,
      })
    );
  }

  const handleFormSubmit = async () => {
    const values = form.getValues();

    try {
      dispatch(setIsSubmitting(true));
      const response = await signup({ ...values, role: "USER" });
      if (response.status === 200) {
        dispatch(
          setShowPopUp({
            title: "Credentials Created Successfully!",
            description: "Your secure credentials have been generated",
          })
        );
        dispatch(setFailed(false));
        dispatch(setIsAddUserOpen(false));
        form.reset();
      }
    } catch (error) {
      dispatch(
        setShowPopUp({
          title: "Credential Creation Failed!",
          description:
            "An error occurred while creating the credential. Please try again later.",
        })
      );
      dispatch(setFailed(true));
      const er = handleAxiosError(error as AxiosError);
      if (er?.data === "Email already in use") {
        form.setError("email", {
          type: "manual",
          message: "User with this email already exists.",
        });
        return;
      } else if (er?.data === "Employee ID already in use") {
        form.setError("employeeId", {
          type: "manual",
          message: "User with this Employee Id already exists.",
        });
        return;
      }
      console.error("Error creating credential:", er?.data);
      return;
    } finally {
      dispatch(setIsSubmitting(false));
    }
  };

  const handleAxiosError = (error: AxiosError) => {
    return error.response;
  };
  return (
    <Dialog
      open={isAddUserOpen}
      onOpenChange={() => dispatch(setIsAddUserOpen(!isAddUserOpen))}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className=" text-center text-2xl font-bold">
            Add New User
          </DialogTitle>
          <DialogDescription className=" text-center mt-2">
            Create a new set of credentials to securely access your account by
            providing your email and password.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Deo"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@gmail.com"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className=" flex gap-1 w-full">
                        <div className=" relative w-full">
                          <Input
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            {...field}
                          />
                          <span
                            className=" absolute top-[50%] -translate-y-[50%] right-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeIcon size={15} />
                            ) : (
                              <EyeOffIcon size={15} />
                            )}
                          </span>
                        </div>
                        <Button
                          type="button"
                          onClick={generatePassword}
                          disabled={
                            isGenerating || !form.watch("fullName").trim()
                          }
                        >
                          {isGenerating ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            "Generate"
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Id</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="emp1234"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role for user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                        <SelectItem value="MANAGER">MANAGER</SelectItem>
                        <SelectItem value="USER">USER</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className=" w-full">
                Create Credential
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialGererator;
