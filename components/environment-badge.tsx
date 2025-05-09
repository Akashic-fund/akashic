'use client';

import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

export function EnvironmentBadge() {
  const [env, setEnv] = useState<string>('development');
  const [gitInfo, setGitInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const gitRef = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF;
    const gitSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
    const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;

    // Ensure we do not display placeholder values such as "$VERCEL_GIT_COMMIT_REF"
    const sanitizedGitRef =
      gitRef && gitRef !== '$VERCEL_GIT_COMMIT_REF' ? gitRef : null;
    const sanitizedGitSha =
      gitSha && gitSha !== '$VERCEL_GIT_COMMIT_SHA' ? gitSha.slice(0, 7) : null;

    const displayInfo = sanitizedGitRef || sanitizedGitSha || '';

    setEnv(vercelEnv || 'development');
    setGitInfo(displayInfo);
    setIsLoading(false);
  }, []);

  const getColor = () => {
    switch (env) {
      case 'production':
        return 'bg-green-600 hover:bg-green-700';
      case 'preview':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  if (isLoading) return null;

  return (
    <Badge
      className={`${getColor()} fixed bottom-4 right-4 z-50 transition-colors duration-200`}
    >
      {env.toUpperCase()} {gitInfo && `(${gitInfo})`}
    </Badge>
  );
}
