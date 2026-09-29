// src/lib/utils.ts
import type { FilterState, Item } from '../types';
import { MOCK_ITEMS } from './data';
import { formatINR, formatDateIndian } from './format';

export { formatINR, formatDateIndian };

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number): string {
  return formatINR(amount);
}

export function formatDate(dateStr: string): string {
  return formatDateIndian(dateStr);
}

export function getDaysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getTrustLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Highly Trusted', color: 'text-teal-700' };
  if (score >= 75) return { label: 'Trusted', color: 'text-indigo-700' };
  if (score >= 60) return { label: 'Moderate', color: 'text-amber-700' };
  return { label: 'New', color: 'text-stone-500' };
}

export function filterItems(items: Item[], filters: FilterState): Item[] {
  return items
    .filter((item) => {
      if (filters.category !== 'All' && item.category !== filters.category) return false;
      if (filters.campus && filters.campus !== 'All' && item.campus !== filters.campus) return false;
      if (item.owner.trustScore < filters.minTrust) return false;
      
      const deposit = item.depositINR ?? item.deposit ?? 0;
      if (filters.freeOnly && deposit > 0) return false;
      if (filters.maxDeposit !== undefined && deposit > filters.maxDeposit) return false;
      if (filters.condition !== 'Any' && item.condition !== filters.condition) return false;
      if (filters.available && !item.available) return false;
      return true;
    })
    .sort((a, b) => {
      const depA = a.depositINR ?? a.deposit ?? 0;
      const depB = b.depositINR ?? b.deposit ?? 0;
      switch (filters.sort) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'distance':
          return (a.distance ?? 99) - (b.distance ?? 99);
        case 'price-asc':
          return depA - depB;
        case 'price-desc':
          return depB - depA;
        default:
          return 0;
      }
    });
}

export function getItemsByCategory(category: string): Item[] {
  return MOCK_ITEMS.filter((item) => item.category === category);
}

export function getCategoryCount(category: string): number {
  return MOCK_ITEMS.filter((item) => item.category === category && item.available).length;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
