"use client";

import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EducationStep({ form }) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Education
        </h2>
        <p className="text-muted-foreground">Tell us about your educational background</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* School/University */}
        <div>
          <Label htmlFor="education.school" className="text-sm font-medium text-foreground">
            School/University *
          </Label>
          <Controller
            name="education.school"
            control={control}
            rules={{ required: "School is required" }}
            render={({ field }) => (
              <Input
                {...field}
                id="education.school"
                placeholder="e.g. ITI"
                className="mt-1"
              />
            )}
          />
          {errors.education?.school && (
            <p className="text-destructive text-sm mt-1">{errors.education.school.message}</p>
          )}
        </div>

        {/* Degree/Major */}
        <div>
          <Label htmlFor="education.degree" className="text-sm font-medium text-foreground">
            Degree/Major *
          </Label>
          <Controller
            name="education.degree"
            control={control}
            rules={{ required: "Degree is required" }}
            render={({ field }) => (
              <Input
                {...field}
                id="education.degree"
                placeholder="e.g. Web UI"
                className="mt-1"
              />
            )}
          />
          {errors.education?.degree && (
            <p className="text-destructive text-sm mt-1">{errors.education.degree.message}</p>
          )}
        </div>

        {/* Graduation Year */}
        <div>
          <Label htmlFor="education.year" className="text-sm font-medium text-foreground">
            Graduation Year *
          </Label>
          <Controller
            name="education.year"
            control={control}
            rules={{ required: "Year is required" }}
            render={({ field }) => (
              <Input
                {...field}
                id="education.year"
                type="number"
                placeholder="2025"
                className="mt-1"
              />
            )}
          />
          {errors.education?.year && (
            <p className="text-destructive text-sm mt-1">{errors.education.year.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
