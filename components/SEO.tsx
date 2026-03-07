import { FC } from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
}

export const SEO: FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogType = "website",
}) => {
  const fullTitle = `${title} | FAINL`;
  const siteUrl = "https://fainl.com"; // Adjust if necessary

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={`${siteUrl}${canonical}`} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:url" content={`${siteUrl}${canonical || ""}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || description} />
    </Helmet>
  );
};
