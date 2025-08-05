"use client";

import { useState, useEffect } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check, User, DollarSign, Mail, Stethoscope, Loader2, AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { approvePayout } from "@/actions/admin";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import { motion } from "framer-motion";

export function PendingPayouts({ payouts }) {
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const { loading, data, fn: submitApproval } = useFetch(approvePayout);

  const handleViewDetails = (payout) => setSelectedPayout(payout);
  const handleApprovePayout = (payout) => {
    setSelectedPayout(payout);
    setShowApproveDialog(true);
  };

  const confirmApproval = async () => {
    if (!selectedPayout || loading) return;
    const formData = new FormData();
    formData.append("payoutId", selectedPayout.id);
    await submitApproval(formData);
  };

  useEffect(() => {
    if (data?.success) {
      setShowApproveDialog(false);
      setSelectedPayout(null);
      toast.success("Payout approved successfully!");
    }
  }, [data]);

  const closeDialogs = () => {
    setSelectedPayout(null);
    setShowApproveDialog(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-muted/20 border-sky-900/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Pending Payouts</CardTitle>
          <CardDescription>Review and approve doctor payout requests</CardDescription>
        </CardHeader>

        <CardContent>
          {payouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending payout requests at this time.
            </div>
          ) : (
            <div className="space-y-4">
              {payouts.map((payout) => (
                <motion.div
                  key={payout.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-background border-sky-900/20 hover:border-sky-700/30 transition-all">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-muted/20 rounded-full p-2 mt-1">
                            <User className="h-5 w-5 text-sky-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-white">Dr. {payout.doctor.name}</h3>
                            <p className="text-sm text-muted-foreground">{payout.doctor.specialty}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1 text-sky-400" />
                                <span>
                                  {payout.credits} credits • ${payout.netAmount.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-1 text-sky-400" />
                                <span className="text-xs">{payout.paypalEmail}</span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Requested {format(new Date(payout.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 self-end lg:self-center">
                          <Badge
                            variant="outline"
                            className="bg-amber-900/20 border-amber-900/30 text-amber-400 w-fit"
                          >
                            Pending
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(payout)}
                              className="border-sky-900/30 hover:bg-muted/80 text-white"
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprovePayout(payout)}
                              className="bg-sky-600 hover:bg-sky-700 text-white"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {selectedPayout && !showApproveDialog && (
        <Dialog open={!!selectedPayout} onOpenChange={closeDialogs}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Payout Request Details
              </DialogTitle>
              <DialogDescription>Review the payout request information</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-sky-400" />
                  <h3 className="text-white font-medium">Doctor Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info title="Name" value={`Dr. ${selectedPayout.doctor.name}`} />
                  <Info title="Email" value={selectedPayout.doctor.email} />
                  <Info title="Specialty" value={selectedPayout.doctor.specialty} />
                  <Info title="Current Credits" value={selectedPayout.doctor.credits} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-sky-400" />
                  <h3 className="text-white font-medium">Payout Details</h3>
                </div>
                <div className="bg-muted/20 p-4 rounded-lg border border-sky-900/20 space-y-3">
                  <KeyValue label="Credits to pay out:" value={selectedPayout.credits} />
                  <KeyValue label="Gross amount (10 USD/credit):" value={`$${selectedPayout.amount.toFixed(2)}`} />
                  <KeyValue label="Platform fee (2 USD/credit):" value={`-$${selectedPayout.platformFee.toFixed(2)}`} />
                  <div className="border-t border-sky-900/20 pt-3 flex justify-between font-medium">
                    <span className="text-white">Net payout:</span>
                    <span className="text-sky-400">${selectedPayout.netAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-sky-900/20 pt-3">
                    <p className="text-sm font-medium text-muted-foreground">PayPal Email</p>
                    <p className="text-white">{selectedPayout.paypalEmail}</p>
                  </div>
                </div>
              </div>

              {selectedPayout.doctor.credits < selectedPayout.credits && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Warning: Doctor has only {selectedPayout.doctor.credits} credits but this payout
                    requires {selectedPayout.credits} credits. This payout cannot be processed.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={closeDialogs}
                className="border-sky-900/30 text-white"
              >
                Close
              </Button>
              <Button
                onClick={() => handleApprovePayout(selectedPayout)}
                disabled={selectedPayout.doctor.credits < selectedPayout.credits}
                className="bg-sky-600 hover:bg-sky-700 text-white"
              >
                <Check className="h-4 w-4 mr-1" />
                Approve Payout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showApproveDialog && selectedPayout && (
        <Dialog open={showApproveDialog} onOpenChange={() => setShowApproveDialog(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Confirm Payout Approval</DialogTitle>
              <DialogDescription>Are you sure you want to approve this payout?</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This action will:
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    <li>Deduct {selectedPayout.credits} credits from Dr. {selectedPayout.doctor.name}</li>
                    <li>Mark the payout as PROCESSED</li>
                    <li>This action cannot be undone</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="bg-muted/20 p-4 rounded-lg border border-sky-900/20">
                <KeyValue label="Doctor:" value={`Dr. ${selectedPayout.doctor.name}`} />
                <KeyValue label="Amount to pay:" value={`$${selectedPayout.netAmount.toFixed(2)}`} valueClass="text-sky-400 font-medium" />
                <KeyValue label="PayPal:" value={selectedPayout.paypalEmail} />
              </div>
            </div>

            {loading && <BarLoader width={"100%"} color="#38bdf8" />}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowApproveDialog(false)}
                disabled={loading}
                className="border-sky-900/30 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmApproval}
                disabled={loading}
                className="bg-sky-600 hover:bg-sky-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Confirm Approval
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      

    </motion.div>
  );
}

const Info = ({ title, value }) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{title}</p>
    <p className="text-white">{value}</p>
  </div>
);

const KeyValue = ({ label, value, valueClass = "text-white" }) => (
  <div className="flex justify-between mb-2">
    <span className="text-muted-foreground">{label}</span>
    <span className={valueClass}>{value}</span>
  </div>
);
