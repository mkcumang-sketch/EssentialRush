import connectDB from "@/lib/mongodb";
import { Product } from "@/models/Product";
import NewArrivalsClient from "@/components/NewArrivalsClient";

// 🚀 YE LINE VERCEL ERROR KO FIX KAREGI (Build time par DB connect nahi karega)
export const dynamic = "force-dynamic";

export default async function NewArrivalsPage() {
    try {
        await connectDB();
        
        const products = await Product.find({})
            .sort({ createdAt: -1 })
            .limit(20) // Sirf latest 20 products
            .lean() as any[];
            
        const serializedProducts = products.map(p => ({
            ...p,
            _id: p._id.toString()
        }));
        
        return <NewArrivalsClient initialLiveWatches={serializedProducts} />;
        
    } catch (error) {
        console.error("Database error on New Arrivals:", error);
        
        // 🛡️ FAILSAFE: Agar database slow/down ho, toh page crash hone ke bajaye khali products dikhayega
        return <NewArrivalsClient initialLiveWatches={[]} />;
    }
}