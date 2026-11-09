import { MetadataRoute } from 'next';
import { API_URL } from '@/config';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wegomap.com';

// sitemap.ts is cached as a static route by default; this keeps it from going stale between deploys.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/packages`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/hotels`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/special-events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/cruise-packages`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/blogs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms-and-conditions`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/refund-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Dynamic package routes
  let packageRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/packages`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        packageRoutes = json.data
          .filter((p: any) => p.status === 'Published' || !p.status)
          .map((p: any) => ({
            url: `${SITE_URL}/packages/${p.slug || p._id}`,
            lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          }));
      }
    }
  } catch (_) {}

  // Dynamic category/landing-page routes (served at the site root, e.g. /kerala-tour-packages)
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        categoryRoutes = json.data
          .filter((c: any) => c.slug && (c.status === 'Active' || !c.status))
          .map((c: any) => ({
            url: `${SITE_URL}/${c.slug}`,
            lastModified: new Date(c.updatedAt || c.createdAt || Date.now()),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          }));
      }
    }
  } catch (_) {}

  // Dynamic blog routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/blogs`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        blogRoutes = json.data.map((b: any) => ({
          url: `${SITE_URL}/blogs/${b.slug || b._id}`,
          lastModified: new Date(b.updatedAt || b.createdAt || Date.now()),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }));
      }
    }
  } catch (_) {}

  return [...staticRoutes, ...categoryRoutes, ...packageRoutes, ...blogRoutes];
}
