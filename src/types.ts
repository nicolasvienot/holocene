/** Types du contenu de src/data/*.json. */

export type ChampType = 'text' | 'email' | 'tel' | 'date' | 'number' | 'select' | 'choix' | 'textarea';

export interface Champ {
  id: string;
  label: string;
  type: ChampType | string;
  requis?: boolean;
  placeholder?: string;
  options?: string[];
  pleineLargeur?: boolean;
  /** Sur Contact : types de demande pour lesquels ce champ apparaît */
  pour?: string[];
}

export interface QuestionFaq {
  q: string;
  r: string;
  ouvert?: boolean;
}

export interface HeroFact {
  label: string;
  valeur: string;
}

export interface Plat {
  nom: string;
  description?: string;
  note?: string;
  tags?: string[];
  supplement?: number;
}

export interface Etape {
  num?: string;
  label?: string;
  titre?: string;
  texte: string;
}
