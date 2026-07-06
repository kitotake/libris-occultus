import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSkull,
  faEye,
  faShieldHalved,
  faBookOpen,
  faArrowLeft,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import creaturesData from '../../data/creatures.json';
import casesData from '../../data/cases.json';
import type { Case, Creature } from '../../types';
import './Creatures.scss';

const creatures = creaturesData as Creature[];
const cases = casesData as Case[];

export default function CreatureDetail() {
  const { id } = useParams<{ id: string }>();
  const creature = creatures.find((c) => c.id === id);

  if (!creature) {
    return (
      <div className="conteneur page-archives">
        <h1>Entrée introuvable</h1>
        <p>Cette page du grimoire semble avoir été arrachée.</p>
        <Link to="/creatures" className="bouton-sceau secondaire"><FontAwesomeIcon icon={faArrowLeft} /> Retour aux archives</Link>
      </div>
    );
  }

  const casAssocies = cases.filter((c) => creature.casLies.includes(c.id));

  return (
    <div className="conteneur page-fiche">
      <Link to="/creatures" className="page-fiche__retour"><FontAwesomeIcon icon={faArrowLeft} /> Retour aux archives</Link>

      <motion.div
        className="page-fiche__grille"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="page-fiche__image" style={{ backgroundImage: `url(${creature.image})` }} />

        <div className="page-fiche__contenu">
          <span className="eyebrow">{creature.categorie}{creature.anneePremiereApparition ? ` · première apparition documentée en ${creature.anneePremiereApparition}` : ''}</span>
          <h1>{creature.nom}</h1>
          <p className="page-fiche__soustitre">{creature.sousTitre}</p>

          <div className="page-fiche__danger">
            <span>Dangerosité</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <FontAwesomeIcon key={i} icon={faSkull} className={i < creature.dangerosite ? 'active' : ''} />
            ))}
          </div>

          <p className="page-fiche__description">{creature.description}</p>

          <div className="page-fiche__deux-colonnes">
            <section className="bloc-liste bloc-liste--signes">
              <h2><FontAwesomeIcon icon={faEye} /> Signes reconnaissables</h2>
              <ul>{creature.signes.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </section>

            <section className="bloc-liste bloc-liste--faiblesses">
              <h2><FontAwesomeIcon icon={faShieldHalved} /> Faiblesses connues</h2>
              <ul>{creature.faiblesses.map((f, i) => <li key={i}>{f}</li>)}</ul>
            </section>
          </div>

          <section className="bloc-histoire">
            <h2><FontAwesomeIcon icon={faBookOpen} /> Notes historiques</h2>
            <p>{creature.histoire}</p>
          </section>

          {casAssocies.length > 0 && (
            <section className="bloc-cas-lies">
              <h2><FontAwesomeIcon icon={faLink} /> Dossiers liés</h2>
              {casAssocies.map((c) => (
                <Link key={c.id} to={`/cas/${c.id}`} className="lien-cas-lie">
                  <strong>{c.titre}</strong>
                  <span>{c.lieu} — {c.date}</span>
                </Link>
              ))}
            </section>
          )}
        </div>
      </motion.div>
    </div>
  );
}
