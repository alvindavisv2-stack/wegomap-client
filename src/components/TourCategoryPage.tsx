"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, User, Mail, Phone, X, Heart, Search, Clock, Filter, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_URL, getImageUrl } from '@/config';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import PackageCard from './PackageCard';
import EnquireModal from './EnquireModal';
import WishlistButton from '@/components/WishlistButton';
import { MessageSquare } from 'lucide-react';



export interface TourPackage {
    _id?: string;
    slug?: string;
    image: string;
    duration: string;
    title: string;
    location: string;
    price: string;
    originalPrice: string | null;
    strip?: string;
    detailUrl: string;
    packCode?: string;
    highlights?: string[];
    itinerary?: any[];
    subtitle?: string;
    averageRating?: number;
    reviewCount?: number;
    noCostEmi?: number;
    totalPrice?: number;
    per?: string;
    onoffer?: boolean;
    slabel?: string;
}

export interface TourCategoryPageProps {
    title: string;
    subtitle: string;
    preTitle?: string;
    bannerImage: string;
    bookCount?: number;
    packages: TourPackage[];
    readMoreContent?: React.ReactNode;
    readMoreHeading?: string;
    description?: string;
    /** Static ad landing page: logo-only header, no breadcrumb links, and cards without a Details button */
    staticLanding?: boolean;
    logo?: string;
    /** Static landing page: number for the WhatsApp button on each card (digits, with country code) */
    whatsappNumber?: string;
    /** Static landing page: call number and WhatsApp text for the sticky buttons on mobile */
    phoneNumber?: string;
    whatsappMessage?: string;
}

import DynamicPageBanner from './DynamicPageBanner';
import { testimonialsData as testimonials } from '@/data/testimonialsData';

export default function TourCategoryPage({
    title,
    subtitle,
    preTitle,
    bannerImage,
    bookCount = 25,
    packages,
    readMoreContent,
    readMoreHeading,
    description,
    staticLanding = false,
    logo = "/assets/images/logo.png",
    whatsappNumber,
    phoneNumber,
    whatsappMessage,
}: TourCategoryPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState('');
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });
    // const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingTestimonials, setLoadingTestimonials] = useState(true);

    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('all');
    const [durationRange, setDurationRange] = useState('all');
    const [showFilters, setShowFilters] = useState(false);


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [sortOrder, durationRange, searchQuery]);

    const filtered = useMemo(() => {
        let list = packages
            .filter((p: any) => p.status === 'Published' || !p.status)
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        
        if (durationRange !== 'all') {
            list = list.filter(p => {
                const durationMatch = p.duration.match(/(\d+)\s*(?:Day|Days)/i);
                const titleMatch = p.title.match(/(\d+)D/i);
                const days = parseInt(durationMatch?.[1] || titleMatch?.[1] || "0") || 0;
                return days === parseInt(durationRange);
            });
        }
        
        if (sortOrder === 'low-high' || sortOrder === 'high-low') {
            list = [...list].sort((a, b) => {
                const priceA = parseInt(a.price.replace(/[^\d]/g, '')) || 0;
                const priceB = parseInt(b.price.replace(/[^\d]/g, '')) || 0;
                return sortOrder === 'low-high' ? priceA - priceB : priceB - priceA;
            });
        }
        
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(p =>
                p.title.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q)
            );
        }
        return list;
    }, [packages, searchQuery, sortOrder, durationRange]);


    useEffect(() => {
        const fetchWishlist = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await fetch(`${API_URL}/auth/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.success && data.data.wishlist) {
                        setWishlist(data.data.wishlist);
                    }
                } catch (e) {
                    console.error('Error fetching wishlist status:', e);
                }
            }
        };
        fetchWishlist();


    }, []);

    const toggleWishlist = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to save tours');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/wishlist/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setWishlist(data.data);
                toast.success(data.message);
            }
        } catch (err) {
            toast.error('Failed to update wishlist');
        }
    };

    const handleQuickPlan = (pkgTitle: string) => {
        setSelectedPackage(pkgTitle);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        // Redundant as we now use EnquireModal, but kept for compatibility if needed
    };


    return (
        <div className="tourCatPage">
            {staticLanding && (
                <header className="lpHeader">
                    <div className="lpHeaderInner homeContainer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo} alt="WEGOMAP" className="lpHeaderLogo" />
                        <button type="button" className="lpHeaderBtn" onClick={() => handleQuickPlan(`Category: ${title}`)}>
                            Enquire Now
                        </button>
                    </div>
                </header>
            )}

            {/* ── Banner / Hero ── */}
            <DynamicPageBanner
                fallbackTitle={title}
                fallbackSubtitle={subtitle}
                fallbackPreTitle={preTitle}
                fallbackImage={getImageUrl(bannerImage)}
                breadcrumbs={[{ label: title }]}
                variant="large"
                centered={true}
                showEnquire={true}
                onEnquire={() => handleQuickPlan(`Category: ${title}`)}
                hideBreadcrumbs={staticLanding}
                whatsappNumber={staticLanding ? whatsappNumber : undefined}
                whatsappMessage={staticLanding ? whatsappMessage : undefined}
                skipApiFetch={staticLanding}
            />

            {/* ── Package Listings ── */}
            <section className="tourCatPackages allToursPage" style={{ background: '#f8fafc' }}>
                <div className="homeContainer">
                    {description && description.replace(/<[^>]*>|&nbsp;/g, '').trim() && (
                        <div style={{padding:"20px 0px"}} className="prose prose-slate max-w-none">
                             <div className="richContent" dangerouslySetInnerHTML={{ __html: description }} />
                             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/30 rounded-bl-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        </div>
                    )}

                    <div className="tourCatTrustRow">
                        <div className={`tourCatBookedBadge mb-6${description && description.replace(/<[^>]*>|&nbsp;/g, '').trim() ? ' hasDescription' : ''}`}>
                            <span className="tourCatBookedNum">{bookCount}</span> tours booked in the last 24 hours.
                        </div>
                        <div className="tourCatPartnerLogos">
                            <img src="/assets/images/incredible-india.png" alt="Incredible India" className="tourCatPartnerLogo" />
                            <img src="/assets/images/kerala-tourism.png" alt="Kerala Tourism" className="tourCatPartnerLogo" />
                        </div>
                    </div>
                    
                    {/* Filter + Search Strip */}
                    <div className="allToursControls" style={{ marginBottom: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                        <div className="allToursControlsInner">
                            {/* Search */}
                            <div className="allToursSearch" style={{ maxWidth: '500px' }}>


                                <Search size={16} className="allToursSearchIcon" />
                                <input
                                    type="text"
                                    placeholder="Search in this category…"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="allToursSearchInput"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="allToursSearchClear">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            <div className="allToursControlsDivider" />

                            {/* Sorting */}
                            <div className="allToursSelectFilters">
                                <select 
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="tourSelect"
                                >
                                    <option value="all">Budget</option>
                                    <option value="low-high">Price: Low to High</option>
                                    <option value="high-low">Price: High to Low</option>
                                </select>
                                
                                <select 
                                    value={durationRange}
                                    onChange={(e) => setDurationRange(e.target.value)}
                                    className="tourSelect"
                                >
                                    <option value="all">Duration</option>
                                    {[1,2,3,4,5,6,7,8,9,10].map(d => (
                                        <option key={d} value={d}>{d} Day{d > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button className="mobileFilterToggle" onClick={() => setShowFilters(!showFilters)}>
                                <Filter size={16} /> Filter
                            </button>
                        </div>

                        {/* Mobile Filter Sheet Overlay */}
                        {showFilters && (
                            <div className="mobileFilterOverlay" onClick={() => setShowFilters(false)}>
                                <div className="mobileFilterSheet" onClick={(e) => e.stopPropagation()}>
                                    <div className="mobileFilterSheetHandle" />
                                    
                                    <div className="mobileFilterDrawerHeader">
                                        <span>Filter {title}</span>
                                        <div className="drawerActions">
                                            <button className="resetBtn" onClick={() => { setSortOrder('all'); setDurationRange('all'); setSearchQuery(''); }}>Reset</button>
                                            <button className="doneBtn" onClick={() => setShowFilters(false)}>Done</button>
                                        </div>
                                    </div>
                                    
                                    <div className="mobileFilterDrawerSection">
                                        <div className="flex gap-4">
                                            <div className="filterGroup flex-1">
                                                <label>Sort By</label>
                                                <select 
                                                    value={sortOrder}
                                                    onChange={(e) => setSortOrder(e.target.value)}
                                                >
                                                    <option value="all">Default</option>
                                                    <option value="low-high">Price: Low to High</option>
                                                    <option value="high-low">Price: High to Low</option>
                                                </select>
                                            </div>
                                            <div className="filterGroup flex-1">
                                                <label>Duration</label>
                                                <select 
                                                    value={durationRange}
                                                    onChange={(e) => setDurationRange(e.target.value)}
                                                >
                                                    <option value="all">Any Duration</option>
                                                    {[1,2,3,4,5,6,7,8,9,10].map(d => (
                                                        <option key={d} value={d}>{d} Day{d > 1 ? 's' : ''}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                    <div className="allToursGrid">
                        {filtered.map((pkg, i) => {
                            const normalizedPkg = {
                                slug: pkg.slug || pkg._id || (pkg.detailUrl?.split('/').pop()) || '',
                                title: pkg.title,
                                location: pkg.location,
                                duration: pkg.duration,
                                price: pkg.price,
                                oldPrice: pkg.originalPrice,
                                image: pkg.image,
                                images: (pkg as any).images || [],
                                subtitle: pkg.subtitle || '',
                                highlights: pkg.highlights || [],
                                itinerary: pkg.itinerary || [],
                                averageRating: pkg.averageRating || 4.9,
                                reviewCount: pkg.reviewCount || 150,
                                noCostEmi: pkg.noCostEmi,
                                totalPrice: pkg.totalPrice,
                                per: pkg.per || '/ Person',
                                onoffer: pkg.onoffer,
                                slabel: pkg.slabel,
                                iconFeatures: Array.isArray((pkg as any).iconFeatures) ? (pkg as any).iconFeatures : [],
                                _id: pkg._id
                            };
                            return (
                                <PackageCard 
                                    key={`${pkg.slug}-${i}`}
                                    pkg={normalizedPkg}
                                    wishlist={wishlist}
                                    toggleWishlist={toggleWishlist}
                                    enquiryOnly={staticLanding}
                                    whatsappNumber={staticLanding ? whatsappNumber : undefined}
                                    onEnquire={(e: React.MouseEvent, title: string) => handleQuickPlan(title)}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>


            {/* ── Read More Content (optional) ── */}
            {readMoreContent && (
                <section className="tourCatReadMore">
                    <div className="tourCatContainer">
                        {readMoreHeading && (
                            <h2 className="tourCatReadMoreHeading">
                                <span className="tourCatHeadingHighlight">{readMoreHeading}</span>
                            </h2>
                        )}
                        <div className="tourCatReadMoreBody">
                            {typeof readMoreContent === 'string' ? (
                                <div className="richContent" dangerouslySetInnerHTML={{ __html: readMoreContent }} />
                            ) : (
                                readMoreContent
                            )}
                        </div>
                    </div>
                </section>
            )}



            {/* ── Footer CTA ── */}
            <section className="tourCatCTA">
                <div className="homeContainer">
                    <p className="tourCatCTALabel" style={{ color: '#FF6B35' }}>GREAT PLACES TO VISIT</p>
                    <h2 className="tourCatCTATitle">Planning your next trip?</h2>
                    <p className="tourCatCTASub">Talk to our experts and get a detailed plan for your next trip</p>
                    <div className="tourCatCTABtns">
                        <button 
                            onClick={() => handleQuickPlan('General Inquiry')}
                            className="tourCatCTAEnquire" 
                            style={{ backgroundColor: '#FF6B35' }}
                        >
                            Enquire Now
                        </button>
                        <a href="tel:+918590370566" className="tourCatCTACall">
                            📞 Talk With Us
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Sticky Call + WhatsApp buttons (phones only, static landing page) ── */}
            {staticLanding && (phoneNumber || whatsappNumber) && (
                <div className="lpStickyBar">
                    {phoneNumber && (
                        <a href={`tel:${phoneNumber}`} className="lpStickyBtn call">
                            <Phone size={18} />
                            Call Now
                        </a>
                    )}
                    {whatsappNumber && (
                        <a
                            href={`https://wa.me/${whatsappNumber}${whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lpStickyBtn whatsapp"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18" fill="currentColor" aria-hidden="true">
                                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                            </svg>
                            WhatsApp
                        </a>
                    )}
                </div>
            )}

            {/* Quick Plan Modal Popup */}
            <EnquireModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                packageName={selectedPackage} 
            />
        </div>

    );
}
