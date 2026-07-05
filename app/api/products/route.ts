// app/api/products/route.ts
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';
import { Product } from '@/models/Product';
import { handleError } from '@/lib/error-handler';
import type { UserRole } from '@/types/next-auth';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

// ─── GET /api/products ────────────────────────────────────────────────────────
export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    await connectDB();

    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, data: products ?? [] },
      { status: 200 }
    );

  } catch (error) {
    const err = handleError(error);
    console.error('❌ GET /api/products:', err);

    return NextResponse.json(
      { success: false, error: err.message, data: [] },
      { status: err.statusCode }
    );
  }
}

// ─── POST /api/products ───────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // 1. Auth
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Session required.' },
        { status: 401 }
      );
    }

    // 2. Role check
    const userRole = session.user.role as UserRole | undefined;
    if (userRole !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only Super Admins can add products.' },
        { status: 403 }
      );
    }

    // 3. Parse body
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body.' },
        { status: 400 }
      );
    }

    // 4. Validate required fields
    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name and price.' },
        { status: 400 }
      );
    }

    const images = body.images as string[] | undefined;
    if (!images || images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one product image is required.' },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('📦 Incoming Product Payload:', {
        name:        body.name,
        price:       body.price,
        imagesCount: images.length,
      });
    }

    // 5. Save to DB
    await connectDB();
    const newProduct = await Product.create(body);

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Product saved:', newProduct._id);
    }

    // 6. Revalidate paths
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/godmode');
    revalidatePath('/godmode/products');

    return NextResponse.json(
      { success: true, data: newProduct },
      { status: 201 }
    );

  } catch (error) {
    const err = handleError(error);
    console.error('❌ POST /api/products:', err);

    return NextResponse.json(
      { success: false, error: `Failed to add product: ${err.message}`, details: err.details },
      { status: err.statusCode }
    );
  }
}