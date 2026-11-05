import infos from './infos.json';

export type UniversId = 'holocene' | 'food-truck' | 'traiteur' | 'restaurant';
export type CapsuleId = 'accueil' | 'equipe' | 'journal' | 'contact' | 'restaurant' | 'privatiser' | 'traiteur' | 'food-truck';

export interface Lien {
  label: string;
  href: string;
}

export interface UniversInfo {
  id: UniversId;
  label: string;
  href: string;
  /** Couleur de fond de l'univers, en variable CSS */
  fond: string;
  logo: string;
  logoAlt: string;
  icone: string;
}

/** Ordre de la capsule : la marque, puis la chronologie food truck, traiteur, restaurant. */
export const univers: UniversInfo[] = [
  { id: 'holocene', label: 'Holocene', href: '/', fond: 'var(--pink)', logo: '/brand/logo-holocene-food-event.svg', logoAlt: 'Holocene Food.Event', icone: '/brand/icon-holocene.svg' },
  { id: 'food-truck', label: 'Food truck', href: '/food-truck', fond: 'var(--cyan)', logo: '/brand/logo-holocene-food-truck.svg', logoAlt: 'Holocene Food Truck', icone: '/brand/icon-food-truck.svg' },
  { id: 'traiteur', label: 'Traiteur', href: '/traiteur', fond: 'var(--peach)', logo: '/brand/logo-holocene-traiteur.svg', logoAlt: 'Holocene Traiteur', icone: '/brand/icon-traiteur.svg' },
  { id: 'restaurant', label: 'Restaurant', href: '/restaurant', fond: 'var(--yellow)', logo: '/brand/logo-holocene-restaurant.svg', logoAlt: 'Holocene Restaurant', icone: '/brand/icon-restaurant.svg' },
];

export const universParId = (id: UniversId): UniversInfo => univers.find((u) => u.id === id) ?? univers[0]!;

const RESTAURANT: Lien = { label: 'Restaurant', href: '/restaurant' };
const TRAITEUR: Lien = { label: 'Traiteur', href: '/traiteur' };
const FOOD_TRUCK: Lien = { label: 'Food truck', href: '/food-truck' };
const EQUIPE: Lien = { label: "L'équipe", href: '/equipe' };
const JOURNAL: Lien = { label: 'Journal', href: '/journal' };
const DEVIS: Lien = { label: 'Demander un devis', href: '/contact' };

const liensRestaurant = (prefixe: string): Lien[] => [
  { label: 'La carte', href: `${prefixe}#carte` },
  { label: 'Le bar', href: `${prefixe}#bar` },
  { label: 'Le lieu', href: `${prefixe}#lieu` },
  { label: 'Privatiser', href: '/restaurant/privatiser' },
  { label: 'Infos pratiques', href: `${prefixe}#infos` },
];

export interface Capsule {
  univers: UniversId;
  aria: string;
  liens: Lien[];
  cta: Lien;
}

const principale = 'Navigation principale';

export const capsules: Record<CapsuleId, Capsule> = {
  accueil: { univers: 'holocene', aria: principale, liens: [RESTAURANT, TRAITEUR, FOOD_TRUCK, EQUIPE, JOURNAL], cta: DEVIS },
  contact: { univers: 'holocene', aria: principale, liens: [RESTAURANT, TRAITEUR, FOOD_TRUCK, EQUIPE, JOURNAL], cta: DEVIS },
  equipe: { univers: 'holocene', aria: principale, liens: [RESTAURANT, TRAITEUR, FOOD_TRUCK, EQUIPE, JOURNAL], cta: DEVIS },
  journal: { univers: 'holocene', aria: principale, liens: [RESTAURANT, TRAITEUR, FOOD_TRUCK, EQUIPE, JOURNAL], cta: DEVIS },
  restaurant: {
    univers: 'restaurant',
    aria: 'Navigation du restaurant',
    liens: liensRestaurant(''),
    cta: { label: 'Réserver une table', href: infos.reservation.table },
  },
  privatiser: {
    univers: 'restaurant',
    aria: 'Navigation du restaurant',
    liens: liensRestaurant('/restaurant'),
    cta: { label: 'Faire une demande', href: '#demande' },
  },
  traiteur: {
    univers: 'traiteur',
    aria: 'Navigation du traiteur',
    liens: [
      { label: 'Pour qui', href: '#pourqui' },
      { label: 'Formats & menus', href: '#formats' },
      { label: 'Clé en main', href: '#service' },
      { label: 'Références', href: '#references' },
    ],
    cta: { label: 'Demander un devis', href: '#devis' },
  },
  'food-truck': {
    univers: 'food-truck',
    aria: 'Navigation du food truck',
    liens: [
      { label: 'La carte', href: '#carte' },
      { label: 'Événements', href: '#evenements' },
      { label: 'Références', href: '#references' },
      { label: 'Comment réserver', href: '#reserver' },
    ],
    cta: { label: 'Réserver le truck', href: '#reserver' },
  },
};

export const piedDePage = {
  baseline: 'Restaurant, traiteur et food truck à Balma, Toulouse et partout en Occitanie.',
  zone: "Toulouse et toute l'Occitanie",
  nosUnivers: [
    RESTAURANT,
    { label: 'Privatiser le restaurant', href: '/restaurant/privatiser' },
    TRAITEUR,
    FOOD_TRUCK,
  ] satisfies Lien[],
  laMaison: [
    { label: 'Accueil', href: '/' },
    EQUIPE,
    JOURNAL,
    { label: 'Contact & devis', href: '/contact' },
  ] satisfies Lien[],
  legal: [
    { label: 'Mentions légales', href: '/mentions-legales' },
    { label: 'Confidentialité', href: '/confidentialite' },
  ] satisfies Lien[],
};
