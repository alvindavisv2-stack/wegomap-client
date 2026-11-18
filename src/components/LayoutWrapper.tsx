"use client";

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FloatingButtons from "@/components/FloatingButtons";
import MyraBot from "@/components/MyraBot";

import { useEnquiry } from '@/context/EnquiryContext';

import CommonTestimonials from "@/components/CommonTestimonials";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { hideLayout } = useEnquiry();
    
    const isAuthPage = pathname === '/login';
    const isAdminPage = pathname?.startsWith('/admin');
    // Ad landing pages (/trips/...) bring their own minimal header and have no site header, footer or nav
    const isStaticLandingPage = pathname?.startsWith('/trips/');
    // The chat opens with this text on landing pages
    const landingWhatsappMessage = isStaticLandingPage
        ? 'Hi, I just visited your website. I am interested in Kerala tour packages'
        : '';
    const showLayout = !isAuthPage && !isAdminPage && !isStaticLandingPage && !hideLayout;

    return (
        <>
            {showLayout && <Header />}
            <main>{children}</main>
            {isStaticLandingPage && (
                <>
                    <CommonTestimonials />
                    <Footer />
                    <FloatingWhatsApp whatsappMessage={landingWhatsappMessage} />
                    <FloatingButtons whatsappMessage={landingWhatsappMessage} />
                    <MyraBot />
                </>
            )}
            {showLayout && (
                <>
                    <CommonTestimonials />
                    <Footer />
                    <MobileNav />
                    <FloatingWhatsApp />
                    <FloatingButtons />
                    <MyraBot />
                </>
            )}
        </>
    );
}
