import Link from 'next/link';
import { Button } from '@/components/ui';
export function CampaignEmpty({
  message = 'You haven&apos;t created any campaigns yet.',
}: {
  message?: string;
}) {
  return (
    <div className="py-12 text-center">
      <p className="text-gray-500">{message}</p>

      <Button className="mt-4" asChild>
        <Link href="/">Create Your First Campaign</Link>
      </Button>
    </div>
  );
}
