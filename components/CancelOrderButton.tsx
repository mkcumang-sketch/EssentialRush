"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CancelOrderButton({ orderId, status }: { orderId: string, status: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Sirf 'Pending' ya 'Processing' me hi button dikhega
    if (status !== 'Pending' && status !== 'Processing') {
        return null;
    }

    const handleCancel = async () => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
        if (!confirmCancel) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/orders/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
            });

            const data = await res.json();

            if (data.success) {
                alert("Order cancelled successfully.");
                router.refresh(); // Status ko turant update karne ke liye
            } else {
                alert(data.message || "Failed to cancel order.");
            }
        } catch (error) {
            alert("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button 
            onClick={handleCancel}
            disabled={isLoading}
            className={`mt-4 px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 border
                ${isLoading 
                    ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed' 
                    : 'bg-transparent text-gray-400 border-gray-600 hover:border-red-500 hover:text-red-500'
                }`}
        >
            {isLoading ? 'Cancelling...' : 'Cancel Order'}
        </button>
    );
}