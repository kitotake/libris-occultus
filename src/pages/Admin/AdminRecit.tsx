import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPenToSquare, faTrashCan, faXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import storyData from '../../data/story.json';
import casesData from '../../data/cases.json';
import creaturesData from '../../data/creatures.json';
import type { Chapitre, BlocRecit, Case, Creature } from '../../types';
import { useContenuGerable } from '../../hooks/useContenuGerable';

const typesDeBloc: BlocRecit['type'][] = ['narration', 'dialogue', 'citation', 'fin'];

const chapitreVide: Chapitre = {
  id: '', numero: 1, titre: '', sousTitre: '', lieuDate: '',
  blocs: [{ type: 'narration', texte: '' }],
  creatureLiee: '', casLie: '', estRupture: false,
};

// Un bloc par paragraphe (séparés par une ligne vide). La première ligne du
// paragraphe indique le type ("narration", "dialogue: Auteur (note)",
// "citation" ou "fin"), les lignes suivantes forment le texte du bloc.
function blocsEnTexte(blocs: BlocRecit[]) {
  return blocs
    .map((b) => {
      if (b.type === 'dialogue') {
        const entete = b.note ? `dialogue: ${b.auteur ?? ''} (${b.note})` : `dialogue: ${b.auteur ?? ''}`;
        return `${entete}\n${b.texte}`;
      }
      return `${b.type}\n${b.texte}`;
    })
    .join('\n\n');
}

function texteEnBlocs(texte: string): BlocRecit[] {
  return texte
    .split(/\n\s*\n/)
    .map((paragraphe) => paragraphe.trim())
    .filter(Boolean)
    .map((paragraphe) => {
      const [premiereLigne, ...reste] = paragraphe.split('\n');
      const corps = reste.join('\n').trim();
      const matchDialogue = premiereLigne.match(/^dialogue:\s*([^(]*)\s*(?:\(([^)]*)\))?$/i);
      if (matchDialogue) {
        return {
          type: 'dialogue' as const,
          auteur: matchDialogue[1].trim(),
          note: matchDialogue[2]?.trim() || undefined,
          texte: corps,
        };
      }
      const typeReconnu = typesDeBloc.find((t) => t === premiereLigne.trim().toLowerCase());
      if (typeReconnu) return { type: typeReconnu, texte: corps };
      // Pas d'en-tête reconnue : on considère tout le paragraphe comme de la narration.
      return { type: 'narration' as const, texte: paragraphe };
    });
}

export default function AdminRecit() {
  const { liste, ajouter, modifier, supprimer, estPersonnalise } = useContenuGerable<Chapitre>(
    'story', storyData as Chapitre[]
  );
  const { liste: cas } = useContenuGerable<Case>('cases', casesData as Case[]);
  const { liste: creatures } = useContenuGerable<Creature>('creatures', creaturesData as Creature[]);
  const [edition, setEdition] = useState<Chapitre | null>(null);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [texteBlocs, setTexteBlocs] = useState('');

  const listeTriee = [...liste].sort((a, b) => a.numero - b.numero);

  const ouvrirCreation = () => {
    const prochainNumero = liste.length ? Math.max(...liste.map((c) => c.numero)) + 1 : 1;
    const nouveau = { ...chapitreVide, numero: prochainNumero };
    setEdition(nouveau);
    setTexteBlocs(blocsEnTexte(nouveau.blocs));
    setFormulaireOuvert(true);
  };

  const ouvrirEdition = (c: Chapitre) => {
    setEdition({ ...c });
    setTexteBlocs(blocsEnTexte(c.blocs));
    setFormulaireOuvert(true);
  };

  const enregistrer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edition) return;
    const estNouveau = !liste.some((c) => c.id === edition.id);
    const finale: Chapitre = {
      ...edition,
      id: edition.id || `chapitre-${edition.numero}-${Date.now()}`,
      blocs: texteEnBlocs(texteBlocs),
      creatureLiee: edition.creatureLiee || undefined,
      casLie: edition.casLie || undefined,
      sousTitre: edition.sousTitre || undefined,
    };
    if (estNouveau) ajouter(finale); else modifier(finale.id, finale);
    setFormulaireOuvert(false);
    setEdition(null);
  };

  return (
    <div className="panneau-admin">
      <div className="panneau-admin__actions">
        <button className="bouton-sceau" onClick={ouvrirCreation}><FontAwesomeIcon icon={faPlus} /> Ajouter un chapitre</button>
      </div>

      <div className="tableau-admin">
        {listeTriee.map((c) => (
          <div className="tableau-admin__ligne" key={c.id}>
            <div>
              <strong>Ch. {c.numero} — {c.titre}</strong> <span className="tableau-admin__meta">{c.lieuDate}</span>
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
              <h2>{liste.some((c) => c.id === edition.id) ? 'Modifier le chapitre' : 'Nouveau chapitre'}</h2>
              <button type="button" onClick={() => setFormulaireOuvert(false)} aria-label="Fermer"><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <div className="formulaire-admin__grille">
              <label>Numéro
                <input type="number" min={1} value={edition.numero}
                  onChange={(e) => setEdition({ ...edition, numero: Number(e.target.value) })} required />
              </label>
              <label>Titre
                <input value={edition.titre} onChange={(e) => setEdition({ ...edition, titre: e.target.value })} required />
              </label>
              <label>Sous-titre (facultatif)
                <input value={edition.sousTitre ?? ''} onChange={(e) => setEdition({ ...edition, sousTitre: e.target.value })} />
              </label>
              <label>Lieu / date
                <input value={edition.lieuDate} onChange={(e) => setEdition({ ...edition, lieuDate: e.target.value })} />
              </label>
              <label>Créature liée
                <select value={edition.creatureLiee ?? ''} onChange={(e) => setEdition({ ...edition, creatureLiee: e.target.value })}>
                  <option value="">—</option>
                  {creatures.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </label>
              <label>Cas lié
                <select value={edition.casLie ?? ''} onChange={(e) => setEdition({ ...edition, casLie: e.target.value })}>
                  <option value="">—</option>
                  {cas.map((c) => <option key={c.id} value={c.id}>{c.titre}</option>)}
                </select>
              </label>
              <label className="formulaire-admin__case-a-cocher">
                <input type="checkbox" checked={Boolean(edition.estRupture)}
                  onChange={(e) => setEdition({ ...edition, estRupture: e.target.checked })} />
                Chapitre de rupture (renvoie vers le journal intime)
              </label>
            </div>

            <label className="formulaire-admin__plein">
              Texte du chapitre (un bloc par paragraphe, séparés par une ligne vide.
              Écrire « dialogue: Auteur (note) » sur la première ligne d’un bloc de
              dialogue, « citation » ou « fin » pour les autres types, ou rien pour
              de la narration)
              <textarea rows={14} value={texteBlocs} onChange={(e) => setTexteBlocs(e.target.value)} />
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
