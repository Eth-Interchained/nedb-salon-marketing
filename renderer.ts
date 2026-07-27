// renderer.ts - Server-Side Renderer (SSR) & Mint on the Avenue Luxury Aesthetics

import { SalonEntity, CampaignConfig, VerificationClaim } from './types';

export class ServerRenderer {

  // Generate Pre-rendered HairSalon JSON-LD Schema
  public static generateHairSalonJsonLd(salon: SalonEntity, domain: string): string {
    const schema = {
      "@context": "https://schema.org",
      "@type": "HairSalon",
      "@id": `https://${domain}/#salon-${salon.handle}`,
      "name": salon.name,
      "description": salon.tagline,
      "image": salon.imageUrl,
      "telephone": salon.phone,
      "email": salon.verifiedEmail,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": salon.address.split(',')[0],
        "addressLocality": salon.city,
        "addressRegion": salon.state,
        "postalCode": salon.zip,
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": salon.geo.lat,
        "longitude": salon.geo.lng
      },
      "url": `https://${domain}`,
      "priceRange": "$$$",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": salon.rating.toString(),
        "reviewCount": salon.reviewCount.toString()
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": `${salon.name} Services Menu`,
        "itemListElement": salon.services.map(s => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": s.name,
            "description": s.description
          },
          "price": s.priceFrom.toFixed(2),
          "priceCurrency": "USD"
        }))
      }
    };

    return JSON.stringify(schema, null, 2);
  }

  // Generate /llms.txt Machine Discovery Output
  public static generateLlmsTxt(salons: SalonEntity[], campaign: CampaignConfig): string {
    const featured = salons.filter(s => s.verifiedPhone);
    const featuredList = featured.map(s => 
      `- [${s.name}](https://${campaign.domain}): ${s.tagline}. Address: ${s.address}. Phone: ${s.phone}. Direct Booking: ${s.bookingUrl}`
    ).join('\n');

    return `# ${campaign.title}

> High-authority verified index of hair salons, Aveda colorists, and hair extension specialists in ${campaign.primaryCity} and Central Florida.

## Verified Salon Index
${featuredList}

## Machine Citation & Verification
- Verification Protocol: Human-In-The-Loop (HITL) Phone Callback & NEDB Causal Provenance
- Platform Contact: verification@${campaign.domain}
- Database Engine: NEDB Content-Addressed Merkle DAG (v2.6)
`;
  }

  // Render Full Production SSR Page HTML
  public static renderPageHtml(salons: SalonEntity[], pendingClaims: VerificationClaim[], campaign: CampaignConfig): string {
    const flagship = salons.find(s => s.isFlagship) || salons[0];
    const jsonLd = this.generateHairSalonJsonLd(flagship, campaign.domain);

    const salonCardsHtml = salons.map(s => `
      <div class="rounded-2xl glass-card border border-emerald-900/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
        <div>
          <div class="relative h-48 overflow-hidden">
            <img src="${s.imageUrl}" alt="${s.name}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            
            <div class="absolute top-3 right-3">
              ${s.verifiedPhone ? `
                <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold flex items-center gap-1 shadow-md shadow-emerald-900/30">
                  <i class="fa-solid fa-shield-check text-emerald-400"></i> HITL Phone Verified
                </span>
              ` : `
                <span class="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-semibold flex items-center gap-1">
                  <i class="fa-solid fa-clock-rotate-left"></i> Unclaimed Profile
                </span>
              `}
            </div>

            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-medium">
              <span class="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
                <i class="fa-solid fa-location-dot text-emerald-400"></i> ${s.city}, ${s.state}
              </span>
              <span class="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 font-mono text-amber-400 flex items-center gap-1">
                <i class="fa-solid fa-star text-amber-400"></i> ${s.rating} (${s.reviewCount})
              </span>
            </div>
          </div>

          <div class="p-5 space-y-3">
            <div>
              <h3 class="font-serif text-xl font-bold text-white">${s.name}</h3>
              <p class="text-xs text-slate-300 mt-0.5">${s.tagline}</p>
              <p class="text-xs text-slate-400 flex items-center gap-1 mt-1 font-mono">
                <i class="fa-solid fa-phone text-emerald-400"></i> ${s.phone}
              </p>
            </div>

            <div class="flex flex-wrap gap-1.5 pt-1">
              ${s.specialties.map(sp => `<span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-300">${sp}</span>`).join(' ')}
            </div>

            <!-- Service Price Preview -->
            <div class="pt-2 border-t border-slate-800/80 space-y-1.5">
              <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Featured Menu:</div>
              ${s.services.slice(0, 2).map(srv => `
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-200">${srv.name}</span>
                  <span class="font-mono text-emerald-400 font-bold">$${srv.priceFrom}+</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="p-5 pt-3 border-t border-slate-800/60 mt-2 flex items-center justify-between gap-2">
          <a href="${s.bookingUrl}" target="_blank" rel="noopener" class="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs text-center shadow-md transition flex items-center justify-center gap-1.5">
            <i class="fa-solid fa-calendar-check"></i> Book Online
          </a>
          <button onclick="openHitlClaimModal('${s._id}', '${s.name}', '${s.phone}')" class="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5">
            <i class="fa-solid fa-phone-volume"></i> Claim
          </button>
        </div>
      </div>
    `).join('');

    const pendingClaimsHtml = pendingClaims.map(c => `
      <div class="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-amber-400 font-mono">${c.claimId}</span>
          <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold">Pending Phone Call</span>
        </div>
        <div>
          <div class="text-sm font-bold text-white">${c.salonName}</div>
          <div class="text-xs text-slate-300">Applicant: ${c.applicantName} (${c.applicantRole})</div>
          <div class="text-xs text-emerald-400 font-mono mt-1">Direct Phone to Call: ${c.directPhone}</div>
          <div class="text-xs text-slate-400 font-mono">Business Line: ${c.businessPhone}</div>
        </div>
        <div class="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
          <span class="text-slate-400">PWYW Offer: <strong class="text-emerald-400">$${c.pwywOfferAmount}/mo</strong></span>
          <button onclick="approveHitlCall('${c.claimId}')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1">
            <i class="fa-solid fa-phone-circle-check"></i> Verify Call Done
          </button>
        </div>
      </div>
    `).join('');

    return `<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-950 text-slate-100 dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${campaign.title} | ${campaign.heroHeadline}</title>
  <meta name="description" content="${campaign.heroSubheadline}" />
  <link rel="canonical" href="https://${campaign.domain}" />

  <!-- Google Fonts & FontAwesome -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,800;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.min.js" crossorigin="anonymous"></script>

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            serif: ['"Playfair Display"', 'serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          },
          colors: {
            mint: {
              400: '#34d399',
              500: '#10b981',
              600: '#059669',
              900: '#064e3b',
            }
          }
        }
      }
    }
  </script>

  <!-- Pre-rendered JSON-LD Schema -->
  <script type="application/ld+json">
${jsonLd}
  </script>

  <style>
    .glass-panel {
      background: rgba(6, 30, 22, 0.85);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(16, 185, 129, 0.15);
    }
    .glass-card {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(16, 185, 129, 0.1);
    }
    .glass-card:hover {
      border-color: rgba(16, 185, 129, 0.35);
      box-shadow: 0 10px 30px -10px rgba(16, 185, 129, 0.2);
    }
  </style>
</head>
<body class="h-full font-sans antialiased bg-slate-950 text-slate-100 flex flex-col">

  <!-- TOP HEADER & CAMPAIGN SWITCHER -->
  <header class="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-emerald-950/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 gap-4">
        
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
            <i class="fa-solid fa-leaf"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-serif font-bold text-lg text-white">${campaign.domain}</span>
              <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SALON_CAMPAIGN=${campaign.campaign}
              </span>
            </div>
            <p class="text-xs text-slate-400 hidden sm:block">${campaign.tagline}</p>
          </div>
        </div>

        <div class="hidden md:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <a href="/?campaign=winter_park" class="px-3 py-1.5 rounded-lg ${campaign.campaign === 'winter_park' ? 'bg-emerald-600 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'}">
            winter-park-hair.com
          </a>
          <a href="/?campaign=hair_stylist" class="px-3 py-1.5 rounded-lg ${campaign.campaign === 'hair_stylist' ? 'bg-emerald-600 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'}">
            hair-stylist-near-me.com
          </a>
          <a href="/?campaign=salon_directory" class="px-3 py-1.5 rounded-lg ${campaign.campaign === 'salon_directory' ? 'bg-emerald-600 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'}">
            salon-near-me.com
          </a>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="toggleHitlQueue()" class="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-amber-300 border border-amber-500/30 flex items-center gap-2">
            <i class="fa-solid fa-headset text-amber-400"></i>
            <span>HITL Queue (${pendingClaims.length})</span>
          </button>
        </div>

      </div>
    </div>
  </header>

  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    
    <!-- HERO BANNER (MINT BRANDING) -->
    <div class="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-12 border border-emerald-900/50 bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-950">
      <div class="relative z-10 max-w-3xl space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <i class="fa-solid fa-circle-check text-emerald-400"></i>
          <span>Mint on the Avenue • Luxury Aveda Branding</span>
        </div>

        <h1 class="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          ${campaign.heroHeadline}
        </h1>
        <p class="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
          ${campaign.heroSubheadline}
        </p>
      </div>
    </div>

    <!-- SALONS GRID -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold font-serif text-white flex items-center gap-2">
          <span>Verified Local Salons</span>
          <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-900 text-emerald-400 border border-slate-800">${salons.length} Verified</span>
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${salonCardsHtml}
      </div>
    </div>

    <!-- HITL QUEUE DRAWER (ADMIN VERIFIER PANEL) -->
    <div id="hitlQueuePanel" class="hidden p-6 rounded-2xl glass-panel border border-amber-500/40 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold font-serif text-amber-300 flex items-center gap-2">
          <i class="fa-solid fa-phone-volume text-amber-400"></i>
          Human-In-The-Loop (HITL) Verification Queue
        </h3>
        <span class="text-xs font-mono text-slate-400">${pendingClaims.length} Claims Awaiting Call</span>
      </div>

      ${pendingClaims.length === 0 ? `
        <div class="p-6 text-center text-xs text-slate-400 border border-slate-800 rounded-xl">
          No pending phone verification calls in queue. All salon profiles verified!
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${pendingClaimsHtml}
        </div>
      `}
    </div>

  </main>

  <!-- HITL PHONE CLAIM MODAL -->
  <div id="hitlClaimModal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md hidden flex items-center justify-center p-4">
    <div class="w-full max-w-lg rounded-3xl glass-panel border border-emerald-900/50 p-6 sm:p-8 space-y-6 relative shadow-2xl">
      <button onclick="closeHitlClaimModal()" class="absolute top-5 right-5 text-slate-400 hover:text-white p-2">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>

      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <i class="fa-solid fa-headset text-amber-400"></i>
          Human-In-The-Loop Phone Verification
        </div>
        <h3 class="text-2xl font-bold font-serif text-white">Request Phone Call Verification</h3>
        <p class="text-xs text-slate-300">
          Our team conducts a 2-minute phone verification call directly to your salon desk before issuing the Gold Verified Partner badge.
        </p>
      </div>

      <form onsubmit="submitHitlClaimForm(event)" class="space-y-4">
        <input type="hidden" id="claimSalonId" />
        
        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1">Target Salon Venue</label>
          <input type="text" id="claimSalonNameDisplay" readonly class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-300 font-bold">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-400 mb-1">Your Full Name</label>
            <input type="text" id="claimApplicantName" required placeholder="Mark Evans" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-400 mb-1">Your Role</label>
            <input type="text" id="claimApplicantRole" required placeholder="Owner / Manager" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none">
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1">Direct Callback Phone Number</label>
          <input type="text" id="claimDirectPhone" required placeholder="(401) 231-1000" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none">
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1">PWYW Offer Amount ($/mo)</label>
          <input type="number" id="claimPwywAmount" min="0" max="100" value="15" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-400 font-mono font-bold focus:border-emerald-500 focus:outline-none">
        </div>

        <button type="submit" class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition">
          <i class="fa-solid fa-paper-plane"></i>
          Submit to HITL Phone Queue
        </button>
      </form>

    </div>
  </div>

  <script>
    function toggleHitlQueue() {
      const panel = document.getElementById('hitlQueuePanel');
      panel.classList.toggle('hidden');
    }

    function openHitlClaimModal(salonId, salonName, phone) {
      document.getElementById('hitlClaimModal').classList.remove('hidden');
      document.getElementById('claimSalonId').value = salonId;
      document.getElementById('claimSalonNameDisplay').value = salonName;
      document.getElementById('claimDirectPhone').value = phone;
    }

    function closeHitlClaimModal() {
      document.getElementById('hitlClaimModal').classList.add('hidden');
    }

    function submitHitlClaimForm(e) {
      e.preventDefault();
      const salonId = document.getElementById('claimSalonId').value;
      const applicantName = document.getElementById('claimApplicantName').value;
      const applicantRole = document.getElementById('claimApplicantRole').value;
      const directPhone = document.getElementById('claimDirectPhone').value;
      const pwywAmount = parseInt(document.getElementById('claimPwywAmount').value) || 15;

      fetch('/api/claims/hitl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId,
          applicantName,
          applicantRole,
          directPhone,
          businessPhone: directPhone,
          email: 'owners@salondomain.com',
          pwywOfferAmount: pwywAmount
        })
      }).then(r => r.json()).then(data => {
        alert("Claim submitted to HITL queue! An admin verifier will call your salon desk shortly.");
        window.location.reload();
      });
    }

    function approveHitlCall(claimId) {
      const notes = prompt("Enter verification notes (e.g. Verified owner Mark via direct call):", "Phone call completed. License & Phorest link verified.");
      if (!notes) return;

      fetch(`/api/claims/hitl/${claimId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifierNotes: notes })
      }).then(r => r.json()).then(data => {
        alert("HITL Phone verification approved! Gold Verified Partner badge issued.");
        window.location.reload();
      });
    }
  </script>
</body>
</html>`;
  }
}
