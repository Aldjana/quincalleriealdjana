import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Pencil,
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
  ShoppingBag,
  MessageSquare,
  Clock,
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
import { Link } from 'react-router-dom';
import {
  ApiError,
  messagesAPI,
  ordersAPI,
  productsAPI,
  type ContactMessage,
  type Order,
  type OrderStatus,
  type Product,
} from '../../config/api';
import { formatDate, formatPrice } from '../../utils/format';
import { LocalImagePicker } from '../components/LocalImagePicker';
import { AdminOrders } from '../admin/AdminOrders';
import { AdminMessages } from '../admin/AdminMessages';
import { ORDER_STATUS } from '../admin/orderStatus';

interface AdminDashboardProps {
  onLogout: () => void;
}

type Tab = 'overview' | 'orders' | 'messages' | 'products' | 'add';

const COLORS = ['#f97316', '#6366f1', '#10b981', '#ec4899', '#0ea5e9', '#eab308'];

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  // 503 = MongoDB injoignable : commandes et messages indisponibles
  const [ordersUnavailable, setOrdersUnavailable] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    rating: '4.5',
    description: '',
    featured: false,
    active: true,
  });

  useEffect(() => {
    loadAll();
    // Nouvelles commandes récupérées automatiquement toutes les minutes
    const timer = setInterval(() => loadOrdersAndMessages(), 60_000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrdersAndMessages = async () => {
    const [ordersResult, messagesResult] = await Promise.allSettled([ordersAPI.list(), messagesAPI.list()]);
    if (ordersResult.status === 'fulfilled') setOrders(ordersResult.value);
    if (messagesResult.status === 'fulfilled') setContactMessages(messagesResult.value);
    const failure = [ordersResult, messagesResult].find((r) => r.status === 'rejected') as PromiseRejectedResult | undefined;
    setOrdersUnavailable(failure?.reason instanceof ApiError && failure.reason.status === 503);
  };

  const loadAll = () => Promise.all([loadProducts(), loadOrdersAndMessages()]);

  const handleOrderUpdate = async (id: string, data: { status?: OrderStatus; adminNote?: string }) => {
    try {
      const updated = await ordersAPI.update(id, data);
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Mise à jour impossible');
    }
  };

  const handleOrderDelete = async (id: string) => {
    try {
      await ordersAPI.delete(id);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Suppression impossible');
    }
  };

  const handleMessageRead = async (id: string, read: boolean) => {
    try {
      const updated = await messagesAPI.markRead(id, read);
      setContactMessages((prev) => prev.map((m) => (m._id === id ? updated : m)));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Mise à jour impossible');
    }
  };

  const handleMessageDelete = async (id: string) => {
    try {
      await messagesAPI.delete(id);
      setContactMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Suppression impossible');
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAllAdmin();
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
            ? value
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
      const productData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: Number(formData.price) || 0,
        stock: Number(formData.stock) || 0,
        rating: Number(formData.rating) || 4.5,
        image: selectedImages[0],
        images: selectedImages,
        description: formData.description.trim(),
        featured: formData.featured,
        active: formData.active,
      };

      if (editingProduct && (editingProduct._id || editingProduct.id)) {
        await productsAPI.update(editingProduct._id ?? String(editingProduct.id), productData);
        setMessage('Produit modifié avec succès !');
        setEditingProduct(null);
      } else {
        await productsAPI.create(productData);
        setMessage('Produit ajouté avec succès !');
      }

      setFormData({
        name: '',
        category: '',
        price: '',
        stock: '',
        rating: '4.5',
        description: '',
        featured: false,
        active: true,
      });
      setSelectedImages([]);
      setActiveTab('products');
      await loadProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Erreur:', err);
      setMessage(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde du produit');
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id || !window.confirm('Supprimer ce produit définitivement ?')) return;
    try {
      await productsAPI.delete(id);
      setMessage('Produit supprimé');
      setEditingProduct(null);
      await loadProducts();
      setTimeout(() => setMessage(''), 2000);
    } catch {
      setMessage('Erreur lors de la suppression');
    }
  };

  // Active / désactive un produit sans passer par le formulaire
  const handleToggleActive = async (product: Product) => {
    const id = product._id ?? String(product.id);
    const active = product.active === false;
    setProducts((prev) => prev.map((p) => (p === product ? { ...p, active } : p)));
    try {
      await productsAPI.update(id, { active });
      setMessage(active ? `« ${product.name} » est de nouveau visible dans la boutique.` : `« ${product.name} » est masqué de la boutique.`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setProducts((prev) => prev.map((p) => (p._id === product._id && p.id === product.id ? { ...p, active: !active } : p)));
      setMessage(err instanceof Error ? err.message : 'Mise à jour impossible');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock ?? 0),
      rating: String(product.rating),
      description: product.description ?? '',
      featured: product.featured ?? false,
      active: product.active !== false,
    });
    setSelectedImages(product.images && product.images.length > 0 ? product.images : [product.image]);
    setActiveTab('add');
    setSidebarOpen(false);
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
      inactive: products.filter((p) => p.active === false).length,
      avgRating:
        products.length > 0
          ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
          : '0',
    }),
    [products]
  );

  const orderStats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const active = orders.filter((o) => o.status !== 'annulee');
    const thisMonth = active.filter((o) => new Date(o.createdAt) >= startOfMonth);
    return {
      pending: orders.filter((o) => o.status === 'nouvelle').length,
      toDeliver: orders.filter((o) => o.status === 'confirmee' || o.status === 'en_livraison').length,
      monthCount: thisMonth.length,
      monthRevenue: thisMonth.reduce((sum, o) => sum + o.total, 0),
      deliveredRevenue: orders.filter((o) => o.status === 'livree').reduce((sum, o) => sum + o.total, 0),
      unreadMessages: contactMessages.filter((m) => !m.read).length,
    };
  }, [orders, contactMessages]);

  // Commandes (hors annulées) des 14 derniers jours
  const salesData = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (13 - i));
      return d;
    });
    return days.map((day) => {
      const next = new Date(day);
      next.setDate(day.getDate() + 1);
      const dayOrders = orders.filter((o) => {
        const created = new Date(o.createdAt);
        return o.status !== 'annulee' && created >= day && created < next;
      });
      return {
        name: day.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        commandes: dayOrders.length,
        montant: dayOrders.reduce((sum, o) => sum + o.total, 0),
      };
    });
  }, [orders]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const knownCategories = useMemo(() => [...new Set(products.map((p) => p.category))].sort(), [products]);

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
    { id: 'orders', label: 'Commandes', icon: <ShoppingBag className="h-5 w-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="h-5 w-5" /> },
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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 lg:translate-x-0 ${
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
              {item.id === 'orders' && orderStats.pending > 0 && (
                <span className="ml-auto rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                  {orderStats.pending}
                </span>
              )}
              {item.id === 'messages' && orderStats.unreadMessages > 0 && (
                <span className="ml-auto rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                  {orderStats.unreadMessages}
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
      <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
        {/* Top bar */}
        <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
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
                  {activeTab === 'orders' && 'Commandes'}
                  {activeTab === 'messages' && 'Messages clients'}
                  {activeTab === 'products' && 'Gestion des produits'}
                  {activeTab === 'add' && 'Nouveau produit'}
                </h1>
                <p className="hidden text-sm capitalize text-slate-500 sm:block">{today}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadAll}
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

        <main className="flex-1 overflow-y-auto pt-24 p-4 sm:pt-24 sm:p-6 lg:pt-24 lg:p-8">
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
                  icon={<ShoppingBag className="h-6 w-6" />}
                  label="Commandes à traiter"
                  value={orderStats.pending}
                  sub={`${orderStats.toDeliver} confirmée(s) / en livraison`}
                  gradient="from-orange-500 to-amber-600"
                  onClick={() => setActiveTab('orders')}
                />
                <StatCard
                  icon={<TrendingUp className="h-6 w-6" />}
                  label="Ventes du mois"
                  value={formatPrice(orderStats.monthRevenue)}
                  sub={`${orderStats.monthCount} commande(s) hors annulées`}
                  gradient="from-emerald-500 to-teal-600"
                />
                <StatCard
                  icon={<DollarSign className="h-6 w-6" />}
                  label="Chiffre d'affaires livré"
                  value={formatPrice(orderStats.deliveredRevenue)}
                  sub="Commandes livrées"
                  gradient="from-sky-500 to-blue-600"
                />
                <StatCard
                  icon={<MessageSquare className="h-6 w-6" />}
                  label="Messages non lus"
                  value={orderStats.unreadMessages}
                  sub={`${contactMessages.length} message(s) au total`}
                  gradient="from-pink-500 to-rose-600"
                  onClick={() => setActiveTab('messages')}
                />
              </div>

              {ordersUnavailable && (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">
                  Base de données injoignable : commandes et messages indisponibles pour le moment.
                </div>
              )}

              <div className="grid gap-6 xl:grid-cols-3">
                <ChartCard title="Commandes des 14 derniers jours" className="xl:col-span-2">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                        labelStyle={{ color: '#f1f5f9' }}
                        formatter={(value, name, entry) =>
                          name === 'commandes'
                            ? [`${value} — ${formatPrice((entry.payload as { montant: number }).montant)}`, 'Commandes']
                            : [value, name]
                        }
                      />
                      <Bar dataKey="commandes" fill="#f97316" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-400" />
                      <h3 className="font-semibold text-white">Dernières commandes</h3>
                    </div>
                    <button type="button" onClick={() => setActiveTab('orders')} className="text-xs font-semibold text-orange-400 hover:text-orange-300">
                      Tout voir
                    </button>
                  </div>
                  {recentOrders.length === 0 ? (
                    <p className="text-sm text-slate-500">Aucune commande pour le moment</p>
                  ) : (
                    <ul className="space-y-2">
                      {recentOrders.map((o) => (
                        <li key={o._id}>
                          <button
                            type="button"
                            onClick={() => setActiveTab('orders')}
                            className="flex w-full items-center justify-between gap-3 rounded-xl bg-slate-800/50 px-4 py-3 text-left hover:bg-slate-800"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-white">{o.customer.name}</p>
                              <p className="text-xs text-slate-500">{formatDate(o.createdAt)}</p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-sm font-semibold text-emerald-400">{formatPrice(o.total)}</p>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${ORDER_STATUS[o.status].badge}`}>
                                {ORDER_STATUS[o.status].label}
                              </span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <h2 className="pt-2 text-sm font-semibold uppercase tracking-wider text-slate-500">Catalogue</h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  icon={<Package className="h-6 w-6" />}
                  label="Total produits"
                  value={stats.total}
                  sub={`${stats.featured} en vedette · ${stats.inactive} désactivé(s)`}
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

          {activeTab === 'orders' && (
            <AdminOrders
              orders={orders}
              unavailable={ordersUnavailable}
              onUpdate={handleOrderUpdate}
              onDelete={handleOrderDelete}
            />
          )}

          {activeTab === 'messages' && (
            <AdminMessages
              messages={contactMessages}
              unavailable={ordersUnavailable}
              onMarkRead={handleMessageRead}
              onDelete={handleMessageDelete}
            />
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
                        <th className="px-6 py-4">Boutique</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredProducts.map((product) => (
                        <tr
                          key={product._id || product.id}
                          className={`transition hover:bg-slate-800/30 ${product.active === false ? 'opacity-60' : ''}`}
                        >
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
                                {product.active === false && (
                                  <span className="ml-2 rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-300">
                                    Désactivé
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">{product.category}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-emerald-400">
                            {formatPrice(product.price)}
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
                          <td className="px-6 py-4">
                            <ActiveToggle active={product.active !== false} onToggle={() => handleToggleActive(product)} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(product)}
                              title="Modifier"
                              aria-label="Modifier"
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 text-slate-200 transition hover:bg-slate-700"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(product._id)}
                              title="Supprimer"
                              aria-label="Supprimer"
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 transition hover:bg-rose-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
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
                <h2 className="text-xl font-bold text-white">
                  {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingProduct
                    ? 'Modifiez les informations du produit puis enregistrez.'
                    : 'Remplissez les informations pour enrichir votre catalogue.'}
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
                      list="admin-categories"
                    />
                    <datalist id="admin-categories">
                      {knownCategories.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
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

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3">
                  <input
                    name="active"
                    type="checkbox"
                    checked={formData.active}
                    onChange={handleChange}
                    className="h-5 w-5 rounded accent-orange-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-white">Visible dans la boutique</span>
                    <p className="text-xs text-slate-500">Décochez pour masquer un produit indisponible sans le supprimer</p>
                  </div>
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-600 hover:to-orange-700 sm:w-auto"
                  >
                    <Plus className="h-5 w-5" />
                    {editingProduct ? 'Enregistrer les modifications' : 'Ajouter le produit'}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setFormData({
                          name: '',
                          category: '',
                          price: '',
                          stock: '',
                          rating: '4.5',
                          description: '',
                          featured: false,
                          active: true,
                        });
                        setSelectedImages([]);
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 font-semibold text-slate-200 transition hover:bg-slate-700 sm:w-auto"
                    >
                      Annuler
                    </button>
                  )}
                </div>
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
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  gradient: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-slate-700 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition group-hover:opacity-20`}
      />
      <div
        className={`inline-flex rounded-xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg`}
      >
        {icon}
      </div>
      <p className="mt-4 text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">{value}</p>
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

function ActiveToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onToggle}
      title={active ? 'Visible dans la boutique — cliquer pour désactiver' : 'Masqué — cliquer pour réactiver'}
      className="inline-flex items-center gap-2.5"
    >
      <span className={`relative h-6 w-11 rounded-full transition ${active ? 'bg-emerald-500' : 'bg-slate-600'}`}>
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${active ? 'left-[22px]' : 'left-0.5'}`}
        />
      </span>
      <span className={`text-xs font-semibold ${active ? 'text-emerald-400' : 'text-slate-400'}`}>
        {active ? 'Actif' : 'Désactivé'}
      </span>
    </button>
  );
}
