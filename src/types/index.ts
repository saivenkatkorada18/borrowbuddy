// src/types/index.ts — Application and Database types with Indian Localisation

export type Category =
  | 'calculators'
  | 'lab-coats'
  | 'books'
  | 'chargers'
  | 'adapters'
  | 'power-banks'
  | 'laptops'
  | 'headphones'
  | 'electronics'
  | 'umbrellas'
  | 'sports'
  | 'tools'
  | 'kitchen'
  | 'stationery'
  | 'hostel-essentials'
  | 'cameras';

export type Campus =
  | 'Central Library'
  | 'Science Block'
  | 'Boys Hostel'
  | 'Girls Hostel'
  | 'Sports Complex'
  | 'Engineering Block'
  | 'Student Activity Centre'
  | 'Canteen Court';

export type ItemCondition = 'Excellent' | 'Good' | 'Fair';

export type RequestStatus = 'pending' | 'accepted' | 'pickup_arranged' | 'returned' | 'declined';

export interface UserProfile {
  id: string;
  name: string;
  initials?: string;
  avatar_color?: string;
  course?: string;
  university_email: string;
  verified_email: boolean;
  trust_score: number;
  on_time_returns: number;
  avg_condition: number;
  completed_borrows: number;
  completed_lends: number;
  member_since: string;
}

// User model for UI components
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  trustScore: number;
  memberSince: string;
  itemsBorrowed: number;
  itemsLent: number;
  onTimeReturns: number;
  totalReturns: number;
  verified: boolean;
  course?: string;
  avatarColor?: string;
}

export interface Item {
  id: string;
  title: string;
  name?: string; // DB field alias
  category: Category;
  description: string;
  condition: ItemCondition;
  dailyRate: number;
  daily_rate_inr?: number;
  depositINR: number;
  deposit_inr?: number;
  deposit?: number; // fallback alias
  available: boolean;
  availableFrom?: string;
  available_from?: string;
  minTrustRequired?: number;
  min_trust_required?: number;
  ownerId: string;
  owner_id?: string;
  owner: User;
  imageSeed: number;
  image_seed?: number;
  distance?: number;
  distance_km?: number;
  campus?: Campus | string;
  rules?: string[];
  maxDurationDays?: number;
  max_duration_days?: number;
  suggestedDurationDays?: number;
  suggested_duration_days?: number;
  pickupMethod?: string;
  pickup_method?: string;
  rating?: number;
  borrowCount?: number;
  borrow_count?: number;
  savedBy?: string[];
  createdAt: string;
  created_at?: string;
}

export interface BorrowRequest {
  id: string;
  itemId: string;
  item_id?: string;
  item: Item;
  borrowerId: string;
  borrower_id?: string;
  borrower: User;
  lenderId?: string;
  lender_id?: string;
  lender?: User;
  startDate: string;
  borrow_date?: string;
  endDate: string;
  return_date?: string;
  message: string;
  status: RequestStatus;
  paymentId?: string;
  depositAmount?: number;
  createdAt: string;
  created_at?: string;
}

export interface Activity {
  id: string;
  userId?: string;
  user_id?: string;
  type: string;
  text: string;
  createdAt?: string;
  created_at?: string;
}

export interface Report {
  id?: string;
  userId?: string;
  user_id?: string;
  issueType: string;
  issue_type?: string;
  itemId?: string;
  item_id?: string;
  description: string;
  email: string;
  createdAt?: string;
  created_at?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  trustScore: number;
  verified: boolean;
  avatar?: string;
  course?: string;
  avatarColor?: string;
}

export type SortOption = 'newest' | 'distance' | 'price-asc' | 'price-desc';

export interface FilterState {
  category: Category | 'All';
  campus?: Campus | 'All';
  minTrust: number;
  maxDeposit: number;
  freeOnly: boolean;
  condition: ItemCondition | 'Any';
  available: boolean;
  sort: SortOption;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
