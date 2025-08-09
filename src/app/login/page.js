"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import LoginForm from "@/components/form/loginForm";
import { useState } from "react";
import AuthLoading from "../(islam)/authLoading";
import dynamic from "next/dynamic";

const AdminPinLoginPopup = dynamic(
  () => import("@/components/AdminPinLoginPopup"),
  { ssr: false },
);

export default function LoginPage() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // If authenticating, show loading screen
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AuthLoading />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Login
            </CardTitle>
            <p className="text-gray-600">
              Enter your credentials to access your account
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm
              onAuthenticationStart={(val = true) => setIsAuthenticating(val)}
            />
            <div className="text-center text-sm text-gray-600">
              {"Don't have an account? "}
              <Link
                href="/register"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Create one
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <AdminPinLoginPopup />
    </>
  );
}
