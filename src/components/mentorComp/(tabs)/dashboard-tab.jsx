"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Loader2,
  LucideLoader2,
  User,
  X,
  Eye,
  Check,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUserContext } from "@/context/userContext";
import {
  getAvailableSessions,
  getBookedSessions,
  addSession,
  updateSession,
  deleteSession,
  getSessionRequestsForMentor,
  getSessionRequestsForSession,
  acceptSessionRequest,
  rejectSessionRequest,
  getPendingRequestsCountForSession,
} from "@/services/firebase";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DashboardTab() {
  const [sessions, setSessions] = useState([]);
  const [bookedSessions, setBookedSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editSessionId, setEditSessionId] = useState(null);
  const [deleteSessionId, setDeleteSessionId] = useState(null);

  const [sessionRequests, setSessionRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [selectedSessionIdForApplicants, setSelectedSessionIdForApplicants] =
    useState(null);
  const [applicantsForSelectedSession, setApplicantsForSelectedSession] =
    useState([]);
  const [isApplicantsDialogOpen, setIsApplicantsDialogOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();
  const { user } = useUserContext();
  const mentorId = user.id;

  useEffect(() => {
    if (!mentorId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [available, booked] = await Promise.all([
          getAvailableSessions(mentorId),
          getBookedSessions(mentorId),
        ]);

        // فحص السيشنز اللي معادها عدّى
        const today = new Date();
        const validBookedSessions = booked.filter((session) => {
          const sessionDate = new Date(`${session.date}T${session.time}`);
          if (sessionDate < today && session.status !== "Cancelled") {
            // تحديث السيشن في Firebase لتكون Cancelled
            updateSession(session.id, { ...session, status: "Cancelled" });
            return false; // استبعاد السيشن من القايمة
          }
          return true;
        });

        console.log(available, booked);
        setSessions(available);
        setBookedSessions(validBookedSessions);
      } catch (error) {
        toast.error("Failed to load sessions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mentorId]);

  // requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (!mentorId) return;
      setIsLoadingRequests(true);
      try {
        const requests = await getSessionRequestsForMentor(mentorId);
        setSessionRequests(requests);
      } catch (err) {
        console.error("Failed to fetch session requests:", err);
        toast.error("Failed to load session requests.");
      } finally {
        setIsLoadingRequests(false);
      }
    };

    fetchRequests();
  }, [mentorId]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (editSessionId) {
        // Edit mode
        const updatedSession = await updateSession(editSessionId, data);
        setSessions(
          sessions.map((s) => (s.id === editSessionId ? updatedSession : s)),
        );
        toast.success("Session updated successfully");
      } else {
        // Add mode
        const newSession = await addSession(data, mentorId);
        setSessions([...sessions, newSession]);
        toast.success("Session added successfully");
      }
      reset();
      setEditSessionId(null);
    } catch (error) {
      toast.error(
        editSessionId ? "Failed to update session" : "Failed to add session",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (session) => {
    setEditSessionId(session.id);
    setValue("date", session.date);
    setValue("time", session.time);
    setValue("duration", session.duration);
  };

  const handleCancelEdit = () => {
    setEditSessionId(null);
    reset();
  };

  const handleDelete = async () => {
    try {
      await deleteSession(deleteSessionId);
      setSessions(sessions.filter((s) => s.id !== deleteSessionId));
      setDeleteSessionId(null);
      toast.success("Session deleted successfully");
    } catch (error) {
      toast.error("Failed to delete session");
    }
  };

  return (
    <TabsContent value="dashboard" className="p-4 sm:p-6">
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[var(--foreground)]">
            Session Schedule
          </h3>
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-[var(--foreground)]">
                Available Time Slots
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-[240px]">
                  <LucideLoader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                </div>
              ) : (
                <div className="max-h-[240px] overflow-y-auto grid gap-2 sm:gap-3">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 border rounded-lg border-[var(--border)]"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 text-xs sm:text-sm">
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4 text-[var(--muted-foreground)]" />
                        </span>
                        <span className="text-[var(--foreground)]">
                          " {session.title} "
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-[var(--muted-foreground)]" />
                          <span className="text-[var(--foreground)]">
                            {session.date}
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-[var(--muted-foreground)]" />
                          <span className="text-[var(--foreground)]">
                            {session.time}
                          </span>
                        </span>
                        <Badge
                          variant="outline"
                          className="border-[var(--border)] text-[var(--foreground)] text-xs sm:text-sm"
                        >
                          {session.duration}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[var(--border)] text-[var(--foreground)] text-xs sm:text-sm cursor-pointer"
                          onClick={() => handleEdit(session)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-xs sm:text-sm cursor-pointer"
                          onClick={() => setDeleteSessionId(session.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[var(--foreground)]">
            {editSessionId ? "Edit Availability" : "Add New Availability"}
          </h3>
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardContent className="pt-4 sm:pt-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3 sm:space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <Label
                      htmlFor="date"
                      className="text-[var(--foreground)] text-xs sm:text-sm"
                    >
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      {...register("date", {
                        required: "Date is required",
                        validate: (value) =>
                          new Date(value) > new Date() ||
                          "Date must be in the future",
                      })}
                      className="border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-xs sm:text-sm"
                    />
                    {errors.date && (
                      <p className="text-[var(--destructive)] text-xs">
                        {errors.date.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="time"
                      className="text-[var(--foreground)] text-xs sm:text-sm"
                    >
                      Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      {...register("time", { required: "Time is required" })}
                      className="border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-xs sm:text-sm"
                    />
                    {errors.time && (
                      <p className="text-[var(--destructive)] text-xs">
                        {errors.time.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="duration"
                      className="text-[var(--foreground)] text-xs sm:text-sm"
                    >
                      Duration
                    </Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 1h, 30m"
                      {...register("duration", {
                        required: "Duration is required",
                        pattern: {
                          value: /^\d+(h|m)$/,
                          message: "Duration must be like '1h' or '30m'",
                        },
                      })}
                      className="border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-xs sm:text-sm"
                    />
                    {errors.duration && (
                      <p className="text-[var(--destructive)] text-xs">
                        {errors.duration.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="title"
                      className="text-[var(--foreground)] text-xs sm:text-sm"
                    >
                      Session Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Career Advice Session"
                      {...register("title", {
                        required: "Title is required",
                      })}
                    />
                    {errors.title && (
                      <p className="text-[var(--destructive)] text-xs">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editSessionId ? "Saving..." : "Adding..."}
                      </>
                    ) : editSessionId ? (
                      "Save Changes"
                    ) : (
                      "Add Availability"
                    )}
                  </Button>
                  {editSessionId && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto border-[var(--border)] text-[var(--foreground)] text-sm sm:text-base"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[var(--foreground)]">
            Requested Sessions
          </h3>
          {/* عرض الجلسة المتاحة مع عدد الطلبات وزر عرض المتقدمين */}
          {sessions
            .filter((s) => !s.isBooked) // تأكد من الفلترة
            .map((session) => {
              // حساب عدد الطلبات المعلقة محليًا
              const pendingRequestsCount = sessionRequests.filter(
                (req) =>
                  req.sessionId === session.id && req.status === "pending",
              ).length;

              return (
                <Card key={session.id} className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>
                        {session.title || `Session on ${session.date}`}
                      </span>
                      <Badge variant="secondary">{session.type}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      {session.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock className="w-4 h-4 mr-1" />
                      {session.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="font-medium">Price:</span>{" "}
                      {session.price}
                    </div>

                    {/* عرض عدد الطلبات وزر عرض المتقدمين */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">
                          Requests:
                        </span>
                        <Badge
                          variant={
                            pendingRequestsCount > 0 ? "default" : "secondary"
                          }
                        >
                          {pendingRequestsCount}
                        </Badge>
                      </div>
                      <Dialog
                        open={
                          isApplicantsDialogOpen &&
                          selectedSessionIdForApplicants === session.id
                        }
                        onOpenChange={setIsApplicantsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSessionIdForApplicants(session.id);
                              getSessionRequestsForSession(session.id)
                                .then(setApplicantsForSelectedSession)
                                .catch((err) => {
                                  console.error(
                                    "Failed to fetch applicants:",
                                    err,
                                  );
                                  toast.error("Failed to load applicants.");
                                });
                              setIsApplicantsDialogOpen(true);
                            }}
                            disabled={pendingRequestsCount === 0} // تعطيل الزر إذا مفيش طلبات
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Applicants
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Applicants for Session</DialogTitle>
                          </DialogHeader>
                          <div className="max-h-96 overflow-y-auto">
                            {applicantsForSelectedSession.length > 0 ? (
                              applicantsForSelectedSession
                                .filter(
                                  (applicant) => applicant.status === "pending",
                                ) // عرض المعلقة بس
                                .map((applicant) => (
                                  <Card key={applicant.id} className="mb-3">
                                    <CardContent className="p-4">
                                      <div className="flex items-start">
                                        <User className="w-5 h-5 mt-0.5 mr-2 text-gray-500" />
                                        <div className="flex-1">
                                          <h4 className="font-medium">
                                            {applicant.menteeName}
                                          </h4>
                                          <p className="text-xs text-gray-500 truncate">
                                            {applicant.menteeBio}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex justify-end space-x-2 mt-2">
                                        {/* زر عرض البروفايل - محتاج رابط */}
                                        <Button size="sm" variant="outline">
                                          View Profile
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={async () => {
                                            try {
                                              await acceptSessionRequest(
                                                applicant.id,
                                                session.id,
                                              );
                                              // تحديث الحالات المحلية
                                              setSessionRequests((prev) =>
                                                prev.map((req) =>
                                                  req.id === applicant.id
                                                    ? {
                                                        ...req,
                                                        status: "accepted",
                                                      }
                                                    : req,
                                                ),
                                              );
                                              setSessions((prev) =>
                                                prev.map((s) =>
                                                  s.id === session.id
                                                    ? { ...s, isBooked: true }
                                                    : s,
                                                ),
                                              );
                                              setBookedSessions((prev) => [
                                                ...prev,
                                                {
                                                  ...session,
                                                  isBooked: true,
                                                  bookedBy: applicant.menteeId,
                                                },
                                              ]); // افتراضي
                                              toast.success(
                                                "Session request accepted!",
                                              );
                                              setIsApplicantsDialogOpen(false); // إغلاق الـ Dialog
                                            } catch (err) {
                                              console.error(
                                                "Failed to accept request:",
                                                err,
                                              );
                                              toast.error(
                                                "Failed to accept request.",
                                              );
                                            }
                                          }}
                                        >
                                          <Check className="w-4 h-4 mr-1" />
                                          Accept
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))
                            ) : (
                              <p className="text-center text-gray-500 py-4">
                                No pending applicants.
                              </p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>

      <AlertDialog
        open={!!deleteSessionId}
        onOpenChange={() => setDeleteSessionId(null)}
      >
        <AlertDialogContent className="bg-[var(--card)] border-[var(--border)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--foreground)]">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--muted-foreground)]">
              Are you sure you want to delete this session?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--border)] text-[var(--foreground)]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TabsContent>
  );
}
