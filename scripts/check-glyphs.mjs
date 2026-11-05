// Vérifie que le HTML généré n'utilise, en Nimbus et en Vividly, que les glyphes des fichiers fournis.
// Lit la police de chaque élément dans le CSS généré : à lancer après `npm run build`.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(process.argv[2] ?? 'dist');
const NIMBUS = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ÉÈÎÔ€&'’.,-()* ");
const VIVIDLY = new Set('ABCDEFGILMNOPRSTUX ');
const VIDES = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const ENTITES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

const fichiers = (dossier, ext) =>
  fs.readdirSync(dossier, { withFileTypes: true }).flatMap((e) => {
    const chemin = path.join(dossier, e.name);
    if (e.isDirectory()) return fichiers(chemin, ext);
    return chemin.endsWith(ext) ? [chemin] : [];
  });

const decoder = (texte) =>
  texte.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (tout, code) => {
    if (code[0] !== '#') return ENTITES[code] ?? tout;
    return String.fromCodePoint(code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10));
  });

/** Extrait du CSS les règles qui fixent une police : { tag, classes, cid, police }. */
function lireRegles(css) {
  const regles = [];
  for (const [, selecteurs, corps] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const famille = corps.match(/font-family:([^;}]+)/)?.[1];
    if (!famille || selecteurs.trim().startsWith('@')) continue;
    const police = /--font-display|Holo Nimbus/.test(famille) ? 'nimbus' : /--font-accent|Holo Vividly/.test(famille) ? 'vividly' : 'autre';
    for (const selecteur of selecteurs.split(',')) {
      const dernier = selecteur.trim().split(/[\s>+~]+/).pop() ?? '';
      if (dernier.includes('::')) continue;
      const tag = dernier.match(/^[a-z][a-z0-9]*/i)?.[0]?.toLowerCase();
      const classes = [...dernier.matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
      const cid = dernier.match(/\[(data-astro-cid-[\w-]+)\]/)?.[1];
      if (tag || classes.length) regles.push({ tag, classes, cid, police });
    }
  }
  return regles;
}

const css = fichiers(DIST, '.css').map((f) => fs.readFileSync(f, 'utf8')).join('\n');

function policeDe(balise, attributs, regles) {
  const classes = new Set((attributs.match(/class="([^"]*)"/)?.[1] ?? '').split(/\s+/).filter(Boolean));
  // La dernière règle qui s'applique l'emporte, comme dans la feuille de styles.
  let police;
  for (const r of regles) {
    if (r.tag && r.tag !== balise) continue;
    if (!r.classes.every((c) => classes.has(c))) continue;
    if (r.cid && !attributs.includes(r.cid)) continue;
    police = r.police;
  }
  return police;
}

const problemes = [];
let textesVerifies = 0;

for (const fichier of fichiers(DIST, '.html')) {
  const html = fs.readFileSync(fichier, 'utf8');
  const stylesInternes = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  const regles = lireRegles(`${css}\n${stylesInternes}`);
  const corps = html
    .slice(html.indexOf('<body'))
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '');

  const pile = [];
  const motif = /<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>|([^<]+)/g;
  for (const [, ferme, balise, attributs = '', texte] of corps.matchAll(motif)) {
    if (texte !== undefined) {
      const police = [...pile].reverse().find((p) => p)?.valueOf();
      const contenu = decoder(texte).trim();
      if (!contenu || (police !== 'nimbus' && police !== 'vividly')) continue;
      textesVerifies += 1;
      const jeu = police === 'nimbus' ? NIMBUS : VIVIDLY;
      const absents = [...new Set(contenu.toUpperCase())].filter((c) => !jeu.has(c) && !/\s/.test(c));
      if (absents.length) problemes.push({ fichier: path.relative(DIST, fichier), police, absents: absents.join(' '), contenu });
      continue;
    }
    const nom = balise.toLowerCase();
    if (ferme) {
      pile.pop();
    } else if (!VIDES.has(nom) && !attributs.trimEnd().endsWith('/')) {
      pile.push(policeDe(nom, attributs, regles));
    }
  }
}

if (problemes.length) {
  console.error(`check:glyphs : ${problemes.length} texte(s) avec des glyphes absents de la police.\n`);
  for (const p of problemes) console.error(`- ${p.fichier} [${p.police}] manque « ${p.absents} » dans : ${p.contenu}`);
  process.exit(1);
}

console.log(`check:glyphs : ${textesVerifies} textes en Nimbus ou Vividly vérifiés, aucun glyphe manquant.`);
