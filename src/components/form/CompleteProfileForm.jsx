"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUserContext } from "@/context/userContext";
import { updateUser } from "@/services/userServices";
import { upload } from "@/utils/upload";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import EducationStep from "./steps/EducationStep";
import SpecializationStep from "./steps/SpecializationStep";
import ExperienceStep from "./steps/ExperienceStep";
import LinksStep from "./steps/LinksStep";

const TOTAL_STEPS = 5;

export default function CompleteProfileForm() {
  const { user, setUser, refetchUser } = useUserContext();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { update: updateSession } = useSession();

  const form = useForm({
    mode: "onChange",
    defaultValues: {
      profileImage: user?.profileImage || null,
      jobTitle: user?.jobTitle || "",
      bio: user?.bio || "",
      education: user?.education || { school: "", degree: "", year: "" },
      mainTrack: user?.mainTrack || "",
      skills: user?.skills || [],
      workExperiences: user?.workExperiences || [],
      linkedIn: user?.linkedIn || "",
      github: user?.github || "",
    },
  });

  const {
    trigger,
    formState: { isValid },
  } = form;

  // Check if user exists and is a freelancer
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "freelancer" || user.profileCompleted) {
    router.push("/");
    return null;
  }

  const getStepFields = (step) => {
    switch (step) {
      case 1:
        return ["profileImage", "jobTitle", "bio"];
      case 2:
        return ["education.school", "education.degree", "education.year"];
      case 3:
        return ["mainTrack", "skills"];
      case 4:
        return ["workExperiences"];
      case 5:
        return ["linkedIn", "github"];
      default:
        return [];
    }
  };

  const isStepValid = async (step) => {
    const fields = getStepFields(step);
    return await trigger(fields);
  };

  const handleNext = async () => {
    const valid = await isStepValid(currentStep);
    if (valid && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = async (step) => {
    const valid = await isStepValid(currentStep);
    if (valid || step < currentStep) {
      setCurrentStep(step);
    } else {
      toast.error("Please complete the current step before moving.");
    }
  };

  const onSubmit = async (data) => {
    if (currentStep !== TOTAL_STEPS) {
      toast.error("Please complete all steps before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!user?.id) {
        toast.error("User not authenticated");
        return;
      }

      const uid = user.id;
      let profileImageUrl = data.profileImage;

      // Upload image if it's a file
      if (data.profileImage instanceof File) {
        try {
          profileImageUrl = await upload({ target: { files: [data.profileImage] } });
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          toast.error("Failed to upload profile image. Please try again.");
          return;
        }
      }

      const updateData = {
        ...data,
        profileImage: profileImageUrl,
        profileUnderReview: true,
        profileCompleted: false,
      };

      await updateUser(uid, updateData);
      setUser({ ...user, ...updateData });
      await refetchUser();
      await updateSession();
      toast.success(
        "Profile submitted successfully! Please wait for admin review.",
      );
      router.push("/pending");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep form={form} />;
      case 2:
        return <EducationStep form={form} />;
      case 3:
        return <SpecializationStep form={form} />;
      case 4:
        return <ExperienceStep form={form} />;
      case 5:
        return <LinksStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-4">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(
              (step) => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                    step <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                  onClick={() => handleStepClick(step)}
                >
                  {step}
                </div>
              ),
            )}
          </div>
        </div>

        <form className="space-y-6">
          <div className="min-h-[500px] transition-all duration-300 ease-in-out">
            {renderStep()}
          </div>
          <div className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 bg-transparent"
            >
              Previous
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isValid}
                className="bg-primary text-primary-foreground px-6"
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting || !isValid}
                className="bg-primary text-primary-foreground px-6"
              >
                {isSubmitting ? "Submitting..." : "Submit Profile"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
