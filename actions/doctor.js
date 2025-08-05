"use server";

import { db } from '@/lib/prisma';
import { auth} from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { success } from 'zod';

export async function setAvailabilitySlots(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const doctor = await db.user.findUnique({
      where: { clerkUserId: userId, role: "DOCTOR" },
    });

    if (!doctor) throw new Error("Doctor not found");

    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");

    if (!startTime || !endTime) throw new Error("Start and end time required");

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) throw new Error("Start time must be before end time");

    await db.availability.deleteMany({
      where: { doctorId: doctor.id },
    });

    const newSlot = await db.availability.create({
      data: {
        doctorId: doctor.id,
        startTime: start,
        endTime: end,
        status: "AVAILABLE",
      },
    });

    revalidatePath("/doctor");
    return { success: true, slot: newSlot };
  } catch (error) {
    throw new Error("Failed to set availability: " + error.message);
  }
}
export async function getDoctorAvailability() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const doctor = await db.user.findUnique({
      where: { clerkUserId: userId, role: "DOCTOR" },
    });

    if (!doctor) throw new Error("Doctor not found");

    const availabilitySlots = await db.availability.findMany({
      where: { doctorId: doctor.id },
      orderBy: { startTime: "asc" },
    });

    return { slots: availabilitySlots };
  } catch (error) {
    throw new Error("Failed to fetch availability slots: " + error.message);
  }
}
export async function getDoctorAppointments() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const appointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: {
          in: ["SCHEDULED"],
        },
      },
      include: {
        patient: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return { appointments };
  } catch (error) {
    throw new Error("Failed to fetch appointments: " + error.message);
  }
}

export async function cancelAppointment(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const appointmentId = formData.get("appointmentId");
    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
      throw new Error("You are not authorized to cancel this appointment");
    }

    await db.$transaction(async (tx) => {
      // Mark appointment cancelled
      await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "CANCELLED" },
      });

      // Refund patient: +2 credits
      await tx.creditTransaction.create({
        data: {
          userId: appointment.patientId,
          amount: 2,
          type: "ADMIN_ADJUSTMENT",
        },
      });
      await tx.user.update({
        where: { id: appointment.patientId },
        data: {
          credits: {
            increment: 2,
          },
        },
      });

      // Deduct from doctor: -2 credits
      await tx.creditTransaction.create({
        data: {
          userId: appointment.doctorId,
          amount: -2,
          type: "ADMIN_ADJUSTMENT",
        },
      });
      await tx.user.update({
        where: { id: appointment.doctorId },
        data: {
          credits: {
            decrement: 2,
          },
        },
      });
    });

    if (user.role === "DOCTOR") {
      revalidatePath("/doctor");
    } else if (user.role === "PATIENT") {
      revalidatePath("/appointments");
    }

    return { success: true };
  } catch (error) {
    throw new Error("Failed to cancel appointment: " + (error instanceof Error ? error.message : String(error)));
  }
}

export async function addAppointmentNotes(formData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!doctor || doctor.role !== "DOCTOR") {
      throw new Error("Doctor not found");
    }

    const appointmentId = formData.get("appointmentId");
    let notes = formData.get("notes");

    if (!appointmentId || typeof appointmentId !== "string") {
      throw new Error("Appointment ID is required");
    }

    if (!notes || typeof notes !== "string") {
      throw new Error("Notes are required");
    }

    notes = notes.trim();

    const appointment = await db.appointment.findFirst({
      where: {
        id: appointmentId,
        doctorId: doctor.id,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    const updatedAppointment = await db.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        notes,
      },
    });

    revalidatePath("/doctor");
    return { success: true, appointment: updatedAppointment };
  } catch (error) {
    throw new Error("Failed to add/update notes: " + error.message);
  }
}

// Mark a scheduled appointment as completed
export async function markAppointmentCompleted(formData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!doctor || doctor.role !== "DOCTOR") {
      throw new Error("Doctor not found");
    }

    const appointmentId = formData.get("appointmentId");

    if (!appointmentId || typeof appointmentId !== "string") {
      throw new Error("Appointment ID is required");
    }

    const appointment = await db.appointment.findFirst({
      where: {
        id: appointmentId,
        doctorId: doctor.id,
      },
      include: {
        patient: true,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.status !== "SCHEDULED") {
      throw new Error("Only scheduled appointments can be marked as completed");
    }

    const now = new Date();
    const appointmentEndTime = new Date(appointment.endTime);

    if (now < appointmentEndTime) {
      throw new Error(
        "Cannot mark appointment as completed before the scheduled end time"
      );
    }

    const updatedAppointment = await db.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status: "COMPLETED",
      },
    });

    revalidatePath("/doctor");
    return { success: true, appointment: updatedAppointment };
  } catch (error) {
    throw new Error("Failed to mark appointment as completed: " + error.message);
  }
}