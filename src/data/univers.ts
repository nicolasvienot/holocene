import { phones, site, type Phone } from './site';

export type UniversId = 'holocene' | 'food-truck' | 'traiteur' | 'restaurant';

export interface NavLink {
  label: string;
  href: string;
  /** Lien vers un autre site : s'ouvre dans un nouvel onglet. */
  external?: boolean;
}

export interface Univers {
  id: UniversId;
  name: string;
  /** Nom complet, pour les alt et aria-label. */
  fullName: string;
  home: string;
  /** Valeurs affichées par le design system. Le rendu passe par data-univers et tokens.css. */
  colors: { bg: string; flower: string; light: string };
  logo: string;
  icon: string;
  phone: Phone;
  nav: NavLink[];
  cta: NavLink;
}

export const univers: Record<UniversId, Univers> = {
  holocene: {
    id: 'holocene',
    name: 'Holocene',
    fullName: 'Holocene Food.Event',
    home: '/',
    colors: { bg: '#ffffff', flower: '#ffc7cd', light: '#fafafa' },
    logo: '/brand/logo-holocene-food-event.svg',
    icon: '/brand/icon-holocene.svg',
    phone: phones.traiteur,
    nav: [
      { label: 'Restaurant', href: '/restaurant' },
      { label: 'Traiteur', href: '/traiteur' },
      { label: 'Food truck', href: '/food-truck' },
      { label: "L'équipe", href: '/equipe' },
      { label: 'Journal', href: '/journal' },
    ],
    cta: { label: 'Demander un devis', href: '/contact' },
  },
  'food-truck': {
    id: 'food-truck',
    name: 'Food truck',
    fullName: 'Holocene Food Truck',
    home: '/food-truck',
    colors: { bg: '#d4ffff', flower: '#f7ba94', light: '#e4ffff' },
    logo: '/brand/logo-holocene-food-truck.svg',
    icon: '/brand/icon-food-truck.svg',
    phone: phones.traiteur,
    nav: [
      { label: 'La carte', href: '/food-truck#carte' },
      { label: 'Événements', href: '/food-truck#evenements' },
      { label: 'Ils nous ont invités', href: '/food-truck#invites' },
      { label: 'Comment réserver', href: '/food-truck#reserver' },
    ],
    cta: { label: 'Réserver le truck', href: '/contact' },
  },
  traiteur: {
    id: 'traiteur',
    name: 'Traiteur',
    fullName: 'Holocene Traiteur',
    home: '/traiteur',
    colors: { bg: '#f7ba94', flower: '#fffaaf', light: '#fcdbbf' },
    logo: '/brand/logo-holocene-traiteur.svg',
    icon: '/brand/icon-traiteur.svg',
    phone: phones.traiteur,
    nav: [
      { label: 'Pour qui', href: '/traiteur#pourqui' },
      { label: 'Formats & menus', href: '/traiteur#formats' },
      // « Comment ça marche » dans la maquette : le Ç n'existe pas dans Nimbus.
      { label: 'Les étapes', href: '/traiteur#etapes' },
      { label: 'Références', href: '/traiteur#references' },
    ],
    cta: { label: 'Demander un devis', href: '/contact' },
  },
  restaurant: {
    id: 'restaurant',
    name: 'Restaurant',
    fullName: 'Holocene Restaurant',
    home: '/restaurant',
    colors: { bg: '#fbf4b1', flower: '#e0cfe6', light: '#f2e8f4' },
    logo: '/brand/logo-holocene-restaurant.svg',
    icon: '/brand/icon-restaurant.svg',
    phone: phones.restaurant,
    nav: [
      { label: 'La carte', href: '/restaurant#carte' },
      { label: 'Le bar', href: '/restaurant#bar' },
      { label: 'Le lieu', href: '/restaurant#lieu' },
      { label: 'Privatiser', href: '/restaurant/privatiser' },
      { label: 'Infos pratiques', href: '/restaurant#infos' },
    ],
    cta: { label: 'Réserver une table', href: site.zenchef.table, external: true },
  },
};

/** Ordre d'affichage des univers : la marque, puis la chronologie. */
export const universOrder: UniversId[] = ['holocene', 'food-truck', 'traiteur', 'restaurant'];

/** Chronologie de la marque : la fleur de chaque univers devient le fond du suivant. */
export const chronology: UniversId[] = ['food-truck', 'traiteur', 'restaurant'];
