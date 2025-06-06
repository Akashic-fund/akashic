'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Progress,
  DialogTrigger,
  Dialog,
  DialogContent,
  Badge,
} from '@/components/ui';
import { Info } from 'lucide-react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { categories } from '@/lib/constant';
import { Campaign } from '@/types/campaign';
import { FormattedDate } from '../formatted-date';
import { DialogTitle } from '../ui/dailog';

export function CampaignItem({
  campaign,
  onSelect,
}: {
  campaign: Campaign;
  onSelect: (campaign: Campaign) => void;
}) {
  const categoryDetails = campaign.category
    ? categories.find((cat) => cat.id === campaign.category)
    : null;
  return (
    <Card
      key={campaign.address}
      className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="flex-1">
        <Link href={`/campaigns/${campaign.slug}`}>
          <CardHeader className="p-0">
            <Image
              src={
                campaign.images?.find(
                  (img: { isMainImage: boolean }) => img.isMainImage,
                )?.imageUrl || '/images/placeholder.svg'
              }
              alt={campaign.title || campaign.address}
              width={600}
              height={400}
              className="h-[200px] w-full object-cover"
              loading="lazy"
            />
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="mb-2 text-xl font-bold">
                {campaign.title || 'Campaign Title'}
              </h2>
              {categoryDetails && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <span className="flex items-center">
                    {categoryDetails.icon}
                  </span>
                  <span className="text-xs">{categoryDetails.name}</span>
                </Badge>
              )}
            </div>
            <div className="mb-2 flex items-center justify-between gap-1">
              <div className="align flex gap-2 self-start">
                <Image
                  src={`https://avatar.vercel.sh/${campaign.address}`}
                  alt="user-pr"
                  width={24}
                  height={24}
                  className="rounded-full"
                  loading="lazy"
                />
                <span className="font-medium">{`${campaign.owner.slice(0, 10)}...`}</span>
              </div>
              <div className="align flex self-start">
                <MapPin className="mt-0.5 text-[#55DFAB]" />
                <span className="text-sm text-gray-900">
                  {campaign.location || 'Earth'}
                </span>
              </div>
            </div>
            <p className="line-clamp-3 text-[12px] text-gray-600">
              {campaign.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="mb-4 cursor-pointer items-center gap-2 text-[14px] text-black underline decoration-black hover:text-gray-600">
                Read More
              </div>
            </div>
          </CardContent>
          <div className="mt-auto space-y-2 px-6 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex">
                <div className="px-1 font-bold text-[#55DFAB]">
                  {campaign.donationCount}
                </div>
                donations
              </span>
              <span className="flex">
                <div className="px-1 font-bold text-[#55DFAB]">
                  {(
                    (Number(campaign.totalRaised) /
                      Number(campaign.goalAmount)) *
                    100
                  ).toFixed(2)}
                  %
                </div>
                of funding goal
              </span>
            </div>
            <div className="mb-2 flex items-center justify-between text-xs text-gray-600">
              <span>
                ${Number(campaign.totalRaised).toLocaleString()} raised
              </span>
              <span>Goal: ${Number(campaign.goalAmount).toLocaleString()}</span>
            </div>
            <Progress
              value={
                (Number(campaign.totalRaised) / Number(campaign.goalAmount)) *
                100
              }
              className="h-2"
            />
          </div>
        </Link>
      </div>

      <CardFooter className="mt-auto gap-4 p-6 pt-0">
        <Link href={`/campaigns/${campaign.slug}/donation`} className="flex-1">
          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            <Image src="/diamond.png" alt="wallet" width={24} height={24} />
            Donate
          </Button>
        </Link>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onSelect(campaign)}
        >
          <Image src="/sparkles.png" alt="wallet" width={24} height={24} />
          Add to Collection
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Info className="mr-2 h-4 w-4" />
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Info</DialogTitle>
            <Table>
              <TableBody>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableCell>{campaign.address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Owner</TableHead>
                  <TableCell>{campaign.owner}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Launch Time</TableHead>
                  <TableCell>
                    <FormattedDate timestamp={campaign.launchTime} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Deadline</TableHead>
                  <TableCell>
                    <FormattedDate timestamp={campaign.deadline} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Goal Amount</TableHead>
                  <TableCell>
                    ${Number(campaign.goalAmount).toLocaleString()} USD
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Total Raised</TableHead>
                  <TableCell>
                    ${Number(campaign.totalRaised).toLocaleString()} USD
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
