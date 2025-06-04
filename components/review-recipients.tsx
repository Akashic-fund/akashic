'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts';
import { type Address } from 'viem';
import { RecipientStatus } from '@/types/round';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
// import { prepareReviewRecipientsArgs } from "@/lib/qfInteractions"
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface Recipient {
  id: number;
  address: Address;
  campaignId: number;
  campaignName: string;
  currentStatus: RecipientStatus;
}

interface ReviewRecipientsProps {
  strategyAddress: Address;
  poolId: bigint;
  roundId: number;
  recipients: Recipient[];
  isAdmin: boolean;
}

interface RecipientUpdate {
  campaignId: number;
  status: RecipientStatus;
}

const contractStatusMap: Record<RecipientStatus, number> = {
  [RecipientStatus.PENDING]: 3,
  [RecipientStatus.APPROVED]: 1,
  [RecipientStatus.REJECTED]: 2,
};

export function ReviewRecipients({
  strategyAddress,
  poolId,
  roundId,
  recipients: initialRecipients,
  isAdmin,
}: ReviewRecipientsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<
    Record<number, RecipientStatus>
  >({});
  const [recipients, setRecipients] = useState<Recipient[]>(initialRecipients);
  // const { writeContractAsync } = useWriteContract()
  // const publicClient = usePublicClient()
  const router = useRouter();
  const { toast } = useToast();
  const { authenticated } = useAuth();
  const [updatesToSend, setUpdatesToSend] = useState<RecipientUpdate[]>([]);

  console.log(
    'initialRecipients',
    initialRecipients,
    'strategyAddress',
    strategyAddress,
    'poolId',
    poolId,
    'roundId',
    roundId,
  );
  useEffect(() => {
    setRecipients(initialRecipients);
    const initialStatuses = initialRecipients.reduce(
      (acc, recipient) => {
        acc[recipient.campaignId] = recipient.currentStatus;
        return acc;
      },
      {} as Record<number, RecipientStatus>,
    );
    setSelectedRecipients(initialStatuses);
    setUpdatesToSend([]);
  }, [initialRecipients]);

  function toggleRecipientStatus(campaignId: number, status: RecipientStatus) {
    setSelectedRecipients((prev) => {
      const currentStatus = prev[campaignId];
      const newStatus =
        currentStatus === status ? RecipientStatus.PENDING : status;
      return { ...prev, [campaignId]: newStatus };
    });
  }

  async function handleReviewRecipients() {
    if (!authenticated) {
      toast({
        title: 'Error',
        description: 'Wallet not connected.',
        variant: 'destructive',
      });
      return;
    }

    const updatesToSend: RecipientUpdate[] = [];
    const recipientIdsForContract: Address[] = [];
    const newStatusesForContract: number[] = [];

    for (const recipient of recipients) {
      const newStatus = selectedRecipients[recipient.campaignId];
      if (newStatus !== recipient.currentStatus) {
        updatesToSend.push({
          campaignId: recipient.campaignId,
          status: newStatus,
        });

        recipientIdsForContract.push(recipient.address);
        newStatusesForContract.push(contractStatusMap[newStatus]);
      }
    }

    if (updatesToSend.length === 0) {
      toast({
        title: 'No Changes',
        description: 'No recipient statuses were changed.',
      });
      return;
    }

    try {
      setIsReviewing(true);

      const response = await fetch('/api/rounds/recipients/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roundId,
          updates: updatesToSend,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Review Successful',
          description: 'Recipient statuses updated in the database.',
        });
        router.refresh();
        setIsOpen(false);
      } else {
        throw new Error(data.error || 'Failed to update statuses in database.');
      }
    } catch (error) {
      console.error('Database review update failed:', error);
      toast({
        title: 'Database Update Failed',
        variant: 'destructive',
      });
    } finally {
      setIsReviewing(false);
    }
  }

  if (!isAdmin) {
    return null;
  }

  if (recipients.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No recipients registered for this round yet.
      </p>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Review Recipients</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Review Round Recipients</DialogTitle>
          <DialogDescription>
            Approve or reject recipient applications for Round ID: {roundId}.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Selected Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipients.map((recipient) => (
                <TableRow key={recipient.campaignId}>
                  <TableCell className="font-medium">
                    {recipient.campaignName}
                  </TableCell>
                  <TableCell
                    className="max-w-[100px] truncate font-mono text-xs"
                    title={recipient.address}
                  >
                    {recipient.address}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={
                        selectedRecipients[recipient.campaignId] ??
                        recipient.currentStatus
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        size="sm"
                        variant={
                          selectedRecipients[recipient.campaignId] ===
                          RecipientStatus.APPROVED
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() =>
                          toggleRecipientStatus(
                            recipient.campaignId,
                            RecipientStatus.APPROVED,
                          )
                        }
                        disabled={isReviewing}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          selectedRecipients[recipient.campaignId] ===
                          RecipientStatus.REJECTED
                            ? 'destructive'
                            : 'outline'
                        }
                        onClick={() =>
                          toggleRecipientStatus(
                            recipient.campaignId,
                            RecipientStatus.REJECTED,
                          )
                        }
                        disabled={isReviewing}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isReviewing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReviewRecipients}
            disabled={isReviewing || updatesToSend.length === 0}
          >
            {isReviewing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />{' '}
                Submitting...
              </>
            ) : (
              `Submit ${updatesToSend.length} Change(s)`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatusBadge({ status }: { status: RecipientStatus }) {
  switch (status) {
    case RecipientStatus.PENDING:
      return <Badge variant="secondary">Pending</Badge>;
    case RecipientStatus.APPROVED:
      return <Badge variant="success">Approved</Badge>;
    case RecipientStatus.REJECTED:
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      const statusString = status as string;
      return <Badge variant="outline">{statusString || 'Unknown'}</Badge>;
  }
}
