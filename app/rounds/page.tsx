"use client";

import RoundCard from "@/components/round-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RoundsPage() {
  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    const fetchRounds = async () => {
      const response = await fetch("/api/rounds");
      const data = await response.json();
      setRounds(data);
    };

    fetchRounds();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Quadratic Funding Rounds</h1>
          <p className="text-gray-600">
            Explore active and upcoming funding rounds to support impactful
            initiatives
          </p>
        </div>
        <Link href="/rounds/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Round
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rounds.map((round, index) => (
          <RoundCard key={index} round={round} />
        ))}
      </div>
    </div>
  );
}
