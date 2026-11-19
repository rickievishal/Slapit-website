import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Product } from '../models/Product';
import { imageStorageService, parseImageDataUrl } from '../services/imageStorageService';

const migrate = async () => {
  const applyChanges = process.argv.includes('--apply');
  await connectDB();

  let migratedImages = 0;
  let migratedProducts = 0;
  const products = Product.find({
    $or: [{ images: /^data:image\// }, { thumbnail: /^data:image\// }],
  })
    .select('+thumbnail +thumbnailVersion +inventory')
    .cursor();

  for await (const product of products) {
    let changed = false;
    const images: string[] = [];

    for (const image of product.images) {
      const dataUrl = parseImageDataUrl(image);
      if (!dataUrl) {
        images.push(image);
        continue;
      }

      migratedImages++;
      changed = true;
      images.push(
        applyChanges
          ? await imageStorageService.store(
              dataUrl.buffer,
              dataUrl.contentType,
              `product-${product._id}-${images.length}`
            )
          : image
      );
    }

    const thumbnailDataUrl = product.thumbnail ? parseImageDataUrl(product.thumbnail) : null;
    let thumbnail = product.thumbnail;
    if (thumbnailDataUrl) {
      migratedImages++;
      changed = true;
      if (applyChanges) {
        thumbnail = await imageStorageService.store(
          thumbnailDataUrl.buffer,
          thumbnailDataUrl.contentType,
          `thumbnail-${product._id}`
        );
      }
    }

    if (changed) {
      migratedProducts++;
      if (applyChanges) {
        product.images = images;
        product.thumbnail = thumbnail || '';
        await product.save();
      }
    }
  }

  console.log(
    `${applyChanges ? 'Migrated' : 'Found'} ${migratedImages} Base64 image(s) across ${migratedProducts} product(s).`
  );
  if (!applyChanges) {
    console.log('Dry run only. Re-run with --apply to move the images into GridFS.');
  }
};

migrate()
  .catch((error: unknown) => {
    console.error('Product image migration failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
