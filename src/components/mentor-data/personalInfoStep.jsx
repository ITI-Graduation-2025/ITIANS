"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, X } from "lucide-react";

const countries = [
  "Saudi Arabia",
  "Egypt",
  "UAE",
  "USA",
  "Canada",
  "UK",
  "Germany",
  "France",
  "Other",
];

export default function PersonalInfoStep({ form }) {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = form;
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showCustomCountry, setShowCustomCountry] = useState(false);
  const [showCustomNationality, setShowCustomNationality] = useState(false);

  const watchCountry = watch("country");
  const watchNationality = watch("nationality");

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return;
      }
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        return;
      }

      setValue("photo", file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setValue("photo", null);
    setPhotoPreview(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Personal Information
        </h2>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo Upload */}
        <div className="md:col-span-2">
          <Label
            htmlFor="photo"
            className="text-sm font-medium text-foreground"
          >
            Profile Photo *
          </Label>
          {/* photo */}
          <div className="mt-2 relative">
            {!photoPreview ? (
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="mt-4">
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <span className="text-primary font-medium">
                      Upload a photo
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      or drag and drop
                    </span>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
                <Controller
                  name="photo"
                  control={control}
                  rules={{
                    // required: "Please upload a valid image (PNG/JPG, max 5MB)",
                    // validate: (value) => {
                    //   if (!value)
                    //     return "Please upload a valid image (PNG/JPG, max 5MB)";
                    //   if (value.size > 5 * 1024 * 1024)
                    //     return "Please upload a valid image (PNG/JPG, max 5MB)";
                    //   if (
                    //     !["image/png", "image/jpeg", "image/jpg"].includes(
                    //       value.type,
                    //     )
                    //   ) {
                    //     return "Please upload a valid image (PNG/JPG, max 5MB)";
                    //   }
                    //   return true;
                    // },
                    required: false,
                  }}
                  render={({ field }) => (
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  )}
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={photoPreview || "https://picsum.photos/200/300"}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          {errors.photo && (
            <p className="text-sm text-destructive absolute bottom-[-20px] animate-in fade-in duration-200">
              {errors.photo.message}
            </p>
          )}
        </div>

        {/* Country */}
        <div className="relative">
          <Label
            htmlFor="country"
            className="text-sm font-medium text-foreground"
          >
            Country *
          </Label>
          <Controller
            name="country"
            control={control}
            rules={{ required: "Please select or enter a country" }}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  setShowCustomCountry(value === "Other");
                }}
              >
                <SelectTrigger
                  className={`mt-2 ${errors.country ? "border-primary" : ""}`}
                >
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {showCustomCountry && (
            <Controller
              name="customCountry"
              control={control}
              rules={{
                required:
                  watchCountry === "Other" ? "Please enter a country" : false,
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your country"
                  className="mt-2"
                />
              )}
            />
          )}
          {errors.country && (
            <p className="text-sm text-destructive absolute bottom-[-20px] animate-in fade-in duration-200">
              {errors.country.message}
            </p>
          )}
        </div>

        {/* Nationality */}
        <div className="relative">
          <Label
            htmlFor="nationality"
            className="text-sm font-medium text-foreground"
          >
            Nationality *
          </Label>
          <Controller
            name="nationality"
            control={control}
            rules={{ required: "Please select or enter a nationality" }}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  setShowCustomNationality(value === "Other");
                }}
              >
                <SelectTrigger
                  className={`mt-2 ${errors.nationality ? "border-primary" : ""}`}
                >
                  <SelectValue placeholder="Select your nationality" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {showCustomNationality && (
            <Controller
              name="customNationality"
              control={control}
              rules={{
                required:
                  watchNationality === "Other"
                    ? "Please enter a nationality"
                    : false,
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your nationality"
                  className="mt-2"
                />
              )}
            />
          )}
          {errors.nationality && (
            <p className="text-sm text-destructive absolute bottom-[-20px] animate-in fade-in duration-200">
              {errors.nationality.message}
            </p>
          )}
        </div>

        {/* Gender */}
        <div className="md:col-span-2 relative">
          <Label className="text-sm font-medium text-foreground">
            Gender *
          </Label>
          <Controller
            name="gender"
            control={control}
            rules={{ required: "Please select a gender" }}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.gender && (
            <p className="text-sm text-destructive absolute bottom-[-20px] animate-in fade-in duration-200">
              {errors.gender.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
