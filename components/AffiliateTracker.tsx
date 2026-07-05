"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AffiliateTracker() {
    const searchParams = useSearchParams();

    useEffect(() => {
        // URL se ?ref=CODE dhoondho
        const refCode = searchParams.get('ref') || searchParams.get('agent');
        if (refCode) {
            // Browser mein lock kar do
            localStorage.setItem('er_ref', refCode.toUpperCase());
            console.log("🔥 Affiliate Link Locked in Browser:", refCode);
        }
    }, [searchParams]);

    return null; // Invisible component
}