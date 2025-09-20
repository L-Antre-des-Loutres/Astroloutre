# Astroloutre

[![License: MIT](https://cdn.prod.website-files.com/5e0f1144930a8bc8aace526c/65dd9eb5aaca434fac4f1c34_License-MIT-blue.svg)](/LICENSE)
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](http://shields.io/)

Astroloutre est un projet d'application Web statique, il est accessible sur
l'adresse [antredesloutres.fr](antredesloutres.fr)

## Technologies utilisées :

- Astro
- TypeScript

## Comment tester ce projet :

Cloner le projet :

``` bash
[git clone https://github.com/L-Antre-des-Loutres/Astroloutre](https://github.com/L-Antre-des-Loutres/Reactisoutre)
```

### Commandes disponibles sur ce projet :

| Command             | Action                                                            |
|:--------------------|:------------------------------------------------------------------|
| `npm install`       | Installation des dépendances                                      |
| `npm run dev`       | Lancement du serveur en mode dev sur l'adresse : `localhost:4321` |
| `npm run build`     | Compile le site dans `./dist/`                                    |
| `npm run preview`   | Prévisualisez votre build en local avant de le déployer.          |
| `npm run astro ...` | Exécutez des commandes CLI comme astro add, astro check.          |

## Nos données sur le site :

L'ensemble des données que nous utilisons sont disponibles sur notre [API](https://otterlyapi.antredesloutres.fr/)

Pour toute demande de suppression de données, veuillez consulter
notre [page de gestion des données](https://antredesloutres.fr/donnees/).

### Récupération des données :

#### Discord :

- [Arisoutre](https://github.com/L-Antre-des-Loutres/Arisoutre) gère tout ce qui est nombre de messages,
  temps en vocal, date de la première et dernière activité ainsi que la date où l'utilisateur a rejoint notre discord.

#### Minecraft :

- [ServerSentinel](https://github.com/Corentin-cott/ServerSentinel) (version en Go)
- Bientôt : [Otternel](https://github.com/Corentin-cott/Otternel) (nouvelle version en Rust)

Ces projets permettent de récupérer l'ensemble des statistiques de nos joueurs Minecraft : temps de jeu, nombre de blocs
cassés, etc.
Ils permettent également de consulter des données comme la date de dernière connexion.

## Contributeurs :

- Mathéo ([matheo-1712](https://github.com/matheo-1712)) Développement du site et de
  l'API [Otterly](https://github.com/L-Antre-des-Loutres/ApiServeur) permettant l'affichage des données
- Corentin ([corentin-cott](https://github.com/corentin-cott)) Développement du site et de la récupération des
  statistiques des joueurs via [ServeurSentinel](https://github.com/Corentin-cott/ServerSentinel) et bientôt la nouvelle
  version [Otternel](https://github.com/Corentin-cott/Otternel)
