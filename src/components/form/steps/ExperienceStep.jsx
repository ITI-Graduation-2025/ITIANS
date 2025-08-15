"use client";

import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Calendar, Building, User } from "lucide-react";

export default function ExperienceStep({ form }) {
  const {
    control,
    formState: { errors },
    watch,
  } = form;

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "workExperiences",
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Work Experience
        </h2>
        <p className="text-muted-foreground">Tell us about your work experience and where you've worked</p>
      </div>

      <div className="space-y-6">
        {/* Work Experience */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <Label className="text-sm font-medium text-foreground">
              Work Experience
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendExperience({
                  jobTitle: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  tasks: "",
                  isCurrent: false,
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>

          <div className="space-y-4">
            {experienceFields.map((field, idx) => (
              <div
                key={field.id}
                className="border border-border rounded-lg p-6 space-y-4 bg-card"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium text-foreground">Experience #{idx + 1}</h4>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(idx)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">
                      Job Title *
                    </Label>
                    <Controller
                      name={`workExperiences.${idx}.jobTitle`}
                      control={control}
                      rules={{ required: "Job title is required" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="e.g. Frontend Developer"
                          className="mt-1"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground">
                      Company *
                    </Label>
                    <Controller
                      name={`workExperiences.${idx}.company`}
                      control={control}
                      rules={{ required: "Company is required" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="e.g. Tech Corp"
                          className="mt-1"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">
                      Start Date *
                    </Label>
                    <Controller
                      name={`workExperiences.${idx}.startDate`}
                      control={control}
                      rules={{ required: "Start date is required" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          className="mt-1"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground">
                      End Date
                    </Label>
                    <Controller
                      name={`workExperiences.${idx}.endDate`}
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Input
                            {...field}
                            type="date"
                            className="mt-1"
                            disabled={watch(`workExperiences.${idx}.isCurrent`)}
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`current-${idx}`}
                              checked={watch(`workExperiences.${idx}.isCurrent`)}
                              onChange={(e) => {
                                const isCurrent = e.target.checked;
                                form.setValue(`workExperiences.${idx}.isCurrent`, isCurrent);
                                if (isCurrent) {
                                  form.setValue(`workExperiences.${idx}.endDate`, "Present");
                                } else {
                                  form.setValue(`workExperiences.${idx}.endDate`, "");
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor={`current-${idx}`} className="text-sm text-muted-foreground">
                              Currently working here
                            </Label>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Responsibilities & Achievements
                  </Label>
                  <Controller
                    name={`workExperiences.${idx}.tasks`}
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        placeholder="Describe your key responsibilities, achievements, and what you learned..."
                        rows={3}
                        className="w-full border border-input rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {experienceFields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No work experience added yet</p>
            <p className="text-sm text-muted-foreground">Click "Add Experience" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
