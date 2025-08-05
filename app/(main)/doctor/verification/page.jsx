"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/actions/onboarding'
import { updateProfile } from '@/actions/rejected'
import useFetch from '@/hooks/use-fetch.jsx'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { AlertCircle, ClipboardCheck, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

const VerificationPage = () => {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const router = useRouter()

  const isRejected = user?.verificationStatus === 'REJECTED'

  const { fn: handleResubmit, loading: resubmitting } = useFetch(async () => {
    const res = await updateProfile()
    if (res?.success) {
      toast.success('Profile reset successfully. Please update and resubmit.')
    }
  })

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getCurrentUser()
      if (u?.verificationStatus === 'VERIFIED') {
        router.replace('/doctor')
      } else {
        setUser(u)
        setLoadingUser(false)
      }
    }
    fetchUser()
  }, [router])

  if (loadingUser) return null

  return (
    <div className='container mx-auto px-4 py-12'>
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className='max-w-2xl mx-auto'
      >
        <Card className="border-sky-900/20">
          <CardHeader className="text-center">
            <div className={`mx-auto p-4 ${isRejected ? "bg-red-900/20" : "bg-amber-900/20"} rounded-full mb-4 w-fit`}>
              {isRejected ? (
                <XCircle className='h-8 w-8 text-red-400' />
              ) : (
                <ClipboardCheck className='h-8 w-8 text-amber-400' />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              {isRejected ? "Verification Declined" : "Verification in Progress"}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {isRejected
                ? "Unfortunately, your application needs revision"
                : "Thank you for submitting your information"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isRejected ? (
              <div className='bg-red-900/10 border-red-900/20 rounded-lg pb-4 mb-6 flex items-start'>
                <AlertCircle className='h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0' />
                <div className="text-muted-foreground text-left">
                  <p className="mb-2">
                    Thank you for submitting your application. We&apos;ve reviewed the details, and it looks like a few important pieces of information are either missing or unclear.
                    Here are some common points to check:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mb-3">
                    <li>Proof of medical license or registration is not attached</li>
                    <li>Your professional experience summary needs more detail</li>
                    <li>Services or specializations are not clearly outlined</li>
                  </ul>
                  <p>
                    We&apos;d love to move forward once everything is complete. Kindly review and update your application, then resubmit it for consideration.
                  </p>
                </div>
              </div>
            ) : (
              <div className='bg-amber-900/10 border-amber-900/20 rounded-lg pb-4 mb-6 flex items-start'>
                <AlertCircle className='h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0' />
                <p className="text-muted-foreground text-left">
                  Your profile is currently under review by our administrative team. This usually takes 1–2 business days.
                  You&apos;ll receive an email notification once your account is verified.
                </p>
              </div>
            )}

            <p className='text-muted-foreground mb-6'>
              {isRejected
                ? "You can update your doctor profile and resubmit for verification."
                : "While you wait, you can familiarize yourself with our platform and reach out to our support team if you have any questions."}
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              {isRejected ? (
                <Button
                  onClick={handleResubmit}
                  disabled={resubmitting}
                  className="bg-red-700 text-white hover:bg-red-800"
                >
                  {resubmitting ? "Resubmitting..." : "Resubmit for Verification"}
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="bg-sky-600/20 border border-sky-400/30 text-sky-100 hover:bg-sky-800/40 transition-colors"
                >
                  <Link href='/'>Return to Home</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default VerificationPage