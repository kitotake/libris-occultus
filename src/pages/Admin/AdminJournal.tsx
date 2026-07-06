import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPenToSquare, faTrashCan, faXmark, faFloppyDisk, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import journalData from '../../data/journalEntries.json';
import creaturesData from '../../data/creatures.json';
import type { JournalEntry, Creature } from '../../types';
import { useCookieStorage } from '../../hooks/useCookieStorage';
import { useContenuGerable } from '../../hooks/useContenuGerable';

// Même clé de cookie que la page publique /journal : les entrées créées ou
// modifiées ici apparaissent donc immédiatement dans le Journal Intime, et
// inversement.
const entreeVide: JournalEntry = {
  id: '', auteur: '', date: new Date().toISOString().slice(0, 10), titre: '',
  contenu: '', epingle: false, tagCreature: '',
};

function genererId() {
  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function AdminJournal() {
  const [entrees, setEntrees] = useCookieStorage<JournalEntry[]>('libris-journal', journalData as JournalEntry[]);
  const { liste: creatures } = useContenuGerable<Creature>('creatures', creaturesData as Creature[]);
  const [edition, setEdition] = useState<JournalEntry | null>(null);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  const entreesTriees = [...entrees].sort((a, b) => {
    if (a.epingle !== b.epingle) return a.epingle ? -1 : 1;
    return b.date.localeCompare(a.date);
  });

  const ouvrirCreation = () => { setEdition({ ...entreeVide }); setFormulaireOuvert(true); };
  const ouvrirEdition = (entree: JournalEntry) => { setEdition({ ...entree }); setFormulaireOuvert(true); };

  const enregistrer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edition) return;
    const estNouvelle = !entrees.some((entree) => entree.id === edition.id);
    if (estNouvelle) {
      const finale: JournalEntry = { ...edition, id: genererId() };
      setEntrees((prev) => [finale, ...prev]);
    } else {
      setEntrees((prev) => prev.map((entree) => (entree.id === edition.id ? edition : entree)));
    }
    setFormulaireOuvert(false);
    setEdition(null);
  };

  const supprimer = (id: string) => setEntrees((prev) => prev.filter((entree) => entree.id !== id));

  return (
    <div className="panneau-admin">
      <div className="panneau-admin__actions">
        <button className="bouton-sceau" onClick={ouvrirCreation}><FontAwesomeIcon icon={faPlus} /> Ajouter une page</button>
      </div>

      <div className="tableau-admin">
        {entreesTriees.map((entree) => (
          <div className="tableau-admin__ligne" key={entree.id}>
            <div>
              <strong>{entree.titre}</strong>{' '}
              <span className="tableau-admin__meta">{entree.auteur} · {entree.date}</span>
              {entree.epingle && <span className="etiquette-perso"><FontAwesomeIcon icon={faThumbtack} /> épinglée</span>}
            </div>
            <div className="tableau-admin__boutons">
              <button onClick={() => ouvrirEdition(entree)} aria-label="Modifier"><FontAwesomeIcon icon={faPenToSquare} /></button>
              <button onClick={() => supprimer(entree.id)} aria-label="Supprimer" className="danger"><FontAwesomeIcon icon={faTrashCan} /></button>
            </div>
          </div>
        ))}
      </div>

      {formulaireOuvert && edition && (
        <div className="voile-modal">
          <form className="formulaire-admin" onSubmit={enregistrer}>
            <div className="formulaire-admin__entete">
              <h2>{entrees.some((entree) => entree.id === edition.id) ? 'Modifier la page' : 'Nouvelle page'}</h2>
              <button type="button" onClick={() => setFormulaireOuvert(false)} aria-label="Fermer"><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <div className="formulaire-admin__grille">
              <label>Titre
                <input value={edition.titre} onChange={(e) => setEdition({ ...edition, titre: e.target.value })} required />
              </label>
              <label>Auteur
                <input value={edition.auteur} onChange={(e) => setEdition({ ...edition, auteur: e.target.value })} required />
              </label>
              <label>Date
                <input type="date" value={edition.date} onChange={(e) => setEdition({ ...edition, date: e.target.value })} />
              </label>
              <label>Créature associée (facultatif)
                <select value={edition.tagCreature} onChange={(e) => setEdition({ ...edition, tagCreature: e.target.value })}>
                  <option value="">—</option>
                  {creatures.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </label>
              <label className="formulaire-admin__case-a-cocher">
                <input type="checkbox" checked={edition.epingle}
                  onChange={(e) => setEdition({ ...edition, epingle: e.target.checked })} />
                Épingler cette page en haut du journal
              </label>
            </div>

            <label className="formulaire-admin__plein">Contenu
              <textarea rows={8} value={edition.contenu} onChange={(e) => setEdition({ ...edition, contenu: e.target.value })} />
            </label>

            <div className="formulaire-admin__actions">
              <button type="button" className="bouton-sceau secondaire" onClick={() => setFormulaireOuvert(false)}>Annuler</button>
              <button type="submit" className="bouton-sceau"><FontAwesomeIcon icon={faFloppyDisk} /> Enregistrer</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
