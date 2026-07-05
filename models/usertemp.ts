// models/usertemp.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── Interface ────────────────────────────────────────────────────────────────
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  myReferralCode: string;
  referredBy?: string;
  walletPoints: number;
  notifications: Array<{
    title: string;
    desc: string;
    unread: boolean;
    time: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const UserSchema = new Schema<IUser>(
  {
    name:           { type: String, required: true, trim: true },
    email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:       { type: String, select: false },
    role:           { type: String, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER' },
    myReferralCode: { type: String, unique: true, sparse: true },
    referredBy:     { type: String },
    walletPoints:   { type: Number, default: 0 },
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

// ─── Export ───────────────────────────────────────────────────────────────────
const UserModel: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema);

export default UserModel;