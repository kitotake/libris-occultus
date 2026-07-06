import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPenToSquare, faTrashCan, faXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import casesData from '../../data/cases.json';
import creaturesData from '../../data/creatures.json';
import type { Case, Creature } from '../../types';
import { useContenuGerable } from '../../hooks/useContenuGerable';

function slugifier(texte: string) {
  return texte
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const casVide: Case = {
  id: '', titre: '', lieu: '', date: new Date().toISOString().slice(0, 10), statut: 'En cours',
  creatureLiee: '', victime: '', suspectInitial: '', resume: '', chronologie: [], notesEnquete: '',
  temoignage: '', tags: [],
};

export default function AdminCases() {
  const { liste, ajouter, modifier, supprimer, estPersonnalise } = useContenuGerable<Case>('cases', casesData as Case[]);
  const { liste: creatures } = useContenuGerable<Creature>('creatures', creaturesData as Creature[]);
  const [edition, setEdition] = useState<Case | null>(null);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  const ouvrirCreation = () => { setEdition({ ...casVide }); setFormulaireOuvert(true); };
  const ouvrirEdition = (c: Case) => { setEdition({ ...c }); setFormulaireOuvert(true); };

  const enregistrer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edition) return;
    const estNouveau = !liste.some((c) => c.id === edition.id);
    const finale: Case = { ...edition, id: edition.id || slugifier(edition.titre) || `cas-${Date.now()}` };
    if (estNouveau) ajouter(finale); else modifier(finale.id, finale);
    setFormulaireOuvert(false);
    setEdition(null);
  };

  const chronologieEnTexte = (c: Case) => c.chronologie.map((x) => `${x.heure} | ${x.evenement}`).join('\n');
  const parserChronologie = (texte: string) =>
    texte.split('\n').filter(Boolean).map((ligne) => {
      const [heure, ...reste] = ligne.split('|');
      return { heure: (heure ?? '').trim(), evenement: reste.join('|').trim() };
    });

  return (
    <div className="panneau-admin">
      <div className="panneau-admin__actions">
        <button className="bouton-sceau" onClick={ouvrirCreation}><FontAwesomeIcon icon={faPlus} /> Ajouter un dossier</button>
      </div>

      <div className="tableau-admin">
        {liste.map((c) => (
          <div className="tableau-admin__ligne" key={c.id}>
            <div>
              <strong>{c.titre}</strong> <span className="tableau-admin__meta">{c.lieu}</span>
              {estPersonnalise(c.id) && <span className="etiquette-perso">personnalisé</span>}
            </div>
            <div className="tableau-admin__boutons">
              <button onClick={() => ouvrirEdition(c)} aria-label="Modifier"><FontAwesomeIcon icon={faPenToSquare} /></button>
              <button onClick={() => supprimer(c.id)} aria-label="Supprimer" className="danger"><FontAwesomeIcon icon={faTrashCan} /></button>
            </div>
          </div>
        ))}
      </div>

      {formulaireOuvert && edition && (
        <div className="voile-modal">
          <form className="formulaire-admin" onSubmit={enregistrer}>
            <div className="formulaire-admin__entete">
              <h2>{liste.some((c) => c.id === edition.id) ? 'Modifier le dossier' : 'Nouveau dossier'}</h2>
              <button type="button" onClick={() => setFormulaireOuvert(false)} aria-label="Fermer"><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <div className="formulaire-admin__grille">
              <label>Titre
                <input value={edition.titre} onChange={(e) => setEdition({ ...edition, titre: e.target.value })} required />
              </label>
              <label>Lieu
                <input value={edition.lieu} onChange={(e) => setEdition({ ...edition, lieu: e.target.value })} />
              </label>
              <label>Date
                <input type="date" value={edition.date} onChange={(e) => setEdition({ ...edition, date: e.target.value })} />
              </label>
              <label>Statut
                <input value={edition.statut} onChange={(e) => setEdition({ ...edition, statut: e.target.value })} />
              </label>
              <label>Créature liée
                <select value={edition.creatureLiee} onChange={(e) => setEdition({ ...edition, creatureLiee: e.target.value })}>
                  <option value="">—</option>
                  {creatures.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </label>
              <label>Victime
                <input value={edition.victime} onChange={(e) => setEdition({ ...edition, victime: e.target.value })} />
              </label>
              <label>Suspect initial
                <input value={edition.suspectInitial} onChange={(e) => setEdition({ ...edition, suspectInitial: e.target.value })} />
              </label>
              <label>Tags (séparés par des virgules)
                <input value={edition.tags.join(', ')} onChange={(e) => setEdition({ ...edition, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} />
              </label>
            </div>

            <label className="formulaire-admin__plein">Résumé
              <textarea rows={3} value={edition.resume} onChange={(e) => setEdition({ ...edition, resume: e.target.value })} />
            </label>
            <label className="formulaire-admin__plein">Chronologie (une entrée par ligne, format « heure | événement »)
              <textarea rows={4} value={chronologieEnTexte(edition)}
                onChange={(e) => setEdition({ ...edition, chronologie: parserChronologie(e.target.value) })} />
            </label>
            <label className="formulaire-admin__plein">Notes d’enquête
              <textarea rows={3} value={edition.notesEnquete} onChange={(e) => setEdition({ ...edition, notesEnquete: e.target.value })} />
            </label>
            <label className="formulaire-admin__plein">Témoignage
              <textarea rows={2} value={edition.temoignage} onChange={(e) => setEdition({ ...edition, temoignage: e.target.value })} />
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
