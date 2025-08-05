"use client";

import { generateVideoToken } from "@/actions/appointments";
import {
  addAppointmentNotes,
  cancelAppointment,
  markAppointmentCompleted,
} from "@/actions/doctor";
import useFetch from "@/hooks/use-fetch";
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Loader2,
  Stethoscope,
  User,
  Video,
  X,
} from "lucide-react";
import { Badge } from "./ui/badge";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { format } from "date-fns";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

const AppointmentCard = ({ appointment, userRole }) => {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [notes, setNotes] = useState(appointment.notes || "");
  const router = useRouter();

  const { loading: cancelLoading, fn: submitCancel, data: cancelData } = useFetch(cancelAppointment);
  const { loading: notesLoading, fn: submitNotes, data: notesData } = useFetch(addAppointmentNotes);
  const { loading: tokenLoading, fn: submitTokenRequest, data: tokenData } = useFetch(generateVideoToken);
  const { loading: completeLoading, fn: submitMarkCompleted, data: completeData } = useFetch(markAppointmentCompleted);

  const formatDate = (value) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date)) return "Invalid date";
    return format(date, "MMMM d, yyyy 'at' h:mm a");
  };

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch {
      return "Invalid Time";
    }
  };

  const canMarkCompleted = () => {
    if (userRole !== "DOCTOR" || appointment.status !== "SCHEDULED") return false;
    const now = new Date();
    const appointmentEndTime = new Date(appointment.endTime);
    return now >= appointmentEndTime;
  };

  const isAppointmentActive = () => {
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const appointmentEndTime = new Date(appointment.endTime);
    return (
      (appointmentTime.getTime() - now.getTime() <= 30 * 60 * 1000 && now < appointmentTime) ||
      (now >= appointmentTime && now <= appointmentEndTime)
    );
  };

  const handleMarkComplete = async () => {
    if (completeLoading) return;
    if (window.confirm("Are you sure you want to mark this appointment as completed? This action cannot be undone.")) {
      const formData = new FormData();
      formData.append("appointmentId", appointment.id);
      await submitMarkCompleted(formData);
    }
  };

  const handleJoinVideoCall = async () => {
    if (tokenLoading) return;
    setAction("video");
    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    await submitTokenRequest(formData);
  };

  const handleSaveNotes = async () => {
    if (notesLoading || userRole !== "DOCTOR") return;
    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    formData.append("notes", notes);
    await submitNotes(formData);
  };

  const handleCancelAppointment = async () => {
    if (cancelLoading) return;
    if (window.confirm("Are you sure you want to cancel this appointment? This action cannot be undone.")) {
      const formData = new FormData();
      formData.append("appointmentId", appointment.id);
      await submitCancel(formData);
    }
  };

  useEffect(() => {
    if (notesData?.success) {
      toast.success("Notes saved successfully");
      setAction(null);
    } else if (notesData?.error) {
      toast.error(notesData.error);
    }
  }, [notesData]);

  useEffect(() => {
    if (completeData?.success) {
      toast.success("Appointment marked as completed");
      setOpen(false);
    } else if (completeData?.error) {
      toast.error(completeData.error);
    }
  }, [completeData]);

  useEffect(() => {
    if (tokenData?.success) {
      router.push(
        `/video-call?sessionId=${encodeURIComponent(tokenData.videoSessionId)}&token=${encodeURIComponent(
          tokenData.token
        )}&appointmentId=${encodeURIComponent(appointment.id)}`
      );
    } else if (tokenData?.error) {
      toast.error(tokenData.error);
    }
  }, [tokenData, appointment.id, router]);

  useEffect(() => {
    if (cancelData?.success) {
      toast.success("Appointment cancelled successfully");
      setOpen(false);
    } else if (cancelData?.error) {
      toast.error(cancelData.error);
    }
  }, [cancelData]);

  const otherParty = userRole === "DOCTOR" ? appointment.patient : appointment.doctor;
  const otherPartLabel = userRole === "DOCTOR" ? "PATIENT" : "DOCTOR";
  const otherPartyIcon = userRole === "DOCTOR" ? (
    <User className="text-sky-400" />
  ) : (
    <Stethoscope className="text-sky-400" />
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
      >
        <Card className="border-sky-900/20 hover:border-sky-700/30 transition-all rounded-xl shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="bg-muted/20 rounded-full p-2 mt-1 flex-shrink-0">{otherPartyIcon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">
                    {userRole === "DOCTOR" ? otherParty.name?.split(" ")[0] : `Dr. ${otherParty.name?.split(" ")[0]}`}
                  </h3>
                  {userRole === "DOCTOR" && <p className="text-sm text-muted-foreground truncate">{otherParty.email}</p>}
                  {userRole === "PATIENT" && <p className="text-sm text-muted-foreground truncate">{otherParty.specialty}</p>}

                  <div className="flex items-center mt-2 text-sm text-muted-foreground gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(appointment.startTime)}</span>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end justify-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    appointment.status === "COMPLETED"
                      ? "bg-sky-900/20 border-sky-900/30 text-sky-400"
                      : appointment.status === "CANCELLED"
                        ? "bg-red-900/20 border-red-900/30 text-red-400"
                        : "bg-amber-900/20 border-amber-900/30 text-amber-400"
                  }
                >
                  {appointment.status}
                </Badge>

                <div className="flex gap-2 flex-wrap mt-1">
                  {canMarkCompleted() && (
                    <Button
                      size="sm"
                      onClick={handleMarkComplete}
                      disabled={completeLoading}
                      className="bg-sky-600 hover:bg-sky-700 flex items-center transition-transform hover:scale-105"
                    >
                      {completeLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Completing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" /> Complete
                        </>
                      )}
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="border-sky-900/30 transition-transform hover:scale-105" onClick={() => setOpen(true)}>
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {open && (
          <Dialog open={open} onOpenChange={setOpen}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <DialogContent className="max-w-lg p-6">
                <DialogHeader>
                  <div className="flex flex-col gap-1">
                    <DialogTitle className="text-xl font-bold text-white">Appointment Details</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {appointment.status === "SCHEDULED"
                        ? "Manage your upcoming appointment"
                        : "View appointment information"}
                    </DialogDescription>
                  </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">{otherPartLabel}</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">{otherPartyIcon}</div>
                      <div>
                        <p className="text-white font-medium truncate">
                          {userRole === "DOCTOR"
                            ? otherParty.name.split(" ")[0]
                            : `Dr. ${otherParty.name.split(" ")[0]}`}
                        </p>
                        {userRole === "DOCTOR" && (
                          <p className="text-muted-foreground text-sm truncate">{otherParty.email}</p>
                        )}
                        {userRole === "PATIENT" && (
                          <p className="text-muted-foreground text-sm truncate">{otherParty.specialty}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Scheduled Time</h4>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-sky-400" />
                        <p className="text-white">{formatDate(appointment.startTime)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-sky-400" />
                        <p className="text-white">
                          {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <Badge
                      variant="outline"
                      className={
                        appointment.status === "COMPLETED"
                          ? "bg-sky-900/20 border-sky-900/30 text-sky-400"
                          : appointment.status === "CANCELLED"
                            ? "bg-red-900/20 border-red-900/30 text-red-400"
                            : "bg-amber-900/20 border-amber-900/30 text-amber-400"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>

                  {appointment.patientDescription && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        {userRole === "DOCTOR" ? "Patient Description" : "Your Description"}
                      </h4>
                      <div className="p-3 rounded-md bg-muted/20 border border-sky-900/20">
                        <p className="text-white whitespace-pre-line">{appointment.patientDescription}</p>
                      </div>
                    </div>
                  )}

                  {appointment.status === "SCHEDULED" && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Video Consultation</h4>
                      <Button
                        className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 transition-transform hover:scale-105"
                        disabled={!isAppointmentActive() || action === "video" || tokenLoading}
                        onClick={handleJoinVideoCall}
                      >
                        {tokenLoading || action === "video" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Preparing Video Call...
                          </>
                        ) : (
                          <>
                            <Video className="h-4 w-4" />
                            {isAppointmentActive()
                              ? "Join Video Call"
                              : "Available 30 minutes before appointment"}
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-muted-foreground">Doctor Notes</h4>
                      {userRole === "DOCTOR" &&
                        action !== "notes" &&
                        appointment.status !== "CANCELLED" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAction("notes")}
                            className="h-7 text-sky-400 hover:text-sky-300 hover:bg-sky-900/20 flex items-center gap-1"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            {appointment.notes ? "Edit" : "Add"}
                          </Button>
                        )}
                    </div>
                    {userRole === "DOCTOR" && action === "notes" ? (
                      <div className="space-y-3">
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Enter your clinical notes here..."
                          className="bg-background border-sky-900/20 min-h-[100px]"
                        />

                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setAction(null);
                              setNotes(appointment.notes || "");
                            }}
                            disabled={notesLoading}
                            className="border-sky-900/30"
                          >
                            Cancel
                          </Button>

                          <Button
                            size="sm"
                            onClick={handleSaveNotes}
                            disabled={notesLoading}
                            className="bg-sky-600 hover:bg-sky-700 flex items-center"
                          >
                            {notesLoading ? (
                              <>
                                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Notes"
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-md bg-muted/20 border border-sky-900/20 min-h-[80px]">
                        {appointment.notes ? (
                          <p className="text-white whitespace-pre-line">{appointment.notes}</p>
                        ) : (
                          <p className="text-muted-foreground italic">No notes added yet</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="flex flex-col-reverse sm:flex-row justify-center gap-2 items-center">
                  {appointment.status === "SCHEDULED" && (
                    <Button
                      variant="outline"
                      onClick={handleCancelAppointment}
                      disabled={cancelLoading}
                      className="border-red-900/30 text-red-400 hover:bg-red-900/10 flex items-center"
                    >
                      {cancelLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-1" />
                          Cancel Appointment
                        </>
                      )}
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppointmentCard;
