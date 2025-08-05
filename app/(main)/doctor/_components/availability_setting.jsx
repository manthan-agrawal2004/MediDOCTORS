"use client"

import { setAvailabilitySlots } from '@/actions/doctor'
import useFetch from '@/hooks/use-fetch'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertCircle, Clock, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'

const AvailabiltySetting = ({ slots }) => {
  const [showForm, setShowForm] = useState(false)
  const { loading, fn: submitSlot, data } = useFetch(setAvailabilitySlots)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      startTime: "",
      endTime: "",
    }
  })

  function createLocalDateFromTime(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number)
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
  }

  const formatTimeString = (dateString) => {
    try {
      return format(new Date(dateString), "h:mm a")
    } catch {
      return "Invalid time"
    }
  }

  const onSubmit = async (formValues) => {
    if (loading) return

    const startDate = createLocalDateFromTime(formValues.startTime)
    const endDate = createLocalDateFromTime(formValues.endTime)
    const diff = (endDate - startDate) / (1000 * 60 * 60)

    if (diff < 1) {
      toast.error("Time slot must be at least 1 hour.")
      return
    }

    const formData = new FormData()
    formData.append("startTime", startDate.toISOString())
    formData.append("endTime", endDate.toISOString())
    await submitSlot(formData)
  }

  useEffect(() => {
    if (data?.success) {
      setShowForm(false)
      toast.success("Availability slots updated successfully")
    }
  }, [data])

  return (
    <Card className="border-sky-900/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center">
          <Clock className="h-5 w-5 mr-2 text-sky-400" />
          Availability Settings
        </CardTitle>
        <CardDescription>
          Set your daily availability for patient appointments
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-3">Current Availability</h3>
                {slots.length === 0 ? (
                  <p className="text-muted-foreground">
                    You haven't set any availability slots yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {slots.map((slot) => (
                      <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center p-3 rounded-md bg-muted/20 border border-sky-900/20"
                      >
                        <div className="bg-sky-900/20 p-2 rounded-full mr-3">
                          <Clock className="h-4 w-4 text-sky-400" />
                        </div>
                        <p className="text-white font-medium">
                          {formatTimeString(slot.startTime)} – {formatTimeString(slot.endTime)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={() => setShowForm(true)}
                className="w-full bg-sky-600 hover:bg-sky-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Set Availability Time
              </Button>

              <div className="mt-6 p-4 bg-muted/10 border border-sky-900/10 rounded-md">
                <h4 className="font-medium text-white mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-sky-400" />
                  How Availability Works
                </h4>
                <p className="text-muted-foreground text-sm">
                  Your availability schedule enables patients to book appointments during the specified time slots.
                  You can modify your availability anytime. Changes won&apos;t affect already booked appointments.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 border border-sky-900/20 rounded-md p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium text-white mb-2">Set Daily Availability</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    {...register("startTime", { required: "Start time is required" })}
                    className="bg-background border-sky-900/20"
                  />
                  {errors.startTime && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.startTime.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    {...register("endTime", { required: "End time is required" })}
                    className="bg-background border-sky-900/20"
                  />
                  {errors.endTime && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-8 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-sky-900/30"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-sky-600 hover:bg-sky-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Availability"
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

export default AvailabiltySetting