import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | Akashic',
  description:
    'Manage your Akashic profile, payment methods, and KYC information',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
