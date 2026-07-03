# Démarrage complet - Frontend + Backend

## Prérequis

- Node.js 18+ installé
- MongoDB Atlas (ou locale) - URI configurée

## 1. Backend (Node.js + MongoDB)

Dans le terminal 1:

```bash
cd backend
npm install
```

Créez un fichier `.env` (dupliquez `.env.example`):

```
MONGO_URI=mongodb+srv://[user]:[password]@[cluster].mongodb.net/
PORT=4000
```

Démarrez le serveur:

```bash
npm run dev
```

✅ Vous verrez: `Connecté à MongoDB` et `Serveur démarré sur http://localhost:4000`

## 2. Frontend (React + Vite)

Dans le terminal 2:

```bash
cd ..
npm install
npm run dev
```

Le frontend se lancera sur `http://localhost:5173`

## 3. Test du Dashboard

1. Allez sur le frontend
2. Cliquez sur **Admin** dans le header
3. Le dashboard charge automatiquement les produits du backend
4. Essayez d'ajouter/supprimer un produit
5. Vérifiez dans MongoDB Atlas qu'il est enregistré

## Structure

```
ma-boutique/
├── backend/              # API Node.js
│   ├── src/
│   │   ├── index.ts      # Serveur Express
│   │   ├── models/       # Modèles Mongoose
│   │   └── routes/       # Routes API
│   └── package.json
├── src/                  # React Frontend
│   ├── config/api.ts     # Service API client
│   └── app/
│       └── pages/
│           └── DashboardPage.tsx
└── package.json
```

## API Endpoints

- `GET /api/products` — Récupérer tous les produits
- `GET /api/products/:id` — Récupérer un produit
- `POST /api/products` — Créer un produit
- `PUT /api/products/:id` — Modifier un produit
- `DELETE /api/products/:id` — Supprimer un produit

## Troubleshooting

### Backend ne démarre pas
- Vérifiez que MongoDB URI est correct dans `.env`
- Vérifiez que le port 4000 n'est pas utilisé

### Frontend ne charge pas les produits
- Vérifiez que le backend est en cours d'exécution
- Vérifiez `VITE_API_URL` dans `.env` (optionnel, défaut: http://localhost:4000)
- Ouvrez la console (F12) et vérifiez les erreurs réseau

### Problèmes de CORS
- Vérifiez que `backend/src/index.ts` a `app.use(cors())`
- Redémarrez le backend
