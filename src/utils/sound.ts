// Petit gestionnaire de sons d'ambiance.
// Les fichiers audio ne sont PAS fournis par défaut : dépose tes propres
// .mp3/.ogg dans /public/sounds/ avec ces noms exacts pour les activer.
// En leur absence, chaque appel échoue silencieusement (catch vide) —
// le site reste 100% fonctionnel sans aucun son.

type NomSon = 'page-tourne' | 'plume-gratte' | 'ambiance';

const chemins: Record<NomSon, string> = {
  'page-tourne': '/sounds/page-tourne.mp3',
  'plume-gratte': '/sounds/plume-gratte.mp3',
  ambiance: '/sounds/ambiance-grimoire.mp3',
};

const cache = new Map<NomSon, HTMLAudioElement>();
let sonsActives = true;

export function definirSonsActives(actif: boolean) {
  sonsActives = actif;
}

export function sonsSontActives() {
  return sonsActives;
}

export function jouerSon(nom: NomSon, volume = 0.4) {
  if (!sonsActives) return;
  try {
    let audio = cache.get(nom);
    if (!audio) {
      audio = new Audio(chemins[nom]);
      cache.set(nom, audio);
    }
    audio.volume = volume;
    audio.currentTime = 0;
    void audio.play().catch(() => {
      /* fichier absent ou lecture bloquée par le navigateur : silence */
    });
  } catch {
    /* API Audio indisponible : silence */
  }
}
