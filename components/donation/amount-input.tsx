/**
 * AmountInput - Handles donation amount selection and validation
 * Responsible for: Suggested amounts, custom input, validation feedback, currency selection
 */

import { useCallback } from 'react';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import { HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';

interface ValidationResult {
  error: string | null;
  isValidating: boolean;
  isValid: boolean;
}

interface AmountInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
  paymentMethod: 'wallet' | 'card';
  selectedToken: string;
  onTokenChange: (token: string) => void;
  validation: ValidationResult;
  availableBalance: string;
  formatUSD: (value: number) => string;
  numericAmount: number;
  suggestedAmounts?: number[];
}

const DEFAULT_SUGGESTED_AMOUNTS = [25, 50, 100, 250, 500];

export function AmountInput({
  amount,
  onAmountChange,
  paymentMethod,
  selectedToken,
  onTokenChange,
  validation,
  availableBalance,
  formatUSD,
  numericAmount,
  suggestedAmounts = DEFAULT_SUGGESTED_AMOUNTS,
}: AmountInputProps) {
  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onAmountChange(e.target.value);
    },
    [onAmountChange],
  );

  const handleSuggestedAmount = useCallback(
    (suggestedAmount: number) => {
      onAmountChange(suggestedAmount.toString());
    },
    [onAmountChange],
  );

  return (
    <div className="space-y-4">
      {/* Suggested amounts */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">
          Quick amounts:
        </label>
        <div className="grid grid-cols-5 gap-2">
          {suggestedAmounts.map((suggestedAmount) => (
            <Button
              key={suggestedAmount}
              variant={
                amount === suggestedAmount.toString() ? 'default' : 'outline'
              }
              onClick={() => handleSuggestedAmount(suggestedAmount)}
              className="text-sm"
              size="sm"
            >
              ${suggestedAmount}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom amount input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Or enter a custom amount:
        </label>
        <div className="relative">
          <div className="flex rounded-md border shadow-sm">
            <div className="relative flex flex-1">
              <Select
                value={paymentMethod === 'wallet' ? selectedToken : 'USD'}
                onValueChange={onTokenChange}
                disabled={paymentMethod === 'card'}
              >
                <SelectTrigger className="w-[120px] rounded-r-none border-0 bg-muted">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethod === 'wallet' ? (
                    <SelectItem value="USDC">USDC</SelectItem>
                  ) : (
                    <SelectItem value="USD">USD</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                className="rounded-l-none border-0 border-l"
                placeholder="0.00"
                min="1"
                max="10000"
                step="0.01"
                aria-label="Donation amount"
              />
            </div>
            {paymentMethod === 'wallet' && numericAmount > 0 && (
              <div className="flex items-center px-3 text-sm text-muted-foreground">
                {formatUSD(numericAmount)}
              </div>
            )}
          </div>

          {/* Validation feedback */}
          {validation.isValidating && (
            <div className="mt-1 flex items-center gap-1 text-sm text-blue-600">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              <span>Validating...</span>
            </div>
          )}

          {validation.error && (
            <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{validation.error}</span>
            </div>
          )}

          {validation.isValid && numericAmount > 0 && (
            <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Amount looks good!</span>
            </div>
          )}
        </div>

        {/* Available balance for wallet payments */}
        {paymentMethod === 'wallet' && (
          <div className="mt-1 text-sm text-muted-foreground">
            Available: {availableBalance} {selectedToken}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="ml-1 inline h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your available balance in {selectedToken}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}
