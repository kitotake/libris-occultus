import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookSkull } from '@fortawesome/free-solid-svg-icons';
import { jouerSon } from '../../utils/sound';
import './BookCover.scss';

interface Props {
  onOuvert: () => void;
}

export default function BookCover({ onOuvert }: Props) {
  const [ouverture, setOuverture] = useState(false);

  const ouvrir = () => {
    if (ouverture) return;
    jouerSon('page-tourne', 0.5);
    setOuverture(true);
    setTimeout(onOuvert, 900);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="couverture"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.button
          className="couverture__livre"
          onClick={ouvrir}
          aria-label="Ouvrir le grimoire Libris Occultus"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.div
            className="couverture__face couverture__face--droite"
            animate={ouverture ? { rotateY: -150, boxShadow: '0 0 0 rgba(0,0,0,0)' } : { rotateY: 0 }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            style={{ transformOrigin: 'left center' }}
          >
            <div className="couverture__ornement couverture__ornement--haut" />
            <FontAwesomeIcon icon={faBookSkull} className="couverture__icone" />
            <h1 className="couverture__titre">Libris<br />Occultus</h1>
            <p className="couverture__sous-titre">Grimoire tenu par le réseau des chasseurs</p>
            <div className="couverture__ornement couverture__ornement--bas" />
            <span className="couverture__instruction">Cliquez pour ouvrir</span>
          </motion.div>

          <div className="couverture__interieur" aria-hidden="true" />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
