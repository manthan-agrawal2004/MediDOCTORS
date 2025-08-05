"use client";

import React from 'react';
import { Card, CardContent } from './ui/card';
import { PricingTable } from '@clerk/nextjs';
import { motion } from 'framer-motion';

const Pricing = () => {
  return (
    <Card className="border-sky-900/30 shadow-lg bg-gradient-to-b from-sky-950/30 to-transparent w-full">
      <CardContent className="p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <PricingTable
            appearance={{
              variables: {
                colorPrimary: '#38bdf8', 
              },
              elements: {
                pricingTable: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.5rem',
                  width: '100%',
                },
                planCard: {
                  backgroundColor: '#0f172a',
                  border: '2px solid #0284c7',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)',
                },
              },
            }}
          />
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default Pricing;