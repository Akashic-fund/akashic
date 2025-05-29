import { useState, useEffect } from 'react';
import { format } from 'date-fns';

function formatTimestamp(timestamp: string) {
  return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
}

export function FormattedDate({
  timestamp,
  date,
}: {
  timestamp?: string;
  date?: Date | string;
}) {
  const [formatted, setFormatted] = useState('Loading...');

  useEffect(() => {
    // use a effect to avoid ssr/hydration issues
    try {
      if (typeof date === 'string') {
        setFormatted(format(new Date(date), 'dd/MM/yyyy, HH:mm:ss'));
        return;
      }
      if (date instanceof Date) {
        setFormatted(format(date, 'dd/MM/yyyy, HH:mm:ss'));
        return;
      }
      if (typeof timestamp === 'string' && parseInt(timestamp) > 0) {
        setFormatted(formatTimestamp(timestamp));
      }
    } catch (error) {
      console.error(error, { date, timestamp });
    }
  }, [timestamp, date]);
  return <span>{formatted}</span>;
}
