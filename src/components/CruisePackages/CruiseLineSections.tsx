"use client";

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useState } from 'react';
import {
    Anchor, ArrowRight, BedDouble, Baby, ChevronRight, ConciergeBell, Drama, Info, ShieldCheck,
    Sparkles, Utensils, Waves, Wine, X, Armchair, PartyPopper, Luggage, Droplets, BadgeCheck, Wifi, Shirt, Ship,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';
import type { CruiseLineSection } from './cruiseData';

const iconRules: [RegExp, LucideIcon][] = [
    [/porter/i, Luggage],
    [/water bottle/i, Droplets],
    [/toiletr|dental/i, Sparkles],
    [/bridge/i, Ship],
    [/captain/i, Anchor],
    [/butler/i, ConciergeBell],
    [/priority/i, BadgeCheck],
    [/wi-?fi/i, Wifi],
    [/laundry/i, Shirt],
    [/marquee|burlesque/i, Drama],
    [/breakfast|lunch/i, Utensils],
    [/accommodation|cabin/i, BedDouble],
    [/meal|dining|food/i, Utensils],
    [/beverage|drink/i, Wine],
    [/party|disco/i, PartyPopper],
    [/lounge|public area/i, Armchair],
    [/pool|fitness/i, Waves],
    [/entertainment|show|music/i, Drama],
    [/academy|kids/i, Baby],
    [/insurance/i, ShieldCheck],
    [/service|gst|charges/i, ConciergeBell],
];

const pickIcon = (text: string): LucideIcon => iconRules.find(([re]) => re.test(text))?.[1] ?? Sparkles;

export default function CruiseLineSections({
    data,
    part = 'all',
}: {
    data: CruiseLineSection;
    // lets the page place other sections between the details and the amenities
    part?: 'all' | 'details' | 'amenities';
}) {
    const { openEnquiry } = useEnquiry();
    const [inclTab, setInclTab] = useState(0);
    const yesPanel = data.panels.find((p) => p.tone === 'yes');
    const noPanel = data.panels.find((p) => p.tone === 'no');
    const infoPanels = data.panels.filter((p) => p.tone === 'info');
    // Exclusions follow the cabin type chosen in the Inclusions tabs
    const exclusionGroup =
        noPanel?.groups?.find((g) => g.forTabs?.includes(inclTab)) ?? noPanel?.groups?.[0];
    const exclusionItems = exclusionGroup?.items ?? noPanel?.items ?? [];

    return (
        <>
            {/* Details */}
            {part !== 'amenities' && (
            <section id={data.id} className={`cpDetails ${data.variant}`}>
                <div className="homeContainer">
                    <div className="sectionHeader">
                        <span className="sectionSubtitle">{data.detailsKicker}</span>
                        <h2 className="sliderTitle">{data.detailsTitle}</h2>
                        <p className="sectionHeaderDescription">{data.detailsLead}</p>
                    </div>

                    <h3 className="cpSubHeading">{data.featureHeading}</h3>
                    <Swiper
                        className="cpSlider"
                        modules={[Autoplay, Pagination, A11y]}
                        spaceBetween={16}
                        slidesPerView={1.15}
                        autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        pagination={{ el: `.cp-progress-${data.id}`, type: 'progressbar' }}
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 24 },
                            1100: { slidesPerView: 3, spaceBetween: 30 },
                        }}
                    >
                        {data.features.map((f, i) => (
                            <SwiperSlide key={f.title}>
                                <article className="cpFeature">
                                    {f.image && (
                                        <Image src={f.image} alt={f.title} fill sizes="(max-width: 640px) 85vw, (max-width: 1100px) 50vw, 33vw" className="cpImg" />
                                    )}
                                    <span className="cpFeatureNo">{String(i + 1).padStart(2, '0')}</span>
                                    <div className="cpFeatureGlass">
                                        {f.meta && <span className="cpFeatureMeta">{f.meta}</span>}
                                        <h4>{f.title}</h4>
                                        {f.text && <p>{f.text}</p>}
                                    </div>
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="sliderNavigation cpSliderNav">
                        <div className="progressWrapper">
                            <div className={`customPagination cp-progress-${data.id}`}></div>
                        </div>
                    </div>


                    {(yesPanel || noPanel || data.excursions || data.shipFacts || infoPanels.length > 0) && (
                    <div className="cpPanels">
                        {(yesPanel || noPanel) && (
                            <div className="cpIncl">
                                {yesPanel && (
                                    <>
                                        <div className="cpInclHead">
                                            <Image src="/assets/images/cruise/cordelia/inclusions-bg.webp" alt="" fill sizes="900px" className="cpImg cpImgRight" />
                                            <div>
                                                <h4>{yesPanel.title}</h4>
                                                {data.inclSubtitle && <p>{data.inclSubtitle}</p>}
                                            </div>
                                        </div>
                                        {yesPanel.groups && yesPanel.groups.length > 1 && (
                                            <div className="cpInclTabs" role="tablist">
                                                {yesPanel.groups.map((g, i) => (
                                                    <button
                                                        key={g.label}
                                                        type="button"
                                                        role="tab"
                                                        aria-selected={i === inclTab}
                                                        className={i === inclTab ? 'active' : ''}
                                                        onClick={() => setInclTab(i)}
                                                    >
                                                        {g.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {yesPanel.groups?.[inclTab]?.intro && (
                                            <p className="cpInclIntro">{yesPanel.groups[inclTab].intro}</p>
                                        )}
                                        <ul className="cpInclRows">
                                            {(yesPanel.groups?.[inclTab]?.items ?? yesPanel.items).map((item) => {
                                                const Icon = pickIcon(item);
                                                return (
                                                    <li key={item}>
                                                        <span className="cpInclIcon"><Icon size={19} /></span>
                                                        <span className="cpInclText">{item}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </>
                                )}

                                {noPanel && (
                                    <div className="cpNot">
                                        <h5>
                                            <span><X size={14} strokeWidth={3} /></span> {noPanel.title}
                                            {exclusionGroup && <em>({exclusionGroup.label})</em>}
                                        </h5>
                                        <ul>
                                            {exclusionItems.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {data.excursions && (
                            <aside className="cpExcur">
                                <div className="cpExcurHead">
                                    <Image src={data.excursions.image} alt={data.excursions.title} fill sizes="(max-width: 1279px) 100vw, 40vw" className="cpImg cpImgRight" />
                                    <h4>{data.excursions.title}</h4>
                                    <p>{data.excursions.lead}</p>
                                </div>
                                <div className="cpExcurBody">
                                    {data.excursions.rows.map((r) => (
                                        <div key={r.title} className="cpExcurRow">
                                            <div className="cpExcurImg">
                                                <Image src={r.image} alt={r.title} fill sizes="90px" className="cpImg" />
                                            </div>
                                            <div className="cpExcurCard">
                                                <span className="cpExcurIcon"><Anchor size={18} /></span>
                                                <div className="cpExcurInfo">
                                                    <h5>{r.title}</h5>
                                                    <p>{r.text}</p>
                                                </div>
                                                <div className="cpExcurPrice">
                                                    <b>{r.price}</b>
                                                    {r.extra && <small>{r.extra}</small>}
                                                </div>
                                                <ChevronRight size={18} className="cpExcurGo" />
                                            </div>
                                        </div>
                                    ))}
                                    <p className="cpExcurNote"><Info size={14} /> {data.excursions.note}</p>
                                </div>
                            </aside>
                        )}

                        {data.shipFacts && (
                            <aside className="cpShip">
                                <div className="cpShipHead">
                                    <Image src={data.shipFacts.image} alt={data.shipFacts.name} fill sizes="(max-width: 1279px) 100vw, 40vw" className="cpImg" />
                                    <span>{data.shipFacts.kicker}</span>
                                    <h4>{data.shipFacts.name}</h4>
                                    <p>{data.shipFacts.shipClass}</p>
                                </div>
                                <div className="cpShipBody">
                                    <div className="cpShipStats">
                                        {data.shipFacts.stats.map((s) => (
                                            <div key={s.label}>
                                                <b>{s.value}</b>
                                                <small>{s.label}</small>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        )}

                        {infoPanels.map((p) => (
                            <aside key={p.title} className="cpFacts">
                                <h4>{p.title}</h4>
                                <ul>
                                    {p.items.map((n) => (
                                        <li key={n}><Info size={15} /> {n}</li>
                                    ))}
                                </ul>
                            </aside>
                        ))}
                    </div>
                    )}

                    {data.showEnquire !== false && (
                        <div className="cpDetailsCta">
                            <button className="cpCardBtn" onClick={() => openEnquiry(data.enquiry)}>
                                {data.enquiry} <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </section>
            )}

            {/* Amenities */}
            {part !== 'details' && (
            <section className={`cpAmenities ${data.variant}`}>
                <div className="homeContainer">
                    <div className="sectionHeader">
                        <span className="sectionSubtitle">{data.amenitiesKicker}</span>
                        <h2 className="sliderTitle">{data.amenitiesTitle}</h2>
                        <p className="sectionHeaderDescription">{data.amenitiesLead}</p>
                    </div>

                    <Swiper
                        className="cpSlider cpAmenitySlider"
                        modules={[Autoplay, Pagination, A11y]}
                        spaceBetween={12}
                        slidesPerView={2}
                        autoplay={{ delay: 2800, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        pagination={{ el: `.cp-progress-amen-${data.id}`, type: 'progressbar' }}
                        breakpoints={{
                            640: { slidesPerView: 2.6, spaceBetween: 16 },
                            992: { slidesPerView: 4, spaceBetween: 18 },
                            1280: { slidesPerView: 6, spaceBetween: 16 },
                        }}
                    >
                        {data.amenities.map((a) => (
                            <SwiperSlide key={a.title}>
                                <article className="cpAmenity">
                                    <Image src={a.image} alt={a.title} fill sizes="(max-width: 575px) 60vw, 25vw" className="cpImg" />
                                    <div className="cpAmenityGlass">
                                        <h4>{a.title}</h4>
                                        <p>{a.text}</p>
                                    </div>
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="sliderNavigation cpSliderNav">
                        <div className="progressWrapper">
                            <div className={`customPagination cp-progress-amen-${data.id}`}></div>
                        </div>
                    </div>
                </div>
            </section>
            )}
        </>
    );
}
