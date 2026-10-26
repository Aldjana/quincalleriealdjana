import {
  Hammer,
  Drill,
  Wrench,
  PaintBucket,
  BrickWall,
  Lightbulb,
  Droplets,
  Nut,
  HardHat,
  Package,
  type LucideIcon,
} from 'lucide-react';
import { normalize } from './format';
import type { Product } from '../config/api';

const CATEGORY_ICONS: [RegExp, LucideIcon][] = [
  [/electrique|perceuse|visseuse|meuleuse|scie/, Drill],
  [/main|marteau|tournevis|pince/, Hammer],
  [/peinture|pinceau|rouleau/, PaintBucket],
  [/materiau|ciment|brique|construction|fer/, BrickWall],
  [/electricite|lampe|cable|ampoule|eclairage/, Lightbulb],
  [/plomberie|robinet|tuyau|eau/, Droplets],
  [/quincaillerie|vis|boulon|clou|ecrou/, Nut],
  [/securite|protection|casque|gant/, HardHat],
  [/outil|cle/, Wrench],
];

export const getCategoryIcon = (category: string): LucideIcon => {
  const key = normalize(category);
  return CATEGORY_ICONS.find(([pattern]) => pattern.test(key))?.[1] ?? Package;
};

/** Catégories présentes dans le catalogue, triées par nombre de produits */
export const getCategories = (products: Product[]) => {
  const counts = new Map<string, number>();
  for (const p of products) {
    const name = p.category.trim();
    if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'fr'));
};
