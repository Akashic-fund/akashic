import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Round } from "@/types/round";

interface RoundCardProps {
  round: Round;
}

export default function RoundCard({ round }: RoundCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/rounds/${round.id}`}>
        <CardHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-4">
            <Image
              src={round.logoUrl}
              alt={round.id}
              width={32}
              height={32}
              className="rounded-full"
            />
            {/* <span className="font-medium">{round.organization.name}</span> */}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{round.title}</h2>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                {round.tags.join(", ")}
              </span>
            </div>
            <p className="text-gray-600">{round.description}</p>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Matching Pool</p>
              <p className="text-xl font-bold">
                {round.matchingPool.toLocaleString()} USDC
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
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
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Start Date</span>
              <span>{new Date(round.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">End Date</span>
              <span>{new Date(round.endDate).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-6 pt-0 gap-4">
        <Link href={`/rounds/${round.id}`}>
          <Button
            className="flex-1"
            variant={round.status === "ACTIVE" ? "default" : "outline"}
          >
            {round.status === "ACTIVE" ? "View Details" : "View Details"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
