"use client";

import { useEffect, useState } from 'react';
import PageBanner from '@/components/PageBanner';
import { API_URL } from '@/config';

export default function CruiseHero() {
    // Numbers come from Admin > Site Options, same as the floating WhatsApp button and the Contact page
    const [whatsapp, setWhatsapp] = useState('918113998989');

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await fetch(`${API_URL}/options`);
                const data = await res.json();
                if (data.success && data.data) {
                    const whatsappOpt = data.data.find((opt: any) => opt.key === 'whatsapp');
                    if (whatsappOpt?.value) setWhatsapp(whatsappOpt.value.replace(/\D/g, ''));
                }
            } catch (err) {
                console.error('Failed to load contact numbers from CMS', err);
            }
        };
        fetchOptions();
    }, []);

    return (
        <div className="cpBanner">
            <PageBanner
                preTitle="Sail from Kochi"
                title="Cruise Packages from Kochi"
                subtitle="Sail to Maldives, Sri Lanka and Lakshadweep, or take an international cruise. Tell us your dates and we will find the best cruise for you."
                breadcrumbs={[{ label: 'Cruise Packages' }]}
                backgroundImage="/assets/images/banners/cruise-banner.jpg"
                showEnquire
                whatsappNumber={whatsapp}
            />
        </div>
    );
}
