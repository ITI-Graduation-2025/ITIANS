"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserContext } from "@/context/userContext";
import { updateUser } from "@/services/firebase";
import { upload } from "@/utils/upload";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

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

export default function CompleteProfileForm() {
  const { user, setUser, refetchUser } = useUserContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(
    user?.profileImage || "",
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      jobTitle: user?.jobTitle || "",
      education: user?.education || { school: "", degree: "", year: "" },
      mainTrack: user?.mainTrack || "",
      skills: user?.skills || [],
      finishedJobs: user?.finishedJobs || [],
      currentJob: user?.currentJob || "",
      linkedIn: user?.linkedIn || "",
      github: user?.github || "",
      bio: user?.bio || "",
    },
  });

  const {
    fields: skillsFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });
  const {
    fields: jobsFields,
    append: appendJob,
    remove: removeJob,
  } = useFieldArray({
    control,
    name: "finishedJobs",
  });

  // Handle profile image upload (local preview only, not uploading to storage for now)
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    try {
      if (file) {
        const res =await upload(e);
        console.log(res);

        const reader = new FileReader();
        reader.onloadend = () => setProfileImageUrl(res);
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const updateData = {
        ...data,
        profileImage: profileImageUrl,
        status: "pending",
      };
      await updateUser(user.id, updateData);
      setUser({ ...user, ...updateData });
      await refetchUser();
      toast.success("Profile completed!");
      router.push("/");
    } catch (err) {
      toast.error("Failed to complete profile");
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not freelancer or already completed, redirect
  if (!user || user.role !== "freelancer") return null;
  // Optionally, check if already complete and redirect

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6 mt-8"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        Complete Your Profile
      </h2>
      {/* Profile Image */}
      <div className="flex flex-col items-center gap-2">
        <Label>Profile Image</Label>
        {profileImageUrl && (
          <img
            src={profileImageUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <Input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      {/* Job Title */}
      <div>
        <Label>Job Title</Label>
        <Input
          {...register("jobTitle", { required: "Job title is required" })}
          placeholder="e.g. Frontend Developer"
        />
        {errors.jobTitle && (
          <p className="text-primary text-sm">{errors.jobTitle.message}</p>
        )}
      </div>
      {/* Education */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <Label>School/University</Label>
          <Input
            {...register("education.school", {
              required: "School is required",
            })}
            placeholder="e.g. ITI"
          />
        </div>
        <div>
          <Label>Degree/Major</Label>
          <Input
            {...register("education.degree", {
              required: "Degree is required",
            })}
            placeholder="e.g. Web UI"
          />
        </div>
        <div>
          <Label>Graduation Year</Label>
          <Input
            type="number"
            {...register("education.year", { required: "Year is required" })}
            placeholder="2025"
          />
        </div>
      </div>
      {/* Main Track */}
      <div>
        <Label>Main Track</Label>
        <select
          {...register("mainTrack", { required: "Main track is required" })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select track</option>
          {TRACKS.map((track) => (
            <option key={track} value={track}>
              {track}
            </option>
          ))}
        </select>
        {errors.mainTrack && (
          <p className="text-primary text-sm">{errors.mainTrack.message}</p>
        )}
      </div>
      {/* Skills */}
      <div>
        <Label>Skills</Label>
        <div className="flex gap-2 mb-2">
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
        </div>
        <div className="flex flex-wrap gap-2">
          {skillsFields.map((field, idx) => (
            <span
              key={field.id}
              className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
            >
              {field.value}
              <button
                type="button"
                onClick={() => removeSkill(idx)}
                className="text-red-500"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>
      {/* Finished Jobs */}
      <div>
        <Label>Finished Jobs</Label>
        <Button
          type="button"
          onClick={() =>
            appendJob({
              role: "",
              company: "",
              date: "",
              details: "",
              price: "",
            })
          }
          className="mb-2"
        >
          Add Job
        </Button>
        {jobsFields.map((field, idx) => (
          <div
            key={field.id}
            className="border p-2 rounded mb-2 flex flex-col gap-2"
          >
            <div className="flex gap-2">
              <Input
                {...register(`finishedJobs.${idx}.role`, { required: true })}
                placeholder="Role"
              />
              <Input
                {...register(`finishedJobs.${idx}.company`, { required: true })}
                placeholder="Company"
              />
              <Input
                {...register(`finishedJobs.${idx}.date`, { required: true })}
                placeholder="Date"
              />
            </div>
            <Input
              {...register(`finishedJobs.${idx}.details`, { required: true })}
              placeholder="Details"
            />
            <Input
              {...register(`finishedJobs.${idx}.price`, { required: true })}
              placeholder="Price"
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeJob(idx)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      {/* Current Job */}
      <div>
        <Label>Current Job</Label>
        <select
          {...register("currentJob")}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">None</option>
          {jobsFields.map((field, idx) => (
            <option key={field.id} value={idx}>
              {watch(`finishedJobs.${idx}.role`)} at{" "}
              {watch(`finishedJobs.${idx}.company`)}
            </option>
          ))}
        </select>
      </div>
      {/* LinkedIn & GitHub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label>LinkedIn</Label>
          <Input {...register("linkedIn")} placeholder="LinkedIn URL" />
        </div>
        <div>
          <Label>GitHub</Label>
          <Input {...register("github")} placeholder="GitHub URL" />
        </div>
      </div>
      {/* Bio */}
      <div>
        <Label>Bio</Label>
        <textarea
          {...register("bio", { required: "Bio is required" })}
          className="w-full border rounded px-3 py-2"
          rows={4}
          placeholder="Tell us about yourself..."
        />
        {errors.bio && (
          <p className="text-primary text-sm">{errors.bio.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Complete Profile"}
      </Button>
    </form>
  );
}
