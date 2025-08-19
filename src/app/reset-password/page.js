"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@/config/firebase";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Lock, Shield, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidCode, setIsValidCode] = useState(false);
  const [oobCode, setOobCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(Math.min(strength, 5));
  }, [password]);

  const registerOptions = {
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must have at least 6 characters",
      },
    },
    confirmPassword: {
      required: "Please confirm your password",
      validate: (value) => value === password || "Passwords do not match",
    },
  };

  useEffect(() => {
    // Extract oobCode from URL query parameters
    const code = searchParams.get("oobCode");
    if (code) {
      setOobCode(code);
      setIsValidCode(true);
    } else {
      toast.error("Invalid or missing reset link");
      router.push("/login");
    }
  }, [searchParams, router]);

  const handleResetPassword = async (data) => {
    if (!oobCode) {
      toast.error("Invalid reset link");
      return;
    }

    setIsLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, data.password);

      toast.success("Password changed successfully!");

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Password reset error:", error);

      let errorMessage = "Failed to reset password. Please try again.";

      switch (error.code) {
        case "auth/expired-action-code":
          errorMessage = "Reset link has expired. Please request a new one.";
          break;
        case "auth/invalid-action-code":
          errorMessage = "Invalid reset link. Please request a new one.";
          break;
        case "auth/weak-password":
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
          break;
        default:
          errorMessage = error.message || "Failed to reset password.";
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrors = (errors) => {
    console.error(errors);
  };

  if (!isValidCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="space-y-4 pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Verifying reset link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/80 backdrop-blur-sm relative z-10">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Reset Password
          </CardTitle>
          <p className="text-muted-foreground">
            Enter your new password below to secure your account
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form
            onSubmit={handleSubmit(handleResetPassword, handleErrors)}
            className="space-y-6"
          >
            {/* Password Field */}
            <div className="space-y-3">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  {...register("password", registerOptions.password)}
                  className={`pr-10 ${errors.password ? "border-destructive" : "border-border"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength
                            ? passwordStrength <= 2
                              ? "bg-destructive"
                              : passwordStrength <= 3
                                ? "bg-orange-500"
                                : "bg-green-500"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs ${
                      passwordStrength <= 2
                        ? "text-destructive"
                        : passwordStrength <= 3
                          ? "text-orange-600"
                          : "text-green-600"
                    }`}
                  >
                    {passwordStrength <= 2
                      ? "Weak"
                      : passwordStrength <= 3
                        ? "Fair"
                        : passwordStrength <= 4
                          ? "Good"
                          : "Strong"}{" "}
                    password
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-3">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  {...register(
                    "confirmPassword",
                    registerOptions.confirmPassword,
                  )}
                  className={`pr-10 ${errors.confirmPassword ? "border-destructive" : "border-border"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Resetting Password...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Reset Password
                </div>
              )}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center pt-4 border-t border-border">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              ← Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
