"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { SideBar } from "@/components/SideBar";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Coins, Users, Calendar, TrendingUp, Copy } from "lucide-react";
import { GlobalParamsABI } from "@/contracts/abi/GlobalParams";
import { TreasuryFactoryABI } from "@/contracts/abi/TreasuryFactory";
import { ethers } from "ethers";
import { IoLocationSharp } from "react-icons/io5";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts";
import Loading from '@/components/loading';
import { chainConfig } from '@/config/chain';

// Add platform config
const platformConfig = {
  treasuryFactoryAddress: process.env.NEXT_PUBLIC_TREASURY_FACTORY as string,
  globalParamsAddress: process.env.NEXT_PUBLIC_GLOBAL_PARAMS as string,
  platformBytes: process.env.NEXT_PUBLIC_PLATFORM_HASH as string,
  rpcUrl: chainConfig.rpcUrl as string,
};

interface Campaign {
  id: number;
  title: string;
  description: string;
  fundingGoal: string;
  startTime: Date;
  endTime: Date;
  creatorAddress: string;
  status: string;
  transactionHash?: string;
  campaignAddress?: string;
  treasuryAddress?: string;
  address?: string;
  owner?: string;
  launchTime?: string;
  deadline?: string;
  goalAmount?: string;
  totalRaised?: string;
  isApproved?: boolean;
  images?: {
    id: number;
    imageUrl: string;
    isMainImage: boolean;
    campaignId: number;
  }[];
  location?: string;
  rounds?: { id: number; title: string }[];
}

interface TreasuryDeployedEvent {
  event: string;
  args: {
    treasuryAddress: string;
    campaignInfo: string;
  };
}

function AccessDenied() {
  const { authenticated, login } = useAuth();
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <div
        className={cn(
          "flex-1 p-8 transition-all duration-300 ease-in-out ml-[70px]"
        )}
      >
        <div className="max-w-7xl mx-auto">
          <Card className="border-2 border-dashed border-gray-200 bg-white/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {!authenticated ? "Connect Wallet" : "Unauthorized Access"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                {!authenticated
                  ? "Please connect your wallet to access the admin dashboard."
                  : "This page is restricted to admin users only."}
              </p>
              {!authenticated && (
                <Button 
                  onClick={() => {
                    if (!hasAttemptedLogin) {
                      setHasAttemptedLogin(true);
                      login();
                    } else {
                      // If already attempted, redirect instead of trying repeatedly
                      window.location.href = '/';
                    }
                  }} 
                  className="bg-primary hover:bg-primary/90 mb-2"
                >
                  {hasAttemptedLogin ? "Go to Home Page" : "Connect Wallet"}
                </Button>
              )}
              {authenticated && (
                <Button 
                  onClick={() => window.location.href = '/'} 
                  className="bg-primary hover:bg-primary/90 mb-2"
                >
                  Go to Home Page
                </Button>
              )}  
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  // Core hooks
  const { address, isAdmin, isClient, wallet } = useAuth();
  const { toast } = useToast();

  // Simple states
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [campaignStatuses, setCampaignStatuses] = useState<Record<string, string>>({});
  
  /* TODO: Implement rounds functionality
   * - Add state management for rounds
   * - Add state for selected rounds
   * - Add state for dropdown visibility
   */
  // const [rounds, setRounds] = useState<{ id: number; title: string }[]>([]);
  // const [selectedRounds, setSelectedRounds] = useState<number[]>([]);
  // const [dropdownStates, setDropdownStates] = useState<{ [key: number]: boolean }>({});

  // Update campaign statuses function (move this above useEffect)
  const updateCampaignStatuses = (campaignsToUpdate = campaigns) => {
    const now = Math.floor(Date.now() / 1000);
    const newStatuses: Record<string, string> = {};
    campaignsToUpdate.forEach((campaign) => {
      if (campaign.status === "draft") {
        newStatuses[campaign.id] = "Draft";
      } else if (campaign.status === "pending_approval") {
        newStatuses[campaign.id] = "Pending Approval";
      } else if (campaign.status === "failed") {
        newStatuses[campaign.id] = "Failed";
      } else if (campaign.status === "completed") {
        newStatuses[campaign.id] = "Completed";
      } else {
        const launchTime = campaign.launchTime
          ? parseInt(campaign.launchTime)
          : now;
        const deadline = campaign.deadline
          ? parseInt(campaign.deadline)
          : now;
        if (now < launchTime) {
          newStatuses[campaign.id] = "Upcoming";
        } else if (now > deadline) {
          newStatuses[campaign.id] = "Ended";
        } else {
          newStatuses[campaign.id] = "Active";
        }
      }
    });
    setCampaignStatuses(newStatuses);
  };

  // Fetch data when admin is authenticated
  useEffect(() => {
    if (!isClient || !address || !isAdmin) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const campaignsResponse = await fetch(`/api/campaigns?status=pending_approval`);
        const campaignsData = await campaignsResponse.json();
        if (!campaignsResponse.ok) {
          throw new Error(campaignsData.error || "Failed to fetch campaigns");
        }
        const filteredCampaigns = campaignsData.campaigns.filter((campaign: Campaign) => campaign.address);
        const campaignsWithRounds = await Promise.all(
          filteredCampaigns.map(async (campaign: { id: number }) => {
            const roundsResponse = await fetch(`/api/campaigns/round/${campaign.id}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });
            if (!roundsResponse.ok) {
              throw new Error("Failed to fetch rounds");
            }
            const roundsData = await roundsResponse.json();
            return { ...campaign, rounds: roundsData.rounds };
          })
        );
        setCampaigns(campaignsWithRounds);
        
        // TODO: Implement rounds fetching functionality
        // // Fetch rounds
        // const roundsResponse = await fetch("/api/rounds");
        // const roundsData = await roundsResponse.json();
        // if (!roundsResponse.ok) {
        //   throw new Error(roundsData.error || "Failed to fetch rounds");
        // }
        // setRounds(roundsData);

        // Update statuses
        updateCampaignStatuses(campaignsWithRounds);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, address, isAdmin]);

  // Set up status update timer
  useEffect(() => {
    updateCampaignStatuses();
    const interval = setInterval(() => updateCampaignStatuses(), 60000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaigns]);

  // Wait for client-side rendering and AuthContext resolution
  const authResolved = isClient && (address !== null);
  if (!authResolved) {
    return (
      <div className="flex min-h-screen">
        <SideBar />
        <div className="flex-1">
          <Loading />
        </div>
      </div>
    );
  }
  // Show access denied if not admin
  if (!isAdmin) {
    return <AccessDenied />;
  }

  // Helper functions
  const formatDate = (timestamp: string | undefined) => {
    if (!timestamp || !isClient) return "Not set";
    try {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toISOString().split("T")[0];
    } catch {
      return "Invalid date";
    }
  };

  const approveCampaign = async (campaignId: number, campaignAddress: string) => {
    try {
      setIsLoading(true);
      
      if (!campaignId || !campaignAddress) {
        throw new Error("Campaign ID and address are required");
      }
      if (!wallet || !(typeof wallet.isConnected === "function" && await wallet.isConnected())) {
        throw new Error("Wallet not connected");
      }
      
      // Platform config checks
      if (!platformConfig.globalParamsAddress) {
        throw new Error("Global Params contract address is not configured");
      }
      if (!platformConfig.treasuryFactoryAddress) {
        throw new Error("Treasury Factory contract address is not configured");
      }
      if (!platformConfig.platformBytes) {
        throw new Error("Platform bytes is not configured");
      }

      // Get provider from wallet
      const privyProvider = await wallet.getEthereumProvider();

      // Switch to Alfajores network
      try {
        await privyProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainConfig.chainId.hex }],
        });
      } catch (switchError: unknown) {
        // Type guard to check if it's a ProviderRpcError
        if (
          typeof switchError === "object" &&
          switchError !== null &&
          "code" in switchError &&
          (switchError as { code: number }).code === 4902
        ) {
          try {
            await privyProvider.request({
              method: "wallet_addEthereumChain",
              params: [chainConfig.getAddChainParams()],
            });
          } catch (addError) {
            console.error("Error adding Alfajores network:", addError);
            throw new Error("Failed to add Alfajores network to wallet");
          }
        } else {
          console.error("Error switching to Alfajores network:", switchError);
          throw new Error("Failed to switch to Alfajores network");
        }
      }

      // Create providers
      const walletProvider = new ethers.providers.Web3Provider(privyProvider, {
        chainId: chainConfig.chainId.decimal,
        name: chainConfig.name,
      });
      const signer = walletProvider.getSigner();
      const signerAddress = await signer.getAddress();

      // Global params check
      const globalParams = new ethers.Contract(
        platformConfig.globalParamsAddress,
        GlobalParamsABI,
        walletProvider
      );
      const platformAdmin = await globalParams.getPlatformAdminAddress(
        platformConfig.platformBytes
      );

      // Admin check
      if (platformAdmin.toLowerCase() !== signerAddress.toLowerCase()) {
        throw new Error("Not authorized as platform admin");
      }

      // Initialize TreasuryFactory contract
      const treasuryFactory = new ethers.Contract(
        platformConfig.treasuryFactoryAddress,
        TreasuryFactoryABI,
        signer
      );

      // Deploy treasury
      const tx = await treasuryFactory.deploy(
        platformConfig.platformBytes,
        0,
        campaignAddress
      );

      const receipt = await tx.wait();

      // Find deployment event
      const deployEvent = receipt.events?.find(
        (e: TreasuryDeployedEvent) =>
          e.event === "TreasuryFactoryTreasuryDeployed"
      );

      if (!deployEvent) {
        throw new Error("Treasury deployment event not found");
      }

      const treasuryAddress = deployEvent.args.treasuryAddress;

      // Update campaign in DB
      const updateResponse = await fetch(
        `/api/campaigns/${campaignId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            treasuryAddress,
            adminAddress: address,
            status: "active",
          }),
        }
      );
      if (!updateResponse.ok) {
        throw new Error("Failed to update campaign status");
      }

      // Update local state
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((campaign) =>
          campaign.id === campaignId
            ? {
                ...campaign,
                status: "active",
                isApproved: true,
                treasuryAddress: treasuryAddress,
                campaignAddress: campaignAddress,
              }
            : campaign
        )
      );
      
      toast({
        title: "Success",
        description: "Campaign has been approved successfully"
      });
    } catch (err) {
      console.error("Error approving campaign:", err);
      setError(err instanceof Error ? err.message : "Failed to approve campaign");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to approve campaign",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCampaignStatus = (campaign: Campaign) => {
    return campaignStatuses[campaign.id] || "Unknown";
  };

  const calculateStats = (campaigns: Campaign[]) => {
    return {
      totalCampaigns: campaigns.length,
      totalRaised: campaigns.reduce((sum, campaign) => {
        const raised = campaign.totalRaised ? Number(campaign.totalRaised) : 0;
        return sum + raised;
      }, 0),
      activeCampaigns: campaigns.filter(
        (campaign) =>
          campaignStatuses[campaign.id] === "Active" &&
          campaign.status === "active"
      ).length,
      averageProgress:
        campaigns.length > 0
          ? campaigns.reduce((sum, campaign) => {
              if (!campaign.totalRaised || !campaign.goalAmount) return sum;
              const progress =
                (Number(campaign.totalRaised) / Number(campaign.goalAmount)) *
                100;
              return sum + (isNaN(progress) ? 0 : progress);
            }, 0) / campaigns.length
          : 0,
    };
  };

  /* TODO: Implement campaign round association functionality
   * - Add API endpoint for campaign-round association
   * - Implement error handling and validation
   * - Add success/error notifications
   * - Handle state updates after successful association
   */
  // const addCampaignToRounds = async (campaignId: number) => {
  //   try {
  //     const response = await fetch(`/api/campaigns/round`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         campaignId,
  //         roundIds: selectedRounds,
  //       }),
  //     });
  //     if (!response.ok) {
  //       throw new Error("Failed to add campaign to rounds");
  //     }
  //     toast({
  //       title: "Success",
  //       description: "Campaign added to selected rounds successfully.",
  //     });
  //     setSelectedRounds([]); // Clear selection after successful submission
  //     toggleDropdown(campaignId); // Close dropdown
  //   } catch (err) {
  //     console.error("Error adding campaign to rounds:", err);
  //     setError(err instanceof Error ? err.message : "An error occurred");
  //   }
  // };

  /* TODO: Implement dropdown toggle functionality
   * - Add state management for dropdown visibility
   * - Implement toggle logic for each campaign
   * - Add keyboard accessibility
   * - Consider adding animation for smooth transitions
   */
  // const toggleDropdown = (campaignId: number) => {
  //   setDropdownStates((prev) => ({
  //     ...prev,
  //     [campaignId]: !prev[campaignId],
  //   }));
  // };

  // Main content
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto p-5">
        <div className="text-3xl font-bold pt-5 mb-8">Admin Dashboard</div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No campaigns found.</p>
          </div>
        ) : (
          <>
            {/* Dashboard Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Campaigns
                    </p>
                    <h3 className="text-2xl font-bold">
                      {calculateStats(campaigns).totalCampaigns}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <Coins className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Raised</p>
                    <h3 className="text-2xl font-bold">{calculateStats(campaigns).totalRaised.toFixed(2)} USDC</h3>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Campaigns
                    </p>
                    <h3 className="text-2xl font-bold">
                      {calculateStats(campaigns).activeCampaigns}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Average Progress
                    </p>
                    <h3 className="text-2xl font-bold">
                      {calculateStats(campaigns).averageProgress.toFixed(1)}%
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaign Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <Card key={campaign.id || campaign.address} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <Image
                      src={campaign.images?.find(img => img.isMainImage)?.imageUrl || '/images/placeholder.svg'}
                      alt={campaign.title || 'Campaign'}
                      width={600}
                      height={400}
                      className="h-[200px] w-full object-cover"
                      loading="lazy"
                    />
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold mb-4">{campaign.title || 'Campaign'}</h2>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-sm inline-block",
                        {
                          'bg-blue-100 text-blue-600': getCampaignStatus(campaign) === 'Active',
                          'bg-yellow-100 text-yellow-600': getCampaignStatus(campaign) === 'Upcoming',
                          'bg-gray-100 text-gray-600': getCampaignStatus(campaign) === 'Ended',
                          'bg-orange-100 text-orange-600': getCampaignStatus(campaign) === 'Pending Approval',
                          'bg-purple-100 text-purple-600': getCampaignStatus(campaign) === 'Draft',
                          'bg-red-100 text-red-600': getCampaignStatus(campaign) === 'Failed',
                          'bg-green-100 text-green-600': getCampaignStatus(campaign) === 'Completed'
                        }
                      )}>
                        {getCampaignStatus(campaign)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p><strong>Description:</strong> {campaign.description}</p>
                      <div className="flex items-center gap-2">
                        <strong>Creator:</strong>
                        <span className="font-mono">
                          {campaign.owner?.slice(0, 8)}...{campaign.owner?.slice(-8)}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(campaign.owner || '');
                            toast({
                              title: "Address copied",
                              description: "The address has been copied to your clipboard",
                            });
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      {campaign.location && (
                        <div className="flex items-center gap-1">
                          <IoLocationSharp className="text-[#55DFAB]" />
                          <p>{campaign.location}</p>
                        </div>
                      )}
                      {campaign.launchTime && <p><strong>Launch:</strong> {formatDate(campaign.launchTime)}</p>}
                      {campaign.deadline && <p><strong>Deadline:</strong> {formatDate(campaign.deadline)}</p>}
                      <p><strong>Goal:</strong> {campaign.goalAmount || campaign.fundingGoal} USDC</p>
                      {campaign.totalRaised && <p><strong>Raised:</strong> {campaign.totalRaised} USDC</p>}

                      {campaign.status === 'pending_approval' && (
                        <Button
                          onClick={() => approveCampaign(campaign.id, campaign.address || '')}
                          className="w-full mt-4 bg-green-600 hover:bg-green-700"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Processing...' : 'Approve Campaign'}
                        </Button>
                      )}

                      {campaign.totalRaised && campaign.goalAmount && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>
                              {(
                                (Number(campaign.totalRaised) /
                                  Number(campaign.goalAmount)) *
                                100
                              ).toFixed(2)}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              (Number(campaign.totalRaised) /
                                Number(campaign.goalAmount)) *
                              100
                            }
                            className="h-2"
                          />
                        </div>
                      )}

                      {/* Display associated rounds */}
                      {campaign.rounds && campaign.rounds.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-bold">
                            Rounds this campaign is part of:
                          </h4>
                          <ul className="list-disc pl-5">
                            {campaign.rounds.map((round) => (
                              <li key={round.id}>{round.title}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
