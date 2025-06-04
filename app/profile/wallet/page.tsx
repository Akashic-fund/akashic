'use client';

import { useMemo } from 'react';
import { useAuth } from '@/contexts';
import { useUserProfile } from '@/lib/hooks/useProfile';
import { WalletAddressesForm } from '@/components/profile/wallet-addresses-form';
import { PageHome } from '@/components/page/home';
import { PageHeader } from '@/components/page/header';
import { PageDefaultContent } from '@/components/page/default-content';
import { PageLoading } from '@/components/page/loading';
import { PageConnectWallet } from '@/components/page/connect-wallet';
import { ProfileNotComplete } from '@/components/profile/not-complete';

export default function WalletSettingsPage() {
  const { authenticated, isReady } = useAuth();
  const { data: profile, isPending: isProfilePending } = useUserProfile();
  const customerId = useMemo(
    () => profile?.crowdsplitCustomerId ?? null,
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
      <PageLoading>
        Please wait while we fetch your wallet information.
      </PageLoading>
    );
  }

  return (
    <PageHome
      header={
        <PageHeader message="Manage your wallet addresses for receiving payments."></PageHeader>
      }
    >
      <PageDefaultContent title="Wallet Settings">
        {customerId ? (
          <WalletAddressesForm />
        ) : (
          <ProfileNotComplete>
            You need to complete your personal information and create a customer
            account before managing wallet addresses.
          </ProfileNotComplete>
        )}
      </PageDefaultContent>
    </PageHome>
  );
}
