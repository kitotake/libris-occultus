import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(cle: string, valeurInitiale: T) {
  const [valeur, setValeur] = useState<T>(() => {
    try {
      const stocke = window.localStorage.getItem(cle);
      return stocke ? (JSON.parse(stocke) as T) : valeurInitiale;
    } catch {
      return valeurInitiale;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(cle, JSON.stringify(valeur));
    } catch {
      // stockage indisponible : on ignore silencieusement
    }
  }, [cle, valeur]);

  const reinitialiser = useCallback(() => setValeur(valeurInitiale), [valeurInitiale]);

  return [valeur, setValeur, reinitialiser] as const;
}
