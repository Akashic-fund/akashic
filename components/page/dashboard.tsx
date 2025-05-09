import { type ReactNode } from 'react';
export function PageDashboard({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <div className="mx-auto max-w-7xl p-5">
        <div className="mb-8 pt-5 text-3xl font-bold">Dashboard</div>
        {children}
      </div>
    </div>
  );
}
