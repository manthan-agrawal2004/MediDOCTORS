"use client";

import { getDoctorsBySpecialty } from '@/actions/doctors_listing';
import DoctorCard from '@/components/doctor_card';
import PageHeader from '@/components/page_header';
import { redirect, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SpecialityPage = () => {
  const { specialty } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!specialty) {
      redirect('/doctors');
      return;
    }

    const fetchDoctors = async () => {
      try {
        const result = await getDoctorsBySpecialty(specialty);
        if (result?.err) {
          setError(result.err);
        } else {
          setDoctors(result.doctors || []);
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to fetch doctors');
      }
    };

    fetchDoctors();
  }, [specialty]);

  return (
    <div className="space-y-5">
      <PageHeader
        title={decodeURIComponent(specialty)}
        backLink="/doctors"
        backLabel="All Specialties"
      />

      {error ? (
        <div className="text-center py-12 text-red-500">Error: {error}</div>
      ) : doctors.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <DoctorCard doctor={doctor} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-white mb-2">
            No Doctors Available
          </h3>
          <p className="text-muted-foreground">
            There are currently no verified doctors in this specialty. Please check back later or choose another specialty.
          </p>
        </div>
      )}
    </div>
  );
};

export default SpecialityPage;