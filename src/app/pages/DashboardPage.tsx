import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { productsAPI, type Product } from '../../config/api';

interface DashboardPageProps {
  setCurrentPage: (page: string) => void;
}

export const DashboardPage = ({ setCurrentPage }: DashboardPageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 1,
    rating: 4.5,
    image: '',
    description: '',
    featured: false,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      setProducts(data);
      setError('');
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les produits. Vérifiez que le backend est lancé.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox'
        ? checked
        : name === 'price' || name === 'stock' || name === 'rating'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.category.trim() || formData.price <= 0) {
      setMessage('Veuillez saisir au minimum le nom, la catégorie et le prix du produit.');
      return;
    }

    try {
      await productsAPI.create({
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: formData.price,
        stock: formData.stock,
        rating: formData.rating,
        image:
          formData.image.trim() ||
          'https://images.unsplash.com/photo-1581093616143-1b29f99148d6?auto=format&fit=crop&w=800&q=85',
        description: formData.description.trim(),
        featured: formData.featured,
      });

      setFormData({
        name: '',
        category: '',
        price: 0,
        stock: 1,
        rating: 4.5,
        image: '',
        description: '',
        featured: false,
      });
      setMessage('Produit ajouté avec succès !');
      await loadProducts();

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Erreur:', err);
      setMessage('Erreur lors de l\'ajout du produit.');
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    try {
      await productsAPI.delete(id);
      setMessage('Produit supprimé avec succès !');
      await loadProducts();
      setTimeout(() => {
        setMessage('');
      }, 2000);
    } catch (err) {
      console.error('Erreur:', err);
      setMessage('Erreur lors de la suppression du produit.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 lg:px-6">
      <div className="mb-8 rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-6 shadow-sm backdrop-blur sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              type="button"
              onClick={() => setCurrentPage('products')}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" /> Retour aux produits
            </button>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Espace admin</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Dashboard produits</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Ici vous pouvez ajouter un nouveau produit et gérer ceux qui sont déjà dans votre catalogue.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Plus className="h-4 w-4 text-indigo-500" />
            Ajoutez des produits facilement depuis ce tableau de bord.
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Liste des produits</h2>
              <p className="mt-1 text-sm text-slate-500">Voir, supprimer et vérifier les stocks des produits.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              {products.length} produits
            </span>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                Chargement des produits...
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                Aucun produit disponible.
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product._id || product.id}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.category}</p>
                    <p className="text-sm text-slate-600">Prix : {product.price.toLocaleString()} FCFA</p>
                    <p className="text-sm text-slate-600">Stock : {product.stock ?? 0}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(product._id)}
                      className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                    >
                      <Trash2 className="h-4 w-4" /> Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Ajouter un produit</h2>
            <p className="mt-1 text-sm text-slate-500">Remplissez le formulaire pour créer un produit dans le catalogue.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Nom du produit
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Ex: Perceuse sans fil"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Catégorie
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Ex: Outils électriques"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Prix (FCFA)
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Stock
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Note
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                Image URL
                <input
                  name="image"
                  type="text"
                  value={formData.image}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="https://..."
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                Description
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  rows={4}
                  placeholder="Description du produit"
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-slate-700 sm:col-span-2">
                <input
                  name="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-slate-300 text-indigo-600"
                />
                Mettre en avant comme produit top vente
              </label>
            </div>

            {message && (
              <div className="rounded-3xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              disabled={loading}
            >
              Ajouter le produit
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};
