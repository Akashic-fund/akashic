import { describe, test, vi, expect, beforeEach, afterEach } from 'vitest';
import { GET, DELETE } from './route';
import { auth } from '@/server/auth';
import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import { getCampaign } from '@/lib/api/campaigns';
import { listPayments } from '@/lib/api/payments';
import {
  ApiAuthNotAllowed,
  ApiParameterError,
  ApiNotFoundError,
} from '@/lib/api/error';
import { Session } from 'next-auth';

// Mock Next.js server
vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: { status?: number }) => ({
      json: async () => data,
      status: init?.status || 200,
    }),
  },
}));

// Mock dependencies
vi.mock('@/server/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/server/db', () => ({
  db: {
    campaign: {
      findUnique: vi.fn(),
    },
    payment: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('@/lib/api/auth', () => ({
  checkAuth: vi.fn(),
}));

vi.mock('@/lib/api/campaigns', () => ({
  getCampaign: vi.fn(),
}));

vi.mock('@/lib/api/payments', () => ({
  listPayments: vi.fn(),
}));

vi.mock('@/lib/constant', () => ({
  IS_PRODUCTION: false,
}));

// Helper functions
function mockSession(address: string, roles: string[] = []): Session {
  return {
    user: { dbId: 1, address, roles },
    expires: 'never',
  } as Session;
}

function createMockRequest(url: string): Request {
  return new Request(url);
}

function createMockParams(campaignId: string) {
  return {
    params: Promise.resolve({ campaignId }),
  };
}

describe('GET /api/campaigns/[campaignId]/payments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Parameter validation', () => {
    test('should throw ApiParameterError when campaignId is invalid', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/invalid/payments');
      const params = createMockParams('invalid');

      vi.mocked(auth).mockResolvedValue(null);

      const response = await GET(req, params);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    test('should throw ApiParameterError when campaignId is 0', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/0/payments');
      const params = createMockParams('0');

      vi.mocked(auth).mockResolvedValue(null);

      const response = await GET(req, params);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    test('should throw ApiParameterError when pageSize exceeds 10', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments?pageSize=11');
      const params = createMockParams('1');

      vi.mocked(auth).mockResolvedValue(null);
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'ACTIVE',
      } as any);

      const response = await GET(req, params);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('Campaign not found', () => {
    test('should throw ApiNotFoundError when campaign does not exist', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/999/payments');
      const params = createMockParams('999');

      vi.mocked(auth).mockResolvedValue(null);
      vi.mocked(getCampaign).mockResolvedValue(null);

      const response = await GET(req, params);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(getCampaign).toHaveBeenCalledWith(999);
    });
  });

  describe('Access control for ACTIVE campaigns', () => {
    test('should allow unauthenticated users to view payments for ACTIVE campaigns', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      const params = createMockParams('1');

      const mockPaymentsResponse = {
        payments: [
          { id: 1, amount: 100, token: 'USDC' },
          { id: 2, amount: 200, token: 'USDT' },
        ],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
          totalItems: 2,
          hasMore: false,
        },
      };

      vi.mocked(auth).mockResolvedValue(null);
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'ACTIVE',
        creatorAddress: '0xCreator',
      } as any);
      vi.mocked(listPayments).mockResolvedValue(mockPaymentsResponse as any);

      const response = await GET(req, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPaymentsResponse);
      expect(listPayments).toHaveBeenCalledWith({
        campaignId: 1,
        admin: false,
        page: 1,
        pageSize: 10,
        skip: 0,
      });
    });

    test('should allow authenticated non-admin users to view payments for ACTIVE campaigns', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      const params = createMockParams('1');

      const mockPaymentsResponse = {
        payments: [{ id: 1, amount: 100, token: 'USDC' }],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
          totalItems: 1,
          hasMore: false,
        },
      };

      vi.mocked(auth).mockResolvedValue(mockSession('0xUser', ['user']));
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'ACTIVE',
        creatorAddress: '0xCreator',
      } as any);
      vi.mocked(listPayments).mockResolvedValue(mockPaymentsResponse as any);

      const response = await GET(req, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPaymentsResponse);
      expect(listPayments).toHaveBeenCalledWith({
        campaignId: 1,
        admin: false,
        page: 1,
        pageSize: 10,
        skip: 0,
      });
    });

    test('should allow admin users to view payments with admin flag for ACTIVE campaigns', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      const params = createMockParams('1');

      const mockPaymentsResponse = {
        payments: [
          { id: 1, amount: 100, token: 'USDC', status: 'confirmed' },
          { id: 2, amount: 50, token: 'USDT', status: 'pending' },
        ],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
          totalItems: 2,
          hasMore: false,
        },
      };

      vi.mocked(auth).mockResolvedValue(mockSession('0xAdmin', ['admin']));
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'ACTIVE',
        creatorAddress: '0xCreator',
      } as any);
      vi.mocked(listPayments).mockResolvedValue(mockPaymentsResponse as any);

      const response = await GET(req, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPaymentsResponse);
      expect(listPayments).toHaveBeenCalledWith({
        campaignId: 1,
        admin: true,
        page: 1,
        pageSize: 10,
        skip: 0,
      });
    });
  });

  describe('Access control for non-ACTIVE campaigns', () => {
    test('should deny unauthenticated users access to DRAFT campaign payments', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      const params = createMockParams('1');

      vi.mocked(auth).mockResolvedValue(null);
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'DRAFT',
        creatorAddress: '0xCreator',
      } as any);

      const response = await GET(req, params);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });

    test('should deny non-owner authenticated users access to DRAFT campaign payments', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      const params = createMockParams('1');

      vi.mocked(auth).mockResolvedValue(mockSession('0xOtherUser', ['user']));
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'DRAFT',
        creatorAddress: '0xCreator',
      } as any);

      const response = await GET(req, params);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });

    test('should allow campaign owner to access DRAFT campaign payments', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      const params = createMockParams('1');

      const mockPaymentsResponse = {
        payments: [{ id: 1, amount: 100, token: 'USDC' }],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
          totalItems: 1,
          hasMore: false,
        },
      };

      vi.mocked(auth).mockResolvedValue(mockSession('0xCreator', ['user']));
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'DRAFT',
        creatorAddress: '0xCreator',
      } as any);
      vi.mocked(listPayments).mockResolvedValue(mockPaymentsResponse as any);

      const response = await GET(req, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPaymentsResponse);
    });

    test('should allow admin to access DRAFT campaign payments', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      const params = createMockParams('1');

      const mockPaymentsResponse = {
        payments: [{ id: 1, amount: 100, token: 'USDC' }],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
          totalItems: 1,
          hasMore: false,
        },
      };

      vi.mocked(auth).mockResolvedValue(mockSession('0xAdmin', ['admin']));
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'DRAFT',
        creatorAddress: '0xCreator',
      } as any);
      vi.mocked(listPayments).mockResolvedValue(mockPaymentsResponse as any);

      const response = await GET(req, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPaymentsResponse);
      expect(listPayments).toHaveBeenCalledWith({
        campaignId: 1,
        admin: true,
        page: 1,
        pageSize: 10,
        skip: 0,
      });
    });

    test('should deny access to PENDING_APPROVAL campaign for non-owner', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      const params = createMockParams('1');

      vi.mocked(auth).mockResolvedValue(mockSession('0xOtherUser', ['user']));
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'PENDING_APPROVAL',
        creatorAddress: '0xCreator',
      } as any);

      const response = await GET(req, params);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });

    test('should deny access to DISABLED campaign for non-owner', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      const params = createMockParams('1');

      vi.mocked(auth).mockResolvedValue(mockSession('0xOtherUser', ['user']));
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'DISABLED',
        creatorAddress: '0xCreator',
      } as any);

      const response = await GET(req, params);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });

    test('should allow owner to access COMPLETED campaign payments', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      const params = createMockParams('1');

      const mockPaymentsResponse = {
        payments: [{ id: 1, amount: 100, token: 'USDC' }],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
          totalItems: 1,
          hasMore: false,
        },
      };

      vi.mocked(auth).mockResolvedValue(mockSession('0xCreator', ['user']));
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'COMPLETED',
        creatorAddress: '0xCreator',
      } as any);
      vi.mocked(listPayments).mockResolvedValue(mockPaymentsResponse as any);

      const response = await GET(req, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPaymentsResponse);
    });
  });

  describe('Pagination parameters', () => {
    test('should use default pagination values when not provided', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      const params = createMockParams('1');

      const mockPaymentsResponse = {
        payments: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalPages: 0,
          totalItems: 0,
          hasMore: false,
        },
      };

      vi.mocked(auth).mockResolvedValue(null);
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'ACTIVE',
        creatorAddress: '0xCreator',
      } as any);
      vi.mocked(listPayments).mockResolvedValue(mockPaymentsResponse as any);

      const response = await GET(req, params);

      expect(response.status).toBe(200);
      expect(listPayments).toHaveBeenCalledWith({
        campaignId: 1,
        admin: false,
        page: 1,
        pageSize: 10,
        skip: 0,
      });
    });

    test('should use custom pagination values when provided', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments?page=2&pageSize=5');
      const params = createMockParams('1');

      const mockPaymentsResponse = {
        payments: [],
        pagination: {
          currentPage: 2,
          pageSize: 5,
          totalPages: 3,
          totalItems: 15,
          hasMore: true,
        },
      };

      vi.mocked(auth).mockResolvedValue(null);
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'ACTIVE',
        creatorAddress: '0xCreator',
      } as any);
      vi.mocked(listPayments).mockResolvedValue(mockPaymentsResponse as any);

      const response = await GET(req, params);

      expect(response.status).toBe(200);
      expect(listPayments).toHaveBeenCalledWith({
        campaignId: 1,
        admin: false,
        page: 2,
        pageSize: 5,
        skip: 5, // (page - 1) * pageSize = (2 - 1) * 5 = 5
      });
    });

    test('should correctly calculate skip for page 3 with pageSize 10', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments?page=3&pageSize=10');
      const params = createMockParams('1');

      const mockPaymentsResponse = {
        payments: [],
        pagination: {
          currentPage: 3,
          pageSize: 10,
          totalPages: 5,
          totalItems: 50,
          hasMore: true,
        },
      };

      vi.mocked(auth).mockResolvedValue(null);
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'ACTIVE',
        creatorAddress: '0xCreator',
      } as any);
      vi.mocked(listPayments).mockResolvedValue(mockPaymentsResponse as any);

      const response = await GET(req, params);

      expect(response.status).toBe(200);
      expect(listPayments).toHaveBeenCalledWith({
        campaignId: 1,
        admin: false,
        page: 3,
        pageSize: 10,
        skip: 20, // (page - 1) * pageSize = (3 - 1) * 10 = 20
      });
    });

    test('should accept maximum allowed pageSize of 10', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments?pageSize=10');
      const params = createMockParams('1');

      const mockPaymentsResponse = {
        payments: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalPages: 0,
          totalItems: 0,
          hasMore: false,
        },
      };

      vi.mocked(auth).mockResolvedValue(null);
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'ACTIVE',
        creatorAddress: '0xCreator',
      } as any);
      vi.mocked(listPayments).mockResolvedValue(mockPaymentsResponse as any);

      const response = await GET(req, params);

      expect(response.status).toBe(200);
      expect(listPayments).toHaveBeenCalledWith({
        campaignId: 1,
        admin: false,
        page: 1,
        pageSize: 10,
        skip: 0,
      });
    });
  });

  describe('Edge cases', () => {
    test('should handle campaign with no payments', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      const params = createMockParams('1');

      const mockPaymentsResponse = {
        payments: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalPages: 0,
          totalItems: 0,
          hasMore: false,
        },
      };

      vi.mocked(auth).mockResolvedValue(null);
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'ACTIVE',
        creatorAddress: '0xCreator',
      } as any);
      vi.mocked(listPayments).mockResolvedValue(mockPaymentsResponse as any);

      const response = await GET(req, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.payments).toEqual([]);
      expect(data.pagination.totalItems).toBe(0);
    });

    test('should handle missing session.user.address gracefully for non-active campaigns', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      const params = createMockParams('1');

      // Session without address
      vi.mocked(auth).mockResolvedValue({
        user: { dbId: 1, roles: ['user'] },
        expires: 'never',
      } as any);
      vi.mocked(getCampaign).mockResolvedValue({
        id: 1,
        status: 'DRAFT',
        creatorAddress: '0xCreator',
      } as any);

      const response = await GET(req, params);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });

    test('should handle large campaign IDs', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/999999999/payments');
      const params = createMockParams('999999999');

      const mockPaymentsResponse = {
        payments: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalPages: 0,
          totalItems: 0,
          hasMore: false,
        },
      };

      vi.mocked(auth).mockResolvedValue(null);
      vi.mocked(getCampaign).mockResolvedValue({
        id: 999999999,
        status: 'ACTIVE',
        creatorAddress: '0xCreator',
      } as any);
      vi.mocked(listPayments).mockResolvedValue(mockPaymentsResponse as any);

      const response = await GET(req, params);

      expect(response.status).toBe(200);
      expect(getCampaign).toHaveBeenCalledWith(999999999);
    });
  });
});

describe('DELETE /api/campaigns/[campaignId]/payments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authorization', () => {
    test('should require admin role', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      req.json = vi.fn().mockResolvedValue({ paymentId: 1 });
      const params = createMockParams('1');

      vi.mocked(checkAuth).mockRejectedValue(new ApiAuthNotAllowed('Not authorized'));

      const response = await DELETE(req, params);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(checkAuth).toHaveBeenCalledWith(['admin']);
    });

    test('should allow admin users to delete payments', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      req.json = vi.fn().mockResolvedValue({ paymentId: 1 });
      const params = createMockParams('1');

      vi.mocked(checkAuth).mockResolvedValue(mockSession('0xAdmin', ['admin']));
      vi.mocked(db.campaign.findUnique).mockResolvedValue({
        id: 1,
        status: 'ACTIVE',
      } as any);
      vi.mocked(db.payment.findUnique).mockResolvedValue({
        id: 1,
        campaignId: 1,
      } as any);
      vi.mocked(db.payment.delete).mockResolvedValue({} as any);

      const response = await DELETE(req, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(checkAuth).toHaveBeenCalledWith(['admin']);
    });
  });

  describe('Parameter validation', () => {
    test('should throw ApiParameterError when campaignId is invalid', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/invalid/payments');
      req.json = vi.fn().mockResolvedValue({ paymentId: 1 });
      const params = createMockParams('invalid');

      vi.mocked(checkAuth).mockResolvedValue(mockSession('0xAdmin', ['admin']));

      const response = await DELETE(req, params);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    test('should throw ApiParameterError when campaignId is 0', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/0/payments');
      req.json = vi.fn().mockResolvedValue({ paymentId: 1 });
      const params = createMockParams('0');

      vi.mocked(checkAuth).mockResolvedValue(mockSession('0xAdmin', ['admin']));

      const response = await DELETE(req, params);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('Resource validation', () => {
    test('should throw ApiNotFoundError when campaign does not exist', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/999/payments');
      req.json = vi.fn().mockResolvedValue({ paymentId: 1 });
      const params = createMockParams('999');

      vi.mocked(checkAuth).mockResolvedValue(mockSession('0xAdmin', ['admin']));
      vi.mocked(db.campaign.findUnique).mockResolvedValue(null);

      const response = await DELETE(req, params);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(db.campaign.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    test('should throw ApiNotFoundError when payment does not exist', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      req.json = vi.fn().mockResolvedValue({ paymentId: 999 });
      const params = createMockParams('1');

      vi.mocked(checkAuth).mockResolvedValue(mockSession('0xAdmin', ['admin']));
      vi.mocked(db.campaign.findUnique).mockResolvedValue({
        id: 1,
        status: 'ACTIVE',
      } as any);
      vi.mocked(db.payment.findUnique).mockResolvedValue(null);

      const response = await DELETE(req, params);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(db.payment.findUnique).toHaveBeenCalledWith({
        where: { id: 999, campaignId: 1 },
      });
    });

    test('should throw ApiNotFoundError when payment does not belong to campaign', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      req.json = vi.fn().mockResolvedValue({ paymentId: 1 });
      const params = createMockParams('1');

      vi.mocked(checkAuth).mockResolvedValue(mockSession('0xAdmin', ['admin']));
      vi.mocked(db.campaign.findUnique).mockResolvedValue({
        id: 1,
        status: 'ACTIVE',
      } as any);
      // Payment exists but for different campaign - findUnique returns null due to where condition
      vi.mocked(db.payment.findUnique).mockResolvedValue(null);

      const response = await DELETE(req, params);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });
  });

  describe('Successful deletion', () => {
    test('should successfully delete a payment', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      req.json = vi.fn().mockResolvedValue({ paymentId: 1 });
      const params = createMockParams('1');

      vi.mocked(checkAuth).mockResolvedValue(mockSession('0xAdmin', ['admin']));
      vi.mocked(db.campaign.findUnique).mockResolvedValue({
        id: 1,
        status: 'ACTIVE',
      } as any);
      vi.mocked(db.payment.findUnique).mockResolvedValue({
        id: 1,
        campaignId: 1,
        amount: '100',
        token: 'USDC',
      } as any);
      vi.mocked(db.payment.delete).mockResolvedValue({
        id: 1,
        campaignId: 1,
      } as any);

      const response = await DELETE(req, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ ok: true });
      expect(db.payment.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    test('should delete payment with large IDs', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/999999/payments');
      req.json = vi.fn().mockResolvedValue({ paymentId: 888888 });
      const params = createMockParams('999999');

      vi.mocked(checkAuth).mockResolvedValue(mockSession('0xAdmin', ['admin']));
      vi.mocked(db.campaign.findUnique).mockResolvedValue({
        id: 999999,
        status: 'ACTIVE',
      } as any);
      vi.mocked(db.payment.findUnique).mockResolvedValue({
        id: 888888,
        campaignId: 999999,
      } as any);
      vi.mocked(db.payment.delete).mockResolvedValue({} as any);

      const response = await DELETE(req, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(db.payment.delete).toHaveBeenCalledWith({ where: { id: 888888 } });
    });
  });

  describe('Edge cases', () => {
    test('should handle payment deletion for DRAFT campaigns', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      req.json = vi.fn().mockResolvedValue({ paymentId: 1 });
      const params = createMockParams('1');

      vi.mocked(checkAuth).mockResolvedValue(mockSession('0xAdmin', ['admin']));
      vi.mocked(db.campaign.findUnique).mockResolvedValue({
        id: 1,
        status: 'DRAFT',
      } as any);
      vi.mocked(db.payment.findUnique).mockResolvedValue({
        id: 1,
        campaignId: 1,
      } as any);
      vi.mocked(db.payment.delete).mockResolvedValue({} as any);

      const response = await DELETE(req, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
    });

    test('should handle payment deletion for COMPLETED campaigns', async () => {
      const req = createMockRequest('http://localhost/api/campaigns/1/payments');
      req.json = vi.fn().mockResolvedValue({ paymentId: 1 });
      const params = createMockParams('1');

      vi.mocked(checkAuth).mockResolvedValue(mockSession('0xAdmin', ['admin']));
      vi.mocked(db.campaign.findUnique).mockResolvedValue({
        id: 1,
        status: 'COMPLETED',
      } as any);
      vi.mocked(db.payment.findUnique).mockResolvedValue({
        id: 1,
        campaignId: 1,
      } as any);
      vi.mocked(db.payment.delete).mockResolvedValue({} as any);

      const response = await DELETE(req, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
    });
  });
});