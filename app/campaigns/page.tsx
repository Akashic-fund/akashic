import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CampaignsPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Campaigns</h1>
      <Link href="/campaigns/1">
        <Button>View Demo Campaign</Button>
      </Link>
    </div>
  );
}
