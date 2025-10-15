import React from "react";
import { Head } from "@inertiajs/react";
import { Header, Footer } from "@/Components/CommonComponent";

export default function PublicLayout({
    children,
    title = "Serve Cafe - Best Cafe in Kathmandu | Restaurant in Khumaltar",
    description = "Serve Cafe - The premier cafe and restaurant in Kathmandu, Nepal. Located in Khumaltar, we offer delicious food, digital wallet services, and referral programs. Experience the best dining in Kathmandu.",
    keywords = "serve cafe, cafe in kathmandu, restaurant in khumaltar, restaurant in kathmandu, best cafe nepal, digital wallet, referral program, food delivery kathmandu, dining kathmandu, coffee shop kathmandu",
    canonical = null,
}) {
    return (
        <div
            className="min-h-screen flex flex-col bg-base-100"
            data-theme="light"
        >
            <Head title={title}>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content="Serve Cafe" />
                <meta name="robots" content="index, follow" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta
                    property="og:url"
                    content={canonical || window.location.href}
                />
                <meta property="og:site_name" content="Serve Cafe" />
                <meta property="og:locale" content="en_US" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />

                {/* Canonical URL */}
                {canonical && <link rel="canonical" href={canonical} />}

                {/* Additional SEO */}
                <meta name="geo.region" content="NP" />
                <meta name="geo.placename" content="Kathmandu, Nepal" />
                <meta name="geo.position" content="27.7172;85.3240" />
                <meta name="ICBM" content="27.7172, 85.3240" />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Restaurant",
                        name: "Serve Cafe",
                        description:
                            "Premier cafe and restaurant in Kathmandu, Nepal offering delicious food, digital wallet services, and referral programs.",
                        url: canonical || window.location.href,
                        telephone: "+977-9766389515",
                        address: {
                            "@type": "PostalAddress",
                            streetAddress: "Lalitpur 14 Khumaltar",
                            addressLocality: "Kathmandu",
                            addressCountry: "Nepal",
                        },
                        geo: {
                            "@type": "GeoCoordinates",
                            latitude: "27.7172",
                            longitude: "85.3240",
                        },
                        openingHours: "Mo-Fr 09:00-18:00, Sa 10:00-16:00",
                        servesCuisine: [
                            "International",
                            "Local",
                            "Coffee",
                            "Beverages",
                        ],
                        priceRange: "$$",
                        paymentAccepted: "Cash, Digital Wallet, Credit Card",
                    })}
                </script>
            </Head>

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
