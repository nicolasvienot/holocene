/** Fond d'un article selon son thème : la couleur dit l'univers de l'article. */
const fonds: Record<string, string> = {
  Traiteur: 'var(--peach-light)',
  Mariage: 'var(--yellow-traiteur)',
  Restaurant: 'var(--lilac)',
  'Manger local': 'var(--cyan)',
};

export const fondCategorie = (categorie: string): string => fonds[categorie] ?? 'var(--paper)';

/** 22.05.2025 */
export const dateCourte = (date: Date): string =>
  new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
    .format(date)
    .replaceAll('/', '.');
