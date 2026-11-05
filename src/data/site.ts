/** Coordonnées et liens de la maison (source : CLAUDE.md). */

export interface Phone {
  display: string;
  tel: string;
}

export const phones = {
  restaurant: { display: '05 32 74 08 34', tel: '+33532740834' },
  traiteur: { display: '05 32 74 08 33', tel: '+33532740833' },
} satisfies Record<string, Phone>;

export const site = {
  name: 'Holocene Food Event',
  address: {
    street: '14 rue Louis Renault',
    city: '31130 Balma',
    mapsUrl: 'https://maps.google.com/?q=14+rue+Louis+Renault+31130+Balma',
  },
  hours: { long: 'Lundi - vendredi, 12h - 14h', short: 'Lun - Ven, 12h - 14h' },
  email: 'contact@holocene-traiteur.fr',
  area: "Toulouse, Haute-Garonne et toute l'Occitanie",
  zenchef: {
    table: 'https://bookings.zenchef.com/results?rid=368665&pid=1001',
    privatisation: 'https://bookings.zenchef.com/privatisation?rid=368665&pid=1001',
  },
  socials: [
    { id: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/holocene.tlse/' },
    { id: 'facebook', name: 'Facebook', url: 'https://fr-fr.facebook.com/holocene.tlse/' },
    { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/company/holocenetlse/' },
  ],
} as const;
