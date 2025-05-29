'use client';

import { PersonalInfoForm } from '@/components/profile/personal-info-form';
import { useAuth } from '@/contexts';
import { PageLoading } from '@/components/page/loading';
import { PageConnectWallet } from '@/components/page/connect-wallet';
import { PageHome } from '@/components/page/home';
import { PageHeader } from '@/components/page/header';
import { PageDefaultContent } from '@/components/page/default-content';
import { useCrowdsplitCustomer } from '@/lib/crowdsplit/hooks/useCrowdsplit';
export default function PersonalInfoPage() {
  const { isReady, address, authenticated } = useAuth();
  const { data: customer, isPending } = useCrowdsplitCustomer({
    userAddress: address ?? '',
  });

  if (!isReady || isPending) {
    return (
      <PageLoading>
        Please wait while we fetch your profile information.
      </PageLoading>
    );
  }

  if (!authenticated) {
    return (
      <PageConnectWallet>
        Please connect your wallet to access your profile
      </PageConnectWallet>
    );
  }

  return (
    <PageHome
      header={
        <PageHeader message="Complete your personal information to enable payments and KYC verification."></PageHeader>
      }
    >
      <PageDefaultContent title="Personal Information">
        <PersonalInfoForm
          hasCustomer={customer?.hasCustomer ?? false}
          customerId={customer?.customerId ?? null}
        />
      </PageDefaultContent>
    </PageHome>
  );
}
