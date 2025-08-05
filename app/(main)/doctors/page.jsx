"use client";

import { Card, CardContent } from '@/components/ui/card';
import { SPECIALTIES } from '@/lib/specialities';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';

const DoctorsPage = () => {
  return (
    <>
      <div className='flex flex-col items-center justify-center mb-8 text-center'>
        <h1 className='text-3xl md:text-4xl font-bold mb-2 gradient-title'>
          Find Your Doctor
        </h1>
        <p className='text-muted-foreground text-lg'>
          Browse by speciality or view all available healthcare providers.
        </p>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {SPECIALTIES.map((specialty, index) => (
          <motion.div
            key={specialty.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
          >
            <Link href={`/doctors/${specialty.name}`}>
              <Card className="hover:border-sky-700/40 transition-all cursor-pointer border-sky-900/20 h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className='w-12 h-12 rounded-full bg-sky-900/20 flex items-center justify-center mb-4'>
                    <div className='text-sky-400'>{specialty.icon}</div>
                  </div>
                  <h3 className='font-medium text-white'>{specialty.name}</h3>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default DoctorsPage;