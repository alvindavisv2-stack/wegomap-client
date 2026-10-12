"use client";

import { useEffect, useState } from 'react';
import { API_URL } from '@/config';

export interface GoogleRating {
    rating: string;
    reviews: string;
}

// Shown immediately and kept if the admin values are empty or the request fails
const DEFAULT_RATING: GoogleRating = { rating: '4.8', reviews: '450' };

// One request shared by every badge on the page
let cached: GoogleRating | null = null;
let pending: Promise<GoogleRating> | null = null;

const loadGoogleRating = (): Promise<GoogleRating> => {
    if (cached) return Promise.resolve(cached);
    if (!pending) {
        pending = fetch(`${API_URL}/options`)
            .then(res => res.json())
            .then(json => {
                const options: { key: string; value: string }[] = json?.success ? json.data : [];
                const rating = options.find(o => o.key === 'google_rating')?.value?.toString().trim();
                const reviews = options.find(o => o.key === 'google_reviews')?.value?.toString().trim();
                cached = {
                    rating: rating || DEFAULT_RATING.rating,
                    reviews: reviews || DEFAULT_RATING.reviews,
                };
                return cached;
            })
            .catch(() => {
                pending = null;
                return DEFAULT_RATING;
            });
    }
    return pending;
};

// Google rating and review count managed in Admin → Site Options → General
export function useGoogleRating(): GoogleRating {
    const [value, setValue] = useState<GoogleRating>(cached || DEFAULT_RATING);

    useEffect(() => {
        let active = true;
        loadGoogleRating().then(v => {
            if (active) setValue(v);
        });
        return () => {
            active = false;
        };
    }, []);

    return value;
}
