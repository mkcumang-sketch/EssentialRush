import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { handleError } from '@/lib/error-handler';
import type { SessionUser, UserRole } from '@/types/next-auth';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET() {
    try {
        await connectDB();
        const products = await Product.find({}).sort({ createdAt: -1 }).lean() || [];

        return NextResponse.json({ 
            success: true, 
            data: products 
        }, { status: 200 });

    } catch (error) {
        // 🔧 PROPER ERROR HANDLING
        const errorInfo = handleError(error);
        console.error("❌ GET Products Error:", errorInfo);
        
        return NextResponse.json(
            { 
                success: false, 
                error: errorInfo.message,
                data: [] 
            }, 
            { status: errorInfo.statusCode }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        // 🔧 PROPER SESSION TYPING - NO MORE (as any)
        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized: Session required' },
                { status: 401 }
            );
        }

        // 🔧 TYPE-SAFE ROLE CHECK
        const userRole: UserRole | undefined = session.user.role;
        if (userRole !== "SUPER_ADMIN") {
            return NextResponse.json(
                { success: false, error: 'Unauthorized: Only Super Admins can add products' },
                { status: 401 }
            );
        }

        await connectDB();
        const body = await req.json(); 

        console.log("📦 Incoming Product Payload:", { 
            name: body.name, 
            imagesCount: body.images?.length,
            price: body.price
        });

        if (!body.images || body.images.length === 0) {
            return NextResponse.json(
                { success: false, error: 'At least one product main image is required in images array' }, 
                { status: 400 }
            );
        }
        if (!body.name || !body.price) {
            return NextResponse.json(
                { success: false, error: 'Missing product name or price' }, 
                { status: 400 }
            );
        }

        const newProduct = await Product.create(body);
        console.log("✅ Product successfully saved in DB:", newProduct._id);

        revalidatePath('/'); 
        revalidatePath('/shop'); 
        revalidatePath('/godmode'); 
        revalidatePath('/godmode/products');

        return NextResponse.json(
            { success: true, data: newProduct }, 
            { status: 201 }
        );

    } catch (error) {
        // 🔧 PROPER ERROR HANDLING - TYPED
        const errorInfo = handleError(error);
        console.error("❌ POST Products Error:", errorInfo);
        
        return NextResponse.json(
            { 
                success: false, 
                error: `Failed to add product: ${errorInfo.message}`,
                details: errorInfo.details
            }, 
            { status: errorInfo.statusCode }
        );
    }
}