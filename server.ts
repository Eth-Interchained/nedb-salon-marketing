// server.ts - TypeScript SSR Server Core with NEDB Dogfooding & HTTP Routes

import { EmbeddedNedbStore } from './nedb-adapter';
import { ServerRenderer } from './renderer';
import { CampaignConfig, CampaignType } from './types';

export class SalonServer {
  private nedbStore: EmbeddedNedbStore;

  constructor() {
    this.nedbStore = new EmbeddedNedbStore('salon_platform_production');
  }

  // Get Campaign Configuration based on SALON_CAMPAIGN
  public getCampaignConfig(campaign: CampaignType = 'salon_directory'): CampaignConfig {
    const configs: Record<CampaignType, CampaignConfig> = {
      winter_park: {
        campaign: 'winter_park',
        domain: 'winter-park-hair.com',
        title: 'Winter Park Hair • Aveda Salon & Balayage Specialist',
        tagline: 'Hyper-Local Flagship • Mint on the Avenue Anchor',
        heroHeadline: 'Park Avenue’s Premier Aveda Hair Salon',
        heroSubheadline: 'Hand-crafted Balayage, Precision Cuts, and Certified Hair Extensions at Mint on the Avenue in Winter Park, FL.',
        primaryCity: 'Winter Park',
        theme: {
          primaryMint: '#10b981',
          mintHover: '#059669',
          bgDark: '#022c22',
          panelDark: '#064e3b',
          goldAccent: '#f59e0b'
        }
      },
      hair_stylist: {
        campaign: 'hair_stylist',
        domain: 'hair-stylist-near-me.com',
        title: 'Hair Stylist Near Me • Specialist Matching Network',
        tagline: 'High-Intent Specialist & Independent Stylist Matching Network',
        heroHeadline: 'Find Top Balayage & Extension Specialists Near You',
        heroSubheadline: 'Connect directly with certified hair extension artists, master blonding specialists, and precision colorists in Central Florida.',
        primaryCity: 'Orlando',
        theme: {
          primaryMint: '#10b981',
          mintHover: '#059669',
          bgDark: '#022c22',
          panelDark: '#064e3b',
          goldAccent: '#f59e0b'
        }
      },
      salon_directory: {
        campaign: 'salon_directory',
        domain: 'salon-near-me.com',
        title: 'Salon Near Me • National Open Directory & PWYW Platform',
        tagline: 'National Open Hair Salon Directory & PWYW Marketplace',
        heroHeadline: 'Find & Book Top-Rated Hair Salons Near You',
        heroSubheadline: 'Discover verified local salons, compare service menus, and book directly with Central Florida’s top salons and stylists.',
        primaryCity: 'Winter Park',
        theme: {
          primaryMint: '#10b981',
          mintHover: '#059669',
          bgDark: '#022c22',
          panelDark: '#064e3b',
          goldAccent: '#f59e0b'
        }
      }
    };

    return configs[campaign] || configs.salon_directory;
  }

  // Handle Main SSR Page Request
  public handlePageRequest(campaignKey: CampaignType = 'winter_park'): string {
    const campaign = this.getCampaignConfig(campaignKey);
    const salons = this.nedbStore.getSalonsByCity('all');
    const pendingClaims = this.nedbStore.getPendingClaims();

    return ServerRenderer.renderPageHtml(salons, pendingClaims, campaign);
  }

  // Handle Machine /llms.txt Request
  public handleLlmsTxtRequest(campaignKey: CampaignType = 'winter_park'): string {
    const campaign = this.getCampaignConfig(campaignKey);
    const salons = this.nedbStore.getSalonsByCity('all');

    return ServerRenderer.generateLlmsTxt(salons, campaign);
  }

  // Handle API Submit HITL Claim
  public handleSubmitClaim(body: any): any {
    const claim = this.nedbStore.submitHitlClaim({
      salonId: body.salonId,
      salonName: body.salonName || 'Target Salon',
      applicantName: body.applicantName,
      applicantRole: body.applicantRole,
      directPhone: body.directPhone,
      businessPhone: body.businessPhone,
      email: body.email,
      pwywOfferAmount: body.pwywOfferAmount || 15
    });

    return { ok: true, claim };
  }

  // Handle API Approve HITL Verification Call
  public handleApproveClaim(claimId: string, notes: string): any {
    const salon = this.nedbStore.approveHitlCall(claimId, notes);
    return { ok: !!salon, salon };
  }
}
