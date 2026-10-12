"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Headset, Phone, Plus } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { API_URL } from '@/config';

const faqs = [
    {
        q: 'Which cruises start from Kochi?',
        a: 'Cordelia Cruises sails from Kochi to the Maldives, Sri Lanka and Lakshadweep. There are also short 2-night weekend cruises from Kochi. Contact us for the latest dates.',
    },
    {
        q: 'Do I need a passport for a cruise from Kochi?',
        a: 'For cruises to the Maldives and Sri Lanka, yes, you need a passport valid for at least 6 months. For Lakshadweep and weekend cruises within India, a government photo ID is usually enough. Our team will confirm the documents for your trip.',
    },
    {
        q: 'Do I need a visa for the Maldives or Sri Lanka cruise?',
        a: 'Rules can change, so please check with our team before you travel. We will guide you on the latest visa rules for Indian passport holders.',
    },
    {
        q: 'What is included in a cruise package?',
        a: 'Usually your room, main meals, most entertainment shows and many onboard activities are included. Drinks, specialty restaurants, spa, Wi-Fi and shore excursions usually cost extra.',
    },
    {
        q: 'Is vegetarian and Jain food available on the cruise?',
        a: 'Yes. Cordelia Cruises serves pure veg and Jain food. On international cruise lines, vegetarian food is available, and you can inform them about special needs in advance.',
    },
    {
        q: 'Are cruises good for kids and senior citizens?',
        a: "Yes. Cruise ships have kids' clubs, family rooms, lifts, a medical centre and easy-going activities, so they suit all ages.",
    },
    {
        q: 'How much luggage can I carry?',
        a: 'This depends on the cruise line. Most allow a reasonable amount of luggage per guest. We will share the exact rules when you book.',
    },
    {
        q: 'Can I cancel or change my cruise booking?',
        a: 'Yes, but cancellation charges depend on the cruise line and how close it is to the sailing date. We will explain the rules clearly before you book.',
    },
    {
        q: 'Will I get seasick?',
        a: 'Big cruise ships are very stable, and most people do not feel much movement. If you are worried, choose a room on a lower deck in the middle of the ship and carry seasickness tablets.',
    },
];

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
};

export default function CruiseFaq() {
    // Numbers come from Admin > Site Options, same as the floating WhatsApp button and the Contact page
    const [whatsapp, setWhatsapp] = useState('918113998989');
    const [phone, setPhone] = useState('+91 85903 70566');

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await fetch(`${API_URL}/options`);
                const data = await res.json();
                if (data.success && data.data) {
                    // The FAQ card shows the booking WhatsApp number (falls back to the general WhatsApp number)
                    const whatsappOpt =
                        data.data.find((opt: any) => opt.key === 'booking_whatsapp' && opt.value) ||
                        data.data.find((opt: any) => opt.key === 'whatsapp');
                    if (whatsappOpt?.value) setWhatsapp(whatsappOpt.value.replace(/\D/g, ''));
                    const phoneOpt = data.data.find((opt: any) => opt.key === 'phone1');
                    if (phoneOpt?.value) setPhone(phoneOpt.value);
                }
            } catch (err) {
                console.error('Failed to load contact numbers from CMS', err);
            }
        };
        fetchOptions();
    }, []);
    const [open, setOpen] = useState<number | null>(0);
    const whatsappDisplay =
        whatsapp.length === 12 && whatsapp.startsWith('91')
            ? `+91 ${whatsapp.slice(2, 7)} ${whatsapp.slice(7)}`
            : `+${whatsapp}`;

    return (
        <section className="cpFaq commonPadding">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="homeContainer">
                <div className="sectionHeader">
                    <span className="sectionSubtitle">FAQs</span>
                    <h2 className="sliderTitle">Cruise Packages - Frequently Asked Questions</h2>
                </div>

                <div className="cpFaqLayout">
                    <aside className="cpFaqAside">
                        <div className="cpFaqAsideTop">
                            <Image src="/assets/images/cruise/cordelia/inclusions-bg.webp" alt="" fill sizes="400px" className="cpImg cpImgRight" />
                            <span className="cpFaqAsideIcon"><Headset size={26} /></span>
                            <h3>Have a question?</h3>
                            <p>Ask our team about sailing dates, documents and visa rules for your trip.</p>
                        </div>
                        <div className="cpFaqContacts">
                            <a
                                className="cpFaqContact whatsapp"
                                href={`https://wa.me/${whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="cpFaqContactIcon"><WhatsAppIcon size={20} /></span>
                                <span>
                                    <small>WhatsApp us</small>
                                    <b>{whatsappDisplay}</b>
                                </span>
                            </a>
                            <a className="cpFaqContact call" href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
                                <span className="cpFaqContactIcon"><Phone size={20} /></span>
                                <span>
                                    <small>Call now</small>
                                    <b>{phone}</b>
                                </span>
                            </a>
                        </div>
                    </aside>

                    <div className="cpFaqList">
                        {faqs.map((f, i) => {
                            const isOpen = open === i;
                            return (
                                <div key={f.q} className={`cpFaqItem ${isOpen ? 'open' : ''}`}>
                                    <button
                                        type="button"
                                        className="cpFaqQ"
                                        aria-expanded={isOpen}
                                        onClick={() => setOpen(isOpen ? null : i)}
                                    >
                                        <span className="cpFaqText">{f.q}</span>
                                        <span className="cpFaqPlus"><Plus size={18} /></span>
                                    </button>
                                    <div className="cpFaqA" role="region">
                                        <div><p>{f.a}</p></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
