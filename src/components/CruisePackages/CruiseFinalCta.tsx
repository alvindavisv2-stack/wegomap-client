"use client";

import { useEffect, useState } from 'react';
import { Phone, Ship } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { useEnquiry } from '@/context/EnquiryContext';
import { API_URL } from '@/config';

export default function CruiseFinalCta() {
    const { openEnquiry } = useEnquiry();
    // Numbers come from Admin > Site Options, same as the floating WhatsApp button and the Contact page
    const [whatsapp, setWhatsapp] = useState('918113998989');
    const [phone, setPhone] = useState('+91 85903 70566');

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await fetch(`${API_URL}/options`);
                const data = await res.json();
                if (data.success && data.data) {
                    const whatsappOpt = data.data.find((opt: any) => opt.key === 'whatsapp');
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

    return (
        <section className="cpFinal">
            <div className="homeContainer">
                <div className="cpFinalStrip">
                    <div className="cpFinalText">
                        <h2>Ready to Set Sail from Kochi?</h2>
                        <p>
                            Tell us your travel dates and number of guests. Our cruise expert will send you the best
                            cruise options and fares within 24 hours.
                        </p>
                    </div>

                    <div className="cpFinalActions">
                        <button className="cpFinalBtn primary" onClick={() => openEnquiry('Cruise Packages from Kochi')}>
                            <Ship size={18} /> Get Cruise Options
                        </button>
                        <a
                            className="cpFinalBtn whatsapp"
                            href={`https://wa.me/${whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <WhatsAppIcon size={18} /> WhatsApp Us
                        </a>
                        <a className="cpFinalBtn call" href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
                            <Phone size={18} /> Call Now
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
