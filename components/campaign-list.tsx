'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { CardFooter } from "@/components/ui/card";
import { IoLocationSharp } from 'react-icons/io5';
import Link from "next/link";
import { Campaign } from "../types/campaign";
import { useInfiniteCampaigns } from "@/lib/hooks/useCampaigns";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface CampaignListProps {
  searchTerm: string;
}

export default function CampaignList({ searchTerm }: CampaignListProps) {
  const { ref, inView } = useInView();
  const {
    data,
    isLoading: loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteCampaigns();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
  };

  // Filter campaigns based on search term
  const filteredCampaigns = data?.pages.map(page => ({
    ...page,
    campaigns: page.campaigns.filter(campaign => {
      const searchLower = searchTerm.toLowerCase();
      return (
        campaign.title?.toLowerCase().includes(searchLower) ||
        campaign.description?.toLowerCase().includes(searchLower) ||
        campaign.location?.toLowerCase().includes(searchLower)
      );
    })
  }));

  if (loading && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error instanceof Error ? error.message : 'An error occurred'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filteredCampaigns?.map((page) =>
          page.campaigns.map((campaign: Campaign) => (
            <Card key={campaign.address} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="flex-1">
                <Link href={`/campaigns/${campaign.slug}`}>
                  <CardHeader className="p-0">
                    <Image
                      src={campaign.images?.find((img: { isMainImage: boolean }) => img.isMainImage)?.imageUrl || '/images/placeholder.svg'}
                      alt={campaign.title || campaign.address}
                      width={600}
                      height={400}
                      className="h-[200px] w-full object-cover"
                      loading="lazy"
                    />
                  </CardHeader>
                  <CardContent className="p-6">
                    <h2 className="mb-2 text-xl font-bold">{campaign.title || 'Campaign Title'}</h2>
                    <div className="flex justify-between items-center mb-4 gap-2">
                      <div className="flex align self-start">
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
                      <div className="flex align self-start">
                        <IoLocationSharp className='text-[#55DFAB] mt-0.5' />
                        <span className="text-gray-900 text-sm">{campaign.location || "Earth"}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-[12px]">{campaign.description}</p>
                    <div className="mb-4 items-center text-[14px] gap-2 underline decoration-black text-black">
                      Read More
                    </div>
                  </CardContent>
                  <div className="mt-auto px-6 py-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className='flex'>
                        <div className='text-[#55DFAB] px-1 font-bold'>
                          {campaign.totalRaised}
                        </div>
                        donations
                      </span>
                      <span className='flex'>
                        <div className='text-[#55DFAB] px-1 font-bold'>
                          {((Number(campaign.totalRaised) / Number(campaign.goalAmount)) * 100).toFixed(2)}%
                        </div>
                        of funding goal
                      </span>
                    </div>
                    <Progress value={(Number(campaign.totalRaised) / Number(campaign.goalAmount)) * 100} className="h-2" />
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
                <Button variant="outline" className="flex-1">
                  <Image src="/sparkles.png" alt="wallet" width={24} height={24} />
                  Add to Collection
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Info className="mr-2 h-4 w-4" />
                  </DialogTrigger>
                  <DialogContent>
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
                          <TableCell>{formatDate(campaign.launchTime)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Deadline</TableHead>
                          <TableCell>{formatDate(campaign.deadline)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Goal Amount</TableHead>
                          <TableCell>{campaign.goalAmount} USDC</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Total Raised</TableHead>
                          <TableCell>{campaign.totalRaised} USDC</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Loading indicator */}
      {isFetchingNextPage && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {[...Array(3)].map((_, index) => (
            <Card key={`loading-${index}`}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={ref} className="h-10" />
    </div>
  );
}