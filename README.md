# Quincaillerie Aldjana

Boutique en ligne de quincaillerie : catalogue, panier, commande par email et espace d'administration.

| Partie | Dossier | Technologies | Hébergement |
|---|---|---|---|
| Frontend | `/` (`src/`) | React 18, Vite 6, TypeScript, Tailwind CSS 4, React Router 7 | Vercel |
| Backend | `backend/` | Node.js, Express, Mongoose (MongoDB Atlas), Cloudinary | Render |

## Architecture

```
src/
├── main.tsx                 # Point d'entrée + routes (/admin chargé à la demande)
├── app/
│   ├── App.tsx              # Boutique : layout + routes (pages chargées à la demande)
│   ├── AdminApp.tsx         # Session admin (vérifiée auprès du serveur)
│   ├── components/          # Header, Footer, ProductGallery, OrderFormModal, ...
│   ├── context/CartContext  # Panier (sauvegardé dans le navigateur)
│   └── pages/               # Produits, fiche produit, panier, contact, admin...
├── config/
│   ├── api.ts               # Client HTTP unique (produits, auth, upload)
│   ├── emailjs.ts           # Identifiants EmailJS
│   └── metaPixel.ts         # Meta Pixel (montants FCFA convertis en EUR)
├── hooks/
│   ├── useProducts.ts       # Catalogue partagé + cache (une requête par visite)
│   └── useOrder.ts          # Envoi de commande + redirection
└── services/orders.ts       # Commande : email EmailJS + événement Purchase

backend/src/
├── index.ts                 # Serveur Express (compression, erreurs JSON, 404)
├── middleware/auth.ts       # Jetons admin signés (HMAC) + requireAdmin
├── middleware/rateLimit.ts  # Limite les tentatives de connexion
├── routes/                  # products, auth, upload
├── utils/productInput.ts    # Validation / filtrage des données produit
├── models/Product.ts        # Schéma Mongoose
└── store/fileStore.ts       # Stockage de secours (fichier) si MongoDB est indisponible
```

### API

| Méthode | Route | Accès |
|---|---|---|
| GET | `/api/products`, `/api/products/:id` | Public (cache 60 s) |
| POST / PUT / DELETE | `/api/products[/:id]` | Admin (`Authorization: Bearer <jeton>`) |
| POST | `/api/upload/single`, `/api/upload/multiple` | Admin |
| POST | `/api/auth/login` | Public (10 essais / 15 min) |
| GET | `/api/auth/verify` | Admin |

## Démarrage en local

```bash
# Backend
cd backend
cp .env.example .env   # puis renseignez vos valeurs
npm install
npm run dev            # http://localhost:4000

# Frontend (autre terminal, à la racine)
cp .env.example .env
npm install
npm run dev            # http://localhost:5173 — admin : /admin
```

Vérifications : `npm run typecheck` et `npm run build` (racine), `npm run build` (backend).

## Variables d'environnement

**Frontend (Vercel)**

- `VITE_API_URL` : URL du backend Render
- `VITE_META_PIXEL_ID` : identifiant Meta Pixel

**Backend (Render)**

- `MONGO_URI` : chaîne de connexion MongoDB
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` : identifiants de l'espace admin
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` : stockage des images
- `JWT_SECRET` (recommandé) : secret de signature des sessions admin. S'il est absent, il est dérivé des identifiants admin.
- `CORS_ORIGINS` (optionnel) : origines autorisées, séparées par des virgules (ex. `https://quincailleriealdjana.vercel.app`)

Ne mettez jamais de vraies valeurs dans un fichier versionné : renseignez-les dans les tableaux de bord Vercel et Render.

## Déploiement

1. **Backend (Render)** : le fichier `.render.yaml` configure le service (`rootDir: backend`). Renseignez les variables ci-dessus.
2. **Frontend (Vercel)** : `vercel.json` gère la compilation et la redirection des routes vers `index.html`. Renseignez `VITE_API_URL`.

## Guides complémentaires

- [GUIDE_EMAILJS.md](GUIDE_EMAILJS.md) : réception des commandes par email
- [META_PIXEL_SETUP.md](META_PIXEL_SETUP.md) : suivi publicitaire Meta
- [KEEP_ALIVE_SETUP.md](KEEP_ALIVE_SETUP.md) : éviter la mise en veille du backend Render
