import { useEffect, useState } from "react";
import { FaSearch, FaListUl, FaThLarge, FaCheck, FaRegCircle, FaTimes, FaArrowLeft, FaArrowRight, FaVolumeUp } from "react-icons/fa";
import { CiBoxList } from "react-icons/ci";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/storage";
import { speakSequence, stopSpeech } from "../utils/speech";

const WORDS_PER_LOT = 40;
const TOTAL_LOTS = 30;

const lotTitles = [
  "Pronoms et Famille", "Verbes essentiels I", "Verbes essentiels II", "Nombres et Temps",
  "Questions et Liaisons", "Adjectifs I", "Adjectifs II", "Lieu et Espace", "Corps humain",
  "Maison et Objets", "Nourriture et Boissons", "Vêtements et Couleurs", "Nature et Environnement",
  "Transport et Voyage", "Travail et Éducation", "Technologie et Internet", "Santé et Médecine",
  "Émotions et Personnalité", "Shopping et Argent", "Loisirs et Divertissement", "Ville et Services",
  "Communication", "Science et Méthode", "Modaux et Expressions", "Relations sociales",
  "Concepts abstraits", "Descriptions physiques", "Verbes d'action", "Vocabulaire académique",
  "Derniers essentiels"
];

const allWords = [
  // LOT 1 : Pronoms et Famille
  { en: "I", fr: "je", cat: "Pronom" }, { en: "you", fr: "tu / vous", cat: "Pronom" },
  { en: "he", fr: "il", cat: "Pronom" }, { en: "she", fr: "elle", cat: "Pronom" },
  { en: "it", fr: "il / elle (neutre)", cat: "Pronom" }, { en: "we", fr: "nous", cat: "Pronom" },
  { en: "they", fr: "ils / elles", cat: "Pronom" }, { en: "my", fr: "mon / ma", cat: "Possessif" },
  { en: "your", fr: "ton / votre", cat: "Possessif" }, { en: "his", fr: "son (masc.)", cat: "Possessif" },
  { en: "her", fr: "son (fém.)", cat: "Possessif" }, { en: "our", fr: "notre", cat: "Possessif" },
  { en: "their", fr: "leur", cat: "Possessif" }, { en: "man", fr: "homme", cat: "Nom" },
  { en: "woman", fr: "femme", cat: "Nom" }, { en: "boy", fr: "garçon", cat: "Nom" },
  { en: "girl", fr: "fille", cat: "Nom" }, { en: "child", fr: "enfant", cat: "Nom" },
  { en: "baby", fr: "bébé", cat: "Nom" }, { en: "person", fr: "personne", cat: "Nom" },
  { en: "people", fr: "gens / personnes", cat: "Nom" }, { en: "family", fr: "famille", cat: "Nom" },
  { en: "mother", fr: "mère", cat: "Nom" }, { en: "father", fr: "père", cat: "Nom" },
  { en: "parent", fr: "parent", cat: "Nom" }, { en: "sister", fr: "soeur", cat: "Nom" },
  { en: "brother", fr: "frère", cat: "Nom" }, { en: "son", fr: "fils", cat: "Nom" },
  { en: "daughter", fr: "fille (descendante)", cat: "Nom" }, { en: "husband", fr: "mari", cat: "Nom" },
  { en: "wife", fr: "épouse", cat: "Nom" }, { en: "couple", fr: "couple", cat: "Nom" },
  { en: "partner", fr: "partenaire", cat: "Nom" }, { en: "friend", fr: "ami(e)", cat: "Nom" },
  { en: "neighbor", fr: "voisin", cat: "Nom" }, { en: "stranger", fr: "inconnu", cat: "Nom" },
  { en: "enemy", fr: "ennemi", cat: "Nom" }, { en: "something", fr: "quelque chose", cat: "Pronom" },
  { en: "everyone", fr: "tout le monde", cat: "Pronom" }, { en: "anybody", fr: "n'importe qui", cat: "Pronom" },

  // LOT 2 : Verbes essentiels I
  { en: "to be", fr: "être", cat: "Verbe" }, { en: "to have", fr: "avoir", cat: "Verbe" },
  { en: "to do", fr: "faire (action)", cat: "Verbe" }, { en: "to make", fr: "faire / fabriquer", cat: "Verbe" },
  { en: "to go", fr: "aller", cat: "Verbe" }, { en: "to come", fr: "venir", cat: "Verbe" },
  { en: "to see", fr: "voir", cat: "Verbe" }, { en: "to look", fr: "regarder", cat: "Verbe" },
  { en: "to say", fr: "dire", cat: "Verbe" }, { en: "to tell", fr: "raconter / dire à", cat: "Verbe" },
  { en: "to speak", fr: "parler (langue/voix)", cat: "Verbe" }, { en: "to talk", fr: "discuter", cat: "Verbe" },
  { en: "to know", fr: "savoir / connaître", cat: "Verbe" }, { en: "to think", fr: "penser", cat: "Verbe" },
  { en: "to want", fr: "vouloir", cat: "Verbe" }, { en: "to need", fr: "avoir besoin", cat: "Verbe" },
  { en: "to give", fr: "donner", cat: "Verbe" }, { en: "to take", fr: "prendre", cat: "Verbe" },
  { en: "to get", fr: "obtenir / devenir", cat: "Verbe" }, { en: "to put", fr: "mettre / poser", cat: "Verbe" },
  { en: "to eat", fr: "manger", cat: "Verbe" }, { en: "to drink", fr: "boire", cat: "Verbe" },
  { en: "to sleep", fr: "dormir", cat: "Verbe" }, { en: "to live", fr: "vivre / habiter", cat: "Verbe" },
  { en: "to work", fr: "travailler", cat: "Verbe" }, { en: "to play", fr: "jouer", cat: "Verbe" },
  { en: "to help", fr: "aider", cat: "Verbe" }, { en: "to use", fr: "utiliser", cat: "Verbe" },
  { en: "to find", fr: "trouver", cat: "Verbe" }, { en: "to call", fr: "appeler", cat: "Verbe" },
  { en: "to try", fr: "essayer", cat: "Verbe" }, { en: "to ask", fr: "demander", cat: "Verbe" },
  { en: "to feel", fr: "ressentir", cat: "Verbe" }, { en: "to leave", fr: "partir / quitter", cat: "Verbe" },
  { en: "to show", fr: "montrer", cat: "Verbe" }, { en: "to hear", fr: "entendre", cat: "Verbe" },
  { en: "to listen", fr: "écouter", cat: "Verbe" }, { en: "to guess", fr: "deviner", cat: "Verbe" },
  { en: "to seem", fr: "sembler", cat: "Verbe" }, { en: "to notice", fr: "remarquer", cat: "Verbe" },

  // LOT 3 : Verbes essentiels II
  { en: "to run", fr: "courir", cat: "Verbe" }, { en: "to walk", fr: "marcher", cat: "Verbe" },
  { en: "to sit", fr: "s'asseoir", cat: "Verbe" }, { en: "to stand", fr: "se tenir debout", cat: "Verbe" },
  { en: "to open", fr: "ouvrir", cat: "Verbe" }, { en: "to close", fr: "fermer", cat: "Verbe" },
  { en: "to stop", fr: "s'arrêter", cat: "Verbe" }, { en: "to start", fr: "commencer", cat: "Verbe" },
  { en: "to continue", fr: "continuer", cat: "Verbe" }, { en: "to finish", fr: "finir", cat: "Verbe" },
  { en: "to buy", fr: "acheter", cat: "Verbe" }, { en: "to sell", fr: "vendre", cat: "Verbe" },
  { en: "to pay", fr: "payer", cat: "Verbe" }, { en: "to learn", fr: "apprendre", cat: "Verbe" },
  { en: "to teach", fr: "enseigner", cat: "Verbe" }, { en: "to write", fr: "écrire", cat: "Verbe" },
  { en: "to read", fr: "lire", cat: "Verbe" }, { en: "to bring", fr: "apporter", cat: "Verbe" },
  { en: "to carry", fr: "porter", cat: "Verbe" }, { en: "to hold", fr: "tenir", cat: "Verbe" },
  { en: "to turn", fr: "tourner", cat: "Verbe" }, { en: "to move", fr: "bouger", cat: "Verbe" },
  { en: "to change", fr: "changer", cat: "Verbe" }, { en: "to wait", fr: "attendre", cat: "Verbe" },
  { en: "to meet", fr: "rencontrer", cat: "Verbe" }, { en: "to understand", fr: "comprendre", cat: "Verbe" },
  { en: "to remember", fr: "se souvenir", cat: "Verbe" }, { en: "to forget", fr: "oublier", cat: "Verbe" },
  { en: "to follow", fr: "suivre", cat: "Verbe" }, { en: "to push", fr: "pousser", cat: "Verbe" },
  { en: "to pull", fr: "tirer", cat: "Verbe" }, { en: "to lose", fr: "perdre", cat: "Verbe" },
  { en: "to win", fr: "gagner", cat: "Verbe" }, { en: "to send", fr: "envoyer", cat: "Verbe" },
  { en: "to receive", fr: "recevoir", cat: "Verbe" }, { en: "to stay", fr: "rester", cat: "Verbe" },
  { en: "to fall", fr: "tomber", cat: "Verbe" }, { en: "to remain", fr: "rester", cat: "Verbe" },
  { en: "to handle", fr: "gérer", cat: "Verbe" }, { en: "to pick", fr: "choisir", cat: "Verbe" },

  // LOT 4 : Nombres et Temps
  { en: "one", fr: "un", cat: "Nombre" }, { en: "two", fr: "deux", cat: "Nombre" },
  { en: "three", fr: "trois", cat: "Nombre" }, { en: "four", fr: "quatre", cat: "Nombre" },
  { en: "five", fr: "cinq", cat: "Nombre" }, { en: "ten", fr: "dix", cat: "Nombre" },
  { en: "hundred", fr: "cent", cat: "Nombre" }, { en: "thousand", fr: "mille", cat: "Nombre" },
  { en: "million", fr: "million", cat: "Nombre" }, { en: "first", fr: "premier", cat: "Nombre" },
  { en: "second", fr: "deuxième / seconde", cat: "Nombre" }, { en: "third", fr: "troisième", cat: "Nombre" },
  { en: "now", fr: "maintenant", cat: "Adverbe" }, { en: "today", fr: "aujourd'hui", cat: "Adverbe" },
  { en: "yesterday", fr: "hier", cat: "Adverbe" }, { en: "tomorrow", fr: "demain", cat: "Adverbe" },
  { en: "morning", fr: "matin", cat: "Nom" }, { en: "afternoon", fr: "après-midi", cat: "Nom" },
  { en: "evening", fr: "soir", cat: "Nom" }, { en: "night", fr: "nuit", cat: "Nom" },
  { en: "time", fr: "temps / fois", cat: "Nom" }, { en: "minute", fr: "minute", cat: "Nom" },
  { en: "hour", fr: "heure", cat: "Nom" }, { en: "day", fr: "jour", cat: "Nom" },
  { en: "week", fr: "semaine", cat: "Nom" }, { en: "month", fr: "mois", cat: "Nom" },
  { en: "year", fr: "année", cat: "Nom" }, { en: "always", fr: "toujours", cat: "Adverbe" },
  { en: "never", fr: "jamais", cat: "Adverbe" }, { en: "often", fr: "souvent", cat: "Adverbe" },
  { en: "sometimes", fr: "parfois", cat: "Adverbe" }, { en: "early", fr: "tôt / en avance", cat: "Adjectif" },
  { en: "late", fr: "tard / en retard", cat: "Adjectif" }, { en: "soon", fr: "bientôt", cat: "Adverbe" },
  { en: "already", fr: "déjà", cat: "Adverbe" }, { en: "still", fr: "encore / toujours", cat: "Adverbe" },
  { en: "once", fr: "une fois", cat: "Adverbe" }, { en: "anytime", fr: "à tout moment", cat: "Adverbe" },
  { en: "currently", fr: "actuellement", cat: "Adverbe" }, { en: "ever", fr: "jamais / déjà", cat: "Adverbe" },

  // LOT 5 : Questions et Liaisons
  { en: "what", fr: "quoi / quel", cat: "Question" }, { en: "who", fr: "qui", cat: "Question" },
  { en: "where", fr: "où", cat: "Question" }, { en: "when", fr: "quand", cat: "Question" },
  { en: "why", fr: "pourquoi", cat: "Question" }, { en: "how", fr: "comment", cat: "Question" },
  { en: "which", fr: "lequel", cat: "Question" }, { en: "whose", fr: "à qui", cat: "Question" },
  { en: "and", fr: "et", cat: "Conjonction" }, { en: "or", fr: "ou", cat: "Conjonction" },
  { en: "but", fr: "mais", cat: "Conjonction" }, { en: "because", fr: "parce que", cat: "Conjonction" },
  { en: "if", fr: "si (condition)", cat: "Conjonction" }, { en: "so", fr: "donc / alors", cat: "Conjonction" },
  { en: "that", fr: "que / ce", cat: "Conjonction" }, { en: "while", fr: "pendant que", cat: "Conjonction" },
  { en: "also", fr: "aussi", cat: "Adverbe" }, { en: "too", fr: "trop / aussi", cat: "Adverbe" },
  { en: "yes", fr: "oui", cat: "Autre" }, { en: "no", fr: "non", cat: "Autre" },
  { en: "not", fr: "ne... pas", cat: "Adverbe" }, { en: "only", fr: "seulement", cat: "Adverbe" },
  { en: "maybe", fr: "peut-être", cat: "Adverbe" }, { en: "however", fr: "cependant", cat: "Adverbe" },
  { en: "with", fr: "avec", cat: "Prep" }, { en: "without", fr: "sans", cat: "Prep" },
  { en: "for", fr: "pour", cat: "Prep" }, { en: "from", fr: "de / depuis", cat: "Prep" },
  { en: "to", fr: "à / vers", cat: "Prep" }, { en: "in", fr: "dans", cat: "Prep" },
  { en: "on", fr: "sur", cat: "Prep" }, { en: "at", fr: "à", cat: "Prep" },
  { en: "about", fr: "à propos de", cat: "Prep" }, { en: "like", fr: "comme", cat: "Prep" },
  { en: "as", fr: "comme / en tant que", cat: "Prep" }, { en: "than", fr: "que (comparatif)", cat: "Conjonction" },
  { en: "then", fr: "alors / ensuite", cat: "Adverbe" }, { en: "what kind of", fr: "quel genre de", cat: "Question" },
  { en: "though", fr: "cependant", cat: "Conjonction" }, { en: "either", fr: "soit / non plus", cat: "Conjonction" },

  // LOT 6 : Adjectifs I
  { en: "good", fr: "bon", cat: "Adjectif" }, { en: "bad", fr: "mauvais", cat: "Adjectif" },
  { en: "big", fr: "grand / gros", cat: "Adjectif" }, { en: "small", fr: "petit", cat: "Adjectif" },
  { en: "hot", fr: "chaud", cat: "Adjectif" }, { en: "cold", fr: "froid", cat: "Adjectif" },
  { en: "new", fr: "nouveau", cat: "Adjectif" }, { en: "old", fr: "vieux / ancien", cat: "Adjectif" },
  { en: "easy", fr: "facile", cat: "Adjectif" }, { en: "hard", fr: "difficile / dur", cat: "Adjectif" },
  { en: "fast", fr: "rapide", cat: "Adjectif" }, { en: "slow", fr: "lent", cat: "Adjectif" },
  { en: "happy", fr: "heureux", cat: "Adjectif" }, { en: "sad", fr: "triste", cat: "Adjectif" },
  { en: "clean", fr: "propre", cat: "Adjectif" }, { en: "dirty", fr: "sale", cat: "Adjectif" },
  { en: "right", fr: "correct / droit", cat: "Adjectif" }, { en: "wrong", fr: "faux / incorrect", cat: "Adjectif" },
  { en: "full", fr: "plein", cat: "Adjectif" }, { en: "empty", fr: "vide", cat: "Adjectif" },
  { en: "open", fr: "ouvert", cat: "Adjectif" }, { en: "closed", fr: "fermé", cat: "Adjectif" },
  { en: "young", fr: "jeune", cat: "Adjectif" }, { en: "long", fr: "long", cat: "Adjectif" },
  { en: "short", fr: "court / petit (taille)", cat: "Adjectif" }, { en: "high", fr: "haut", cat: "Adjectif" },
  { en: "low", fr: "bas", cat: "Adjectif" }, { en: "sweet", fr: "sucré / doux", cat: "Adjectif" },
  { en: "nice", fr: "sympathique", cat: "Adjectif" }, { en: "kind", fr: "gentil", cat: "Adjectif" },
  { en: "safe", fr: "en sécurité", cat: "Adjectif" }, { en: "dangerous", fr: "dangereux", cat: "Adjectif" },
  { en: "same", fr: "même / pareil", cat: "Adjectif" }, { en: "different", fr: "différent", cat: "Adjectif" },
  { en: "ready", fr: "prêt", cat: "Adjectif" }, { en: "free", fr: "libre / gratuit", cat: "Adjectif" },
  { en: "busy", fr: "occupé", cat: "Adjectif" }, { en: "every", fr: "chaque", cat: "Adjectif" },
  { en: "some", fr: "quelque / un peu de", cat: "Adjectif" }, { en: "famous", fr: "célèbre", cat: "Adjectif" },

  // LOT 7 : Adjectifs II
  { en: "beautiful", fr: "beau / belle", cat: "Adjectif" }, { en: "pretty", fr: "joli", cat: "Adjectif" },
  { en: "ugly", fr: "laid", cat: "Adjectif" }, { en: "strong", fr: "fort", cat: "Adjectif" },
  { en: "weak", fr: "faible", cat: "Adjectif" }, { en: "heavy", fr: "lourd", cat: "Adjectif" },
  { en: "light", fr: "léger / lumière", cat: "Adjectif" }, { en: "dark", fr: "sombre / foncé", cat: "Adjectif" },
  { en: "bright", fr: "brillant / clair", cat: "Adjectif" }, { en: "cheap", fr: "bon marché", cat: "Adjectif" },
  { en: "expensive", fr: "cher", cat: "Adjectif" }, { en: "rich", fr: "riche", cat: "Adjectif" },
  { en: "poor", fr: "pauvre", cat: "Adjectif" }, { en: "loud", fr: "bruyant / fort", cat: "Adjectif" },
  { en: "quiet", fr: "silencieux / calme", cat: "Adjectif" }, { en: "soft", fr: "doux / mou", cat: "Adjectif" },
  { en: "true", fr: "vrai", cat: "Adjectif" }, { en: "false", fr: "faux", cat: "Adjectif" },
  { en: "simple", fr: "simple", cat: "Adjectif" }, { en: "complex", fr: "complexe", cat: "Adjectif" },
  { en: "deep", fr: "profond", cat: "Adjectif" }, { en: "wide", fr: "large", cat: "Adjectif" },
  { en: "narrow", fr: "étroit", cat: "Adjectif" }, { en: "thick", fr: "épais", cat: "Adjectif" },
  { en: "thin", fr: "mince / fin", cat: "Adjectif" }, { en: "flat", fr: "plat", cat: "Adjectif" },
  { en: "round", fr: "rond", cat: "Adjectif" }, { en: "dry", fr: "sec", cat: "Adjectif" },
  { en: "wet", fr: "mouillé", cat: "Adjectif" }, { en: "fresh", fr: "frais / neuf", cat: "Adjectif" },
  { en: "warm", fr: "tiède / chaud agréable", cat: "Adjectif" }, { en: "cool", fr: "frais / cool", cat: "Adjectif" },
  { en: "certain", fr: "certain", cat: "Adjectif" }, { en: "sure", fr: "sûr / certain", cat: "Adjectif" },
  { en: "clear", fr: "clair", cat: "Adjectif" }, { en: "fair", fr: "juste / équitable", cat: "Adjectif" },
  { en: "real", fr: "réel", cat: "Adjectif" }, { en: "better", fr: "mieux / meilleur", cat: "Adjectif" },
  { en: "definite", fr: "précis", cat: "Adjectif" }, { en: "current", fr: "actuel", cat: "Adjectif" },

  // LOT 8 : Lieu et Espace
  { en: "here", fr: "ici", cat: "Adverbe" }, { en: "there", fr: "là", cat: "Adverbe" },
  { en: "everywhere", fr: "partout", cat: "Adverbe" }, { en: "nowhere", fr: "nulle part", cat: "Adverbe" },
  { en: "somewhere", fr: "quelque part", cat: "Adverbe" }, { en: "top", fr: "sommet / haut", cat: "Nom" },
  { en: "bottom", fr: "bas / fond", cat: "Nom" }, { en: "front", fr: "devant", cat: "Nom" },
  { en: "back", fr: "arrière / dos", cat: "Nom" }, { en: "side", fr: "côté", cat: "Nom" },
  { en: "inside", fr: "à l'intérieur", cat: "Prep" }, { en: "outside", fr: "à l'extérieur", cat: "Prep" },
  { en: "up", fr: "en haut", cat: "Prep" }, { en: "down", fr: "en bas", cat: "Prep" },
  { en: "left", fr: "gauche", cat: "Nom" }, { en: "north", fr: "nord", cat: "Nom" },
  { en: "south", fr: "sud", cat: "Nom" }, { en: "east", fr: "est", cat: "Nom" },
  { en: "west", fr: "ouest", cat: "Nom" }, { en: "center", fr: "centre", cat: "Nom" },
  { en: "middle", fr: "milieu", cat: "Nom" }, { en: "near", fr: "près de", cat: "Prep" },
  { en: "far", fr: "loin", cat: "Adverbe" }, { en: "away", fr: "au loin / absent", cat: "Adverbe" },
  { en: "ahead", fr: "devant / en avant", cat: "Adverbe" }, { en: "between", fr: "entre", cat: "Prep" },
  { en: "behind", fr: "derrière", cat: "Prep" }, { en: "under", fr: "sous", cat: "Prep" },
  { en: "over", fr: "au-dessus", cat: "Prep" }, { en: "above", fr: "au-dessus de", cat: "Prep" },
  { en: "below", fr: "en dessous de", cat: "Prep" }, { en: "next to", fr: "à côté de", cat: "Prep" },
  { en: "across", fr: "en face de / à travers", cat: "Prep" }, { en: "place", fr: "endroit", cat: "Nom" },
  { en: "area", fr: "zone / région", cat: "Nom" }, { en: "through", fr: "à travers", cat: "Prep" },
  { en: "within", fr: "dans / en dedans de", cat: "Prep" }, { en: "since", fr: "depuis", cat: "Prep" },
  { en: "beyond", fr: "au-delà de", cat: "Prep" }, { en: "against", fr: "contre", cat: "Prep" },

  // LOT 9 : Corps humain
  { en: "body", fr: "corps", cat: "Nom" }, { en: "head", fr: "tête", cat: "Nom" },
  { en: "face", fr: "visage", cat: "Nom" }, { en: "eye", fr: "œil", cat: "Nom" },
  { en: "ear", fr: "oreille", cat: "Nom" }, { en: "nose", fr: "nez", cat: "Nom" },
  { en: "mouth", fr: "bouche", cat: "Nom" }, { en: "tooth", fr: "dent", cat: "Nom" },
  { en: "lip", fr: "lèvre", cat: "Nom" }, { en: "tongue", fr: "langue", cat: "Nom" },
  { en: "hair", fr: "cheveux", cat: "Nom" }, { en: "neck", fr: "cou", cat: "Nom" },
  { en: "shoulder", fr: "épaule", cat: "Nom" }, { en: "arm", fr: "bras", cat: "Nom" },
  { en: "hand", fr: "main", cat: "Nom" }, { en: "finger", fr: "doigt", cat: "Nom" },
  { en: "chest", fr: "poitrine", cat: "Nom" }, { en: "heart", fr: "cœur", cat: "Nom" },
  { en: "stomach", fr: "estomac / ventre", cat: "Nom" }, { en: "leg", fr: "jambe", cat: "Nom" },
  { en: "knee", fr: "genou", cat: "Nom" }, { en: "foot", fr: "pied", cat: "Nom" },
  { en: "toe", fr: "orteil", cat: "Nom" }, { en: "skin", fr: "peau", cat: "Nom" },
  { en: "bone", fr: "os", cat: "Nom" }, { en: "blood", fr: "sang", cat: "Nom" },
  { en: "brain", fr: "cerveau", cat: "Nom" }, { en: "muscle", fr: "muscle", cat: "Nom" },
  { en: "lung", fr: "poumon", cat: "Nom" }, { en: "throat", fr: "gorge", cat: "Nom" },
  { en: "sick", fr: "malade", cat: "Adjectif" }, { en: "ill", fr: "malade", cat: "Adjectif" },
  { en: "healthy", fr: "en bonne santé", cat: "Adjectif" }, { en: "pain", fr: "douleur", cat: "Nom" },
  { en: "hurt", fr: "blesser / faire mal", cat: "Verbe" }, { en: "breath", fr: "respiration", cat: "Nom" },
  { en: "breathe", fr: "respirer", cat: "Verbe" }, { en: "balance", fr: "équilibre", cat: "Nom" },
  { en: "needs", fr: "besoins", cat: "Nom" }, { en: "careful", fr: "prudent", cat: "Adjectif" },

  // LOT 10 : Maison et Objets
  { en: "house", fr: "maison", cat: "Nom" }, { en: "home", fr: "foyer / chez-soi", cat: "Nom" },
  { en: "building", fr: "bâtiment", cat: "Nom" }, { en: "apartment", fr: "appartement", cat: "Nom" },
  { en: "room", fr: "pièce / chambre", cat: "Nom" }, { en: "bedroom", fr: "chambre à coucher", cat: "Nom" },
  { en: "bathroom", fr: "salle de bain", cat: "Nom" }, { en: "kitchen", fr: "cuisine", cat: "Nom" },
  { en: "living room", fr: "salon", cat: "Nom" }, { en: "door", fr: "porte", cat: "Nom" },
  { en: "window", fr: "fenêtre", cat: "Nom" }, { en: "wall", fr: "mur", cat: "Nom" },
  { en: "floor", fr: "sol / étage", cat: "Nom" }, { en: "roof", fr: "toit", cat: "Nom" },
  { en: "stairs", fr: "escaliers", cat: "Nom" }, { en: "table", fr: "table", cat: "Nom" },
  { en: "chair", fr: "chaise", cat: "Nom" }, { en: "bed", fr: "lit", cat: "Nom" },
  { en: "desk", fr: "bureau (meuble)", cat: "Nom" }, { en: "shelf", fr: "étagère", cat: "Nom" },
  { en: "key", fr: "clé", cat: "Nom" }, { en: "box", fr: "boîte", cat: "Nom" },
  { en: "bag", fr: "sac", cat: "Nom" }, { en: "clock", fr: "horloge", cat: "Nom" },
  { en: "mirror", fr: "miroir", cat: "Nom" }, { en: "lamp", fr: "lampe", cat: "Nom" },
  { en: "phone", fr: "téléphone", cat: "Nom" }, { en: "computer", fr: "ordinateur", cat: "Nom" },
  { en: "paper", fr: "papier", cat: "Nom" }, { en: "pen", fr: "stylo", cat: "Nom" },
  { en: "pencil", fr: "crayon", cat: "Nom" }, { en: "book", fr: "livre", cat: "Nom" },
  { en: "trash", fr: "poubelle / déchets", cat: "Nom" }, { en: "soap", fr: "savon", cat: "Nom" },
  { en: "towel", fr: "serviette", cat: "Nom" }, { en: "lounge", fr: "salon / hall", cat: "Nom" },
  { en: "thing", fr: "chose", cat: "Nom" }, { en: "notice", fr: "avis / préavis", cat: "Nom" },
  { en: "tip", fr: "conseil / astuce", cat: "Nom" }, { en: "tips", fr: "conseils", cat: "Nom" },

  // LOT 11 : Nourriture et Boissons
  { en: "food", fr: "nourriture", cat: "Nom" }, { en: "meal", fr: "repas", cat: "Nom" },
  { en: "breakfast", fr: "petit-déjeuner", cat: "Nom" }, { en: "lunch", fr: "déjeuner", cat: "Nom" },
  { en: "dinner", fr: "dîner", cat: "Nom" }, { en: "water", fr: "eau", cat: "Nom" },
  { en: "bread", fr: "pain", cat: "Nom" }, { en: "rice", fr: "riz", cat: "Nom" },
  { en: "meat", fr: "viande", cat: "Nom" }, { en: "chicken", fr: "poulet", cat: "Nom" },
  { en: "fish", fr: "poisson", cat: "Nom" }, { en: "egg", fr: "œuf", cat: "Nom" },
  { en: "milk", fr: "lait", cat: "Nom" }, { en: "cheese", fr: "fromage", cat: "Nom" },
  { en: "fruit", fr: "fruit", cat: "Nom" }, { en: "vegetable", fr: "légume", cat: "Nom" },
  { en: "sugar", fr: "sucre", cat: "Nom" }, { en: "salt", fr: "sel", cat: "Nom" },
  { en: "pepper", fr: "poivre", cat: "Nom" }, { en: "oil", fr: "huile", cat: "Nom" },
  { en: "coffee", fr: "café", cat: "Nom" }, { en: "tea", fr: "thé", cat: "Nom" },
  { en: "juice", fr: "jus", cat: "Nom" }, { en: "glass", fr: "verre", cat: "Nom" },
  { en: "cup", fr: "tasse", cat: "Nom" }, { en: "bottle", fr: "bouteille", cat: "Nom" },
  { en: "plate", fr: "assiette", cat: "Nom" }, { en: "bowl", fr: "bol", cat: "Nom" },
  { en: "knife", fr: "couteau", cat: "Nom" }, { en: "fork", fr: "fourchette", cat: "Nom" },
  { en: "spoon", fr: "cuillère", cat: "Nom" }, { en: "tray", fr: "plateau", cat: "Nom" },
  { en: "hungry", fr: "affamé", cat: "Adjectif" }, { en: "thirsty", fr: "assoiffé", cat: "Adjectif" },
  { en: "sour", fr: "acide", cat: "Adjectif" }, { en: "spicy", fr: "épicé", cat: "Adjectif" },
  { en: "taste", fr: "goût / goûter", cat: "Verbe" }, { en: "glad", fr: "content", cat: "Adjectif" },
  { en: "eager", fr: "impatient", cat: "Adjectif" }, { en: "thrilled", fr: "ravi", cat: "Adjectif" },

  // LOT 12 : Vêtements et Couleurs
  { en: "clothes", fr: "vêtements", cat: "Nom" }, { en: "shirt", fr: "chemise", cat: "Nom" },
  { en: "t-shirt", fr: "t-shirt", cat: "Nom" }, { en: "pants", fr: "pantalon", cat: "Nom" },
  { en: "dress", fr: "robe", cat: "Nom" }, { en: "skirt", fr: "jupe", cat: "Nom" },
  { en: "jacket", fr: "veste", cat: "Nom" }, { en: "coat", fr: "manteau", cat: "Nom" },
  { en: "shoe", fr: "chaussure", cat: "Nom" }, { en: "sock", fr: "chaussette", cat: "Nom" },
  { en: "hat", fr: "chapeau", cat: "Nom" }, { en: "belt", fr: "ceinture", cat: "Nom" },
  { en: "glove", fr: "gant", cat: "Nom" }, { en: "pocket", fr: "poche", cat: "Nom" },
  { en: "color", fr: "couleur", cat: "Nom" }, { en: "red", fr: "rouge", cat: "Adjectif" },
  { en: "blue", fr: "bleu", cat: "Adjectif" }, { en: "green", fr: "vert", cat: "Adjectif" },
  { en: "yellow", fr: "jaune", cat: "Adjectif" }, { en: "black", fr: "noir", cat: "Adjectif" },
  { en: "white", fr: "blanc", cat: "Adjectif" }, { en: "grey", fr: "gris", cat: "Adjectif" },
  { en: "brown", fr: "marron", cat: "Adjectif" }, { en: "pink", fr: "rose", cat: "Adjectif" },
  { en: "purple", fr: "violet", cat: "Adjectif" }, { en: "orange", fr: "orange", cat: "Adjectif" },
  { en: "wear", fr: "porter (vêtements)", cat: "Verbe" }, { en: "fashion", fr: "mode", cat: "Nom" },
  { en: "fit", fr: "convenir / taille ajustée", cat: "Verbe" }, { en: "size", fr: "taille", cat: "Nom" },
  { en: "style", fr: "style", cat: "Nom" }, { en: "look", fr: "apparence / air", cat: "Nom" },
  { en: "gold", fr: "or", cat: "Nom" }, { en: "silver", fr: "argent (métal)", cat: "Nom" },
  { en: "cotton", fr: "coton", cat: "Nom" }, { en: "ring", fr: "bague / anneau", cat: "Nom" },
  { en: "watch", fr: "montre", cat: "Nom" }, { en: "willing", fr: "disposé", cat: "Adjectif" },
  { en: "easygoing", fr: "facile à vivre", cat: "Adjectif" }, { en: "unfamiliar", fr: "inconnu", cat: "Adjectif" },

  // LOT 13 : Nature et Environnement
  { en: "nature", fr: "nature", cat: "Nom" }, { en: "earth", fr: "terre / globe", cat: "Nom" },
  { en: "world", fr: "monde", cat: "Nom" }, { en: "sky", fr: "ciel", cat: "Nom" },
  { en: "sun", fr: "soleil", cat: "Nom" }, { en: "moon", fr: "lune", cat: "Nom" },
  { en: "star", fr: "étoile", cat: "Nom" }, { en: "air", fr: "air", cat: "Nom" },
  { en: "fire", fr: "feu", cat: "Nom" }, { en: "sea", fr: "mer", cat: "Nom" },
  { en: "ocean", fr: "océan", cat: "Nom" }, { en: "river", fr: "rivière", cat: "Nom" },
  { en: "lake", fr: "lac", cat: "Nom" }, { en: "mountain", fr: "montagne", cat: "Nom" },
  { en: "hill", fr: "colline", cat: "Nom" }, { en: "forest", fr: "forêt", cat: "Nom" },
  { en: "tree", fr: "arbre", cat: "Nom" }, { en: "flower", fr: "fleur", cat: "Nom" },
  { en: "grass", fr: "herbe", cat: "Nom" }, { en: "plant", fr: "plante", cat: "Nom" },
  { en: "animal", fr: "animal", cat: "Nom" }, { en: "dog", fr: "chien", cat: "Nom" },
  { en: "cat", fr: "chat", cat: "Nom" }, { en: "bird", fr: "oiseau", cat: "Nom" },
  { en: "sand", fr: "sable", cat: "Nom" }, { en: "stone", fr: "pierre", cat: "Nom" },
  { en: "rock", fr: "rocher", cat: "Nom" }, { en: "weather", fr: "météo", cat: "Nom" },
  { en: "rain", fr: "pluie", cat: "Nom" }, { en: "snow", fr: "neige", cat: "Nom" },
  { en: "wind", fr: "vent", cat: "Nom" }, { en: "cloud", fr: "nuage", cat: "Nom" },
  { en: "storm", fr: "tempête", cat: "Nom" }, { en: "season", fr: "saison", cat: "Nom" },
  { en: "spring", fr: "printemps", cat: "Nom" }, { en: "summer", fr: "été", cat: "Nom" },
  { en: "environment", fr: "environnement", cat: "Nom" }, { en: "nearby", fr: "à proximité", cat: "Adverbe" },
  { en: "mostly", fr: "surtout", cat: "Adverbe" }, { en: "besides", fr: "en plus", cat: "Adverbe" },

  // LOT 14 : Transport et Voyage
  { en: "car", fr: "voiture", cat: "Nom" }, { en: "bus", fr: "bus", cat: "Nom" },
  { en: "train", fr: "train", cat: "Nom" }, { en: "plane", fr: "avion", cat: "Nom" },
  { en: "boat", fr: "bateau", cat: "Nom" }, { en: "ship", fr: "navire", cat: "Nom" },
  { en: "bike", fr: "vélo", cat: "Nom" }, { en: "road", fr: "route", cat: "Nom" },
  { en: "street", fr: "rue", cat: "Nom" }, { en: "path", fr: "chemin", cat: "Nom" },
  { en: "bridge", fr: "pont", cat: "Nom" }, { en: "map", fr: "carte / plan", cat: "Nom" },
  { en: "travel", fr: "voyager / voyage", cat: "Verbe" }, { en: "trip", fr: "voyage / trajet", cat: "Nom" },
  { en: "journey", fr: "périple", cat: "Nom" }, { en: "airport", fr: "aéroport", cat: "Nom" },
  { en: "station", fr: "gare / station", cat: "Nom" }, { en: "ticket", fr: "billet", cat: "Nom" },
  { en: "passport", fr: "passeport", cat: "Nom" }, { en: "hotel", fr: "hôtel", cat: "Nom" },
  { en: "speed", fr: "vitesse", cat: "Nom" }, { en: "traffic", fr: "circulation", cat: "Nom" },
  { en: "direction", fr: "direction", cat: "Nom" }, { en: "abroad", fr: "à l'étranger", cat: "Adverbe" },
  { en: "park", fr: "se garer / parc", cat: "Verbe" }, { en: "fly", fr: "voler en avion", cat: "Verbe" },
  { en: "drive", fr: "conduire", cat: "Verbe" }, { en: "ride", fr: "monter (vélo/cheval)", cat: "Verbe" },
  { en: "cross", fr: "traverser", cat: "Verbe" }, { en: "arrive", fr: "arriver", cat: "Verbe" },
  { en: "depart", fr: "décoller / partir", cat: "Verbe" }, { en: "flight", fr: "vol", cat: "Nom" },
  { en: "passenger", fr: "passager", cat: "Nom" }, { en: "seat", fr: "siège / place", cat: "Nom" },
  { en: "luggage", fr: "bagage", cat: "Nom" }, { en: "tourist", fr: "touriste", cat: "Nom" },
  { en: "visit", fr: "visiter / rendre visite", cat: "Verbe" }, { en: "right away", fr: "tout de suite", cat: "Expression" },
  { en: "straight ahead", fr: "tout droit", cat: "Expression" }, { en: "into", fr: "dans / vers", cat: "Prep" },

  // LOT 15 : Travail et Éducation
  { en: "work", fr: "travail / travailler", cat: "Nom" }, { en: "job", fr: "emploi / métier", cat: "Nom" },
  { en: "career", fr: "carrière", cat: "Nom" }, { en: "office", fr: "bureau (lieu)", cat: "Nom" },
  { en: "company", fr: "entreprise", cat: "Nom" }, { en: "business", fr: "affaires / entreprise", cat: "Nom" },
  { en: "manager", fr: "responsable / manager", cat: "Nom" }, { en: "employee", fr: "employé", cat: "Nom" },
  { en: "employer", fr: "employeur", cat: "Nom" }, { en: "salary", fr: "salaire", cat: "Nom" },
  { en: "boss", fr: "patron", cat: "Nom" }, { en: "colleague", fr: "collègue", cat: "Nom" },
  { en: "school", fr: "école", cat: "Nom" }, { en: "university", fr: "université", cat: "Nom" },
  { en: "college", fr: "faculté / supérieur", cat: "Nom" }, { en: "class", fr: "classe / cours", cat: "Nom" },
  { en: "course", fr: "cours", cat: "Nom" }, { en: "lesson", fr: "leçon", cat: "Nom" },
  { en: "student", fr: "étudiant", cat: "Nom" }, { en: "teacher", fr: "enseignant", cat: "Nom" },
  { en: "professor", fr: "professeur", cat: "Nom" }, { en: "exam", fr: "examen", cat: "Nom" },
  { en: "test", fr: "test", cat: "Nom" }, { en: "grade", fr: "note / niveau", cat: "Nom" },
  { en: "degree", fr: "diplôme / degré", cat: "Nom" }, { en: "knowledge", fr: "connaissance", cat: "Nom" },
  { en: "study", fr: "étudier", cat: "Verbe" }, { en: "project", fr: "projet", cat: "Nom" },
  { en: "task", fr: "tâche", cat: "Nom" }, { en: "goal", fr: "objectif", cat: "Nom" },
  { en: "meeting", fr: "réunion", cat: "Nom" }, { en: "skill", fr: "compétence", cat: "Nom" },
  { en: "effort", fr: "effort", cat: "Nom" }, { en: "success", fr: "succès", cat: "Nom" },
  { en: "failure", fr: "échec", cat: "Nom" }, { en: "practice", fr: "pratique", cat: "Nom" },
  { en: "experience", fr: "expérience", cat: "Nom" }, { en: "to attend", fr: "assister à", cat: "Verbe" },
  { en: "to manage", fr: "gérer / réussir", cat: "Verbe" }, { en: "to target", fr: "cibler", cat: "Verbe" },

  // LOT 16 : Technologie et Internet
  { en: "internet", fr: "internet", cat: "Nom" }, { en: "website", fr: "site web", cat: "Nom" },
  { en: "web", fr: "toile / web", cat: "Nom" }, { en: "screen", fr: "écran", cat: "Nom" },
  { en: "keyboard", fr: "clavier", cat: "Nom" }, { en: "mouse", fr: "souris", cat: "Nom" },
  { en: "file", fr: "fichier", cat: "Nom" }, { en: "data", fr: "données", cat: "Nom" },
  { en: "software", fr: "logiciel", cat: "Nom" }, { en: "hardware", fr: "matériel informatique", cat: "Nom" },
  { en: "app", fr: "application", cat: "Nom" }, { en: "email", fr: "e-mail", cat: "Nom" },
  { en: "message", fr: "message", cat: "Nom" }, { en: "network", fr: "réseau", cat: "Nom" },
  { en: "password", fr: "mot de passe", cat: "Nom" }, { en: "account", fr: "compte", cat: "Nom" },
  { en: "code", fr: "code", cat: "Nom" }, { en: "video", fr: "vidéo", cat: "Nom" },
  { en: "photo", fr: "photo", cat: "Nom" }, { en: "image", fr: "image", cat: "Nom" },
  { en: "camera", fr: "appareil photo", cat: "Nom" }, { en: "snippet", fr: "extrait / morceau de code", cat: "Nom" },
  { en: "online", fr: "en ligne", cat: "Adjectif" }, { en: "offline", fr: "hors ligne", cat: "Adjectif" },
  { en: "digital", fr: "numérique", cat: "Adjectif" }, { en: "download", fr: "télécharger", cat: "Verbe" },
  { en: "upload", fr: "mettre en ligne", cat: "Verbe" }, { en: "search", fr: "rechercher", cat: "Verbe" },
  { en: "connect", fr: "connecter", cat: "Verbe" }, { en: "click", fr: "cliquer", cat: "Verbe" },
  { en: "share", fr: "partager", cat: "Verbe" }, { en: "save", fr: "sauvegarder", cat: "Verbe" },
  { en: "delete", fr: "supprimer", cat: "Verbe" }, { en: "update", fr: "mettre à jour", cat: "Verbe" },
  { en: "print", fr: "imprimer", cat: "Verbe" }, { en: "link", fr: "lien", cat: "Nom" },
  { en: "user", fr: "utilisateur", cat: "Nom" }, { en: "to skim", fr: "survoler", cat: "Verbe" },
  { en: "to store", fr: "stocker", cat: "Verbe" }, { en: "to remind", fr: "rappeler", cat: "Verbe" },

  // LOT 17 : Santé et Médecine
  { en: "health", fr: "santé", cat: "Nom" }, { en: "doctor", fr: "médecin", cat: "Nom" },
  { en: "nurse", fr: "infirmier(e)", cat: "Nom" }, { en: "hospital", fr: "hôpital", cat: "Nom" },
  { en: "medicine", fr: "médicament", cat: "Nom" }, { en: "pill", fr: "pilule", cat: "Nom" },
  { en: "disease", fr: "maladie", cat: "Nom" }, { en: "illness", fr: "maladie", cat: "Nom" },
  { en: "injury", fr: "blessure", cat: "Nom" }, { en: "treatment", fr: "traitement", cat: "Nom" },
  { en: "surgery", fr: "chirurgie", cat: "Nom" }, { en: "fever", fr: "fièvre", cat: "Nom" },
  { en: "cough", fr: "toux", cat: "Nom" }, { en: "headache", fr: "mal de tête", cat: "Nom" },
  { en: "allergy", fr: "allergie", cat: "Nom" }, { en: "recover", fr: "se rétablir", cat: "Verbe" },
  { en: "cure", fr: "guérir", cat: "Verbe" }, { en: "exercise", fr: "exercice / s'entraîner", cat: "Nom" },
  { en: "diet", fr: "régime / alimentation", cat: "Nom" }, { en: "energy", fr: "énergie", cat: "Nom" },
  { en: "strength", fr: "force", cat: "Nom" }, { en: "weakness", fr: "faiblesse", cat: "Nom" },
  { en: "birth", fr: "naissance", cat: "Nom" }, { en: "death", fr: "mort", cat: "Nom" },
  { en: "alive", fr: "vivant", cat: "Adjectif" }, { en: "dead", fr: "mort", cat: "Adjectif" },
  { en: "emergency", fr: "urgence", cat: "Nom" }, { en: "accident", fr: "accident", cat: "Nom" },
  { en: "mental", fr: "mental", cat: "Adjectif" }, { en: "physical", fr: "physique", cat: "Adjectif" },
  { en: "pregnant", fr: "enceinte", cat: "Adjectif" }, { en: "well-being", fr: "bien-être", cat: "Nom" },
  { en: "rest", fr: "repos", cat: "Nom" }, { en: "sleep", fr: "sommeil", cat: "Nom" },
  { en: "care", fr: "soin / attention", cat: "Nom" }, { en: "clinic", fr: "clinique", cat: "Nom" },
  { en: "patient", fr: "patient (médical)", cat: "Nom" }, { en: "to rest", fr: "se reposer", cat: "Verbe" },
  { en: "motivated", fr: "motivé", cat: "Adjectif" }, { en: "a bit", fr: "un peu", cat: "Adverbe" },

  // LOT 18 : Émotions et Personnalité
  { en: "angry", fr: "en colère", cat: "Adjectif" }, { en: "calm", fr: "calme", cat: "Adjectif" },
  { en: "relaxed", fr: "détendu", cat: "Adjectif" }, { en: "nervous", fr: "nerveux", cat: "Adjectif" },
  { en: "stressed", fr: "stressé", cat: "Adjectif" }, { en: "tired", fr: "fatigué", cat: "Adjectif" },
  { en: "exhausted", fr: "épuisé", cat: "Adjectif" }, { en: "excited", fr: "enthousiaste", cat: "Adjectif" },
  { en: "bored", fr: "s'ennuyer", cat: "Adjectif" }, { en: "afraid", fr: "effrayé", cat: "Adjectif" },
  { en: "scared", fr: "apeuré", cat: "Adjectif" }, { en: "brave", fr: "courageux", cat: "Adjectif" },
  { en: "proud", fr: "fier", cat: "Adjectif" }, { en: "ashamed", fr: "honteux", cat: "Adjectif" },
  { en: "surprised", fr: "surpris", cat: "Adjectif" }, { en: "confident", fr: "confiant", cat: "Adjectif" },
  { en: "confused", fr: "confus", cat: "Adjectif" }, { en: "love", fr: "amour / aimer", cat: "Nom" },
  { en: "hate", fr: "haine / haïr", cat: "Nom" }, { en: "fear", fr: "peur / craindre", cat: "Nom" },
  { en: "hope", fr: "espoir / espérer", cat: "Nom" }, { en: "joy", fr: "joie", cat: "Nom" },
  { en: "peace", fr: "paix", cat: "Nom" }, { en: "worry", fr: "inquiétude / s'inquiéter", cat: "Verbe" },
  { en: "shame", fr: "honte", cat: "Nom" }, { en: "mood", fr: "humeur", cat: "Nom" },
  { en: "feeling", fr: "sentiment", cat: "Nom" }, { en: "emotion", fr: "émotion", cat: "Nom" },
  { en: "honest", fr: "honnête", cat: "Adjectif" }, { en: "dishonest", fr: "malhonnête", cat: "Adjectif" },
  { en: "smart", fr: "intelligent", cat: "Adjectif" }, { en: "clever", fr: "astucieux", cat: "Adjectif" },
  { en: "stupid", fr: "stupide", cat: "Adjectif" }, { en: "funny", fr: "drôle", cat: "Adjectif" },
  { en: "serious", fr: "sérieux", cat: "Adjectif" }, { en: "lazy", fr: "paresseux", cat: "Adjectif" },
  { en: "shy", fr: "timide", cat: "Adjectif" }, { en: "to bother", fr: "déranger", cat: "Verbe" },
  { en: "to annoy", fr: "agacer", cat: "Verbe" }, { en: "not at all", fr: "pas du tout", cat: "Expression" },

  // LOT 19 : Shopping et Argent
  { en: "money", fr: "argent", cat: "Nom" }, { en: "cash", fr: "argent liquide", cat: "Nom" },
  { en: "coin", fr: "pièce de monnaie", cat: "Nom" }, { en: "bill", fr: "facture / billet", cat: "Nom" },
  { en: "card", fr: "carte bancaire", cat: "Nom" }, { en: "price", fr: "prix", cat: "Nom" },
  { en: "cost", fr: "coût", cat: "Nom" }, { en: "value", fr: "valeur", cat: "Nom" },
  { en: "affordable", fr: "abordable", cat: "Adjectif" }, { en: "discount", fr: "réduction", cat: "Nom" },
  { en: "sale", fr: "vente / solde", cat: "Nom" }, { en: "receipt", fr: "reçu / ticket", cat: "Nom" },
  { en: "order", fr: "commande", cat: "Nom" }, { en: "package", fr: "colis", cat: "Nom" },
  { en: "tax", fr: "taxe / impôt", cat: "Nom" }, { en: "credit", fr: "crédit", cat: "Nom" },
  { en: "debt", fr: "dette", cat: "Nom" }, { en: "budget", fr: "budget", cat: "Nom" },
  { en: "profit", fr: "profit", cat: "Nom" }, { en: "loss", fr: "perte", cat: "Nom" },
  { en: "economy", fr: "économie", cat: "Nom" }, { en: "customer", fr: "client", cat: "Nom" },
  { en: "client", fr: "client", cat: "Nom" }, { en: "spend", fr: "dépenser", cat: "Verbe" },
  { en: "earn", fr: "gagner de l'argent", cat: "Verbe" }, { en: "invest", fr: "investir", cat: "Verbe" },
  { en: "rent", fr: "louer", cat: "Verbe" }, { en: "own", fr: "posséder", cat: "Verbe" },
  { en: "deliver", fr: "livrer", cat: "Verbe" }, { en: "return", fr: "retourner un article", cat: "Verbe" },
  { en: "exchange", fr: "échanger", cat: "Verbe" }, { en: "shop", fr: "magasin / faire des courses", cat: "Nom" },
  { en: "market", fr: "marché", cat: "Nom" }, { en: "store", fr: "magasin", cat: "Nom" },
  { en: "bank", fr: "banque", cat: "Nom" }, { en: "wallet", fr: "portefeuille", cat: "Nom" },
  { en: "available", fr: "disponible", cat: "Adjectif" }, { en: "luck", fr: "chance", cat: "Nom" },
  { en: "spare time", fr: "temps libre", cat: "Nom" }, { en: "make sense", fr: "être logique", cat: "Expression" },

  // LOT 20 : Loisirs et Divertissement
  { en: "game", fr: "jeu", cat: "Nom" }, { en: "sport", fr: "sport", cat: "Nom" },
  { en: "music", fr: "musique", cat: "Nom" }, { en: "song", fr: "chanson", cat: "Nom" },
  { en: "movie", fr: "film", cat: "Nom" }, { en: "film", fr: "film", cat: "Nom" },
  { en: "art", fr: "art", cat: "Nom" }, { en: "party", fr: "fête", cat: "Nom" },
  { en: "dance", fr: "danser / danse", cat: "Verbe" }, { en: "sing", fr: "chanter", cat: "Verbe" },
  { en: "swim", fr: "nager", cat: "Verbe" }, { en: "climb", fr: "grimper", cat: "Verbe" },
  { en: "jump", fr: "sauter", cat: "Verbe" }, { en: "hobby", fr: "passe-temps", cat: "Nom" },
  { en: "team", fr: "équipe", cat: "Nom" }, { en: "match", fr: "match", cat: "Nom" },
  { en: "player", fr: "joueur", cat: "Nom" }, { en: "fan", fr: "supporter / fan", cat: "Nom" },
  { en: "show", fr: "spectacle / émission", cat: "Nom" }, { en: "theater", fr: "théâtre / cinéma", cat: "Nom" },
  { en: "concert", fr: "concert", cat: "Nom" }, { en: "instrument", fr: "instrument", cat: "Nom" },
  { en: "guitar", fr: "guitare", cat: "Nom" }, { en: "piano", fr: "piano", cat: "Nom" },
  { en: "ball", fr: "ballon / balle", cat: "Nom" }, { en: "toy", fr: "jouet", cat: "Nom" },
  { en: "enjoy", fr: "apprécier", cat: "Verbe" }, { en: "relax", fr: "se détendre", cat: "Verbe" },
  { en: "laugh", fr: "rire", cat: "Verbe" }, { en: "smile", fr: "sourire", cat: "Verbe" },
  { en: "joke", fr: "plaisanter / blague", cat: "Verbe" }, { en: "vacation", fr: "vacances", cat: "Nom" },
  { en: "holiday", fr: "jour férié / vacances", cat: "Nom" }, { en: "festival", fr: "festival", cat: "Nom" },
  { en: "fun", fr: "amusement", cat: "Nom" }, { en: "leisure", fr: "loisir", cat: "Nom" },
  { en: "gathering", fr: "rassemblement", cat: "Nom" }, { en: "to waste", fr: "gaspiller", cat: "Verbe" },
  { en: "to dare", fr: "oser", cat: "Verbe" }, { en: "over and over", fr: "encore et encore", cat: "Expression" },

  // LOT 21 : Ville et Services
  { en: "city", fr: "grande ville", cat: "Nom" }, { en: "town", fr: "ville", cat: "Nom" },
  { en: "village", fr: "village", cat: "Nom" }, { en: "country", fr: "pays / campagne", cat: "Nom" },
  { en: "neighborhood", fr: "quartier", cat: "Nom" }, { en: "downtown", fr: "centre-ville", cat: "Nom" },
  { en: "address", fr: "adresse", cat: "Nom" }, { en: "square", fr: "place (ville)", cat: "Nom" },
  { en: "post office", fr: "bureau de poste", cat: "Nom" }, { en: "police", fr: "police", cat: "Nom" },
  { en: "library", fr: "bibliothèque", cat: "Nom" }, { en: "restaurant", fr: "restaurant", cat: "Nom" },
  { en: "cafe", fr: "café (lieu)", cat: "Nom" }, { en: "facility", fr: "équipement / installation", cat: "Nom" },
  { en: "government", fr: "gouvernement", cat: "Nom" }, { en: "law", fr: "loi", cat: "Nom" },
  { en: "rule", fr: "règle", cat: "Nom" }, { en: "power", fr: "pouvoir", cat: "Nom" },
  { en: "leader", fr: "dirigeant", cat: "Nom" }, { en: "service", fr: "service", cat: "Nom" },
  { en: "society", fr: "société", cat: "Nom" }, { en: "culture", fr: "culture", cat: "Nom" },
  { en: "freedom", fr: "liberté", cat: "Nom" }, { en: "justice", fr: "justice", cat: "Nom" },
  { en: "duty", fr: "devoir / obligation", cat: "Nom" }, { en: "community", fr: "communauté", cat: "Nom" },
  { en: "public", fr: "public", cat: "Adjectif" }, { en: "private", fr: "privé", cat: "Adjectif" },
  { en: "citizen", fr: "citoyen", cat: "Nom" }, { en: "mayor", fr: "maire", cat: "Nom" },
  { en: "court", fr: "tribunal / cour", cat: "Nom" }, { en: "crime", fr: "crime", cat: "Nom" },
  { en: "safety", fr: "sécurité", cat: "Nom" }, { en: "compliance", fr: "conformité", cat: "Nom" },
  { en: "interior", fr: "intérieur", cat: "Nom" }, { en: "witness", fr: "témoin", cat: "Nom" },
  { en: "mix-up", fr: "confusion", cat: "Nom" }, { en: "out there", fr: "quelque part / dehors", cat: "Expression" },
  { en: "to neglect", fr: "négliger", cat: "Verbe" }, { en: "anything", fr: "n'importe quoi", cat: "Pronom" },

  // LOT 22 : Communication
  { en: "explain", fr: "expliquer", cat: "Verbe" }, { en: "describe", fr: "décrire", cat: "Verbe" },
  { en: "agree", fr: "être d'accord", cat: "Verbe" }, { en: "disagree", fr: "ne pas être d'accord", cat: "Verbe" },
  { en: "suggest", fr: "suggérer", cat: "Verbe" }, { en: "recommend", fr: "recommander", cat: "Verbe" },
  { en: "warn", fr: "avertir", cat: "Verbe" }, { en: "promise", fr: "promettre", cat: "Verbe" },
  { en: "apologize", fr: "s'excuser", cat: "Verbe" }, { en: "thank", fr: "remercier", cat: "Verbe" },
  { en: "greet", fr: "saluer", cat: "Verbe" }, { en: "introduce", fr: "présenter", cat: "Verbe" },
  { en: "repeat", fr: "répéter", cat: "Verbe" }, { en: "spell", fr: "épeler", cat: "Verbe" },
  { en: "lie", fr: "mentir", cat: "Verbe" }, { en: "admit", fr: "admettre", cat: "Verbe" },
  { en: "deny", fr: "nier", cat: "Verbe" }, { en: "confirm", fr: "confirmer", cat: "Verbe" },
  { en: "claim", fr: "affirmer / prétendre", cat: "Verbe" }, { en: "prove", fr: "prouver", cat: "Verbe" },
  { en: "imply", fr: "sous-entendre", cat: "Verbe" }, { en: "shout", fr: "crier", cat: "Verbe" },
  { en: "whisper", fr: "chuchoter", cat: "Verbe" }, { en: "answer", fr: "répondre / réponse", cat: "Verbe" },
  { en: "question", fr: "question", cat: "Nom" }, { en: "discussion", fr: "discussion", cat: "Nom" },
  { en: "speech", fr: "discours / parole", cat: "Nom" }, { en: "language", fr: "langue", cat: "Nom" },
  { en: "word", fr: "mot", cat: "Nom" }, { en: "sentence", fr: "phrase", cat: "Nom" },
  { en: "meaning", fr: "signification", cat: "Nom" }, { en: "voice", fr: "voix", cat: "Nom" },
  { en: "sound", fr: "son", cat: "Nom" }, { en: "silence", fr: "silence", cat: "Nom" },
  { en: "opinion", fr: "avis", cat: "Nom" }, { en: "advice", fr: "conseil", cat: "Nom" },
  { en: "secret", fr: "secret", cat: "Nom" }, { en: "to sound like", fr: "on dirait que", cat: "Verbe" },
  { en: "to look like", fr: "ressembler à", cat: "Verbe" }, { en: "how about", fr: "et si / que dirais-tu de", cat: "Expression" },

  // LOT 23 : Science et Méthode
  { en: "science", fr: "science", cat: "Nom" }, { en: "research", fr: "recherche", cat: "Nom" },
  { en: "experiment", fr: "expérience scientifique", cat: "Nom" }, { en: "theory", fr: "théorie", cat: "Nom" },
  { en: "fact", fr: "fait", cat: "Nom" }, { en: "evidence", fr: "preuve", cat: "Nom" },
  { en: "discovery", fr: "découverte", cat: "Nom" }, { en: "invention", fr: "invention", cat: "Nom" },
  { en: "analyze", fr: "analyser", cat: "Verbe" }, { en: "investigate", fr: "enquêter", cat: "Verbe" },
  { en: "measure", fr: "mesurer", cat: "Verbe" }, { en: "calculate", fr: "calculer", cat: "Verbe" },
  { en: "solve", fr: "résoudre", cat: "Verbe" }, { en: "solution", fr: "solution", cat: "Nom" },
  { en: "mistake", fr: "erreur", cat: "Nom" }, { en: "error", fr: "erreur", cat: "Nom" },
  { en: "correct", fr: "correct", cat: "Adjectif" }, { en: "incorrect", fr: "incorrect", cat: "Adjectif" },
  { en: "method", fr: "méthode", cat: "Nom" }, { en: "process", fr: "processus", cat: "Nom" },
  { en: "system", fr: "système", cat: "Nom" }, { en: "result", fr: "résultat", cat: "Nom" },
  { en: "effect", fr: "effet", cat: "Nom" }, { en: "cause", fr: "cause", cat: "Nom" },
  { en: "sample", fr: "échantillon", cat: "Nom" }, { en: "formula", fr: "formule", cat: "Nom" },
  { en: "logic", fr: "logique", cat: "Nom" }, { en: "observe", fr: "observer", cat: "Verbe" },
  { en: "examine", fr: "examiner", cat: "Verbe" }, { en: "compare", fr: "comparer", cat: "Verbe" },
  { en: "definition", fr: "définition", cat: "Nom" }, { en: "structure", fr: "structure", cat: "Nom" },
  { en: "element", fr: "élément", cat: "Nom" }, { en: "unit", fr: "unité", cat: "Nom" },
  { en: "scale", fr: "échelle / mesure", cat: "Nom" }, { en: "weight", fr: "poids", cat: "Nom" },
  { en: "to occur", fr: "se produire", cat: "Verbe" }, { en: "make sure", fr: "s'assurer", cat: "Expression" },
  { en: "smoothly", fr: "sans problème", cat: "Adverbe" }, { en: "instead", fr: "plutôt", cat: "Adverbe" },

  // LOT 24 : Modaux et Expressions
  { en: "can", fr: "pouvoir (capacité)", cat: "Modal" }, { en: "could", fr: "pouvoir (conditionnel/passé)", cat: "Modal" },
  { en: "will", fr: "volonté / futur", cat: "Modal" }, { en: "would", fr: "conditionnel", cat: "Modal" },
  { en: "should", fr: "devoir (conseil)", cat: "Modal" }, { en: "must", fr: "devoir (obligation)", cat: "Modal" },
  { en: "may", fr: "pouvoir (permission)", cat: "Modal" }, { en: "might", fr: "pouvoir (éventualité)", cat: "Modal" },
  { en: "shall", fr: "devoir (futur formel)", cat: "Modal" }, { en: "have to", fr: "devoir (obligation externe)", cat: "Expression" },
  { en: "used to", fr: "avoir l'habitude de (passé)", cat: "Expression" }, { en: "able to", fr: "capable de", cat: "Expression" },
  { en: "going to", fr: "aller (futur proche)", cat: "Expression" }, { en: "there is", fr: "il y a (singulier)", cat: "Expression" },
  { en: "there are", fr: "il y a (pluriel)", cat: "Expression" }, { en: "according to", fr: "selon", cat: "Expression" },
  { en: "in order to", fr: "afin de", cat: "Expression" }, { en: "as well as", fr: "ainsi que", cat: "Expression" },
  { en: "such as", fr: "tel que", cat: "Expression" }, { en: "at least", fr: "au moins", cat: "Expression" },
  { en: "at most", fr: "au maximum", cat: "Expression" }, { en: "in fact", fr: "en fait", cat: "Expression" },
  { en: "of course", fr: "bien sûr", cat: "Expression" }, { en: "for example", fr: "par exemple", cat: "Expression" },
  { en: "as soon as", fr: "dès que", cat: "Expression" }, { en: "as long as", fr: "tant que", cat: "Expression" },
  { en: "due to", fr: "en raison de", cat: "Expression" }, { en: "based on", fr: "basé sur", cat: "Expression" },
  { en: "all of us", fr: "nous tous", cat: "Expression" }, { en: "both of us", fr: "nous deux", cat: "Expression" },
  { en: "each other", fr: "l'un l'autre", cat: "Pronom" }, { en: "right now", fr: "tout de suite", cat: "Expression" },
  { en: "in the beginning", fr: "au début", cat: "Expression" }, { en: "at the end", fr: "à la fin", cat: "Expression" },
  { en: "instead of", fr: "au lieu de", cat: "Prep" }, { en: "because of", fr: "à cause de", cat: "Prep" },
  { en: "by the way", fr: "au fait", cat: "Expression" }, { en: "pay attention", fr: "faire attention", cat: "Expression" },
  { en: "no matter", fr: "peu importe", cat: "Expression" }, { en: "when it comes to", fr: "quand il s'agit de", cat: "Expression" },

  // LOT 25 : Relations sociales
  { en: "relationship", fr: "relation", cat: "Nom" }, { en: "marriage", fr: "mariage", cat: "Nom" },
  { en: "group", fr: "groupe", cat: "Nom" }, { en: "crowd", fr: "foule", cat: "Nom" },
  { en: "support", fr: "soutien / soutenir", cat: "Nom" }, { en: "trust", fr: "confiance", cat: "Nom" },
  { en: "respect", fr: "respect", cat: "Nom" }, { en: "date", fr: "rendez-vous amoureux", cat: "Nom" },
  { en: "hug", fr: "câlin", cat: "Nom" }, { en: "kiss", fr: "bisou / embrasser", cat: "Verbe" },
  { en: "invite", fr: "inviter", cat: "Verbe" }, { en: "polite", fr: "poli", cat: "Adjectif" },
  { en: "rude", fr: "impoli", cat: "Adjectif" }, { en: "generous", fr: "généreux", cat: "Adjectif" },
  { en: "selfish", fr: "égoïste", cat: "Adjectif" }, { en: "helpful", fr: "serviable / utile", cat: "Adjectif" },
  { en: "friendly", fr: "amical", cat: "Adjectif" }, { en: "attitude", fr: "attitude", cat: "Nom" },
  { en: "behavior", fr: "comportement", cat: "Nom" }, { en: "habit", fr: "habitude", cat: "Nom" },
  { en: "together", fr: "ensemble", cat: "Adverbe" }, { en: "alone", fr: "seul", cat: "Adjectif" },
  { en: "lonely", fr: "solitaire", cat: "Adjectif" }, { en: "somebody", fr: "quelqu'un", cat: "Pronom" },
  { en: "nobody", fr: "personne", cat: "Pronom" }, { en: "everybody", fr: "tout le monde", cat: "Pronom" },
  { en: "guest", fr: "invité", cat: "Nom" }, { en: "host", fr: "hôte", cat: "Nom" },
  { en: "member", fr: "membre", cat: "Nom" }, { en: "adult", fr: "adulte", cat: "Nom" },
  { en: "friendship", fr: "amitié", cat: "Nom" }, { en: "conflict", fr: "conflit", cat: "Nom" },
  { en: "themselves", fr: "eux-mêmes", cat: "Pronom" }, { en: "another", fr: "un autre", cat: "Adjectif" },
  { en: "sweetheart", fr: "chéri(e)", cat: "Nom" }, { en: "familiar", fr: "familier", cat: "Adjectif" },
  { en: "several", fr: "plusieurs", cat: "Adjectif" }, { en: "all of you", fr: "vous tous", cat: "Expression" },
  { en: "interested in", fr: "intéressé par", cat: "Expression" }, { en: "anyone", fr: "n'importe qui", cat: "Pronom" },

  // LOT 26 : Concepts abstraits
  { en: "idea", fr: "idée", cat: "Nom" }, { en: "thought", fr: "pensée", cat: "Nom" },
  { en: "mind", fr: "esprit", cat: "Nom" }, { en: "reason", fr: "raison", cat: "Nom" },
  { en: "purpose", fr: "but / objectif", cat: "Nom" }, { en: "truth", fr: "vérité", cat: "Nom" },
  { en: "point", fr: "point de vue", cat: "Nom" }, { en: "problem", fr: "problème", cat: "Nom" },
  { en: "issue", fr: "problème / sujet", cat: "Nom" }, { en: "outcome", fr: "issue / résultat", cat: "Nom" },
  { en: "impact", fr: "impact", cat: "Nom" }, { en: "chance", fr: "chance / opportunité", cat: "Nom" },
  { en: "risk", fr: "risque", cat: "Nom" }, { en: "possibility", fr: "possibilité", cat: "Nom" },
  { en: "choice", fr: "choix", cat: "Nom" }, { en: "option", fr: "option", cat: "Nom" },
  { en: "difference", fr: "différence", cat: "Nom" }, { en: "similarity", fr: "similitude", cat: "Nom" },
  { en: "change", fr: "changement", cat: "Nom" }, { en: "condition", fr: "condition", cat: "Nom" },
  { en: "situation", fr: "situation", cat: "Nom" }, { en: "state", fr: "état", cat: "Nom" },
  { en: "case", fr: "cas", cat: "Nom" }, { en: "example", fr: "exemple", cat: "Nom" },
  { en: "detail", fr: "détail", cat: "Nom" }, { en: "part", fr: "partie", cat: "Nom" },
  { en: "whole", fr: "tout / ensemble", cat: "Nom" }, { en: "bias", fr: "biais / préjugé", cat: "Nom" },
  { en: "overview", fr: "aperçu", cat: "Nom" }, { en: "motive", fr: "motif / intention", cat: "Nom" },
  { en: "concept", fr: "concept", cat: "Nom" }, { en: "aspect", fr: "aspect", cat: "Nom" },
  { en: "factor", fr: "facteur", cat: "Nom" }, { en: "context", fr: "contexte", cat: "Nom" },
  { en: "perspective", fr: "perspective", cat: "Nom" }, { en: "same thing", fr: "même chose", cat: "Nom" },
  { en: "whatever", fr: "quoi que ce soit / peu importe", cat: "Pronom" }, { en: "nothing", fr: "rien", cat: "Pronom" },
  { en: "everything", fr: "tout", cat: "Pronom" }, { en: "as much as", fr: "autant que", cat: "Expression" },

  // LOT 27 : Descriptions physiques
  { en: "tall", fr: "grand (hauteur)", cat: "Adjectif" }, { en: "fat", fr: "gros", cat: "Adjectif" },
  { en: "huge", fr: "énorme", cat: "Adjectif" }, { en: "tiny", fr: "minuscule", cat: "Adjectif" },
  { en: "large", fr: "grand / vaste", cat: "Adjectif" }, { en: "straight", fr: "droit / direct", cat: "Adjectif" },
  { en: "curved", fr: "courbé", cat: "Adjectif" }, { en: "sharp", fr: "tranchant / aigu", cat: "Adjectif" },
  { en: "dull", fr: "émoussé / terne", cat: "Adjectif" }, { en: "smooth", fr: "lisse", cat: "Adjectif" },
  { en: "rough", fr: "rugueux / brutal", cat: "Adjectif" }, { en: "hardened", fr: "durci", cat: "Adjectif" },
  { en: "handsome", fr: "beau (homme)", cat: "Adjectif" }, { en: "distance", fr: "distance", cat: "Nom" },
  { en: "height", fr: "hauteur / taille", cat: "Nom" }, { en: "appearance", fr: "apparence", cat: "Nom" },
  { en: "feature", fr: "trait / caractéristique", cat: "Nom" }, { en: "shape", fr: "forme", cat: "Nom" },
  { en: "pattern", fr: "motif / modèle", cat: "Nom" }, { en: "surface", fr: "surface", cat: "Nom" },
  { en: "solid", fr: "solide", cat: "Adjectif" }, { en: "liquid", fr: "liquide", cat: "Nom" },
  { en: "softness", fr: "douceur", cat: "Nom" }, { en: "depth", fr: "profondeur", cat: "Nom" },
  { en: "width", fr: "largeur", cat: "Nom" }, { en: "length", fr: "longueur", cat: "Nom" },
  { en: "blind", fr: "aveugle", cat: "Adjectif" }, { en: "deaf", fr: "sourd", cat: "Adjectif" },
  { en: "bald", fr: "chauve", cat: "Adjectif" }, { en: "slender", fr: "élancé", cat: "Adjectif" },
  { en: "muscular", fr: "musclé", cat: "Adjectif" }, { en: "pale", fr: "pâle", cat: "Adjectif" },
  { en: "tough", fr: "difficile", cat: "Adjectif" }, { en: "odd", fr: "étrange / impair", cat: "Adjectif" },
  { en: "stuck", fr: "coincé", cat: "Adjectif" }, { en: "unusual", fr: "inhabituel", cat: "Adjectif" },
  { en: "usual", fr: "habituel", cat: "Adjectif" }, { en: "most", fr: "la plupart", cat: "Pronom" },
  { en: "usually", fr: "généralement", cat: "Adverbe" }, { en: "definitely", fr: "certainement", cat: "Adverbe" },

  // LOT 28 : Verbes d'action élaborés
  { en: "to create", fr: "créer", cat: "Verbe" }, { en: "to build", fr: "construire", cat: "Verbe" },
  { en: "to destroy", fr: "détruire", cat: "Verbe" }, { en: "to break", fr: "casser", cat: "Verbe" },
  { en: "to fix", fr: "réparer", cat: "Verbe" }, { en: "to cut", fr: "couper", cat: "Verbe" },
  { en: "to lock", fr: "verrouiller", cat: "Verbe" }, { en: "to unlock", fr: "déverrouiller", cat: "Verbe" },
  { en: "to clean", fr: "nettoyer", cat: "Verbe" }, { en: "to wash", fr: "laver", cat: "Verbe" },
  { en: "to fill", fr: "remplir", cat: "Verbe" }, { en: "to empty", fr: "vider", cat: "Verbe" },
  { en: "to touch", fr: "toucher", cat: "Verbe" }, { en: "to hit", fr: "frapper", cat: "Verbe" },
  { en: "to press", fr: "appuyer", cat: "Verbe" }, { en: "to squeeze", fr: "presser / serrer", cat: "Verbe" },
  { en: "to fold", fr: "plier", cat: "Verbe" }, { en: "to mix", fr: "mélanger", cat: "Verbe" },
  { en: "to add", fr: "ajouter", cat: "Verbe" }, { en: "to remove", fr: "enlever", cat: "Verbe" },
  { en: "to replace", fr: "remplacer", cat: "Verbe" }, { en: "to separate", fr: "séparer", cat: "Verbe" },
  { en: "to collect", fr: "collecter", cat: "Verbe" }, { en: "to sort", fr: "trier", cat: "Verbe" },
  { en: "to hide", fr: "cacher", cat: "Verbe" }, { en: "to throw", fr: "lancer", cat: "Verbe" },
  { en: "to catch", fr: "attraper", cat: "Verbe" }, { en: "to lift", fr: "soulever", cat: "Verbe" },
  { en: "to drop", fr: "laisser tomber", cat: "Verbe" }, { en: "to lead", fr: "mener / diriger", cat: "Verbe" },
  { en: "to place", fr: "placer", cat: "Verbe" }, { en: "to cook", fr: "cuisiner", cat: "Verbe" },
  { en: "to drive", fr: "conduire", cat: "Verbe" }, { en: "to fly", fr: "voler (air)", cat: "Verbe" },
  { en: "to ride", fr: "monter (vélo/cheval)", cat: "Verbe" }, { en: "to swim", fr: "nager", cat: "Verbe" },
  { en: "to prepare", fr: "préparer", cat: "Verbe" }, { en: "got it", fr: "j'ai compris", cat: "Expression" },
  { en: "no way", fr: "certainement pas", cat: "Expression" }, { en: "something else", fr: "autre chose", cat: "Pronom" },

  // LOT 29 : Vocabulaire académique et Structuration
  { en: "to ensure", fr: "s'assurer de", cat: "Verbe" }, { en: "to allow", fr: "permettre", cat: "Verbe" },
  { en: "to prevent", fr: "empêcher", cat: "Verbe" }, { en: "to avoid", fr: "éviter", cat: "Verbe" },
  { en: "to require", fr: "exiger", cat: "Verbe" }, { en: "to involve", fr: "impliquer", cat: "Verbe" },
  { en: "to affect", fr: "affecter", cat: "Verbe" }, { en: "to influence", fr: "influencer", cat: "Verbe" },
  { en: "to improve", fr: "améliorer", cat: "Verbe" }, { en: "to enhance", fr: "renforcer / améliorer", cat: "Verbe" },
  { en: "to develop", fr: "développer", cat: "Verbe" }, { en: "to increase", fr: "augmenter", cat: "Verbe" },
  { en: "to decrease", fr: "diminuer", cat: "Verbe" }, { en: "to reduce", fr: "réduire", cat: "Verbe" },
  { en: "to produce", fr: "produire", cat: "Verbe" }, { en: "to achieve", fr: "atteindre un but", cat: "Verbe" },
  { en: "to reach", fr: "atteindre un lieu/seuil", cat: "Verbe" }, { en: "to protect", fr: "protéger", cat: "Verbe" },
  { en: "to accept", fr: "accepter", cat: "Verbe" }, { en: "to refuse", fr: "refuser", cat: "Verbe" },
  { en: "to match", fr: "correspondre", cat: "Verbe" }, { en: "to suit", fr: "convenir à", cat: "Verbe" },
  { en: "to launch", fr: "lancer", cat: "Verbe" }, { en: "to encounter", fr: "rencontrer un obstacle", cat: "Verbe" },
  { en: "to disrupt", fr: "perturber", cat: "Verbe" }, { en: "to rush", fr: "se précipiter", cat: "Verbe" },
  { en: "to gather", fr: "rassembler", cat: "Verbe" }, { en: "to allocate", fr: "attribuer", cat: "Verbe" },
  { en: "step", fr: "étape / pas", cat: "Nom" }, { en: "stage", fr: "stade / phase", cat: "Nom" },
  { en: "phase", fr: "phase", cat: "Nom" }, { en: "level", fr: "niveau", cat: "Nom" },
  { en: "workload", fr: "charge de travail", cat: "Nom" }, { en: "effective", fr: "efficace", cat: "Adjectif" },
  { en: "hectic", fr: "très chargé", cat: "Adjectif" }, { en: "contract", fr: "contrat", cat: "Nom" },
  { en: "deal", fr: "accord / affaire", cat: "Nom" }, { en: "anyway", fr: "de toute façon", cat: "Adverbe" },
  { en: "what's next", fr: "et ensuite", cat: "Expression" }, { en: "not really", fr: "pas vraiment", cat: "Expression" },

  // LOT 30 : Derniers essentiels et Nuances formelles
  { en: "decade", fr: "décennie", cat: "Nom" }, { en: "century", fr: "siècle", cat: "Nom" },
  { en: "calendar", fr: "calendrier", cat: "Nom" }, { en: "schedule", fr: "programme / planning", cat: "Nom" },
  { en: "deadline", fr: "date limite", cat: "Nom" }, { en: "daily", fr: "quotidien", cat: "Adjectif" },
  { en: "weekly", fr: "hebdomadaire", cat: "Adjectif" }, { en: "monthly", fr: "mensuel", cat: "Adjectif" },
  { en: "yearly", fr: "annuel", cat: "Adjectif" }, { en: "recent", fr: "récent", cat: "Adjectif" },
  { en: "recently", fr: "récemment", cat: "Adverbe" }, { en: "lately", fr: "dernièrement", cat: "Adverbe" },
  { en: "upcoming", fr: "à venir", cat: "Adjectif" }, { en: "ongoing", fr: "en cours", cat: "Adjectif" },
  { en: "temporary", fr: "temporaire", cat: "Adjectif" }, { en: "permanent", fr: "permanent", cat: "Adjectif" },
  { en: "forever", fr: "pour toujours", cat: "Adverbe" }, { en: "meanwhile", fr: "pendant ce temps", cat: "Adverbe" },
  { en: "eventually", fr: "finalement / à terme", cat: "Adverbe" }, { en: "finally", fr: "enfin", cat: "Adverbe" },
  { en: "suddenly", fr: "soudain", cat: "Adverbe" }, { en: "immediately", fr: "immédiatement", cat: "Adverbe" },
  { en: "time-consuming", fr: "chronophage", cat: "Adjectif" }, { en: "likely", fr: "probable", cat: "Adjectif" },
  { en: "unlikely", fr: "peu probable", cat: "Adjectif" }, { en: "straightforward", fr: "simple et direct", cat: "Adjectif" },
  { en: "hands-on", fr: "pratique / de terrain", cat: "Adjectif" }, { en: "overall", fr: "dans l'ensemble", cat: "Adverbe" },
  { en: "effectively", fr: "efficacement", cat: "Adverbe" }, { en: "carefully", fr: "attentivement", cat: "Adverbe" },
  { en: "forward", fr: "en avant", cat: "Adverbe" }, { en: "furthermore", fr: "de plus", cat: "Adverbe" },
  { en: "moreover", fr: "de plus", cat: "Adverbe" }, { en: "nevertheless", fr: "néanmoins", cat: "Adverbe" },
  { en: "otherwise", fr: "sinon", cat: "Adverbe" }, { en: "unless", fr: "à moins que", cat: "Conjonction" },
  { en: "indeed", fr: "en effet", cat: "Adverbe" }, { en: "strongly agree", fr: "être tout à fait d'accord", cat: "Expression" },
  { en: "for a while", fr: "pendant un moment", cat: "Expression" }, { en: "alright", fr: "d'accord / très bien", cat: "Autre" }
];

const catColors: Record<string, string> = {
  "Verbe": "#3B82F6", "Nom": "#10B981", "Adjectif": "#F59E0B", "Adverbe": "#8B5CF6",
  "Pronom": "#EF4444", "Prep": "#EC4899", "Conjonction": "#14B8A6", "Modal": "#F97316",
  "Expression": "#6366F1", "Question": "#84CC16", "Possessif": "#06B6D4", "Nombre": "#A855F7",
  "Autre": "#6B7280",
};

export default function WordsTab() {
  const [currentLot, setCurrentLot] = useState<number>(() => loadFromStorage(STORAGE_KEYS.currentLot, 0));
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [learned, setLearned] = useState<Record<string, boolean>>(() => loadFromStorage(STORAGE_KEYS.learnedWords, {}));
  const [view, setView] = useState("list");
  const [cardIndex, setCardIndex] = useState(0);
  const [showFr, setShowFr] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.currentLot, currentLot);
  }, [currentLot]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.learnedWords, learned);
  }, [learned]);

  const getLotWords = (idx: number) => allWords.slice(idx * WORDS_PER_LOT, (idx + 1) * WORDS_PER_LOT);
  const words = getLotWords(currentLot);
  const lotKey = "lot" + currentLot;

  const toggleFlip = (i: number) => setFlipped(f => ({ ...f, [lotKey + "-" + i]: !f[lotKey + "-" + i] }));
  const toggleLearned = (i: number) => setLearned(l => ({ ...l, [lotKey + "-" + i]: !l[lotKey + "-" + i] }));

  const speakWord = (word: { en: string; fr: string }) => {
    stopSpeech();
    speakSequence([
      { text: word.en, lang: "en-US" },
      { text: word.fr, lang: "fr-FR" },
    ]);
  };

  const learnedCount = words.filter((_, i) => learned[lotKey + "-" + i]).length;
  const totalLearned = Object.values(learned).filter(Boolean).length;

  const filteredWords = search
    ? allWords.filter(w => w.en.toLowerCase().includes(search.toLowerCase()) || w.fr.toLowerCase().includes(search.toLowerCase()))
    : words;

  return (
    <div>
      <div style={{ padding: "20px 0", borderBottom: "1px solid #1E293B" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <CiBoxList style={{ color: "#38BDF8" }} /> Onglet Mots
            </h2>
            <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#94A3B8" }}>
              Liste des mots, verbes, et petites expression de tout les jours pour commencer avec l'anglais.
            </p>
          </div>
          <div style={{ width: "100%", maxWidth: "560px" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#94A3B8" }}>
              {totalLearned} / {allWords.length} mots appris au total
            </p>
            <div style={{ marginTop: "8px", width: "100%", background: "#1E293B", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
              <div style={{ width: (totalLearned / allWords.length * 100) + "%", background: "#3B82F6", height: "100%", borderRadius: "4px", transition: "width 0.3s" }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 0", borderBottom: "1px solid #1E293B" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaSearch style={{ color: "#94A3B8", minWidth: "18px" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un mot en anglais ou francais..."
            style={{ width: "100%", boxSizing: "border-box", background: "#1E293B", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "#E2E8F0", fontSize: "14px", outline: "none" }} />
        </div>
      </div>

      {search ? (
        <div style={{ padding: "16px 0" }}>
          <p style={{ color: "#94A3B8", fontSize: "13px", marginTop: 0 }}>{filteredWords.length} resultat(s)</p>
          {filteredWords.map((w, i) => (
            <div key={i} style={{ background: "#1E293B", borderRadius: "10px", padding: "12px 14px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: "16px", color: "#F1F5F9" }}>{w.en}</span>
                <span style={{ marginLeft: "10px", fontSize: "13px", color: "#94A3B8", display: "inline-flex", alignItems: "center", gap: "6px" }}><FaArrowRight /> {w.fr}</span>
              </div>
              <span style={{ background: catColors[w.cat] || "#6B7280", color: "#fff", fontSize: "10px", padding: "2px 8px", borderRadius: "99px", fontWeight: 600, flexShrink: 0 }}>{w.cat}</span>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div style={{ padding: "16px 0", overflowX: "auto", display: "flex", gap: "8px", borderBottom: "1px solid #1E293B" }}>
            {Array.from({ length: TOTAL_LOTS }, (_, i) => {
              const lw = getLotWords(i);
              const ll = lw.filter((_, j) => learned["lot" + i + "-" + j]).length;
              const done = ll === WORDS_PER_LOT;
              return (
                <button key={i} onClick={() => { setCurrentLot(i); setCardIndex(0); setShowFr(false); setFlipped({}); }}
                  style={{ flexShrink: 0, background: currentLot === i ? "#3B82F6" : done ? "#10B981" : "#1E293B", border: "none", borderRadius: "8px", padding: "8px 12px", color: currentLot === i || done ? "#fff" : "#94A3B8", fontSize: "13px", fontWeight: currentLot === i ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  Jour {i + 1} {done ? <FaCheck /> : ll > 0 ? "(" + ll + "/" + WORDS_PER_LOT + ")" : ""}
                </button>
              );
            })}
          </div>

          <div style={{ padding: "16px 0 8px" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#F1F5F9" }}>
              Jour {currentLot + 1} — {lotTitles[currentLot]}
            </h3>
            <p style={{ margin: "4px 0 12px", fontSize: "13px", color: "#64748B" }}>
              {learnedCount}/{WORDS_PER_LOT} appris
            </p>
            <div style={{ background: "#1E293B", borderRadius: "4px", height: "4px", overflow: "hidden" }}>
              <div style={{ width: (learnedCount / WORDS_PER_LOT * 100) + "%", background: "#10B981", height: "100%", transition: "width 0.3s" }} />
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <button onClick={() => setView("list")} style={{ flex: 1, background: view === "list" ? "#3B82F6" : "#1E293B", border: "none", borderRadius: "8px", padding: "8px", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: view === "list" ? 700 : 400, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <FaListUl /> Liste
              </button>
              <button onClick={() => { setView("cards"); setCardIndex(0); setShowFr(false); }} style={{ flex: 1, background: view === "cards" ? "#3B82F6" : "#1E293B", border: "none", borderRadius: "8px", padding: "8px", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: view === "cards" ? 700 : 400, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <FaThLarge /> Cartes
              </button>
            </div>
          </div>

          {view === "list" ? (
            <div style={{ padding: "0 0 80px" }}>
              {words.map((w, i) => {
                const isF = flipped[lotKey + "-" + i];
                const isD = learned[lotKey + "-" + i];
                return (
                  <div key={i} onClick={() => toggleFlip(i)} style={{ background: isD ? "#052e16" : "#1E293B", border: "1px solid " + (isD ? "#10B981" : "#334155"), borderRadius: "10px", padding: "12px 14px", marginBottom: "8px", cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "12px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                        <span style={{ fontWeight: 700, fontSize: "16px", color: isD ? "#4ADE80" : "#F1F5F9" }}>
                          {w.en} {  }
                          <span style={{ background: catColors[w.cat] || "#6B7280", color: "#fff", fontSize: "10px", padding: "2px 7px", borderRadius: "99px", fontWeight: 600 }}>{w.cat}</span>
                        </span>
                        {isF && <div style={{ marginTop: "6px", fontSize: "14px", color: "#94A3B8", display: "inline-flex", alignItems: "center", gap: "6px" }}>🇫🇷 {w.fr}</div>}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", justifyContent: "flex-end" }}>
                        <button 
                          onClick={e => { e.stopPropagation(); toggleLearned(i); }} 
                          style={{ background: isD ? "#10B981" : "#334155", border: "none", borderRadius: "6px", padding: "4px 8px", color: "#fff", fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                        >
                          {isD ? <FaCheck /> : <FaRegCircle />}
                        </button>
                        <button
                          type="button"
                          style={{ background: "#334155", border: "none", borderRadius: "6px", padding: "4px 8px", color: "#fff", fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                          onClick={(e) => { e.stopPropagation(); speakWord(w); }}
                        >
                          <FaVolumeUp />
                        </button>
                      </div>
                    </div>
                    {!isF && <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>Appuie pour voir la traduction</div>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: "20px 0 80px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <p style={{ color: "#64748B", fontSize: "13px", marginTop: 0 }}>{cardIndex + 1} / {WORDS_PER_LOT}</p>
              <div onClick={() => setShowFr(s => !s)} style={{ width: "100%", maxWidth: "360px", minHeight: "200px", background: showFr ? "#1E3A5F" : "#1E293B", border: "2px solid " + (showFr ? "#3B82F6" : "#334155"), borderRadius: "16px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", cursor: "pointer", padding: "24px", textAlign: "center", transition: "all 0.3s", boxSizing: "border-box" }}>
                {!showFr ? (
                  <>
                    <div style={{ fontSize: "32px", fontWeight: 800, color: "#F1F5F9", marginBottom: "8px" }}>{words[cardIndex].en}</div>
                    <span style={{ background: catColors[words[cardIndex].cat] || "#6B7280", color: "#fff", fontSize: "11px", padding: "3px 10px", borderRadius: "99px", fontWeight: 600 }}>{words[cardIndex].cat}</span>
                    <p style={{ color: "#64748B", fontSize: "12px", marginTop: "16px" }}>Appuie pour voir la traduction</p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: "28px", fontWeight: 800, color: "#F1F5F9", marginBottom: "10px" }}>{words[cardIndex].en}</div>
                    <div style={{ fontSize: "28px", fontWeight: 800, color: "#60A5FA" }}>🇫🇷 {words[cardIndex].fr}</div>
                  </>
                )}
              </div>
              {showFr && (
                <>
                  <div style={{ display: "flex", gap: "12px", marginTop: "16px", width: "100%", maxWidth: "360px" }}>
                    <button onClick={() => { toggleLearned(cardIndex); setShowFr(false); if (cardIndex < WORDS_PER_LOT - 1) setCardIndex(c => c + 1); }} style={{ flex: 1, background: "#10B981", border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><FaCheck /> Je sais</button>
                    <button onClick={() => { setShowFr(false); if (cardIndex < WORDS_PER_LOT - 1) setCardIndex(c => c + 1); }} style={{ flex: 1, background: "#EF4444", border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><FaTimes /> A revoir</button>
                  </div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); speakWord(words[cardIndex]); }} style={{ width: "100%", maxWidth: "360px", background: "#334155", border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "12px" }}><FaVolumeUp /> Son</button>
                </>
              )}
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <button onClick={() => { setCardIndex(c => Math.max(0, c - 1)); setShowFr(false); }} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "8px", padding: "8px 16px", color: "#94A3B8", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}><FaArrowLeft /> Prec</button>
                <button onClick={() => { setCardIndex(c => Math.min(WORDS_PER_LOT - 1, c + 1)); setShowFr(false); }} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "8px", padding: "8px 16px", color: "#94A3B8", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>Suiv <FaArrowRight /></button>
              </div>
              <div style={{ display: "flex", gap: "4px", marginTop: "16px", flexWrap: "wrap", justifyContent: "center", maxWidth: "360px" }}>
                {words.map((_, i) => (
                  <div key={i} onClick={() => { setCardIndex(i); setShowFr(false); }}
                    style={{ width: "8px", height: "8px", borderRadius: "50%", cursor: "pointer", background: learned[lotKey + "-" + i] ? "#10B981" : i === cardIndex ? "#3B82F6" : "#334155" }} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
