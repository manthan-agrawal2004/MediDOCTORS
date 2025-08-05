"use server"

import { db } from "@/lib/prisma";
export async function getDoctorsBySpecialty(specialty){
    try{
        const doctors=await db.user.findMany({
            where:{
                role:"DOCTOR",
                verificationStatus:"VERIFIED",
                specialty:specialty,
            },
            orderBy:{
                name:"asc",
            }
        });

        return {doctors};
    }
    catch(err){
        console.log("Failed to fetich doctors by specialty",err);
        return {err:"Failed to fetch doctors"};

    }
}