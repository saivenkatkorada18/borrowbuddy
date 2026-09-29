// src/components/ItemCard.tsx
import { motion, MotionConfig } from 'motion/react';
import { Heart, MapPin, Star, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Item } from '../types';
import { ItemArtwork } from './ItemArtwork';
import { formatINR, cn } from '../lib/utils';
import { CATEGORY_META } from '../lib/data';
import { spring } from '../lib/motion';

interface ItemCardProps {
  item: Item;
  className?: string;
  saved?: boolean;
  onSave?: (id: string) => void;
}

const conditionColors = {
  Excellent: 'bg-teal-50 text-teal-700',
  Good: 'bg-[#EEF2FF] text-[#4338CA]',
  Fair: 'bg-amber-50 text-amber-700',
};

export function ItemCard({ item, className, saved = false, onSave }: ItemCardProps) {
  const deposit = item.depositINR ?? item.deposit ?? 0;
  const isHighValue = (item.minTrustRequired ?? 0) >= 70;
  const catLabel = (CATEGORY_META as any)[item.category]?.label || item.category;

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        layout
        className={cn('card group relative overflow-hidden flex flex-col', className)}
        whileHover={{ y: -6, scale: 1.005 }}
        transition={spring}
      >
        <Link
          to={`/item/${item.id}`}
          className="flex flex-col flex-1 p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4338CA] rounded-3xl"
        >
          {/* Artwork */}
          <div className="relative flex justify-center items-center mb-4 bg-[#F5F1E8] rounded-2xl h-40 overflow-hidden">
            <ItemArtwork category={item.category} seed={item.imageSeed} size={110} float />

            {/* Availability dot */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
              <div className={cn('w-2 h-2 rounded-full', item.available ? 'pulse-dot' : 'bg-stone-300')} />
              <span className="text-[11px] font-semibold text-stone-600">
                {item.available ? 'Available' : 'Borrowed'}
              </span>
            </div>

            {/* Condition sticker */}
            <div className={cn('sticker absolute top-3 right-3 text-[11px]', conditionColors[item.condition])}>
              {item.condition}
            </div>

            {/* High-value badge */}
            {isHighValue && (
              <div className="absolute bottom-2 left-2 right-2 bg-[#1E1B4B]/90 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <ShieldAlert size={12} className="text-amber-400 flex-shrink-0" />
                <span className="truncate">High-value (needs trust ≥ {item.minTrustRequired})</span>
              </div>
            )}
          </div>

          {/* Category & Campus */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <p className="text-[11px] font-bold text-[#4338CA] uppercase tracking-wider truncate">
              {catLabel}
            </p>
            {item.campus && (
              <span className="text-[10px] text-stone-600 bg-stone-100 font-medium px-1.5 py-0.5 rounded truncate max-w-[120px]">
                {item.campus}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-[#1E1B4B] leading-snug text-base mb-2 group-hover:text-[#4338CA] transition-colors line-clamp-2">
            {item.title}
          </h3>

          {/* Meta row */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-3 mt-auto">
            <div className="flex items-center gap-1">
              <MapPin size={11} className="text-stone-400" />
              <span>{item.distance?.toFixed(1) ?? '0.4'} km away</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={11} className="text-[#4338CA]" />
              <span className="font-semibold text-[#4338CA]">{item.owner.trustScore}</span>
              <span>trust</span>
            </div>
          </div>

          {/* Pricing in INR */}
          <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6]">
            <div>
              {deposit === 0 ? (
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-teal-600 text-lg">Free</span>
                  <span className="text-[11px] text-stone-400 font-medium">to borrow</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-[#1E1B4B] text-lg">
                    {formatINR(deposit)}
                  </span>
                  <span className="text-[11px] text-stone-400 font-medium">deposit</span>
                </div>
              )}
            </div>
            <div className="text-[11px] font-medium text-stone-400">
              {deposit === 0 ? '₹0 deposit' : 'Refundable'}
            </div>
          </div>

          {/* Owner pill */}
          <div className="mt-3 pt-2.5 border-t border-[#EEF2FF] flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
              style={{ backgroundColor: item.owner.avatarColor || '#4338CA' }}
            >
              {item.owner.name.charAt(0)}
            </div>
            <span className="text-xs text-stone-600 truncate">{item.owner.name}</span>
            {item.owner.verified && (
              <span className="ml-auto text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0" title="Verified College Email">
                ✓ Verified
              </span>
            )}
          </div>
        </Link>

        {/* Save button */}
        {onSave && (
          <motion.button
            className="absolute top-6 right-12 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-colors hover:bg-white"
            onClick={(e) => { e.preventDefault(); onSave(item.id); }}
            whileTap={{ scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            aria-label={saved ? 'Unsave item' : 'Save item'}
            aria-pressed={saved}
          >
            <Heart
              size={16}
              className={cn('transition-colors', saved ? 'fill-[#FF6B4A] text-[#FF6B4A]' : 'text-stone-400')}
            />
          </motion.button>
        )}
      </motion.div>
    </MotionConfig>
  );
}

// Skeleton card for loading states
export function ItemCardSkeleton() {
  return (
    <div className="card p-4 overflow-hidden">
      <div className="skeleton h-40 rounded-2xl mb-4" />
      <div className="skeleton h-3 w-16 rounded mb-2" />
      <div className="skeleton h-5 w-3/4 rounded mb-2" />
      <div className="skeleton h-4 w-full rounded mb-3" />
      <div className="flex justify-between">
        <div className="skeleton h-6 w-20 rounded" />
        <div className="skeleton h-4 w-24 rounded" />
      </div>
    </div>
  );
}
