# Guide de déploiement

## Frontend (Vercel)

1. **Connectez votre repository GitHub** à Vercel
2. **Importez le projet** depuis GitHub
3. **Configurez les variables d'environnement** dans Vercel :
   - `VITE_API_URL` : URL de votre backend Render (ex: `https://ma-boutique-backend.onrender.com`)
4. **Déployez** - Vercel détectera automatiquement la configuration

## Backend (Render)

1. **Connectez votre repository GitHub** à Render
2. **Créez un nouveau Web Service**
3. **Configurez les variables d'environnement** dans Render :
   - `PORT` : 4000
   - `MONGO_URI` : Votre chaîne de connexion MongoDB
   - `ADMIN_EMAIL` : admin@quincaillerie.com
   - `ADMIN_PASSWORD` : admin123
4. **Déployez** - Render utilisera le fichier `render.yaml`

## Après déploiement

1. **Récupérez l'URL du backend** depuis Render (ex: `https://ma-boutique-backend.onrender.com`)
2. **Mettez à jour la variable** `VITE_API_URL` dans Vercel avec cette URL
3. **Redéployez le frontend** sur Vercel
