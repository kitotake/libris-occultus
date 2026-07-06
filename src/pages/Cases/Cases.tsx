import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faCalendarDays, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import casesData from '../../data/cases.json';
import type { Case } from '../../types';
import { useContenuGerable } from '../../hooks/useContenuGerable';
import './Cases.scss';

export default function Cases() {
  const { liste: cases } = useContenuGerable<Case>('cases', casesData as Case[]);

  return (
    <div className="conteneur page-cas">
      <header>
        <span className="eyebrow">Dossiers non classés</span>
        <h1>Cas Similaires</h1>
        <p className="page-cas__intro">
          Chaque dossier retrace une enquête où la frontière entre victime et coupable s’est brouillée.
          Le Dossier Singer reste le plus consulté du réseau.
        </p>
      </header>

      <div className="page-cas__liste">
        {cases.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
          >
            <Link to={`/cas/${c.id}`} className="carte-cas">
              <div className="carte-cas__entete">
                <h2>{c.titre}</h2>
                <span className="carte-cas__statut"><FontAwesomeIcon icon={faCircleCheck} /> {c.statut}</span>
              </div>
              <div className="carte-cas__meta">
                <span><FontAwesomeIcon icon={faLocationDot} /> {c.lieu}</span>
                <span><FontAwesomeIcon icon={faCalendarDays} /> {new Date(c.date).toLocaleDateString('fr-FR')}</span>
              </div>
              <p>{c.resume}</p>
              <div className="carte-cas__tags">
                {c.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
