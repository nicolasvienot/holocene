/**
 * Pages Function : reçoit les formulaires du site et envoie un e-mail via Resend.
 *
 * Variables d'environnement Cloudflare :
 * - RESEND_API_KEY : clé Resend. Sans clé (en local), la demande est journalisée et la réponse est OK.
 * - RESEND_FROM : expéditeur, sur un domaine vérifié chez Resend.
 *
 * Sans JS : envoi classique puis redirection vers /merci. Avec JS (Accept: application/json) : réponse JSON.
 */

interface Env {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
}

interface Contexte {
  request: Request;
  env: Env;
}

const DESTINATAIRE = 'contact@holocene-traiteur.fr';
const EXPEDITEUR_PAR_DEFAUT = 'Site Holocene <contact@holocene-traiteur.fr>';

const DESTINATIONS: Record<string, string> = {
  contact: 'Contact',
  autre: 'Autre demande',
  privatisation: 'Privatisation',
  traiteur: 'Devis traiteur',
  'food-truck': 'Food truck',
};

const LIBELLES: Record<string, string> = {
  nom: 'Nom',
  societe: 'Société',
  email: 'E-mail',
  telephone: 'Téléphone',
  type: "Type d'événement",
  demande: 'Demande',
  date: 'Date',
  espace: 'Espace souhaité',
  lieu: 'Lieu',
  invites: "Nombre d'invités",
  convives: 'Nombre de convives',
  format: 'Format souhaité',
  budget: 'Budget par personne',
  message: 'Message',
};

const LONGUEUR_MAX = { court: 200, message: 5000 };

const nettoyer = (valeur: FormDataEntryValue | null, max: number): string =>
  typeof valeur === 'string' ? valeur.trim().slice(0, max) : '';

const estEmail = (valeur: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur);
const estTelephone = (valeur: string): boolean => valeur.replace(/\D/g, '').length >= 10;

/** Lit et valide le formulaire : les champs inconnus sont ignorés. */
function lireDemande(donnees: FormData) {
  const champs: Record<string, string> = {};
  for (const id of Object.keys(LIBELLES)) {
    const valeur = nettoyer(donnees.get(id), id === 'message' ? LONGUEUR_MAX.message : LONGUEUR_MAX.court);
    if (valeur) champs[id] = valeur;
  }

  const erreurs: string[] = [];
  if (!champs.nom) erreurs.push('Le nom est obligatoire.');
  if (!champs.email || !estEmail(champs.email)) erreurs.push("L'adresse e-mail est incomplète.");
  if (!champs.telephone || !estTelephone(champs.telephone)) erreurs.push('Le numéro de téléphone est incomplet.');

  const destination = nettoyer(donnees.get('destination'), 40);
  return {
    champs,
    erreurs,
    libelle: DESTINATIONS[destination] ?? DESTINATIONS.contact!,
    estRobot: nettoyer(donnees.get('site_web'), 200) !== '',
  };
}

const corpsEmail = (libelle: string, champs: Record<string, string>): string =>
  [`Nouvelle demande depuis le site : ${libelle}`, '', ...Object.entries(champs).map(([id, valeur]) => `${LIBELLES[id]} : ${valeur}`)].join('\n');

async function envoyer(env: Env, libelle: string, champs: Record<string, string>): Promise<boolean> {
  const texte = corpsEmail(libelle, champs);

  if (!env.RESEND_API_KEY) {
    console.log(`[demande] Pas de RESEND_API_KEY : e-mail non envoyé.\n${texte}`);
    return true;
  }

  const reponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.RESEND_FROM ?? EXPEDITEUR_PAR_DEFAUT,
      to: [DESTINATAIRE],
      reply_to: champs.email,
      subject: `[Site] ${libelle} - ${champs.nom}`.replace(/[\r\n]+/g, ' '),
      text: texte,
    }),
  });

  if (!reponse.ok) console.error(`[demande] Resend a répondu ${reponse.status}`);
  return reponse.ok;
}

const repondreJson = (corps: object, status: number): Response =>
  new Response(JSON.stringify(corps), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });

/** Page d'erreur pour l'envoi sans JS. */
const pageErreur = (messages: string[], status: number): Response =>
  new Response(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Demande non envoyée - Holocene</title></head><body style="font-family:'Varela Round',system-ui,sans-serif;max-width:60ch;margin:64px auto;padding:0 20px;line-height:1.6"><h1 style="font-size:28px;font-weight:400">Votre demande n'a pas été envoyée</h1><ul>${messages.map((m) => `<li>${m}</li>`).join('')}</ul><p><a href="javascript:history.back()" style="color:#000">Revenir au formulaire</a> ou appelez le <a href="tel:+33532740833" style="color:#000">05 32 74 08 33</a>.</p></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );

export async function onRequestPost({ request, env }: Contexte): Promise<Response> {
  const veutJson = (request.headers.get('Accept') ?? '').includes('application/json');
  const succes = (): Response =>
    veutJson ? repondreJson({ ok: true }, 200) : new Response(null, { status: 303, headers: { Location: new URL('/merci', request.url).toString() } });

  let donnees: FormData;
  try {
    donnees = await request.formData();
  } catch {
    return veutJson ? repondreJson({ ok: false, erreurs: ['Formulaire illisible.'] }, 400) : pageErreur(['Formulaire illisible.'], 400);
  }

  const { champs, erreurs, libelle, estRobot } = lireDemande(donnees);

  // Champ piège rempli : on répond comme si tout allait bien, sans rien envoyer.
  if (estRobot) return succes();

  if (erreurs.length) return veutJson ? repondreJson({ ok: false, erreurs }, 400) : pageErreur(erreurs, 400);

  let envoye = false;
  try {
    envoye = await envoyer(env, libelle, champs);
  } catch (erreur) {
    console.error('[demande] Échec de l\'envoi', erreur);
  }

  if (!envoye) {
    const message = "Le message n'a pas pu partir, merci de réessayer.";
    return veutJson ? repondreJson({ ok: false, erreurs: [message] }, 502) : pageErreur([message], 502);
  }

  return succes();
}
