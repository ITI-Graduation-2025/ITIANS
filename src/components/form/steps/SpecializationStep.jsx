"use client";

import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

const TRACKS = [
  "Frontend",
  "Backend",
  "Fullstack",
  "UI/UX",
  "Mobile",
  "Data Science",
  "DevOps",
  "Other",
];

export default function SpecializationStep({ form }) {
  const {
    control,
    formState: { errors },
  } = form;

  const {
    fields: skillsFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Specialization & Skills
        </h2>
        <p className="text-muted-foreground">Tell us about your expertise and skills</p>
      </div>

      <div className="space-y-6">
        {/* Main Track */}
        <div>
          <Label htmlFor="mainTrack" className="text-sm font-medium text-foreground">
            Main Track *
          </Label>
          <Controller
            name="mainTrack"
            control={control}
            rules={{ required: "Main track is required" }}
            render={({ field }) => (
              <select
                {...field}
                id="mainTrack"
                className="w-full border border-input rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="">Select track</option>
                {TRACKS.map((track) => (
                  <option key={track} value={track}>
                    {track}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.mainTrack && (
            <p className="text-destructive text-sm mt-1">{errors.mainTrack.message}</p>
          )}
        </div>

        {/* Skills */}
        <div>
          <Label className="text-sm font-medium text-foreground">
            Skills *
          </Label>
          <div className="flex gap-2 mb-2 mt-1">
            <Input
              type="text"
              placeholder="Add skill"
              id="add-skill"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  appendSkill({ value: e.target.value.trim() });
                  e.target.value = "";
                  e.preventDefault();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const input = document.getElementById("add-skill");
                if (input.value.trim()) {
                  appendSkill({ value: input.value.trim() });
                  input.value = "";
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skillsFields.map((field, idx) => (
              <span
                key={field.id}
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-2 text-sm"
              >
                {field.value}
                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
