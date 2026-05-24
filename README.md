# Astroloutre 🦦

Bienvenue sur le dépôt du site web de [L'Antre des Loutres](https://antredesloutres.fr).
Ce projet est une application web statique moderne construite avec **Astro** et **React**, conçue pour la performance,
la flexibilité et une expérience utilisateur fluide.

[![License: MIT](https://cdn.prod.website-files.com/5e0f1144930a8bc8aace526c/65dd9eb5aaca434fac4f1c34_License-MIT-blue.svg)](/LICENSE)
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](http://shields.io/)

## 🚀 Technologies

Ce projet utilise une stack moderne :

- **Framework** : [Astro](https://astro.build/) (v5) - Pour la génération statique et la performance.
- **UI Library** : [React](https://react.dev/) (v19) - Pour les composants interactifs complexes (tableaux de
  classements, etc.).
- **Styling** : [Tailwind CSS](https://tailwindcss.com/) (v4) & Variables CSS natives pour la gestion des thèmes.
- **Langage** : TypeScript - Pour un code robuste et typé.

## 🛠️ Installation et Démarrage

### Prérequis

- Node.js (version LTS recommandée)
- npm (inclus avec Node.js)

### Étapes

1. **Cloner le projet**
   ```bash
   git clone https://github.com/L-Antre-des-Loutres/Reactisoutre.git
   cd Reactisoutre
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   Le site sera accessible sur `http://localhost:4321`.

### Autres commandes utiles

| Commande              | Action                                                       |
|:----------------------|:-------------------------------------------------------------|
| `npm run build`       | Compile le site pour la production dans le dossier `./dist/` |
| `npm run preview`     | Prévisualise le build de production localement               |
| `npm run astro check` | Lance une vérification des types et du code                  |

## 📂 Structure du Projet

L'architecture du code source dans `src/` est organisée comme suit :

- **`pages/`** : Contient les routes du site. Astro utilise un routage basé sur les fichiers (ex:
  `pages/classements/minecraft.astro` devient `/classements/minecraft`).
- **`components/`** :
    - `classements/` : Composants React gérant l'affichage et le tri des tableaux de scores.
    - `sections/` : Blocs de mise en page réutilisables (Bannières, Présentations...).
    - `ui/` : Composants d'interface atomiques (Boutons, Inputs...).
- **`layouts/`** : Gabarits principaux (ex: `Layout.astro`) qui définissent la structure commune (Header, Footer, Meta
  tags).
- **`styles/`** :
    - `themes/` : Définit les palettes de couleurs pour les modes Clair et Sombre via des variables CSS.
    - `global/` : Styles CSS globaux spécifiques (ex: `rankings.css`).
- **`utils/`** : Fonctions utilitaires, helpers de formatage et logique métier partagée.

## 🎨 Fonctionnement des Thèmes (Dark Mode)

Le site intègre un système de thème **Clair / Sombre** natif.
Ceci est géré via des variables CSS définies dans `src/styles/themes/`.
Les composants utilisent ces variables (ex: `var(--background-color)`, `var(--ranking-text-color)`) pour s'adapter
automatiquement à la préférence de l'utilisateur ou au switch manuel.

## 📊 Données et API

L'application est "Frontend-only" pour l'affichage, mais elle consomme des données dynamiques.
Toutes les statistiques (Minecraft, Discord) sont récupérées depuis notre API publique :

👉 **[Otterly API](https://otterlyapi.antredesloutres.fr/)**

### Sources de données

- **Minecraft** : Données collectées par [Otternel](https://github.com/Corentin-cott/Otternel) (Rust).
- **Discord** : Bot Discord interne pour les statistiques d'activité.

*Pour toute demande de suppression de données, veuillez consulter
notre [page de gestion des données](https://antredesloutres.fr/donnees/).*

## 👥 Contributeurs

- **Mathéo** ([matheo-1712](https://github.com/matheo-1712)) : Développement Frontend (Astro/React) & API Otterly.
- **Corentin** ([corentin-cott](https://github.com/corentin-cott)) : Développement Backend, Outils de monitoring (
  Rust/Go) & DevOps.
