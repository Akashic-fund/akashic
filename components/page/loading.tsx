import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
export function PageLoading({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col bg-gray-50">
      <main
        className={cn(
          'container mx-auto flex h-[calc(100vh-200px)]',
          'max-w-7xl items-center justify-center',
          'px-2 py-8 md:px-4',
        )}
      >
        <div className="flex justify-center">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold">Loading...</h2>
            <p className="text-muted-foreground">{children}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
