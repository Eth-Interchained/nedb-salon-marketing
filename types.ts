// types.ts - Core Production Types for Salon Platform, 3-Stage Workflow & Admin CMS

export type CampaignType = 'winter_park' | 'hair_stylist' | 'salon_directory';

export type WorkflowStage = 'unclaimed' | 'stage1_pay' | 'stage2_awaiting_verification' | 'stage3_verified_by_humans';

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Color' | 'Cuts' | 'Extensions' | 'Blonding' | 'Treatment' | 'Styling';
  priceFrom: number;
  durationMinutes: number;
  description: string;
}

export interface SalonEntity {
  _id: string;
  _hash?: string;
  _seq?: number;
  handle: string;
  name: string;
  tagline: string;
  city: string;
  state: string;
  address: string;
  zip: string;
  phone: string;
  verifiedPhone: boolean;
  email: string;
  geo: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  bookingUrl: string;
  specialties: string[];
  services: ServiceItem[];
  imageUrl: string;
  isFlagship: boolean;
  
  // 3-Stage Onboarding & PWYW Monetization State
  workflowStage: WorkflowStage;
  pwywMonthlyAmount: number;
  pwywTierName: 'Community' | 'Supporter' | 'Growth';
  paymentTxId?: string;
  paymentDate?: string;
  verificationClaimId?: string;
  verificationNotes?: string;
  verifiedByHumanAt?: string;
  updatedAt: string;
}

export interface VerificationClaim {
  claimId: string;
  salonId: string;
  salonName: string;
  applicantName: string;
  applicantRole: string;
  directPhone: string;
  email: string;
  
  // Stage 1 Payment Proof
  pwywMonthlyAmount: number;
  pwywTierName: string;
  paymentTxId: string;
  paidAt: string;

  // Stage 2 & 3 Verification State
  status: 'stage2_awaiting_verification' | 'stage3_verified_by_humans' | 'rejected';
  verifierNotes?: string;
  verifiedAt?: string;
  caused_by?: string[];
}

export interface PaymentTransaction {
  txId: string;
  salonId: string;
  salonName: string;
  amount: number;
  pwywTier: string;
  status: 'succeeded' | 'refunded';
  paymentMethod: string;
  timestamp: string;
  caused_by?: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  featuredImage: string;
  metaDescription: string;
  keywords: string[];
  isPublished: boolean;
}

export interface RevenueStats {
  mrr: number;
  activeSubscriptions: number;
  totalRevenueYtd: number;
  tierBreakdown: {
    community: number;
    supporter: number;
    growth: number;
  };
}

export interface CampaignConfig {
  campaign: CampaignType;
  domain: string;
  title: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  primaryCity: string;
  pillText: string;
}

