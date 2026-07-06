export interface Creature {
  id: string;
  nom: string;
  sousTitre: string;
  categorie: string;
  dangerosite: number;
  anneePremiereApparition: number | null;
  image: string;
  description: string;
  signes: string[];
  faiblesses: string[];
  histoire: string;
  casLies: string[];
}

export interface ChronologieItem {
  heure: string;
  evenement: string;
}

export interface Case {
  id: string;
  titre: string;
  lieu: string;
  date: string;
  statut: string;
  creatureLiee: string;
  victime: string;
  suspectInitial: string;
  resume: string;
  chronologie: ChronologieItem[];
  notesEnquete: string;
  temoignage: string;
  tags: string[];
}

export interface JournalEntry {
  id: string;
  auteur: string;
  date: string;
  titre: string;
  contenu: string;
  epingle: boolean;
  tagCreature: string;
}

export interface BlocRecit {
  type: 'narration' | 'dialogue' | 'citation' | 'fin';
  auteur?: string;
  note?: string;
  texte: string;
}

export interface Chapitre {
  id: string;
  numero: number;
  titre: string;
  sousTitre?: string;
  lieuDate: string;
  blocs: BlocRecit[];
  creatureLiee?: string;
  casLie?: string;
  estRupture?: boolean;
}
