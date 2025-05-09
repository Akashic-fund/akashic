'use client';

import { Timeline, Text, Paper, Group, RingProgress } from '@mantine/core';
import {
  IconGitCommit,
  IconGitPullRequest,
  IconStar,
  IconShare,
  IconSearch,
  IconCreditCard,
  IconMessage,
  IconPhoto,
  IconUserCircle,
  IconBuildingStore,
  IconRocket,
} from '@tabler/icons-react';
import Link from 'next/link';

const launchDateString = '2025-04-15';
export default function RoadmapPage() {
  // Calculate days until launch (March 21, 2025)
  const launchDate = new Date(launchDateString);
  const today = new Date();
  const daysUntilLaunch = Math.ceil(
    (launchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  const progressPercentage = Math.max(
    0,
    Math.min(100, ((365 - daysUntilLaunch) / 365) * 100),
  );

  return (
    <div className="mx-auto max-w-4xl p-8">
      <Paper
        shadow="sm"
        p="xl"
        radius="md"
        className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50"
      >
        <Group justify="space-between" align="center">
          <div>
            <Text size="xl" fw={700} className="text-blue-900">
              Launch Countdown
            </Text>
            <Text size="lg" c="dimmed" mt={4}>
              {daysUntilLaunch === 0
                ? 'Launching today! 🚀'
                : daysUntilLaunch < 0
                  ? 'Project is live! 🎉'
                  : `${daysUntilLaunch} days until launch`}
            </Text>
          </div>
          <RingProgress
            size={120}
            thickness={12}
            roundCaps
            sections={[{ value: progressPercentage, color: 'blue' }]}
            label={<IconRocket size={32} style={{ color: '#1e3a8a' }} />}
          />
        </Group>
      </Paper>

      <h1 className="mb-8 text-3xl font-bold">Project Roadmap</h1>

      <Timeline active={17} bulletSize={24} lineWidth={2}>
        <Timeline.Item
          bullet={<IconGitCommit size={12} />}
          title="Project Initialization"
        >
          <Text c="dimmed" size="sm">
            November 22, 2024
          </Text>
          <Text size="sm" mt={4}>
            Initial project setup with Next.js and basic component structure
          </Text>
        </Timeline.Item>

        <Timeline.Item
          bullet={<IconUserCircle size={12} />}
          title="Wallet Integration"
        >
          <Text c="dimmed" size="sm">
            December 5-9, 2024
          </Text>
          <Text size="sm" mt={4}>
            Integrated Privy wallet and Celo network support
          </Text>
        </Timeline.Item>

        <Timeline.Item
          bullet={<IconBuildingStore size={12} />}
          title="Campaign Dashboard"
        >
          <Text c="dimmed" size="sm">
            December 23rd, 2024
          </Text>
          <Text size="sm" mt={4}>
            Display campaign dashboard for users to manage their campaigns
          </Text>
        </Timeline.Item>

        <Timeline.Item
          bullet={<IconBuildingStore size={12} />}
          title="Campaign Management"
        >
          <Text c="dimmed" size="sm">
            December 12-20, 2024
          </Text>
          <Text size="sm" mt={4}>
            Implemented campaign creation, listing, and management features
          </Text>
        </Timeline.Item>

        <Timeline.Item
          bullet={<IconBuildingStore size={12} />}
          title="Campaign Persistence"
        >
          <Text c="dimmed" size="sm">
            January 1st, 2025
          </Text>
          <Text size="sm" mt={4}>
            Save campaign meta-data in a database
          </Text>
        </Timeline.Item>

        <Timeline.Item
          bullet={<IconBuildingStore size={12} />}
          title="Campaign Persistence"
        >
          <Text c="dimmed" size="sm">
            January 6th, 2025
          </Text>
          <Text size="sm" mt={4}>
            Donate to a campaign
          </Text>
        </Timeline.Item>

        <Timeline.Item
          bullet={<IconBuildingStore size={12} />}
          title="Admin page"
        >
          <Text c="dimmed" size="sm">
            January 12th, 2025
          </Text>
          <Text size="sm" mt={4}>
            Admin can administer campaigns
          </Text>
        </Timeline.Item>

        <Timeline.Item
          bullet={<IconBuildingStore size={12} />}
          title="Campaign images"
        >
          <Text c="dimmed" size="sm">
            January 14th, 2025
          </Text>
          <Text size="sm" mt={4}>
            Campaign images can be uploaded
          </Text>
        </Timeline.Item>

        <Timeline.Item
          bullet={<IconBuildingStore size={12} />}
          title="User dashboard"
        >
          <Text c="dimmed" size="sm">
            January 14th, 2025
          </Text>
          <Text size="sm" mt={4}>
            User can view / edit their campaigns
          </Text>
        </Timeline.Item>

        <Timeline.Item
          bullet={<IconMessage size={12} />}
          title="Social Features"
        >
          <Text c="dimmed" size="sm">
            January 21-23, 2025
          </Text>
          <Text size="sm" mt={4}>
            Added commenting system and campaign interaction features
          </Text>
        </Timeline.Item>

        <Timeline.Item
          bullet={<IconMessage size={12} />}
          title="Campaign details page"
        >
          <Text c="dimmed" size="sm">
            January 22, 2025
          </Text>
          <Text size="sm" mt={4}>
            Campaign details page
          </Text>
        </Timeline.Item>

        <Timeline.Item
          bullet={<IconMessage size={12} />}
          title="Social commenting"
        >
          <Text c="dimmed" size="sm">
            January 26, 2025
          </Text>
          <Text size="sm" mt={4}>
            Social commenting on campaigns
          </Text>
        </Timeline.Item>

        <Timeline.Item
          bullet={<IconCreditCard size={12} />}
          title="Credit Card Payment Integration"
        >
          <Text c="dimmed" size="sm">
            February 18-24, 2025
          </Text>
          <Text size="sm" mt={4}>
            Integrated payment systems with token support and Stripe integration
          </Text>
        </Timeline.Item>

        <Timeline.Item
          bullet={<IconSearch size={12} />}
          title="Search & Discovery"
        >
          <Text c="dimmed" size="sm">
            February 19-21, 2025
          </Text>
          <Text size="sm" mt={4}>
            Implemented campaign search functionality
          </Text>
        </Timeline.Item>

        <Timeline.Item bullet={<IconShare size={12} />} title="Social Sharing">
          <Text c="dimmed" size="sm">
            March 17, 2025
          </Text>
          <Text size="sm" mt={4}>
            Added social sharing capabilities and URL improvements
          </Text>
        </Timeline.Item>

        <Timeline.Item
          bullet={<IconPhoto size={12} />}
          title={
            <Link
              href="/collections"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Collections Feature
            </Link>
          }
        >
          <Text c="dimmed" size="sm">
            March 18-19, 2025
          </Text>
          <Text size="sm" mt={4}>
            Implemented collections page and database integration
          </Text>
        </Timeline.Item>

        <Timeline.Item bullet={<IconStar size={12} />} title="Favorites System">
          <Text c="dimmed" size="sm">
            March 20-21, 2025
          </Text>
          <Text size="sm" mt={4}>
            Added favorite campaign functionality
          </Text>
        </Timeline.Item>
        <Timeline.Item
          title="Quadratic Funding"
          bullet={<IconGitPullRequest size={12} />}
        >
          <Text c="dimmed" size="sm">
            <Text variant="link" component="span" inherit>
              Today
            </Text>{' '}
          </Text>
          <Text size="xs" mt={4}>
            Currently deployed on staging
          </Text>
        </Timeline.Item>
        <Timeline.Item
          title="MVP launch"
          bullet={<IconGitPullRequest size={12} />}
        >
          <Text c="dimmed" size="sm">
            <Text variant="link" component="span" inherit>
              {launchDateString}
            </Text>{' '}
          </Text>
          <Text size="xs" mt={4}>
            Currently deployed on staging
          </Text>
        </Timeline.Item>
      </Timeline>
    </div>
  );
}
