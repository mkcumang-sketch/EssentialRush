import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  userId?: string | null;
  customer: any;
  items: any[];
  totalAmount: number;
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
  status: string;
  paymentStatus?: string;
  paymentMethod?: string;
  promoCode?: string;
  referralCode?: string;
  trackingId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paidAt?: Date;
  agentRef?: string;
  agentCommission?: number;
  isRewardCredited?: boolean;
}

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, default: null },
  customer: { type: Object, required: true },
  items: { type: Schema.Types.Mixed, required: true },
  
  // Pricing Details
  totalAmount: { type: Number, required: true },
  subtotal: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  
  // Statuses
  status: { type: String, default: 'PENDING' },
  paymentStatus: { type: String, default: 'PENDING' },
  paymentMethod: { type: String, default: 'ONLINE' },
  
  // Tracking & Referrals
  trackingId: { type: String, default: null },
  promoCode: { type: String, default: null },
  referralCode: { type: String, default: null },
  
  // Payment Gateway
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  paidAt: { type: Date },
  
  // Agent & Admin calculations
  agentRef: { type: String, default: null },
  agentCommission: { type: Number, default: 0 },
  isRewardCredited: { type: Boolean, default: false }
}, { 
  timestamps: true, 
  strict: false // Strict false matlab agar koi extra data aaye toh error na de
});

// Next.js hot-reloading me model clash rokne ke liye
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema, 'orders'); 
// Teesri value 'orders' ye ensure karegii ki collection ka naam strictly 'orders' hi rahe
export { Order };