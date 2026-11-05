import infos from '../data/infos.json';
import restaurant from '../data/restaurant.json';
import type { QuestionFaq } from '../types';

const SITE = 'https://www.holocene-restaurant.fr';

const adresse = {
  '@type': 'PostalAddress',
  streetAddress: infos.adresse.rue,
  postalCode: infos.adresse.codePostal,
  addressLocality: infos.adresse.ville,
  addressCountry: 'FR',
};

export const faqJsonLd = (questions: QuestionFaq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: questions.map(({ q, r }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: r },
  })),
});

export const restaurantJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Holocene Restaurant',
  url: `${SITE}/restaurant`,
  image: `${SITE}/og/restaurant.png`,
  telephone: infos.telephones.restaurant.tel,
  email: infos.email,
  address: adresse,
  servesCuisine: ['Bistronomique', 'Française', 'Cuisine de saison'],
  priceRange: `${Math.min(...restaurant.formules.map((f) => f.prix))} - ${Math.max(...restaurant.formules.map((f) => f.prix))} €`,
  acceptsReservations: infos.reservation.table,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '12:00',
      closes: '14:00',
    },
  ],
  sameAs: infos.reseaux.map((r) => r.url),
});

export const traiteurJsonLd = (nom: 'Holocene Traiteur' | 'Holocene Food Truck', chemin: string) => ({
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: nom,
  url: `${SITE}${chemin}`,
  image: `${SITE}/og/${chemin.replace('/', '')}.png`,
  telephone: infos.telephones.traiteurFoodTruck.tel,
  email: infos.email,
  address: adresse,
  areaServed: 'Occitanie',
  sameAs: infos.reseaux.map((r) => r.url),
});

export const articleJsonLd = (article: { titre: string; description: string; date: Date; chemin: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: article.titre,
  description: article.description,
  datePublished: article.date.toISOString().slice(0, 10),
  inLanguage: 'fr',
  url: `${SITE}${article.chemin}`,
  image: `${SITE}/og/holocene.png`,
  author: { '@type': 'Organization', name: infos.marque, url: SITE },
  publisher: { '@type': 'Organization', name: infos.marque, url: SITE },
});
