import { Component, ReactNode, ErrorInfo } from 'react';

/**
 * Error fallback component for payment form failures
 * Displays user-friendly error message with retry option
 */
export function PaymentErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-red-800">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <h3 className="font-medium">Payment form error</h3>
      </div>
      <p className="mb-3 text-sm text-red-700">
        Failed to load the payment form. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="rounded-md bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}

/**
 * Error boundary for payment form components
 * Catches and handles React component errors gracefully
 */
export class PaymentErrorBoundary extends Component<
  { children: ReactNode; onRetry: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; onRetry: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Payment form error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <PaymentErrorFallback
          onRetry={() => {
            this.setState({ hasError: false });
            this.props.onRetry();
          }}
        />
      );
    }

    return this.props.children;
  }
}
