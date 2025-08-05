"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


export async function verifyAdmin(){

    const {userId}=await auth();
    if(!userId){
        return false;
    }
    try{
        const user=await db.user.findUnique({
            where:{
                clerkUserId:userId,
            }
        });
        return user?.role==="ADMIN";
    }
    catch(error){
        console.log("Failed to verify admin: ",error);
        return false;
    }
}

export async function getPendingDoctors(){
    const isAdmin=await verifyAdmin();
    if(!isAdmin)  throw new Error("Unauthorized");

    try{
        const pendingDoctors= await db.user.findMany({
            where:{
                role:"DOCTOR",
                verificationStatus:"PENDING",
            },
            orderBy:{
                createdAt:"desc",
            }
        });
        return {doctors: pendingDoctors};
    }
    catch(error){
        throw new Error("Failed to fetch pending doctors");
    }
}


export async function getVerifiedDoctors(){
    const isAdmin=await verifyAdmin();
    if(!isAdmin)  throw new Error("Unauthorized");

    try{
        const verifiedDoctors= await db.user.findMany({
            where:{
                role:"DOCTOR",
                verificationStatus:"VERIFIED",
            },
            orderBy:{
                createdAt:"asc",
            }
        });
        return {doctors: verifiedDoctors};
    }
    catch(error){
        throw new Error("Failed to fetch verified doctors");
    }
}

export async function updateDoctorStatus(formData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) throw new Error("Unauthorized");
  
    const doctorId = formData.get("doctorId");
    const formStatus = formData.get("status");
    const suspend = formData.get("suspend") === "true";
  
    if (!doctorId || !["VERIFIED", "REJECTED"].includes(formStatus)) {
      throw new Error("Invalid Input");
    }
  
    try {
      const verificationStatus = suspend ? "PENDING" : formStatus;
  
      await db.user.update({
        where: {
          id: doctorId,
        },
        data: {
          verificationStatus,
        },
      });
  
      revalidatePath("/admin");
  
      return { success: true, status: verificationStatus };
    } catch (error) {
      console.error("Failed to update doctor status:", error);
      throw new Error(`Failed to update doctor status: ${error.message}`);
    }
  }

  export async function getPendingPayouts() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) throw new Error("Unauthorized");
  
    try {
      const pendingPayouts = await db.payout.findMany({
        where: {
          status: "PROCESSING",
        },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              email: true,
              specialty: true,
              credits: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      return { payouts: pendingPayouts };
    } catch (error) {
      console.error("Failed to fetch pending payouts:", error);
      throw new Error("Failed to fetch pending payouts");
    }
  }
  
  export async function approvePayout(formData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) throw new Error("Unauthorized");
  
    const payoutId = formData.get("payoutId");
  
    if (!payoutId) {
      throw new Error("Payout ID is required");
    }
  
    try {

      const { userId } = await auth();
      const admin = await db.user.findUnique({
        where: { clerkUserId: userId },
      });

      const payout = await db.payout.findUnique({
        where: {
          id: payoutId,
          status: "PROCESSING",
        },
        include: {
          doctor: true,
        },
      });
  
      if (!payout) {
        throw new Error("Payout request not found or already processed");
      }

      if (payout.doctor.credits < payout.credits) {
        throw new Error("Doctor doesn't have enough credits for this payout");
      }
  
 
      await db.$transaction(async (tx) => {

        await tx.payout.update({
          where: {
            id: payoutId,
          },
          data: {
            status: "PROCESSED",
            processedAt: new Date(),
            processedBy: admin?.id || "unknown",
          },
        });

        await tx.user.update({
          where: {
            id: payout.doctorId,
          },
          data: {
            credits: {
              decrement: payout.credits,
            },
          },
        });
        await tx.creditTransaction.create({
          data: {
            userId: payout.doctorId,
            amount: -payout.credits,
            type: "ADMIN_ADJUSTMENT",
          },
        });
      });
  
      revalidatePath("/admin");
      return { success: true };
    } catch (error) {
      console.error("Failed to approve payout:", error);
      throw new Error(`Failed to approve payout: ${error.message}`);
    }
  }