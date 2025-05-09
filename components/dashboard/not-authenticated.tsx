import { Card, CardContent } from '@/components/ui';
import { Users } from 'lucide-react';
export function DashboardNotAuthenticated() {
  return (
    <Card className="border-2 border-dashed border-gray-200 bg-white/50 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Users className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-gray-900">
          Login to your account
        </h3>
        <p className="mb-6 max-w-md text-gray-500">
          Please connect your wallet to view your campaign dashboard and manage
          your fundraising activities.
        </p>
      </CardContent>
    </Card>
  );
}
