import type { Metadata } from 'next';
import TourCategoryPage from '@/components/TourCategoryPage';
import { categoryData } from '@/data/categoryData';
import { API_URL, getImageUrl } from '@/config';

export const metadata: Metadata = {
    title: 'Best-Selling Kerala Tour Packages | WEGOMAP',
    description: 'Book handpicked Kerala tour packages with WEGOMAP. Custom itineraries, no cost EMI and 24x7 support.',
    // Ad landing page: the main /kerala-tour-packages category page is the one that should rank
    robots: { index: false, follow: false },
};

const SLUG = 'kerala-tour-packages';
const staticData: any = categoryData[SLUG] || {};

// Fixed text for this landing page (it does not follow the category description set in the admin)
// Opens in WhatsApp from the sticky mobile button
const WHATSAPP_MESSAGE = 'Hi, I just visited your website. I am interested in Kerala tour packages';

const DESCRIPTION =
    '<p>Wegomap is a Kochi-based tour operator in Kerala, offering high-quality Kerala tour packages at the best prices. We partner with trusted hotels and travel service providers to ensure a safe and enjoyable holiday experience, supported by 24/7 customer assistance. Contact us for customised tour packages tailored to your needs and budget.</p>';

// The logo and the WhatsApp number come from the admin Site Options ("WhatsApp" field). There is no default number: if none is set
// in the admin, the cards simply have no WhatsApp button.
async function getSiteOptions(): Promise<{ logo: string; whatsappNumber: string; phoneNumber: string }> {
    let logo = '/assets/images/logo.png';
    let whatsappNumber = '';
    let phoneNumber = '';
    try {
        const res = await fetch(`${API_URL}/options`, { next: { revalidate: 60 } });
        const json = await res.json();
        const logoOpt = json?.data?.find((o: any) => o.key === 'site_logo');
        if (logoOpt?.value) logo = getImageUrl(logoOpt.value);
        const waOpt = json?.data?.find((o: any) => o.key === 'whatsapp');
        const digits = waOpt?.value ? String(waOpt.value).replace(/\D/g, '') : '';
        if (digits) whatsappNumber = digits;
        // Call number: the floating buttons setting first, then the general phone option (same as the mobile bottom bar)
        let phoneVal = '';
        const fbOpt = json?.data?.find((o: any) => o.key === 'floating_buttons');
        if (fbOpt?.value) {
            try { phoneVal = JSON.parse(fbOpt.value).phone_number || ''; } catch { /* ignore */ }
        }
        if (!phoneVal) phoneVal = json?.data?.find((o: any) => o.key === 'phone1')?.value || '';
        phoneNumber = String(phoneVal).replace(/[^\d+]/g, '');
    } catch {
        // keep the defaults
    }
    return { logo, whatsappNumber, phoneNumber };
}

// The page itself is static; the package cards are the same Kerala packages as the /kerala-tour-packages
// category page (assigned to the category in the admin, or matched by category name)
async function getCategoryAndPackages() {
    let category: any = null;
    try {
        const catRes = await fetch(`${API_URL}/categories/slug/${SLUG}`, { next: { revalidate: 60 } });
        const catJson = await catRes.json();
        if (catJson.success && catJson.data) category = catJson.data;
    } catch {}

    let packages: any[] = [];
    try {
        const pkgRes = await fetch(`${API_URL}/packages`, { next: { revalidate: 60 } });
        const pkgJson = await pkgRes.json();
        if (pkgJson.success && pkgJson.data) {
            const normalize = (s: string) => s.toLowerCase().replace(/-/g, ' ').trim();
            const targets = [SLUG, category?.title || staticData.title, category?.name].filter(Boolean).map(normalize);
            const assigned: string[] = category?.packages || [];

            packages = pkgJson.data
                .filter((pkg: any) => {
                    if (assigned.length > 0) return assigned.includes(pkg._id);
                    const cats = [pkg.category, ...(Array.isArray(pkg.categories) ? pkg.categories : [])]
                        .filter(Boolean)
                        .map(normalize);
                    return cats.some((c: string) => targets.includes(c));
                })
                .map((pkg: any) => ({
                    _id: pkg._id,
                    slug: pkg.slug,
                    image: getImageUrl(pkg.thumb || (pkg.images && pkg.images[0]) || pkg.image || '/bg-placeholder.jpg'),
                    thumbAlt: pkg.thumbAlt,
                    duration: pkg.duration,
                    title: pkg.title,
                    location: pkg.location,
                    price: pkg.price ? `₹${pkg.price.toLocaleString()}` : 'N/A',
                    originalPrice: pkg.oldamt ? `₹${Number(pkg.oldamt).toLocaleString()}` : null,
                    detailUrl: `/packages/${pkg.slug || pkg._id}`,
                    highlights: pkg.highlights || [],
                    subtitle: pkg.subtitle || '',
                    itinerary: pkg.itinerary || [],
                    averageRating: pkg.averageRating,
                    reviewCount: pkg.reviewCount,
                    noCostEmi: pkg.noCostEmi,
                    totalPrice: pkg.totalPrice,
                    per: pkg.per,
                    onoffer: pkg.onoffer,
                    slabel: pkg.slabel,
                    order: pkg.order,
                    status: pkg.status,
                    iconFeatures: pkg.iconFeatures || [],
                }))
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        }
    } catch {}

    return { category, packages };
}

export default async function KeralaTourPackagesLandingPage() {
    const [{ logo, whatsappNumber, phoneNumber }, { category, packages }] = await Promise.all([getSiteOptions(), getCategoryAndPackages()]);

    return (
        <TourCategoryPage
            staticLanding
            logo={logo}
            whatsappNumber={whatsappNumber || undefined}
            phoneNumber={phoneNumber || undefined}
            whatsappMessage={WHATSAPP_MESSAGE}
            title={'Best-Selling Kerala Tour Packages'}
            preTitle="Popular Kerala Holiday Packages"
            subtitle={category?.subtitle || staticData.subtitle || ''}
            bannerImage={category?.bannerImage || staticData.bannerImage || '/uploads/categories/default.jpg'}
            packages={packages}
            description={DESCRIPTION}
        />
    );
}
