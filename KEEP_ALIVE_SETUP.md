# Configuration Keep-Alive Backend Render

## Problème
Render met en veille le backend après 15 minutes d'inactivité (cold start). Lors des campagnes publicitaires, les clients n'attendent pas 45 secondes de chargement.

## Solution
Configurer un cron job sur [cron-job.org](https://cron-job.org) pour ping le backend régulièrement et le garder éveillé.

## Étapes de configuration

### 1. Créer un compte sur cron-job.org
- Allez sur https://cron-job.org
- Créez un compte gratuit

### 2. Créer un nouveau cron job
- Cliquez sur "Create cron job"
- Remplissez les champs suivants :

#### Titre
```
Keep-Alive Backend Aldjana
```

#### URL à ping
```
https://votre-api.onrender.com/api/products
```
*(Remplacez `votre-api` par votre URL Render réelle)*

#### Horaires (08:00 - 23:00)
- **Type**: Every minute
- **Minutes**: `*/14` (toutes les 14 minutes)
- **Heures**: `8-23` (de 8h à 23h)
- **Jours**: `*` (tous les jours)

#### Configuration avancée
- **Timeout**: 30 secondes
- **Retry on failure**: 3 fois
- **Notifications**: Email en cas d'échec

### 3. Alternative : Plusieurs endpoints
Pour une meilleure fiabilité, créez 3 cron jobs différents :

#### Job 1 - Produits
```
URL: https://votre-api.onrender.com/api/products
Horaires: 8h-23h, toutes les 14 minutes
```

#### Job 2 - Health Check (si disponible)
```
URL: https://votre-api.onrender.com/health
Horaires: 8h-23h, toutes les 14 minutes
```

#### Job 3 - Catégories
```
URL: https://votre-api.onrender.com/api/categories
Horaires: 8h-23h, toutes les 14 minutes
```

## Pourquoi 14 minutes ?
Render met en veille après 15 minutes d'inactivité. En pingant toutes les 14 minutes, le backend reste toujours actif.

## Avantages
- ✅ **Disparition des cold starts** : Le serveur reste allumé en permanence
- ✅ **Temps de réponse** : 1-2 secondes au lieu de 45 secondes
- ✅ **Amélioration des conversions** : Les clients n'attendent pas
- ✅ **Économie de quota** : Exécution uniquement pendant les heures d'activité (8h-23h)

## Surveillance
- Vérifiez régulièrement l'historique des exécutions sur cron-job.org
- Configurez des alertes email en cas d'échec
- Surveillez les temps de réponse de votre backend

## Coût
- **cron-job.org** : Gratuit (jusqu'à 60 exécutions/heure)
- **Render** : Pas de coût supplémentaire (le ping utilise très peu de ressources)

## Notes importantes
- Cette configuration est idéale pendant les campagnes publicitaires
- Hors campagne, vous pouvez désactiver les cron jobs pour économiser les ressources Render
- Assurez-vous que votre URL backend est correcte avant de configurer
