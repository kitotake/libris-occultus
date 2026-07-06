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

- **Persistance : cookies, pas seulement localStorage.** Le Journal Intime
  et le contenu ajouté/modifié via l'administration (créatures, cas) sont
  stockés dans des **cookies** (`src/utils/cookieStorage.ts`), avec un
  découpage automatique en plusieurs cookies pour les données un peu
  volumineuses (limite ~4 Ko par cookie). Le JSON d'origine n'est jamais
  modifié : les ajouts/éditions/suppressions vivent dans une "surcouche"
  fusionnée à l'affichage (`src/hooks/useContenuGerable.ts`).
- **Administration (`/admin`).** Formulaire de connexion avec le même
  schéma que fourni (`id`, `email`, `name`, `passwordHash`, `createdAt`),
  hash **bcrypt** vérifié via `bcryptjs` (`src/utils/adminAuth.ts`).
  Compte de démo : `dev@libris-occultus.fr` / `grimoire2026` — à changer
  en régénérant un hash avec `bcryptjs` pour un usage réel. ⚠️ Le site
  étant 100% statique (pas de backend), cette authentification tourne
  entièrement côté navigateur : elle évite les clics accidentels sur la
  page d'admin, mais n'est pas une sécurité de production.
- **Menu burger mobile.** Sous 960px, la navigation du header bascule
  automatiquement dans un menu déroulant (`Layout.tsx` / `Layout.scss`),
  animé avec Framer Motion, qui se referme seul à chaque changement de page.
- **Sons d'ambiance.** 3 fichiers audio synthétiques sont fournis par
  défaut dans `public/sounds/` (page qui tourne, plume qui gratte, boucle
  d'ambiance grave) — le site fonctionne aussi sans eux si tu les remplaces
  ou les supprimes.
- **CRUD Journal** : les 5 entrées d'exemple (dont celles de Nina Singer)
  sont chargées depuis `journalEntries.json` puis fusionnées avec les
  cookies via `useCookieStorage`. Pour repartir de zéro, supprime les
  cookies `libris-journal__*` de ton navigateur.
- **Accessibilité** : focus visible au clavier, `prefers-reduced-motion`
  respecté sur les animations d'ambiance, libellés ARIA sur les contrôles
  interactifs (bouton son, burger, suppression, filtres).
- **Cohérence narrative** : les données reprennent fidèlement les 6
  chapitres fournis (l'appel de Bobby, l'enquête, la possession de Nina,
  la traque du Djinn, l'affrontement final, et sa découverte du site
  "Libris Occultus" lui-même dans le chapitre 6), lisibles page par page
  via `/recit`.
- **Créatures conformes à la mythologie Supernatural** : Djinn (contact
  empoisonné, lame au sang d'agneau), Wendigo (vitesse, hibernation, feu),
  Métamorphe (yeux réfléchissants, balle en argent), Vampire (**pas**
  vulnérable au soleil, décapitation, sang de mort-vivant), Rugaru
  (origine purement humaine).

