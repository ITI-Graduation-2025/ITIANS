"use client";

import { Controller, useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Edit,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  GraduationCap,
  Users,
  Languages,
  BookOpen,
} from "lucide-react";

const degrees = [
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Associate Degree",
  "Diploma",
  "Certificate",
  "Other",
];

const platformIcons = {
  linkedin: Linkedin,
  github: Github,
  behance: Briefcase,
  website: Globe,
};

export default function EducationReviewStep({ form, onStepClick }) {
  const {
    control,
    formState: { errors },
    watch,
  } = form;
  const watchedValues = watch();

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const renderReviewSection = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Review Your Profile
          </h3>
          <p className="text-muted-foreground mb-6">
            Please review all the information before submitting your mentor
            profile.
          </p>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onStepClick(1)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {watchedValues.photo && (
              <div className="flex items-center gap-3">
                <img
                  src={
                    URL.createObjectURL(watchedValues.photo) ||
                    "/placeholder.svg"
                  }
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <span className="text-sm text-muted-foreground">
                  Profile photo uploaded
                </span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Country:</span>{" "}
                {watchedValues.country === "Other"
                  ? watchedValues.customCountry
                  : watchedValues.country}
              </div>
              <div>
                <span className="font-medium">Nationality:</span>{" "}
                {watchedValues.nationality === "Other"
                  ? watchedValues.customNationality
                  : watchedValues.nationality}
              </div>
              <div>
                <span className="font-medium">Gender:</span>{" "}
                {watchedValues.gender}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Professional Information
              {watchedValues.workExperiences?.length > 1 && (
                <Badge variant="secondary">
                  +{watchedValues.workExperiences.length - 1}
                </Badge>
              )}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onStepClick(2)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Company:</span>{" "}
                {watchedValues.company}
              </div>
              <div>
                <span className="font-medium">Job Title:</span>{" "}
                {watchedValues.jobTitle}
              </div>
              <div>
                <span className="font-medium">Experience:</span>{" "}
                {watchedValues.experienceYears} years,{" "}
                {watchedValues.experienceMonths} months
              </div>
            </div>

            {watchedValues.links?.filter((link) => link.url).length > 0 && (
              <div>
                <span className="font-medium text-sm">Professional Links:</span>
                <div className="flex gap-2 mt-2">
                  {watchedValues.links
                    .filter((link) => link.url)
                    .map((link, index) => {
                      const IconComponent =
                        platformIcons[link.platform] || Globe;
                      return (
                        <Button key={index} variant="outline" size="sm" asChild>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IconComponent className="h-4 w-4 mr-2" />
                            {link.platform}
                          </a>
                        </Button>
                      );
                    })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Specialization */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Specialization
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onStepClick(3)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">General:</span>{" "}
                {watchedValues.generalSpecialization === "Other"
                  ? watchedValues.customGeneralSpecialization
                  : watchedValues.generalSpecialization}
              </div>
              <div>
                <span className="font-medium">Specific:</span>{" "}
                {watchedValues.specificSpecialization}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio & Languages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Bio & Languages
              {watchedValues.languages?.length > 1 && (
                <Badge variant="secondary">
                  +{watchedValues.languages.length - 1}
                </Badge>
              )}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onStepClick(4)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-medium text-sm">Bio:</span>
              <p className="text-sm text-muted-foreground mt-1">
                {watchedValues.bio}
              </p>
            </div>
            {watchedValues.languages?.filter((lang) => lang.language).length >
              0 && (
              <div>
                <span className="font-medium text-sm">Languages:</span>
                <div className="flex gap-2 mt-2">
                  {watchedValues.languages
                    .filter((lang) => lang.language)
                    .map((lang, index) => (
                      <Badge key={index} variant="outline">
                        {lang.language === "Other"
                          ? lang.customLanguage
                          : lang.language}{" "}
                        ({lang.proficiency})
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education
              {watchedValues.education?.length > 1 && (
                <Badge variant="secondary">
                  +{watchedValues.education.length - 1}
                </Badge>
              )}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onStepClick(5)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            {watchedValues.education
              ?.filter((edu) => edu.degree || edu.university)
              .map((edu, index) => (
                <div key={index} className="text-sm mb-3 last:mb-0">
                  <div className="font-medium">
                    {edu.degree === "Other" ? edu.customDegree : edu.degree}
                  </div>
                  <div className="text-muted-foreground">{edu.university}</div>
                  <div className="text-muted-foreground text-xs">
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Education & Review
        </h2>
        <p className="text-muted-foreground">
          Add your educational background and review your profile
        </p>
      </div>

      {/* Education Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <Label className="text-sm font-medium text-foreground">
              Education *
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Add your educational qualifications
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendEducation({
                degree: "",
                customDegree: "",
                university: "",
                startDate: "",
                endDate: "",
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>

        {educationFields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Education {index + 1}</h4>
                {educationFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Label>Degree *</Label>
                  <Controller
                    name={`education.${index}.degree`}
                    control={control}
                    rules={{ required: "Degree is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select degree" />
                        </SelectTrigger>
                        <SelectContent>
                          {degrees.map((degree) => (
                            <SelectItem key={degree} value={degree}>
                              {degree}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {field.value === "Other" && (
                    <Controller
                      name={`education.${index}.customDegree`}
                      control={control}
                      rules={{ required: "Please enter a degree" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter degree"
                          className="mt-2"
                        />
                      )}
                    />
                  )}
                  {errors.education?.[index]?.degree && (
                    <p className="text-sm text-destructive absolute bottom-[-20px] animate-in fade-in duration-200">
                      Degree is required
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Label>University *</Label>
                  <Controller
                    name={`education.${index}.university`}
                    control={control}
                    rules={{ required: "University is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter university name"
                        className="mt-1"
                      />
                    )}
                  />
                  {errors.education?.[index]?.university && (
                    <p className="text-sm text-destructive absolute bottom-[-20px] animate-in fade-in duration-200">
                      University is required
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Label>Start Date *</Label>
                  <Controller
                    name={`education.${index}.startDate`}
                    control={control}
                    rules={{ required: "Start date is required" }}
                    render={({ field }) => (
                      <Input {...field} type="date" className="mt-1" />
                    )}
                  />
                  {errors.education?.[index]?.startDate && (
                    <p className="text-sm text-destructive absolute bottom-[-20px] animate-in fade-in duration-200">
                      Start date is required
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Label>End Date *</Label>
                  <Controller
                    name={`education.${index}.endDate`}
                    control={control}
                    rules={{ required: "End date is required" }}
                    render={({ field }) => (
                      <Input {...field} type="date" className="mt-1" />
                    )}
                  />
                  {errors.education?.[index]?.endDate && (
                    <p className="text-sm text-destructive absolute bottom-[-20px] animate-in fade-in duration-200">
                      End date is required
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {educationFields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No education entries added yet
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendEducation({
                  degree: "",
                  customDegree: "",
                  university: "",
                  startDate: "",
                  endDate: "",
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Education Entry
            </Button>
          </div>
        )}
      </div>

      {/* Review Section */}
      {renderReviewSection()}
    </div>
  );
}
