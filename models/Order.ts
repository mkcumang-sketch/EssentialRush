// models/Order.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

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
  orderId:           { type: String, required: true, unique: true },
  userId:            { type: String, default: null },
  customer:          { type: Object, required: true },
  items:             { type: Schema.Types.Mixed, required: true },
  totalAmount:       { type: Number, required: true },
  subtotal:          { type: Number, default: 0 },
  shippingFee:       { type: Number, default: 0 },
  discount:          { type: Number, default: 0 },
  status:            { type: String, default: 'PENDING' },
  paymentStatus:     { type: String, default: 'PENDING' },
  paymentMethod:     { type: String, default: 'ONLINE' },
  trackingId:        { type: String, default: null },
  promoCode:         { type: String, default: null },
  referralCode:      { type: String, default: null },
  razorpayOrderId:   { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  paidAt:            { type: Date },
  agentRef:          { type: String, default: null },
  agentCommission:   { type: Number, default: 0 },
  isRewardCredited:  { type: Boolean, default: false },
}, {
  timestamps: true,
  strict: false,
});

// ✅ FIX: Explicitly type as Model<IOrder> — resolves ts(2349) union type error
export const Order = (mongoose.models.Order as mongoose.Model<any>) || mongoose.model('Order', OrderSchema);