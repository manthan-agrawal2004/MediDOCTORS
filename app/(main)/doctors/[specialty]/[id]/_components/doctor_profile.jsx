"use client"

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator'
import {
    AlertCircle,
    Calendar,
    ChevronDown,
    ChevronUp,
    Clock,
    FileText,
    Medal,
    User,
} from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import SlotPicker from './slot-picker'
import AppoinmentForm from './appoinment-form'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const DoctorProfile = ({ doctor, availableDays }) => {
    const [showBooking, setShowBooking] = useState(false)
    const [selectSlot, setSelectedSlot] = useState(null)
    const router = useRouter()

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot)
    }

    const toogleBooking = () => {
        setShowBooking(!showBooking)
        if (!showBooking) {
            setTimeout(() => {
                document.getElementById("booking-section")?.scrollIntoView({
                    behavior: "smooth",
                })
            }, 100)
        }
    }

    const totalSlots = availableDays.reduce(
        (total, day) => total + day.slots.length,
        0
    )

    const handleBookingComplete = () => {
        router.push("/appointments")
    }

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="md:col-span-1">
                <div className="md:sticky md:top-24">
                    <Card className="border-sky-900/30 shadow-md hover:shadow-xl transition">
                        <CardContent className="pt-8 pb-6 px-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-sky-900/20">
                                    {doctor.imageUrl ? (
                                        <Image
                                            src={doctor.imageUrl}
                                            alt={doctor.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="h-16 w-16 text-sky-400" />
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-xl font-semibold text-white mb-1">
                                    Dr. {doctor.name}
                                </h2>

                                <Badge
                                    variant="outline"
                                    className="bg-sky-900/20 border-sky-900/30 text-sky-400 mb-3"
                                >
                                    {doctor.specialty}
                                </Badge>

                                <div className="flex items-center justify-center gap-1 mb-4">
                                    <Medal className="h-4 w-4 text-sky-400" />
                                    <span className="text-muted-foreground">
                                        {doctor.experience} years experience
                                    </span>
                                </div>

                                <Button
                                    onClick={toogleBooking}
                                    className="w-full bg-sky-600 hover:bg-sky-700 transition"
                                >
                                    {showBooking ? (
                                        <>
                                            Hide Booking
                                            <ChevronUp className="ml-2 h-4 w-4" />
                                        </>
                                    ) : (
                                        <>
                                            Book Appointment
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="md:col-span-2 space-y-8">
                <Card className="border-sky-900/30 shadow-sm hover:shadow-md transition">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-white">
                            About Dr. {doctor.name}
                        </CardTitle>
                        <CardDescription>{doctor.specialty}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-sky-400" />
                                <h3 className="text-white font-medium">Description</h3>
                            </div>
                            <p className="text-muted-foreground whitespace-pre-line">
                                {doctor.description}
                            </p>
                        </div>

                        <Separator className="bg-sky-900/30" />

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-sky-400" />
                                <h3 className="text-white font-medium">Availability</h3>
                            </div>

                            {totalSlots > 0 ? (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-sky-400" />
                                    <p className="text-muted-foreground">
                                        {totalSlots} time slots available for booking over the next 4 days
                                    </p>
                                </div>
                            ) : (
                                <Alert className="border-sky-900/30">
                                    <AlertCircle className="h-4 w-4 text-sky-400" />
                                    <AlertDescription>
                                        No available slots for the next 4 days. Please check back later.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {showBooking && (
                    <motion.div
                        id="booking-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="border-sky-900/30 shadow-md hover:shadow-lg transition">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-white">
                                    Book an Appointment
                                </CardTitle>
                                <CardDescription>
                                    Select a slot and provide details for your consultation
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {totalSlots > 0 ? (
                                    <>
                                        {!selectSlot && (
                                            <SlotPicker days={availableDays} onSelectSlot={handleSlotSelect} />
                                        )}
                                        {selectSlot && (
                                            <AppoinmentForm
                                                doctorId={doctor.id}
                                                slot={selectSlot}
                                                onBack={() => setSelectedSlot(null)}
                                                onComplete={handleBookingComplete}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <div className='text-center py-6'>
                                        <Calendar className='h-12 w-12 mx-auto text-muted-foreground mb-3' />
                                        <h3 className='text-xl font-medium text-white mb-2'>
                                            No available slots
                                        </h3>
                                        <p className='text-muted-foreground'>
                                            This doctor doesn&apos;t have any available appointment slots for the next 4 days. Please check back later or try another doctor.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}

export default DoctorProfile