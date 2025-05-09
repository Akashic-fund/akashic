import { type ReactNode } from 'react';
export function PageHome({
  header,
  children,
}: {
  header: ReactNode;
  children: ReactNode;
}) {
  // flex flex-col items-center justify-center
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      {header}
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
