/** Nimbus n'a pas de tiret long : dans un titre, un label ou un bouton, « — » s'écrit « - ». */
export const nimbus = (texte: string): string => texte.replace(/\s*[—–]\s*/g, ' - ');

const GLYPHES_NIMBUS = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ÉÈÎÔ€&'’.,-()* ");

const echapper = (texte: string): string =>
  texte.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * HTML d'un texte en Nimbus : les glyphes absents de la police fournie passent en police de secours.
 * Avec la licence complète de Nimbus, cette fonction pourra simplement renvoyer le texte.
 */
export const enNimbus = (texte: string): string =>
  [...nimbus(texte)]
    .map((c) => (GLYPHES_NIMBUS.has(c.toUpperCase()) ? echapper(c) : `<span class="secours">${echapper(c)}</span>`))
    .join('');

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
