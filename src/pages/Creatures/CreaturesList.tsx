import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import creaturesData from '../../data/creatures.json';
import type { Creature } from '../../types';
import { useContenuGerable } from '../../hooks/useContenuGerable';
import CreatureCard from '../../components/CreatureCard/CreatureCard';
import './Creatures.scss';

export default function CreaturesList() {
  const { liste: creatures } = useContenuGerable<Creature>('creatures', creaturesData as Creature[]);
  const [categorie, setCategorie] = useState('Toutes');

  const categories = useMemo(() => ['Toutes', ...Array.from(new Set(creatures.map((c) => c.categorie)))], [creatures]);

  const filtrees = useMemo(
    () => (categorie === 'Toutes' ? creatures : creatures.filter((c) => c.categorie === categorie)),
    [categorie, creatures]
  );

  return (
    <div className="page-archives conteneur">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="eyebrow">Registre bestiaire</span>
        <h1>Archives des Créatures</h1>
        <p className="page-archives__intro">
          Chaque entrée provient des carnets accumulés par le réseau des chasseurs depuis des décennies —
          descriptions, signes reconnaissables et faiblesses confirmées sur le terrain.
        </p>
      </motion.header>

      <div className="page-archives__filtres" role="tablist" aria-label="Filtrer par catégorie">
        {categories.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={categorie === cat}
            className={`filtre-chip ${categorie === cat ? 'est-actif' : ''}`}
            onClick={() => setCategorie(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="page-archives__grille">
        {filtrees.map((c, i) => (
          <CreatureCard key={c.id} creature={c} index={i} />
        ))}
      </div>
    </div>
  );
}
