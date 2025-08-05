import React from 'react'
import { TabsContent } from "@/components/ui/tabs"
import { getPendingDoctors, getPendingPayouts, getVerifiedDoctors } from '@/actions/admin'
import VerifiedDoctors from './_components/verified_doctors';
import PendingDoctors from './_components/pending_doctors';
import { PendingPayouts } from './_components/pending-payout';


const AdminPage = async () => {

  const [pendingDoctorsData, verifiedDoctorsData,pendingPayoutsData] = await Promise.all([
    getPendingDoctors(),
    getVerifiedDoctors(),
    getPendingPayouts()
  ]);

  return (
    <>
      <TabsContent value="pending" className="border-none p-0">
        <PendingDoctors doctors={pendingDoctorsData.doctors || []} />
      </TabsContent>
      <TabsContent value="doctors" className="border-none p-0">
        <VerifiedDoctors doctors={verifiedDoctorsData.doctors || []} />
      </TabsContent>
      <TabsContent value="payouts" className="border-none p-0">
        <PendingPayouts payouts={pendingPayoutsData.payouts || []} />
      </TabsContent>

    </>
  )
}

export default AdminPage;