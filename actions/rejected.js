"use server"
import { auth } from "@clerk/nextjs/server";
import { db } from '@/lib/prisma';
import { redirect } from "next/navigation";
export async function updateProfile(){
    const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Find user in our database
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found in database");

  if (user.role === "DOCTOR" && user.verificationStatus === "REJECTED") {
    await db.user.update({
      where: {
        clerkUserId: userId,
      },
      data: {
        role: "UNASSIGNED",
        specialty: "",
        experience: 0, 
        credentialUrl: "",
        description: "",
        verificationStatus: "PENDING",
      },
    });
    redirect("/onboarding")
  }
}