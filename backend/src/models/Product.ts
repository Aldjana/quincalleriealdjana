import mongoose from 'mongoose';

export interface ProductDocument {
  name: string;
  category: string;
  price: number;
  image: string;
  images?: string[];
  description?: string;
  rating: number;
  stock?: number;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    image: {
      type: String,
      required: true,
      default: 'https://images.unsplash.com/photo-1581093616143-1b29f99148d6?auto=format&fit=crop&w=800&q=85',
    },
    description: { type: String, default: '' },
    rating: { type: Number, required: true, default: 4.5 },
    stock: { type: Number, required: true, default: 0 },
    featured: { type: Boolean, default: false },
    images: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<ProductDocument>('Product', productSchema);
export default Product;
