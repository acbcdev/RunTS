
import { describe } from 'node:test';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  author?: string;
  url?: string;
  image?: string;
  type?: string; // 'website', 'article', etc.
  locale?: string; // e.g., 'en_US'
  siteName?: string;
  twitterUsername?: string; // Twitter handle, e.g., '@example'
}
const defaultProps = {
  description: 'A TypeScript playground for running typescript code with:  Themes, Auto-refresh,  Live execution, Open Source, Open to contributions',
  keywords: 'typescript,playground,editor,code,javascript,ts,js,themes',
  author: 'acbc.dev',
  url: 'https://runts.acbc.app',
  image: '/runts.webp',
  type: 'website',
  locale: 'en_US',
  siteName: 'RunTS',
  twitterUsername: '@acbcdotdev',
}
const SEO = ({
  title,
  description = defaultProps.description,
  keywords = defaultProps.keywords,
  author = defaultProps.author,
  url = defaultProps.url,
  image = defaultProps.image,
  type = defaultProps.type,
  locale = defaultProps.locale,
  siteName = defaultProps.siteName,
  twitterUsername = defaultProps.twitterUsername,
}: SEOProps) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {twitterUsername && <meta name="twitter:site" content={twitterUsername} />}
      {twitterUsername && <meta name="twitter:creator" content={twitterUsername} />}

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
