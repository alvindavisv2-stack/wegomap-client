"use client";

import Image from 'next/image';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';

const cruiseLines = [
    {
        name: "Cordelia Cruises - India's Own Cruise Line",
        tag: 'Domestic & short holidays',
        royal: false,
        anchor: '#cordelia',
        image: '/assets/images/cruise/cordelia-ship.webp',
        best: 'families, first-time cruisers, short holidays.',
        button: 'Enquire for Cordelia Cruises',
    },
    {
        name: 'Royal Caribbean - World-Class International Cruises',
        tag: 'International holidays',
        royal: true,
        anchor: '#royal-caribbean',
        image: '/assets/images/cruise/royal-caribbean-navigator.webp',
        best: 'honeymoon couples, big families, people who want a grand holiday abroad.',
        button: 'Enquire for Royal Caribbean',
    },
];

export default function CruiseLines() {
    const { openEnquiry } = useEnquiry();

    return (
        <section className="cpLines">
            <div className="homeContainer">
                <div className="sectionHeader">
                    <span className="sectionSubtitle">Cruises from Kochi</span>
                    <h2 className="sliderTitle">Indian and International Cruise Packages</h2>
                    <p className="sectionHeaderDescription">
                        Every cruise line is different. Some are best for families, some for couples and some
                        for a grand international holiday.<br />
                        Tell us what you like and we will suggest the right one.
                    </p>
                </div>

                <div className="cpLinesGrid">
                    {cruiseLines.map((line) => (
                        <article key={line.name} className={`cpCard ${line.royal ? 'royal' : 'cordelia'}`}>
                            <Image src={line.image} alt={line.name} fill sizes="(max-width: 991px) 100vw, 50vw" className="cpImg" />
                            <span className="cpCardTag">{line.tag}</span>
                            <div className="cpCardInfo">
                                <h3 className="cpCardTitle">{line.name}</h3>
                                <div className="cpCardBest">
                                    <em>Best for:</em>
                                    {line.best.replace(/\.$/, '').split(', ').map((b) => (
                                        <span key={b}>{b}</span>
                                    ))}
                                </div>
                                <div className="cpCardActions">
                                    <button className="cpCardBtn" onClick={() => openEnquiry(line.button)}>
                                        {line.button} <ArrowRight size={16} />
                                    </button>
                                    <a className="cpCardLink" href={line.anchor} aria-label="View details">
                                        <ArrowDown size={20} />
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
