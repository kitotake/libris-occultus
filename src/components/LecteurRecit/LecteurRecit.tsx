import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faListUl,
  faLink,
  faScroll,
  faFeatherPointed,
} from '@fortawesome/free-solid-svg-icons';
import chapitresData from '../../data/story.json';
import type { Chapitre } from '../../types';
import { jouerSon } from '../../utils/sound';
import './LecteurRecit.scss';

const chapitres = chapitresData as Chapitre[];

export default function LecteurRecit() {
  const [indexActuel, setIndexActuel] = useState(0);
  const [sommaireOuvert, setSommaireOuvert] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const chapitre = chapitres[indexActuel];
  const estDernier = indexActuel === chapitres.length - 1;
  const estPremier = indexActuel === 0;

  const progression = useMemo(
    () => Math.round(((indexActuel + 1) / chapitres.length) * 100),
    [indexActuel]
  );

  const tourner = (sens: 1 | -1) => {
    const suivant = indexActuel + sens;
    if (suivant < 0 || suivant >= chapitres.length) return;
    jouerSon('page-tourne', 0.4);
    setDirection(sens);
    setIndexActuel(suivant);
    setSommaireOuvert(false);
  };

  const allerAu = (i: number) => {
    if (i === indexActuel) { setSommaireOuvert(false); return; }
    jouerSon('page-tourne', 0.4);
    setDirection(i > indexActuel ? 1 : -1);
    setIndexActuel(i);
    setSommaireOuvert(false);
  };

  return (
    <div className="lecteur-recit">
      <div className="lecteur-recit__barre">
        <button
          className="lecteur-recit__sommaire-bouton"
          onClick={() => setSommaireOuvert((v) => !v)}
          aria-expanded={sommaireOuvert}
        >
          <FontAwesomeIcon icon={faListUl} /> Table des chapitres
        </button>
        <div className="lecteur-recit__progression" aria-label={`Chapitre ${indexActuel + 1} sur ${chapitres.length}`}>
          <div className="lecteur-recit__progression-barre" style={{ width: `${progression}%` }} />
        </div>
        <span className="lecteur-recit__compteur">{indexActuel + 1} / {chapitres.length}</span>
      </div>

      <AnimatePresence>
        {sommaireOuvert && (
          <motion.nav
            className="sommaire"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            aria-label="Sommaire du récit"
          >
            {chapitres.map((c, i) => (
              <button
                key={c.id}
                className={`sommaire__item ${i === indexActuel ? 'est-actif' : ''}`}
                onClick={() => allerAu(i)}
              >
                <span className="sommaire__numero">{c.sousTitre ? '✦' : c.numero}</span>
                <span>
                  <strong>{c.titre}</strong>
                  <small>{c.lieuDate}</small>
                </span>
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="lecteur-recit__scene">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.article
            key={chapitre.id}
            className="page-recit"
            custom={direction}
            initial={{ opacity: 0, rotateY: direction === 1 ? 70 : -70, x: direction === 1 ? 60 : -60 }}
            animate={{ opacity: 1, rotateY: 0, x: 0 }}
            exit={{ opacity: 0, rotateY: direction === 1 ? -70 : 70, x: direction === 1 ? -60 : 60 }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
            style={{ transformPerspective: 1600, transformOrigin: direction === 1 ? 'right center' : 'left center' }}
          >
            <header className="page-recit__entete">
              <span className="eyebrow">{chapitre.sousTitre ?? `Chapitre ${chapitre.numero}`}</span>
              <h1>{chapitre.titre}</h1>
              <p className="page-recit__lieu">{chapitre.lieuDate}</p>
            </header>

            <div className="page-recit__corps">
              {chapitre.blocs.map((bloc, i) => {
                if (bloc.type === 'dialogue') {
                  return (
                    <p className="bloc-dialogue" key={i}>
                      <span className="bloc-dialogue__auteur">
                        {bloc.auteur}{bloc.note ? <em> ({bloc.note})</em> : null} :
                      </span>
                      « {bloc.texte} »
                    </p>
                  );
                }
                if (bloc.type === 'citation') {
                  return <blockquote className="bloc-citation" key={i}>{bloc.texte}</blockquote>;
                }
                if (bloc.type === 'fin') {
                  return <p className="bloc-fin" key={i}>{bloc.texte}</p>;
                }
                return <p className="bloc-narration" key={i}>{bloc.texte}</p>;
              })}
            </div>

            {(chapitre.creatureLiee || chapitre.casLie) && (
              <footer className="page-recit__annexes">
                <span>Pour aller plus loin :</span>
                {chapitre.creatureLiee && (
                  <Link to={`/creatures/${chapitre.creatureLiee}`}>
                    <FontAwesomeIcon icon={faLink} /> Consulter la fiche créature
                  </Link>
                )}
                {chapitre.casLie && (
                  <Link to={`/cas/${chapitre.casLie}`}>
                    <FontAwesomeIcon icon={faLink} /> Ouvrir le dossier d’enquête
                  </Link>
                )}
                {chapitre.estRupture && (
                  <Link to="/journal">
                    <FontAwesomeIcon icon={faFeatherPointed} /> Lire les pages du journal de Nina
                  </Link>
                )}
              </footer>
            )}
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="lecteur-recit__navigation">
        <button className="bouton-sceau secondaire" onClick={() => tourner(-1)} disabled={estPremier}>
          <FontAwesomeIcon icon={faChevronLeft} /> Page précédente
        </button>
        {estDernier ? (
          <Link to="/creatures" className="bouton-sceau">
            Explorer les archives <FontAwesomeIcon icon={faScroll} />
          </Link>
        ) : (
          <button className="bouton-sceau" onClick={() => tourner(1)}>
            Page suivante <FontAwesomeIcon icon={faChevronRight} />
          </button>
        )}
      </div>
    </div>
  );
}
