import { Card, CardContent } from '@/components/ui';
import { Coins, Users, Calendar, TrendingUp } from 'lucide-react';
export function DashboardGlobalStats() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 text-3xl font-bold">Dashboard</div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="mr-4 flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="w-full">
              <p className="text-sm font-medium text-gray-600">
                Total Campaigns
              </p>
              <div className="mt-1 h-8 animate-pulse rounded bg-gray-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="mr-4 flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-green-100">
              <Coins className="h-6 w-6 text-green-600" />
            </div>
            <div className="w-full">
              <p className="text-sm font-medium text-gray-600">Total Raised</p>
              <div className="mt-1 h-8 animate-pulse rounded bg-gray-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="mr-4 flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-purple-100">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="w-full">
              <p className="text-sm font-medium text-gray-600">
                Active Campaigns
              </p>
              <div className="mt-1 h-8 animate-pulse rounded bg-gray-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="mr-4 flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-yellow-100">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="w-full">
              <p className="text-sm font-medium text-gray-600">
                Average Progress
              </p>
              <div className="mt-1 h-8 animate-pulse rounded bg-gray-200" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="border-2 border-dashed border-gray-200 bg-white/50 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-gray-900">
            Login to your account
          </h3>
          <p className="mb-6 max-w-md text-gray-500">
            Please connect your wallet to view your campaign dashboard and
            manage your fundraising activities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
