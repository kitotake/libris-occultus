import { useState, useEffect, useCallback, useRef } from 'react';
import { ecrireCookieJSON, lireCookieJSON } from '../utils/cookieStorage';

export function useCookieStorage<T>(cle: string, valeurInitiale: T) {
  const [valeur, setValeur] = useState<T>(() => {
    const stocke = lireCookieJSON<T>(cle);
    return stocke ?? valeurInitiale;
  });

  // Évite d'écrire un cookie dès le tout premier rendu si rien n'a changé
  const premierRendu = useRef(true);

  useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    ecrireCookieJSON(cle, valeur);
  }, [cle, valeur]);

  const reinitialiser = useCallback(() => setValeur(valeurInitiale), [valeurInitiale]);

  return [valeur, setValeur, reinitialiser] as const;
}
