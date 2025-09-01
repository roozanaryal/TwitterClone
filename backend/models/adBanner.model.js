import mongoose from "mongoose";

const adBannerSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: "🚗 Toyota Camry 2024"
  },
  subtitle: {
    type: String,
    default: "Experience Luxury & Performance"
  },
  description: {
    type: String,
    default: "Limited Time Offer: 0% Financing Available"
  },
  price: {
    type: String,
    default: "Starting at $25,000"
  },
  imageUrl: {
    type: String,
    default: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=200&h=120&fit=crop&crop=center"
  },
  logoText: {
    type: String,
    default: "TOYOTA"
  },
  ctaText: {
    type: String,
    default: "Learn More"
  },
  ctaUrl: {
    type: String,
    default: "#"
  },
  backgroundColor: {
    type: String,
    default: "from-red-600 to-red-800"
  },
  textColor: {
    type: String,
    default: "white"
  },
  showDelay: {
    type: Number,
    default: 20 // seconds
  },
  closeDelay: {
    type: Number,
    default: 5 // seconds
  },
  // New dynamic fields
  category: {
    type: String,
    enum: ['automotive', 'technology', 'fashion', 'food', 'travel', 'finance', 'health', 'education', 'entertainment', 'other'],
    default: 'automotive'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'new_users', 'active_users', 'premium_users'],
    default: 'all'
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  maxImpressions: {
    type: Number,
    default: 10000
  },
  isScheduled: {
    type: Boolean,
    default: false
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const AdBanner = mongoose.model("AdBanner", adBannerSchema);

export default AdBanner;
