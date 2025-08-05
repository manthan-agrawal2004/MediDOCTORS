"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Button
} from "@/components/ui/button";
import {
  Input
} from "@/components/ui/input";
import {
  Label
} from "@/components/ui/label";
import {
  TrendingUp,
  Calendar,
  BarChart3,
  CreditCard,
  Loader2,
  AlertCircle,
  Coins,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription
} from "@/components/ui/alert";
import {
  Badge
} from "@/components/ui/badge";
import {
  format
} from "date-fns";
import {
  requestPayout
} from "@/actions/payout";
import useFetch from "@/hooks/use-fetch";
import {
  toast
} from "sonner";
import {
  motion,
  AnimatePresence
} from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerList = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

export function DoctorEarnings({ earnings, payouts = [] }) {
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");

  const {
    thisMonthEarnings = 0,
    completedAppointments = 0,
    averageEarningsPerMonth = 0,
    availableCredits = 0,
    availablePayout = 0,
  } = earnings;

  const {
    loading,
    data,
    fn: submitPayoutRequest
  } = useFetch(requestPayout);

  const pendingPayout = payouts.find(p => p.status === "PROCESSING");

  const handlePayoutRequest = async (e) => {
    e.preventDefault();
    if (!paypalEmail) {
      toast.error("PayPal email is required");
      return;
    }
    const formData = new FormData();
    formData.append("paypalEmail", paypalEmail);
    await submitPayoutRequest(formData);
  };

  useEffect(() => {
    if (data?.success) {
      setShowPayoutDialog(false);
      setPaypalEmail("");
      toast.success("Payout request submitted successfully!");
    }
  }, [data]);

  const platformFee = availableCredits * 2;

  return (
    <div className="space-y-6">
      <motion.div
        variants={staggerList}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {[
          {
            label: "Available Credits",
            value: availableCredits,
            subtitle: `$${availablePayout.toFixed(2)} available for payout`,
            icon: <Coins className="h-6 w-6 text-sky-400" />,
          },
          {
            label: "This Month",
            value: `$${thisMonthEarnings.toFixed(2)}`,
            icon: <TrendingUp className="h-6 w-6 text-sky-400" />,
          },
          {
            label: "Total Appointments",
            value: completedAppointments,
            subtitle: "completed",
            icon: <Calendar className="h-6 w-6 text-sky-400" />,
          },
          {
            label: "Avg/Month",
            value: `$${averageEarningsPerMonth.toFixed(2)}`,
            icon: <BarChart3 className="h-6 w-6 text-sky-400" />,
          },
        ].map(({ label, value, subtitle, icon }, idx) => (
          <motion.div variants={fadeUp} key={idx}>
            <Card className="border-sky-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                    {subtitle && (
                      <p className="text-xs text-muted-foreground">{subtitle}</p>
                    )}
                  </div>
                  <div className="bg-sky-900/20 p-3 rounded-full">{icon}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Card className="border-sky-900/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-sky-400" />
            Payout Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/20 p-4 rounded-lg border border-sky-900/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-white">Available for Payout</h3>
              <Badge
                variant="outline"
                className={
                  pendingPayout
                    ? "bg-amber-900/20 border-amber-900/30 text-amber-400"
                    : "bg-sky-900/20 border-sky-900/30 text-sky-400"
                }
              >
                {pendingPayout ? "PROCESSING" : "Available"}
              </Badge>
            </div>

            {pendingPayout ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Pending Credits</p>
                    <p className="text-white font-medium">{pendingPayout.credits}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pending Amount</p>
                    <p className="text-white font-medium">
                      ${pendingPayout.netAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">PayPal Email</p>
                    <p className="text-white font-medium text-xs">
                      {pendingPayout.paypalEmail}
                    </p>
                  </div>
                </div>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Your payout request is being processed. You'll receive the payment once an admin approves it. Your credits will be deducted after processing.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Available Credits</p>
                    <p className="text-white font-medium">{availableCredits}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payout Amount</p>
                    <p className="text-white font-medium">
                      ${availablePayout.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Platform Fee</p>
                    <p className="text-white font-medium">
                      ${platformFee.toFixed(2)}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => setShowPayoutDialog(true)}
                  className="w-full mt-4 bg-sky-600 hover:bg-sky-700"
                >
                  Request Payout for All Credits
                </Button>
              </>
            )}

            {!pendingPayout && availableCredits === 0 && (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  No credits available for payout. Complete more appointments to earn credits.
                </p>
              </div>
            )}
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Payout Structure:</strong> You earn $8 per credit. Platform fee is $2 per credit. Payouts are processed via PayPal.
            </AlertDescription>
          </Alert>

          {payouts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white">Payout History</h3>
              <div className="space-y-2">
                {payouts.slice(0, 5).map((payout) => (
                  <motion.div
                    key={payout.id}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="flex items-center justify-between p-3 rounded-md bg-muted/10 border border-sky-900/10"
                  >
                    <div>
                      <p className="text-white font-medium">
                        {format(new Date(payout.createdAt), "MMM d, yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payout.credits} credits • ${payout.netAmount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payout.paypalEmail}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        payout.status === "PROCESSED"
                          ? "bg-sky-900/20 border-sky-900/30 text-sky-400"
                          : "bg-amber-900/20 border-amber-900/30 text-amber-400"
                      }
                    >
                      {payout.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {showPayoutDialog && (
          <motion.div
            key="dialog"
            variants={scaleIn}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-white">
                    Request Payout
                  </DialogTitle>
                  <DialogDescription>
                    Request payout for all your available credits
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handlePayoutRequest} className="space-y-4">
                  <div className="bg-muted/20 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available credits:</span>
                      <span className="text-white">{availableCredits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross amount:</span>
                      <span className="text-white">${(availableCredits * 10).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform fee (20%):</span>
                      <span className="text-white">-${platformFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-sky-900/20 pt-2 flex justify-between font-medium">
                      <span className="text-white">Net payout:</span>
                      <span className="text-sky-400">${availablePayout.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paypalEmail">PayPal Email</Label>
                    <Input
                      id="paypalEmail"
                      type="email"
                      placeholder="your-email@paypal.com"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      className="bg-background border-sky-900/20"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter the PayPal email where you want to receive the payout.
                    </p>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Once processed by admin, {availableCredits} credits will be
                      deducted from your account and ${availablePayout.toFixed(2)} will be sent to your PayPal.
                    </AlertDescription>
                  </Alert>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPayoutDialog(false)}
                      disabled={loading}
                      className="border-sky-900/30"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-sky-600 hover:bg-sky-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Requesting...
                        </>
                      ) : (
                        "Request Payout"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}