"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation, Virtual } from 'swiper/modules';
import { Star, Check, ArrowRight, CreditCard,
    Hotel, Eye, Utensils, UserCheck, Car, FileCheck, Plane, Anchor, Camera,
    Coffee, Moon, ShieldPlus, Ship, Dumbbell, Truck, ParkingCircle, Ticket, Smartphone, Headphones, MapPin, Clock, ShieldCheck, Sparkles
} from 'lucide-react';
import { getImageUrl } from '@/config';
import WishlistButton from './WishlistButton';
import { packagesData } from '@/data/packages';
import './PackageCard.scss';

const CARD_ICON_MAP: Record<string, any> = {
    Hotel, Eye, Utensils, UserCheck, Car, FileCheck, Plane, Anchor, Camera,
    Coffee, Moon, ShieldPlus, Ship, Dumbbell, Truck, ParkingCircle, Ticket, Smartphone, Headphones,
    MapPin, Clock, ShieldCheck, Sparkles
};

import 'swiper/css';
import 'swiper/css/pagination';

interface PackageCardProps {
    pkg: {
        slug: string;
        title: string;
        location?: string;
        duration?: string;
        price: string;
        oldPrice?: string | null;
        image: string;
        images?: string[];
        subtitle?: string;
        highlights?: string[];
        inclusions?: string[];
        itinerary?: any[];
        averageRating?: number;
        reviewCount?: number;
        noCostEmi?: number;
        per?: string;
        totalPrice?: number;
        onoffer?: boolean;
        slabel?: string;
        href?: string;
        iconFeatures?: { icon: string; label: string; enabled: boolean }[];
        _id?: string;
        eventDate?: string;
        thumbAlt?: string;
        imageAlt?: string;
    };
    wishlist: string[];
    toggleWishlist: (id: string, e: React.MouseEvent) => void;
    onEnquire: (e: React.MouseEvent, title: string) => void;
    /** Landing pages: no links to the package page, no wishlist, and a single "Enquire Now" button */
    enquiryOnly?: boolean;
    /** Landing pages: shows a WhatsApp button under Enquire Now (digits only, with country code) */
    whatsappNumber?: string;
    /** Text the card WhatsApp chat opens with */
    whatsappMessage?: string;
}

// In enquiry-only mode the image and title are plain elements instead of links
function CardLink({ enquiryOnly, href, className, children }: { enquiryOnly: boolean; href: string; className?: string; children: React.ReactNode }) {
    return enquiryOnly
        ? <div className={className}>{children}</div>
        : <Link href={href} className={className}>{children}</Link>;
}

export default function PackageCard({ pkg, wishlist, toggleWishlist, onEnquire, enquiryOnly = false, whatsappNumber, whatsappMessage }: PackageCardProps) {

    // Parse subtitle for itinerary list (e.g. "2N Munnar / 1N Thekkady")
    const sub = pkg.subtitle || pkg.location;
    const itineraryItems = sub 
        ? sub.split(/[/|•]/).map(s => s.trim()).filter(Boolean)
        : [];

    // Fallback: extract duration from title if pkg.duration is missing or N/A
    let displayDuration = pkg.duration;
    if (!displayDuration || displayDuration === 'N/A') {
        const durationMatch = pkg.title.match(/(\d+N\d+D)|(\d+\s*Night[s]?\s*\d+\s*Day[s]?)/i);
        if (durationMatch) {
            displayDuration = durationMatch[0].toUpperCase();
        } else if (itineraryItems.length > 0) {
            // Estimate duration from itinerary items if they contain "N" (nights)
            const nights = itineraryItems.map(item => parseInt(item.match(/(\d+)N/)?.[1] || '0')).reduce((a, b) => a + b, 0);
            if (nights > 0) {
                displayDuration = `${nights}N${nights + 1}D`;
            }
        }
    }

    let finalItinerary = pkg.itinerary || [];

    // All images for slider (including itinerary photos)
    const itineraryPhotos = finalItinerary 
        ? finalItinerary.map((it: any) => it.image).filter(Boolean)
        : [];
    
    // Normalize ALL images to full URLs before putting them in the Set to avoid duplicate paths vs full URLs
    const allImages = Array.from(new Set([
        getImageUrl(pkg.image),
        ...itineraryPhotos.map(img => getImageUrl(img))
    ])).filter(Boolean).slice(0, 5);
    
    // Pricing data parsing
    const rawPrice = parseInt(pkg.price?.toString().replace(/[^\d]/g, '') || '0') || 0;
    const emiValue = Number(pkg.noCostEmi) || Math.round(rawPrice / 3);
    const emi = emiValue.toLocaleString('en-IN');
    const totalPrice = pkg.totalPrice 
        ? Number(pkg.totalPrice).toLocaleString('en-IN') 
        : (rawPrice * 2).toLocaleString('en-IN');
    
    // Also format the main price
    const displayMainPrice = rawPrice.toLocaleString('en-IN');
    const rawOldPrice = parseInt(pkg.oldPrice?.toString().replace(/[^d]/g, '') || '0') || 0;
    const discountPercent = rawOldPrice > rawPrice && rawPrice > 0
        ? Math.round(((rawOldPrice - rawPrice) / rawOldPrice) * 100)
        : 0;

    const extractHighlights = (p: any) => {
        if (Array.isArray(p.highlights) && p.highlights.length > 0) return p.highlights;
        const html = p.new_highlight || p.new_highlights || p.highlights_list;
        if (typeof html === 'string' && html.includes('<li')) {
            return Array.from(html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
                .map(m => m[1].replace(/<[^>]+>/g, '').trim())
                .filter(Boolean);
        }
        if (Array.isArray(p.highlights_list) && p.highlights_list.length > 0) return p.highlights_list;
        return [];
    };

    const highlights = extractHighlights(pkg);
    const inclusions = Array.isArray(pkg.inclusions) ? pkg.inclusions : [];
    
    let features: string[] = [];
    if (highlights.length > 0) {
        features = highlights.slice(0, 5);
    } else if (inclusions.length > 0) {
        features = inclusions.slice(0, 5);
    } else if (pkg.duration) {
        features = [pkg.duration];
    }

    return (
        <div className="detailedPackageCard group">
            {/* Image Section: Slider only if multiple images exist */}
            <div className="cardImageSection">
                {allImages.length > 1 ? (
                    <Swiper
                        modules={[Pagination, Navigation, Autoplay, Virtual]}
                        pagination={{ clickable: true }}
                        virtual
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        className="packageSwiper"
                    >
                        {allImages.map((img, idx) => (
                            <SwiperSlide key={idx} virtualIndex={idx}>
                                <CardLink enquiryOnly={enquiryOnly}
                                    href={pkg.href || `/packages/${pkg.slug || pkg._id}`}
                                    className="block relative aspect-[4/3] overflow-hidden"
                                >
                                    <Image
                                        src={img}
                                        alt={pkg.thumbAlt || pkg.imageAlt || `${pkg.title} - ${idx + 1}`}
                                        fill
                                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority={pkg.onoffer && idx === 0}
                                    />
                                    {pkg.onoffer && (
                                        <div className="absolute top-4 left-4  offerLabel">
                                            {pkg.slabel || 'SPECIAL OFFER'}
                                        </div>
                                    )}
                                </CardLink>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <CardLink enquiryOnly={enquiryOnly}
                        href={pkg.href || `/packages/${pkg.slug || pkg._id}`}
                        className="block relative aspect-[4/3] overflow-hidden"
                    >
                        <Image
                            src={pkg.image}
                            alt={pkg.thumbAlt || pkg.imageAlt || pkg.title}
                            fill
                            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={pkg.onoffer}
                        />
                        {pkg.onoffer && (
                                        <div className="absolute top-4 left-4  offerLabel">
                                {pkg.slabel || 'SPECIAL OFFER'}
                            </div>
                        )}
                    </CardLink>
                )}

                {!enquiryOnly && (
                    <div className="wishlistBtnWrapper">
                        <WishlistButton id={pkg.slug} wishlist={wishlist} toggleWishlist={toggleWishlist} />
                    </div>
                )}
            </div>

            <div className="cardContent">
                {/* Header: Title & Duration */}
                <div className="headerSection">
                    <div className="titleRow">
                        <CardLink enquiryOnly={enquiryOnly} href={`/packages/${pkg.slug}`} className="titleLink">
                            <h3 className="cardTitle leading-snug">{pkg.title}</h3>
                        </CardLink>
                    </div>
                    {/* Rating Row - Added as per request */}
                    <div className="ratingReviewRow">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < (pkg.averageRating || 4.5) ? "#fbbf24" : "none"} color={i < (pkg.averageRating || 4.5) ? "#fbbf24" : "#cbd5e1"} strokeWidth={3} />
                            ))}
                        </div>
                        <span className="ratingValue">{pkg.averageRating || "4.9"}</span>
                        <span className="reviewCount">({pkg.reviewCount || "150"} reviews)</span>
                    </div>
                    {/* Itinerary Summary (Horizontal Bullets) */}
                    {itineraryItems.length > 0 && (
                        <div className="itineraryRow">
                            {itineraryItems.map((item, i) => (
                                <span key={i} className="itItem">
                                    {i >= 0 && <span className="bulletBullet">•</span>}
                                    {item}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Icon Features - icon on top, label below */}
                {Array.isArray((pkg as any).iconFeatures) && (pkg as any).iconFeatures.filter((f: any) => f.enabled).length > 0 && (() => {
                    const iconColorMap: Record<string, string> = {
                        Hotel: '#4a90d9', Eye: '#f5a623', Utensils: '#f5a623',
                        UserCheck: '#4a90d9', Car: '#27ae60', FileCheck: '#8e44ad',
                        Plane: '#2980b9', Anchor: '#1a6fa8', Camera: '#e67e22',
                        Coffee: '#a0522d', Moon: '#6c5ce7', ShieldPlus: '#27ae60',
                        Ship: '#2980b9', Dumbbell: '#e74c3c', Truck: '#e67e22',
                        ParkingCircle: '#95a5a6', Ticket: '#e74c3c',
                        Smartphone: '#3498db', Headphones: '#9b59b6',
                    };
                    const iconBgMap: Record<string, string> = {
                        Hotel: '#dbeafe', Eye: '#fef3c7', Utensils: '#fef3c7',
                        UserCheck: '#dbeafe', Car: '#dcfce7', FileCheck: '#f3e8ff',
                        Plane: '#dbeafe', Anchor: '#e0f2fe', Camera: '#ffedd5',
                        Coffee: '#fef3e2', Moon: '#ede9fe', ShieldPlus: '#dcfce7',
                        Ship: '#dbeafe', Dumbbell: '#fee2e2', Truck: '#ffedd5',
                        ParkingCircle: '#f1f5f9', Ticket: '#fee2e2',
                        Smartphone: '#dbeafe', Headphones: '#f3e8ff',
                    };
                    return (
                        <div className="iconFeaturesStrip">
                            {(pkg as any).iconFeatures.filter((f: any) => f.enabled).slice(0, 20).map((feat: any, i: number) => {
                                const IconComp = CARD_ICON_MAP[feat.icon];
                                const iconColor = iconColorMap[feat.icon] || '#4a90d9';
                                const iconBg = iconBgMap[feat.icon] || '#dbeafe';
                                return (
                                    <div key={i} className="cardIconItem">
                                        <div className="cardIconBox" style={{ background: iconBg }}>
                                            {IconComp && <IconComp size={22} strokeWidth={1.8} color={iconColor} />}
                                        </div>
                                        <span className="cardIconLabel">
                                            {feat.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })()}

                {/* Main Features Grid (Two Columns or Single) */}
                <div className={`featuresGrid ${features.length === 1 ? 'singleFeature' : ''}`}>
                    {features.map((f, i) => (
                        <div key={i} className="featureItem">• {f}</div>
                    ))}
                </div>

                {/* Detailed Itinerary Steps */}
                {/* <div className="itineraryListSection">
                    {pkg.itinerary && pkg.itinerary.length > 0 ? (
                        pkg.itinerary.slice(0, 4).map((item: any, i) => (
                            <div key={i} className="itStepItem">
                                <Check size={12} className="checkIcon" />
                                <span>{item.title || item}</span>
                            </div>
                        ))
                    ) : (
                        itineraryItems.slice(0, 4).map((item, i) => (
                            <div key={i} className="itStepItem">
                                <Check size={12} className="checkIcon" />
                                <span>{item}</span>
                            </div>
                        ))
                    )}
                </div> */}

                {/* High Detail Pricing Box */}
                <div className="detailedPricingBox">
                    <div className="pricingHeaderRow">
                        <div className="emiBadge">
                            <CreditCard size={12} />
                            No Cost EMI at <strong>₹{emi}/month</strong>
                        </div>
                    </div>

                    {/* <div className="mainPriceSection">
                        <div className="priceBlock">
                            {pkg.oldPrice && (
                                <span className="priceWas">
                                    <span className="priceWasValue line-through">{pkg.oldPrice}</span>
                                    {discountPercent > 0 && (
                                        <span className="priceOffBadge">{discountPercent}% OFF</span>
                                    )}
                                </span>
                            )}
                            <div className="pricePrimary">
                                <span className="currencySymbol">₹</span>
                                <span className="mainValue">{displayMainPrice}</span>
                                <span className="priceLabel">{pkg.per === 'Person' ? 'Per Person' : (pkg.per || "Per Person")}</span>
                            </div>
                        </div>
                        <div className="priceSecondary">
                            <span className="totalLabel">Total :</span>
                            <span className="totalValue">₹{totalPrice}</span>
                        </div>
                    </div> */}
                </div>

                {/* Action CTA */}
                <div className="flex gap-3">
                    {!enquiryOnly && (
                        <Link
                            href={`/packages/${pkg.slug}`}
                            className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-800 hover:bg-slate-800 hover:text-white transition-all rounded-xl py-3 font-bold text-sm"
                        >
                            Details
                        </Link>
                    )}
                    <button
                        className={`enquireMainBtn ${enquiryOnly ? 'flex-1' : 'flex-[1.5]'}`}
                        onClick={(e) => onEnquire(e, pkg.title)}
                    >
                        {enquiryOnly ? 'Enquire Now' : 'Get My Plan'}
                    </button>
                    {enquiryOnly && whatsappNumber && (
                            <a
                                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage || 'Hi, I just visited your website. I am interested in Kerala tour packages')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Chat on WhatsApp"
                                className="flex w-14 shrink-0 items-center justify-center rounded-xl text-white bg-[#25D366] hover:bg-[#1ebe5a] transition-colors shadow-lg shadow-green-500/25"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="22" height="22" fill="currentColor" aria-hidden="true">
                                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                                </svg>
                            </a>
                    )}
                </div>
            </div>
        </div>
    );
}
