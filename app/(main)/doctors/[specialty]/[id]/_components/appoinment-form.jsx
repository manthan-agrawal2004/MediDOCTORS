"use client";

import { bookAppointment } from '@/actions/appointments';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/use-fetch';

import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, CreditCard, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const AppointmentForm = ({ doctorId, slot, onBack, onComplete }) => {
  const [description, setDescription] = useState("");
  const { loading, data, error, fn: submitBooking } = useFetch(bookAppointment);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("startTime", slot.startTime);
    formData.append("endTime", slot.endTime);
    formData.append("description", description);

    await submitBooking(formData);
  };

  useEffect(() => {
    if (data) {
      if (data.success) {
        toast.success("Appointment booked successfully!");
        if (typeof onComplete === "function") onComplete();
      } else {
        toast.error(data.error || "Failed to book appointment");
      }
    }
  }, [data, onComplete]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Something went wrong");
    }
  }, [error]);

  return (
    <motion.form
      className="space-y-6"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-muted/20 p-4 rounded-lg border border-sky-900/30 space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-sky-400" />
          <span className="text-white font-medium">
            {format(new Date(slot.startTime), "EEEE, MMMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-sky-400" />
          <span className="text-white">{slot.formatted}</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-sky-400" />
          <span className="text-muted-foreground">
            Cost: <span className="text-white font-medium">2 credits</span>
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Describe your medical concern (optional)</Label>
        <Textarea
          id="description"
          placeholder="Please provide any details about your medical concern or what you'd like to discuss in the appointment"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-background border-sky-900/30 h-32"
        />
        <p className="text-sm text-muted-foreground">
          This information will be shared with the doctor before your appointment.
        </p>
      </div>

      <div className="flex justify-end py-4 space-x-5">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="border-sky-900/30 hover:bg-sky-900/10 hover:text-sky-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Change Time Slot
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="bg-sky-600 hover:bg-sky-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default AppointmentForm;