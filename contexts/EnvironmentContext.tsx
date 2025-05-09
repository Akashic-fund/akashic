'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from 'react';

type Environment = 'production' | 'preview' | 'development';

interface EnvironmentContextType {
  environment: Environment;
  isProduction: boolean;
  isPreview: boolean;
  isDevelopment: boolean;
  gitBranch: string;
}

const EnvironmentContext = createContext<EnvironmentContextType>({
  environment: 'development',
  isProduction: false,
  isPreview: false,
  isDevelopment: true,
  gitBranch: 'local',
});

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [environment, setEnvironment] = useState<Environment>('development');
  const [gitBranch, setGitBranch] = useState<string>('local');

  useEffect(() => {
    // Get environment from Vercel
    const env =
      (process.env.NEXT_PUBLIC_VERCEL_ENV as Environment) || 'development';
    const branch = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || 'local';

    setEnvironment(env);
    setGitBranch(branch);
  }, []);

  const value = {
    environment,
    isProduction: environment === 'production',
    isPreview: environment === 'preview',
    isDevelopment: environment === 'development',
    gitBranch,
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export const useEnvironment = () => useContext(EnvironmentContext);
