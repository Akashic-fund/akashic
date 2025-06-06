/**
 * DonationToggle - Handles optional platform donation
 * Responsible for: Toggle switch, percentage selection, tooltip information
 */

import {
  Button,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import { HelpCircle } from 'lucide-react';

interface DonationToggleProps {
  isDonatingToPlatform: boolean;
  onToggleChange: (enabled: boolean) => void;
  percentage: number;
  onPercentageChange: (percentage: number) => void;
  percentageOptions?: number[];
}

const DEFAULT_PERCENTAGE_OPTIONS = [5, 10, 15, 20];

export function DonationToggle({
  isDonatingToPlatform,
  onToggleChange,
  percentage,
  onPercentageChange,
  percentageOptions = DEFAULT_PERCENTAGE_OPTIONS,
}: DonationToggleProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Switch
          checked={isDonatingToPlatform}
          onCheckedChange={onToggleChange}
          aria-label="Include platform donation"
        />
        <span className="text-sm font-medium">Also donate to Akashic</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Support Akashic&apos;s platform development</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {isDonatingToPlatform && (
        <div
          className="flex gap-2"
          role="group"
          aria-label="Platform donation percentage"
        >
          {percentageOptions.map((value) => (
            <Button
              key={value}
              variant={percentage === value ? 'default' : 'outline'}
              onClick={() => onPercentageChange(value)}
              className="flex-1"
              size="sm"
              aria-pressed={percentage === value}
            >
              {value}%
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
