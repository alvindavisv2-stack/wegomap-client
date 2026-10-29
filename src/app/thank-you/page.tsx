import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ThankYouPage() {
    return (
        <div className="thankYouPage">
            <section className="thankYouHero">
                <div className="thankYouBadge">
                    <svg viewBox="0 0 200 130" aria-hidden="true">
                        <ellipse cx="108" cy="78" rx="62" ry="46" fill="#fde6d3" />

                        <g className="thankYouConfetti">
                            <circle cx="22" cy="58" r="3.5" fill="none" stroke="#475569" strokeWidth="2" />
                            <path d="M34 22 v8 M30 26 h8" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
                            <path d="M52 40 l4 7 h-8 z" fill="none" stroke="#facc15" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M172 30 l4 7 h-8 z" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M150 18 v8 M146 22 h8" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="182" cy="84" r="3" fill="none" stroke="#2dd4bf" strokeWidth="2" />
                            <path d="M42 102 l5 5 M47 102 l-5 5" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                        </g>

                        <g className="thankYouEnvelope">
                            <path d="M42 62 L100 24 L158 62 Z" fill="#ff8f2e" />
                            <g className="thankYouLetter">
                                <rect x="62" y="30" width="76" height="58" rx="4" fill="#fff" />
                                <rect x="72" y="42" width="40" height="4" rx="2" fill="#fed7aa" />
                                <rect x="72" y="52" width="56" height="4" rx="2" fill="#e5e7eb" />
                            </g>
                            <path d="M42 62 L100 102 L158 62 V112 a6 6 0 0 1 -6 6 H48 a6 6 0 0 1 -6 -6 Z" fill="#ffa94d" />
                            <path d="M42 62 L96 100 L42 114 Z" fill="#ff9a3c" />
                            <path d="M158 62 L104 100 L158 114 Z" fill="#ff9a3c" />
                        </g>
                    </svg>
                </div>

                <div className="sectionHeader">
                    <span className="sectionSubtitle">Enquiry received</span>
                    <h1 className="sliderTitle">Thank you for reaching out!</h1>
                </div>
                <p className="thankYouText">
                    Our travel expert will call you shortly with the best options for your trip.
                </p>

                <div className="thankYouActions">
                    <Link href="/packages" className="thankYouBtn primary">
                        Explore Tours <ArrowRight size={16} />
                    </Link>
                    <Link href="/" className="thankYouBtn">Back to Home</Link>
                </div>
            </section>
        </div>
    );
}
