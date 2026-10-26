import { SHOP } from '../../config/shop';
import { Breadcrumb } from '../components/ui/Breadcrumb';

export const PrivacyPage = () => (
  <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
    <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Confidentialité' }]} />
    <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">Politique de confidentialité</h1>

    <div className="mt-6 space-y-6 leading-relaxed text-slate-700 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-navy-900">
      <section>
        <h2>Qui sommes-nous ?</h2>
        <p>
          Le site est édité par {SHOP.name}, {SHOP.address}. Contact : {SHOP.email} — {SHOP.phoneDisplay}.
        </p>
      </section>

      <section>
        <h2>Données collectées</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Commandes</strong> : nom, téléphone, adresse de livraison, précisions éventuelles et produits commandés.
          </li>
          <li>
            <strong>Formulaire de contact</strong> : nom, téléphone, email (facultatif) et message.
          </li>
          <li>
            <strong>Panier</strong> : enregistré uniquement dans votre navigateur, pour le retrouver à votre prochaine visite.
          </li>
        </ul>
      </section>

      <section>
        <h2>Utilisation</h2>
        <p>
          Ces données servent uniquement à traiter vos commandes, vous livrer et répondre à vos messages. Elles ne sont ni
          vendues ni cédées. Les notifications de commande nous sont transmises par email via le service EmailJS.
        </p>
      </section>

      <section>
        <h2>Mesure d'audience et publicité</h2>
        <p>
          Nous utilisons le Pixel Meta (Facebook / Instagram) pour mesurer l'efficacité de nos publicités : pages vues,
          produits consultés, ajouts au panier et commandes. Meta peut utiliser des cookies à cette fin. Vous pouvez gérer
          vos préférences publicitaires depuis les paramètres de votre compte Facebook ou Instagram et bloquer les cookies
          dans votre navigateur.
        </p>
      </section>

      <section>
        <h2>Conservation et vos droits</h2>
        <p>
          Les informations de commande sont conservées le temps nécessaire au suivi de la commande et à la gestion de la
          relation client. Vous pouvez demander l'accès, la rectification ou la suppression de vos données en nous écrivant
          à {SHOP.email} ou au {SHOP.phoneDisplay}.
        </p>
      </section>
    </div>
  </div>
);
