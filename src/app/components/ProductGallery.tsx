import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type Product } from '../../config/api';
import { getProductImages } from '../../utils/productImages';

interface ProductGalleryProps {
  product: Product;
  variant?: 'detail' | 'compact';
}

export const ProductGallery = ({ product, variant = 'detail' }: ProductGalleryProps) => {
  const images = getProductImages(product);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [product._id, product.id, product.name, images.length]);

  const activeImage = images[activeIndex] ?? images[0];
  const showNavigation = images.length > 1;

  const handlePrev = () => {
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % images.length);
  };

  if (variant === 'compact') {
    return (
      <img
        src={activeImage}
        alt={product.name}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-lg sm:aspect-square md:min-h-[320px] lg:min-h-[420px]">
        <img
          key={activeImage}
          src={activeImage}
          alt={`${product.name} — photo ${activeIndex + 1}`}
          className="h-full w-full object-cover transition-opacity duration-300"
        />

        {showNavigation && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {showNavigation && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={`${img}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Voir la photo ${index + 1}`}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-24 sm:w-24 ${
                activeIndex === index
                  ? 'border-orange-500 ring-2 ring-orange-500/30'
                  : 'border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
