# Quincaillerie Aldjana

Boutique en ligne de quincaillerie : catalogue, panier, commandes, messages de contact et espace d'administration.

> **Informations de la boutique** (téléphone, WhatsApp, adresse, horaires, réseaux sociaux, seuil de livraison offerte) :
> tout se modifie dans un seul fichier, [`src/config/shop.ts`](src/config/shop.ts).

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
│   ├── admin/               # Onglets Commandes et Messages de l'admin
│   ├── components/          # Header, Footer, ProductCard, OrderFormModal, ui/...
│   ├── context/             # Panier (sauvegardé, synchronisé avec le catalogue), notifications
│   └── pages/               # Produits, fiche produit, panier, contact, admin...
├── config/
│   ├── shop.ts              # Coordonnées et informations de la boutique
│   ├── api.ts               # Client HTTP unique (produits, commandes, messages, auth, upload)
│   ├── emailjs.ts           # Identifiants EmailJS
│   └── metaPixel.ts         # Meta Pixel (montants FCFA convertis en EUR)
├── hooks/
│   ├── useProducts.ts       # Catalogue partagé + cache (une requête par visite)
│   └── useOrder.ts          # Envoi de commande + redirection
└── services/orders.ts       # Commande : enregistrement serveur + email EmailJS + Purchase

backend/src/
├── index.ts                 # Serveur Express (compression, erreurs JSON, 404)
├── middleware/auth.ts       # Jetons admin signés (HMAC) + requireAdmin
├── middleware/rateLimit.ts  # Limite les tentatives de connexion
├── routes/                  # products, orders, messages, auth, upload
├── utils/productInput.ts    # Validation / filtrage des données produit
├── models/                  # Product, Order, Message (Mongoose)
└── store/fileStore.ts       # Stockage de secours (fichier) si MongoDB est indisponible
```

### API

| Méthode | Route | Accès |
|---|---|---|
| GET | `/api/products`, `/api/products/:id` | Public (cache 60 s) |
| POST / PUT / DELETE | `/api/products[/:id]` | Admin (`Authorization: Bearer <jeton>`) |
| POST | `/api/upload/single`, `/api/upload/multiple` | Admin |
| POST | `/api/orders` | Public (10 / 15 min) — prix relus en base |
| GET / PATCH / DELETE | `/api/orders[/:id]` | Admin |
| POST | `/api/messages` | Public (5 / 15 min) |
| GET / PATCH / DELETE | `/api/messages[/:id]` | Admin |
| POST | `/api/auth/login` | Public (10 essais / 15 min) |
| GET | `/api/auth/verify` | Admin |

### Parcours d'une commande

1. Le client valide son panier : la commande est envoyée à `POST /api/orders`. Le serveur relit les prix en base (le navigateur ne peut pas les modifier) et attribue un numéro `CMD-AAMMJJ-XXXXXX`.
2. Un email de notification part via EmailJS.
3. L'admin retrouve la commande dans l'onglet **Commandes** et la fait passer de *Nouvelle* à *Confirmée*, *En livraison*, *Livrée* ou *Annulée*.

Si le serveur est injoignable, l'email sert de secours : aucune commande n'est perdue.
Les commandes et messages nécessitent MongoDB (pas de stockage de secours sur fichier).

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

1. **Backend (Render)** : le fichier `.render.yaml` configure le service (`rootDir: backend`). Renseignez les variables ci-dessus. Pour éviter la mise en veille, voir [KEEP_ALIVE_SETUP.md](KEEP_ALIVE_SETUP.md) (réveil toutes les 10 minutes, 24 h sur 24).
2. **Frontend (Cloudflare Workers)** : projet connecté au dépôt GitHub (branche `main`).
   - Build command : `npm run build` — Deploy command : `npx wrangler deploy`
   - `wrangler.jsonc` publie le dossier `dist` et renvoie `index.html` pour toutes les adresses (navigation React)
   - **Build variables** (*Settings → Build → Variables and secrets*) : `VITE_API_URL`, `VITE_META_PIXEL_ID`.
     Ce sont des variables de **compilation** : après une modification, relancer un déploiement.
   - `public/_headers` gère le cache, `.nvmrc` fixe la version de Node.

   `vercel.json` reste disponible si le site est hébergé sur Vercel.

## Guides complémentaires

- [GUIDE_EMAILJS.md](GUIDE_EMAILJS.md) : réception des commandes par email
- [META_PIXEL_SETUP.md](META_PIXEL_SETUP.md) : suivi publicitaire Meta
- [KEEP_ALIVE_SETUP.md](KEEP_ALIVE_SETUP.md) : éviter la mise en veille du backend Render
