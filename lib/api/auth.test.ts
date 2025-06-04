import { describe, test, vi, expect, afterEach } from 'vitest';
import { auth } from '@/server/auth';
import { checkAuth } from './auth';
import { ApiAuthError } from './error';
import { Session } from 'next-auth';

vi.mock('@/server/auth', () => ({
  auth: vi.fn(),
}));
function mockSession(roles: string[]) {
  return {
    user: { dbId: 0, address: '0x0', roles },
    roles,
    expires: 'never',
  };
}
function mockAuth(roles: string[]) {
  return async () => mockSession(roles);
}
afterEach(() => {
  vi.restoreAllMocks();
});
describe('checkAuth', () => {
  test('no session - no role requested', async () => {
    vi.mocked(
      auth as unknown as () => Promise<Session | null>,
    ).mockImplementation(async () => {
      return null;
    });
    await expect(checkAuth([])).rejects.toThrow();
  });
  test('no session - role requested', async () => {
    vi.mocked(
      auth as unknown as () => Promise<Session | null>,
    ).mockImplementation(async () => {
      return null;
    });
    await expect(checkAuth(['admin'])).rejects.toThrow(ApiAuthError);
  });
  test('user session - user role requested', async () => {
    vi.mocked(
      auth as unknown as () => Promise<Session | null>,
    ).mockImplementation(mockAuth(['user']));
    await expect(checkAuth(['user'])).resolves.toEqual(mockSession(['user']));
  });
  test('user session - non-user-role role requested', async () => {
    vi.mocked(
      auth as unknown as () => Promise<Session | null>,
    ).mockImplementation(mockAuth(['user']));
    await expect(checkAuth(['admin'])).rejects.toThrow(ApiAuthError);
  });
  test('admin session - user role requested', async () => {
    vi.mocked(
      auth as unknown as () => Promise<Session | null>,
    ).mockImplementation(mockAuth(['user', 'admin']));
    await expect(checkAuth(['user'])).resolves.toEqual(
      mockSession(['user', 'admin']),
    );
  });
  test('admin session - non-user-role role requested', async () => {
    vi.mocked(
      auth as unknown as () => Promise<Session | null>,
    ).mockImplementation(mockAuth(['user', 'admin']));
    await expect(checkAuth(['admin'])).resolves.toEqual(
      mockSession(['user', 'admin']),
    );
  });
});
