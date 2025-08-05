"use client"

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Stethoscope, User } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { setUserRole } from "@/actions/onboarding";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SPECIALTIES } from "@/lib/specialities";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

const doctorFormSchema = z.object({
  specialty: z.string().min(1, "Specialty is required"),
  experience: z.number().min(1, "Experience must be at least 1 year"),
  credentialUrl: z.string().url("Please enter a valid url").min(1, "Credential URL is required"),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000, "Description cannot exceed 1000 characters"),
})

const OnboardingPage = () => {
  const router = useRouter();
  const [step, setStep] = useState("choose-role");
  const { data, fn: submitUserRole, loading } = useFetch(setUserRole)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      specialty: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
    }
  })

  const handlePatientSelection = async () => {
    if (loading) return;
    const formData = new FormData();
    formData.append("role", "PATIENT")
    await submitUserRole(formData);
  }

  const onDoctorSubmit = async (data) => {
    if (loading) return;
    const formData = new FormData();
    formData.append("role", "DOCTOR");
    formData.append("specialty", data.specialty);
    formData.append("experience", data.experience.toString());
    formData.append("credentialUrl", data.credentialUrl);
    formData.append("description", data.description);
    await submitUserRole(formData);
  }

  useEffect(() => {
    if (data && data?.success) {
      toast.success("Role selected")
      router.push(data.redirect);
    }
  }, [data])

  if (step === "choose-role") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card
            onClick={() => !loading && handlePatientSelection()}
            className="border border-sky-800/30 hover:border-sky-600/50 shadow-md hover:shadow-lg bg-sky-950/20 transition-transform duration-200"
          >
            <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center text-center">
              <div className="bg-sky-900/30 p-4 rounded-full mb-4">
                <User className="h-8 w-8 text-sky-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-white mb-2">
                Get Started as a Patient
              </CardTitle>
              <CardDescription className="mb-4 text-sm text-muted-foreground">
                Book appointments, consult with doctors, and manage your healthcare journey seamlessly.
              </CardDescription>
              <Button className="w-full mt-2 bg-sky-600 hover:bg-sky-700" disabled={loading}>
                {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>) : ("Join as Patient")}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card
            onClick={() => !loading && setStep("doctor-form")}
            className="border border-sky-800/30 hover:border-sky-600/50 shadow-md hover:shadow-lg bg-sky-950/20 transition-transform duration-200"
          >
            <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center text-center">
              <div className="bg-sky-900/30 p-4 rounded-full mb-4">
                <Stethoscope className="h-8 w-8 text-sky-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-white mb-2">
                Join as a Doctor
              </CardTitle>
              <CardDescription className="mb-4 text-sm text-muted-foreground">
                Build your professional profile, set your availability, and start consulting patients.
              </CardDescription>
              <Button className="w-full mt-2 bg-sky-600 hover:bg-sky-700" disabled={loading}>
                Join as Doctor
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    )
  }

  if (step === "doctor-form") {
    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-sky-900/20">
          <CardContent className="pt-6">
            <div className="mb-6">
              <CardTitle className="text-xl font-semibold text-white mb-2">
                Complete Your Doctor Profile
              </CardTitle>
              <CardDescription>
                Please provide your professional details for verification
              </CardDescription>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onDoctorSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="specialty">Medical Specialty</Label>
                <Select onValueChange={(value) => setValue("specialty", value)}>
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="Select your specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((spec) => (
                      <SelectItem key={spec.name} value={spec.name} className="flex items-center gap-2">
                        <span className="text-sky-400">{spec.icon}</span>
                        {spec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.specialty && <p className="text-sm font-medium text-red-500 mt-1">{errors.specialty.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" type="number" placeholder="eg. 5" {...register("experience", { valueAsNumber: true })} />
                {errors.experience && <p className="text-sm font-medium text-red-500 mt-1">{errors.experience.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="credentialUrl">Link to Credential Document</Label>
                <Input id="credentialUrl" type="url" placeholder="https://example.com/my-medicalDegree.pdf" {...register("credentialUrl")} />
                {errors.credentialUrl && <p className="text-sm font-medium text-red-500 mt-1">{errors.credentialUrl.message}</p>}
                <p className="text-sm text-muted-foreground">Please provide a link to your medical degree or certification</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description of Your Services</Label>
                <Textarea id="description" placeholder="Describe your expertise, services and approach to patient care..." rows={4} {...register("description")} />
                {errors.description && <p className="text-sm font-medium text-red-500 mt-1">{errors.description.message}</p>}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button className="border-sky-900/30" disabled={loading} type="button" variant="outline" onClick={() => setStep("choose-role")}>Back</Button>

                <Button type="submit" className="bg-sky-600 hover:bg-sky-700" disabled={loading}>
                  {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>) : ("Submit for Verification")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    )
  }
}

export default OnboardingPage;
