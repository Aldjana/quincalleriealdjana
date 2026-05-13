# Frontend de votre boutique

## 📋 Description
Ceci est votre frontend React avec TypeScript et TailwindCSS pour votre boutique de quincaillerie.

## 🚀 Démarrage

```bash
npm run dev
```

## 🌐 Accès

- **URL locale** : `http://localhost:5173`
- **Navigation** : Page d'accueil, produits, panier, contact

## 📁 Structure des fichiers

```
src/
├── app/
│   ├── components/          # Composants réutilisables
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── CategoriesSection.tsx
│   │   ├── ProductsSection.tsx
│   │   └── Footer.tsx
│   └── pages/              # Pages de l'application
│       ├── ProductsPage.tsx
│       ├── ProductDetailPage.tsx
│       ├── CartPage.tsx
│       └── ContactPage.tsx
├── styles/                # Styles CSS
│   ├── index.css
│   ├── globals.css
│   └── fonts.css
└── main.jsx              # Point d'entrée
```

## 🎨 Fonctionnalités

- ✅ **Design responsive** : Adapté mobile/desktop
- ✅ **Navigation fluide** : Routing simple entre les pages
- ✅ **Affichage des produits** : Grille avec filtres
- ✅ **Panier d'achat** : Gestion du panier
- ✅ **Détails produits** : Pages individuelles
- ✅ **Formulaire de contact** : Communication client
- ✅ **Animations CSS** : Transitions et hover effects

## 🛠️ Technologies

- **React 18** : Framework JavaScript
- **TypeScript** : Typage statique
- **TailwindCSS** : Framework CSS utilitaire
- **Vite** : Outil de build rapide
- **React Router** : Navigation client-side

## 📱 Composants principaux

### Header
- Logo et navigation
- Liens vers les pages principales
- Design responsive avec menu mobile

### HeroSection
- Bannière d'accueil attractive
- Call-to-action pour les produits

### ProductsSection
- Grille de produits avec images
- Filtres par catégorie
- Cartes interactives

### CartPage
- Gestion des articles du panier
- Calcul des totaux
- Interface de paiement

## 🎯 Personnalisation

Pour modifier les produits par défaut, éditez les fichiers dans `src/app/pages/ProductsPage.tsx` :

```typescript
const defaultProducts: Product[] = [
  {
    id: 1,
    name: 'Votre produit',
    price: 25000,
    image: 'URL de l\'image',
    category: 'Outils électriques',
    description: 'Description du produit',
    rating: 4.5
  },
  // Ajoutez d'autres produits ici...
];
```

## 🚀 Déploiement

Pour déployer en production :

1. **Build** :
   ```bash
   npm run build
   ```

2. **Deploy** : Copiez le dossier `dist/` sur votre serveur

## 📞 Support

Le frontend est maintenant autonome et prêt à être utilisé !
