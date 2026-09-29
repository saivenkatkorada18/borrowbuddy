// src/lib/razorpay.ts — Razorpay Test / Demo Mode Integration
export const RAZORPAY_KEY_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RAZORPAY_KEY_ID) ||
  'rzp_test_ThrafFRWV29p9E';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay?: any;
  }
}

export interface RazorpayPaymentSuccess {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface OpenCheckoutParams {
  amountINR: number;
  itemTitle: string;
  campus?: string;
  user: {
    name: string;
    email: string;
  };
  onSuccess: (response: RazorpayPaymentSuccess) => void;
  onDismiss?: () => void;
  onError?: (err: Error) => void;
}

/**
 * Ensures Razorpay checkout script is loaded into the document head
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Could not reach checkout.razorpay.com. Using in-app simulated demo fallback.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Opens Razorpay Test Mode checkout popup
 */
export async function openRazorpayCheckout({
  amountINR,
  itemTitle,
  campus = 'Campus',
  user,
  onSuccess,
  onDismiss,
}: OpenCheckoutParams): Promise<void> {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded || !window.Razorpay) {
    // If Razorpay CDN is blocked by browser ad blocker or offline, simulate payment success
    const mockPaymentId = `pay_demo_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    setTimeout(() => {
      onSuccess({ razorpay_payment_id: mockPaymentId });
    }, 800);
    return;
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: Math.round(amountINR * 100), // Amount in paise
    currency: 'INR',
    name: 'BorrowBuddy Campus',
    description: `Refundable Demo Deposit: ${itemTitle}`,
    image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    prefill: {
      name: user.name || 'Campus Student',
      email: user.email || 'student@university.edu',
      contact: '9876543210',
    },
    notes: {
      platform: 'BorrowBuddy Student Network',
      mode: 'Demo Sandbox (No real funds transferred)',
      pickup_zone: campus,
      item: itemTitle,
    },
    theme: {
      color: '#4338CA', // BorrowBuddy Indigo
    },
    modal: {
      ondismiss: () => {
        onDismiss?.();
      },
      backdropclose: false,
      escape: true,
      handleback: true,
      confirm_close: true,
    },
    handler: function (response: RazorpayPaymentSuccess) {
      onSuccess(response);
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      console.warn('Payment simulation failed/declined:', response.error);
    });
    rzp.open();
  } catch (err) {
    console.error('Failed to open Razorpay instance:', err);
    // Fallback gracefully
    const fallbackId = `pay_demo_${Date.now().toString(36)}`;
    onSuccess({ razorpay_payment_id: fallbackId });
  }
}
