"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight } from "lucide-react";
import { Round } from "@/types/round";

const applicationSchema = z.object({
  campaignId: z.string(),
  motivation: z.string().min(100, {
    message: "Motivation must be at least 100 characters.",
  }),
  impact: z.string().min(100, {
    message: "Impact description must be at least 100 characters.",
  }),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplyToRoundProps {
  round: Round;
  userCampaigns?: Array<{
    id: string;
    title: string;
  }>;
}

export default function ApplyToRound({
  round,
  userCampaigns = [],
}: ApplyToRoundProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      // In production, this would be an API call
      console.log("Submitting application:", data);

      // Mock success
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to submit application:", error);
    }
  };

  if (!userCampaigns.length) {
    return (
      <Button size="lg" onClick={() => router.push("/campaigns/new")}>
        Create a Campaign First
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {round.status !== "CLOSED" && (
        <DialogTrigger asChild>
          <Button size="lg">
            {round.status === "ACTIVE"
              ? " Apply to Round"
              : round.status === "NOT_STARTED"
              ? " Apply for Upcoming Round"
              : "Round Ended"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogTrigger>
      )}
      {round.status === "CLOSED" && (
        <Button size="lg" disabled>
          Round Ended
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Apply to {round.title}</DialogTitle>
          <DialogDescription>
            Submit your project to be considered for this funding round. Make
            sure to explain how your project aligns with the round&apos;s goals.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="campaignId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Campaign</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a campaign" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userCampaigns.map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose which of your campaigns you want to submit to this
                    round.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motivation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Why do you want to participate in this round? How does your project align with the round's goals?"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Explain how your project aligns with the round&apos;s goals
                    and why you should be considered.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="impact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Impact</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What impact will your project create with the funding from this round?"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the concrete outcomes and impact you expect to
                    achieve with the funding.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Application</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
