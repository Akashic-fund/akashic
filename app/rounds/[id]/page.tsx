"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Calendar, Users, Info } from "lucide-react";
import Link from "next/link";
import { Round } from "@/types/round";
import ApplyToRound from "@/components/apply-to-round";
import { MOCK_USER_CAMPAIGNS } from "@/lib/constant";

export default function RoundPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [round, setRound] = useState<Round | null>(null);

  useEffect(() => {
    const getRound = async () => {
      const { id } = await params; // Get the ID from the URL
      if (id) {
        const fetchRound = async () => {
          const response = await fetch(`/api/rounds/${id}`); // Call the API route
          if (response.ok) {
            const data = await response.json();
            setRound(data); // Update state with fetched round
          } else {
            notFound(); // Handle not found
          }
        };

        fetchRound(); // Call the fetch function
      }
    };

    getRound();
  }, [params]);

  if (!round) return <div>Loading...</div>; // Loading state

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Image
            src={round.logoUrl}
            alt={round.title}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <h1 className="text-4xl font-bold">{round.title}</h1>
            <p className="text-gray-600">{round.title}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <ApplyToRound round={round} userCampaigns={MOCK_USER_CAMPAIGNS} />
          <Button variant="outline" size="lg">
            Share Round
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About this Round</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{round.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Eligibility Criteria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 mt-0.5 text-gray-500" />
                    <div>
                      <h4 className="font-medium">Project Requirements</h4>
                      <p className="text-gray-600">
                        Your project must be open source and align with the
                        round&apos;s goals.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 mt-0.5 text-gray-500" />
                    <div>
                      <h4 className="font-medium">Team Requirements</h4>
                      <p className="text-gray-600">
                        Teams must have a proven track record or strong
                        potential in the space.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Participating Projects</CardTitle>
                  <CardDescription>
                    Projects that have been accepted into this round
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {round.campaigns?.length ? (
                    <div className="space-y-4">
                      {round.campaigns.map((campaignId: string) => (
                        <Link
                          key={campaignId}
                          href={`/campaigns/${campaignId}`}
                        >
                          <div className="p-4 hover:bg-gray-50 rounded-lg transition-colors">
                            Campaign {campaignId}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      No projects have joined this round yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules">
              <Card>
                <CardHeader>
                  <CardTitle>Round Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Matching Formula</h4>
                    <p className="text-gray-600">
                      This round uses quadratic funding to determine matching
                      amounts. The more individual contributors a project has,
                      the higher their matching amount will be.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Distribution</h4>
                    <p className="text-gray-600">
                      Funds will be distributed within 2 weeks after the round
                      ends.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Round Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Matching Pool</p>
                <p className="text-2xl font-bold">
                  {round.matchingPool.toLocaleString()} USDC
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    round.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : round.status === "NOT_STARTED"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {round.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Important Dates</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-gray-600">
                        {new Date(round.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-sm text-gray-600">
                        {new Date(round.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
