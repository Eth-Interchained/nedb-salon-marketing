// seo-engine.ts - Complete 2026 Local SEO & AI Answer Engine Generator

import { SalonEntity, BlogPost, CampaignConfig } from './types';

export class SeoEngine {

  // 1. Generate XML Sitemap (/sitemap.xml)
  public static generateXmlSitemap(salons: SalonEntity[], posts: BlogPost[], campaign: CampaignConfig): string {
    const baseUrl = `https://${campaign.domain}`;
    const now = new Date().toISOString().split('T')[0];

    const staticUrls = [
      `<url><loc>${baseUrl}/</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
      `<url><loc>${baseUrl}/blog</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`
    ];

    const salonUrls = salons.map(s => `
      <url>
        <loc>${baseUrl}/salons/${s.handle}</loc>
        <lastmod>${s.updatedAt.split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
    `);

    const blogUrls = posts.map(p => `
      <url>
        <loc>${baseUrl}/blog/${p.slug}</loc>
        <lastmod>${p.publishedAt.split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
    `);

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls.join('\n')}
  ${salonUrls.join('\n')}
  ${blogUrls.join('\n')}
</urlset>`;
  }

  // 2. Generate robots.txt (/robots.txt)
  public static generateRobotsTxt(campaign: CampaignConfig): string {
    return `# robots.txt for ${campaign.domain}
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

# Explicitly Allow 2026 AI Search Crawlers
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://${campaign.domain}/sitemap.xml
`;
  }

  // 3. Generate BreadcrumbList JSON-LD Schema
  public static generateBreadcrumbJsonLd(items: { name: string; url: string }[]): string {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };
    return JSON.stringify(schema, null, 2);
  }

  // 4. Generate BlogPosting JSON-LD Schema
  public static generateBlogPostingJsonLd(post: BlogPost, domain: string): string {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `https://${domain}/blog/${post.slug}#article`,
      "headline": post.title,
      "description": post.metaDescription || post.summary,
      "image": post.featuredImage,
      "datePublished": post.publishedAt,
      "dateModified": post.publishedAt,
      "author": {
        "@type": "Person",
        "name": post.author.name,
        "jobTitle": post.author.title
      },
      "publisher": {
        "@type": "Organization",
        "name": "Mint on the Avenue",
        "logo": {
          "@type": "ImageObject",
          "url": `https://${domain}/logo.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://${domain}/blog/${post.slug}`
      },
      "keywords": post.keywords ? post.keywords.join(', ') : 'Hair Salon, Balayage, Winter Park'
    };

    return JSON.stringify(schema, null, 2);
  }
}
