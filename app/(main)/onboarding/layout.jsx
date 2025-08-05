import { getCurrentUser } from '@/actions/onboarding';
import { redirect } from 'next/navigation'; // ✅ Corrected import
import React from 'react';

export const metadata = {
  title: "Onboarding - MediDOCTORS",
  description: "Complete your profile to get started with MediDOCTORS"
};

const OnboardingLayout = async ({ children }) => {
  const user = await getCurrentUser();

  if (user) {
    if (user.role === "PATIENT") {
      redirect("/doctors");
    } else if (user.role === "DOCTOR") {
      if (user.verificationStatus === "VERIFIED") {
        redirect("/doctor");
      } else {
        redirect("/doctor/verification");
      }
    } else if (user.role === "ADMIN") {
      redirect("/admin");
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-3 gradient-title">
          Welcome to MediDOCTORS – your trusted partner in healthcare!
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
          Let us know how you intend to use our platform.
        </p>
      </div>

      <div>
        {children}
      </div>
    </div>
  );
};

export default OnboardingLayout;