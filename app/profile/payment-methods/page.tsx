'use client';

import { useMemo } from 'react';
import { PaymentMethodsForm } from '@/components/profile/payment-methods-form';
import { PageHome } from '@/components/page/home';
import { PageHeader } from '@/components/page/header';
import { PageDefaultContent } from '@/components/page/default-content';
import { PageLoading } from '@/components/page/loading';
import { PageConnectWallet } from '@/components/page/connect-wallet';
import { ProfileNotComplete } from '@/components/profile/not-complete';

import { useAuth } from '@/contexts';
import { useUserProfile } from '@/lib/hooks/useProfile';
import { useCrowdsplitPaymentMethods } from '@/lib/crowdsplit/hooks/useCrowdsplit';

export default function PaymentMethodsPage() {
  const { isReady, address, authenticated } = useAuth();
  const { data: profile, isPending: isProfilePending } =
    useUserProfile(address);
  const customerId = useMemo(
    () => profile?.crowdsplitCustomerId ?? null,
    [profile],
  );
  const { data: paymentMethods, isPending: isPaymentMethodsPending } =
    useCrowdsplitPaymentMethods({ userAddress: address ?? '' });

  if (!isReady || isProfilePending || isPaymentMethodsPending) {
    return (
      <PageLoading>
        Please wait while we fetch your payment methods.
      </PageLoading>
    );
  }

  if (!authenticated) {
    return (
      <PageConnectWallet>
        Please connect your wallet to access your payment methods.
      </PageConnectWallet>
    );
  }

  return (
    <PageHome
      header={
        <PageHeader message="Manage your payment methods for donations and purchases."></PageHeader>
      }
    >
      <PageDefaultContent title="Payment Methods">
        {customerId ? (
          <PaymentMethodsForm paymentMethods={paymentMethods ?? []} />
        ) : (
          <ProfileNotComplete>
            You need to complete your personal information and create a customer
            account before adding payment methods.
          </ProfileNotComplete>
        )}
      </PageDefaultContent>
    </PageHome>
  );
}
