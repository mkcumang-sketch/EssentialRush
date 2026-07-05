import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WithdrawalRequest from '@/models/WithdrawalRequest'; 
import User from '@/models/usertemp'; 
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        const dbUser = await User.findOne({ email: session.user.email });
        if (!dbUser) {
            return NextResponse.json({ success: false, error: 'User not found in DB' }, { status: 404 });
        }

        const newRequest = await WithdrawalRequest.create({
            userId: dbUser._id, 
            userEmail: session.user.email,
            amount: body.amount,
            paymentMethod: {
                type: body.method,     
                details: body.details  
            },
            status: 'PENDING'
        });

        return NextResponse.json({ success: true, data: newRequest });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        
        if (!session || (session.user as any)?.role !== 'SUPER_ADMIN') {
             return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const requests = await WithdrawalRequest.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: requests });
    } catch(error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// 🚀 NAYA FUNCTION: Status Update aur Balance Deduct karne ke liye
export async function PATCH(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        
        // Sirf Admin Approve/Reject kar sakta hai
        if (!session || (session.user as any)?.role !== 'SUPER_ADMIN') {
             return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { requestId, status } = body;

        const request = await WithdrawalRequest.findById(requestId);
        if (!request) return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });

        // 🚀 THE MAGIC: Agar Approve kiya hai aur pehle se PENDING tha
        if (status === 'APPROVED' && request.status === 'PENDING') {
            const user = await User.findById(request.userId);
            
            if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
            
            // Check karo ki user ke paas utne paise hain bhi ya nahi
            if ((user.walletBalance || 0) < request.amount) {
                return NextResponse.json({ success: false, error: 'Insufficient wallet balance!' }, { status: 400 });
            }

            // Wallet se paise kaat lo! 💸
            await User.findByIdAndUpdate(user._id, {
                $inc: { walletBalance: -request.amount } // Minus kar rahe hain
            });
            console.log(`✅ Deducted ₹${request.amount} from ${user.email}'s wallet.`);
        }

        // Request ka status update kar do (Approved ya Rejected)
        request.status = status;
        await request.save();

        return NextResponse.json({ success: true, data: request });
    } catch(error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}