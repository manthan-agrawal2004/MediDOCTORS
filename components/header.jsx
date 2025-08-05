import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'
import { checkUser } from '@/lib/checkUser'
import { Calendar, CreditCard, ShieldCheck, Stethoscope, User } from 'lucide-react'
import { checkAndAllocateCredits } from '@/actions/credit'
import { Badge } from './ui/badge'

const Header = async () => {
  const user = await checkUser();
  if (user?.role === "PATIENT") {
    await checkAndAllocateCredits(user);
  }

  return (
    <header className='fixed top-0 w-full border-b border-sky-700/20 bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60'>
      <nav className='container mx-auto px-2 h-20 flex items-center justify-between'>

        {/* Logo */}
        <Link href='/'>
          <Image
            src='/logo.png'
            alt='MediDOCTORS logo'
            width={160}
            height={100}
            className='h-[200px] w-auto object-contain'
          />
        </Link>

        {/* Auth Buttons */}
        <div className='flex items-center space-x-2'>
          <SignedIn>
            {user?.role === "UNASSIGNED" && (
              <Link href="/onboarding">
                <Button variant="outline" className="hidden md:inline-flex items-center gap-2 border-sky-400 text-sky-400 hover:bg-sky-900/10">
                  <User className="h-4 w-4" />Complete Profile
                </Button>
                <Button className='md:hidden w-10 h-10 p-0' variant="ghost">
                  <User className='h-4 w-4 text-sky-400' />
                </Button>
              </Link>
            )}

            {user?.role === "PATIENT" && (
              <Link href="/appointments">
                <Button variant="outline" className="hidden md:inline-flex items-center gap-2 border-sky-400 text-sky-400 hover:bg-sky-900/10">
                  <Calendar className="h-4 w-4" />My Appointments
                </Button>
                <Button className='md:hidden w-10 h-10 p-0' variant="ghost">
                  <Calendar className='h-4 w-4 text-sky-400' />
                </Button>
              </Link>
            )}

            {user?.role === "DOCTOR" && (
              <Link href="/doctor/verification">
                <Button variant="outline" className="hidden md:inline-flex items-center gap-2 border-sky-400 text-sky-400 hover:bg-sky-900/10">
                  <Stethoscope className="h-4 w-4" />Doctor Dashboard
                </Button>
                <Button className='md:hidden w-10 h-10 p-0' variant="ghost">
                  <Stethoscope className='h-4 w-4 text-sky-400' />
                </Button>
              </Link>
            )}

            {user?.role === "ADMIN" && (
              <Link href="/admin">
                <Button variant="outline" className="hidden md:inline-flex items-center gap-2 border-sky-400 text-sky-400 hover:bg-sky-900/10">
                  <ShieldCheck className="h-4 w-4" />Admin Dashboard
                </Button>
                <Button className='md:hidden w-10 h-10 p-0' variant="ghost">
                  <ShieldCheck className='h-4 w-4 text-sky-400' />
                </Button>
              </Link>
            )}
          </SignedIn>

          {(!user || user?.role === "PATIENT") && (
            <Link href="/pricing">
              <Badge
                variant="outline"
                className="h-9 bg-sky-900/10 border-sky-700/30 px-3 py-1 flex items-center gap-2"
              >
                <CreditCard className='h-3.5 w-3.5 text-sky-400' />
                <span className='text-sky-400'>
                  {user && user?.role === "PATIENT" ? (
                    <>
                      {user.credits} <span className='hidden md:inline'>Credits</span>
                    </>
                  ) : (
                    <>Pricing</>
                  )}
                </span>
              </Badge>
            </Link>
          )}

          <SignedOut>
            <SignInButton>
              <Button variant="secondary" className='bg-sky-600 hover:bg-sky-700 text-white'>Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  )
}

export default Header