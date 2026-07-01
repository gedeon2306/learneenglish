# learnEnglish

<div align="center">
  <img src="public/icon.png" alt="learnEnglish Logo" width="120" />
  <h3>Une application web pour apprendre l'anglais de manière ludique et efficace</h3>
</div>

---

Une application web progressive (PWA) conçue pour aider les apprenants à maîtriser l'anglais à travers une approche interactive et progressive.

## ✨ Fonctionnalités

### 📚 Contenu pédagogique complet
- **30 niveaux de vocabulaire** : Plus de 1000 mots essentiels organisés par thèmes et difficulté croissante.
- **110 verbes irréguliers** : Formes conjuguées complètes avec traductions.
- **56 phrasal verbs** : Verbes phrashés classés par catégories avec exemples concrets.
- **100+ expressions idiomatiques** : Des expressions naturelles pour parler comme un natif.
- **10 niveaux de shadowing** : De débutant à quasi-natif pour améliorer l'écoute et la prononciation.

### 🎯 Apprentissage interactif
- **Mode Liste** : Consultation simple et rapide de tout le contenu.
- **Mode Cartes** : Fiches mémoire interactives pour une mémorisation optimale.
- **Recherche rapide** : Trouvez instantanément un mot, une expression ou un exemple.
- **Progression sauvegardée** : Vos progrès sont stockés localement dans votre navigateur.

### 🔊 Outils d'apprentissage audio
- **Synthèse vocale intégrée** : Écoutez la prononciation précise en anglais et français via l'API Web Speech.
- **Shadowing progressif** : Pratiquez l'écoute active et l'imitation de phrases réelles.
- **Contrôles audio** : Lecture, pause et arrêt pour une pratique à votre rythme.

### 🎨 Interface moderne
- **Thème sombre par défaut** : Confort visuel pour de longues sessions d'apprentissage.
- **Navigation intuitive** : Onglets défilants pour accéder aux différentes sections.
- **Barre de progression** : Visualisation claire de votre avancement.
- **Responsive design** : S'adapte parfaitement aux mobiles, tablettes et ordinateurs.

## 🚀 Installation

### Prérequis
- Node.js 18+ et npm

### Démarrage rapide

```bash
# 1. Clonez le dépôt
git clone https://github.com/gedeon2306/learnenglish.git

# 2. Accédez au répertoire du projet
cd learnenglish

# 3. Installez les dépendances
npm install

# 4. Lancez le serveur de développement
npm run dev
```

### Scripts disponibles

- `npm run dev` : Démarre le serveur de développement (Vite).
- `npm run build` : Construit l'application pour la production.
- `npm run lint` : Exécute `oxlint` pour la qualité du code.
- `npm run preview` : Affiche une prévisualisation de la version de production.

## 🛠 Technologies utilisées

- **React 19** : Interface utilisateur réactive.
- **TypeScript** : Typage statique robuste.
- **Vite** : Bundle de développement rapide.
- **React Icons** : Bibliothèque d'icônes.
- **oxlint** : Outil de linting haute performance.

## 📂 Structure du projet

```text
learnenglish/
├── public/               # Fichiers statiques (manifest, sw.js, icônes)
├── src/
│   ├── components/      # Composants React (WordsTab, PhrasalVerbsTab, etc.)
│   ├── utils/           # Utilitaires (speech.ts, storage.ts)
│   ├── App.tsx          # Composant racine et navigation
│   └── main.tsx         # Point d'entrée de l'application
├── package.json         # Dépendances et scripts
└── vite.config.ts       # Configuration Vite
```

## 💾 Persistance et PWA
- **Stockage local** : Utilise `localStorage` pour sauvegarder vos progrès (mots appris, niveaux, etc.).
- **Mode Hors-ligne** : Grâce au Service Worker (`public/sw.js`), l'application reste accessible sans connexion internet.

## 🤝 Contribution
Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou proposer une Pull Request pour toute amélioration.

## 📝 Licence
Ce projet est sous licence MIT.