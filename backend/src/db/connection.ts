import mongoose from 'mongoose';

let useFileStore = false;

export function isUsingFileStore(): boolean {
  return useFileStore;
}

export async function connectDatabase(mongoUri: string): Promise<void> {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });
    useFileStore = false;
    console.log('Connecté à MongoDB');
  } catch (error) {
    useFileStore = true;
    console.warn('MongoDB indisponible — mode fichier local activé (data/products.json)');
    console.warn(
      'Pour MongoDB Atlas : autorisez votre IP dans Network Access sur https://cloud.mongodb.com'
    );
    if (error instanceof Error) {
      console.warn(error.message);
    }
  }
}

export function getStorageMode(): 'mongodb' | 'file' {
  return useFileStore ? 'file' : 'mongodb';
}
