import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Round } from '@/types/round';
import { Clock, Calendar, Users, DollarSign } from 'lucide-react';
import { formatDistanceToNowStrict, isPast, isFuture } from 'date-fns';

// Helper function to determine round status and badge variant
function getRoundStatus(
  startDate: Date,
  endDate: Date,
): {
  text: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
} {
  if (!startDate || !endDate)
    return { text: 'Invalid', variant: 'destructive' };
  if (isFuture(startDate)) return { text: 'Upcoming', variant: 'secondary' };
  if (isPast(endDate)) return { text: 'Ended', variant: 'outline' };
  return { text: 'Active', variant: 'default' };
}

// Helper function to format dates
function formatDate(date: Date): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Helper function to get time remaining or elapsed
function getTimeInfo(startDate: Date, endDate: Date): string {
  if (
    !startDate ||
    !endDate ||
    !(startDate instanceof Date) ||
    isNaN(startDate.getTime()) ||
    !(endDate instanceof Date) ||
    isNaN(endDate.getTime())
  ) {
    return 'Date info unavailable';
  }

  if (isFuture(startDate)) {
    return `Starts in ${formatDistanceToNowStrict(startDate)}`;
  }
  if (isPast(endDate)) {
    return `Ended ${formatDistanceToNowStrict(endDate)} ago`;
  }
  return `Ends in ${formatDistanceToNowStrict(endDate)}`;
}

interface RoundCardProps {
  round: Round;
}

export default function RoundCard({ round }: RoundCardProps) {
  const status = getRoundStatus(round.startDate, round.endDate);
  const timeInfo = getTimeInfo(round.startDate, round.endDate);
  const formattedStartDate = formatDate(round.startDate);
  const formattedEndDate = formatDate(round.endDate);

  const numberOfProjects =
    round._count && 'campaigns' in round._count
      ? round._count.campaigns
      : 'roundCampaigns' in (round._count || {})
        ? (round._count as { roundCampaigns: number }).roundCampaigns
        : 0;

  if (!round || !round.id) {
    return (
      <Card className="flex h-full flex-col overflow-hidden rounded-lg border p-4 shadow-sm">
        <p className="text-destructive">Error: Invalid round data.</p>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/rounds/${round.id}`}
        className="flex flex-grow flex-col"
        passHref
      >
        <CardHeader className="border-b p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 border">
              {round.logoUrl ? (
                <AvatarImage
                  src={round.logoUrl}
                  alt={`${round.title} logo`}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="text-lg font-semibold">
                {round.title ? round.title.charAt(0).toUpperCase() : 'R'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="truncate text-lg font-semibold leading-tight tracking-tight">
                  {round.title ?? 'Untitled Round'}
                </h2>
                <Badge variant={status.variant} className="shrink-0 text-xs">
                  {status.text}
                </Badge>
              </div>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {round.description ?? 'No description.'}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow space-y-3 p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" />
              <span>Matching Pool</span>
            </div>
            <span className="font-medium text-foreground">
              ${round.matchingPool.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>Projects</span>
            </div>
            <span className="font-medium text-foreground">
              {numberOfProjects !== undefined
                ? numberOfProjects?.toString()
                : '0'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Timeline</span>
            </div>
            <span className="font-medium text-foreground">
              {formattedStartDate} - {formattedEndDate}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>Status</span>
            </div>
            <span className="font-medium text-foreground">{timeInfo}</span>
          </div>
        </CardContent>

        <CardFooter className="mt-auto p-4 pt-0">
          <Button
            className="w-full"
            variant={status.text === 'Active' ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <span>
              {status.text === 'Ended' ? 'View Results' : 'View Round'}
            </span>
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
