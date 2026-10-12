import SEOMetaInjector from '@/components/SEOMetaInjector';
import { generatePageMetadata } from '@/utils/seo';

export const generateMetadata = () => generatePageMetadata('alleppey-houseboats-kerala', 'Alleppey Houseboats Kerala');

export default function CruisesLayout({ children }: { children: React.ReactNode }) {
    return <><SEOMetaInjector slug="alleppey-houseboats-kerala" />{children}</>;
}
