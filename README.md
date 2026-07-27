# NEDB Salon Marketing Platform (`nedb-salon-marketing`)

> Production TypeScript Server-Rendered (SSR) Local SEO Platform, PWYW Marketplace, and Admin CMS powered by embedded `nedb-engine`.

## Overview
`nedb-salon-marketing` is a single multi-tenant codebase deployed across three isolated domain instances:
1. **`winter-park-hair.com`** (`SALON_CAMPAIGN=winter_park`): Hyper-local flagship for Mint on the Avenue in Winter Park, FL.
2. **`hair-stylist-near-me.com`** (`SALON_CAMPAIGN=hair_stylist`): High-intent specialist & independent stylist matching network.
3. **`salon-near-me.com`** (`SALON_CAMPAIGN=salon_directory`): Open public directory & Pay-What-You-Want (PWYW) marketplace.

---

## Key Production Capabilities

### 1. Strict 3-Stage Onboarding Workflow
* **Stage 1 (Pay First):** Salon owner selects PWYW subscription tier ($0 Community, $15 Supporter, $35 Growth), completes checkout, and generates an immutable payment transaction ID (`tx_pwyw_xxx`).
* **Stage 2 (Await Human Verification):** Listing switches to `"Stage 2: Awaiting Human Verification"` status badge. Claim enters the Admin HITL Verification Queue with payment receipt attached.
* **Stage 3 (Verified by Humans):** Admin verifier conducts a direct phone call to the salon desk, verifies active scheduling links (e.g., Phorest/Vagaro), and issues the **Gold Verified Partner** badge.

### 2. Full Admin Portal & Blog CMS
* **Revenue & Subscription Ledger:** Tracks Monthly Recurring Revenue (MRR), total active PWYW subscriptions, transaction ledger, and payout history.
* **HITL Verification Desk:** Incoming phone queue showing applicant details, payment proof, direct phone lines, and one-click call approval.
* **SEO Blog CMS:** Draft and publish SEO-optimized articles with auto-generated `BlogPosting` JSON-LD schema, custom slugs, meta descriptions, and keywords.

### 3. 2026 SEO & AI Answer Engine Suite
* **Pre-rendered JSON-LD:** `HairSalon`, `OfferCatalog`, `BreadcrumbList`, and `BlogPosting` schemas injected into raw server HTML on every request.
* **AI Search Directives:** Configured `/robots.txt` permitting GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, and Google-Extended.
* **Machine Discovery:** `/llms.txt`, `/llms-full.txt`, and route `.md` representations for ChatGPT, Claude, and Perplexity citation readiness.

---

## Quick Start & Local Development

```bash
# Install Dependencies
npm install

# Compile TypeScript
npm run build

# Start Environment Instance (winter_park on Port 3201)
PORT=3201 SALON_CAMPAIGN=winter_park NEDB_DB=winter_park_db npm start
```

---

## Production VPS Deployment (3 Isolated Instances)

```bash
# Instance 1: winter-park-hair.com
PORT=3201 SALON_CAMPAIGN=winter_park NEDB_DB=winter_park_db node dist/server.js &

# Instance 2: hair-stylist-near-me.com
PORT=3202 SALON_CAMPAIGN=hair_stylist NEDB_DB=hair_stylist_db node dist/server.js &

# Instance 3: salon-near-me.com
PORT=3203 SALON_CAMPAIGN=salon_directory NEDB_DB=salon_directory_db node dist/server.js &
```

---

## License
BUSL-1.1 &copy; 2026 Interchained LLC. All rights reserved.
