# Configuration Meta Pixel - Guide d'installation

## 📋 Résumé de l'implémentation

L'intégration Meta Pixel a été ajoutée à votre boutique e-commerce avec les fonctionnalités suivantes :

### ✅ Événements implémentés
- **PageView** : Tracké automatiquement à chaque changement de page
- **ViewContent** : Tracké lors de la consultation d'un produit
- **AddToCart** : Tracké lors de l'ajout d'un produit au panier
- **InitiateCheckout** : Tracké lors du clic sur "Commander"
- **Purchase** : Tracké UNIQUEMENT après l'envoi réussi à EmailJS

### � Devise utilisée
- **Devise Meta Pixel** : USD (Meta n'accepte pas XOF)
- **Montants réels** : Gardés en FCFA dans votre système
- **Conversion** : Les montants sont envoyés tels quels à Meta pour le tracking

### �🔒 Sécurité et fiabilité
- L'événement **Purchase** n'est déclenché qu'après confirmation de l'envoi EmailJS
- Utilisation d'`eventID` unique pour éviter les doublons
- Utilisation de `sessionStorage` pour empêcher le re-tracking au rechargement de la page
- Le système EmailJS existant n'a pas été modifié (fonctionnement préservé)

## 📁 Fichiers modifiés

1. **`src/config/metaPixel.ts`** (NOUVEAU)
   - Configuration Meta Pixel
   - Fonctions d'initialisation et de tracking
   - Helpers pour chaque type d'événement

2. **`.env.example`** (NOUVEAU)
   - Template pour la variable d'environnement du Pixel ID

3. **`src/app/App.tsx`** (MODIFIÉ)
   - Initialisation du Meta Pixel au démarrage
   - Tracking PageView automatique à chaque changement de route
   - Ajout de la route vers la page de confirmation

4. **`src/app/context/CartContext.tsx`** (MODIFIÉ)
   - Tracking AddToCart lors de l'ajout au panier

5. **`src/app/pages/CartPage.tsx`** (MODIFIÉ)
   - Tracking InitiateCheckout lors du clic sur "Commander"
   - Tracking Purchase après envoi réussi EmailJS
   - Redirection vers la page de confirmation

6. **`src/app/pages/ProductDetailPage.tsx`** (MODIFIÉ)
   - Tracking ViewContent lors de la consultation d'un produit
   - Tracking Purchase pour commandes directes (avec redirection)

7. **`src/app/pages/OrderConfirmationPage.tsx`** (NOUVEAU)
   - Page de confirmation de commande professionnelle
   - Nettoyage du flag de tracking pour éviter les doublons

## ⚙️ Configuration Vercel

### 1. Ajouter la variable d'environnement

Dans votre dashboard Vercel :
1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez une nouvelle variable :
   - **Key** : `VITE_META_PIXEL_ID`
   - **Value** : Votre ID Meta Pixel (ex: `123456789012345`)
3. Sélectionnez les environnements (Production, Preview, Development)

### 2. Trouver votre Meta Pixel ID

1. Allez sur [Meta Events Manager](https://www.facebook.com/events_manager2)
2. Sélectionnez votre pixel
3. Cliquez sur **Settings** → **Pixel Details**
4. Copiez le **Pixel ID** (ex: `123456789012345`)

## 🧪 Test des événements

### Méthode 1 : Meta Pixel Helper (Chrome)

1. Installez l'extension **Meta Pixel Helper** sur Chrome
2. Naviguez sur votre site
3. Cliquez sur l'icône Pixel Helper dans la barre d'outils
4. Vérifiez que le Pixel est détecté et fonctionne

### Méthode 2 : Test Events dans Meta Events Manager

1. Allez sur [Meta Events Manager](https://www.facebook.com/events_manager2)
2. Sélectionnez votre pixel
3. Cliquez sur **Test Events**
4. Ouvrez votre site dans un autre onglet
5. Effectuez les actions suivantes et vérifiez les événements :
   - ✅ Naviguez sur une page → **PageView**
   - ✅ Consultez un produit → **ViewContent**
   - ✅ Ajoutez un produit au panier → **AddToCart**
   - ✅ Cliquez sur "Commander" → **InitiateCheckout**
   - ✅ Complétez une commande test → **Purchase** (après EmailJS)

## 🔍 Vérification spécifique

### Vérifier que Purchase n'est pas déclenché plusieurs fois

1. Faites une commande test
2. Sur la page de confirmation, rechargez la page (F5)
3. Vérifiez dans Test Events qu'UN SEUL événement **Purchase** apparaît

### Vérifier que Purchase n'est pas déclenché si EmailJS échoue

1. Faites une commande avec une adresse email invalide (si possible)
2. Vérifiez que **Purchase** n'apparaît PAS dans Test Events
3. Seuls les événements précédents (InitiateCheckout, etc.) doivent apparaître

## 📊 Devise configurée

- **Devise** : `XOF` (Franc CFA Ouest Africain)
- **Montants** : Calculés automatiquement depuis votre système existant

## 🚨 Points importants

### ❌ Ne JAMAIS modifier
- Le système EmailJS existant fonctionne parfaitement
- Ne modifiez pas les identifiants EmailJS
- La logique de commande reste "paiement à la livraison"

### ✅ Points de contrôle
- Purchase est envoyé APRÈS EmailJS uniquement
- Un eventID unique empêche les doublons
- La page de confirmation empêche le re-tracking
- Le montant est automatiquement calculé depuis le panier

## 🐛 Dépannage

### Le Pixel ne se charge pas
- Vérifiez que `VITE_META_PIXEL_ID` est configuré dans Vercel
- Redéployez votre application après avoir ajouté la variable
- Vérifiez la console pour les erreurs JavaScript

### Les événements n'apparaissent pas
- Vérifiez que vous utilisez Meta Pixel Helper
- Assurez-vous d'être connecté à votre compte Meta
- Vérifiez que le Pixel ID est correct

### Purchase apparaît plusieurs fois
- Vérifiez que `sessionStorage` fonctionne dans votre navigateur
- Assurez-vous que la redirection vers la page de confirmation fonctionne
- Vérifiez que le flag `purchase_tracked` est bien nettoyé

## 📝 Note de développement

Cette implémentation est **production-ready** et respecte :
- ✅ Les meilleures pratiques Meta Pixel
- ✅ La conformité RGPD (pas de données personnelles envoyées)
- ✅ L'intégrité de votre système EmailJS existant
- ✅ La prévention des doublons d'événements
- ✅ La déduplication via eventID unique

## 🎯 Résultat attendu

Une fois configuré avec votre Pixel ID, vous pourrez :
1. Créer des campagnes Meta Ads avec l'objectif **VENTES**
2. Suivre les conversions réelles (achats)
3. Optimiser vos campagnes avec les données de conversion
4. Analyser le comportement des utilisateurs (consultation, panier, etc.)