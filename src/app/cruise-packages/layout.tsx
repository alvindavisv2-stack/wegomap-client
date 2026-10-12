import SEOMetaInjector from '@/components/SEOMetaInjector';
import { generatePageMetadata } from '@/utils/seo';

export const generateMetadata = () => generatePageMetadata('cruises', 'Cruises');

export default function CruisesLayout({ children }: { children: React.ReactNode }) {
    return <><SEOMetaInjector slug="cruises" />{children}</>;
}
