import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPenToSquare, faTrashCan, faXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import creaturesData from '../../data/creatures.json';
import type { Creature } from '../../types';
import { useContenuGerable } from '../../hooks/useContenuGerable';

function slugifier(texte: string) {
  return texte
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const creatureVide: Creature = {
  id: '', nom: '', sousTitre: '', categorie: 'Créature', dangerosite: 3,
  anneePremiereApparition: null, image: 'https://placehold.co/600x800/0f0c08/d4af37?text=%3F',
  description: '', signes: [], faiblesses: [], histoire: '', casLies: [],
};

export default function AdminCreatures() {
  const { liste, ajouter, modifier, supprimer, estPersonnalise } = useContenuGerable<Creature>(
    'creatures', creaturesData as Creature[]
  );
  const [edition, setEdition] = useState<Creature | null>(null);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  const ouvrirCreation = () => { setEdition({ ...creatureVide }); setFormulaireOuvert(true); };
  const ouvrirEdition = (c: Creature) => { setEdition({ ...c }); setFormulaireOuvert(true); };

  const enregistrer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edition) return;
    const estNouvelle = !liste.some((c) => c.id === edition.id);
    const finale: Creature = { ...edition, id: edition.id || slugifier(edition.nom) || `creature-${Date.now()}` };
    if (estNouvelle) ajouter(finale); else modifier(finale.id, finale);
    setFormulaireOuvert(false);
    setEdition(null);
  };

  return (
    <div className="panneau-admin">
      <div className="panneau-admin__actions">
        <button className="bouton-sceau" onClick={ouvrirCreation}><FontAwesomeIcon icon={faPlus} /> Ajouter une créature</button>
      </div>

      <div className="tableau-admin">
        {liste.map((c) => (
          <div className="tableau-admin__ligne" key={c.id}>
            <div>
              <strong>{c.nom}</strong> <span className="tableau-admin__meta">{c.categorie}</span>
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
              <h2>{liste.some((c) => c.id === edition.id) ? 'Modifier la créature' : 'Nouvelle créature'}</h2>
              <button type="button" onClick={() => setFormulaireOuvert(false)} aria-label="Fermer"><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <div className="formulaire-admin__grille">
              <label>Nom
                <input value={edition.nom} onChange={(e) => setEdition({ ...edition, nom: e.target.value })} required />
              </label>
              <label>Sous-titre
                <input value={edition.sousTitre} onChange={(e) => setEdition({ ...edition, sousTitre: e.target.value })} />
              </label>
              <label>Catégorie
                <input value={edition.categorie} onChange={(e) => setEdition({ ...edition, categorie: e.target.value })} />
              </label>
              <label>Dangerosité (1-5)
                <input type="number" min={1} max={5} value={edition.dangerosite}
                  onChange={(e) => setEdition({ ...edition, dangerosite: Number(e.target.value) })} />
              </label>
              <label>Image (URL)
                <input value={edition.image} onChange={(e) => setEdition({ ...edition, image: e.target.value })} />
              </label>
              <label>Première apparition (année)
                <input type="number" value={edition.anneePremiereApparition ?? ''}
                  onChange={(e) => setEdition({ ...edition, anneePremiereApparition: e.target.value ? Number(e.target.value) : null })} />
              </label>
            </div>

            <label className="formulaire-admin__plein">Description
              <textarea rows={3} value={edition.description} onChange={(e) => setEdition({ ...edition, description: e.target.value })} />
            </label>
            <label className="formulaire-admin__plein">Signes (un par ligne)
              <textarea rows={3} value={edition.signes.join('\n')}
                onChange={(e) => setEdition({ ...edition, signes: e.target.value.split('\n').filter(Boolean) })} />
            </label>
            <label className="formulaire-admin__plein">Faiblesses (une par ligne)
              <textarea rows={3} value={edition.faiblesses.join('\n')}
                onChange={(e) => setEdition({ ...edition, faiblesses: e.target.value.split('\n').filter(Boolean) })} />
            </label>
            <label className="formulaire-admin__plein">Histoire
              <textarea rows={3} value={edition.histoire} onChange={(e) => setEdition({ ...edition, histoire: e.target.value })} />
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
