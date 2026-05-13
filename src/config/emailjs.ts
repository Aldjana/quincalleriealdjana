// Configuration EmailJS
// Remplacez ces valeurs par vos propres identifiants EmailJS

export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_xvmopc7',        // Service ID depuis EmailJS
  TEMPLATE_ID: 'template_ik53ksn',      // Template ID depuis EmailJS  
  PUBLIC_KEY: 'CXu2y5wpxZBPpQJXx',       // Public Key depuis EmailJS
  TO_EMAIL: 'seckf004@gmail.com'     // Votre adresse Gmail pour recevoir les commandes
};

// Instructions pour configurer EmailJS :
// 1. Créez un compte gratuit sur https://www.emailjs.com/
// 2. Ajoutez un service email (Gmail, Outlook, etc.)
// 3. Créez un template avec les variables suivantes :
//    - {{customer_name}} : Nom du client
//    - {{customer_phone}} : Téléphone du client  
//    - {{customer_address}} : Adresse du client
//    - {{order_details}} : Détails des produits commandés
//    - {{total_amount}} : Montant total de la commande
//    - {{order_date}} : Date de la commande
// 4. Copiez vos identifiants et remplacez les valeurs ci-dessus
