# Libris Occultus 🕸️📖

Grimoire numérique / journal intime pour chasseurs de surnaturel.
React 18 + Vite + TypeScript + Sass + Framer Motion + React Router v6.

Aucun backend : toutes les données proviennent de fichiers JSON statiques
(`src/data/`), et le Journal Intime persiste ses modifications dans le
`localStorage` du navigateur.

## Arborescence

```
libris-occultus/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.node.json
├── public/
│   └── sounds/              # fichiers audio optionnels (voir LISEZ-MOI.txt)
└── src/
    ├── main.tsx
    ├── App.tsx               # routes React Router
    ├── vite-env.d.ts
    ├── types/
    │   └── index.ts          # interfaces Creature, Case, JournalEntry
    ├── data/
    │   ├── creatures.json    # Djinn, Wendigo, Métamorphe, Fantôme, Vampire
    │   ├── cases.json        # dont "nina-singer-emily-carter"
    │   └── journalEntries.json
    ├── hooks/
    │   └── useLocalStorage.ts
    ├── utils/
    │   └── sound.ts          # gestion des sons d'ambiance (dégradation silencieuse)
    ├── styles/
    │   ├── _variables.scss   # palette, typographies, échelle
    │   ├── _mixins.scss      # textures cuir/parchemin, coins cornés, focus...
    │   └── global.scss
    ├── components/
    │   ├── Layout/           # header + navigation + transitions de page
    │   ├── BookCover/        # animation d'ouverture du grimoire (accueil)
    │   ├── ParchmentTexture/ # wrapper de texture réutilisable
    │   └── CreatureCard/
    └── pages/
        ├── Home/
        ├── Creatures/        # CreaturesList.tsx + CreatureDetail.tsx
        ├── Journal/          # Journal.tsx (CRUD) + JournalEntryForm.tsx
        ├── Cases/            # Cases.tsx + CaseDetail.tsx
        └── Search/           # recherche croisée créatures + cas
```

## Installation et lancement

```bash
cd libris-occultus
npm install
npm run dev
```

Le site est servi sur **http://localhost:5173**.

Build de production :

```bash
npm run build
npm run preview
```

## Pages disponibles

| Route              | Contenu                                                        |
|---------------------|-----------------------------------------------------------------|
| `/`                 | Accueil — animation d'ouverture du grimoire (cliquer sur le livre) |
| `/creatures`        | Archives des créatures, filtrables par catégorie                |
| `/creatures/:id`    | Fiche détaillée (signes, faiblesses, histoire, cas liés)         |
| `/journal`          | Journal Intime — créer / modifier / supprimer des entrées        |
| `/cas`              | Liste des dossiers d'enquête                                     |
| `/cas/:id`          | Détail d'un dossier (dont le **Dossier Singer**), chronologie complète |
| `/recherche`        | Recherche croisée créatures + cas                                |

## Notes d'implémentation

- **CRUD Journal** : les 5 entrées d'exemple (dont celles de Nina Singer)
  sont chargées depuis `journalEntries.json` puis fusionnées dans le
  `localStorage` via `useLocalStorage`. Créer, modifier ou supprimer une
  entrée modifie uniquement le `localStorage` — les fichiers JSON restent
  intacts. Pour repartir de zéro, vide la clé `libris-occultus:journal`
  du localStorage de ton navigateur.
- **Sons d'ambiance** : entièrement optionnels. Le site fonctionne
  parfaitement sans aucun fichier audio ; voir `public/sounds/LISEZ-MOI.txt`.
- **Accessibilité** : focus visible au clavier, `prefers-reduced-motion`
  respecté sur les animations d'ambiance, libellés ARIA sur les contrôles
  interactifs (bouton son, suppression, filtres).
- **Cohérence narrative** : les données reprennent fidèlement les 6
  chapitres fournis (l'appel de Bobby, l'enquête, la possession de Nina,
  la traque du Djinn, l'affrontement final, et sa découverte du site
  "Libris Occultus" lui-même dans le chapitre 6).
