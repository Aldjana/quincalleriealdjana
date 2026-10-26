const priceFormatter = new Intl.NumberFormat('fr-FR');

/** 25000 -> "25 000 FCFA" */
export const formatPrice = (amount: number) => `${priceFormatter.format(Math.round(amount))} FCFA`;

export const formatDate = (value: string | Date, withTime = true) =>
  new Date(value).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });

/** Texte sans accents, en minuscules — pour la recherche */
export const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
