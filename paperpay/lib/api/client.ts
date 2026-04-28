import { MOCK_TRANSACTIONS, MOCK_CATEGORIES } from '@/lib/mock-data/transactions';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('pp_token');
}

// Custom error class with better debugging
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public apiMessage: string,
    message: string = apiMessage
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (!res.ok) {
      let errorMsg = `API error ${res.status}`;
      let statusCode = res.status;
      try {
        const body = await res.json();
        errorMsg = body.message || body.error || errorMsg;
      } catch {
        const text = await res.text();
        if (text) errorMsg = text;
      }
      throw new ApiError(statusCode, errorMsg);
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network errors
    throw new ApiError(0, error.message || 'Network error', 'Unable to connect to server. Please check your internet connection.');
  }
}

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const api = {
  // ── AUTH ──────────────────────────────────────────────────────
  auth: {
    login: (email: string, password: string) =>
      apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (data: {
      fullName: string;
      email: string;
      password: string;
      phone?: string;
      currency?: string;
      monthlyBudget?: number;
    }) =>
      apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    me: () => apiFetch('/auth/me'),
  },

  // ── WALLET ────────────────────────────────────────────────────
  wallet: {
    get: () => apiFetch('/wallet'),
    addMoney: (amount: number) =>
      apiFetch('/wallet/add', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      }),
    withdraw: (amount: number) =>
      apiFetch('/wallet/withdraw', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      }),
  },

  // ── TRANSACTIONS ──────────────────────────────────────────────
  transactions: {
    list: async (page = 0, size = 10) => {
      if (USE_MOCK) {
        await delay(600);
        return MOCK_TRANSACTIONS;
      }
      const data: any = await apiFetch(`/transactions?page=${page}&size=${size}`);
      // Handle paginated response
      const items = data.content || data;
      return Array.isArray(items) ? items.map((tx: any) => ({
        id: tx.refId || String(tx.id),
        merchant: tx.receiverName || tx.senderName || 'Transfer',
        amount: tx.amount,
        date: tx.createdAt,
        type: tx.type === 'CREDIT' ? 'income' : 'expense',
        category: tx.category || 'Transfer',
        status: tx.status?.toLowerCase() || 'completed',
        riskScore: 0,
      })) : [];
    },

    send: (data: {
      toUpiId: string;
      amount: number;
      method: string;
      note?: string;
    }) =>
      apiFetch('/transactions/send', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // ── EXPENSES ──────────────────────────────────────────────────
  expenses: {
    list: (month?: string) =>
      apiFetch(`/expenses${month ? `?month=${month}` : ''}`),

    add: (data: {
      title: string;
      amount: number;
      category: string;
      notes?: string;
      expenseDate: string;
    }) =>
      apiFetch('/expenses', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: number, data: any) =>
      apiFetch(`/expenses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: number) =>
      apiFetch(`/expenses/${id}`, { method: 'DELETE' }),
  },

  // ── ANALYTICS ─────────────────────────────────────────────────
  analytics: {
    monthly: () => apiFetch('/analytics/monthly'),
    summary: () => apiFetch('/analytics/summary'),
    categories: async () => {
      if (USE_MOCK) {
        await delay(400);
        return MOCK_CATEGORIES;
      }
      return apiFetch('/analytics/categories');
    },
  },

  // ── FRAUD ─────────────────────────────────────────────────────
  fraud: {
    alerts: () => apiFetch('/fraud/alerts'),
    updateAlert: (id: number, action: 'SAFE' | 'BLOCKED') =>
      apiFetch(`/fraud/alerts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      }),
    riskScore: () => apiFetch('/fraud/risk-score'),
  },

  // ── ADMIN ─────────────────────────────────────────────────────
  admin: {
    users: (page = 0, size = 20) =>
      apiFetch(`/admin/users?page=${page}&size=${size}`),
    deactivateUser: (id: number) =>
      apiFetch(`/admin/users/${id}/deactivate`, { method: 'PATCH' }),
    fraudAlerts: () => apiFetch('/admin/fraud/alerts'),
    stats: () => apiFetch('/admin/stats'),
  },
};
