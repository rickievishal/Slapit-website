import { useEffect } from 'react';

const DEFAULT_SITE_URL = 'https://slapitposters.itsmevishal.in';

export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL
).replace(/\/+$/, '');

interface PageSeo {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'product';
  structuredData?: Record<string, unknown>;
}

const setMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`
  );
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

export const usePageSeo = ({
  title,
  description,
  path,
  image,
  type = 'website',
  structuredData,
}: PageSeo) => {
  useEffect(() => {
    const canonicalUrl = new URL(path, `${SITE_URL}/`).href;
    const imageUrl = image || `${SITE_URL}/logo-slapit.png`;

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', 'index, follow, max-image-preview:large');
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', 'Slap It Posters');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', imageUrl);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', imageUrl);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    let jsonLd = document.head.querySelector<HTMLScriptElement>(
      'script[data-page-structured-data]'
    );
    if (structuredData) {
      if (!jsonLd) {
        jsonLd = document.createElement('script');
        jsonLd.type = 'application/ld+json';
        jsonLd.dataset.pageStructuredData = 'true';
        document.head.appendChild(jsonLd);
      }
      jsonLd.textContent = JSON.stringify(structuredData).replace(/</g, '\\u003c');
    } else {
      jsonLd?.remove();
    }
  }, [title, description, path, image, type, structuredData]);
};

export const absoluteSiteUrl = (path: string) => new URL(path, `${SITE_URL}/`).href;
