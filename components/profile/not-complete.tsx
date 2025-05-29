import Link from 'next/link';
import { Card, Button } from '@/components/ui';
import { type ReactNode } from 'react';
export function ProfileNotComplete({ children }: { children: ReactNode }) {
  return (
    <Card className="p-6">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold">
          Complete Your Profile First
        </h2>
        <p className="mb-4 text-muted-foreground">{children}</p>
        <Link href="/profile/personal-info">
          <Button>Complete Your Profile</Button>
        </Link>
      </div>
    </Card>
  );
}
