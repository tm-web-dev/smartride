"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";

import * as z from "zod";

import { toast } from "sonner";

import { useState } from "react";

import Link from "next/link";

import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

import { loginSchema } from "@/schema/loginSchema";

export default function Page() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);

    try {
      // Login
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,

        redirect: false,
      });

      // Handle errors
      if (result?.error) {
        let message = result.error;

        if (result.error === "EMAIL_NOT_VERIFIED") {
          message = "Please verify your email before logging in.";
        }

        toast.error("Login failed", {
          description: message,
          position: "bottom-right",
        });

        return;
      }

      // Get updated session
      const session = await getSession();

      if (!session?.user) {
        toast.error("Failed to retrieve session");
        return;
      }

      toast.success("Login successful", {
        position: "bottom-right",
      });

      // RBAC Redirects
      const role = session.user.role;

      if (role === "admin") {
        router.replace("/admin");
        return;
      }

      if (role === "staff") {
        router.replace("/staff/applications");
        return;
      }

      router.replace("/dashboard");

      // Default user
      router.replace("/dashboard");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="bg-card border border-border p-8 rounded-xl shadow-md w-full space-y-6 max-w-md">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
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
        <Input
          type="password"
          placeholder="Enter your password"
          {...field}
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

<div className="flex justify-end">
  <Link
    href="/forgot-password"
    className="
      text-sm
      text-primary
      hover:underline
    "
  >
    Forgot Password?
  </Link>
</div>

<Button
  className="w-full"
  type="submit"
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <>
      <Loader2
        className="animate-spin mr-2"
        size={16}
      />
      Signing In...
    </>
  ) : (
    "Login"
  )}
</Button>
          </form>
        </Form>

        <div>
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
