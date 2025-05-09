'use client';

import { cn } from '@/lib/utils';
import { PageSidebar } from '@/components/page/sidebar';
import { useSidebar } from '@/contexts';

export function PageMainLayout({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  if (typeof isOpen === 'undefined') {
    return null; // or a loading state
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <PageSidebar />
      <div
        className={cn(
          'flex-1 transition-all duration-300 ease-in-out',
          isOpen ? 'ml-[240px]' : 'ml-[72px]',
        )}
      >
        {children}
      </div>
    </div>
  );
}
