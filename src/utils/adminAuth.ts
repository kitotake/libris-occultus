import bcrypt from 'bcryptjs';
import adminsData from '../data/admins.json';
import type { Admin } from '../types';
import { ecrireCookieJSON, lireCookieJSON, supprimerCookieJSON } from './cookieStorage';

// ⚠️ Important : ce site n'a pas de backend. Cette "authentification" tourne
// entièrement dans le navigateur (le hash bcrypt est comparé côté client).
// C'est suffisant pour empêcher un clic accidentel sur la page d'administration,
// mais ce n'est PAS une sécurité serveur : n'importe qui inspectant le code
// source verra la logique de comparaison. Pour un vrai contrôle d'accès,
// il faudrait un backend qui vérifie le mot de passe et ne renvoie qu'un
// jeton de session au client.

const admins = adminsData as Admin[];
const CLE_SESSION = 'libris-admin:session';
const DUREE_SESSION_HEURES = 12;

interface Session {
  email: string;
  nom: string;
  expire: number; // timestamp
}

export async function connecter(email: string, motDePasse: string): Promise<{ ok: boolean; erreur?: string }> {
  const admin = admins.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  if (!admin) return { ok: false, erreur: 'Aucun gardien ne porte cet email.' };

  const valide = await bcrypt.compare(motDePasse, admin.passwordHash);
  if (!valide) return { ok: false, erreur: 'Mot de passe incorrect.' };

  const session: Session = {
    email: admin.email,
    nom: admin.name,
    expire: Date.now() + DUREE_SESSION_HEURES * 60 * 60 * 1000,
  };
  ecrireCookieJSON(CLE_SESSION, session, 1);
  return { ok: true };
}

export function deconnecter() {
  supprimerCookieJSON(CLE_SESSION);
}

export function sessionActive(): Session | null {
  const session = lireCookieJSON<Session>(CLE_SESSION);
  if (!session) return null;
  if (session.expire < Date.now()) {
    supprimerCookieJSON(CLE_SESSION);
    return null;
  }
  return session;
}
