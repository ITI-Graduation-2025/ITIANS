"use client";

import { useState, useEffect } from "react";
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
import { Upload, X, Code, Palette, Smartphone, Database, Server, Users, Globe, FileText, TrendingUp } from "lucide-react";

const jobTitles = [
  {
    category: "Development",
    icon: Code,
    titles: [
      "Frontend Developer",
      "Backend Developer", 
      "Full Stack Developer",
      "React Developer",
      "Node.js Developer",
      "Python Developer",
      "Java Developer",
      "PHP Developer",
      "Web Developer",
      "Software Engineer",
    ]
  },
  {
    category: "Design & Creative",
    icon: Palette,
    titles: [
      "UI/UX Designer",
      "Graphic Designer",
      "Web Designer",
    ]
  },
  {
    category: "Mobile & Apps",
    icon: Smartphone,
    titles: [
      "Mobile Developer",
      "iOS Developer",
      "Android Developer",
      "React Native Developer",
    ]
  },
  {
    category: "Data & Analytics",
    icon: Database,
    titles: [
      "Data Scientist",
      "Data Analyst",
      "Machine Learning Engineer",
    ]
  },
  {
    category: "DevOps & Infrastructure",
    icon: Server,
    titles: [
      "DevOps Engineer",
      "System Administrator",
      "Cloud Engineer",
    ]
  },
  {
    category: "Management & Strategy",
    icon: Users,
    titles: [
      "Product Manager",
      "Project Manager",
      "Technical Lead",
    ]
  },
  {
    category: "Content & Marketing",
    icon: FileText,
    titles: [
      "Content Writer",
      "Digital Marketing Specialist",
      "SEO Specialist",
      "Social Media Manager",
    ]
  },
  {
    category: "WordPress & CMS",
    icon: Globe,
    titles: [
      "WordPress Developer",
      "CMS Developer",
    ]
  },
  {
    category: "Other",
    icon: TrendingUp,
    titles: [
      "QA Engineer",
      "Business Analyst",
      "Technical Writer",
    ]
  }
];

export default function PersonalInfoStep({ form }) {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = form;
  const [photoPreview, setPhotoPreview] = useState(watch("profileImage") || null);
  const [showJobTitleInput, setShowJobTitleInput] = useState(false);

  // Update preview when form value changes
  useEffect(() => {
    const profileImage = watch("profileImage");
    if (profileImage && typeof profileImage === "string") {
      setPhotoPreview(profileImage);
    }
  }, [watch("profileImage")]);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      // Check file type
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        alert("Please select a valid image file (PNG, JPG, JPEG)");
        return;
      }

      setValue("profileImage", file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setValue("profileImage", null);
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
            htmlFor="profileImage"
            className="text-sm font-medium text-foreground"
          >
            Profile Photo *
          </Label>
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
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover border-2 border-border"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Job Title */}
        <div className="md:col-span-2">
          <Label htmlFor="jobTitle" className="text-sm font-medium text-foreground">
            Job Title *
          </Label>
          <Controller
            name="jobTitle"
            control={control}
            rules={{ required: "Job title is required" }}
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
                     className={`mt-1 h-12 ${errors.jobTitle ? "border-destructive" : ""}`}
                   >
                     <SelectValue placeholder="Choose your job title" />
                   </SelectTrigger>
                   <SelectContent className="max-h-[400px] w-[400px]">
                     <div className="p-2">
                       <div className="text-sm font-medium text-muted-foreground mb-3 px-2">
                         Select your job title
                       </div>
                       {jobTitles.map((category) => (
                         <div key={category.category} className="mb-4">
                           <div className="flex items-center gap-2 px-2 py-1 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                             <category.icon className="h-3 w-3" />
                             {category.category}
                           </div>
                           <div className="space-y-1">
                             {category.titles.map((title) => (
                               <SelectItem
                                 key={title}
                                 value={title}
                                 className="cursor-pointer hover:bg-accent rounded-md px-3 py-2 text-sm"
                               >
                                 <div className="flex items-center gap-2">
                                   <div className="w-2 h-2 bg-primary rounded-full"></div>
                                   {title}
                                 </div>
                               </SelectItem>
                             ))}
                           </div>
                         </div>
                       ))}
                       <div className="border-t pt-3 mt-3">
                         <SelectItem
                           value="custom"
                           className="cursor-pointer hover:bg-accent rounded-md px-3 py-2 text-sm border-2 border-dashed border-muted-foreground/30"
                         >
                           <div className="flex items-center gap-2 text-muted-foreground">
                             <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                             Other (Enter manually)
                           </div>
                         </SelectItem>
                       </div>
                     </div>
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
            <p className="text-destructive text-sm mt-1">{errors.jobTitle.message}</p>
          )}
        </div>

        {/* Bio */}
        <div className="md:col-span-2">
          <Label htmlFor="bio" className="text-sm font-medium text-foreground">
            Bio *
          </Label>
          <Controller
            name="bio"
            control={control}
            rules={{ required: "Bio is required" }}
            render={({ field }) => (
              <textarea
                {...field}
                id="bio"
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full border border-input rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            )}
          />
          {errors.bio && (
            <p className="text-destructive text-sm mt-1">{errors.bio.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
