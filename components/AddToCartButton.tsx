"use client";

import { useState } from "react";
import { ShoppingBag, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStoretemp";

export default function AddToCartButton({ product }: { product: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // 🚀 THE FIX: Added ': any' to strictly bypass the TypeScript inference error
    const addItem = useCartStore((state: any) => state.addItem);

    const addToCart = () => {
        addItem({
            ...product,
            id: product._id || product.id, // Handles both MongoDB _id and normal id
            quantity: 1
        });
        alert("Added to your cart!");
    };

    return (
        <button 
            onClick={addToCart}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-all"
        >
            <ShoppingBag size={18} />
            {loading ? "Adding..." : "Add to Cart"}
        </button>
    );
}