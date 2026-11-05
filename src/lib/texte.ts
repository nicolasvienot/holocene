/** Nimbus n'a pas de tiret long : dans un titre, un label ou un bouton, « — » s'écrit « - ». */
export const nimbus = (texte: string): string => texte.replace(/\s*[—–]\s*/g, ' - ');

/** Vrai pour un lien sortant, à ouvrir dans un nouvel onglet. */
export const estExterne = (href: string): boolean => /^https?:\/\//.test(href);

/** Attributs à ajouter sur tout lien sortant. */
export const attrsExterne = (href: string) =>
  estExterne(href) ? ({ target: '_blank', rel: 'noopener' } as const) : {};

/** Vrai si la valeur est un emplacement à compléter, ex. « [URL du PDF] ». */
export const estPlaceholder = (valeur: string): boolean => /^\[.*\]$/.test(valeur.trim());

/** 20.5 devient « 20,50€ », 17 devient « 17€ ». */
export const prix = (valeur: number): string =>
  Number.isInteger(valeur) ? `${valeur}€` : `${valeur.toFixed(2).replace('.', ',')}€`;
