# Skin 3D sur la page joueur Minecraft — conception

## Intention

La page d'un joueur Minecraft affiche aujourd'hui une image plate du corps.
On veut à la place son skin en vraie 3D, qu'on peut faire tourner et qui
s'anime, pour que la page ait de l'allure. Les listes, classements et profils
gardent les têtes en image.

Pour ça, le champ PocketBase `players.skin` change de rôle : au lieu d'un corps
rendu de face par OAPI, il contient désormais la **texture brute** du skin
(PNG 64×64, ou 64×32 pour les anciens skins), que le site affiche avec
skinview3d.

## Objectifs

- **OAPI** (dépôt `RustroverProjects/OAPI`, branche `feat/minecraft-skins`) :
  la tâche quotidienne `skins` envoie la texture dans `skin` au lieu du corps
  rendu ; `head` ne change pas.
- Tous les joueurs déjà traités en production sont régénérés au prochain
  passage (le contenu actuel de `skin` est un corps rendu, plus valable).
- **Site** : la page `joueurs/minecraft/[playername]` affiche le skin en 3D avec
  skinview3d, à partir de la texture **embarquée dans la page au build**.
- Comportement de la vue 3D :
  - à l'arrivée, rotation lente automatique et animation de repos légère ;
  - on la fait pivoter en glissant (souris ou doigt) ; la rotation automatique
    s'arrête dès la première interaction ;
  - pas de zoom (pour ne pas bloquer le défilement sur mobile) ;
  - modèle bras fins ou classiques détecté automatiquement depuis la texture ;
  - même encombrement et même cadre que l'image actuelle du corps.

## Hors périmètre

- 3D ailleurs que sur la page joueur Minecraft.
- Skin personnalisé qui surchargerait celui de Mojang (abandonné).
- Choix d'animation (marche, etc.) ou boutons de contrôle.
- Rendu de la vue 3D au build (navigateur sans interface) : la 3D se calcule
  dans le navigateur.
- Image d'aperçu des liens (`ogImage`) : reste la tête.

## Anti-objectifs

- Charger skinview3d (~600 Ko avec three.js) ailleurs que sur les pages joueur,
  ou avant l'affichage de la page.
- Une requête du navigateur vers PocketBase pour la texture : elle est dans la
  page, ce qui évite le lien cassé après un changement de skin et le besoin de
  CORS pour WebGL.
- Une page joueur cassée ou vide si la texture manque, si son téléchargement
  échoue au build, ou si WebGL n'est pas disponible.
- Un build qui échoue parce qu'une texture est illisible.

## Contraintes

- Le site est statique (Astro, `getStaticPaths`) : les données sont figées au
  build.
- `PB_URL` et la forme des URL de fichiers : `${PB_URL}/api/files/<collectionId>/<id>/<fichier>`
  (`src/formater/JoueurFormater.ts`).
- PocketBase remplace un fichier sous un nouveau nom et supprime l'ancien.
- skinview3d 3.4.2 (dépend de three 0.156) ; il accepte une URL `data:` comme
  source de skin et sait lire les textures 64×32.
- OAPI : `skin_service.rs` décide qu'un record est à jour si `skin_hash` est
  identique et que `head` et `skin` sont remplis ; `skin_render.rs` contient
  `render_head`, `render_body`, `encode_png`.

## Approches envisagées

Chargement de skinview3d :

- **A. Paquet npm + `<script>` Astro avec `import()` dynamique (choisie).**
  Version fixée dans `package.json`, intégrée au build par Vite, chargée
  uniquement sur la page joueur et après l'affichage.
- **B. Script depuis un CDN.** Rien à installer, mais dépendance à un service
  externe à l'affichage, alors qu'on cherche à s'en défaire. Écartée.
- **C. Composant React (`client:visible`).** Hydratation inutile pour un simple
  `<canvas>`. Écartée.

Source de la texture :

- **Embarquée au build en `data:` base64 (choisie).** Pas de lien cassé, pas de
  CORS, pas de requête. Coût : quelques Ko par page et un téléchargement par
  joueur au build.
- **Chargée par le navigateur depuis PocketBase.** Lien cassé après un
  changement de skin jusqu'au build suivant, CORS à vérifier. Écartée.

## Conception

### OAPI

- Dans `skin_service.rs`, le fichier `skin` envoyé est la texture Mojang,
  ré-encodée en PNG avec `encode_png` après décodage (ce qui garde la
  vérification de format), nom de fichier `skin.png`. La texture doit faire
  64×64 ou 64×32, sinon échec pour ce joueur (même règle qu'aujourd'hui).
- `render_body` et ses tests sont supprimés de `skin_render.rs` ; `render_head`
  et `SkinModel` restent.
- `skin_hash` passe au format `v2:<hash>:<modèle>`. Aucun record existant n'a
  ce format, donc tous sont régénérés au prochain passage. La règle « à jour »
  ne change pas.
- Docs : `docs/pocketbase.md`, `docs/en/pocketbase.md` (`skin` = texture
  64×64 ou 64×32 ; format de `skin_hash`), `docs/daily_tasks.md`.

### Site

**Au build** (frontmatter de `joueurs/minecraft/[playername].astro`) :

- Si `joueur.skin` est rempli, télécharger
  `${PB_URL}/api/files/<collectionId>/<id>/<skin>` et le convertir en
  `data:image/png;base64,...`.
- En cas d'échec (statut HTTP, réseau, type autre que PNG, taille > 64 Ko) :
  pas de texture, avertissement dans la sortie du build, la page est générée
  quand même.
- Fonction utilitaire dédiée (par exemple `fetchSkinDataUrl(joueur)` dans
  `src/utils/`), testable seule.

**Dans la page** :

- Avec texture : un `<canvas>` dans `.avatar`, aux dimensions de l'image
  actuelle, avec la texture en attribut `data-skin`. Un `<script>` importe
  `skinview3d` à la demande, crée le `SkinViewer` (modèle `auto-detect`),
  active la rotation automatique lente, l'animation de repos et la rotation
  au glissé, désactive le zoom, et coupe la rotation automatique au premier
  glissé.
- Si la création du `SkinViewer` échoue (pas de WebGL, texture illisible) :
  le canvas est remplacé par l'image `mcHeadsBodyUrl(playername, 128)`.
- Sans texture : l'image `mcHeadsBodyUrl(playername, 128)` directement, comme
  avant le remplissage par OAPI.
- `playerSkinUrl` n'a plus d'utilisateur et est supprimé de
  `JoueurFormater.ts`.

## Choix faits par Claude (à vérifier)

- Si l'utilisateur a demandé à réduire les animations
  (`prefers-reduced-motion`), pas de rotation automatique ni d'animation ; le
  glissé reste possible.
- Limite de 64 Ko pour la texture embarquée (une vraie texture en fait
  quelques-uns).
- Format de version `v2:` pour `skin_hash`.

## Laissé au choix de l'implémentation

- Vitesse de rotation et amplitude de l'animation de repos, tant que c'est
  « lent » et « léger ».
- Taille exacte du canvas, tant qu'elle reprend l'encombrement de l'image
  actuelle.
- Nom et emplacement exact de la fonction de téléchargement au build.
