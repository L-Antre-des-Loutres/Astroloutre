---
title: "Otterbots"
description: "Un framework de bot Discord adapté à la stack Antre des Loutres, conçu pour simplifier le développement en intégrant nativement la gestion des événements, commandes, réactions et création de salons."
pubDate: 2025-11-21
tags: [ "Back-end", "Framework", "Discord", "Bot" ]
author: "RereBleue"
image: "https://github.com/L-Antre-des-Loutres/Otterbots/blob/develop/src/app/assets/images/Otterbots.png?raw=true"
---

## 📖 À propos

Otterbots est un framework complet développé par **L'Antre des Loutres** pour simplifier la création de bots Discord
professionnels. Il intègre des fonctionnalités avancées comme la gestion automatique des salons, un système de logging
sophistiqué, une API centralisée, et des modules de sécurité.

### ✨ Points forts

- 🚀 **Prêt à l'emploi** : Configuration rapide avec `.env`
- 🛡️ **Sécurité intégrée** : Module Otterguard (anti-spam, anti-scam, filtrage de liens)
- 📊 **Logging avancé** : Otterlogs avec webhooks Discord
- 🔄 **Cache persistant** : Ottercache pour stocker vos données
- 🌐 **API centralisée** : OtterlyAPI pour gérer vos routes dynamiquement
- ⏰ **Tâches planifiées** : Système de cron jobs intégré
- 📝 **TypeScript** : Code typé et maintenable

---

## 🚀 Installation

### Prérequis

- **Node.js** 18 ou supérieur
- **npm** ou **yarn**
- Un **bot Discord** créé sur le [Discord Developer Portal](https://discord.com/developers/applications)

### Étapes

1. **Cloner le projet**
   ```bash
   git clone https://github.com/L-Antre-des-Loutres/Otterbots.git
   cd Otterbots
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**

   Copiez le fichier d'exemple et remplissez vos informations :
   ```bash
   cp .env.example .env
   ```

   Éditez `.env` avec vos valeurs :
   ```env
   # Environnement
   NODE_ENV=dev
   BOT_LANGUAGE=FR

   # Discord
   BOT_TOKEN=votre_token_discord
   DISCORD_GUILD_ID=id_de_votre_serveur
   DISCORD_CLIENT_ID=id_de_votre_application
   BOT_NAME=MonBot

   # Webhooks (optionnel)
   ENABLE_DISCORD_LOGS=true
   GLOBAL_WEBHOOK_URL=https://discord.com/api/webhooks/...
   ERROR_WEBHOOK_URL=https://discord.com/api/webhooks/...
   ```

4. **Compiler le projet**
   ```bash
   npm run build
   ```

5. **Lancer le bot**

   En développement :
   ```bash
   npm run dev
   ```

   En production :
   ```bash
   npm start
   ```

---

## 🎯 Utilisation

### Structure du projet

```
Otterbots/
├── src/
│   ├── app/                    # Configuration de votre bot
│   │   ├── config/             # Fichiers de configuration
│   │   │   ├── salon.ts        # Configuration des salons Discord
│   │   │   ├── task.ts         # Tâches planifiées (cron)
│   │   │   └── otterguardConfig.ts  # Configuration sécurité
│   │   ├── commands/           # Vos commandes Discord
│   │   ├── events/             # Vos gestionnaires d'événements
│   │   └── index.ts            # Point d'entrée
│   └── otterbots/              # Framework (ne pas modifier)
│       ├── utils/              # Utilitaires du framework
│       └── docs/               # Documentation détaillée
├── .env                        # Variables d'environnement
└── package.json
```

### Créer une commande

Créez un fichier dans `src/app/commands/` :

```typescript
import {CommandInteraction, SlashCommandBuilder} from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Dire bonjour');

export async function execute(interaction: CommandInteraction) {
    await interaction.reply('Bonjour ! 🦦');
}
```

### Configurer des salons automatiques

Éditez `src/app/config/salon.ts` :

```typescript
export const salonCategory = [
    {id: 1, name: "Logs", role_id: "ROLE_ID"}
];

export const botSalon = [
    {
        alias: "logs-bot",
        name: "🤖-logs",
        category: 1,
        webhook: true
    }
];
```

### Ajouter une tâche planifiée

Éditez `src/app/config/task.ts` :

```typescript
export const tasks = [
    {
        name: "Sauvegarde quotidienne",
        time: "0 0 * * *",  // Tous les jours à minuit
        task: async () => {
            console.log("Sauvegarde en cours...");
        }
    }
];
```

### Utiliser le système de logs

```typescript
import {otterlogs} from './otterbots/utils/otterlogs';

otterlogs.success("Bot démarré avec succès !");
otterlogs.log("Chargement de 10 commandes...");
otterlogs.warn("Cache expiré");
otterlogs.error("Erreur de connexion à la DB");
```

---

## 🔧 Fonctionnalités

### 🦦 Otterlogs

Système de logging avancé avec :

- 7 niveaux de logs (success, log, warn, error, important, debug, silentlog)
- Intégration webhooks Discord
- Formatage coloré avec Pino
- Configuration granulaire par type

### 🛡️ Otterguard

Module de sécurité pour protéger votre serveur :

- Protection anti-liens malveillants
- Détection de scam
- Anti-spam / anti-flood
- Liste blanche de domaines

### 🌐 OtterlyAPI

Gestionnaire d'API centralisé :

- Routes dynamiques via alias
- Cache local des configurations
- Méthodes GET/POST simplifiées
- Authentification automatique

### 💾 Ottercache

Système de cache persistant :

- Stockage clé-valeur typé
- Sauvegarde automatique en JSON
- API simple type Map
- Zero-config

### 🏢 Gestion des Salons

- Création automatique de catégories et salons
- Gestion des permissions par rôle
- Webhooks automatiques
- Récupération par alias

### ⏰ Tâches Planifiées

- Cron jobs avec `node-cron`
- Validation des expressions
- Gestion des erreurs
- Logs détaillés

---

## 📚 Documentation

Toute la documentation détaillée se trouve sur
le [wiki de l'Antre des Loutres](https://wiki.antredesloutres.fr/fr/doc-technique/bots-discord/framework-otterbots/implementation)

---

## 🛠️ Scripts disponibles

| Commande        | Description                                 |
|-----------------|---------------------------------------------|
| `npm run dev`   | Lint + Build + Lancer en mode développement |
| `npm run build` | Compiler TypeScript vers JavaScript         |
| `npm run lint`  | Vérifier le code avec ESLint                |
| `npm start`     | Lancer le bot compilé (production)          |

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 🦦 Auteurs

Développé avec ❤️ par **[L'Antre des Loutres](https://github.com/L-Antre-des-Loutres)**

## 🔗 Liens utiles

- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Node-cron Documentation](https://github.com/node-cron/node-cron)
- [Pino Logger](https://getpino.io/)

---

<div align="center">

**Fait avec 🦦 par L'Antre des Loutres**

[⬆ Retour en haut](#-otterbots)

</div>
