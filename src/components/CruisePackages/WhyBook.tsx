import Image from 'next/image';

const reasons = [
    {
        title: 'Indian and international cruises',
        text: "Sail on Cordelia from India, or on Royal Caribbean's Navigator of the Seas from Singapore with 2 to 12 night cruises from October 2026 to March 2027.",
    },
    {
        title: 'Six cabin types to choose from',
        text: "Interior, Ocean View, Balcony, Accessible, Suites and the Chairman's Suite, so there is a room for every budget and group.",
    },
    {
        title: 'A package that covers the basics',
        text: 'Accommodation, meals, shows, pool, fitness centre, travel insurance, service charges, levies and GST are all part of the Cordelia fare.',
    },
    {
        title: 'Lower rates when you book ahead',
        text: 'Lakshadweep shore excursions start at USD 25. Advance booking rates are lower than on-board rates for most tours.',
    },
    {
        title: 'Know before you go',
        text: 'Lakshadweep is plastic-free and dry, only Airtel and BSNL work there, and cards and UPI are not accepted. Carry cash and pre-book your shore excursion.',
    },
];

export default function WhyBook() {
    return (
        <section className="cpWhy commonPadding">
            <div className="homeContainer">
                <div className="sectionHeader">
                    <span className="sectionSubtitle">Why Wegomap</span>
                    <h2 className="sliderTitle">Why Book Your Cruise Package with Wegomap?</h2>
                </div>

                <div className="cpWhyLayout">
                    <div className="cpWhyPhoto">
                        <Image
                            src="/assets/images/cruise/cordelia/ship-sunny.webp"
                            alt="Cordelia cruise ship sailing on a blue sea"
                            fill
                            sizes="(max-width: 991px) 100vw, 45vw"
                        />
                    </div>

                    <ol className="cpWhyList">
                        {reasons.map((r, i) => (
                            <li key={r.title} className="cpWhyRow">
                                <span className="cpWhyIndex">{String(i + 1).padStart(2, '0')}</span>
                                <div>
                                    <h3>{r.title}</h3>
                                    <p>{r.text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}
