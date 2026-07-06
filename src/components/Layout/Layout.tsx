import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookSkull,
  faFeather,
  faPersonBooth,
  faMagnifyingGlass,
  faScroll,
  faBookOpen,
  faVolumeHigh,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { definirSonsActives, sonsSontActives, jouerSon } from '../../utils/sound';
import './Layout.scss';

const liensNav = [
  { to: '/', label: 'Frontispice', icon: faBookSkull, fin: true },
  { to: '/recit', label: 'Le Récit', icon: faBookOpen },
  { to: '/creatures', label: 'Archives', icon: faScroll },
  { to: '/journal', label: 'Journal Intime', icon: faFeather },
  { to: '/cas', label: 'Cas Similaires', icon: faPersonBooth },
  { to: '/recherche', label: 'Recherche', icon: faMagnifyingGlass },
];

export default function Layout() {
  const location = useLocation();
  const [sonsOn, setSonsOn] = useState(sonsSontActives());

  const basculerSons = () => {
    const suivant = !sonsOn;
    setSonsOn(suivant);
    definirSonsActives(suivant);
    if (suivant) jouerSon('page-tourne', 0.3);
  };

  return (
    <div className="mise-en-page">
      <header className="entete">
        <div className="conteneur entete__interieur">
          <NavLink to="/" className="entete__logo" onClick={() => jouerSon('page-tourne', 0.25)}>
            <FontAwesomeIcon icon={faBookSkull} />
            <span>Libris&nbsp;Occultus</span>
          </NavLink>

          <nav className="entete__nav" aria-label="Navigation principale">
            {liensNav.map((lien) => (
              <NavLink
                key={lien.to}
                to={lien.to}
                end={lien.fin}
                className={({ isActive }) => `entete__lien ${isActive ? 'est-actif' : ''}`}
                onClick={() => jouerSon('page-tourne', 0.25)}
              >
                <FontAwesomeIcon icon={lien.icon} />
                <span>{lien.label}</span>
              </NavLink>
            ))}
          </nav>

          <button
            className="entete__son"
            onClick={basculerSons}
            aria-pressed={sonsOn}
            aria-label={sonsOn ? 'Couper les sons d’ambiance' : 'Activer les sons d’ambiance'}
            title={sonsOn ? 'Couper les sons d’ambiance' : 'Activer les sons d’ambiance'}
          >
            <FontAwesomeIcon icon={sonsOn ? faVolumeHigh : faVolumeXmark} />
          </button>
        </div>
      </header>

      <main className="contenu-principal">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, rotateY: -8, x: 40 }}
            animate={{ opacity: 1, rotateY: 0, x: 0 }}
            exit={{ opacity: 0, rotateY: 8, x: -40 }}
            transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
            style={{ transformOrigin: 'left center', perspective: 1200 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="pied-de-page">
        <div className="conteneur">
          <p>
            <FontAwesomeIcon icon={faBookSkull} /> Libris Occultus — grimoire tenu par le réseau des
            chasseurs. Consulté à ses risques et périls.
          </p>
        </div>
      </footer>
    </div>
  );
}
