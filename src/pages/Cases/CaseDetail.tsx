import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faLocationDot,
  faCalendarDays,
  faUserSecret,
  faQuoteLeft,
  faLink,
  faClockRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import casesData from '../../data/cases.json';
import creaturesData from '../../data/creatures.json';
import type { Case, Creature } from '../../types';
import { useContenuGerable } from '../../hooks/useContenuGerable';
import './Cases.scss';

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const { liste: cases } = useContenuGerable<Case>('cases', casesData as Case[]);
  const { liste: creatures } = useContenuGerable<Creature>('creatures', creaturesData as Creature[]);
  const dossier = cases.find((c) => c.id === id);
  const creatureLiee = creatures.find((c) => c.id === dossier?.creatureLiee);

  if (!dossier) {
    return (
      <div className="conteneur page-cas">
        <h1>Dossier introuvable</h1>
        <Link to="/cas" className="bouton-sceau secondaire"><FontAwesomeIcon icon={faArrowLeft} /> Retour aux dossiers</Link>
      </div>
    );
  }

  return (
    <div className="conteneur page-cas-detail">
      <Link to="/cas" className="page-fiche__retour"><FontAwesomeIcon icon={faArrowLeft} /> Retour aux dossiers</Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="eyebrow">{dossier.statut}</span>
        <h1>{dossier.titre}</h1>

        <div className="page-cas-detail__meta">
          <span><FontAwesomeIcon icon={faLocationDot} /> {dossier.lieu}</span>
          <span><FontAwesomeIcon icon={faCalendarDays} /> {new Date(dossier.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span><FontAwesomeIcon icon={faUserSecret} /> {dossier.suspectInitial}</span>
        </div>

        <p className="page-cas-detail__resume">{dossier.resume}</p>

        <section className="page-cas-detail__section">
          <h2><FontAwesomeIcon icon={faClockRotateLeft} /> Chronologie de l’enquête</h2>
          <ol className="chronologie">
            {dossier.chronologie.map((item, i) => (
              <li key={i}>
                <span className="chronologie__heure">{item.heure}</span>
                <span className="chronologie__evenement">{item.evenement}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="page-cas-detail__section bloc-histoire">
          <h2>Notes d’enquête</h2>
          <p>{dossier.notesEnquete}</p>
        </section>

        <blockquote className="citation-temoignage">
          <FontAwesomeIcon icon={faQuoteLeft} />
          <p>{dossier.temoignage}</p>
        </blockquote>

        {creatureLiee && (
          <Link to={`/creatures/${creatureLiee.id}`} className="lien-cas-lie">
            <strong><FontAwesomeIcon icon={faLink} /> Créature identifiée : {creatureLiee.nom}</strong>
            <span>Consulter la fiche complète dans les Archives</span>
          </Link>
        )}

        <div className="page-cas-detail__tags">
          {dossier.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
      </motion.div>
    </div>
  );
}
