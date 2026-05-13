# Guide de Configuration EmailJS pour les Commandes

## Étape 1 : Créer un compte EmailJS

1. Allez sur https://www.emailjs.com/
2. Cliquez sur "Sign Up" pour créer un compte gratuit
3. Vérifiez votre adresse email

## Étape 2 : Ajouter un service email

1. Connectez-vous à votre tableau de bord EmailJS
2. Cliquez sur "Email Services" dans le menu de gauche
3. Cliquez sur "Add New Service"
4. Choisissez "Gmail" (ou votre autre service email)
5. Connectez votre compte Gmail et autorisez EmailJS
6. Donnez un nom à votre service (ex: "ma-boutique-gmail")

## Étape 3 : Créer un template d'email

1. Cliquez sur "Email Templates" dans le menu de gauche
2. Cliquez sur "Create New Template"
3. Configurez le template comme suit :

**Nom du template :** `Commande Ma Boutique`

**Sujet :** `Nouvelle commande - {{customer_name}}`

**Contenu du message :**
```
Bonjour,

Vous avez reçu une nouvelle commande sur Ma Boutique :

📋 INFORMATIONS CLIENT
Nom : {{customer_name}}
Téléphone : {{customer_phone}}
Adresse : {{customer_address}}

📦 DÉTAILS DE LA COMMANDE
{{order_details}}

💰 MONTANT TOTAL : {{total_amount}} FCFA

📅 Date : {{order_date}}

Merci d'utiliser Ma Boutique !
```

## Étape 4 : Obtenir vos identifiants

Une fois le template créé, vous aurez besoin de ces 3 identifiants :

1. **Service ID** : Dans "Email Services" → copiez l'ID de votre service Gmail
2. **Template ID** : Dans "Email Templates" → copiez l'ID de votre template
3. **Public Key** : Dans "Account" → "API Keys" → copiez votre Public Key

## Étape 5 : Configurer le fichier emailjs.ts

Ouvrez le fichier `src/config/emailjs.ts` et remplacez les valeurs :

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'votre_service_id',        // Mettez votre Service ID ici
  TEMPLATE_ID: 'votre_template_id',      // Mettez votre Template ID ici  
  PUBLIC_KEY: 'votre_public_key',       // Mettez votre Public Key ici
  TO_EMAIL: 'votre-email@gmail.com'     // Mettez votre adresse Gmail ici
};
```

## Étape 6 : Tester

1. Lancez votre application : `npm run dev`
2. Ajoutez des produits au panier
3. Cliquez sur "Commander"
4. Remplissez le formulaire et soumettez
5. Vérifiez que vous recevez bien un email dans votre Gmail

## Fonctionnalités incluses

✅ Envoi automatique des détails de commande par email
✅ Formatage clair des informations client et produits
✅ Calcul automatique du montant total
✅ Vidage du panier après commande réussie
✅ Gestion des erreurs avec message d'alerte
✅ Notification de succès pour le client

## Dépannage

**Problème : Email non reçu**
- Vérifiez vos identifiants EmailJS
- Regardez dans le dossier spam de votre Gmail
- Vérifiez que le service email est bien activé

**Problème : Erreur d'envoi**
- Assurez-vous que votre Public Key est correcte
- Vérifiez que toutes les variables du template sont bien définies
- Consultez la console du navigateur pour les erreurs détaillées

## Support

Pour toute question sur la configuration EmailJS :
- Documentation officielle : https://www.emailjs.com/docs/
- Support EmailJS : support@emailjs.com
