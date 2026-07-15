// models/usertemp.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  myReferralCode: string;
  referredBy?: string;
  // ✅ FIX: Added missing fields used in account/page.tsx
  walletPoints: number;
  walletBalance: number;
  loyaltyTier: string;
  totalReferrals?: number;
  totalEarned?: number;
  resetOtp?: string;
  otpExpiry?: Date;
  notifications: Array<{
    title: string;
    desc: string;
    unread: boolean;
    time: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name:           { type: String, required: true, trim: true },
    email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:       { type: String, select: false },
    role:           { type: String, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER' },
    myReferralCode: { type: String, unique: true, sparse: true },
    referredBy:     { type: String },
    walletPoints:   { type: Number, default: 0 },
    walletBalance:  { type: Number, default: 0 },
    loyaltyTier:    { type: String, default: 'Silver Vault' },
    totalReferrals: { type: Number, default: 0 },
    totalEarned:    { type: Number, default: 0 },
    resetOtp:       { type: String },
    otpExpiry:      { type: Date },
    notifications: [
      {
        title:  { type: String },
        desc:   { type: String },
        unread: { type: Boolean, default: true },
        time:   { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const UserModel: Model<IUser> =
  (mongoose.models.User as Model<IUser>) as mongoose.Model<any>||
  mongoose.model<IUser>('User', UserSchema);

export default UserModel;