import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, RefreshCw, UserPlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { signup } from "@/lib/apis";
import type { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { setFailed, setShowPopUp } from "@/store/popupSlice";
import { setAlertShowPopUp } from "@/store/alertPopupSlice";

const formSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(5, {
    message: "Username must be at least 5 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  employeeId: z.string().optional(),
});

const CredentialGenerator = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      employeeId: "Auto Generated",
    },
  });

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
    const { employeeId: _ignore, ...payload } = values; // do not send employeeId

    try {
      const response = await signup({ ...payload, role: "USER" });

      if (response.status === 200) {
        const serverMsg: string = response.data; // plain string message from backend
        dispatch(
          setShowPopUp({
            title: "Credentials Created Successfully!",
            description:
              serverMsg || "Your secure credentials have been generated",
          })
        );
        dispatch(setFailed(false));
        form.reset({
          fullName: "",
          email: "",
          password: "",
          employeeId: "Auto Generated",
        });
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
      }
      
      console.error("Error creating credential:", er?.data);
      return;
    }
  };

  const handleAxiosError = (error: AxiosError) => {
    return error.response;
  };

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

  return (
    <>
      <div className=" w-full h-[calc(100vh-64px)] flex items-center justify-center">
        <Card className="shadow-2xl">
          <CardHeader>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-primary to-primary-foreground rounded-full flex items-center justify-center"
            >
              <UserPlus className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className=" text-center text-2xl font-bold">
              Generate Credential For User
            </CardTitle>
            <CardDescription className=" text-center mt-2">
              Create a new set of credentials to securely access your account by
              providing your email and password.
            </CardDescription>
          </CardHeader>
          <CardContent className=" w-full sm:w-[450px]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example713"
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
                        <Input disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className=" w-full">
                  Create Credential
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CredentialGenerator;

/*
<Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Add User
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={newUser.employeeId}
                        onChange={(e) =>
                          setNewUser({ ...newUser, employeeId: e.target.value })
                        }
                        placeholder="Enter employee ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value: "ADMIN" | "MANAGER" | "USER") =>
                          setNewUser({ ...newUser, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => setIsAddUserOpen(false)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                      >
                        Add User
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddUserOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
*/
