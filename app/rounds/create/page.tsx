"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const roundSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(30, {
    message: "Description must be at least 30 characters.",
  }),
  tags: z.array(z.string()).min(1, {
    message: "Please select at least one tag.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  matchingPool: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Matching pool must be a positive number.",
    }),
  startDate: z.string().refine((val) => new Date(val) > new Date(), {
    message: "Start date must be in the future.",
  }),
  endDate: z.string().refine((val) => new Date(val) > new Date(), {
    message: "End date must be in the future.",
  }),
  applicationStart: z.string().refine((val) => new Date(val) > new Date(), {
    message: "Application start date must be in the future.",
  }),
  applicationClose: z.string().refine((val) => new Date(val) > new Date(), {
    message: "Application close date must be in the future.",
  }),
  status: z.enum(["NOT_STARTED", "ACTIVE", "CLOSED"]),
  blockchain: z.string().min(1, {
    message: "Blockchain must be specified.",
  }),
  logoUrl: z.string().url({
    message: "Logo URL must be a valid URL.",
  }),
});

type RoundFormData = z.infer<typeof roundSchema>;

export default function CreateRoundPage() {
  const router = useRouter();
  const form = useForm<RoundFormData>({
    resolver: zodResolver(roundSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      category: "",
      matchingPool: "",
      startDate: "",
      endDate: "",
      applicationStart: "",
      applicationClose: "",
      status: "NOT_STARTED",
      blockchain: "",
      logoUrl: "",
    },
  });

  const onSubmit = async (data: RoundFormData) => {
    try {
      const response = await fetch("/api/rounds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create round");
      }

      const result = await response.json();
      console.log("Round created successfully:", result);
      router.push("/rounds"); // Redirect to rounds page after successful creation
    } catch (error) {
      console.error("Failed to create round:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/rounds"
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Rounds
          </Link>
          <h1 className="text-4xl font-bold mt-4">Create a Funding Round</h1>
          <p className="text-gray-600 mt-2">
            Set up a new quadratic funding round to support projects in your
            ecosystem.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Round Details</CardTitle>
            <CardDescription>
              Fill in the details for your new funding round.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Round Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Web3 Infrastructure Round"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A clear and descriptive title for your funding round.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the goals and focus areas of this funding round..."
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Explain what types of projects you&apos;re looking to
                        fund and what impact you hope to achieve.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <div>
                        <Select
                          onValueChange={(value) => {
                            const currentTags = field.value || []; // Ensure it's an array
                            const newTags = currentTags.includes(value)
                              ? currentTags.filter((tag) => tag !== value) // Remove tag if already selected
                              : [...currentTags, value]; // Add tag if not selected
                            field.onChange(newTags);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tags" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Infrastructure">
                              Infrastructure
                            </SelectItem>
                            <SelectItem value="Community">Community</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Research">Research</SelectItem>
                            <SelectItem value="Development">
                              Development
                            </SelectItem>
                            {/* Add more default tags as needed */}
                          </SelectContent>
                        </Select>
                        <div className="mt-2">
                          {(field.value || []).map(
                            (
                              tag // Ensure it's an array for mapping
                            ) => (
                              <span
                                key={tag}
                                className="inline-block bg-gray-200 rounded-full px-2 py-1 mr-2 flex items-center"
                              >
                                {tag}
                                <button
                                  type="button"
                                  className="ml-1 text-red-500"
                                  onClick={() => {
                                    const currentTags = field.value || [];
                                    field.onChange(
                                      currentTags.filter((t) => t !== tag)
                                    ); // Remove the tag
                                  }}
                                >
                                  &times; {/* Cross mark for removal */}
                                </button>
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <FormDescription>
                        Select multiple tags or create new ones.
                      </FormDescription>
                      <FormMessage />
                      <Input
                        placeholder="Add new tag"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.currentTarget.value) {
                            const newTag = e.currentTarget.value;
                            const currentTags = field.value || []; // Ensure it's an array
                            if (!currentTags.includes(newTag)) {
                              field.onChange([...currentTags, newTag]);
                            }
                            e.currentTarget.value = ""; // Clear input after adding
                          }
                        }}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Development">
                            Development
                          </SelectItem>
                          <SelectItem value="Infrastructure">
                            Infrastructure
                          </SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Community">Community</SelectItem>
                          <SelectItem value="Research">Research</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The main category this round falls under.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="matchingPool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matching Pool (USDC)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="1000" {...field} />
                      </FormControl>
                      <FormDescription>
                        The total amount of funds available for matching in this
                        round.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          When the round will start accepting applications.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          When the round will stop accepting contributions.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="applicationStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        When the application period starts.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicationClose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Close Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        When the application period ends.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "NOT_STARTED"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NOT_STARTED">
                            Not Started
                          </SelectItem>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="CLOSED">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The current status of the funding round.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="blockchain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blockchain</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Ethereum" {...field} />
                      </FormControl>
                      <FormDescription>
                        Specify the blockchain for this funding round.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., https://example.com/logo.png"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a URL for the rounds logo.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/rounds")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Round</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
