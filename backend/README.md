# Backend Ma Boutique

Serveur Node.js + MongoDB pour la gestion des produits.

## Installation

1. Ouvrez le dossier `backend`.
2. Exécutez `npm install`.
3. Dupliquez `.env.example` en `.env` et renseignez votre URI MongoDB.

## Lancement

- Développement : `npm run dev`
- Production : `npm run build` puis `npm start`

## API de produits

- `GET /api/products` : liste des produits
- `GET /api/products/:id` : détail d'un produit
- `POST /api/products` : création d'un produit
- `PUT /api/products/:id` : mise à jour d'un produit
- `DELETE /api/products/:id` : suppression d'un produit

## Exemple de payload `POST /api/products`

{
  "name": "Perceuse sans fil Makita",
  "category": "Outils électriques",
  "price": 25000,
  "stock": 15,
  "rating": 4.5,
  "image": "https://...",
  "description": "Description du produit",
  "featured": true
}
VVTTc3bbDwTmcb8j