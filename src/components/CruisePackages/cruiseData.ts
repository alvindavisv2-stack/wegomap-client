export interface FeatureCard {
    title: string;
    text?: string;
    meta?: string;
    image?: string;
}

export interface InfoPanel {
    title: string;
    tone: 'yes' | 'no' | 'info';
    items: string[];
    groups?: { label: string; intro?: string; forTabs?: number[]; items: string[] }[];
}

export interface ExcursionRow {
    title: string;
    text: string;
    price: string;
    extra?: string;
    image: string;
}

export interface Excursions {
    kicker: string;
    title: string;
    lead: string;
    image: string;
    rows: ExcursionRow[];
    note: string;
}

export interface ShipFacts {
    kicker: string;
    name: string;
    shipClass: string;
    image: string;
    stats: { value: string; label: string }[];
}

export interface Amenity {
    title: string;
    text: string;
    image: string;
}

export interface CruiseLineSection {
    id: string;
    variant: 'cordelia' | 'royal';
    enquiry: string;
    showEnquire?: boolean;
    detailsKicker: string;
    detailsTitle: string;
    detailsLead: string;
    featureHeading: string;
    features: FeatureCard[];
    panels: InfoPanel[];
    inclSubtitle?: string;
    excursions?: Excursions;
    shipFacts?: ShipFacts;
    amenitiesKicker: string;
    amenitiesTitle: string;
    amenitiesLead: string;
    amenities: Amenity[];
}

const C = '/assets/images/cruise/cordelia/';
const R = '/assets/images/cruise/royal/';

export const cordelia: CruiseLineSection = {
    id: 'cordelia',
    variant: 'cordelia',
    enquiry: 'Enquire for Cordelia Cruises',
    showEnquire: false,
    detailsKicker: 'Cordelia Cruises',
    detailsTitle: "Cordelia Cruises - What's in Your Package",
    detailsLead:
        'Choose from six cabin types. Every cabin includes meals, shows and onboard fun. Higher cabins add extra space and comfort.',
    featureHeading: 'Cabin types',
    features: [
        {
            title: 'Balcony Stateroom',
            meta: 'Up to 3 guests · Cabin 194 sq.ft. · Balcony 25 sq.ft.',
            text: 'Wake up to a private view of the sea. A picture is worth a thousand words, but stunning sunset views are priceless.',
            image: C + 'cabin-balcony.webp',
        },
        {
            title: 'Ocean View Stateroom',
            meta: 'Up to 4 guests · Cabin 142 sq.ft.',
            text: 'Enjoy breathtaking views of the sea with a panoramic window in a comfortable and stylish room.',
            image: C + 'cabin-ocean-view.webp',
        },
        {
            title: 'Interior Stateroom',
            meta: 'Up to 4 guests · Cabin 117 sq.ft.',
            text: 'Relax in a home away from home with our budget-friendly, cosy Interior Stateroom.',
            image: C + 'cabin-interior.webp',
        },
        {
            title: 'Accessible Stateroom',
            meta: 'Cabin 117 - 142 sq.ft.',
            text: 'Guests with mobility challenges can unwind in ultra-comfortable rooms with feature-adapted equipment designed for easy access.',
            image: C + 'cabin-accessible.webp',
        },
        {
            title: 'Suites',
            meta: 'Up to 3 guests · Cabin 303 sq.ft. · Balcony 222 sq.ft.',
            text: 'Sail the high seas with sophistication. Choose a suite with a private balcony for an extraordinary stay.',
            image: C + 'cabin-suite.webp',
        },
        {
            title: "Chairman's Suite",
            meta: 'Apartment-style suite',
            text: 'Our lavish Chairman\'s Suite brings luxury to the high seas, with a gorgeous view of the sea from a wide balcony. Relax in elegance and end the day on a great note.',
            image: C + 'cabin-chairman.webp',
        },
    ],
    panels: [],
    amenitiesKicker: 'Onboard Amenities',
    amenitiesTitle: 'Life Onboard Cordelia Cruises',
    amenitiesLead: 'Food, shows, pools and play for every age, all on one ship.',
    amenities: [
        { title: 'Bollywood-style Shows', text: 'Live entertainment every evening', image: C + 'shows.webp' },
        { title: 'Food Court & Starlight', text: 'Indian, pure veg and Jain options', image: C + 'dining.webp' },
        { title: 'Pool Deck', text: 'Swim and party under the stars', image: C + 'pool-deck.webp' },
        { title: 'Fitness Centre', text: 'Keep your routine at sea', image: C + 'fitness.webp' },
        { title: 'Cordelia Academy', text: 'A play area made for kids', image: C + 'kids-club.webp' },
        { title: 'Disco Night in The Dome', text: 'Dance the night away', image: C + 'disco.webp' },
        { title: 'Lounges', text: 'Relax with sea views', image: C + 'lounges.webp' },
        { title: 'Marquee Theatre', text: 'Big shows, great seats', image: C + 'theatre.webp' },
    ],
};

export const royal: CruiseLineSection = {
    id: 'royal-caribbean',
    variant: 'royal',
    enquiry: 'Enquire for Royal Caribbean',
    detailsKicker: 'Royal Caribbean',
    detailsTitle: 'Royal Caribbean - Navigator of the Seas from Singapore',
    detailsLead:
        'The Singapore season runs from October 2026 to March 2027, with short getaways and long cruises. We can arrange your flights, hotel and cruise together.',
    featureHeading: 'Cruise Packages',
    features: [
        {
            title: '2-Night Weekend Getaway',
            meta: 'Cruise to nowhere',
            image: R + 'itin-ship-sea.webp',
        },
        {
            title: '3-Night Penang',
            meta: 'Penang',
            image: R + 'itin-singapore.webp',
        },
        {
            title: '4-Night Penang & Phuket',
            meta: 'Penang, Phuket',
            image: R + 'itin-pool-deck.webp',
        },
        {
            title: '5-Night Penang, Langkawi & Phuket',
            meta: 'Penang, Langkawi, Phuket',
            image: R + 'itin-deck-night.webp',
        },
        {
            title: '10-Night Thailand & Vietnam',
            meta: 'Ho Chi Minh City, Bangkok, Langkawi',
            image: R + 'bangkok.webp',
        },
        {
            title: '12-Night Singapore to Tokyo',
            meta: 'Hong Kong, Taipei, Nagasaki, Kumamoto, Kagoshima, Tokyo',
            image: R + 'kumamoto.webp',
        },
        {
            title: '12-Night Tokyo to Singapore',
            meta: 'Nagoya, Osaka, Okinawa, Ishigaki, Hong Kong',
            image: R + 'itin-ship-aerial.webp',
        },
    ],
    panels: [],
    amenitiesKicker: 'Onboard Amenities',
    amenitiesTitle: 'Life Onboard Navigator of the Seas',
    amenitiesLead: 'Waterslides, shows, dining and nightlife. The ship is a holiday in itself.',
    amenities: [
        { title: 'The Blaster & Riptide', text: 'Longest waterslide at sea', image: R + 'waterslides.webp' },
        { title: 'FlowRider', text: 'Surf on board', image: R + 'flowrider.webp' },
        { title: 'Amplified Pool Deck', text: 'Pools, splash pad and The Lime & Coconut', image: R + 'pool-deck.webp' },
        { title: 'Ice Skating', text: 'Skate and watch ice shows', image: R + 'ice-skating.webp' },
        { title: 'Broadway-style Shows', text: 'Production shows in the main theatre', image: R + 'shows.webp' },
        { title: 'Dining', text: "Jamie's Italian, Hooked Seafood, Chops Grille, Izumi", image: R + 'dining.webp' },
        { title: 'Bars & Nightlife', text: 'Casino, bars, live music and clubs', image: R + 'nightlife.webp' },
        { title: 'Staterooms', text: 'Interior, Ocean View, Balcony and Suites', image: R + 'staterooms.webp' },
        { title: 'Sports Court', text: 'Pickleball, rock wall, mini golf and an outdoor movie screen', image: R + 'sports-court.webp' },
    ],
};
