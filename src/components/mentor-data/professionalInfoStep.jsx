"use client";

import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Linkedin, Github, Globe, Briefcase } from "lucide-react";

const companies = [
  "Google",
  "Amazon",
  "Master Works",
  "Microsoft",
  "Apple",
  "Meta",
  "Netflix",
  "Tesla",
  "Not currently employed",
];

const jobTitles = [
  "Senior Product Designer",
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "Marketing Manager",
];

const platforms = [
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "github", label: "GitHub", icon: Github },
  { value: "behance", label: "Behance", icon: Briefcase },
  { value: "website", label: "Personal Website", icon: Globe },
];

export default function ProfessionalInfoStep({ form }) {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = form;
  const [showCompanyInput, setShowCompanyInput] = useState(false);
  const [showJobTitleInput, setShowJobTitleInput] = useState(false);

  const {
    fields: workFields,
    append: appendWork,
    remove: removeWork,
  } = useFieldArray({
    control,
    name: "workExperiences",
  });

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: "links",
  });

  const watchExperienceYears = watch("experienceYears");
  const watchExperienceMonths = watch("experienceMonths");

  const totalExperienceInMonths =
    (Number.parseInt(watchExperienceYears) || 0) * 12 +
    (Number.parseInt(watchExperienceMonths) || 0);
  const isExperienceValid = totalExperienceInMonths >= 12; // 1 years = 12 months

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Professional Information
        </h2>
        <p className="text-muted-foreground">
          Share your professional background
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company */}
        <div className="relative">
          <Label
            htmlFor="company"
            className="text-sm font-medium text-foreground"
          >
            Company *
          </Label>
          <Controller
            name="company"
            control={control}
            rules={{ required: "Please enter a company name" }}
            render={({ field }) => (
              <>
                <Select
                  value={showCompanyInput ? "custom" : field.value}
                  onValueChange={(value) => {
                    if (value === "custom") {
                      setShowCompanyInput(true);
                      field.onChange("");
                    } else {
                      setShowCompanyInput(false);
                      field.onChange(value);
                    }
                  }}
                >
                  <SelectTrigger
                    className={`mt-2 ${errors.company ? "border-primary" : ""}`}
                  >
                    <SelectValue placeholder="Select or enter company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">
                      Other (Enter manually)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {showCompanyInput && (
                  <Input
                    {...field}
                    placeholder="Enter company name"
                    className="mt-2"
                  />
                )}
              </>
            )}
          />
          {errors.company && (
            <p className="text-sm text-destructive absolute bottom-[-20px] animate-in fade-in duration-200">
              {errors.company.message}
            </p>
          )}
        </div>

        {/* Job Title */}
        <div className="relative">
          <Label
            htmlFor="jobTitle"
            className="text-sm font-medium text-foreground"
          >
            Job Title *
          </Label>
          <Controller
            name="jobTitle"
            control={control}
            rules={{ required: "Please enter a job title" }}
            render={({ field }) => (
              <>
                <Select
                  value={showJobTitleInput ? "custom" : field.value}
                  onValueChange={(value) => {
                    if (value === "custom") {
                      setShowJobTitleInput(true);
                      field.onChange("");
                    } else {
                      setShowJobTitleInput(false);
                      field.onChange(value);
                    }
                  }}
                >
                  <SelectTrigger
                    className={`mt-2 ${errors.jobTitle ? "border-primary" : ""}`}
                  >
                    <SelectValue placeholder="Select or enter job title" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTitles.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">
                      Other (Enter manually)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {showJobTitleInput && (
                  <Input
                    {...field}
                    placeholder="Enter job title"
                    className="mt-2"
                  />
                )}
              </>
            )}
          />
          {errors.jobTitle && (
            <p className="text-sm text-destructive absolute bottom-[-20px] animate-in fade-in duration-200">
              {errors.jobTitle.message}
            </p>
          )}
        </div>

        {/* Experience */}
        <div className="md:col-span-2">
          <Label className="text-sm font-medium text-foreground">
            Total Experience *
          </Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="relative">
              <Controller
                name="experienceYears"
                control={control}
                rules={{
                  required: "Experience is required",
                  validate: () =>
                    isExperienceValid || "Experience must be at least 1 years",
                }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={errors.experienceYears ? "border-primary" : ""}
                    >
                      <SelectValue placeholder="Years" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 21 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i} {i === 1 ? "Year" : "Years"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="relative">
              <Controller
                name="experienceMonths"
                control={control}
                rules={{ required: "Experience is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={
                        errors.experienceMonths ? "border-primary" : ""
                      }
                    >
                      <SelectValue placeholder="Months" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i} {i === 1 ? "Month" : "Months"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          {(errors.experienceYears || errors.experienceMonths) && (
            <p className="text-sm text-destructive mt-1 animate-in fade-in duration-200">
              Experience must be at least 1 years
            </p>
          )}
        </div>
      </div>

      {/* Work Experiences */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium text-foreground">
            Work Experiences
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendWork({
                jobTitle: "",
                company: "",
                startDate: "",
                endDate: "",
                tasks: "",
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>

        {workFields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Experience {index + 1}</h4>
                {workFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWork(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name={`workExperiences.${index}.jobTitle`}
                  control={control}
                  rules={{ required: "Job title is required" }}
                  render={({ field }) => (
                    <div>
                      <Label>Job Title *</Label>
                      <Input
                        {...field}
                        placeholder="Enter job title"
                        className="mt-1"
                      />
                    </div>
                  )}
                />

                <Controller
                  name={`workExperiences.${index}.company`}
                  control={control}
                  rules={{ required: "Company is required" }}
                  render={({ field }) => (
                    <div>
                      <Label>Company *</Label>
                      <Input
                        {...field}
                        placeholder="Enter company"
                        className="mt-1"
                      />
                    </div>
                  )}
                />

                <Controller
                  name={`workExperiences.${index}.startDate`}
                  control={control}
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <div>
                      <Label>Start Date *</Label>
                      <Input {...field} type="date" className="mt-1" />
                    </div>
                  )}
                />

                <Controller
                  name={`workExperiences.${index}.endDate`}
                  control={control}
                  rules={{ required: "End date is required" }}
                  render={({ field }) => (
                    <div>
                      <Label>End Date *</Label>
                      <Input {...field} type="date" className="mt-1" />
                    </div>
                  )}
                />

                <div className="md:col-span-2">
                  <Controller
                    name={`workExperiences.${index}.tasks`}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <Label>Key Tasks & Responsibilities *</Label>
                        <Textarea
                          {...field}
                          placeholder="Describe your key tasks and responsibilities"
                          className="mt-1"
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Professional Links */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium text-foreground">
            Professional Links
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendLink({ platform: "", url: "" })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>

        {linkFields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
          >
            <Controller
              name={`links.${index}.platform`}
              control={control}
              rules={{ required: "Platform is required" }}
              render={({ field }) => (
                <div>
                  <Label>Platform *</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          <div className="flex items-center gap-2">
                            <platform.icon className="h-4 w-4" />
                            {platform.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <Controller
              name={`links.${index}.url`}
              control={control}
              rules={{
                required: "URL is required",
                pattern: {
                  value: /^https:\/\/.+/,
                  message: "Please enter a valid URL starting with https://",
                },
              }}
              render={({ field }) => (
                <div className="relative">
                  <Label>URL *</Label>
                  <Input
                    {...field}
                    placeholder="https://..."
                    className="mt-1"
                  />
                  {errors.links?.[index]?.url && (
                    <p className="text-sm text-destructive absolute bottom-[-20px] animate-in fade-in duration-200">
                      {errors.links[index].url.message}
                    </p>
                  )}
                </div>
              )}
            />

            {linkFields.length > 1 && (
              <Button
                type="button"
                variant="ghostHungarian"
                size="sm"
                onClick={() => removeLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
