'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  //TableHeader, 
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { CardFooter } from "@/components/ui/card";


interface Campaign {
  address: string;
  owner: string;
  launchTime: string;
  deadline: string;
  goalAmount: string;
  totalRaised: string;
  title: string;
  description: string;
  location: string;
  imageUrl?: string;
}

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch campaigns');
      }

      setCampaigns(data.campaigns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
  };

  if (loading) {
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
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.address} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="p-0">
            <Image
              src={campaign.imageUrl || '/images/placeholder.svg'}
              alt={campaign.title || campaign.address}
              width={600}
              height={400}
              className="h-[200px] w-full object-cover"
            />
          </CardHeader>
          <CardContent className="p-6">
            <h2 className="mb-2 text-xl font-bold">{campaign.title || 'Campaign Title'}</h2>
            <div className="mb-4 flex items-center gap-2">
              <Image
                src={`https://avatar.vercel.sh/${campaign.address}`}
                alt="user-pr"
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="font-medium">{`${campaign.owner.slice(0, 10)}...` || 'Campaign Author'}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">{campaign.location || 'Earth'}</span>
            </div>
            <div className="space-y-2 py-5 ">
              <p className="text-gray-600">{campaign.description || 'Campaign Description'}</p>

              <p className="text-sm"><strong>Launch:</strong> {formatDate(campaign.launchTime)}</p>
              <p className="text-sm"><strong>Deadline:</strong> {formatDate(campaign.deadline)}</p>
              <p className="text-sm"><strong>Goal:</strong> {campaign.goalAmount} ETH</p>
              <p className="text-sm"><strong>Raised:</strong> {campaign.totalRaised} ETH</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className='flex '>
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
              <Progress value={(Number(campaign.totalRaised) / Number(campaign.goalAmount)) * 100} className="h-2 " />
            </div>
          </CardContent>

          <CardFooter className="flex gap-4 p-6 pt-0">
            <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
              <Image src="/diamond.png" alt="wallet" width={24} height={24} />

              Donate
            </Button>
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
                      <TableCell>{campaign.goalAmount} ETH</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Total Raised</TableHead>
                      <TableCell>{campaign.totalRaised} ETH</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))
      }
    </div >
  );
}