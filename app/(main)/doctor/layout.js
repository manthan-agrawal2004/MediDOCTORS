import PageHeader from "@/components/page_header";
import { Stethoscope } from "lucide-react";
import React, { Children } from "react";

export const metaData={
    title:"Doctor Dashboard-MediDOCTORS",
    description:"Manage your appoinments and availability",
}
const DoctorDashboardLayout=({children})=>{
    return <div className="container mx-auto px-4 py-8">
        <PageHeader icon={<Stethoscope/>} title={"Doctor Dashboard"}/>
        {children}</div>;
}

export default DoctorDashboardLayout;