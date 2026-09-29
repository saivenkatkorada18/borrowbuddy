// src/lib/api.ts — Data Layer with Supabase and local resilience fallback (INR & Localised)
import { supabase, isSupabaseConfigured } from './supabase';
import { MOCK_ITEMS, MOCK_USERS, MOCK_BORROW_REQUESTS, MOCK_ACTIVITIES } from './data';
import type { Item, BorrowRequest, Activity, RequestStatus, User } from '../types';

// Local storage keys for resilient persistence when running in demo/offline mode
const STORAGE_ITEMS_KEY = 'borrowbuddy_items_v3_inr';
const STORAGE_REQUESTS_KEY = 'borrowbuddy_requests_v3_inr';
const STORAGE_ACTIVITIES_KEY = 'borrowbuddy_activities_v3_inr';
const STORAGE_REPORTS_KEY = 'borrowbuddy_reports_v3_inr';

function getLocalItems(): Item[] {
  try {
    const raw = localStorage.getItem(STORAGE_ITEMS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [...MOCK_ITEMS];
}

function saveLocalItems(items: Item[]) {
  try {
    localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(items));
  } catch {}
}

function getLocalRequests(): BorrowRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_REQUESTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [...MOCK_BORROW_REQUESTS];
}

function saveLocalRequests(requests: BorrowRequest[]) {
  try {
    localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(requests));
  } catch {}
}

function getLocalActivities(): Activity[] {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVITIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [...MOCK_ACTIVITIES];
}

function saveLocalActivities(activities: Activity[]) {
  try {
    localStorage.setItem(STORAGE_ACTIVITIES_KEY, JSON.stringify(activities));
  } catch {}
}

function mapDbProfileToUser(p: any): User {
  if (!p) {
    return MOCK_USERS[0];
  }
  return {
    id: p.id,
    name: p.name || 'Student Member',
    email: p.university_email || p.email || 'student@college.ac.in',
    trustScore: p.trust_score !== undefined ? Number(p.trust_score) : 85,
    memberSince: p.member_since || p.created_at || new Date().toISOString(),
    itemsBorrowed: p.completed_borrows || 0,
    itemsLent: p.completed_lends || 0,
    onTimeReturns: p.on_time_returns || 0,
    totalReturns: p.completed_borrows || 0,
    verified: Boolean(p.verified_email),
    course: p.course || 'B.Tech Student',
    avatarColor: p.avatar_color || '#4338CA',
  };
}

function mapDbItemToItem(row: any): Item {
  const owner = mapDbProfileToUser(row.profiles || row.owner);
  const deposit = row.deposit_inr !== undefined ? Number(row.deposit_inr) : Number(row.depositINR || row.deposit || 0);
  const minTrust = row.min_trust_required !== undefined ? Number(row.min_trust_required) : Number(row.minTrustRequired || 0);

  return {
    id: row.id,
    title: row.name || row.title,
    category: row.category,
    description: row.description,
    condition: row.condition,
    dailyRate: row.daily_rate_inr !== undefined ? Number(row.daily_rate_inr) : Number(row.dailyRate || 0),
    depositINR: deposit,
    deposit: deposit,
    minTrustRequired: minTrust,
    available: row.available ?? true,
    availableFrom: row.available_from || row.availableFrom,
    ownerId: row.owner_id || row.ownerId,
    owner,
    imageSeed: row.image_seed !== undefined ? Number(row.image_seed) : Number(row.imageSeed || 1),
    distance: row.distance_km !== undefined ? Number(row.distance_km) : Number(row.distance || 0.5),
    campus: row.campus || 'Central Library',
    rules: Array.isArray(row.rules) ? row.rules : [],
    pickupMethod: row.pickup_method || row.pickupMethod || 'Campus meetup',
    rating: row.rating ? Number(row.rating) : 4.9,
    borrowCount: row.borrow_count ? Number(row.borrow_count) : 10,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    savedBy: row.savedBy || [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all items with owner profile details
 */
export async function getItems(): Promise<Item[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          profiles:owner_id (
            id, name, initials, avatar_color, course, university_email, verified_email,
            trust_score, on_time_returns, avg_condition, completed_borrows, completed_lends, member_since
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(mapDbItemToItem);
      }
      if (error) {
        console.warn('Supabase getItems query error, falling back to cached seed data:', error.message);
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to cached items:', err);
    }
  }

  return getLocalItems();
}

/**
 * Fetch a single item by ID
 */
export async function getItem(id: string): Promise<Item | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          profiles:owner_id (
            id, name, initials, avatar_color, course, university_email, verified_email,
            trust_score, on_time_returns, avg_condition, completed_borrows, completed_lends, member_since
          )
        `)
        .eq('id', id)
        .single();

      if (!error && data) {
        return mapDbItemToItem(data);
      }
    } catch (err) {
      console.warn('Supabase getItem failed, checking local storage:', err);
    }
  }

  const local = getLocalItems().find((i) => i.id === id);
  return local || null;
}

/**
 * Create a new item listing
 */
export async function createItem(
  itemData: {
    title: string;
    category: string;
    description: string;
    condition: string;
    dailyRate?: number;
    depositINR: number;
    campus?: string;
    rules?: string[];
    minTrustRequired?: number;
  },
  currentUser: { id: string; name: string; email: string; trustScore?: number; verified?: boolean },
): Promise<Item> {
  const seed = Math.floor(Math.random() * 800) + 1;
  const newItemId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}`;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert({
          id: newItemId,
          owner_id: currentUser.id,
          name: itemData.title,
          category: itemData.category,
          condition: itemData.condition,
          description: itemData.description,
          deposit_inr: itemData.depositINR,
          daily_rate_inr: itemData.dailyRate || 0,
          min_trust_required: itemData.minTrustRequired || 0,
          campus: itemData.campus || 'Central Library',
          rules: itemData.rules || [],
          image_seed: seed,
          available: true,
        })
        .select(`
          *,
          profiles:owner_id (
            id, name, initials, avatar_color, course, university_email, verified_email,
            trust_score, on_time_returns, avg_condition, completed_borrows, completed_lends, member_since
          )
        `)
        .single();

      if (!error && data) {
        // Record activity
        await logActivity(currentUser.id, 'list', `${currentUser.name} listed "${itemData.title}"`);
        return mapDbItemToItem(data);
      }
      if (error) console.warn('Supabase createItem error:', error.message);
    } catch (err) {
      console.warn('Supabase createItem failed, storing locally:', err);
    }
  }

  // Fallback local storage
  const createdItem: Item = {
    id: newItemId,
    title: itemData.title,
    category: itemData.category as any,
    description: itemData.description,
    condition: itemData.condition as any,
    dailyRate: itemData.dailyRate || 0,
    depositINR: itemData.depositINR,
    deposit: itemData.depositINR,
    minTrustRequired: itemData.minTrustRequired || 0,
    available: true,
    ownerId: currentUser.id,
    owner: {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      trustScore: currentUser.trustScore ?? 85,
      verified: currentUser.verified ?? true,
      memberSince: new Date().toISOString(),
      itemsBorrowed: 0,
      itemsLent: 1,
      onTimeReturns: 0,
      totalReturns: 0,
    },
    imageSeed: seed,
    distance: 0.4,
    campus: itemData.campus || 'Central Library',
    rules: itemData.rules || ['Return on time in clean condition'],
    createdAt: new Date().toISOString(),
  };

  const currentItems = getLocalItems();
  saveLocalItems([createdItem, ...currentItems]);
  await logActivity(currentUser.id, 'list', `${currentUser.name} listed "${itemData.title}"`);

  return createdItem;
}

/**
 * Create a new borrow request
 */
export async function createRequest(
  data: {
    itemId: string;
    item: Item;
    startDate: string;
    endDate: string;
    message: string;
    paymentId?: string;
    depositAmount?: number;
  },
  currentUser: { id: string; name: string; email: string; trustScore?: number; verified?: boolean },
): Promise<BorrowRequest> {
  const reqId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `req-${Date.now()}`;

  if (isSupabaseConfigured()) {
    try {
      const { data: dbData, error } = await supabase
        .from('borrow_requests')
        .insert({
          id: reqId,
          item_id: data.itemId,
          borrower_id: currentUser.id,
          lender_id: data.item.ownerId,
          borrow_date: data.startDate,
          return_date: data.endDate,
          message: data.message,
          status: 'pending',
        })
        .select()
        .single();

      if (!error && dbData) {
        const payNote = data.paymentId ? ` (Demo Deposit Authorized: ${data.paymentId})` : '';
        await logActivity(currentUser.id, 'request', `${currentUser.name} requested to borrow ${data.item.title}${payNote}`);
        return {
          id: dbData.id,
          itemId: data.itemId,
          item: data.item,
          borrowerId: currentUser.id,
          borrower: {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            trustScore: currentUser.trustScore ?? 85,
            verified: currentUser.verified ?? true,
            memberSince: new Date().toISOString(),
            itemsBorrowed: 0,
            itemsLent: 0,
            onTimeReturns: 0,
            totalReturns: 0,
          },
          lenderId: data.item.ownerId,
          lender: data.item.owner,
          startDate: data.startDate,
          endDate: data.endDate,
          message: data.message,
          paymentId: data.paymentId,
          depositAmount: data.depositAmount,
          status: 'pending',
          createdAt: dbData.created_at || new Date().toISOString(),
        };
      }
      if (error) console.warn('Supabase createRequest error:', error.message);
    } catch (err) {
      console.warn('Supabase createRequest failed, falling back to local storage:', err);
    }
  }

  const newReq: BorrowRequest = {
    id: reqId,
    itemId: data.itemId,
    item: data.item,
    borrowerId: currentUser.id,
    borrower: {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      trustScore: currentUser.trustScore ?? 85,
      verified: currentUser.verified ?? true,
      memberSince: new Date().toISOString(),
      itemsBorrowed: 0,
      itemsLent: 0,
      onTimeReturns: 0,
      totalReturns: 0,
    },
    lenderId: data.item.ownerId,
    lender: data.item.owner,
    startDate: data.startDate,
    endDate: data.endDate,
    message: data.message,
    paymentId: data.paymentId,
    depositAmount: data.depositAmount,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const requests = getLocalRequests();
  saveLocalRequests([newReq, ...requests]);
  const payNote = data.paymentId ? ` (Demo Deposit Authorized: ${data.paymentId})` : '';
  await logActivity(currentUser.id, 'request', `${currentUser.name} requested to borrow ${data.item.title}${payNote}`);

  return newReq;
}

/**
 * Update the status of a borrow request
 */
export async function updateRequestStatus(requestId: string, status: RequestStatus): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('borrow_requests')
        .update({ status })
        .eq('id', requestId);

      if (!error) return true;
      if (error) console.warn('Supabase updateRequestStatus error:', error.message);
    } catch (err) {
      console.warn('Supabase updateRequestStatus failed:', err);
    }
  }

  const requests = getLocalRequests();
  const updated = requests.map((r) => (r.id === requestId ? { ...r, status } : r));
  saveLocalRequests(updated);
  return true;
}

/**
 * Get all borrowings for the current user
 */
export async function getMyBorrowings(userId: string): Promise<BorrowRequest[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('borrow_requests')
        .select(`
          *,
          items:item_id (
            *,
            profiles:owner_id (id, name, initials, avatar_color, course, university_email, verified_email, trust_score, on_time_returns, avg_condition, completed_borrows, completed_lends, member_since)
          ),
          borrower:borrower_id (id, name, initials, avatar_color, course, university_email, verified_email, trust_score, on_time_returns, avg_condition, completed_borrows, completed_lends, member_since),
          lender:lender_id (id, name, initials, avatar_color, course, university_email, verified_email, trust_score, on_time_returns, avg_condition, completed_borrows, completed_lends, member_since)
        `)
        .eq('borrower_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          itemId: row.item_id,
          item: row.items ? mapDbItemToItem(row.items) : MOCK_ITEMS[0],
          borrowerId: row.borrower_id,
          borrower: mapDbProfileToUser(row.borrower),
          lenderId: row.lender_id,
          lender: mapDbProfileToUser(row.lender),
          startDate: row.borrow_date,
          endDate: row.return_date,
          message: row.message,
          status: row.status as RequestStatus,
          createdAt: row.created_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase getMyBorrowings failed:', err);
    }
  }

  const all = getLocalRequests();
  return all.filter((r) => r.borrowerId === userId || r.borrower?.id === userId);
}

/**
 * Get all items listed by the current user
 */
export async function getMyListings(userId: string): Promise<Item[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          profiles:owner_id (id, name, initials, avatar_color, course, university_email, verified_email, trust_score, on_time_returns, avg_condition, completed_borrows, completed_lends, member_since)
        `)
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(mapDbItemToItem);
      }
    } catch (err) {
      console.warn('Supabase getMyListings failed:', err);
    }
  }

  const all = getLocalItems();
  return all.filter((i) => i.ownerId === userId || i.owner?.id === userId);
}

/**
 * Fetch recent activity feed
 */
export async function getActivity(): Promise<Activity[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('activity')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          type: row.type,
          text: row.text,
          createdAt: row.created_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase getActivity failed:', err);
    }
  }

  return getLocalActivities();
}

/**
 * Log activity helper
 */
export async function logActivity(userId: string | undefined, type: string, text: string): Promise<void> {
  const actId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `act-${Date.now()}`;

  if (isSupabaseConfigured() && userId) {
    try {
      await supabase.from('activity').insert({
        id: actId,
        user_id: userId,
        type,
        text,
      });
    } catch (e) {
      console.warn('Failed to insert activity in Supabase:', e);
    }
  }

  const current = getLocalActivities();
  const newActivity: Activity = {
    id: actId,
    userId,
    type,
    text,
    createdAt: new Date().toISOString(),
  };
  saveLocalActivities([newActivity, ...current.slice(0, 19)]);
}

/**
 * Submit an issue report
 */
export async function submitReport(report: {
  subject: string;
  description: string;
  email: string;
  itemId?: string;
  userId?: string;
}): Promise<boolean> {
  const reportId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `rep-${Date.now()}`;

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('reports').insert({
        id: reportId,
        user_id: report.userId || null,
        issue_type: report.subject,
        item_id: report.itemId || null,
        description: report.description,
        email: report.email,
      });
      if (!error) return true;
      if (error) console.warn('Supabase submitReport error:', error.message);
    } catch (err) {
      console.warn('Supabase submitReport failed:', err);
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_REPORTS_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    existing.push({ ...report, id: reportId, createdAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(existing));
  } catch {}

  return true;
}
