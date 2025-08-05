import { getDoctorById } from '@/actions/appointments';
import PageHeader from '@/components/page_header';
import { Description } from '@radix-ui/react-dialog';
import { redirect } from 'next/navigation';
import React from 'react'

export async function generateMetaData({params}){
    const {id}=await params;
    const {doctor}=await getDoctorById(id);

    return {
        title: `Dr. ${doctor.name}- Medimeet`,
        description:  `Book an appointmnent with Dr. ${doctor.name}, ${doctor.specialty} specialist with ${doctor.experience} years of experience`
    }
}

const PageLayout = async ({children,params}) => {
    const {id}=await params;
    const {doctor}=await getDoctorById(id);

    if(!doctor) redirect('/doctors');
  return (
    <div className='container mx-auto '>
        <PageHeader title={"Dr."+doctor.name} backLink={`/doctors/${doctor.specialty}`}backLabel={`Back to ${doctor.specialty}`}/>
        {children}
    </div>
  )
}

export default PageLayout