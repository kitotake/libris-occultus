import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faRightToBracket,
  faRightFromBracket,
  faScroll,
  faPersonBooth,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import { connecter, deconnecter, sessionActive } from '../../utils/adminAuth';
import AdminCreatures from './AdminCreatures';
import AdminCases from './AdminCases';
import './Admin.scss';

type Onglet = 'creatures' | 'cas';

export default function Admin() {
  const [session, setSession] = useState(() => sessionActive());
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [onglet, setOnglet] = useState<Onglet>('creatures');

  useEffect(() => {
    const id = setInterval(() => {
      if (session && !sessionActive()) setSession(null); // expiration silencieuse
    }, 30_000);
    return () => clearInterval(id);
  }, [session]);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');
    setEnCours(true);
    const resultat = await connecter(email, motDePasse);
    setEnCours(false);
    if (!resultat.ok) {
      setErreur(resultat.erreur ?? 'Connexion refusée.');
      return;
    }
    setSession(sessionActive());
  };

  if (!session) {
    return (
      <div className="conteneur page-admin-connexion">
        <motion.form
          className="formulaire-connexion"
          onSubmit={soumettre}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <FontAwesomeIcon icon={faLock} className="formulaire-connexion__icone" />
          <h1>Antichambre du Gardien</h1>
          <p>Cette section réserve l’ajout, la modification et la suppression de contenu du grimoire aux gardiens habilités.</p>

          {erreur && <p className="formulaire-connexion__erreur" role="alert">{erreur}</p>}

          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required />
          </label>
          <label>
            Mot de passe
            <input type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required />
          </label>

          <button type="submit" className="bouton-sceau" disabled={enCours}>
            <FontAwesomeIcon icon={faRightToBracket} /> {enCours ? 'Vérification…' : 'Entrer'}
          </button>

          
        </motion.form>
      </div>
    );
  }

  return (
    <div className="conteneur page-admin">
      <header className="page-admin__entete">
        <div>
          <span className="eyebrow">Connecté en tant que {session.nom}</span>
          <h1>Administration du Grimoire</h1>
        </div>
        <button className="bouton-sceau secondaire" onClick={() => { deconnecter(); setSession(null); }}>
          <FontAwesomeIcon icon={faRightFromBracket} /> Se déconnecter
        </button>
      </header>

      <div className="page-admin__onglets">
        <button className={onglet === 'creatures' ? 'est-actif' : ''} onClick={() => setOnglet('creatures')}>
          <FontAwesomeIcon icon={faScroll} /> Créatures
        </button>
        <button className={onglet === 'cas' ? 'est-actif' : ''} onClick={() => setOnglet('cas')}>
          <FontAwesomeIcon icon={faPersonBooth} /> Cas
        </button>
      </div>

      {onglet === 'creatures' ? <AdminCreatures /> : <AdminCases />}
    </div>
  );
}
