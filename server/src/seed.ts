import mongoose from 'mongoose';
import { connectDB } from './config/db';
import { Category } from './models/Category';
import { Product } from './models/Product';
import { User } from './models/User';

const seed = async () => {
  await connectDB();
  console.log('🌱 Starting seed...');

  // Clear existing
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    User.deleteMany({}),
  ]);
  console.log('🧹 Cleared existing data');

  // 1. Admin User
  const admin = new User({
    name: 'Admin',
    email: 'admin@slapit.com',
    passwordHash: 'admin123',
    role: 'admin',
  });
  await admin.save();
  console.log('👤 Admin user created (admin@slapit.com / admin123)');

  // 2. Categories
  const categoryData = [
    { name: 'Art', slug: 'art', description: 'Contemporary, abstract, and fine aesthetic posters' },
    { name: 'Movies', slug: 'movies', description: 'Cult classics, cinematic masterpieces, and cinema icons' },
    { name: 'Music', slug: 'music', description: 'Album covers, musical legends, and vintage tour art' },
    { name: 'Sports', slug: 'sports', description: 'Championship moments, football & basketball legends' },
    { name: 'Typography', slug: 'typography', description: 'Bold letters, editorial typography, and brutalist layouts' },
  ];

  const createdCategories: Record<string, any> = {};
  for (const cat of categoryData) {
    const created = await Category.create(cat);
    createdCategories[cat.name] = created;
  }
  console.log('📁 Categories created:', Object.keys(createdCategories));

  // 3. Products matching visual design & specs
  // Using curated Unsplash poster-style photography & graphic artwork
  const products: Array<{
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    category: any;
    tags: string[];
    sizes: string[];
    featured: boolean;
    status: 'draft' | 'published';
  }> = [
    {
      name: 'Neon City',
      slug: 'neon-city',
      description: 'A vibrant, retro-inspired city poster that brings instant energy to your space. Printed on premium matte paper with rich, lasting colours.',
      price: 499,
      images: [
        'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=800&auto=format&fit=crop',
      ],
      category: createdCategories['Art']._id,
      tags: ['neon', 'cyberpunk', 'tokyo', 'retro', 'cityscape'],
      sizes: ['A4', 'A3', 'A2'],
      featured: true,
      status: 'published',
    },
    {
      name: 'Money Moves',
      slug: 'money-moves',
      description: 'Bold collage artwork depicting the hustle and iconic pop culture iconography. High contrast print on 300 GSM cardstock.',
      price: 399,
      images: [
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
      ],
      category: createdCategories['Art']._id,
      tags: ['hustle', 'collage', 'streetwear', 'vintage'],
      sizes: ['A4', 'A3', 'A2'],
      featured: true,
      status: 'published',
    },
    {
      name: 'The GOAT',
      slug: 'the-goat',
      description: 'Tribute to football and sporting greatness. Dynamic textured illustration capturing sheer legend status on archival matte paper.',
      price: 449,
      images: [
        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
      ],
      category: createdCategories['Sports']._id,
      tags: ['football', 'goat', 'legend', 'sports', 'stadium'],
      sizes: ['A4', 'A3', 'A2'],
      featured: true,
      status: 'published',
    },
    {
      name: 'Luffy',
      slug: 'luffy',
      description: 'Gear up your walls with the future King of the Pirates. Vibrant anime art with bold ink lines and golden hue finish.',
      price: 449,
      images: [
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
      ],
      category: createdCategories['Art']._id,
      tags: ['anime', 'onepiece', 'manga', 'strawhat'],
      sizes: ['A4', 'A3', 'A2'],
      featured: false,
      status: 'published',
    },
    {
      name: 'Blond',
      slug: 'blond',
      description: 'Minimalist editorial interpretation of an all-time classic record. Subtle green tones, warm aesthetic, and clean studio typography.',
      price: 399,
      images: [
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
      ],
      category: createdCategories['Music']._id,
      tags: ['frank', 'album', 'music', 'minimalist', 'rnb'],
      sizes: ['A4', 'A3', 'A2'],
      featured: false,
      status: 'published',
    },
    {
      name: 'Interstellar',
      slug: 'interstellar',
      description: 'Gargantua cosmic majesty printed with deep star-black pigments. An ode to time, space, and Nolan cinematic scale.',
      price: 499,
      images: [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
      ],
      category: createdCategories['Movies']._id,
      tags: ['space', 'sci-fi', 'nolan', 'blackhole', 'movies'],
      sizes: ['A4', 'A3', 'A2'],
      featured: false,
      status: 'published',
    },
    {
      name: 'Spider Man',
      slug: 'spider-man',
      description: 'Into the multiverse with comic halftone textures and electrifying red-and-blue CMYK offset vibes.',
      price: 449,
      images: [
        'https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=800&auto=format&fit=crop',
      ],
      category: createdCategories['Movies']._id,
      tags: ['spiderman', 'marvel', 'comics', 'superhero'],
      sizes: ['A4', 'A3', 'A2'],
      featured: false,
      status: 'published',
    },
    {
      name: 'Joker',
      slug: 'joker',
      description: 'Haunting emerald green and purple staircase portrayal. Cinematic mood piece for bold interior walls.',
      price: 399,
      images: [
        'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800&auto=format&fit=crop',
      ],
      category: createdCategories['Movies']._id,
      tags: ['joker', 'cinema', 'dc', 'stairs', 'villain'],
      sizes: ['A4', 'A3', 'A2'],
      featured: false,
      status: 'published',
    },
    {
      name: 'Bold Type',
      slug: 'bold-type',
      description: 'A statement piece built for bold rooms, bright spaces, and confident walls. Graphic brutalist editorial composition.',
      price: 499,
      images: [
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
      ],
      category: createdCategories['Typography']._id,
      tags: ['typography', 'editorial', 'modern', 'bold', 'graphic'],
      sizes: ['A4', 'A3', 'A2'],
      featured: true,
      status: 'published',
    },
    {
      name: 'Print Lab',
      slug: 'print-lab',
      description: 'A clean, graphic poster that works just as well in a studio or bedroom. Swiss style grid typography and CMYK test marks.',
      price: 499,
      images: [
        'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop',
      ],
      category: createdCategories['Typography']._id,
      tags: ['swiss', 'grid', 'bauhaus', 'lab', 'design'],
      sizes: ['A4', 'A3', 'A2'],
      featured: true,
      status: 'published',
    },
    {
      name: 'Slam Dunk',
      slug: 'slam-dunk',
      description: 'Airborne silhouette captured mid-dunk against stadium arc lights. Heavy grain monochrome with electric gold accents.',
      price: 399,
      images: [
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop',
      ],
      category: createdCategories['Sports']._id,
      tags: ['basketball', 'dunk', 'nba', 'jump', 'court'],
      sizes: ['A4', 'A3', 'A2'],
      featured: false,
      status: 'published',
    },
    {
      name: 'Vinyl Vibes',
      slug: 'vinyl-vibes',
      description: 'Warm analog groove art. Retro turntable typography and 70s Japanese jazz cafe record aesthetic.',
      price: 449,
      images: [
        'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop',
      ],
      category: createdCategories['Music']._id,
      tags: ['vinyl', 'jazz', 'analog', 'retro', 'music'],
      sizes: ['A4', 'A3', 'A2'],
      featured: false,
      status: 'published',
    },
  ];

  for (const p of products) {
    await Product.create(p);
  }
  console.log(`🖼️  Seeded ${products.length} products`);

  console.log('✨ Seed completed successfully!');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
