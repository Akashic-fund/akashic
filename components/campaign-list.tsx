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
  Skeleton,
  Alert,
  AlertDescription,
  AlertTitle,
  Progress,
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Badge,
} from "@/components/ui";
import { AlertCircle, Info } from "lucide-react";
import Image from "next/image";
import { IoLocationSharp } from 'react-icons/io5';
import Link from "next/link";
import { Campaign } from "../types/campaign";
import { useInfiniteCampaigns } from "@/lib/hooks/useCampaigns";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { useCollection } from "@/contexts/CollectionContext";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { categories } from "@/lib/constant";

interface CampaignListProps {
  searchTerm: string;
  categoryFilter?: string | null;
}

export default function CampaignList({ searchTerm, categoryFilter }: CampaignListProps) {
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

  // Filter campaigns based on search term and category
  const filteredCampaigns = data?.pages.map(page => ({
    ...page,
    campaigns: page.campaigns.filter(campaign => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        campaign.title?.toLowerCase().includes(searchLower) ||
        campaign.description?.toLowerCase().includes(searchLower) ||
        campaign.location?.toLowerCase().includes(searchLower)
      );

      // If a category filter is applied, check if the campaign matches
      const matchesCategory = !categoryFilter || campaign.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
  }));

  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('')
  const [newCollectionName, setNewCollectionName] = useState('')
  const [isCreatingCollection, setIsCreatingCollection] = useState(false)
  const { addToCollection, userCollections, isLoading } = useCollection()

  const handleAddToCollection = async (campaign: Campaign | null, collectionId: string, isNewCollection = false) => {
    if (!campaign) {
      toast({
        title: "Error",
        description: "No campaign selected",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isNewCollection) {
        console.log(`Creating new collection with name: ${newCollectionName}`);
        await addToCollection(campaign, newCollectionName, true);
      } else {
        console.log(`Adding to existing collection with ID: ${collectionId}`);
        await addToCollection(campaign, collectionId, false);
      }

      setShowCollectionModal(false);
      setSelectedCollectionId('');
      setNewCollectionName('');
      setIsCreatingCollection(false);

      toast({
        title: "Success",
        description: isNewCollection
          ? "Created new collection with your campaign"
          : "Added campaign to your collection",
      });
    } catch (error) {
      console.error('Error adding to collection:', error);
      toast({
        title: "Error",
        description: "Failed to add to collection",
        variant: "destructive",
      });
    }
  };

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
          page.campaigns.map((campaign: Campaign) => {
            // Find the category details
            const categoryDetails = campaign.category ?
              categories.find(cat => cat.id === campaign.category) : null;

            return (
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
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="mb-2 text-xl font-bold">{campaign.title || 'Campaign Title'}</h2>
                        {categoryDetails && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <span className="flex items-center">{categoryDetails.icon}</span>
                            <span className="text-xs">{categoryDetails.name}</span>
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-center mb-2 gap-1">
                        <div className="flex align self-start gap-2">
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
                      <p className="text-gray-600 text-[12px] line-clamp-3">{campaign.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="mb-4 items-center text-[14px] gap-2 underline decoration-black text-black cursor-pointer hover:text-gray-600">
                          Read More
                        </div>
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
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedCampaign(campaign);
                      setShowCollectionModal(true);
                    }}
                  >
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
            );
          })
        )}
      </div>

      <Dialog
        open={showCollectionModal}
        onOpenChange={(open) => {
          setShowCollectionModal(open)
          if (!open) {
            setSelectedCollectionId('')
            setSelectedCampaign(null)
            setNewCollectionName('')
            setIsCreatingCollection(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span className="text-2xl font-bold">Add to Collection</span>
              <Image src="/sparkles.png" alt="wallet" width={24} height={24} />
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 mb-4 text-sm">Choose the collection where you&apos;d like to add this campaign:</p>

            {isCreatingCollection ? (
              <div className="mb-4">
                <label htmlFor="collectionName" className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="collectionName"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                    placeholder="Enter collection name"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setIsCreatingCollection(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {userCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg border hover:bg-green-50 cursor-pointer",
                      selectedCollectionId === collection.id && "border-emerald-400 bg-green-50"
                    )}
                    onClick={() => setSelectedCollectionId(collection.id)}
                  >
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-lg">
                      {collection.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="flex-grow">{collection.name}</span>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2",
                      selectedCollectionId === collection.id
                        ? "border-emerald-400 bg-emerald-400"
                        : "border-gray-200"
                    )} />
                  </div>
                ))}
                <div
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  onClick={() => setIsCreatingCollection(true)}
                >
                  <div className="w-10 h-10 border-2 border-dashed border-purple-400 rounded-lg flex items-center justify-center text-purple-400">
                    +
                  </div>
                  <span className="text-purple-600">New Collection</span>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                disabled={(!selectedCollectionId && !newCollectionName) || !selectedCampaign || isLoading}
                onClick={() => {
                  if (!selectedCampaign) {
                    toast({
                      title: "No campaign selected",
                      description: "Please try again",
                      variant: "destructive"
                    });
                    return;
                  }

                  if (isCreatingCollection) {
                    if (!newCollectionName.trim()) {
                      toast({
                        title: "Collection name required",
                        description: "Please enter a name for your collection",
                        variant: "destructive"
                      });
                      return;
                    }
                    handleAddToCollection(selectedCampaign, newCollectionName, true);
                  } else {
                    if (!selectedCollectionId) {
                      toast({
                        title: "Collection required",
                        description: "Please select a collection or create a new one",
                        variant: "destructive"
                      });
                      return;
                    }
                    handleAddToCollection(selectedCampaign, selectedCollectionId, false);
                  }
                }}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowCollectionModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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