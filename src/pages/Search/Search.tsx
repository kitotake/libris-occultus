import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faScroll, faPersonBooth } from '@fortawesome/free-solid-svg-icons';
import creaturesData from '../../data/creatures.json';
import casesData from '../../data/cases.json';
import type { Case, Creature } from '../../types';
import './Search.scss';

const creatures = creaturesData as Creature[];
const cases = casesData as Case[];

type Filtre = 'tout' | 'creatures' | 'cas';

export default function Search() {
  const [terme, setTerme] = useState('');
  const [filtre, setFiltre] = useState<Filtre>('tout');

  const termeNormalise = terme.trim().toLowerCase();

  const creaturesFiltrees = useMemo(() => {
    if (!termeNormalise || filtre === 'cas') return [];
    return creatures.filter((c) =>
      [c.nom, c.sousTitre, c.description, c.categorie, ...c.signes, ...c.faiblesses]
        .join(' ')
        .toLowerCase()
        .includes(termeNormalise)
    );
  }, [termeNormalise, filtre]);

  const casFiltres = useMemo(() => {
    if (!termeNormalise || filtre === 'creatures') return [];
    return cases.filter((c) =>
      [c.titre, c.lieu, c.resume, c.notesEnquete, c.victime, c.suspectInitial, ...c.tags]
        .join(' ')
        .toLowerCase()
        .includes(termeNormalise)
    );
  }, [termeNormalise, filtre]);

  const aucunResultat = termeNormalise.length > 0 && creaturesFiltrees.length === 0 && casFiltres.length === 0;

  return (
    <div className="conteneur page-recherche">
      <header>
        <span className="eyebrow">Index du grimoire</span>
        <h1>Recherche avancée</h1>
        <p>Croisez les archives des créatures et les dossiers d’enquête en une seule requête.</p>
      </header>

      <div className="page-recherche__barre">
        <div className="champ-recherche">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            value={terme}
            onChange={(e) => setTerme(e.target.value)}
            placeholder="Djinn, Sioux Falls, marque à l'avant-bras, Nina Singer…"
            aria-label="Rechercher dans le grimoire"
            autoFocus
          />
        </div>
        <div className="page-recherche__filtres">
          {(['tout', 'creatures', 'cas'] as Filtre[]).map((f) => (
            <button key={f} className={filtre === f ? 'est-actif' : ''} onClick={() => setFiltre(f)}>
              {f === 'tout' ? 'Tout' : f === 'creatures' ? 'Créatures' : 'Cas'}
            </button>
          ))}
        </div>
      </div>

      {termeNormalise.length === 0 && (
        <p className="page-recherche__invite">Commencez à écrire pour feuilleter le grimoire…</p>
      )}

      {aucunResultat && (
        <p className="page-recherche__invite">Aucune trace de « {terme} » dans les archives connues.</p>
      )}

      {creaturesFiltrees.length > 0 && (
        <section className="page-recherche__section">
          <h2><FontAwesomeIcon icon={faScroll} /> Créatures ({creaturesFiltrees.length})</h2>
          <div className="page-recherche__resultats">
            {creaturesFiltrees.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={`/creatures/${c.id}`} className="resultat-recherche">
                  <strong>{c.nom}</strong>
                  <span>{c.sousTitre}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {casFiltres.length > 0 && (
        <section className="page-recherche__section">
          <h2><FontAwesomeIcon icon={faPersonBooth} /> Dossiers ({casFiltres.length})</h2>
          <div className="page-recherche__resultats">
            {casFiltres.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={`/cas/${c.id}`} className="resultat-recherche">
                  <strong>{c.titre}</strong>
                  <span>{c.lieu} — {c.date}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
