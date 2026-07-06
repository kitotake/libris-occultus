// Stockage persistant par COOKIES (et non par localStorage).
// Un cookie est limité à environ 4 Ko : les données un peu volumineuses
// (listes de créatures ou de cas modifiés) sont donc automatiquement
// découpées en plusieurs cookies numérotés, réassemblés à la lecture.
// Limite raisonnable : ~180 Ko au total par domaine (norme des navigateurs),
// largement suffisant pour du contenu ajouté/édité via l'administration.

const TAILLE_MORCEAU = 3500; // marge de sécurité sous les ~4096 octets par cookie
const DUREE_JOURS = 365;

function ecrireCookieBrut(nom: string, valeur: string, jours = DUREE_JOURS) {
  const expiration = new Date();
  expiration.setTime(expiration.getTime() + jours * 24 * 60 * 60 * 1000);
  document.cookie = `${nom}=${encodeURIComponent(valeur)};expires=${expiration.toUTCString()};path=/;SameSite=Lax`;
}

function lireCookieBrut(nom: string): string | null {
  const cible = `${nom}=`;
  const parts = document.cookie.split(';');
  for (let part of parts) {
    part = part.trim();
    if (part.startsWith(cible)) {
      return decodeURIComponent(part.slice(cible.length));
    }
  }
  return null;
}

function supprimerCookieBrut(nom: string) {
  document.cookie = `${nom}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
}

/** Écrit une valeur JSON dans un ou plusieurs cookies (découpage transparent). */
export function ecrireCookieJSON<T>(cle: string, valeur: T, jours = DUREE_JOURS): boolean {
  try {
    const serialise = JSON.stringify(valeur);
    const morceaux: string[] = [];
    for (let i = 0; i < serialise.length; i += TAILLE_MORCEAU) {
      morceaux.push(serialise.slice(i, i + TAILLE_MORCEAU));
    }

    // Nettoyage des anciens morceaux au cas où la nouvelle valeur en compte moins
    const ancienNombre = Number(lireCookieBrut(`${cle}__n`) ?? '0');
    for (let i = 0; i < ancienNombre; i++) supprimerCookieBrut(`${cle}__${i}`);

    morceaux.forEach((morceau, i) => ecrireCookieBrut(`${cle}__${i}`, morceau, jours));
    ecrireCookieBrut(`${cle}__n`, String(morceaux.length), jours);
    return true;
  } catch {
    return false;
  }
}

/** Relit une valeur JSON précédemment stockée via ecrireCookieJSON. */
export function lireCookieJSON<T>(cle: string): T | null {
  try {
    const nombre = Number(lireCookieBrut(`${cle}__n`) ?? '0');
    if (!nombre) return null;
    let complet = '';
    for (let i = 0; i < nombre; i++) {
      const morceau = lireCookieBrut(`${cle}__${i}`);
      if (morceau === null) return null; // cookie tronqué / expiré : on ignore plutôt que de planter
      complet += morceau;
    }
    return JSON.parse(complet) as T;
  } catch {
    return null;
  }
}

export function supprimerCookieJSON(cle: string) {
  const nombre = Number(lireCookieBrut(`${cle}__n`) ?? '0');
  for (let i = 0; i < nombre; i++) supprimerCookieBrut(`${cle}__${i}`);
  supprimerCookieBrut(`${cle}__n`);
}

export function cookiesDisponibles(): boolean {
  try {
    ecrireCookieBrut('__test-libris', '1', 1);
    const ok = lireCookieBrut('__test-libris') === '1';
    supprimerCookieBrut('__test-libris');
    return ok;
  } catch {
    return false;
  }
}
