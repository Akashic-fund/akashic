'use client';

import { useMemo } from 'react';
import { useAuth } from '@/contexts';
import { KycVerificationForm } from '@/components/profile/kyc-verification-form';
import { useUserProfile } from '@/lib/hooks/useProfile';
import { PageHome } from '@/components/page/home';
import { PageHeader } from '@/components/page/header';
import { PageDefaultContent } from '@/components/page/default-content';
import { PageLoading } from '@/components/page/loading';
import { PageConnectWallet } from '@/components/page/connect-wallet';
import { ProfileNotComplete } from '@/components/profile/not-complete';

export default function KycVerificationPage() {
  const { authenticated, isReady } = useAuth();
  const { data: profile, isPending: isProfilePending } = useUserProfile();
  const customerId = useMemo(
    () => profile?.crowdsplitCustomerId ?? null,
    [profile],
  );
  const isKycCompletedDB = useMemo(
    () => profile?.isKycCompleted ?? false,
    [profile],
  );
  if (!authenticated) {
    return (
      <PageConnectWallet>
        Please connect your wallet to access KYC verification
      </PageConnectWallet>
    );
  }

  if (!isReady || isProfilePending) {
    return (
      <PageLoading>Please wait while we fetch your KYC status.</PageLoading>
    );
  }

  return (
    <PageHome
      header={
        <PageHeader message="Complete the KYC verification process to unlock additional features."></PageHeader>
      }
    >
      <PageDefaultContent title="KYC Verification">
        {customerId ? (
          <KycVerificationForm isCompleted={isKycCompletedDB} />
        ) : (
          <ProfileNotComplete>
            You need to complete your personal information and create a customer
            account before starting KYC verification.
          </ProfileNotComplete>
        )}
      </PageDefaultContent>
    </PageHome>
  );
}
