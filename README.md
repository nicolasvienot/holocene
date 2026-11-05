# Holocene Food Event - site Astro

Site du restaurant, du traiteur et du food truck Holocene (Balma, Toulouse). Le design vient des maquettes de `reference/pages/` ; les règles sont dans `CLAUDE.md`.

## Commandes

Node 24 (`nvm use`).

| Commande | Rôle |
|---|---|
| `npm install` | Installe les dépendances |
| `npm run dev` | Serveur de développement, http://localhost:4321 |
| `npm run build` | Génère le site dans `dist/` |
| `npm run preview` | Sert `dist/` en local |
| `npm run check` | Vérifie les types (`astro check`) |
| `npm run check:glyphs` | Après un build : signale tout caractère absent des polices Nimbus et Vividly fournies |

## Contenu

- `src/data/*.json` : cartes, formats, FAQ, références, coordonnées. Modifier ces fichiers ne demande pas de toucher aux composants.
- `src/content/journal/*.md` : articles du journal. Le schéma est dans `src/content.config.ts`.
- `public/menus/` : menus PDF.
- `src/data/restaurant.json > carte` : la carte du mois. Quand `carte.pdf` contient une URL, le bouton de téléchargement s'active.

Un glyphe absent de Nimbus passe en police de secours via `enNimbus()` (`src/lib/texte.ts`) et la classe `.secours`. Avec la licence complète, cette fonction pourra renvoyer le texte tel quel.

## Formulaires

`functions/api/demande.ts` est une Pages Function : elle valide la demande, ignore les robots (champ piège) et envoie un e-mail à `contact@holocene-traiteur.fr` via Resend.

Variables d'environnement Cloudflare Pages :

- `RESEND_API_KEY` : clé Resend. Sans clé, la demande est seulement journalisée et la réponse est OK.
- `RESEND_FROM` : expéditeur sur un domaine vérifié chez Resend. Par défaut : `Site Holocene <contact@holocene-traiteur.fr>`.

`npm run dev` ne sert pas les Pages Functions. Pour tester l'envoi en local : `npm run build && npx wrangler pages dev dist`.

## Déploiement

Cloudflare Pages : commande `npm run build`, dossier `dist`, Node 24. `public/_redirects` fait les 301 des anciennes URL : à vérifier après le premier déploiement.

## Avant la mise en ligne

Acheter les licences web de Nimbus Sans Round et de Vividly, et garder le dépôt privé tant que les fichiers `public/fonts/*-subset.woff2` y sont.
