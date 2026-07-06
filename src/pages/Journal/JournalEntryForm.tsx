import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeatherPointed, faXmark, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import type { JournalEntry } from '../../types';
import { jouerSon } from '../../utils/sound';
import './JournalEntryForm.scss';

interface Props {
  entreeInitiale?: JournalEntry | null;
  onEnregistrer: (entree: Omit<JournalEntry, 'id'> & { id?: string }) => void;
  onAnnuler: () => void;
}

const creaturesDisponibles = ['djinn', 'wendigo', 'shapeshifter', 'fantome', 'vampire', 'inconnu'];

export default function JournalEntryForm({ entreeInitiale, onEnregistrer, onAnnuler }: Props) {
  const [auteur, setAuteur] = useState('');
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [tagCreature, setTagCreature] = useState('inconnu');
  const [epingle, setEpingle] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    if (entreeInitiale) {
      setAuteur(entreeInitiale.auteur);
      setTitre(entreeInitiale.titre);
      setContenu(entreeInitiale.contenu);
      setTagCreature(entreeInitiale.tagCreature);
      setEpingle(entreeInitiale.epingle);
    }
  }, [entreeInitiale]);

  const soumettre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auteur.trim() || !titre.trim() || !contenu.trim()) {
      setErreur('La plume ne peut pas écrire sur une page vide : remplis chaque champ.');
      return;
    }
    setErreur('');
    jouerSon('plume-gratte', 0.35);
    onEnregistrer({
      id: entreeInitiale?.id,
      auteur: auteur.trim(),
      titre: titre.trim(),
      contenu: contenu.trim(),
      tagCreature,
      epingle,
      date: entreeInitiale?.date ?? new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <motion.form
      className="formulaire-journal"
      onSubmit={soumettre}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="formulaire-journal__entete">
        <h2><FontAwesomeIcon icon={faFeatherPointed} /> {entreeInitiale ? 'Modifier l’entrée' : 'Nouvelle entrée'}</h2>
        <button type="button" className="formulaire-journal__fermer" onClick={onAnnuler} aria-label="Fermer le formulaire">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      {erreur && <p className="formulaire-journal__erreur" role="alert">{erreur}</p>}

      <div className="formulaire-journal__ligne">
        <label>
          Auteur
          <input value={auteur} onChange={(e) => setAuteur(e.target.value)} placeholder="Ton nom de chasseur" />
        </label>
        <label>
          Créature associée
          <select value={tagCreature} onChange={(e) => setTagCreature(e.target.value)}>
            {creaturesDisponibles.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>

      <label className="formulaire-journal__champ-plein">
        Titre de l’entrée
        <input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ce que je me souviens" />
      </label>

      <label className="formulaire-journal__champ-plein">
        Récit
        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          rows={7}
          placeholder="Écris ici, comme si personne d'autre ne devait jamais le lire..."
        />
      </label>

      <label className="formulaire-journal__epingle">
        <input type="checkbox" checked={epingle} onChange={(e) => setEpingle(e.target.checked)} />
        <FontAwesomeIcon icon={faThumbtack} /> Épingler cette page en tête du journal
      </label>

      <div className="formulaire-journal__actions">
        <button type="button" className="bouton-sceau secondaire" onClick={onAnnuler}>Annuler</button>
        <button type="submit" className="bouton-sceau">
          <FontAwesomeIcon icon={faFeatherPointed} /> {entreeInitiale ? 'Enregistrer les modifications' : 'Sceller cette page'}
        </button>
      </div>
    </motion.form>
  );
}
