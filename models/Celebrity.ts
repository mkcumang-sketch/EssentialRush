import mongoose, { Document, Schema, Model } from 'mongoose';

// 🔧 NEW: Proper TypeScript interface
export interface ICelebrity extends Document {
  name: string;
  title: string;
  imageUrl: string;
  img?: string;
  cloudinaryPublicId?: string;
  linkedWatches: mongoose.Types.ObjectId[];
  watch?: string;
  createdAt: Date;
  updatedAt: Date;
}

const celebritySchema = new Schema<ICelebrity>(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    title: { 
      type: String, 
      default: "Global Ambassador",
      trim: true,
      maxlength: 200
    },
    imageUrl: { 
      type: String, 
      required: true 
    },
    img: {
      type: String,
      alias: 'imageUrl'
    },
    cloudinaryPublicId: {
      type: String,
      default: null
    },
    linkedWatches: [{
      type: Schema.Types.ObjectId,
      ref: 'Product',
      default: []
    }],
    watch: {
      type: String,
      default: null
    }
  }, 
  { timestamps: true }
);

// 🔧 Index for faster queries
celebritySchema.index({ name: 1 });
celebritySchema.index({ createdAt: -1 });

const Celebrity: Model<ICelebrity> = mongoose.models.Celebrity || 
  mongoose.model<ICelebrity>('Celebrity', celebritySchema);

export { Celebrity };
export default Celebrity;