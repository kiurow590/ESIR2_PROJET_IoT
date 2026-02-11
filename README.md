# Project Team Zigbee — Plateforme IoT

> Plateforme de gestion de périphériques IoT Zigbee avec dashboard web, serveur REST/MQTT et nœuds Node-Red personnalisés.

---

## Table des matières

- [Présentation](#présentation)
- [Étudiants](#étudiants)
- [Architecture globale](#architecture-globale)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancement](#lancement)
- [Structure du projet](#structure-du-projet)
- [IHM (Frontend)](#ihm-frontend)
- [Serveur (Backend)](#serveur-backend)
- [Node-Red](#node-red)
- [Base de données](#base-de-données)
- [API REST](#api-rest)
- [MQTT & Zigbee](#mqtt--zigbee)
- [Configuration](#configuration)
- [Tests](#tests)
- [Commandes utiles](#commandes-utiles)

---

## Présentation

Ce projet est réalisé dans le cadre de l'**UE FabLab** à l'**ESIR** (École Supérieure d'Ingénieurs de Rennes). Il s'agit d'une solution complète de gestion de périphériques IoT communicant via le protocole **Zigbee**. La plateforme permet de :

- Visualiser en temps réel les données de capteurs (température, humidité, présence, etc.)
- Contrôler des actionneurs (lampes, prises connectées) à distance
- Consulter l'historique des données sous forme de graphiques
- Gérer les périphériques (ajout, suppression, renommage, appairage)
- Créer des automatisations via Node-Red
- Consulter la météo locale (Rennes) via l'API Open-Meteo

La solution est déployée sur un **Raspberry Pi** accessible à l'adresse `rpi-esir2iot.esir.univ-rennes1.fr`.

---

## Étudiants

| Nom | Prénom |
|---|---|
| CASTANG | Elie |
| GUÉRINEL | Thibault |
| MÉTAYER | Elise |
| SYLLA | Ismaël |
| TONNERRE | Aubry |

---

## Architecture globale

```
┌──────────────────┐     HTTP/REST      ┌──────────────────┐       MQTT        ┌──────────────────┐
│                  │  (port 8090)       │                  │   (port 1883)     │                  │
│   IHM (Vue.js)   │ ◄───────────────►  │  Serveur Express │ ◄──────────────►  │  Zigbee2MQTT     │
│   port 5173      │                    │  (Node.js)       │                   │                  │
│                  │                    │                  │                   │                  │
└──────────────────┘                    └──────────────────┘                   └────────┬─────────┘
                                               │                                        │
                                               │                                        │ Zigbee
                                        ┌──────┴──────┐                          ┌──────┴──────────┐
                                        │  BDD (JSON) │                          │  Périphériques  │
                                        │  Modules    │                          │  - Capteurs     │
                                        │  Users      │                          │  - Lampes       │
                                        │  Scénarios  │                          │  - Prises       │
                                        └─────────────┘                          │  - Boutons      │
                                                                                 └─────────────────┘
         ┌──────────────────┐
         │   Node-Red       │
         │   (iframe)       │
         │   port 1880      │
         └──────────────────┘
```

---

## Stack technique

| Couche | Technologies |
|---|---|
| **Frontend** | Vue.js 3.4, Vite 4.4, Vuex 4 + Pinia, Vue Router 4, SCSS/Sass |
| **Backend** | Node.js, Express 4.18 |
| **Protocoles** | MQTT (broker Mosquitto, port 1883), Zigbee (via Zigbee2MQTT) |
| **Automatisation** | Node-Red (nœuds personnalisés) |
| **Base de données** | Fichiers JSON (pas de SGBD) |
| **API externe** | Open-Meteo (prévisions météo Rennes) |
| **UI** | CanvasJS (graphiques), vue-final-modal, vue3-toastify, Material Icons |
| **Tests** | Vitest + jsdom |
| **Linting/Formatting** | ESLint, Prettier |

---

## Prérequis

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Zigbee2MQTT** installé et configuré (sur le Raspberry Pi, dans `/opt/zigbee2mqtt`)
- **Broker MQTT Mosquitto** (port 1883)
- **Node-Red** (pour les automatisations, port 1880)
- Un **adaptateur Zigbee** USB connecté au Raspberry Pi

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/kiurow590/ESIR2_PROJET_IoT.git
cd ESIR2_PROJET_IoT
```

### 2. Installer les dépendances du Frontend (IHM)

```bash
cd IHM
npm install
```

### 3. Installer les dépendances du Backend (Server)

```bash
cd ../Server
npm install
```

### 4. Installer les nœuds Node-Red (optionnel)

```bash
cd ../Node-Red
npm install
```

Puis, dans le répertoire `~/.node-red` du Raspberry Pi :

```bash
npm install <chemin_vers_le_dossier_Node-Red>
```

### 5. Lancer Zigbee2MQTT (sur le Raspberry Pi)

```bash
cd /opt/zigbee2mqtt
npm start
```

---

## Lancement

### Frontend (IHM)

```bash
cd IHM
npm run dev
```

Le site est accessible sur : **http://localhost:5173/**

### Backend (Serveur API REST)

```bash
cd Server
node serverExpress.js
```

Le serveur écoute sur le port **8090**.

### Simulateur d'API (développement sans Raspberry Pi)

```bash
cd Node-Red/Simulateur\ API
npx json-server db.json
```

---

## Structure du projet

```
ESIR2_PROJET_IoT/
├── IHM/                          # Frontend Vue.js
│   ├── config.json               # Configuration URL/port du serveur
│   ├── index.html                # Point d'entrée HTML
│   ├── package.json              # Dépendances frontend
│   ├── vite.config.js            # Configuration Vite
│   ├── vitest.config.js          # Configuration tests
│   ├── public/                   # Ressources statiques
│   └── src/
│       ├── App.vue               # Composant racine
│       ├── main.js               # Point d'entrée JS
│       ├── app.scss              # Styles globaux
│       ├── assets/               # Images, icônes, SCSS de base
│       ├── components/           # Composants Vue réutilisables
│       │   ├── ModuleTemperature.vue    # Widget température/humidité
│       │   ├── ModuleSwitch.vue         # Widget contrôle lumière
│       │   ├── ModulePresence.vue       # Widget détection présence
│       │   ├── ModuleMeteo.vue          # Widget météo (Open-Meteo)
│       │   ├── ModuleRoom.vue           # Widget pièce
│       │   ├── GridComponent.vue        # Grille de widgets du dashboard
│       │   ├── ListModules.vue          # Liste des modules
│       │   ├── LineChartComponent.vue   # Graphique historique (CanvasJS)
│       │   ├── TableComponent.vue       # Tableau paginé/triable
│       │   ├── Sidebar.vue              # Barre de navigation latérale
│       │   ├── Authentification.vue     # Composant d'authentification
│       │   ├── SignInComponent.vue      # Formulaire de connexion
│       │   ├── FormComponent.vue        # Formulaire générique
│       │   ├── AddTableComponent.vue    # Ajout d'entrée au tableau
│       │   ├── TitlePage.vue            # Titre de page
│       │   ├── modals/                  # Fenêtres modales
│       │   │   ├── ModalChart.vue       # Modal graphique historique
│       │   │   ├── ModalYesNo.vue       # Modal confirmation Oui/Non
│       │   │   ├── ModalConfirmPlainCss.vue
│       │   │   └── ModalsAuthentification.vue
│       │   └── toast/
│       │       └── toastComponent.js    # Notifications toast
│       ├── models/               # Modèles de données
│       │   ├── iotComponent.js          # Classe IoT component
│       │   ├── moduleMetier.mjs         # Logique métier modules
│       │   ├── AuthModel.js             # Modèle authentification
│       │   ├── componentValueTest.js    # Valeurs de test
│       │   └── loaderComponent.vue      # Composant loader
│       ├── router/
│       │   └── index.js          # Définition des routes
│       ├── stores/
│       │   ├── store.js          # Store Vuex (widgets persistés)
│       │   └── counter.js        # Store Pinia
│       ├── scss/                 # Feuilles de style SCSS
│       └── views/                # Pages de l'application
│           ├── HomeView.vue             # Dashboard principal
│           ├── LoginView.vue            # Page de connexion
│           ├── ListComponentsView.vue   # Liste des périphériques
│           ├── AutomationView.vue       # Automatisations (Node-Red)
│           ├── SettingsView.vue         # Paramètres
│           └── AboutView.vue            # À propos
├── Server/                       # Backend Node.js/Express
│   ├── serverExpress.js          # Serveur API REST principal (port 8090)
│   ├── sendExpress.js            # Fonctions requêtes HTTP
│   ├── POST_serverExpress.js     # Serveur secondaire (port 3005)
│   ├── constantUnit.mjs          # Unités des mesures (°C, %, lux…)
│   ├── package.json              # Dépendances backend
│   ├── BDD/                      # Base de données JSON
│   │   ├── table_Module.json     # Données des périphériques
│   │   ├── table_User.json       # Utilisateurs & mots de passe
│   │   └── table_Scenario.json   # Scénarios d'automatisation
│   ├── MQTT/                     # Gestion du protocole MQTT
│   │   ├── fonction_MQTT.mjs     # Fonctions MQTT (publish, subscribe)
│   │   ├── analyseLog.js         # Analyse logs Zigbee2MQTT
│   │   ├── serveur_POST.js       # Serveur HTTP brut pour commandes
│   │   └── activePairing.js      # Activation mode appairage
│   └── gestion et script BDD/   # Scripts utilitaires et archives
├── Node-Red/                     # Nœuds Node-Red personnalisés
│   ├── configuration-zigbee.js/.html   # Nœud de configuration
│   ├── control-light.js/.html          # Nœud contrôle lumière
│   ├── control-plug.js/.html           # Nœud contrôle prise
│   ├── zigbee-switch.js/.html          # Nœud surveillance bouton
│   ├── package.json                    # Manifest des nœuds
│   └── Simulateur API/                 # Simulateur JSON Server
│       ├── db.json                     # Données simulées
│       └── readme.md
└── package.json                  # Dépendances racine
```

---

## IHM (Frontend)

### Pages de l'application

| Route | Vue | Description |
|---|---|---|
| `/` | `HomeView` | Dashboard principal avec grille de widgets |
| `/login` | `LoginView` | Page de connexion |
| `/listComponents` | `ListComponentsView` | Liste et gestion des périphériques |
| `/automation` | `AutomationView` | Automatisations Node-Red (iframe) |
| `/settings` | `SettingsView` | Paramètres de l'application |
| `/about` | `AboutView` | Page à propos |

### Widgets du Dashboard

Le dashboard est composé d'une grille de widgets configurables. L'utilisateur peut ajouter et supprimer des widgets. L'état des widgets est persisté dans le `localStorage` via Vuex.

| Widget | Description |
|---|---|
| **Température** | Affiche la température, l'humidité et le niveau de batterie en temps réel depuis un capteur Zigbee |
| **Switch / Lumière** | Permet de contrôler l'état ON/OFF/TOGGLE d'une lampe connectée |
| **Présence** | Affiche l'état de détection de présence d'un capteur de mouvement |
| **Météo** | Affiche les prévisions météo de Rennes sur 3 jours via l'API Open-Meteo |

### Fonctionnalités clés

- **Grille dynamique** : Ajout/suppression de widgets par l'utilisateur
- **Graphiques historiques** : Visualisation de l'historique des données des capteurs via CanvasJS (courbes) dans des fenêtres modales
- **Tableau de composants** : Liste paginée et triable de tous les périphériques avec recherche par nom
- **Authentification admin** : Mot de passe requis pour les opérations sensibles (suppression, modification)
- **Sidebar responsive** : Navigation collapsible avec icônes Material Design
- **Notifications toast** : Messages de succès, erreur, info et avertissement
- **Recherche intelligente** : Recherche de modules par nom avec distance de Hamming

### Scripts NPM

```bash
npm run dev        # Lancer le serveur de développement Vite
npm run build      # Build de production
npm run preview    # Prévisualisation du build
npm run test:unit  # Lancer les tests unitaires (Vitest)
npm run lint       # Linter le code (ESLint)
npm run format     # Formater le code (Prettier)
```

---

## Serveur (Backend)

Le serveur backend est construit avec **Express.js** et communique avec les périphériques Zigbee via **MQTT**. Il expose une API REST consommée par le frontend.

### Fonctionnement

1. Le serveur Express écoute sur le port **8090**
2. Il se connecte au broker MQTT (Mosquitto) sur le port **1883**
3. Il reçoit les données des capteurs Zigbee via les topics MQTT
4. Il stocke les données dans des fichiers JSON (BDD)
5. Il expose des endpoints REST pour le frontend

### Dépendances

| Package | Version | Description |
|---|---|---|
| `express` | ^4.18.2 | Framework HTTP |
| `cors` | ^2.8.5 | Gestion des requêtes cross-origin |
| `mqtt` | ^5.5.0 | Client MQTT pour Node.js |
| `nodemon` | ^3.1.0 | Rechargement automatique en développement |

---

## Node-Red

Quatre nœuds personnalisés sont fournis pour interagir avec l'infrastructure Zigbee depuis Node-Red :

| Nœud | Catégorie | Description |
|---|---|---|
| `configuration-zigbee` | Config | Nœud de configuration partagé (host + port du serveur API). Utilisé par les autres nœuds. |
| `control-light` | Zigbee project | Contrôle une lampe Zigbee via `POST /action/light/:id`. Accepte `ON`, `OFF`, `TOGGLE` en payload. |
| `control-plug` | Zigbee project | Contrôle une prise connectée via `POST /action/plug/:id`. Accepte `ON`, `OFF`, `TOGGLE` en payload. |
| `zigbee-switch` | Zigbee project | Surveille un bouton Zigbee par polling `GET /getDetails/:id` (toutes les 500ms). Émet l'action détectée en sortie. |

### Installation dans Node-Red

```bash
cd ~/.node-red
npm install <chemin_vers_le_dossier_Node-Red>
# Redémarrer Node-Red
```

---

## Base de données

La base de données est composée de fichiers JSON stockés dans `Server/BDD/`.

### `table_Module.json` — Périphériques

Contient tous les périphériques Zigbee enregistrés avec leur historique de données :

```json
{
  "Module": {
    "0x00124b00226717d1": {
      "init": true,
      "nom": "Capteur Salon",
      "time": ["2024-05-14 14:53:44", "2024-05-14 14:55:12"],
      "temperature": [24.62, 24.58],
      "humidity": [74.79, 74.85],
      "battery": [100, 100],
      "voltage": [3200, 3200],
      "linkquality": [162, 160]
    }
  }
}
```

### `table_User.json` — Utilisateurs

```json
{
  "admin": {
    "mdp": "admin"
  }
}
```

### `table_Scenario.json` — Scénarios d'automatisation

```json
{
  "Scenario": {
    "Scenar1": {
      "Nom": "",
      "ID": "",
      "module": "",
      "condDep": "",
      "ModuleActionneur": "",
      "CondArrive": ""
    }
  }
}
```

---

## API REST

Le serveur Express expose les endpoints suivants sur le port **8090** :

### Périphériques

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/listDevice` | Liste tous les périphériques (id, nom, dernier état) |
| `GET` | `/listDevice/details` | Liste détaillée avec historique des données |
| `GET` | `/listDeviceType` | Liste groupée par type (temperature, brightness, occupancy…) |
| `GET` | `/getState/:id` | Dernier état d'un périphérique |
| `GET` | `/getDetails/:id` | Détails complets d'un périphérique |
| `GET` | `/device/:id/data` | Données historiques pour graphiques (avec unités) |
| `GET` | `/search/:id` | Recherche par nom (distance de Hamming) |
| `GET` | `/searchList/:id` | Recherche par préfixe de nom |
| `DELETE` | `/delete/:id` | Supprime un périphérique (BDD + MQTT) |

### Contrôle des actionneurs

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/action/plug/:id` | Contrôle une prise connectée (`ON` / `OFF` / `TOGGLE`) |
| `POST` | `/action/light/:id` | Contrôle une lampe (`ON` / `OFF` / `TOGGLE`) |

### Gestion

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/writeName/:name/:id` | Renommer un périphérique |
| `POST` | `/allowAddDevice` | Active le mode appairage Zigbee (240 secondes) |
| `GET` | `/askPermission/:password` | Vérification du mot de passe admin |
| `GET` | `/changePassword/:password` | Changement du mot de passe admin |

---

## MQTT & Zigbee

### Broker MQTT

- **Hôte** : `localhost`
- **Port** : `1883`
- **Protocole** : Mosquitto

### Topics MQTT utilisés

| Topic | Direction | Description |
|---|---|---|
| `zigbee2mqtt/<deviceId>` | Réception | Données temps réel des capteurs |
| `zigbee2mqtt/<deviceId>/set` | Émission | Commande un actionneur (state: ON/OFF/TOGGLE) |
| `zigbee2mqtt/bridge/request/permit_join` | Émission | Active le mode appairage |
| `zigbee2mqtt/bridge/request/device/remove` | Émission | Supprime un périphérique du réseau |
| `zigbee2mqtt/bridge/event` | Réception | Événements (ajout de device, etc.) |

### Périphériques Zigbee supportés

| Type | Exemple | Données |
|---|---|---|
| **Capteur Température/Humidité** | SONOFF SNZB-02 | `temperature`, `humidity`, `battery`, `voltage` |
| **Capteur de mouvement** | SONOFF SNZB-03 | `occupancy` |
| **Lampe connectée** | IKEA TRÅDFRI | `brightness`, `state` (ON/OFF) |
| **Prise connectée** | — | `state` (ON/OFF) |
| **Bouton/Télécommande** | IKEA TRÅDFRI | `action` (toggle, brightness_down_click…) |

---

## Configuration

### Frontend (`IHM/config.json`)

```json
{
  "URL": "rpi-esir2iot.esir.univ-rennes1.fr",
  "PORT": "8090"
}
```

Modifier ce fichier pour pointer vers l'adresse de votre serveur backend.

### CORS

Le serveur autorise les requêtes cross-origin depuis `http://rpi-esir2iot.esir.univ-rennes1.fr:5173` (port Vite en développement).

### Zigbee2MQTT

- Chemin d'installation : `/opt/zigbee2mqtt`
- Logs : `/var/log/zigbee2mqtt/log.txt`
- Interface web : `http://localhost:8080`

### Persistance des widgets

L'état des widgets du dashboard est sauvegardé dans le `localStorage` du navigateur (clé `widgets`) via le plugin `vuex-persistedstate`.

---

## Tests

Le projet est configuré pour les tests unitaires avec **Vitest** et **jsdom** :

```bash
cd IHM
npm run test:unit
```

Dépendances de test installées :
- `vitest` ^0.34.6
- `@vue/test-utils` ^2.4.1
- `jsdom` ^22.1.0

---

## Commandes utiles

### Démarrage complet (sur le Raspberry Pi)

```bash
# 1. Lancer Zigbee2MQTT
cd /opt/zigbee2mqtt
npm start

# 2. Lancer le serveur backend
cd <chemin_du_projet>/Server
npm install
node serverExpress.js

# 3. Lancer le frontend
cd <chemin_du_projet>/IHM
npm install
npm run dev
```
---

## Licence

Projet universitaire — ESIR, Université de Rennes
