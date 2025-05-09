import { useState, useEffect } from 'react';

function formatTimestamp(timestamp: string) {
  return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
}

export function FormattedDate({ timestamp }: { timestamp?: string }) {
  const [formatted, setFormatted] = useState('Loading...');

  useEffect(() => {
    // use a effect to avoid ssr/hydration issues
    if (typeof timestamp === 'string' && parseInt(timestamp) > 0) {
      setFormatted(formatTimestamp(timestamp));
    }
  }, [timestamp]);
  if (formatted) {
    return <span>{formatted}</span>;
  }
  return <span>Loading...</span>;
}
