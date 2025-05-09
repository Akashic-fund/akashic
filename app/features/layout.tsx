'use client';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

export default function RoadmapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MantineProvider>{children}</MantineProvider>;
}
