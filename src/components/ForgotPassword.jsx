"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const registerOptions = {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
  };

  const handleForgotPassword = async (data) => {
    setIsLoading(true);

    try {
      // Check rate limit first
      const rateLimitResponse = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!rateLimitResponse.ok) {
        const rateLimitError = await rateLimitResponse.json();
        throw new Error(rateLimitError.error);
      }

      // Check if user exists in our database
      const checkEmailResponse = await fetch("/api/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!checkEmailResponse.ok) {
        throw new Error("Failed to check email");
      }

      const checkResult = await checkEmailResponse.json();

      if (!checkResult.exists) {
        toast.error("No account found with this email address.");
        return;
      }

      const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`;

      await sendPasswordResetEmail(auth, data.email, {
        url: redirectUrl,
        handleCodeInApp: true, // مهم: true لاستخدام صفحتنا مباشرة
      })
        .then(() => {
          console.log("Password reset email sent to:", data.email);
        })
        .catch((error) => {
          toast.error("Failed to send reset email. Please try again.");
          console.error("Password reset error:", error);
        });

      // In development, log the reset link to console
      if (process.env.NODE_ENV === "development") {
        console.log("=== PASSWORD RESET DEBUG ===");
        console.log("Email:", data.email);
        console.log("Redirect URL:", redirectUrl);
        console.log("Environment:", process.env.NODE_ENV);
        console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);
        console.log("Note: In development, emails are not actually sent");
        console.log("In production, check your email inbox and spam folder");
        console.log("================================");
      }

      toast.success("Password reset email sent! Check your inbox.");
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Password reset error:", error);

      let errorMessage = "Failed to send reset email. Please try again.";

      if (error.message.includes("Too many password reset requests")) {
        errorMessage = error.message;
      } else {
        switch (error.code) {
          case "auth/user-not-found":
            errorMessage = "No account found with this email address.";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many requests. Please try again later.";
            break;
          default:
            errorMessage = error.message || "Failed to send reset email.";
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrors = (errors) => {
    console.error(errors);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-sm text-primary hover:text-primary/80">
          Forgot password?
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you a link to reset your
            password.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleForgotPassword, handleErrors)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", registerOptions.email)}
              className={errors.email ? "border-primary" : ""}
            />
            {errors.email && (
              <p className="text-sm text-primary">{errors.email.message}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
