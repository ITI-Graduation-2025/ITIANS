"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  X,
  AlertCircle,
  User,
  Mail,
  Calendar,
  Hash,
} from "lucide-react";
import { updateUser } from "@/services/userServices";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { sendPushNotification } from "@/services/notificationService";

export default function UserDetailsModal({
  user,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onUpdate,
}) {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { update: updateSession } = useSession();

  const handleAction = async (action) => {
    if (!comment.trim()) {
      toast.error("Please add a comment before taking action");
      return;
    }

    setIsLoading(true);
    try {
      let updateData = {
        adminComment: comment,
        adminActionDate: new Date().toISOString(),
      };

      // Handle different types of actions
      if (profileData.type === "registration") {
        // Registration approval/rejection
        updateData.verificationStatus =
          action === "approve"
            ? "Approved"
            : action === "suspend"
              ? "Suspended"
              : "Rejected";
      } else if (profileData.type === "profile_under_review") {
        // Profile approval/rejection
        if (action === "approve") {
          updateData.profileCompleted = true;
          updateData.profileUnderReview = false;
        } else {
          updateData.profileUnderReview = false;
        }
      }

      await updateUser(user.id, updateData);
      await updateSession();

      // --- Notification logic ---
      let notifType = "";
      let notifMsg = "";
      if (action === "approve") {
        if (profileData.type === "registration") {
          notifType = "account_approved";
          notifMsg =
            "Your account has been approved! Please log out and log in again to refresh your data.";
        } else if (profileData.type === "profile_under_review") {
          notifType = "profile_approved";
          notifMsg =
            "Your profile has been approved! Please log out and log in again to refresh your data.";
        }
      } else if (action === "reject") {
        if (profileData.type === "registration") {
          notifType = "account_rejected";
          notifMsg =
            "Your account has been rejected. Please check the admin comment for details.";
        } else if (profileData.type === "profile_under_review") {
          notifType = "profile_rejected";
          notifMsg =
            "Your profile has been rejected. Please check the admin comment for details.";
        }
      } else if (action === "suspend") {
        notifType = "account_suspended";
        notifMsg = "Your account has been suspended by the admin.";
      }

      // In-app notification
      if (notifType && notifMsg) {
        await addDoc(collection(db, "notifications"), {
          recipientId: user.id,
          senderId: "admin",
          type: notifType,
          message: notifMsg,
          relatedId: user.id,
          read: false,
          createdAt: serverTimestamp(),
        });
      }

      // Push notification
      const userDoc = await getDoc(doc(db, "users", user.id));
      const fcmToken = userDoc.data()?.fcmToken;
      if (fcmToken && notifMsg) {
        await sendPushNotification({
          token: fcmToken,
          title: "Account Status Update",
          body: notifMsg,
          data: { url: "/pending" },
        });
      }

      if (action === "approve") {
        onApprove(user.id);
        toast.success(
          profileData.type === "registration"
            ? "User approved successfully"
            : "Profile approved successfully",
        );
      } else if (action === "reject") {
        onReject(user.id);
        toast.success(
          profileData.type === "registration"
            ? "User rejected successfully"
            : "Profile rejected successfully",
        );
      } else if (action === "suspend") {
        toast.success("User suspended successfully");
      }

      onUpdate();
      onClose();
      setComment("");

      // Force session refresh
      await updateSession();
    } catch (error) {
      toast.error("Failed to update user status");
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProfileData = () => {
    if (!user) return null;

    // For pending users (registration data only)
    if (user.verificationStatus === "Pending") {
      return {
        type: "registration",
        data: {
          name: user.name,
          email: user.email,
          nationalId: user.nationalId,
          role: user.role,
          createdAt: user.createdAt,
        },
      };
    }

    // For approved users with profile under review
    if (user.verificationStatus === "Approved" && user.profileUnderReview) {
      return {
        type: "profile_under_review",
        data: {
          name: user.name,
          email: user.email,
          nationalId: user.nationalId,
          role: user.role,
          createdAt: user.createdAt,
          // Add complete profile data based on role
          ...(user.role === "mentor"
            ? {
                jobTitle: user.jobTitle,
                company: user.company,
                experienceYears: user.experienceYears,
                experienceMonths: user.experienceMonths,
                workExperiences: user.workExperiences,
                links: user.links,
                generalSpecialization: user.generalSpecialization,
                specificSpecialization: user.specificSpecialization,
                bio: user.bio,
                languages: user.languages,
                education: user.education,
                photo: user.photo,
                country: user.country,
                nationality: user.nationality,
                gender: user.gender,
              }
            : {
                jobTitle: user.jobTitle,
                mainTrack: user.mainTrack,
                skills: user.skills,
                bio: user.bio,
                education: user.education,
                finishedJobs: user.finishedJobs,
                currentJob: user.currentJob,
                linkedIn: user.linkedIn,
                github: user.github,
                profileImage: user.profileImage,
              }),
        },
      };
    }

    // For approved users with incomplete profiles (old case)
    if (
      user.verificationStatus === "Approved" &&
      !user.profileCompleted &&
      !user.profileUnderReview
    ) {
      return {
        type: "incomplete_profile",
        data: {
          name: user.name,
          email: user.email,
          nationalId: user.nationalId,
          role: user.role,
          createdAt: user.createdAt,
          // Add profile data based on role
          ...(user.role === "mentor"
            ? {
                jobTitle: user.jobTitle,
                company: user.company,
                experienceYears: user.experienceYears,
                bio: user.bio,
              }
            : {
                jobTitle: user.jobTitle,
                mainTrack: user.mainTrack,
                skills: user.skills,
                bio: user.bio,
              }),
        },
      };
    }

    return null;
  };

  const profileData = getProfileData();

  if (!user || !profileData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Details
          </DialogTitle>
          <DialogDescription>
            {profileData.type === "registration"
              ? "Registration information for pending user"
              : profileData.type === "profile_under_review"
                ? "Complete profile information for review"
                : "Profile information for user with incomplete profile"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Alert */}
          <div
            className={`p-4 rounded-lg border ${
              profileData.type === "registration"
                ? "bg-yellow-50 border-yellow-200"
                : profileData.type === "profile_under_review"
                  ? "bg-green-50 border-green-200"
                  : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle
                className={`h-4 w-4 ${
                  profileData.type === "registration"
                    ? "text-yellow-600"
                    : profileData.type === "profile_under_review"
                      ? "text-green-600"
                      : "text-blue-600"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  profileData.type === "registration"
                    ? "text-yellow-800"
                    : profileData.type === "profile_under_review"
                      ? "text-green-800"
                      : "text-blue-800"
                }`}
              >
                {profileData.type === "registration"
                  ? "User hasn't completed profile yet"
                  : profileData.type === "profile_under_review"
                    ? "Complete profile ready for review"
                    : "Profile partially completed"}
              </span>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                {profileData.data.name || "Not provided"}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                {profileData.data.email || "Not provided"}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Hash className="h-4 w-4" />
                National ID
              </Label>
              <div className="p-3 bg-gray-50 rounded-md border font-mono">
                {profileData.data.nationalId || "Not provided"}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Role</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <Badge variant="outline" className="capitalize">
                  {profileData.data.role || "Not specified"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Registration Date
              </Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                {profileData.data.createdAt
                  ? new Date(profileData.data.createdAt).toLocaleDateString()
                  : "Not available"}
              </div>
            </div>
          </div>

          {/* Profile Data (for incomplete profiles and profile under review) */}
          {(profileData.type === "incomplete_profile" ||
            profileData.type === "profile_under_review") && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Profile Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileData.data.jobTitle && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Job Title</Label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      {profileData.data.jobTitle}
                    </div>
                  </div>
                )}

                {profileData.data.company && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Company</Label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      {profileData.data.company}
                    </div>
                  </div>
                )}

                {profileData.data.experienceYears && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Experience</Label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      {profileData.data.experienceYears} years
                      {profileData.data.experienceMonths &&
                        ` ${profileData.data.experienceMonths} months`}
                    </div>
                  </div>
                )}

                {profileData.data.mainTrack && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Main Track</Label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      {profileData.data.mainTrack}
                    </div>
                  </div>
                )}

                {profileData.data.generalSpecialization && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      General Specialization
                    </Label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      {profileData.data.generalSpecialization}
                    </div>
                  </div>
                )}

                {profileData.data.specificSpecialization && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Specific Specialization
                    </Label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      {profileData.data.specificSpecialization}
                    </div>
                  </div>
                )}

                {profileData.data.skills &&
                  profileData.data.skills.length > 0 && (
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm font-medium">Skills</Label>
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <div className="flex flex-wrap gap-2">
                          {profileData.data.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill.value || skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                {profileData.data.bio && (
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium">Bio</Label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      {profileData.data.bio}
                    </div>
                  </div>
                )}

                {profileData.data.education &&
                  profileData.data.education.length > 0 && (
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm font-medium">Education</Label>
                      <div className="p-3 bg-gray-50 rounded-md border">
                        {profileData.data.education.map((edu, index) => (
                          <div
                            key={index}
                            className="mb-2 p-2 bg-white rounded border"
                          >
                            <p>
                              <strong>Degree:</strong>{" "}
                              {edu.degree || edu.customDegree}
                            </p>
                            <p>
                              <strong>University:</strong> {edu.university}
                            </p>
                            <p>
                              <strong>Period:</strong> {edu.startDate} -{" "}
                              {edu.endDate}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {profileData.data.languages &&
                  profileData.data.languages.length > 0 && (
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm font-medium">Languages</Label>
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <div className="flex flex-wrap gap-2">
                          {profileData.data.languages.map((lang, index) => (
                            <Badge key={index} variant="secondary">
                              {lang.language} - {lang.proficiency}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Admin Comment */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Admin Comment (Required)
            </Label>
            <Textarea
              placeholder="Add your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleAction("reject")}
            disabled={isLoading || !comment.trim()}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            {isLoading
              ? profileData.type === "registration"
                ? "Rejecting..."
                : "Rejecting Profile..."
              : profileData.type === "registration"
                ? "Reject"
                : "Reject Profile"}
          </Button>
          <Button
            onClick={() => handleAction("approve")}
            disabled={isLoading || !comment.trim()}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {isLoading
              ? profileData.type === "registration"
                ? "Approving..."
                : "Approving Profile..."
              : profileData.type === "registration"
                ? "Approve"
                : "Approve Profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
