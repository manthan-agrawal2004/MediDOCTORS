"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import { Calendar, Star, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const DoctorCard = ({ doctor }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 150, damping: 12 }}
    >
      <Card className="border-sky-900/20 hover:border-sky-700/40 transition-all shadow-md">
        <CardContent className="pt-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-sky-900/20 flex items-center justify-center flex-shrink-0">
              {doctor.imageUrl ? (
                <img
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-sky-400" />
              )}
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <h3 className="font-medium text-white text-lg">{doctor.name}</h3>
                <Badge
                  variant="outline"
                  className="bg-sky-900/20 border-sky-700/30 text-sky-400 self-start"
                >
                  <Star className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {doctor.specialty} • {doctor.experience} years experience
              </p>
              <div className="mt-4 line-clamp-2 text-sm text-muted-foreground mb-4">
                {doctor.description}
              </div>

              <Button
                asChild
                className="w-full bg-sky-600 hover:bg-sky-700 text-white transition-colors"
              >
                <Link href={`/doctors/${doctor.specialty}/${doctor.id}`}>
                  <Calendar className="h-4 w-4 mr-2" />
                  View Profile & Book
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DoctorCard;