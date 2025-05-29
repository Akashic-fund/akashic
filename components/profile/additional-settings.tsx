import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from '@/components/ui';
import Link from 'next/link';
import { ShieldCheck, Wallet, CreditCard } from 'lucide-react';

export function ProfileAdditionalSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Settings</CardTitle>
        <CardDescription>
          Configure your payment methods, complete KYC verification, and manage
          wallet addresses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link href="/profile/payment-methods">
            <Button variant="outline" className="w-full">
              <CreditCard className="mr-2 h-4 w-4" />
              Payment Methods
            </Button>
          </Link>
          <Link href="/profile/kyc">
            <Button variant="outline" className="w-full">
              <ShieldCheck className="mr-2 h-4 w-4" />
              KYC Verification
            </Button>
          </Link>
          <Link href="/profile/wallet">
            <Button variant="outline" className="w-full">
              <Wallet className="mr-2 h-4 w-4" />
              Wallet Settings
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
