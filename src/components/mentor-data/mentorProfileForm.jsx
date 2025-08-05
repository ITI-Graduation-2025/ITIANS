"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PersonalInfoStep from "./personalInfoStep";
import ProfessionalInfoStep from "./professionalInfoStep";
import SpecializationStep from "./specializationStep";
import BioLanguagesStep from "./bioLanguagesStep";
import EducationReviewStep from "./educationReviewStep";
import { getUser, setUser, updateUser } from "@/services/userServices";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useUserContext } from "@/context/userContext";

const TOTAL_STEPS = 5;

export default function MentorProfileForm({
  mode = "create",
  initialData = {},
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const { user } = useUserContext();
  // console.log(session?.user, "session");
  // console.log(refetchUser, "refetchUser");
  // const mentor = getUser(user?.id);
  // if (!mentor || mentor === "User not found") {
  //   notFound(); // Show 404 page
  // }
  // if (!mentor?.profileUnderReview) {
  //   redirect("/pending-review");
  // }
  // console.log(user, "user");

  const form = useForm({
    mode: "onChange",
    defaultValues: {
      ...initialData,
      photo: initialData.photo || null,
      country: initialData.country || "",
      customCountry: initialData.customCountry || "",
      nationality: initialData.nationality || "",
      customNationality: initialData.customNationality || "",
      gender: initialData.gender || "",
      company: initialData.company || "",
      jobTitle: initialData.jobTitle || "",
      experienceYears: initialData.experienceYears || "",
      experienceMonths: initialData.experienceMonths || "",
      workExperiences: initialData.workExperiences || [
        { jobTitle: "", company: "", startDate: "", endDate: "", tasks: "" },
      ],
      links: initialData.links || [{ platform: "", url: "" }],
      generalSpecialization: initialData.generalSpecialization || "",
      customGeneralSpecialization:
        initialData.customGeneralSpecialization || "",
      specificSpecialization: initialData.specificSpecialization || "",
      customSpecificSpecialization:
        initialData.customSpecificSpecialization || "",
      bio: initialData.bio || "",
      languages: initialData.languages || [{ language: "", proficiency: "" }],
      education: initialData.education || [
        {
          degree: "",
          customDegree: "",
          university: "",
          startDate: "",
          endDate: "",
        },
      ],
    },
  });

  const {
    trigger,
    formState: { isValid },
  } = form;

  const getStepFields = (step) => {
    switch (step) {
      case 1:
        return ["photo", "country", "nationality", "gender"];
      case 2:
        return [
          "company",
          "jobTitle",
          "experienceYears",
          "experienceMonths",
          "workExperiences",
          "links",
        ];
      case 3:
        return ["generalSpecialization", "specificSpecialization"];
      case 4:
        return ["bio", "languages"];
      case 5:
        return ["education"];
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
      if (!session?.user?.id) {
        toast.error("User not authenticated");
        return;
      }

      const uid = session.user.id;

      const updateData = {
        ...data,
        profileUnderReview: true, // بدلاً من profileCompleted: true
        profileCompleted: false,
      };

      if (mode === "edit") {
        await updateUser(uid, updateData);
        await refetchUser(); // Update context data
        // Force refresh session to update immediately
        await updateSession();
        toast.success("Profile updated successfully");
        router.push("/pending"); // Go to pending review after edit
      } else {
        await updateUser(uid, updateData);
        // Force refresh session to update immediately
        await updateSession();
        toast.success(
          "Profile submitted successfully! Please wait for admin review.",
        );
        router.push("/pending"); // Go to pending review after submission
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit data");
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
        return <ProfessionalInfoStep form={form} />;
      case 3:
        return <SpecializationStep form={form} />;
      case 4:
        return <BioLanguagesStep form={form} />;
      case 5:
        return (
          <EducationReviewStep form={form} onStepClick={handleStepClick} />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
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
                {isSubmitting
                  ? "Submitting..."
                  : mode === "edit"
                    ? "Update Profile"
                    : "Submit Profile"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
