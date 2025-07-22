"use client";

import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const generalSpecializations = {
  "Software Engineering": [
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Mobile Development",
    "DevOps",
  ],
  AI: [
    "Machine Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Deep Learning",
    "Data Science",
  ],
  "UX/UI": [
    "UX Design",
    "UI Design",
    "Service Design",
    "Product Design",
    "Design Systems",
  ],
  Marketing: [
    "Digital Marketing",
    "Content Marketing",
    "Social Media Marketing",
    "SEO/SEM",
    "Brand Marketing",
  ],
  "Product Management": [
    "Product Strategy",
    "Product Analytics",
    "Agile/Scrum",
    "User Research",
    "Product Operations",
  ],
  Data: [
    "Data Analysis",
    "Data Engineering",
    "Business Intelligence",
    "Data Visualization",
    "Statistics",
  ],
  Other: [],
};

export default function SpecializationStep({ form }) {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = form;
  const [showCustomGeneral, setShowCustomGeneral] = useState(false);
  const [showCustomSpecific, setShowCustomSpecific] = useState(false);
  const [specificOptions, setSpecificOptions] = useState([]);

  const watchGeneralSpecialization = watch("generalSpecialization");

  useEffect(() => {
    if (watchGeneralSpecialization && watchGeneralSpecialization !== "Other") {
      setSpecificOptions(
        generalSpecializations[watchGeneralSpecialization] || [],
      );
      setValue("specificSpecialization", "");
      setShowCustomSpecific(false);
    } else if (watchGeneralSpecialization === "Other") {
      setSpecificOptions([]);
      setValue("specificSpecialization", "");
    }
  }, [watchGeneralSpecialization, setValue]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Specialization
        </h2>
        <p className="text-muted-foreground">What's your area of expertise?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Specialization */}
        <div className="relative">
          <Label
            htmlFor="generalSpecialization"
            className="text-sm font-medium text-foreground"
          >
            General Specialization *
          </Label>
          <Controller
            name="generalSpecialization"
            control={control}
            rules={{
              required: "Please select or enter a general specialization",
            }}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  setShowCustomGeneral(value === "Other");
                }}
              >
                <SelectTrigger
                  className={`mt-2 ${errors.generalSpecialization ? "border-primary" : ""}`}
                >
                  <SelectValue placeholder="Select your general specialization" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(generalSpecializations).map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {showCustomGeneral && (
            <Controller
              name="customGeneralSpecialization"
              control={control}
              rules={{
                required:
                  watchGeneralSpecialization === "Other"
                    ? "Please enter a general specialization"
                    : false,
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your general specialization"
                  className="mt-2"
                />
              )}
            />
          )}
          {errors.generalSpecialization && (
            <p className="text-sm text-destructive absolute bottom-[-20px] animate-in fade-in duration-200">
              {errors.generalSpecialization.message}
            </p>
          )}
        </div>

        {/* Specific Specialization */}
        <div className="relative">
          <Label
            htmlFor="specificSpecialization"
            className="text-sm font-medium text-foreground"
          >
            Specific Specialization *
          </Label>
          <Controller
            name="specificSpecialization"
            control={control}
            rules={{
              required: "Please select or enter a specific specialization",
            }}
            render={({ field }) => (
              <>
                {specificOptions.length > 0 ? (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowCustomSpecific(value === "Other");
                    }}
                    disabled={
                      !watchGeneralSpecialization ||
                      watchGeneralSpecialization === "Other"
                    }
                  >
                    <SelectTrigger
                      className={`mt-2 ${errors.specificSpecialization ? "border-primary" : ""}`}
                    >
                      <SelectValue placeholder="Select your specific specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specificOptions.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    {...field}
                    placeholder="Enter your specific specialization"
                    className={`mt-2 ${errors.specificSpecialization ? "border-primary" : ""}`}
                    disabled={!watchGeneralSpecialization}
                  />
                )}
                {showCustomSpecific && (
                  <Controller
                    name="customSpecificSpecialization"
                    control={control}
                    rules={{
                      required: "Please enter a specific specialization",
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter your specific specialization"
                        className="mt-2"
                      />
                    )}
                  />
                )}
              </>
            )}
          />
          {!watchGeneralSpecialization && (
            <p className="text-xs text-muted-foreground mt-1">
              Please select a general specialization first
            </p>
          )}
          {errors.specificSpecialization && (
            <p className="text-sm text-destructive absolute bottom-[-20px] animate-in fade-in duration-200">
              {errors.specificSpecialization.message}
            </p>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-accent border border-accent/50 rounded-lg p-4">
        <h3 className="font-medium text-accent-foreground mb-2">
          Why do we ask about specialization?
        </h3>
        <p className="text-sm text-accent-foreground/80">
          Understanding your specific area of expertise helps us match you with
          mentees who can benefit most from your knowledge and experience. This
          ensures more meaningful and productive mentoring relationships.
        </p>
      </div>
    </div>
  );
}
