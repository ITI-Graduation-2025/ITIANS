"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import { toast } from "sonner";
import { Search } from "lucide-react";
import { setCompany } from "@/services/firebase";

export default function CompanyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const registerOptions = {
    name: { required: "Company name is required" },
    industry: { required: "Industry is required" },
    location: { required: "Location is required" },
    size: { required: "Company size is required" },
    website: {
      required: "Website is required",
      pattern: {
        value: /^https:\/\/.+/,
        message: "Please enter a valid URL starting with https://",
      },
    },
    founded: { required: "Founded year is required" },
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
    phone: {
      required: "Phone number is required",
      pattern: {
        value: /^\+?\d{10,15}$/,
        message: "Please enter a valid phone number (10-15 digits)",
      },
    },
    description: { required: "Description is required" },
  };

  const handleRegister = async (data) => {
    setIsLoading(true);
    try {
      await setCompany(data.email, data);
      toast.success("Company account created successfully");
      router.push("/companyprofile");
    } catch (error) {
      toast.error("Failed to create company account. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrors = (errors) => {
    console.error("Form errors:", errors);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Company Management
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Company Account</CardTitle>
            <CardDescription>
              Fill in the details to register a new company
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(handleRegister, handleErrors)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Company Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter company name"
                    {...register("name", registerOptions.name)}
                    className={`w-full ${errors.name ? "border-primary" : "border-gray-300"}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-primary mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="industry"
                    className="text-sm font-medium text-gray-700"
                  >
                    Industry
                  </Label>
                  <Input
                    id="industry"
                    type="text"
                    placeholder="Enter industry"
                    {...register("industry", registerOptions.industry)}
                    className={`w-full ${errors.industry ? "border-primary" : "border-gray-300"}`}
                  />
                  {errors.industry && (
                    <p className="text-sm text-primary mt-1">
                      {errors.industry.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="text-sm font-medium text-gray-700"
                  >
                    Location
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter location"
                    {...register("location", registerOptions.location)}
                    className={`w-full ${errors.location ? "border-primary" : "border-gray-300"}`}
                  />
                  {errors.location && (
                    <p className="text-sm text-primary mt-1">
                      {errors.location.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="size"
                    className="text-sm font-medium text-gray-700"
                  >
                    Company Size
                  </Label>
                  <Controller
                    name="size"
                    control={control}
                    rules={registerOptions.size}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger
                            className={`w-full ${errors.size ? "border-primary" : "border-gray-300"}`}
                          >
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10 employees">
                              1-10 employees
                            </SelectItem>
                            <SelectItem value="11-50 employees">
                              11-50 employees
                            </SelectItem>
                            <SelectItem value="51-200 employees">
                              51-200 employees
                            </SelectItem>
                            <SelectItem value="201-500 employees">
                              201-500 employees
                            </SelectItem>
                            <SelectItem value="500-1000 employees">
                              500-1000 employees
                            </SelectItem>
                            <SelectItem value="1000+ employees">
                              1000+ employees
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.size && (
                          <p className="text-sm text-primary mt-1">
                            {errors.size.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  {errors.size && (
                    <p className="text-sm text-primary mt-1">
                      {errors.size.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="website"
                    className="text-sm font-medium text-gray-700"
                  >
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="text"
                    placeholder="https://..."
                    {...register("website", registerOptions.website)}
                    className={`w-full ${errors.website ? "border-primary" : "border-gray-300"}`}
                  />
                  {errors.website && (
                    <p className="text-sm text-primary mt-1">
                      {errors.website.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="founded"
                    className="text-sm font-medium text-gray-700"
                  >
                    Founded Year
                  </Label>
                  <Input
                    id="founded"
                    type="text"
                    placeholder="e.g., 2008"
                    {...register("founded", registerOptions.founded)}
                    className={`w-full ${errors.founded ? "border-primary" : "border-gray-300"}`}
                  />
                  {errors.founded && (
                    <p className="text-sm text-primary mt-1">
                      {errors.founded.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter company email"
                    {...register("email", registerOptions.email)}
                    className={`w-full ${errors.email ? "border-primary" : "border-gray-300"}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-primary mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+XX XXX XXX XXXX"
                    {...register("phone", registerOptions.phone)}
                    className={`w-full ${errors.phone ? "border-primary" : "border-gray-300"}`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-primary mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description
                </Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Enter company description"
                  {...register("description", registerOptions.description)}
                  className={`w-full ${errors.description ? "border-primary" : "border-gray-300"}`}
                />
                {errors.description && (
                  <p className="text-sm text-primary mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Company Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
