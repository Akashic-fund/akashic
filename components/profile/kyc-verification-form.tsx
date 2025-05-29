'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import {
  useCrowdsplitKYCInitiate,
  useCrowdsplitKYCStatus,
} from '@/lib/crowdsplit/hooks/useCrowdsplit';
import { ProfileKYCVerificationStateComplete } from './kyc-verification-state-complete';
import { ProfileKYCVerificationStatePending } from './kyc-verification-state-pending';
import { ProfileKYCVerificationStateFailed } from './kyc-verification-state-failed';
import { ProfileKYCVerificationStateDefault } from './kyc-verification-state-default';
import { useAuth } from '@/contexts';
import { useUserProfile } from '@/lib/hooks/useProfile';

interface KycVerificationFormProps {
  isCompleted: boolean;
  onSuccess?: () => void;
}

export function KycVerificationForm({
  isCompleted,
  onSuccess,
}: KycVerificationFormProps) {
  const [kycUrl, setKycUrl] = useState<string | undefined>(undefined);
  const { address } = useAuth();
  const { isPending: isPendingProfile } = useUserProfile(address);
  const { data: kycStatus, isPending: isKycStatusPending } =
    useCrowdsplitKYCStatus({ userAddress: address ?? '' });
  const { mutateAsync: kycInitiate, isPending: isKycInitiatePending } =
    useCrowdsplitKYCInitiate({ userAddress: address ?? '' });

  const onInitiateKYC = useCallback(async () => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Wallet address is required to initiate KYC',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('Initiating KYC for customer:');
      const { redirectUrl } = await kycInitiate();

      if (redirectUrl) {
        setKycUrl(redirectUrl);
        // Open the KYC verification URL in a new tab
        window.open(redirectUrl, '_blank');
      } else {
        // Handle case where redirectUrl is missing but response was ok
        console.error('KYC initiation response missing redirectUrl:');
        throw new Error(
          'KYC initiation succeeded but no redirect URL was provided.',
        );
      }
    } catch (error) {
      console.error('Error initiating KYC:', error);
      toast({
        title: 'Error Initiating KYC',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred during KYC initiation.',
        variant: 'destructive',
      });
      // Optionally reset state if needed, e.g., setKycStatus('not_started')
    }
  }, [address, kycInitiate]);
  useEffect(() => {
    if (isCompleted) {
      return;
    }
    if (kycStatus?.status === 'completed' && typeof onSuccess === 'function') {
      onSuccess();
    }
  }, [isCompleted, kycStatus?.status, onSuccess]);

  const state = useMemo(() => {
    if (isPendingProfile) {
      return <ProfileKYCVerificationStateDefault isPending={true} />;
    }
    if (isCompleted) {
      return <ProfileKYCVerificationStateComplete />;
    }
    switch (kycStatus?.status) {
      case 'completed':
        return <ProfileKYCVerificationStateComplete />;
      case 'pending':
        return <ProfileKYCVerificationStatePending kycUrl={kycUrl} />;
      case 'failed':
        return (
          <ProfileKYCVerificationStateFailed
            onInitiateKYC={onInitiateKYC}
            isPending={isKycStatusPending}
          />
        );
      default:
        return (
          <ProfileKYCVerificationStateDefault
            isPending={isKycStatusPending || isKycInitiatePending}
            onInitiateKYC={onInitiateKYC}
          />
        );
    }
  }, [
    onInitiateKYC,
    isKycStatusPending,
    isKycInitiatePending,
    kycUrl,
    kycStatus,
    isCompleted,
    isPendingProfile,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Verify your identity to enable bank transfers and other payment
          methods.
        </CardDescription>
      </CardHeader>
      <CardContent>{state}</CardContent>
    </Card>
  );
}
