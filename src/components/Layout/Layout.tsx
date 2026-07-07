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
  faBars,
  faXmark,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { definirSonsActives, sonsSontActives, jouerSon } from '../../utils/sound';
import './Layout.scss';

const liensNav = [
  { to: '/', label: 'Frontispice', icon: faBookSkull, fin: true },
  { to: '/recit', label: 'Le Récit', icon: faBookOpen },
  { to: '/creatures', label: 'Archives', icon: faScroll },
  { to: '/journal', label: 'Journal Intime', icon: faFeather },
  { to: '/cas', label: 'Cas Similaires', icon: faPersonBooth },
  { to: '/recherche', label: 'Recherche', icon: faMagnifyingGlass },
  { to: '/admin', label: 'Administration', icon: faLock },
];

export default function Layout() {
  const location = useLocation();
  const [sonsOn, setSonsOn] = useState(sonsSontActives());
  const [menuOuvert, setMenuOuvert] = useState(false);

  // Ferme le menu burger automatiquement à chaque changement de page
  useEffect(() => { setMenuOuvert(false); }, [location.pathname]);

  // Empêche le scroll du corps de page quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOuvert ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOuvert]);

  const basculerSons = () => {
    const suivant = !sonsOn;
    setSonsOn(suivant);
    definirSonsActives(suivant);
    if (suivant) jouerSon('page-tourne', 0.3);
  };

  const clicLien = () => jouerSon('page-tourne', 0.25);

  return (
    <div className="mise-en-page">
      <header className="entete">
        <div className="conteneur entete__interieur">
          <NavLink to="/" className="entete__logo" onClick={clicLien}>
            <FontAwesomeIcon icon={faBookSkull} />
            <span>Libris&nbsp;Occultus</span>
          </NavLink>

          <nav className="entete__nav entete__nav--bureau" aria-label="Navigation principale">
            {liensNav.map((lien) => (
              <NavLink
                key={lien.to}
                to={lien.to}
                end={lien.fin}
                className={({ isActive }) => `entete__lien ${isActive ? 'est-actif' : ''}`}
                onClick={clicLien}
              >
                <FontAwesomeIcon icon={lien.icon} />
                <span>{lien.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="entete__droite">
            <button
              className="entete__son"
              onClick={basculerSons}
              aria-pressed={sonsOn}
              aria-label={sonsOn ? 'Couper les sons d’ambiance' : 'Activer les sons d’ambiance'}
              title={sonsOn ? 'Couper les sons d’ambiance' : 'Activer les sons d’ambiance'}
            >
              <FontAwesomeIcon icon={sonsOn ? faVolumeHigh : faVolumeXmark} />
            </button>

            <button
              className="entete__burger"
              onClick={() => setMenuOuvert((v) => !v)}
              aria-expanded={menuOuvert}
              aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              <FontAwesomeIcon icon={menuOuvert ? faXmark : faBars} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOuvert && (
            <motion.nav
              className="menu-mobile"
              aria-label="Navigation mobile"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {liensNav.map((lien) => (
                <NavLink
                  key={lien.to}
                  to={lien.to}
                  end={lien.fin}
                  className={({ isActive }) => `menu-mobile__lien ${isActive ? 'est-actif' : ''}`}
                  onClick={clicLien}
                >
                  <FontAwesomeIcon icon={lien.icon} />
                  <span>{lien.label}</span>
                </NavLink>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
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
          <p className="pied-de-page__credit">
            Créé par{' '}
            <a href="https://github.com/kitotake" target="_blank" rel="noopener noreferrer">
              kitotake
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
