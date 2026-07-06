import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkull } from '@fortawesome/free-solid-svg-icons';
import type { Creature } from '../../types';
import './CreatureCard.scss';

export default function CreatureCard({ creature, index = 0 }: { creature: Creature; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
    >
      <Link to={`/creatures/${creature.id}`} className="fiche-creature">
        <div className="fiche-creature__image" style={{ backgroundImage: `url(${creature.image})` }} />
        <div className="fiche-creature__corps">
          <span className="fiche-creature__categorie">{creature.categorie}</span>
          <h3>{creature.nom}</h3>
          <p className="fiche-creature__soustitre">{creature.sousTitre}</p>
          <div className="fiche-creature__danger" title={`Dangerosité ${creature.dangerosite}/5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <FontAwesomeIcon key={i} icon={faSkull} className={i < creature.dangerosite ? 'active' : ''} />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
