"use client";

import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        setLoading(true);

        setError("");

        setMessage("");

        const res =
          await axios.post(
            "/api/auth/forgot-password",
            {
              email,
            }
          );

        setMessage(
          res.data.message
        );
      } catch (error: any) {
        setError(
          error.response?.data
            ?.message ||
            "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">

      <Card className="w-full max-w-md">

        <CardHeader>

          <CardTitle>
            Forgot Password
          </CardTitle>

          <CardDescription>
            Enter your email address
            and we'll send you a
            password reset link.
          </CardDescription>

        </CardHeader>

        <CardContent>

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-4"
          >

            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </Button>

            {message && (
              <p className="text-green-600 text-sm">
                {message}
              </p>
            )}

            {error && (
              <p className="text-red-600 text-sm">
                {error}
              </p>
            )}

          </form>

        </CardContent>

      </Card>

    </div>
  );
}