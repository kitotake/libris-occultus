import { useCallback, useMemo } from 'react';
import { useCookieStorage } from './useCookieStorage';

interface Surcouche<T> {
  ajouts: T[];
  modifications: Record<string, Partial<T>>;
  suppressions: string[];
}

const surcoucheVide: Surcouche<never> = { ajouts: [], modifications: {}, suppressions: [] };

/**
 * Fusionne une liste de base (issue des fichiers JSON, en lecture seule)
 * avec une "surcouche" éditable par l'administration et persistée en cookies :
 * - les éléments supprimés sont masqués (le JSON d'origine n'est jamais modifié)
 * - les éléments modifiés reçoivent leurs champs modifiés
 * - les éléments ajoutés sont ajoutés à la fin
 */
export function useContenuGerable<T extends { id: string }>(cle: string, basedonnees: T[]) {
  const [surcouche, setSurcouche] = useCookieStorage<Surcouche<T>>(
    `libris-admin:${cle}`,
    surcoucheVide as Surcouche<T>
  );

  const liste = useMemo(() => {
    const base = basedonnees
      .filter((item) => !surcouche.suppressions.includes(item.id))
      .map((item) => ({ ...item, ...(surcouche.modifications[item.id] ?? {}) }));
    return [...base, ...surcouche.ajouts];
  }, [basedonnees, surcouche]);

  const estPersonnalise = useCallback(
    (id: string) => surcouche.ajouts.some((a) => a.id === id) || Boolean(surcouche.modifications[id]),
    [surcouche]
  );

  const ajouter = useCallback(
    (item: T) => setSurcouche((prev) => ({ ...prev, ajouts: [...prev.ajouts, item] })),
    [setSurcouche]
  );

  const modifier = useCallback(
    (id: string, patch: Partial<T>) => {
      setSurcouche((prev) => {
        const estUnAjout = prev.ajouts.some((a) => a.id === id);
        if (estUnAjout) {
          return { ...prev, ajouts: prev.ajouts.map((a) => (a.id === id ? { ...a, ...patch } : a)) };
        }
        return { ...prev, modifications: { ...prev.modifications, [id]: { ...prev.modifications[id], ...patch } } };
      });
    },
    [setSurcouche]
  );

  const supprimer = useCallback(
    (id: string) => {
      setSurcouche((prev) => {
        const estUnAjout = prev.ajouts.some((a) => a.id === id);
        if (estUnAjout) {
          return { ...prev, ajouts: prev.ajouts.filter((a) => a.id !== id) };
        }
        return { ...prev, suppressions: [...new Set([...prev.suppressions, id])] };
      });
    },
    [setSurcouche]
  );

  const restaurerTout = useCallback(() => setSurcouche(surcoucheVide as Surcouche<T>), [setSurcouche]);

  return { liste, ajouter, modifier, supprimer, estPersonnalise, restaurerTout };
}
