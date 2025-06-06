/**
 * Loading skeleton component for Stripe payment form
 * Displays animated placeholders while Stripe Elements load
 */
export function StripeFormSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="space-y-2">
        <div className="h-4 w-1/4 rounded bg-gray-200"></div>
        <div className="h-10 rounded bg-gray-200"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-1/3 rounded bg-gray-200"></div>
        <div className="h-10 rounded bg-gray-200"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-1/4 rounded bg-gray-200"></div>
        <div className="h-10 rounded bg-gray-200"></div>
      </div>
      <div className="mt-4 h-10 rounded bg-gray-300"></div>
    </div>
  );
}
