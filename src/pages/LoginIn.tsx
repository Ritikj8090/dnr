"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Clock, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";

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
import { EyeIcon, EyeOffIcon, Lock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { login } from "@/lib/apis";

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Pasword must be at least 8 characters.",
  }),
});

const LogIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all"
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await login(values);
      if (response.status === 200) {
        window.location.reload()
        console.log("Login successful:");
      } else {
        form.setError("email", {message: ""})
        form.setError("password", {message: "Invaild  email or password"})
        console.error("Login failed:", response.data);
      }
      console.log(response);
    } catch (error) {
      form.setError("email", {message: ""})
      form.setError("password", {message: "Invaild email or password"})
      console.error(error);
    }
  }

  return (
    <div>

    <div className=" w-full h-[calc(100vh-64px)] flex justify-center items-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div key="login-form" exit={{ opacity: 0, scale: 0.95 }}>
            <Card className="shadow-2xl">
              <motion.div variants={itemVariants}>
                <CardHeader className="text-center pb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-primary to-primary-foreground rounded-full flex items-center justify-center relative"
                  >
                    <Lock className="h-10 w-10 text-white" />
                  </motion.div>

                  <CardTitle className="text-3xl font-bold mb-2">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Sign in to your account to continue
                  </CardDescription>
                </CardHeader>
              </motion.div>

              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="example713" {...field} />
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
                            <div className=" relative">
                              <Input
                                type={showPassword ? "text" : "password"}
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className=" w-full"
                      disabled={form.formState.isSubmitting}
                      >
                      {form.formState.isSubmitting ? (
                        <motion.div
                        initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center space-x-2"
                        >
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Log In...</span>
                        </motion.div>
                      ) : (
                        "Log In"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
          </motion.div>
        </AnimatePresence>
      </motion.div>
      
    </div>
    <section className="py-20 bg-gradient-to-r from-[#0056A4] to-[#003C7A] text-white">
                    <div className="container mx-auto px-4 text-center">
                      <div className="max-w-4xl mx-auto space-y-8">
                        <Badge className="bg-white/20 text-white border border-white/30 px-4 py-2 text-sm font-semibold">
                          Ready to Transform?
                        </Badge>
                        <h2 className="text-4xl lg:text-5xl font-bold leading-tight">Ready to Transform Your Business?</h2>
                        <p className="text-xl text-blue-100 leading-relaxed">
                          Let's discuss how our technical services can drive your business forward. Contact us today for a
                          customized solution that delivers results.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                          <Button
                size="lg"
                className="bg-white text-[#0056A4] hover:bg-blue-50 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                asChild
                >
                <Link to="/contact-us">
                  <Clock className="w-5 h-5 mr-2" />
                  Get Started Today
                </Link>
              </Button>
                          <Button
        size="lg"
        variant="outline"
        className="border-2 border-white text-white hover:bg-white hover:text-[#0056A4] bg-transparent font-semibold px-8 py-4 rounded-lg transition-all hover:scale-105"
        asChild
      >
        <Link to="/about">
          Learn More
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </Button>
      
                        </div>
                      </div>
                    </div>
                  </section>
        </div>
  );
};

export default LogIn;
