"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";

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
import { verifyOtpSchema } from "@/schema/VerifyOTPSchema";

type ApiErrorResponse = {
  message: string;
};

export default function Page() {
  const router = useRouter();
  const params = useParams();

  const token = Array.isArray(params.token)
    ? params.token[0]
    : params.token;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const form = useForm<z.infer<typeof verifyOtpSchema>>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // ⏱️ Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  // 🔁 Resend OTP
  const handleResend = async () => {
    if (!token) {
      toast.error("Invalid session");
      return;
    }

    if (cooldown > 0) return;

    try {
      await axios.post("/api/resend-otp", { token });

      toast.success("OTP resent successfully");
      setCooldown(60);
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const message = error.response?.data?.message;
        toast.error(message ?? "Failed to resend OTP");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // ✅ Verify OTP
  const onSubmit = async (data: z.infer<typeof verifyOtpSchema>) => {
    if (!token) {
      toast.error("Invalid verification link");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/verify-code", {
        otp: data.otp,
        token,
      });

      toast.success("Success", {
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const message = error.response?.data?.message;

        toast.error("Verification Error", {
          description: message ?? "Something went wrong",
        });
      } else {
        toast.error("Unexpected Error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background text-foreground">
      

      <div className="bg-card border border-border p-8 rounded-xl shadow-md w-full space-y-6 max-w-md">
        <h2 className="text-2xl font-bold text-center">
          Email Verification
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={6}
                      inputMode="numeric"
                      placeholder="Enter 6-digit code"
                      className="text-center tracking-widest text-lg"
                      disabled={isSubmitting}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />

                  {/* 🔁 Resend */}
                  <p className="text-sm mt-2 text-muted-foreground">
                    Didn’t receive the code?{" "}
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={cooldown > 0 || isSubmitting}
                      className={`ml-1 font-medium ${
                        cooldown > 0
                          ? "text-muted-foreground cursor-not-allowed"
                          : "text-primary hover:underline"
                      }`}
                    >
                      {cooldown > 0
                        ? `Resend in ${cooldown}s`
                        : "Resend"}
                    </button>
                  </p>
                </FormItem>
              )}
            />

            <Button
              className="w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}