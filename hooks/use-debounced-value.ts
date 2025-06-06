import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values to optimize form validation performance
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timeout if value changes (also on component unmount)
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debounced input validation
 * @param value - The input value to validate
 * @param validator - Validation function that returns error message or null
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 * @returns Object with validation state
 */
export function useDebouncedValidation(
  value: string,
  validator: (value: string) => string | null,
  delay: number = 300,
) {
  const debouncedValue = useDebouncedValue(value, delay);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (value !== debouncedValue) {
      setIsValidating(true);
      return;
    }

    setIsValidating(false);
    const validationError = validator(debouncedValue);
    setError(validationError);
  }, [debouncedValue, value, validator]);

  return {
    error,
    isValidating,
    isValid: !error && !isValidating,
  };
}
