import RegisterForm from "@/components/form/register";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Create an Account
          </CardTitle>
          <p className="text-gray-600">Enter your information to get started</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <RegisterForm />
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
