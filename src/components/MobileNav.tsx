import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Briefcase, PhoneCall, Instagram, MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { API_URL } from '@/config';

export default function MobileNav() {
    const pathname = usePathname();
    const [pressingIndex, setPressingIndex] = useState<number | null>(null);
    const [whatsappNumber, setWhatsappNumber] = useState('918113998989');
    // Defaults show immediately; replaced by the admin values once the options load
    const [phoneNumber, setPhoneNumber] = useState('+918113998989');
    const [instagramUrl, setInstagramUrl] = useState('https://www.instagram.com/wegomap/');

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await fetch(`${API_URL}/options`);
                const data = await res.json();
                if (data.success) {
                    const whatsappOpt = data.data.find((opt: any) => opt.key === 'whatsapp');
                    if (whatsappOpt?.value) {
                        const cleaned = whatsappOpt.value.replace(/\D/g, '');
                        setWhatsappNumber(cleaned);
                    }

                    // Call number: floating buttons setting first, then the general phone option
                    let phoneVal = '';
                    const fbOpt = data.data.find((opt: any) => opt.key === 'floating_buttons');
                    if (fbOpt?.value) {
                        try { phoneVal = JSON.parse(fbOpt.value).phone_number || ''; } catch { /* ignore */ }
                    }
                    if (!phoneVal) {
                        phoneVal = data.data.find((opt: any) => opt.key === 'phone1')?.value || '';
                    }
                    const cleanedPhone = phoneVal.replace(/[^\d+]/g, '');
                    if (cleanedPhone) setPhoneNumber(cleanedPhone);

                    // Instagram link: Admin → Site Options → Social Links
                    const instagramOpt = data.data.find((opt: any) => opt.key === 'instagram');
                    if (instagramOpt?.value) setInstagramUrl(instagramOpt.value.trim());
                }
            } catch (err) {
                console.error("Failed to fetch contact options from CMS", err);
            }
        };
        fetchOptions();
    }, []);


    const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Tours', href: '/packages', icon: Briefcase },
        { name: 'Myra AI', href: '#', icon: MessageCircle, isCentral: true },
        { name: 'Call', href: `tel:${phoneNumber}`, icon: PhoneCall, isExternal: true },
        { name: 'Instagram', href: instagramUrl, icon: Instagram, isExternal: true, newTab: true },
    ];

    const activeIndex = navItems.findIndex(item =>
        (item.href === '#' || item.isExternal) ? false : (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))
    );

    return (
        <div className="mobileBottomNavWrapper mmt-final-style">
            <nav className="mobileBottomNav">
                <div className="navContainer">
                    {navItems.map((item, idx) => {
                        const Icon = item.icon;
                        const isActive = idx === activeIndex;

                        if (item.isCentral) {
                            return (
                                <div key={item.name} className="centralNavItemWrapper">
                                    <a
                                        href={`https://wa.me/${whatsappNumber}`}
                                        target="_blank"

                                        rel="noopener noreferrer"
                                        className="centralNavItem animated"
                                    >
                                        <img
                                            src="/assets/images/whatsapp_orb.webp"
                                            alt="Chat on WhatsApp"
                                            className="centralAnimatedIcon"
                                        />
                                    </a>
                                    <span className="navLabel centralLabel">Chat with us</span>
                                </div>
                            );
                        }

                        // Call (tel:) and Instagram are plain links, not in-app routes
                        if (item.isExternal) {
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="navItem"
                                    {...(item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                >
                                    <div className="iconWrapper">
                                        <Icon size={24} />
                                    </div>
                                    <span className="navLabel">{item.name}</span>
                                </a>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`navItem ${isActive ? 'active' : ''}`}
                            >
                                <div className="iconWrapper">
                                    <Icon size={24} />
                                </div>
                                <span className="navLabel">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
