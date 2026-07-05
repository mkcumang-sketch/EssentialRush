"use client";

import React, { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Server par bina client providers ke render karo taaki UI turant dikhe
    if (!isHydrated) {
        return <>{children}</>;
    }

    // Client par fully hydrate hone ke baad Auth load karo
    // Note: We removed legacy Context providers (Cart/Wishlist) here because Zustand handles it.
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}