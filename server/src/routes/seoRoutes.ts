import { Router } from 'express';
import { env } from '../config/env';
import { Category } from '../models/Category';
import { Product } from '../models/Product';

const router = Router();
const SITE_URL = env.SITE_URL.replace(/\/+$/, '');

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    };
    return entities[character];
  });

router.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const [products, categories] = await Promise.all([
      Product.find({ status: 'published' })
        .select('slug updatedAt')
        .sort({ updatedAt: -1 })
        .lean(),
      Category.find().select('slug').sort({ name: 1 }).lean(),
    ]);
    const staticUrls = ['/', '/posters'];
    const entries = [
      ...staticUrls.map((path) => `<url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc></url>`),
      ...categories.map(
        (category) =>
          `<url><loc>${escapeXml(`${SITE_URL}/posters?category=${encodeURIComponent(category.slug)}`)}</loc></url>`
      ),
      ...products.map(
        (product) =>
          `<url><loc>${escapeXml(`${SITE_URL}/posters/${product.slug}`)}</loc><lastmod>${product.updatedAt.toISOString()}</lastmod></url>`
      ),
    ];

    res
      .type('application/xml')
      .set('Cache-Control', 'public, max-age=600')
      .send(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`
      );
  } catch (error) {
    next(error);
  }
});

export default router;
