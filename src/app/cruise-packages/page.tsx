"use client";



import Image from 'next/image';
import { Search, Ship, Anchor, Waves, MapPin, Wind, Sparkles, X, ShieldCheck, Utensils, Zap, Clock, Coffee, CheckCircle, AlertTriangle } from 'lucide-react';
import CruiseHero from '@/components/CruisePackages/CruiseHero';
import CruiseLines from '@/components/CruisePackages/CruiseLines';
import CruiseLineSections from '@/components/CruisePackages/CruiseLineSections';
import { cordelia, royal } from '@/components/CruisePackages/cruiseData';
import WhyBook from '@/components/CruisePackages/WhyBook';
import CordeliaDestinations from '@/components/CruisePackages/CordeliaDestinations';
import CruiseFaq from '@/components/CruisePackages/CruiseFaq';
import CruiseFinalCta from '@/components/CruisePackages/CruiseFinalCta';
import { useEnquiry } from '@/context/EnquiryContext';

export default function CruisesListingPage() {
    const { openEnquiry } = useEnquiry();
  

    return (
        <div className="cruises-listing-wrapper">
            <CruiseHero />
            <CruiseLines />
            <CruiseLineSections data={cordelia} part="details" />
            <CruiseLineSections data={cordelia} part="amenities" />
            <CordeliaDestinations />
            <CruiseLineSections data={royal} />
            <WhyBook />
            <CruiseFaq />
            <CruiseFinalCta />

        </div>
    );
}
