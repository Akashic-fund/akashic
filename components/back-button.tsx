'use client';
import { useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const back = useCallback(() => {
    if (typeof pathname === 'string' && pathname.startsWith('/profile')) {
      router.push(pathname.replace(/\/[^\/]*$/, ''));
      return;
    }
    if (window.history?.length && window.history.length > 1) {
      router.back();
      return;
    }
    if (typeof pathname !== 'string' || pathname.length === 0) {
      router.push('/');
      return;
    }
    const parent = pathname.replace(/\/[^\/]*$/, '');
    if (parent) {
      router.push(parent);
    }
  }, [pathname, router]);
  return (
    <button
      onClick={back}
      className={cn(
        'flex h-8 w-8 items-center justify-center',
        'rounded-full',
        'bg-gray-100 text-gray-600 hover:bg-gray-200',
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Back</span>
    </button>
  );
}
