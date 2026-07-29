let scriptPromise = null;

// Loads Razorpay's checkout.js once and caches the promise, so mounting
// the Wallet page repeatedly doesn't re-inject the script tag.
export function loadRazorpayScript() {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout. Check your connection and try again.'));
    document.body.appendChild(script);
  });

  return scriptPromise;
}

// order: the response from POST /api/payments/razorpay/create-order
// ({ id, amount, currency, keyId }). onSuccess/onFailure receive the
// raw Razorpay response / an Error respectively.
export async function openRazorpayCheckout({ order, user, description, onSuccess, onFailure }) {
  await loadRazorpayScript();

  const rzp = new window.Razorpay({
    key: order.keyId,
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
    name: 'SkillSwap',
    description,
    prefill: { name: user && user.name, email: user && user.email },
    theme: { color: '#14f0b4' },
    handler: (response) => onSuccess(response),
    modal: { ondismiss: () => onFailure(new Error('Payment cancelled.')) }
  });

  rzp.on('payment.failed', (resp) => {
    onFailure(new Error((resp.error && resp.error.description) || 'Payment failed.'));
  });

  rzp.open();
}
