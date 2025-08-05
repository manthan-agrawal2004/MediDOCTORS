"use client";

import AppointmentCard from '@/components/appointment-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'

const AppointmentList = ({ appointments }) => {
  return (
    <Card className="border-sky-900/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-sky-400" />
          Upcoming Appointments
        </CardTitle>
      </CardHeader>

      <CardContent>
        {appointments.length > 0 ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            {appointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <AppointmentCard appointment={appointment} userRole="DOCTOR" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-xl font-medium text-white mb-2">
              No upcoming appointments
            </h3>
            <p className="text-muted-foreground">
              You don&apos;t have any scheduled appointments yet. Make sure you&apos;ve set your availability to allow booking.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AppointmentList