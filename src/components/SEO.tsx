import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Flagstaff Escapes';
const SITE_URL = 'https://flagstaffescapes.lovable.app';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export const SEO = ({
  title,
  description = 'Luxury vacation rentals in Flagstaff, Arizona. Your gateway to the Grand Canyon. Handpicked cabins and mountain homes with stunning views and premium amenities.',
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  jsonLd,
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Luxury Vacation Rentals in Flagstaff, AZ`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined;

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Flagstaff Escapes',
    description: 'Premier vacation rental management company in Flagstaff, Arizona, near the Grand Canyon.',
    url: SITE_URL,
    telephone: '360-775-0592',
    email: 'info@flagstaffescapes.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Flagstaff',
      addressRegion: 'AZ',
      addressCountry: 'US',
    },
    image: DEFAULT_OG_IMAGE,
    priceRange: '$$$',
    openingHours: 'Mo-Sa 09:00-18:00',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/properties?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const allJsonLd = [organizationSchema, websiteSchema, ...(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [])];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {allJsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
