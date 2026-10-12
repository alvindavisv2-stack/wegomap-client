"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';

const D = '/assets/images/cruise/cordelia/destinations/';

const destinations = [
    {
        name: 'Lakshadweep',
        from: 'Sailings from Mumbai',
        image: D + 'lakshadweep.webp',
        text: "Explore the luscious landscape, sun-kissed beaches and translucent blue waters of India's best kept secret. Disembark for shore excursions like village tours, kayaking, snorkeling or scuba diving.",
    },
    {
        name: 'Goa',
        from: 'Sailings from Mumbai',
        image: D + 'goa.webp',
        text: "India's favourite travel destination, a paradise of sun, sand, spice and seafood, with Portuguese architecture, brilliant restaurants and stunning beaches. Book a shore excursion to see the spice plantations in Ponda.",
    },
    {
        name: 'Kochi',
        from: 'Sailings from Mumbai',
        image: D + 'kochi.webp',
        text: "With a vibrant history dating back centuries, Kochi is rich in Portuguese, Dutch and English influences. Explore Jew Street or the Dutch Palace in the Queen of the Arabian Sea.",
    },
    {
        name: 'Mumbai',
        from: 'Sailings from Mumbai',
        image: D + 'mumbai.webp',
        text: 'Head to the City of Dreams the new way. Sail to Mumbai aboard the Empress and take in the home of Bollywood in all its glory.',
    },
    {
        name: 'High Seas',
        from: 'Sailings from Mumbai',
        image: D + 'high-seas.webp',
        text: 'Savour Indian and international cuisines and exciting adventure activities. Enjoy the entertainment programs on board or relax in the spa, all on the high seas.',
    },
    {
        name: 'Sri Lanka',
        from: 'Sailings from Chennai',
        image: D + 'sri-lanka.webp',
        text: 'A unique blend of Dutch, Indian and Buddhist influences. In Colombo visit the renowned Gangaramaya Temple, or see the ancient worship houses and monumental museums in Galle.',
    },
    {
        name: 'Chennai',
        from: 'Sailings from Chennai',
        image: D + 'chennai.webp',
        text: "Sail down to the cultural capital of South India. Explore Marina Beach, Fort St. George and St. Mary's Church, and don't miss the Valluvar Kottam.",
    },
];

export default function CordeliaDestinations() {
    const { openEnquiry } = useEnquiry();
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    // Gentle auto-advance; pauses while the pointer is over the panels
    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => setActive((i) => (i + 1) % destinations.length), 4000);
        return () => clearInterval(id);
    }, [paused]);

    return (
        <section id="cordelia-destinations" className="cpDest commonPadding">
            <div className="homeContainer">
                <div className="sectionHeader">
                    <span className="sectionSubtitle">Cordelia Cruises</span>
                    <h2 className="sliderTitle">Cordelia Cruise Destinations</h2>
                </div>

                <div
                    className="cpAcc"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    {destinations.map((d, i) => (
                        <article
                            key={d.name}
                            className={`cpAccPanel ${i === active ? 'active' : ''}`}
                            onClick={() => setActive(i)}
                            onMouseEnter={() => setActive(i)}
                            role="button"
                            tabIndex={0}
                            aria-expanded={i === active}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActive(i)}
                        >
                            <Image src={d.image} alt={d.name} fill sizes="(max-width: 991px) 82vw, 50vw" className="cpImg" />
                            <span className="cpAccNo">{String(i + 1).padStart(2, '0')}</span>
                            <span className="cpAccName">{d.name}</span>
                            <div className="cpAccBody">
                                <span className="cpAccFrom">{d.from}</span>
                                <h4>{d.name}</h4>
                                <p>{d.text}</p>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="cpDetailsCta">
                    <button className="cpCardBtn" onClick={() => openEnquiry('Enquire for Cordelia Cruises')}>
                        Enquire for Cordelia Cruises <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
}
