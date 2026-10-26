import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShoppingCart, Truck, PhoneCall, Wallet, CheckCircle2, XCircle } from 'lucide-react';
import { getProductId } from '../../config/api';
import { SHOP, whatsappLink } from '../../config/shop';
import { metaPixelEvents } from '../../config/metaPixel';
import { useProduct, useProducts } from '../../hooks/useProducts';
import { useOrder } from '../../hooks/useOrder';
import { formatPrice } from '../../utils/format';
import { ProductGallery } from '../components/ProductGallery';
import { OrderFormModal } from '../components/OrderFormModal';
import { ProductCard, isInStock } from '../components/ProductCard';
import { PageLoader } from '../components/PageLoader';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { QuantityStepper } from '../components/ui/QuantityStepper';
import { SectionHeading } from '../components/ui/SectionHeading';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { product, isLoading } = useProduct(id);
  const { products } = useProducts();
  const { placeOrder, isSubmitting } = useOrder();
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const productId = product ? getProductId(product) : null;

  useEffect(() => {
    setQuantity(1);
  }, [productId]);

  // ViewContent une seule fois par produit consulté
  useEffect(() => {
    if (product && productId) metaPixelEvents.viewContent(product.name, productId, product.price);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    if (product) document.title = `${product.name} — ${SHOP.name}`;
    return () => {
      document.title = `${SHOP.name} — Outillage et matériaux de construction`;
    };
  }, [product]);

  if (isLoading && !product) return <PageLoader label="Chargement du produit…" />;

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-xl font-bold text-navy-900">Produit introuvable</p>
        <p className="text-slate-600">Ce produit n'existe plus ou a été retiré du catalogue.</p>
        <Link to="/products" className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600">
          Voir tous les produits
        </Link>
      </div>
    );
  }

  const inStock = isInStock(product);
  const maxQuantity = product.stock && product.stock > 0 ? product.stock : 999;
  const related = products
    .filter((p) => p.category === product.category && getProductId(p) !== productId)
    .slice(0, 5);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast({
      type: 'success',
      title: 'Ajouté au panier',
      description: `${quantity} × ${product.name}`,
    });
  };

  const whatsappMessage = `Bonjour ${SHOP.name}, je souhaite commander :\n- ${quantity} × ${product.name} (${formatPrice(product.price)})\nTotal : ${formatPrice(product.price * quantity)}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:px-6">
      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' },
          { label: product.category, to: `/products?categorie=${encodeURIComponent(product.category)}` },
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery product={product} />

        <div className="min-w-0">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">{product.category}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">{product.name}</h1>

          <p className="mt-4 text-3xl font-bold tabular-nums text-brand-600">{formatPrice(product.price)}</p>

          <p className={`mt-3 inline-flex items-center gap-1.5 text-sm font-medium ${inStock ? 'text-emerald-700' : 'text-rose-700'}`}>
            {inStock ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {inStock ? (product.stock && product.stock <= 5 ? `Plus que ${product.stock} en stock` : 'En stock') : 'Rupture de stock'}
          </p>

          {product.description && (
            <p className="mt-5 whitespace-pre-line leading-relaxed text-slate-600">{product.description}</p>
          )}

          <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <QuantityStepper value={quantity} onChange={setQuantity} max={maxQuantity} />
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <ShoppingCart className="h-5 w-5" />
                Ajouter au panier
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowOrderForm(true);
                metaPixelEvents.initiateCheckout(product.price * quantity, quantity);
              }}
              disabled={!inStock}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-navy-800 text-sm font-semibold text-white transition hover:bg-navy-900 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Commander maintenant — {formatPrice(product.price * quantity)}
            </button>
            <a
              href={whatsappLink(whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-whatsapp text-sm font-semibold text-white transition hover:bg-whatsapp-dark"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Commander sur WhatsApp
            </a>
          </div>

          <ul className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
            <Perk icon={<Truck className="h-5 w-5" />} title="Livraison" text="Partout au Sénégal" />
            <Perk icon={<PhoneCall className="h-5 w-5" />} title="Confirmation" text="Par téléphone" />
            <Perk icon={<Wallet className="h-5 w-5" />} title="Paiement" text="À la livraison" />
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <SectionHeading
            title="Dans la même catégorie"
            linkTo={`/products?categorie=${encodeURIComponent(product.category)}`}
            linkLabel="Voir tout"
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {related.map((p) => (
              <ProductCard key={getProductId(p)} product={p} />
            ))}
          </div>
        </section>
      )}

      {showOrderForm && (
        <OrderFormModal
          title={`${quantity} × ${product.name}`}
          isSubmitting={isSubmitting}
          onClose={() => setShowOrderForm(false)}
          onSubmit={(customer) => placeOrder(customer, [{ product, quantity }])}
          summary={
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">Total</span>
              <span className="text-lg font-bold text-navy-900">{formatPrice(product.price * quantity)}</span>
            </div>
          }
        />
      )}
    </div>
  );
};

function Perk({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="text-navy-700">{icon}</span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold text-slate-900">{title}</span>
        <span className="text-xs text-slate-500">{text}</span>
      </span>
    </li>
  );
}
