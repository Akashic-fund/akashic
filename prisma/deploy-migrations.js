#!/usr/bin/env node

/**
 * Production Migration Script for Vercel Deployment
 *
 * This script:
 * 1. Checks if there are pending migrations
 * 2. Runs migrations if needed during deployment
 * 3. Handles errors gracefully
 *
 * Note: Prisma client generation is handled by postinstall hook
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isVercelBuild = process.env.VERCEL === '1';
const vercelEnv = process.env.VERCEL_ENV;
const databaseUrl = process.env.DATABASE_URL;

console.log('🚀 Migration script starting...');
console.log(
  `Environment: ${process.env.NODE_ENV || 'unknown'} | Vercel: ${vercelEnv || 'local'}`,
);

async function runCommand(command, description) {
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: projectRoot,
      env: { ...process.env },
      timeout: 15000, // 15 second timeout
    });

    if (stdout) console.log(stdout);
    if (stderr && !stderr.includes('warning')) {
      console.warn('⚠️  Warning:', stderr);
    }

    return { success: true, stdout, stderr };
  } catch (error) {
    console.error(`❌ ${description} failed:`);
    console.error(error.message);
    if (error.stdout) console.error('STDOUT:', error.stdout);
    if (error.stderr) console.error('STDERR:', error.stderr);
    return { success: false, error };
  }
}

async function checkMigrationStatus() {
  console.log('🔍 Checking migration status...');

  const result = await runCommand(
    'pnpm exec prisma migrate status --schema=./prisma/schema.prisma',
    'Checking migration status',
  );

  // Check if output indicates migration mismatch
  const stderr = result.stderr?.toLowerCase() || '';
  const stdout = result.stdout?.toLowerCase() || '';

  const hasMismatch =
    stderr.includes('migration history') ||
    stderr.includes('different') ||
    stderr.includes('not found locally') ||
    stdout.includes('migration history') ||
    stdout.includes('different');

  if (hasMismatch) {
    return {
      needsMigration: true,
      hasMismatch: true,
      reason: 'migration mismatch detected',
      output: result.stdout || result.stderr,
    };
  }

  if (!result.success) {
    // If migrate status fails for other reasons, assume we need to deploy migrations
    return {
      needsMigration: true,
      hasMismatch: false,
      reason: 'migrate status command failed',
    };
  }

  // Check if output indicates pending migrations
  const hasPendingMigrations =
    stdout.includes('pending') ||
    stdout.includes('not yet applied') ||
    stdout.includes('database is not up to date') ||
    stdout.includes('following migration') ||
    stdout.includes('drift');

  return {
    needsMigration: hasPendingMigrations,
    hasMismatch: false,
    reason: hasPendingMigrations
      ? 'pending migrations detected'
      : 'database up to date',
    output: result.stdout,
  };
}

async function runMigrations(force = false) {
  const forceFlag = force ? ' --force' : '';
  const result = await runCommand(
    `pnpm exec prisma migrate deploy${forceFlag} --schema=./prisma/schema.prisma`,
    'Migration deployment',
  );

  if (!result.success) {
    throw new Error('Migration deployment failed');
  }

  return result;
}

async function main() {
  try {
    // Skip in local development unless explicitly requested
    if (isDevelopment && !process.env.FORCE_PRODUCTION_MIGRATIONS) {
      console.log(
        '⏭️  Skipping migrations in development (use "pnpm dev:db" for local migrations)',
      );
      return;
    }

    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Check migration status (this also validates database connectivity)
    const migrationStatus = await checkMigrationStatus();

    if (migrationStatus.hasMismatch) {
      console.log(
        '⚠️  Migration mismatch detected - forcing migration deployment',
      );
      await runMigrations(true);
      console.log('✅ Migrations applied successfully');
      return;
    }

    if (migrationStatus.needsMigration) {
      console.log('🔄 Running pending migrations...');
      await runMigrations();
      console.log('✅ Migrations completed');
    } else {
      console.log('✅ Database up to date');
    }
  } catch (error) {
    console.error('💥 Migration failed:', error.message);

    // In Vercel builds, we want to fail the deployment if migrations fail
    if (isVercelBuild) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the main function
main();
