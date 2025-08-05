"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ChevronRight, Clock } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";

const SlotPicker = ({ days, onSelectSlot }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const firstDayWithSlots = days.find((day) => day.slots.length > 0)?.date || days[0]?.date;
  const [activeTab, setActiveTab] = useState(firstDayWithSlots);

  const handleSelectedSlot = (slot) => {
    setSelectedSlot(slot);
  };

  const confirmSelection = () => {
    if (selectedSlot) {
      onSelectSlot(selectedSlot);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          {days.map((day) => (
            <TabsTrigger
              key={day.date}
              value={day.date}
              disabled={day.slots.length === 0}
              className={day.slots.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
            >
              <div className="flex gap-2">
                <div className="opacity-80">
                  {format(new Date(day.date), "MMM d")}
                </div>
                <div>({format(new Date(day.date), "EEE")})</div>
              </div>
              {day.slots.length > 0 && (
                <div className="ml-2 bg-sky-900/30 text-sky-400 text-xs px-2 py-1 rounded">
                  {day.slots.length}
                </div>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {days.map((day) => (
          <TabsContent value={day.date} key={day.date} className="pt-4">
            {day.slots.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No slots available for this day
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="space-y-3"
              >
                <h3 className="text-lg font-medium text-white mb-2">
                  {day.displayDate}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {day.slots.map((slot) => (
                    <motion.div
                      key={slot.startTime}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <Card
                        className={`border-sky-900/20 cursor-pointer transition-all ${
                          selectedSlot?.startTime === slot.startTime
                            ? "border-sky-600 bg-sky-900/30"
                            : "hover:border-sky-700/40"
                        }`}
                        onClick={() => handleSelectedSlot(slot)}
                      >
                        <CardContent className="p-3 flex items-center">
                          <Clock
                            className={`h-4 w-4 mr-2 ${
                              selectedSlot?.startTime === slot.startTime
                                ? "text-sky-400"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span
                            className={
                              selectedSlot?.startTime === slot.startTime
                                ? "text-white"
                                : "text-muted-foreground"
                            }
                          >
                            {format(new Date(slot.startTime), "h:mm a")}
                          </span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end">
        <Button
          onClick={confirmSelection}
          disabled={!selectedSlot}
          className="bg-sky-600 hover:bg-sky-700"
        >
          Continue <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SlotPicker;