// server.ts - Strict Environment-Dominant TypeScript Express Server with Isolated NEDB Databases

import express from 'express';
import { EmbeddedNedbStore } from './nedb-adapter';
import { ServerRenderer } from './renderer';
import { SeoEngine } from './seo-engine';
import { CampaignConfig, CampaignType } from './types';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// STRICT ENVIRONMENT DOMINANCE (PROCESS.ENV)
// ==========================================
const CAMPAIGN_ENV = (process.env.SALON_CAMPAIGN as CampaignType) || 'winter_park';
const NEDB_DB_NAME = process.env.NEDB_DB || `${CAMPAIGN_ENV}_db`;
const PORT = parseInt(process.env.PORT || '3201', 10);

// Initialize Isolated Database Instance
const store = new EmbeddedNedbStore(CAMPAIGN_ENV);

const CAMPAIGN_CONFIGS: Record<CampaignType, CampaignConfig> = {
  winter_park: {
    campaign: 'winter_park',
    domain: process.env.DOMAIN || 'winter-park-hair.com',
    title: 'Winter Park Hair • Premier Aveda Salon & Balayage',
    tagline: 'Hyper-Local Flagship • Mint on the Avenue Anchor',
    heroHeadline: 'Park Avenue’s Premier Aveda Hair Salon',
    heroSubheadline: 'Hand-crafted Balayage, Aveda Botanical Color, Precision Haircuts, and Certified Hand-Tied Hair Extensions at Mint on the Avenue in Winter Park, FL.',
    primaryCity: 'Winter Park',
    pillText: 'Flagship Anchor Tenant • Mint on the Avenue'
  },
  hair_stylist: {
    campaign: 'hair_stylist',
    domain: process.env.DOMAIN || 'hair-stylist-near-me.com',
    title: 'Hair Stylist Near Me • Specialist Matching Network',
    tagline: 'High-Intent Specialist & Independent Stylist Network',
    heroHeadline: 'Find Top Balayage & Extension Specialists Near You',
    heroSubheadline: 'Connect directly with certified hair extension artists, master blonding specialists, and precision colorists in Central Florida.',
    primaryCity: 'Orlando',
    pillText: 'Specialist Matching Engine • Independent Stylists'
  },
  salon_directory: {
    campaign: 'salon_directory',
    domain: process.env.DOMAIN || 'salon-near-me.com',
    title: 'Salon Near Me • National Open Directory & PWYW Platform',
    tagline: 'National Open Hair Salon Directory & PWYW Marketplace',
    heroHeadline: 'Find & Book Top-Rated Hair Salons Near You',
    heroSubheadline: 'Discover verified local salons, compare service menus, and book directly with Central Florida’s top salons and stylists.',
    primaryCity: 'Winter Park',
    pillText: '2026 Verified Directory & PWYW Platform'
  }
};

const activeConfig: CampaignConfig = CAMPAIGN_CONFIGS[CAMPAIGN_ENV] || CAMPAIGN_CONFIGS.winter_park;

console.log(`[STRICT ENV DOMINANCE ACTIVE]`);
console.log(`- Campaign: ${CAMPAIGN_ENV}`);
console.log(`- Domain: ${activeConfig.domain}`);
console.log(`- Database: ${NEDB_DB_NAME}`);
console.log(`- Listening Port: ${PORT}`);

// ==========================================
// STRICT SERVER-SIDE ROUTING & RENDER ENGINE
// ==========================================

app.get('/', (req, res) => {
  const salons = store.getAllSalons();
  const pendingClaims = store.getPendingStage2Claims();
  const html = ServerRenderer.renderPageHtml(salons, pendingClaims, activeConfig);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

app.get('/llms.txt', (req, res) => {
  const salons = store.getAllSalons();
  const markdown = ServerRenderer.generateLlmsTxt(salons, activeConfig);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(markdown);
});

app.get('/sitemap.xml', (req, res) => {
  const salons = store.getAllSalons();
  const posts = store.getAllBlogPosts();
  const xml = SeoEngine.generateXmlSitemap(salons, posts, activeConfig);
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.send(xml);
});

app.get('/robots.txt', (req, res) => {
  const robots = SeoEngine.generateRobotsTxt(activeConfig);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(robots);
});

app.post('/api/checkout/stage1', (req, res) => {
  const result = store.processStage1Payment({
    salonId: req.body.salonId,
    salonName: req.body.salonName,
    applicantName: req.body.applicantName,
    applicantRole: req.body.applicantRole || 'Owner / Manager',
    directPhone: req.body.directPhone,
    email: req.body.email || 'owner@salondomain.com',
    pwywAmount: parseInt(req.body.pwywAmount, 10) || 15,
    pwywTierName: req.body.pwywTierName || 'Supporter'
  });
  res.json({ success: true, ...result });
});

app.post('/api/admin/claims/:claimId/approve', (req, res) => {
  const salon = store.approveStage3HumanVerification(
    req.params.claimId,
    req.body.verifierNotes || 'Phone verification completed.'
  );
  res.json({ success: !!salon, salon });
});

app.get('/api/admin/stats', (req, res) => {
  const stats = store.getRevenueStats();
  const payments = store.getAllPayments();
  res.json({ success: true, campaign: CAMPAIGN_ENV, db: NEDB_DB_NAME, stats, payments });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SSR SERVER RUNNING] http://0.0.0.0:${PORT} (${activeConfig.domain})`);
});
