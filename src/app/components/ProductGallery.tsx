import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type Product } from '../../config/api';
import { getProductImages } from '../../utils/productImages';

export const ProductGallery = ({ product }: { product: Product }) => {
  const images = getProductImages(product);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [product._id, product.id, images.length]);

  const activeImage = images[activeIndex] ?? images[0];
  const showNavigation = images.length > 1;
  const go = (delta: number) => setActiveIndex((current) => (current + delta + images.length) % images.length);

  return (
    <div className="w-full space-y-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <img key={activeImage} src={activeImage} alt={`${product.name} — photo ${activeIndex + 1}`} className="h-full w-full object-cover" />

        {showNavigation && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-md transition hover:bg-white"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-md transition hover:bg-white"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {showNavigation && (
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={`${img}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Voir la photo ${index + 1}`}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-slate-50 transition sm:h-20 sm:w-20 ${
                activeIndex === index ? 'border-brand-500' : 'border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
