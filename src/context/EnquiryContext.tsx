"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import EnquireModal from '@/components/EnquireModal';

// The popup opens by itself once, this long after the visitor arrives
const AUTO_OPEN_DELAY_MS = 30000;
// Set when the popup is closed, so it doesn't come back for the rest of the browser session
const DISMISSED_KEY = 'wegomap_enquiry_dismissed';

const wasDismissed = (): boolean => {
    try {
        return !!sessionStorage.getItem(DISMISSED_KEY);
    } catch {
        return false;
    }
};

interface EnquiryContextType {
    openEnquiry: (packageName?: string) => void;
    closeEnquiry: () => void;
    hideLayout: boolean;
    setHideLayout: (hide: boolean) => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [pkgName, setPkgName] = useState('General Inquiry');
    const [hideLayout, setHideLayout] = useState(false);

    const openEnquiry = (packageName?: string) => {
        setPkgName(packageName || 'General Inquiry');
        setIsOpen(true);
    };

    const closeEnquiry = () => {
        setIsOpen(false);
        try {
            sessionStorage.setItem(DISMISSED_KEY, '1');
        } catch {}
    };

    // Open the popup automatically 30 seconds after arrival, unless it was already closed this session.
    // Not on admin or login pages.
    const pathname = usePathname();
    const isOpenRef = useRef(isOpen);
    const pathnameRef = useRef(pathname);
    isOpenRef.current = isOpen;
    pathnameRef.current = pathname;

    useEffect(() => {
        if (wasDismissed()) return;

        const timer = setTimeout(() => {
            const path = pathnameRef.current || '';
            const skip = path.startsWith('/admin') || path === '/login';
            if (!skip && !isOpenRef.current && !wasDismissed()) {
                setPkgName('General Inquiry');
                setIsOpen(true);
            }
        }, AUTO_OPEN_DELAY_MS);

        return () => clearTimeout(timer);
    }, []);

    return (
        <EnquiryContext.Provider value={{ openEnquiry, closeEnquiry, hideLayout, setHideLayout }}>
            {children}
            <EnquireModal 
                isOpen={isOpen} 
                onClose={closeEnquiry} 
                packageName={pkgName} 
            />
        </EnquiryContext.Provider>
    );
}

export function useEnquiry() {
    const context = useContext(EnquiryContext);
    if (context === undefined) {
        throw new Error('useEnquiry must be used within an EnquiryProvider');
    }
    return context;
}
