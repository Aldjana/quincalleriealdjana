import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Product from '../src/models/Product.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/ma-boutique';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isBase64Image(url: string): boolean {
  return url.startsWith('data:image/');
}

function isLocalImage(url: string): boolean {
  return url.startsWith('/images/') || url.includes('localhost:4000/images/');
}

function needsMigration(url: string): boolean {
  return isBase64Image(url) || isLocalImage(url);
}

async function uploadBase64ToCloudinary(base64Data: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      base64Data,
      {
        resource_type: 'auto',
        folder: 'ma-boutique/products',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 800, crop: 'limit' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (!result) {
          reject(new Error('Upload failed'));
        } else {
          resolve(result.secure_url);
        }
      }
    );
  });
}

async function main() {
  console.log('🚀 Starting MongoDB image migration to Cloudinary...\n');

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('✅ Connected to MongoDB\n');

    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products in MongoDB\n`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      console.log(`\n🔄 Processing: ${product.name}`);
      
      let needsUpdate = false;
      const updatedProduct = { ...product.toObject() };

      // Migrer l'image principale
      if (needsMigration(product.image)) {
        try {
          console.log(`  Migrating main image...`);
          const cloudinaryUrl = await uploadBase64ToCloudinary(product.image);
          updatedProduct.image = cloudinaryUrl;
          needsUpdate = true;
          console.log(`  ✓ Uploaded to Cloudinary`);
        } catch (error) {
          console.error(`  ✗ Failed to migrate main image:`, error);
        }
      } else {
        console.log(`  Main image already on Cloudinary or external`);
      }

      // Migrer les images supplémentaires
      if (product.images && product.images.length > 0) {
        const migratedImages: string[] = [];
        
        for (const imageUrl of product.images) {
          if (needsMigration(imageUrl)) {
            try {
              console.log(`  Migrating additional image...`);
              const cloudinaryUrl = await uploadBase64ToCloudinary(imageUrl);
              migratedImages.push(cloudinaryUrl);
              needsUpdate = true;
              console.log(`  ✓ Uploaded to Cloudinary`);
            } catch (error) {
              console.error(`  ✗ Failed to migrate image:`, error);
              migratedImages.push(imageUrl); // Garder l'originale si échec
            }
          } else {
            migratedImages.push(imageUrl);
          }
        }
        
        updatedProduct.images = migratedImages;
      }

      // Mettre à jour le produit si nécessaire
      if (needsUpdate) {
        await Product.findByIdAndUpdate(product._id, updatedProduct);
        console.log(`  ✅ Product updated`);
        migratedCount++;
      } else {
        console.log(`  ⏭️  Skipped (no migration needed)`);
        skippedCount++;
      }
    }

    console.log(`\n✅ Migration completed!`);
    console.log(`📊 Migrated: ${migratedCount} products`);
    console.log(`📊 Skipped: ${skippedCount} products`);
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
