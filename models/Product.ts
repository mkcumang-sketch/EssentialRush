// models/Product.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── Interface ────────────────────────────────────────────────────────────────
export interface IProduct extends Document {
  name: string;
  price: number;
  description?: string;
  images: string[];
  category?: string;
  stock?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const ProductSchema = new Schema<IProduct>(
  {
    name:        { type: String, required: true, trim: true },
    price:       { type: Number, required: true, min: 0 },
    description: { type: String },
    images:      { type: [String], default: [] },
    category:    { type: String },
    stock:       { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ─── Export ───────────────────────────────────────────────────────────────────
export const Product: Model<IProduct> =
  (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>('Product', ProductSchema);