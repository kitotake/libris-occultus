import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFeatherPointed,
  faThumbtack,
  faPenToSquare,
  faTrashCan,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import journalData from '../../data/journalEntries.json';
import type { JournalEntry } from '../../types';
import { useCookieStorage } from '../../hooks/useCookieStorage';
import JournalEntryForm from './JournalEntryForm';
import { jouerSon } from '../../utils/sound';
import './Journal.scss';

function genererId() {
  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function Journal() {
  const [entrees, setEntrees] = useCookieStorage<JournalEntry[]>(
    'libris-journal',
    journalData as JournalEntry[]
  );
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [entreeEnEdition, setEntreeEnEdition] = useState<JournalEntry | null>(null);
  const [cibleSuppression, setCibleSuppression] = useState<JournalEntry | null>(null);

  const entreesTriees = useMemo(
    () =>
      [...entrees].sort((a, b) => {
        if (a.epingle !== b.epingle) return a.epingle ? -1 : 1;
        return b.date.localeCompare(a.date);
      }),
    [entrees]
  );

  const ouvrirCreation = () => {
    setEntreeEnEdition(null);
    setFormulaireOuvert(true);
  };

  const ouvrirEdition = (entree: JournalEntry) => {
    setEntreeEnEdition(entree);
    setFormulaireOuvert(true);
  };

  const enregistrer: React.ComponentProps<typeof JournalEntryForm>['onEnregistrer'] = (donnees) => {
    if (donnees.id) {
      setEntrees((prev) => prev.map((e) => (e.id === donnees.id ? { ...(donnees as JournalEntry) } : e)));
    } else {
      setEntrees((prev) => [{ ...donnees, id: genererId() } as JournalEntry, ...prev]);
    }
    setFormulaireOuvert(false);
    setEntreeEnEdition(null);
  };

  const confirmerSuppression = () => {
    if (!cibleSuppression) return;
    jouerSon('page-tourne', 0.35);
    setEntrees((prev) => prev.filter((e) => e.id !== cibleSuppression.id));
    setCibleSuppression(null);
  };

  return (
    <div className="conteneur page-journal">
      <header className="page-journal__entete">
        <div>
          <span className="eyebrow">Carnets personnels des chasseurs</span>
          <h1>Journal Intime</h1>
          <p>Des pages écrites dans l’urgence, la peur ou le doute. Certaines sauvent des vies. D’autres ne servent qu’à tenir debout une nuit de plus.</p>
        </div>
        <button className="bouton-sceau" onClick={ouvrirCreation}>
          <FontAwesomeIcon icon={faPlus} /> Nouvelle page
        </button>
      </header>

      <div className="page-journal__liste">
        <AnimatePresence>
          {entreesTriees.map((entree) => (
            <motion.article
              key={entree.id}
              className={`page-manuscrite ${entree.epingle ? 'est-epinglee' : ''}`}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              {entree.epingle && (
                <span className="page-manuscrite__epingle" title="Page épinglée">
                  <FontAwesomeIcon icon={faThumbtack} />
                </span>
              )}
              <div className="page-manuscrite__entete">
                <div>
                  <h2>{entree.titre}</h2>
                  <p className="page-manuscrite__meta">
                    {entree.auteur} · {new Date(entree.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {entree.tagCreature && entree.tagCreature !== 'inconnu' && (
                      <span className="page-manuscrite__tag"> · {entree.tagCreature}</span>
                    )}
                  </p>
                </div>
                <div className="page-manuscrite__actions">
                  <button onClick={() => ouvrirEdition(entree)} aria-label="Modifier cette entrée">
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button onClick={() => setCibleSuppression(entree)} aria-label="Supprimer cette entrée" className="danger">
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              </div>
              <p className="page-manuscrite__texte">{entree.contenu}</p>
            </motion.article>
          ))}
        </AnimatePresence>

        {entreesTriees.length === 0 && (
          <p className="page-journal__vide">
            <FontAwesomeIcon icon={faFeatherPointed} /> Aucune page pour l’instant. La plume attend.
          </p>
        )}
      </div>

      <AnimatePresence>
        {formulaireOuvert && (
          <motion.div className="voile-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <JournalEntryForm
              entreeInitiale={entreeEnEdition}
              onEnregistrer={enregistrer}
              onAnnuler={() => { setFormulaireOuvert(false); setEntreeEnEdition(null); }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cibleSuppression && (
          <motion.div className="voile-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="boite-confirmation" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
              <h3>Déchirer cette page ?</h3>
              <p>« {cibleSuppression.titre} » sera définitivement effacée du journal. Cette action est irréversible.</p>
              <div className="boite-confirmation__actions">
                <button className="bouton-sceau secondaire" onClick={() => setCibleSuppression(null)}>Garder la page</button>
                <button className="bouton-sceau" onClick={confirmerSuppression}>
                  <FontAwesomeIcon icon={faTrashCan} /> Déchirer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
