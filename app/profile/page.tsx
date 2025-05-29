'use client';

import { useAuth } from '@/contexts';
import { UserProfileForm } from '@/components/profile/user-profile-form';
import { useUserProfile } from '@/lib/hooks/useProfile';
import { ProfileCard } from '@/components/profile/card';
import { ProfileAdditionalSettings } from '@/components/profile/additional-settings';
import { PageConnectWallet } from '@/components/page/connect-wallet';
import { PageLoading } from '@/components/page/loading';
import { useCallback, useState } from 'react';
import { PageHeader } from '@/components/page/header';
import { PageHome } from '@/components/page/home';
import { PageDefaultContent } from '@/components/page/default-content';
export default function ProfilePage() {
  const [editProfile, setEditProfile] = useState(false);
  const { address, authenticated, isReady } = useAuth();
  const { data: profile, isPending: isProfilePending } =
    useUserProfile(address);
  const onEditProfile = useCallback(() => {
    setEditProfile((prevState) => !prevState);
  }, [setEditProfile]);
  const onEditSuccess = useCallback(() => {
    setEditProfile(false);
  }, [setEditProfile]);
  if (!isReady || (address && isProfilePending)) {
    return (
      <PageLoading>Please wait while we initialize your profile.</PageLoading>
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
        <PageHeader message="Manage your account settings, KYC verification, and payment methods."></PageHeader>
      }
    >
      <PageDefaultContent title="Profile">
        {/* User Profile Card */}
        <ProfileCard profile={profile} onEdit={onEditProfile} />

        {/* User Profile Form */}
        {(editProfile || !profile) && (
          <UserProfileForm profile={profile} onSuccess={onEditSuccess} />
        )}

        {/* Additional Settings Card */}
        {profile && <ProfileAdditionalSettings />}
      </PageDefaultContent>
    </PageHome>
  );
}
