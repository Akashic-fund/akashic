/**
 * DonationSummary - Displays breakdown of donation amounts
 * Responsible for: Campaign donation amount, platform donation, total calculation display
 */

interface DonationSummaryProps {
  campaignTitle: string;
  poolAmount: number;
  platformAmount: number;
  totalAmount: number;
  isDonatingToPlatform: boolean;
  percentage: number;
  // formatCrypto is passed but not used - we format all amounts as USD internally
  formatCrypto?: (value: number) => string;
}

export function DonationSummary({
  campaignTitle,
  poolAmount,
  platformAmount,
  totalAmount,
  isDonatingToPlatform,
  percentage,
  formatCrypto, // Optional - not used but maintained for interface compatibility
}: DonationSummaryProps) {
  if (totalAmount <= 0) {
    return null;
  }

  // Format all amounts consistently as USD since they're dollar-denominated
  const formatAmount = (value: number) => `$${value.toFixed(2)}`;

  return (
    <div className="space-y-3 rounded-lg bg-muted/50 p-4">
      <div className="flex justify-between text-sm">
        <span>Donating to {campaignTitle}</span>
        <span className="font-medium">{formatAmount(poolAmount)}</span>
      </div>

      {isDonatingToPlatform && (
        <div className="flex justify-between text-sm">
          <span>Donating {percentage}% to Akashic</span>
          <span className="font-medium">{formatAmount(platformAmount)}</span>
        </div>
      )}

      <div className="flex justify-between border-t pt-2 text-sm font-semibold">
        <span>Total donation</span>
        <span>{formatAmount(totalAmount)}</span>
      </div>
    </div>
  );
}
