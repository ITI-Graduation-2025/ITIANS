"use client";

import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

const bioTemplates = {
  "Software Engineering":
    "With [X] years of experience in software engineering, I specialize in [specific area] and have worked with companies like [company names]. I'm passionate about helping aspiring developers build their technical skills and navigate their career paths.",
  AI: "As an AI professional with [X] years of experience, I focus on [specific AI area] and have implemented solutions in [industry/domain]. I enjoy mentoring others in understanding complex AI concepts and building practical applications.",
  "UX/UI":
    "I'm a [job title] with [X] years of experience creating user-centered designs for [types of products/companies]. I love helping designers develop their design thinking skills and build compelling user experiences.",
  Marketing:
    "With [X] years in marketing, I specialize in [specific marketing area] and have helped [types of companies/results]. I'm excited to share my knowledge about marketing strategies and help others grow their marketing careers.",
  Default:
    "With [X] years of experience in [your field], I have worked with [companies/projects] and specialize in [your expertise]. I'm passionate about mentoring and helping others achieve their professional goals.",
};

const languages = [
  "English",
  "Arabic",
  "French",
  "Spanish",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Portuguese",
  "Russian",
  "Italian",
  "Other",
];

const proficiencyLevels = ["Fluent", "Intermediate", "Beginner"];

export default function BioLanguagesStep({ form }) {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = form;
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showCustomLanguage, setShowCustomLanguage] = useState({});

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "languages",
  });

  const watchGeneralSpecialization = watch("generalSpecialization");
  const watchBio = watch("bio");

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    const templateText = bioTemplates[template] || bioTemplates["Default"];
    setValue("bio", templateText);
  };

  const wordCount = watchBio
    ? watchBio
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Bio & Languages
        </h2>
        <p className="text-muted-foreground">
          Tell mentees about yourself and your language skills
        </p>
      </div>

      {/* Bio Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="bio" className="text-sm font-medium text-foreground">
            Professional Bio *
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Write a compelling bio that highlights your expertise and mentoring
            approach (max 150 words)
          </p>
        </div>

        {/* Bio Templates */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            Quick Start Templates:
          </Label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(bioTemplates)
              .filter((key) => key !== "Default")
              .map((template) => (
                <Button
                  key={template}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateSelect(template)}
                  className={
                    selectedTemplate === template
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                >
                  {template}
                </Button>
              ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleTemplateSelect("Default")}
              className={
                selectedTemplate === "Default"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
            >
              General
            </Button>
          </div>
        </div>

        <div className="relative">
          <Controller
            name="bio"
            control={control}
            rules={{
              required: "Please enter a bio (max 150 words)",
              validate: (value) => {
                const words = value
                  .trim()
                  .split(/\s+/)
                  .filter((word) => word.length > 0);
                if (words.length > 150) {
                  return "Bio must be 150 words or less";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Write your professional bio here..."
                className={`min-h-[120px] ${errors.bio ? "border-primary" : ""}`}
                rows={6}
              />
            )}
          />
          <div className="flex justify-between items-center mt-2">
            <div>
              {errors.bio && (
                <p className="text-sm text-destructive animate-in fade-in duration-200">
                  {errors.bio.message}
                </p>
              )}
            </div>
            <p
              className={`text-xs ${
                wordCount > 150 ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {wordCount}/150 words
            </p>
          </div>
        </div>
      </div>

      {/* Languages Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <Label className="text-sm font-medium text-foreground">
              Languages *
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Add the languages you can communicate in during mentoring sessions
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendLanguage({
                language: "",
                customLanguage: "",
                proficiency: "",
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Language
          </Button>
        </div>

        {languageFields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 border rounded-lg"
          >
            <div className="relative">
              <Label>Language *</Label>
              <Controller
                name={`languages.${index}.language`}
                control={control}
                rules={{ required: "Language is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowCustomLanguage((prev) => ({
                        ...prev,
                        [index]: value === "Other",
                      }));
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {showCustomLanguage[index] && (
                <Controller
                  name={`languages.${index}.customLanguage`}
                  control={control}
                  rules={{ required: "Please enter a language" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter language"
                      className="mt-2"
                    />
                  )}
                />
              )}
              {errors.languages?.[index]?.language && (
                <p className="text-sm text-destructive absolute bottom-[-20px] animate-in fade-in duration-200">
                  Language is required
                </p>
              )}
            </div>

            <div className="relative">
              <Label>Proficiency *</Label>
              <Controller
                name={`languages.${index}.proficiency`}
                control={control}
                rules={{ required: "Proficiency is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      {proficiencyLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.languages?.[index]?.proficiency && (
                <p className="text-sm text-destructive absolute bottom-[-20px] animate-in fade-in duration-200">
                  Proficiency is required
                </p>
              )}
            </div>

            {languageFields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeLanguage(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        {languageFields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <p className="text-muted-foreground mb-4">No languages added yet</p>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendLanguage({
                  language: "",
                  customLanguage: "",
                  proficiency: "",
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Language
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
