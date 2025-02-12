export interface Round {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  matchingPool: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "NOT_STARTED" | "CLOSED";
  logoUrl: string;
  campaigns?: string[]; // Array of campaign addresses in this round
}
