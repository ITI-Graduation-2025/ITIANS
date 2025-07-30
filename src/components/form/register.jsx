"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { toast } from "sonner";
import { setUser } from "@/services/firebase";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const registerOptions = {
    name: {
      required: "Name is required",
      minLength: { value: 3, message: "Name must be at least 3 characters" },
    },
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
    role: {
      required: "Role is required",
    },
    nationalId: {
      required: "National ID is required",
      pattern: {
        value: /^\d{14}$/,
        message: "National ID must be exactly 14 digits",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
    },
    confirmPassword: {
      required: "Please confirm your password",
      validate: (value) =>
        value === watch("password") || "Passwords do not match",
    },
    terms: {
      required: "You must accept the terms and conditions",
    },
  };

  const handleRegister = async (data) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const user = userCredential.user;

      // Update user profile with name
      await updateProfile(user, { displayName: data.name });

      // Store user data in Firestore

      await setUser(user.uid, {
        name: data.name,
        email: data.email,
        role: data.role,
        nationalId: data.nationalId,
        verificationStatus: "Pending",
        createdAt: new Date().toISOString(),
      });

      toast.success("Account created successfully");
      router.push("/login");
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak.";
      }
      toast.error(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrors = (errors) => {
    console.error("Form errors:", errors);
  };

  return (
    <form
      onSubmit={handleSubmit(handleRegister, handleErrors)}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 mb-3 relative">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            {...register("name", registerOptions.name)}
            className={errors.name ? "border-primary" : ""}
          />
          {errors.name && (
            <p className="text-sm text-primary mt-1 absolute bottom-[-20px] ">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2 mb-3 relative ">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email", registerOptions.email)}
            className={errors.email ? "border-primary" : ""}
          />
          {errors.email && (
            <p className="text-sm text-primary mt-1 absolute bottom-[-20px] ">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 ">
        <div className="space-y-2 mb-3 relative">
          <Label htmlFor="role">Role</Label>
          <Select
            onValueChange={(value) =>
              setValue("role", value, { shouldValidate: true })
            }
            defaultValue=""
          >
            <SelectTrigger className={errors.role ? "border-primary" : ""}>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="freelancer">Freelancer</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="mentor">Mentor</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" {...register("role", registerOptions.role)} />
          {errors.role && (
            <p className="text-sm text-primary mt-1 absolute bottom-[-20px] ">
              {errors.role.message}
            </p>
          )}
        </div>
        <div className="space-y-2 mb-3 relative">
          <Label htmlFor="nationalId">National ID</Label>
          <Input
            id="nationalId"
            type="text"
            placeholder="14-digit National ID"
            maxLength={14}
            {...register("nationalId", registerOptions.nationalId)}
            className={errors.nationalId ? "border-primary" : ""}
          />
          {errors.nationalId && (
            <p className="text-sm text-primary mt-1 absolute bottom-[-20px] ">
              {errors.nationalId.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        <div className="space-y-2  mb-3 ">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password", registerOptions.password)}
            className={errors.password ? "border-primary" : ""}
          />
          {errors.password && (
            <p className="text-sm text-primary  absolute bottom-0 ">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-2 mb-3 ">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            {...register("confirmPassword", registerOptions.confirmPassword)}
            className={errors.confirmPassword ? "border-primary" : ""}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-primary mt-1 absolute bottom-0 ">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-3  ">
        <input
          id="terms"
          type="checkbox"
          {...register("terms", registerOptions.terms)}
          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
        />
        <Label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the{" "}
          <a href="#" className="text-primary hover:text-primary/80">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:text-primary/80">
            Privacy Policy
          </a>
        </Label>
        {errors.terms && (
          <p className="text-sm text-primary mt-1 absolute bottom-[230px] right-[630px] ">
            {errors.terms.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full mt-6 cursor-pointer bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
