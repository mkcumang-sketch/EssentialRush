import mongoose, { Document, Schema, Model } from 'mongoose';

// 🔧 NEW: Define structured interfaces for CMS data
export interface IHeroSlide {
  type: 'image' | 'video';
  url: string;
  heading?: string;
}

export interface IFAQItem {
  q: string;
  a: string;
}

export interface IUIConfig {
  primaryColor?: string;
  backgroundColor?: string;
  theme?: 'light' | 'dark';
}

export interface IAboutConfig {
  title: string;
  content: string;
  alignment?: 'left' | 'center' | 'right';
  boldWords?: string;
}

export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface ICorporateInfo {
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface ICMSDocument extends Document {
  type: string;
  uiConfig: IUIConfig;
  aboutConfig: IAboutConfig;
  heroSlides: IHeroSlide[];
  galleryImages: string[];
  promotionalVideos: string[];
  faqs: IFAQItem[];
  visionaries: any[];
  categories: string[];
  socialLinks?: ISocialLinks;
  corporateInfo?: ICorporateInfo;
  legalPages?: any[];
  createdAt: Date;
  updatedAt: Date;
}

const CMSSchema = new Schema<ICMSDocument>(
  {
    type: { 
      type: String, 
      default: 'global' 
    },
    uiConfig: { 
      type: Schema.Types.Mixed, 
      default: {} 
    },
    aboutConfig: { 
      type: Schema.Types.Mixed, 
      default: {} 
    },
    heroSlides: { 
      type: [Schema.Types.Mixed], 
      default: [] 
    },
    galleryImages: { 
      type: [String], 
      default: [] 
    },
    promotionalVideos: {
      type: [String],
      default: []
    },
    faqs: { 
      type: [Schema.Types.Mixed], 
      default: [] 
    },
    visionaries: { 
      type: [Schema.Types.Mixed], 
      default: [] 
    },
    categories: { 
      type: [String], 
      default: [] 
    },
    socialLinks: {
      type: Schema.Types.Mixed,
      default: {}
    },
    corporateInfo: {
      type: Schema.Types.Mixed,
      default: {}
    },
    legalPages: {
      type: [Schema.Types.Mixed],
      default: []
    }
  }, 
  { 
    strict: false, 
    timestamps: true 
  }
);

const CMS: Model<ICMSDocument> = mongoose.models.CMS || 
  mongoose.model<ICMSDocument>('CMS', CMSSchema);

export { CMS };