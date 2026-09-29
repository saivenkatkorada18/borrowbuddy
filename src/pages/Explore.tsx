// src/pages/Explore.tsx — Localised Explore View with Indian Rupee, 16 categories, live counts, and deposit filters
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { getItems } from '../lib/api';
import { filterItems, formatINR } from '../lib/utils';
import { ALL_CATEGORIES, CATEGORY_META, INDIAN_CAMPUSES } from '../lib/data';
import type { FilterState, Category, Campus, ItemCondition, SortOption, Item } from '../types';
import { ItemCard, ItemCardSkeleton } from '../components/ItemCard';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/motion/Reveal';

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'newest', label: 'Newest listings' },
  { value: 'distance', label: 'Nearest campus distance' },
  { value: 'price-asc', label: 'Deposit: Low to High' },
  { value: 'price-desc', label: 'Deposit: High to Low' },
];

const PAGE_SIZE = 12;

const DEFAULT_FILTERS: FilterState = {
  category: 'All',
  campus: 'All',
  minTrust: 0,
  maxDeposit: 8000,
  freeOnly: false,
  condition: 'Any',
  available: false,
  sort: 'newest',
};

// Typewriter placeholder cycling tailored for Indian student life
const PLACEHOLDERS = [
  'Casio FX-991EX calculator…',
  'White cotton lab coat…',
  'Mi 20000mAh power bank…',
  'B.S. Grewal textbook…',
  'Mini-drafter drawing kit…',
  'Canon 1500D DSLR camera…',
  'Kashmir willow cricket bat…',
  'MacBook Air M1…',
];

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as Category) || 'All';

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: initialCategory,
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [filterOpen, setFilterOpen] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  // Sync category param if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && (ALL_CATEGORIES.includes(cat as Category) || cat === 'All')) {
      setFilters((prev) => ({ ...prev, category: cat as Category | 'All' }));
    }
  }, [searchParams]);

  // Fetch items from API on mount
  useEffect(() => {
    let mounted = true;
    const loadItems = async () => {
      setLoading(true);
      try {
        const items = await getItems();
        if (mounted) {
          setAllItems(items);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load items:', err);
        if (mounted) setLoading(false);
      }
    };
    loadItems();
    return () => { mounted = false; };
  }, []);

  // Cycle search placeholders
  useEffect(() => {
    const t = setInterval(() => setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length), 2600);
    return () => clearInterval(t);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, search]);

  // Category counts computed live from allItems
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allItems.length };
    ALL_CATEGORIES.forEach((cat) => {
      counts[cat] = allItems.filter((i) => i.category === cat).length;
    });
    return counts;
  }, [allItems]);

  // Filtered items based on search and active filters
  const filteredItems = useMemo(() => {
    const base = filterItems(allItems, filters);
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.campus && item.campus.toLowerCase().includes(q)),
    );
  }, [allItems, filters, search]);

  const visibleItems = filteredItems.slice(0, page * PAGE_SIZE);
  const hasMore = visibleItems.length < filteredItems.length;

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === 'category') {
      setSearchParams((params) => {
        if (value === 'All') params.delete('category');
        else params.set('category', String(value));
        return params;
      });
    }
  }, [setSearchParams]);

  const handleSave = useCallback((id: string) => {
    setSavedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const loadMore = useCallback(async () => {
    setPage((p) => p + 1);
  }, []);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch('');
    setSearchParams((params) => {
      params.delete('category');
      return params;
    });
  };

  const activeFilterCount = [
    filters.category !== 'All',
    filters.campus && filters.campus !== 'All',
    filters.minTrust > 0,
    filters.freeOnly,
    filters.maxDeposit < 8000,
    filters.condition !== 'Any',
    filters.available,
  ].filter(Boolean).length;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <Reveal className="mb-6">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1E1B4B] mb-2">
              Explore Campus Items
            </h1>
            <p className="text-stone-500 text-sm sm:text-base">
              Borrow calculators, lab coats, textbooks, adapters, sports gear and hostel essentials near your block.
            </p>
          </Reveal>

          {/* Search bar */}
          <Reveal className="mb-6">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${PLACEHOLDERS[placeholderIdx]}`}
                aria-label="Search items"
                className="w-full pl-11 pr-12 py-3.5 sm:py-4 rounded-2xl border border-[#E0E7FF] bg-white text-[#1E1B4B] text-sm sm:text-base focus:outline-none focus:border-[#4338CA] focus:shadow-[0_0_0_3px_rgba(67,56,202,0.12)] transition-all font-body"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </Reveal>

          {/* Category chip row with live count badges and active pill */}
          <Reveal className="mb-6">
            <div className="relative">
              <div
                className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
                role="group"
                aria-label="Filter by category"
              >
                {/* All category pill */}
                <button
                  onClick={() => updateFilter('category', 'All')}
                  className={`relative flex-shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold font-display transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    filters.category === 'All'
                      ? 'text-white'
                      : 'text-stone-600 bg-white border border-[#E0E7FF] hover:border-[#A5B4FC]'
                  }`}
                  aria-pressed={filters.category === 'All'}
                >
                  {filters.category === 'All' && (
                    <motion.div
                      layoutId="cat-active-pill"
                      className="absolute inset-0 bg-[#4338CA] rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">All</span>
                  <span
                    className={`relative z-10 text-[11px] px-1.5 py-0.2 rounded-full ${
                      filters.category === 'All' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {categoryCounts['All'] || 0}
                  </span>
                </button>

                {/* 16 Category chips */}
                {ALL_CATEGORIES.map((cat) => {
                  const meta = CATEGORY_META[cat];
                  const isSelected = filters.category === cat;
                  const count = categoryCounts[cat] || 0;

                  return (
                    <button
                      key={cat}
                      onClick={() => updateFilter('category', cat)}
                      className={`relative flex-shrink-0 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold font-display transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        isSelected
                          ? 'text-white'
                          : 'text-stone-600 bg-white border border-[#E0E7FF] hover:border-[#A5B4FC]'
                      }`}
                      aria-pressed={isSelected}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="cat-active-pill"
                          className="absolute inset-0 bg-[#4338CA] rounded-full"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{meta?.icon}</span>
                      <span className="relative z-10">{meta?.label || cat}</span>
                      <span
                        className={`relative z-10 text-[11px] px-1.5 py-0.2 rounded-full ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Filter row & Quick toggles */}
          <Reveal className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value as SortOption)}
                  aria-label="Sort items"
                  className="appearance-none pl-3.5 pr-8 py-2 rounded-xl border border-[#E0E7FF] bg-white text-xs sm:text-sm font-semibold text-stone-700 cursor-pointer focus:outline-none focus:border-[#4338CA]"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>

              {/* Free items only toggle */}
              <button
                onClick={() => updateFilter('freeOnly', !filters.freeOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                  filters.freeOnly
                    ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-sm'
                    : 'bg-white border-[#E0E7FF] text-stone-600 hover:border-teal-300'
                }`}
                aria-pressed={filters.freeOnly}
              >
                <span className={`w-2 h-2 rounded-full ${filters.freeOnly ? 'bg-teal-600' : 'bg-stone-300'}`} />
                Free to borrow
              </button>

              {/* Available only toggle */}
              <button
                onClick={() => updateFilter('available', !filters.available)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                  filters.available
                    ? 'bg-[#EEF2FF] border-[#4338CA] text-[#4338CA] shadow-sm'
                    : 'bg-white border-[#E0E7FF] text-stone-600 hover:border-[#A5B4FC]'
                }`}
                aria-pressed={filters.available}
              >
                <span className={`w-2 h-2 rounded-full ${filters.available ? 'pulse-dot' : 'bg-stone-300'}`} />
                Available now
              </button>

              {/* Advanced filter toggle button */}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer border ${
                  filterOpen || activeFilterCount > 0
                    ? 'bg-[#EEF2FF] border-[#A5B4FC] text-[#4338CA]'
                    : 'bg-white border-[#E0E7FF] text-stone-600'
                }`}
                aria-expanded={filterOpen}
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-[#4338CA] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full ml-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs sm:text-sm text-stone-400 hover:text-[#4338CA] transition-colors ml-1"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Results counter */}
            <AnimatePresence mode="wait">
              <motion.span
                key={filteredItems.length}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs sm:text-sm font-medium text-stone-500"
              >
                Showing {visibleItems.length} of {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
              </motion.span>
            </AnimatePresence>
          </Reveal>

          {/* Advanced filters collapsible drawer */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
                className="mb-8"
              >
                <div className="card p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white border border-[#E0E7FF] shadow-sm">
                  {/* Max Deposit Slider (₹0 to ₹8,000) */}
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                        Max Deposit
                      </label>
                      <span className="text-sm font-extrabold text-[#4338CA]">
                        {filters.maxDeposit === 0 ? 'Free (₹0)' : formatINR(filters.maxDeposit)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={8000}
                      step={250}
                      value={filters.maxDeposit}
                      onChange={(e) => updateFilter('maxDeposit', Number(e.target.value))}
                      className="w-full accent-[#4338CA]"
                      aria-label="Maximum deposit slider in rupees"
                    />
                    <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                      <span>₹0 (Free)</span>
                      <span>₹4,000</span>
                      <span>₹8,000</span>
                    </div>
                  </div>

                  {/* Campus Selector */}
                  <div>
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">
                      Campus Zone
                    </label>
                    <select
                      value={filters.campus || 'All'}
                      onChange={(e) => updateFilter('campus', e.target.value as Campus | 'All')}
                      className="w-full px-3 py-2 rounded-xl border border-[#E0E7FF] bg-white text-xs sm:text-sm text-stone-700 focus:outline-none focus:border-[#4338CA]"
                      aria-label="Filter by campus zone"
                    >
                      <option value="All">All Campus Zones</option>
                      {INDIAN_CAMPUSES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Trust minimum */}
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                        Min Trust Score
                      </label>
                      <span className="text-sm font-extrabold text-[#4338CA]">{filters.minTrust}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={95}
                      step={5}
                      value={filters.minTrust}
                      onChange={(e) => updateFilter('minTrust', Number(e.target.value))}
                      className="w-full accent-[#4338CA]"
                      aria-label="Minimum trust score"
                    />
                    <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                      <span>0 (All)</span><span>70 (High-value)</span><span>95</span>
                    </div>
                  </div>

                  {/* Condition Filter */}
                  <div>
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">
                      Condition
                    </label>
                    <div className="flex gap-1.5 flex-wrap">
                      {(['Any', 'Excellent', 'Good', 'Fair'] as const).map((c) => (
                        <button
                          key={c}
                          onClick={() => updateFilter('condition', c as ItemCondition | 'Any')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                            filters.condition === c
                              ? 'bg-[#4338CA] text-white border-[#4338CA]'
                              : 'bg-white text-stone-600 border-[#E0E7FF] hover:border-[#A5B4FC]'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Item grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <ItemCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {visibleItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ItemCard
                      item={item}
                      saved={savedItems.has(item.id)}
                      onSave={handleSave}
                      className="h-full"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Load more (displays 12 per page until all 40+ are shown) */}
          {hasMore && !loading && (
            <div className="text-center mt-12">
              <Button
                variant="secondary"
                size="lg"
                onClick={loadMore}
                className="px-8 shadow-sm hover:border-[#4338CA]"
              >
                Load more items ({visibleItems.length} of {filteredItems.length})
              </Button>
            </div>
          )}
        </div>
      </div>
    </MotionConfig>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-[#E0E7FF] p-8 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-3xl mb-4">
        🔍
      </div>
      <h3 className="font-display font-bold text-xl text-[#1E1B4B] mb-2">No matching items found</h3>
      <p className="text-stone-400 text-sm mb-6 max-w-sm">
        Try broadening your search term or raising the max deposit slider.
      </p>
      <Button variant="primary" onClick={onReset}>
        Reset all filters
      </Button>
    </div>
  );
}
