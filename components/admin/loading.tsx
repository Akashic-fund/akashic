import { Skeleton } from '@/components/ui';
export function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="sticky top-0 z-10 border-b bg-white">
        <header className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-5 w-32" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-4 w-32" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </header>
      </div>
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Skeleton className="h-[600px] rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[400px] rounded-lg" />
          </div>
        </div>
      </main>
    </div>
  );
}
