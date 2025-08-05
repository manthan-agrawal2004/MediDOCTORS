"use client"
import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Pricing from '@/components/pricing'

const PricingPage = () => {
  return (
    <div className='container mx-auto px-4 py-12'>
      {/* Back Button */}
      <div className='flex justify-start mb-2'>
        <Link href='/' className='flex items-center text-muted-foreground hover:text-white transition-colors'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className='max-w-full mx-auto mb-12 text-center'>
        <Badge
          variant="outline"
          className="bg-sky-900/30 border-sky-700/30 px-4 py-2 text-sky-200 text-sm font-medium mb-4"
        >
          Affordable Healthcare
        </Badge>

        <h1 className='text-4xl md:text-5xl font-bold gradient-title mb-4'>
          Simple, Transparent Pricing
        </h1>

        <p className='text-lg text-slate-400 max-w-2xl mx-auto'>
          Select the ideal consultation package tailored to your healthcare needs — transparent pricing, no hidden fees, and zero long-term commitments.
        </p>
      </div>

      {/* Pricing Component */}
      <Pricing />
    </div>
  )
}

export default PricingPage