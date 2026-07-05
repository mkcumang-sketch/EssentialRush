// models/AbandonedCart.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IAbandonedCart extends Document {
  name: string;
  email: string;
  phone: string;
  userId: string;
  cartTotal: number;
  items: any;
  status: 'ABANDONED' | 'OFFER_SENT' | 'RECOVERED' | 'EXPIRED';
  lastInteraction: Date;
  recoveryCode?: string;
  recoveryEmailSent: boolean;
  recoveryEmailSentAt?: Date;
  recoverySMSCount: number;
  lastRecoveryAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AbandonedCartSchema = new Schema<IAbandonedCart>(
  {
    name:                 { type: String, default: 'Vault Client' },
    email:                { type: String, default: '', index: true },
    phone:                { type: String, default: '', index: true },
    userId:               { type: String, default: '', index: true, sparse: true },
    cartTotal:            { type: Number, default: 0 },
    items:                { type: Array,  default: [] },
    status:               { type: String, default: 'ABANDONED', enum: ['ABANDONED', 'OFFER_SENT', 'RECOVERED', 'EXPIRED'] },
    lastInteraction:      { type: Date,   default: Date.now },
    recoveryCode:         { type: String },
    recoveryEmailSent:    { type: Boolean, default: false },
    recoveryEmailSentAt:  { type: Date },
    recoverySMSCount:     { type: Number, default: 0 },
    lastRecoveryAt:       { type: Date },
  },
  { timestamps: true, strict: false }
);

// ✅ FIX: Explicit Model<IAbandonedCart> type — resolves ts(2349)
export const AbandonedCart: Model<IAbandonedCart> =
  (mongoose.models.AbandonedCart as Model<IAbandonedCart>) ||
  mongoose.model<IAbandonedCart>('AbandonedCart', AbandonedCartSchema);