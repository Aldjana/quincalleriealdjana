import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Trash2,
  LogOut,
  BarChart3,
  Package,
  DollarSign,
  AlertTriangle,
  Search,
  LayoutDashboard,
  Star,
  TrendingUp,
  Menu,
  X,
  Wrench,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Link } from 'react-router';
import { productsAPI, type Product } from '../../config/api';
import { LocalImagePicker } from '../components/LocalImagePicker';

interface AdminDashboardProps {
  onLogout: () => void;
}

type Tab = 'overview' | 'products' | 'add';

const COLORS = ['#f97316', '#6366f1', '#10b981', '#ec4899', '#0ea5e9', '#eab308'];

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 1,
    rating: 4.5,
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
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'price' || name === 'stock' || name === 'rating'
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImages.length === 0) {
      setMessage('Veuillez choisir au moins une photo depuis votre ordinateur.');
      return;
    }
    try {
      await productsAPI.create({
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: formData.price,
        stock: formData.stock,
        rating: formData.rating,
        image: selectedImages[0],
        images: selectedImages,
        description: formData.description.trim(),
        featured: formData.featured,
      });

      setFormData({
        name: '',
        category: '',
        price: 0,
        stock: 1,
        rating: 4.5,
        description: '',
        featured: false,
      });
      setSelectedImages([]);

      setMessage('Produit ajouté avec succès !');
      setActiveTab('products');
      await loadProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Erreur:', err);
      setMessage(err instanceof Error ? err.message : 'Erreur lors de l\'ajout du produit');
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id || !window.confirm('Supprimer ce produit définitivement ?')) return;
    try {
      await productsAPI.delete(id);
      setMessage('Produit supprimé');
      await loadProducts();
      setTimeout(() => setMessage(''), 2000);
    } catch {
      setMessage('Erreur lors de la suppression');
    }
  };

  const stats = useMemo(
    () => ({
      total: products.length,
      totalValue: products.reduce((sum, p) => sum + p.price * (p.stock || 0), 0),
      avgPrice: products.length
        ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
        : 0,
      inStock: products.filter((p) => (p.stock || 0) > 0).length,
      outOfStock: products.filter((p) => (p.stock || 0) === 0).length,
      lowStock: products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length,
      featured: products.filter((p) => p.featured).length,
      avgRating:
        products.length > 0
          ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
          : '0',
    }),
    [products]
  );

  const categoriesData = useMemo(
    () =>
      Object.entries(
        products.reduce(
          (acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }),
          {} as Record<string, number>
        )
      ).map(([name, value]) => ({ name, value })),
    [products]
  );

  const priceData = useMemo(
    () => [
      { range: '0-10k', count: products.filter((p) => p.price < 10000).length },
      { range: '10-30k', count: products.filter((p) => p.price >= 10000 && p.price < 30000).length },
      { range: '30-50k', count: products.filter((p) => p.price >= 30000 && p.price < 50000).length },
      { range: '50k+', count: products.filter((p) => p.price >= 50000).length },
    ],
    [products]
  );

  const stockTrendData = useMemo(() => {
    const categories = [...new Set(products.map((p) => p.category))].slice(0, 6);
    return categories.map((cat) => ({
      name: cat.length > 12 ? cat.slice(0, 12) + '…' : cat,
      stock: products.filter((p) => p.category === cat).reduce((s, p) => s + (p.stock || 0), 0),
      value: products
        .filter((p) => p.category === cat)
        .reduce((s, p) => s + p.price * (p.stock || 0), 0),
    }));
  }, [products]);

  const lowStockProducts = useMemo(
    () =>
      products
        .filter((p) => (p.stock || 0) <= 5)
        .sort((a, b) => (a.stock || 0) - (b.stock || 0))
        .slice(0, 5),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'products', label: 'Produits', icon: <Package className="h-5 w-5" /> },
    { id: 'add', label: 'Ajouter', icon: <Plus className="h-5 w-5" /> },
  ];

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar overlay mobile */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">Admin</p>
              <p className="text-sm font-bold text-white">Quincaillerie Aldjana</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-orange-400 shadow-inner'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
              {item.id === 'products' && (
                <span className="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                  {products.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="space-y-2 border-t border-slate-800 p-4">
          <Link
            to="/"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <ExternalLink className="h-5 w-5" />
            Voir la boutique
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/10"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-slate-800 p-2.5 text-slate-400 hover:bg-slate-800 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-white sm:text-xl">
                  {activeTab === 'overview' && 'Tableau de bord'}
                  {activeTab === 'products' && 'Gestion des produits'}
                  {activeTab === 'add' && 'Nouveau produit'}
                </h1>
                <p className="hidden text-sm capitalize text-slate-500 sm:block">{today}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadProducts}
                disabled={loading}
                className="hidden items-center gap-2 rounded-xl border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50 sm:flex"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
              <div className="hidden items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-xs font-bold text-white">
                  AD
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Administrateur</p>
                  <p className="text-xs text-slate-500">En ligne</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-rose-300">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-emerald-300">
              {message}
            </div>
          )}

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  icon={<Package className="h-6 w-6" />}
                  label="Total produits"
                  value={stats.total}
                  sub={`${stats.featured} en vedette`}
                  gradient="from-indigo-500 to-violet-600"
                />
                <StatCard
                  icon={<DollarSign className="h-6 w-6" />}
                  label="Valeur du stock"
                  value={`${(stats.totalValue / 1000000).toFixed(2)}M`}
                  sub="FCFA"
                  gradient="from-emerald-500 to-teal-600"
                />
                <StatCard
                  icon={<TrendingUp className="h-6 w-6" />}
                  label="Prix moyen"
                  value={stats.avgPrice.toLocaleString()}
                  sub="FCFA / produit"
                  gradient="from-orange-500 to-amber-600"
                />
                <StatCard
                  icon={<Star className="h-6 w-6" />}
                  label="Note moyenne"
                  value={stats.avgRating}
                  sub={`${stats.inStock} en stock`}
                  gradient="from-pink-500 to-rose-600"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <MiniStat label="En stock" value={stats.inStock} color="text-emerald-400" />
                <MiniStat label="Stock faible" value={stats.lowStock} color="text-amber-400" />
                <MiniStat label="Ruptures" value={stats.outOfStock} color="text-rose-400" />
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <ChartCard title="Valeur stock par catégorie">
                  {stockTrendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={stockTrendData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            background: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '12px',
                          }}
                          labelStyle={{ color: '#f1f5f9' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#f97316"
                          fill="url(#colorValue)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart />
                  )}
                </ChartCard>

                <ChartCard title="Répartition par catégorie">
                  {categoriesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={categoriesData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={4}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {categoriesData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '12px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart />
                  )}
                </ChartCard>
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <ChartCard title="Distribution des prix" className="xl:col-span-2">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={priceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          background: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                        }}
                      />
                      <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                    <h3 className="font-semibold text-white">Alertes stock</h3>
                  </div>
                  {lowStockProducts.length === 0 ? (
                    <p className="text-sm text-slate-500">Aucune alerte — stocks OK</p>
                  ) : (
                    <ul className="space-y-3">
                      {lowStockProducts.map((p) => (
                        <li
                          key={p._id || p.id}
                          className="flex items-center justify-between rounded-xl bg-slate-800/50 px-4 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">{p.name}</p>
                            <p className="text-xs text-slate-500">{p.category}</p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                              (p.stock || 0) === 0
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {(p.stock || 0) === 0 ? 'Rupture' : `${p.stock} restants`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50">
              <div className="flex flex-col gap-4 border-b border-slate-800 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Catalogue ({filteredProducts.length})
                  </h2>
                  <p className="text-sm text-slate-500">Gérez tous vos produits en un seul endroit</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-orange-500 sm:w-72"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <p className="py-20 text-center text-slate-500">Aucun produit trouvé</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <th className="px-6 py-4">Produit</th>
                        <th className="px-6 py-4">Catégorie</th>
                        <th className="px-6 py-4">Prix</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4">Note</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredProducts.map((product) => (
                        <tr key={product._id || product.id} className="transition hover:bg-slate-800/30">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-12 w-12 rounded-xl object-cover ring-1 ring-slate-700"
                              />
                              <div>
                                <p className="font-medium text-white">{product.name}</p>
                                {product.featured && (
                                  <span className="text-xs text-orange-400">★ Vedette</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">{product.category}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-emerald-400">
                            {product.price.toLocaleString()} FCFA
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                (product.stock || 0) === 0
                                  ? 'bg-rose-500/20 text-rose-400'
                                  : (product.stock || 0) <= 5
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-emerald-500/20 text-emerald-400'
                              }`}
                            >
                              {product.stock ?? 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">⭐ {product.rating}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDelete(product._id)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Add product */}
          {activeTab === 'add' && (
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white">Ajouter un produit</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Remplissez les informations pour enrichir votre catalogue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField label="Nom du produit *">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Ex: Perceuse sans fil Makita"
                    />
                  </FormField>
                  <FormField label="Catégorie *">
                    <input
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Ex: Outils électriques"
                    />
                  </FormField>
                  <FormField label="Prix (FCFA) *">
                    <input
                      name="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label="Stock">
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label="Note (0-5)">
                    <input
                      name="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label="Photos du produit *">
                    <LocalImagePicker selected={selectedImages} onChange={setSelectedImages} />
                    <p className="mt-2 text-xs text-slate-500">
                      Cliquez pour ouvrir votre ordinateur et choisir les photos du produit.
                    </p>
                  </FormField>
                </div>

                <FormField label="Description">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={inputClass}
                    placeholder="Description détaillée du produit..."
                  />
                </FormField>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3">
                  <input
                    name="featured"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-5 w-5 rounded accent-orange-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-white">Produit vedette</span>
                    <p className="text-xs text-slate-500">Afficher en page d'accueil</p>
                  </div>
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-600 hover:to-orange-700 sm:w-auto"
                >
                  <Plus className="h-5 w-5" />
                  Ajouter le produit
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const inputClass =
  'mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 placeholder:text-slate-500';

function StatCard({
  icon,
  label,
  value,
  sub,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-slate-700">
      <div
        className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition group-hover:opacity-20`}
      />
      <div
        className={`inline-flex rounded-xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg`}
      >
        {icon}
      </div>
      <p className="mt-4 text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{sub}</p>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/50 p-6 ${className}`}
    >
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-orange-400" />
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-[280px] items-center justify-center text-sm text-slate-500">
      Aucune donnée disponible
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300">{label}</label>
      {children}
    </div>
  );
}
