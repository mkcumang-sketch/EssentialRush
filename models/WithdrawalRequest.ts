// Bas dekh le ki aisi dikhti hai ya nahi
import mongoose from 'mongoose';

const withdrawalRequestSchema = new mongoose.Schema({
  // ... tere baaki fields
  userId: { type: String },
  userEmail: { type: String },
  amount: { type: Number },
  method: { type: String }, // 'upi' ya 'bank'
  details: { type: Object }, // account details ya UPI id
  status: { type: String, default: 'PENDING' },
}, { timestamps: true });

export default mongoose.models.WithdrawalRequest as mongoose.Model<any> || mongoose.model('WithdrawalRequest', withdrawalRequestSchema);