import { useEffect, useState } from "react";
import { FaSearch, FaListUl, FaThLarge, FaCheck, FaRegCircle, FaTimes, FaArrowLeft, FaArrowRight, FaVolumeUp } from "react-icons/fa";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/storage";
import { speakSequence, stopSpeech } from "../utils/speech";

const allWords = [
  // LOT 1
  { en: "I", fr: "je", cat: "Pronom" }, { en: "you", fr: "tu / vous", cat: "Pronom" },
  { en: "he", fr: "il", cat: "Pronom" }, { en: "she", fr: "elle", cat: "Pronom" },
  { en: "we", fr: "nous", cat: "Pronom" }, { en: "they", fr: "ils / elles", cat: "Pronom" },
  { en: "it", fr: "il / elle (neutre)", cat: "Pronom" }, { en: "my", fr: "mon / ma", cat: "Possessif" },
  { en: "your", fr: "ton / votre", cat: "Possessif" }, { en: "his", fr: "son (masc.)", cat: "Possessif" },
  { en: "her", fr: "son (fém.)", cat: "Possessif" }, { en: "our", fr: "notre", cat: "Possessif" },
  { en: "their", fr: "leur", cat: "Possessif" }, { en: "man", fr: "homme", cat: "Nom" },
  { en: "woman", fr: "femme", cat: "Nom" }, { en: "child", fr: "enfant", cat: "Nom" },
  { en: "boy", fr: "garçon", cat: "Nom" }, { en: "girl", fr: "fille", cat: "Nom" },
  { en: "baby", fr: "bébé", cat: "Nom" }, { en: "friend", fr: "ami(e)", cat: "Nom" },
  { en: "family", fr: "famille", cat: "Nom" }, { en: "mother", fr: "mère", cat: "Nom" },
  { en: "father", fr: "père", cat: "Nom" }, { en: "sister", fr: "soeur", cat: "Nom" },
  { en: "brother", fr: "frère", cat: "Nom" }, { en: "people", fr: "gens / personnes", cat: "Nom" },
  { en: "person", fr: "personne", cat: "Nom" }, { en: "name", fr: "nom / prénom", cat: "Nom" },
  { en: "age", fr: "âge", cat: "Nom" }, { en: "life", fr: "vie", cat: "Nom" },
  { en: "world", fr: "monde", cat: "Nom" }, { en: "country", fr: "pays", cat: "Nom" },
  { en: "city", fr: "ville", cat: "Nom" },
  // LOT 2
  { en: "to be", fr: "être", cat: "Verbe" }, { en: "to have", fr: "avoir", cat: "Verbe" },
  { en: "to do", fr: "faire", cat: "Verbe" }, { en: "to say", fr: "dire", cat: "Verbe" },
  { en: "to go", fr: "aller", cat: "Verbe" }, { en: "to get", fr: "obtenir / devenir", cat: "Verbe" },
  { en: "to make", fr: "faire / créer", cat: "Verbe" }, { en: "to know", fr: "savoir / connaître", cat: "Verbe" },
  { en: "to think", fr: "penser", cat: "Verbe" }, { en: "to come", fr: "venir", cat: "Verbe" },
  { en: "to take", fr: "prendre", cat: "Verbe" }, { en: "to see", fr: "voir", cat: "Verbe" },
  { en: "to want", fr: "vouloir", cat: "Verbe" }, { en: "to look", fr: "regarder / chercher", cat: "Verbe" },
  { en: "to use", fr: "utiliser", cat: "Verbe" }, { en: "to find", fr: "trouver", cat: "Verbe" },
  { en: "to give", fr: "donner", cat: "Verbe" }, { en: "to tell", fr: "raconter / dire", cat: "Verbe" },
  { en: "to work", fr: "travailler", cat: "Verbe" }, { en: "to call", fr: "appeler", cat: "Verbe" },
  { en: "to ask", fr: "demander", cat: "Verbe" }, { en: "to need", fr: "avoir besoin de", cat: "Verbe" },
  { en: "to feel", fr: "ressentir", cat: "Verbe" }, { en: "to try", fr: "essayer", cat: "Verbe" },
  { en: "to leave", fr: "partir / quitter", cat: "Verbe" }, { en: "to put", fr: "mettre / poser", cat: "Verbe" },
  { en: "to mean", fr: "signifier / vouloir dire", cat: "Verbe" }, { en: "to keep", fr: "garder", cat: "Verbe" },
  { en: "to let", fr: "laisser / permettre", cat: "Verbe" }, { en: "to begin", fr: "commencer", cat: "Verbe" },
  { en: "to show", fr: "montrer", cat: "Verbe" }, { en: "to hear", fr: "entendre", cat: "Verbe" },
  { en: "to play", fr: "jouer", cat: "Verbe" },
  // LOT 3
  { en: "to run", fr: "courir", cat: "Verbe" }, { en: "to move", fr: "bouger / déménager", cat: "Verbe" },
  { en: "to live", fr: "vivre / habiter", cat: "Verbe" }, { en: "to believe", fr: "croire", cat: "Verbe" },
  { en: "to hold", fr: "tenir / garder", cat: "Verbe" }, { en: "to bring", fr: "apporter", cat: "Verbe" },
  { en: "to happen", fr: "se passer / arriver", cat: "Verbe" }, { en: "to write", fr: "écrire", cat: "Verbe" },
  { en: "to provide", fr: "fournir", cat: "Verbe" }, { en: "to sit", fr: "s'asseoir", cat: "Verbe" },
  { en: "to stand", fr: "se tenir debout", cat: "Verbe" }, { en: "to lose", fr: "perdre", cat: "Verbe" },
  { en: "to pay", fr: "payer", cat: "Verbe" }, { en: "to meet", fr: "rencontrer", cat: "Verbe" },
  { en: "to include", fr: "inclure", cat: "Verbe" }, { en: "to continue", fr: "continuer", cat: "Verbe" },
  { en: "to set", fr: "régler / établir", cat: "Verbe" }, { en: "to learn", fr: "apprendre", cat: "Verbe" },
  { en: "to change", fr: "changer", cat: "Verbe" }, { en: "to lead", fr: "mener / diriger", cat: "Verbe" },
  { en: "to understand", fr: "comprendre", cat: "Verbe" }, { en: "to watch", fr: "regarder (fixer)", cat: "Verbe" },
  { en: "to follow", fr: "suivre", cat: "Verbe" }, { en: "to stop", fr: "arrêter", cat: "Verbe" },
  { en: "to create", fr: "créer", cat: "Verbe" }, { en: "to speak", fr: "parler", cat: "Verbe" },
  { en: "to read", fr: "lire", cat: "Verbe" }, { en: "to spend", fr: "dépenser / passer (temps)", cat: "Verbe" },
  { en: "to grow", fr: "grandir / pousser", cat: "Verbe" }, { en: "to open", fr: "ouvrir", cat: "Verbe" },
  { en: "to walk", fr: "marcher", cat: "Verbe" }, { en: "to win", fr: "gagner", cat: "Verbe" },
  { en: "to offer", fr: "offrir / proposer", cat: "Verbe" },
  // LOT 4
  { en: "one", fr: "un", cat: "Nombre" }, { en: "two", fr: "deux", cat: "Nombre" },
  { en: "three", fr: "trois", cat: "Nombre" }, { en: "four", fr: "quatre", cat: "Nombre" },
  { en: "five", fr: "cinq", cat: "Nombre" }, { en: "ten", fr: "dix", cat: "Nombre" },
  { en: "hundred", fr: "cent", cat: "Nombre" }, { en: "thousand", fr: "mille", cat: "Nombre" },
  { en: "first", fr: "premier", cat: "Nombre" }, { en: "second", fr: "deuxième", cat: "Nombre" },
  { en: "last", fr: "dernier", cat: "Adjectif" }, { en: "time", fr: "temps / fois", cat: "Nom" },
  { en: "year", fr: "année / an", cat: "Nom" }, { en: "day", fr: "jour", cat: "Nom" },
  { en: "week", fr: "semaine", cat: "Nom" }, { en: "month", fr: "mois", cat: "Nom" },
  { en: "hour", fr: "heure", cat: "Nom" }, { en: "minute", fr: "minute", cat: "Nom" },
  { en: "morning", fr: "matin", cat: "Nom" }, { en: "afternoon", fr: "après-midi", cat: "Nom" },
  { en: "evening", fr: "soir", cat: "Nom" }, { en: "night", fr: "nuit", cat: "Nom" },
  { en: "today", fr: "aujourd'hui", cat: "Adverbe" }, { en: "tomorrow", fr: "demain", cat: "Adverbe" },
  { en: "yesterday", fr: "hier", cat: "Adverbe" }, { en: "now", fr: "maintenant", cat: "Adverbe" },
  { en: "then", fr: "alors / ensuite", cat: "Adverbe" }, { en: "soon", fr: "bientôt", cat: "Adverbe" },
  { en: "always", fr: "toujours", cat: "Adverbe" }, { en: "never", fr: "jamais", cat: "Adverbe" },
  { en: "often", fr: "souvent", cat: "Adverbe" }, { en: "sometimes", fr: "parfois", cat: "Adverbe" },
  { en: "already", fr: "déjà", cat: "Adverbe" },
  // LOT 5
  { en: "what", fr: "quoi / quel", cat: "Question" }, { en: "who", fr: "qui", cat: "Question" },
  { en: "where", fr: "où", cat: "Question" }, { en: "when", fr: "quand", cat: "Question" },
  { en: "why", fr: "pourquoi", cat: "Question" }, { en: "how", fr: "comment", cat: "Question" },
  { en: "which", fr: "lequel / quel", cat: "Question" }, { en: "and", fr: "et", cat: "Conjonction" },
  { en: "or", fr: "ou (choix)", cat: "Conjonction" }, { en: "but", fr: "mais", cat: "Conjonction" },
  { en: "because", fr: "parce que", cat: "Conjonction" }, { en: "if", fr: "si", cat: "Conjonction" },
  { en: "so", fr: "donc / alors", cat: "Conjonction" }, { en: "that", fr: "que / ce / ça", cat: "Conjonction" },
  { en: "while", fr: "pendant que / tandis que", cat: "Conjonction" },
  { en: "although", fr: "bien que / même si", cat: "Conjonction" },
  { en: "however", fr: "cependant / pourtant", cat: "Adverbe" },
  { en: "therefore", fr: "donc / par conséquent", cat: "Adverbe" },
  { en: "also", fr: "aussi / également", cat: "Adverbe" }, { en: "still", fr: "encore / toujours", cat: "Adverbe" },
  { en: "just", fr: "juste / seulement", cat: "Adverbe" }, { en: "even", fr: "même", cat: "Adverbe" },
  { en: "only", fr: "seulement", cat: "Adverbe" }, { en: "very", fr: "très", cat: "Adverbe" },
  { en: "too", fr: "trop / aussi", cat: "Adverbe" }, { en: "quite", fr: "assez / plutôt", cat: "Adverbe" },
  { en: "really", fr: "vraiment", cat: "Adverbe" }, { en: "almost", fr: "presque", cat: "Adverbe" },
  { en: "again", fr: "encore / à nouveau", cat: "Adverbe" }, { en: "maybe", fr: "peut-être", cat: "Adverbe" },
  { en: "perhaps", fr: "peut-être", cat: "Adverbe" }, { en: "yes", fr: "oui", cat: "Autre" },
  { en: "no", fr: "non", cat: "Autre" },
  // LOT 6
  { en: "good", fr: "bon / bien", cat: "Adjectif" }, { en: "bad", fr: "mauvais", cat: "Adjectif" },
  { en: "big", fr: "grand / gros", cat: "Adjectif" }, { en: "small", fr: "petit", cat: "Adjectif" },
  { en: "long", fr: "long", cat: "Adjectif" }, { en: "short", fr: "court / petit (taille)", cat: "Adjectif" },
  { en: "new", fr: "nouveau", cat: "Adjectif" }, { en: "old", fr: "vieux / ancien", cat: "Adjectif" },
  { en: "high", fr: "haut / élevé", cat: "Adjectif" }, { en: "low", fr: "bas / faible", cat: "Adjectif" },
  { en: "right", fr: "correct / droit", cat: "Adjectif" }, { en: "wrong", fr: "faux / incorrect", cat: "Adjectif" },
  { en: "true", fr: "vrai", cat: "Adjectif" }, { en: "false", fr: "faux", cat: "Adjectif" },
  { en: "easy", fr: "facile", cat: "Adjectif" }, { en: "hard", fr: "difficile / dur", cat: "Adjectif" },
  { en: "fast", fr: "rapide", cat: "Adjectif" }, { en: "slow", fr: "lent", cat: "Adjectif" },
  { en: "hot", fr: "chaud", cat: "Adjectif" }, { en: "cold", fr: "froid", cat: "Adjectif" },
  { en: "full", fr: "plein", cat: "Adjectif" }, { en: "empty", fr: "vide", cat: "Adjectif" },
  { en: "open", fr: "ouvert", cat: "Adjectif" }, { en: "closed", fr: "fermé", cat: "Adjectif" },
  { en: "free", fr: "libre / gratuit", cat: "Adjectif" }, { en: "busy", fr: "occupé", cat: "Adjectif" },
  { en: "ready", fr: "prêt", cat: "Adjectif" }, { en: "sure", fr: "sûr / certain", cat: "Adjectif" },
  { en: "happy", fr: "heureux", cat: "Adjectif" }, { en: "sad", fr: "triste", cat: "Adjectif" },
  { en: "angry", fr: "en colère", cat: "Adjectif" }, { en: "tired", fr: "fatigué", cat: "Adjectif" },
  { en: "afraid", fr: "effrayé / apeuré", cat: "Adjectif" },
  // LOT 7
  { en: "beautiful", fr: "beau / belle", cat: "Adjectif" }, { en: "ugly", fr: "laid", cat: "Adjectif" },
  { en: "clean", fr: "propre", cat: "Adjectif" }, { en: "dirty", fr: "sale", cat: "Adjectif" },
  { en: "safe", fr: "sûr / en sécurité", cat: "Adjectif" }, { en: "dangerous", fr: "dangereux", cat: "Adjectif" },
  { en: "important", fr: "important", cat: "Adjectif" }, { en: "necessary", fr: "nécessaire", cat: "Adjectif" },
  { en: "possible", fr: "possible", cat: "Adjectif" }, { en: "impossible", fr: "impossible", cat: "Adjectif" },
  { en: "different", fr: "différent", cat: "Adjectif" }, { en: "same", fr: "même / pareil", cat: "Adjectif" },
  { en: "similar", fr: "similaire", cat: "Adjectif" }, { en: "next", fr: "prochain / suivant", cat: "Adjectif" },
  { en: "other", fr: "autre", cat: "Adjectif" }, { en: "more", fr: "plus / davantage", cat: "Adjectif" },
  { en: "less", fr: "moins", cat: "Adjectif" }, { en: "much", fr: "beaucoup (indénombrable)", cat: "Adjectif" },
  { en: "many", fr: "beaucoup (dénombrable)", cat: "Adjectif" }, { en: "few", fr: "peu (dénombrable)", cat: "Adjectif" },
  { en: "little", fr: "peu (indénombrable)", cat: "Adjectif" }, { en: "every", fr: "chaque / tout", cat: "Adjectif" },
  { en: "all", fr: "tout / tous", cat: "Adjectif" }, { en: "some", fr: "quelques / un peu de", cat: "Adjectif" },
  { en: "any", fr: "n'importe quel / des", cat: "Adjectif" }, { en: "each", fr: "chaque", cat: "Adjectif" },
  { en: "both", fr: "les deux", cat: "Adjectif" }, { en: "enough", fr: "assez / suffisant", cat: "Adjectif" },
  { en: "special", fr: "spécial", cat: "Adjectif" }, { en: "certain", fr: "certain", cat: "Adjectif" },
  { en: "whole", fr: "entier / tout", cat: "Adjectif" }, { en: "able", fr: "capable", cat: "Adjectif" },
  { en: "perfect", fr: "parfait", cat: "Adjectif" },
  // LOT 8
  { en: "here", fr: "ici", cat: "Adverbe" }, { en: "there", fr: "là / là-bas", cat: "Adverbe" },
  { en: "up", fr: "en haut", cat: "Adverbe" }, { en: "down", fr: "en bas", cat: "Adverbe" },
  { en: "in", fr: "dans / en", cat: "Prep" }, { en: "out", fr: "dehors", cat: "Prep" },
  { en: "on", fr: "sur", cat: "Prep" }, { en: "off", fr: "hors de / éteint", cat: "Prep" },
  { en: "at", fr: "à / chez", cat: "Prep" }, { en: "to", fr: "à / vers", cat: "Prep" },
  { en: "from", fr: "de / depuis", cat: "Prep" }, { en: "of", fr: "de", cat: "Prep" },
  { en: "with", fr: "avec", cat: "Prep" }, { en: "without", fr: "sans", cat: "Prep" },
  { en: "for", fr: "pour / depuis", cat: "Prep" }, { en: "by", fr: "par / près de", cat: "Prep" },
  { en: "about", fr: "à propos de / environ", cat: "Prep" },
  { en: "between", fr: "entre (deux)", cat: "Prep" }, { en: "among", fr: "parmi (plusieurs)", cat: "Prep" },
  { en: "over", fr: "au-dessus / plus de", cat: "Prep" }, { en: "under", fr: "sous", cat: "Prep" },
  { en: "before", fr: "avant", cat: "Prep" }, { en: "after", fr: "après", cat: "Prep" },
  { en: "during", fr: "pendant", cat: "Prep" }, { en: "through", fr: "à travers / par", cat: "Prep" },
  { en: "near", fr: "près de", cat: "Prep" }, { en: "far", fr: "loin", cat: "Adjectif" },
  { en: "inside", fr: "à l'intérieur", cat: "Adverbe" }, { en: "outside", fr: "à l'extérieur", cat: "Adverbe" },
  { en: "left", fr: "gauche", cat: "Nom" }, { en: "right", fr: "droite", cat: "Nom" },
  { en: "front", fr: "devant / avant", cat: "Nom" }, { en: "back", fr: "derrière / arrière", cat: "Nom" },
  // LOT 9
  { en: "body", fr: "corps", cat: "Nom" }, { en: "head", fr: "tête", cat: "Nom" },
  { en: "face", fr: "visage", cat: "Nom" }, { en: "eye", fr: "oeil / yeux", cat: "Nom" },
  { en: "ear", fr: "oreille", cat: "Nom" }, { en: "nose", fr: "nez", cat: "Nom" },
  { en: "mouth", fr: "bouche", cat: "Nom" }, { en: "hair", fr: "cheveux", cat: "Nom" },
  { en: "hand", fr: "main", cat: "Nom" }, { en: "arm", fr: "bras", cat: "Nom" },
  { en: "leg", fr: "jambe", cat: "Nom" }, { en: "foot", fr: "pied", cat: "Nom" },
  { en: "heart", fr: "coeur", cat: "Nom" }, { en: "back", fr: "dos", cat: "Nom" },
  { en: "skin", fr: "peau", cat: "Nom" }, { en: "blood", fr: "sang", cat: "Nom" },
  { en: "brain", fr: "cerveau", cat: "Nom" }, { en: "stomach", fr: "estomac / ventre", cat: "Nom" },
  { en: "finger", fr: "doigt", cat: "Nom" }, { en: "knee", fr: "genou", cat: "Nom" },
  { en: "shoulder", fr: "épaule", cat: "Nom" }, { en: "neck", fr: "cou", cat: "Nom" },
  { en: "tooth", fr: "dent", cat: "Nom" }, { en: "lip", fr: "lèvre", cat: "Nom" },
  { en: "tongue", fr: "langue", cat: "Nom" }, { en: "throat", fr: "gorge", cat: "Nom" },
  { en: "chest", fr: "poitrine", cat: "Nom" }, { en: "bone", fr: "os", cat: "Nom" },
  { en: "muscle", fr: "muscle", cat: "Nom" }, { en: "lung", fr: "poumon", cat: "Nom" },
  { en: "pain", fr: "douleur", cat: "Nom" }, { en: "health", fr: "santé", cat: "Nom" },
  { en: "sick", fr: "malade", cat: "Adjectif" },
  // LOT 10
  { en: "house", fr: "maison", cat: "Nom" }, { en: "home", fr: "chez soi / foyer", cat: "Nom" },
  { en: "room", fr: "pièce / chambre", cat: "Nom" }, { en: "door", fr: "porte", cat: "Nom" },
  { en: "window", fr: "fenêtre", cat: "Nom" }, { en: "floor", fr: "sol / étage", cat: "Nom" },
  { en: "wall", fr: "mur", cat: "Nom" }, { en: "roof", fr: "toit", cat: "Nom" },
  { en: "kitchen", fr: "cuisine", cat: "Nom" }, { en: "bedroom", fr: "chambre à coucher", cat: "Nom" },
  { en: "bathroom", fr: "salle de bain", cat: "Nom" }, { en: "table", fr: "table", cat: "Nom" },
  { en: "chair", fr: "chaise", cat: "Nom" }, { en: "bed", fr: "lit", cat: "Nom" },
  { en: "key", fr: "clé", cat: "Nom" }, { en: "phone", fr: "téléphone", cat: "Nom" },
  { en: "computer", fr: "ordinateur", cat: "Nom" }, { en: "book", fr: "livre", cat: "Nom" },
  { en: "paper", fr: "papier", cat: "Nom" }, { en: "pen", fr: "stylo", cat: "Nom" },
  { en: "bag", fr: "sac", cat: "Nom" }, { en: "box", fr: "boîte", cat: "Nom" },
  { en: "light", fr: "lumière", cat: "Nom" }, { en: "money", fr: "argent", cat: "Nom" },
  { en: "card", fr: "carte", cat: "Nom" }, { en: "clock", fr: "horloge", cat: "Nom" },
  { en: "glass", fr: "verre", cat: "Nom" }, { en: "bottle", fr: "bouteille", cat: "Nom" },
  { en: "cup", fr: "tasse", cat: "Nom" }, { en: "plate", fr: "assiette", cat: "Nom" },
  { en: "knife", fr: "couteau", cat: "Nom" }, { en: "spoon", fr: "cuillère", cat: "Nom" },
  { en: "fork", fr: "fourchette", cat: "Nom" },
  // LOT 11
  { en: "food", fr: "nourriture", cat: "Nom" }, { en: "water", fr: "eau", cat: "Nom" },
  { en: "bread", fr: "pain", cat: "Nom" }, { en: "rice", fr: "riz", cat: "Nom" },
  { en: "meat", fr: "viande", cat: "Nom" }, { en: "fish", fr: "poisson", cat: "Nom" },
  { en: "egg", fr: "oeuf", cat: "Nom" }, { en: "milk", fr: "lait", cat: "Nom" },
  { en: "fruit", fr: "fruit", cat: "Nom" }, { en: "vegetable", fr: "légume", cat: "Nom" },
  { en: "sugar", fr: "sucre", cat: "Nom" }, { en: "salt", fr: "sel", cat: "Nom" },
  { en: "oil", fr: "huile", cat: "Nom" }, { en: "coffee", fr: "café", cat: "Nom" },
  { en: "tea", fr: "thé", cat: "Nom" }, { en: "juice", fr: "jus", cat: "Nom" },
  { en: "meal", fr: "repas", cat: "Nom" }, { en: "breakfast", fr: "petit-déjeuner", cat: "Nom" },
  { en: "lunch", fr: "déjeuner", cat: "Nom" }, { en: "dinner", fr: "dîner", cat: "Nom" },
  { en: "restaurant", fr: "restaurant", cat: "Nom" }, { en: "cook", fr: "cuisiner / cuisinier", cat: "Verbe" },
  { en: "eat", fr: "manger", cat: "Verbe" }, { en: "drink", fr: "boire / boisson", cat: "Verbe" },
  { en: "taste", fr: "goût / goûter", cat: "Nom" }, { en: "hungry", fr: "affamé", cat: "Adjectif" },
  { en: "thirsty", fr: "assoiffé", cat: "Adjectif" }, { en: "sweet", fr: "sucré / doux", cat: "Adjectif" },
  { en: "sour", fr: "acide", cat: "Adjectif" }, { en: "bitter", fr: "amer", cat: "Adjectif" },
  { en: "spicy", fr: "épicé", cat: "Adjectif" }, { en: "fresh", fr: "frais", cat: "Adjectif" },
  { en: "raw", fr: "cru", cat: "Adjectif" },
  // LOT 12
  { en: "clothes", fr: "vêtements", cat: "Nom" }, { en: "shirt", fr: "chemise", cat: "Nom" },
  { en: "pants", fr: "pantalon", cat: "Nom" }, { en: "dress", fr: "robe", cat: "Nom" },
  { en: "shoe", fr: "chaussure", cat: "Nom" }, { en: "hat", fr: "chapeau", cat: "Nom" },
  { en: "jacket", fr: "veste", cat: "Nom" }, { en: "coat", fr: "manteau", cat: "Nom" },
  { en: "sock", fr: "chaussette", cat: "Nom" }, { en: "color", fr: "couleur", cat: "Nom" },
  { en: "red", fr: "rouge", cat: "Adjectif" }, { en: "blue", fr: "bleu", cat: "Adjectif" },
  { en: "green", fr: "vert", cat: "Adjectif" }, { en: "black", fr: "noir", cat: "Adjectif" },
  { en: "white", fr: "blanc", cat: "Adjectif" }, { en: "yellow", fr: "jaune", cat: "Adjectif" },
  { en: "brown", fr: "marron", cat: "Adjectif" }, { en: "grey", fr: "gris", cat: "Adjectif" },
  { en: "pink", fr: "rose", cat: "Adjectif" }, { en: "size", fr: "taille", cat: "Nom" },
  { en: "style", fr: "style", cat: "Nom" }, { en: "wear", fr: "porter (vêtements)", cat: "Verbe" },
  { en: "tall", fr: "grand (taille)", cat: "Adjectif" }, { en: "thin", fr: "mince", cat: "Adjectif" },
  { en: "fat", fr: "gros", cat: "Adjectif" }, { en: "young", fr: "jeune", cat: "Adjectif" },
  { en: "strong", fr: "fort", cat: "Adjectif" }, { en: "weak", fr: "faible", cat: "Adjectif" },
  { en: "rich", fr: "riche", cat: "Adjectif" }, { en: "poor", fr: "pauvre", cat: "Adjectif" },
  { en: "smart", fr: "intelligent", cat: "Adjectif" }, { en: "kind", fr: "gentil", cat: "Adjectif" },
  { en: "look", fr: "apparence / air", cat: "Nom" },
  // LOT 13
  { en: "nature", fr: "nature", cat: "Nom" }, { en: "earth", fr: "terre", cat: "Nom" },
  { en: "sky", fr: "ciel", cat: "Nom" }, { en: "sun", fr: "soleil", cat: "Nom" },
  { en: "moon", fr: "lune", cat: "Nom" }, { en: "star", fr: "étoile", cat: "Nom" },
  { en: "sea", fr: "mer", cat: "Nom" }, { en: "ocean", fr: "océan", cat: "Nom" },
  { en: "river", fr: "rivière / fleuve", cat: "Nom" }, { en: "lake", fr: "lac", cat: "Nom" },
  { en: "mountain", fr: "montagne", cat: "Nom" }, { en: "forest", fr: "forêt", cat: "Nom" },
  { en: "tree", fr: "arbre", cat: "Nom" }, { en: "flower", fr: "fleur", cat: "Nom" },
  { en: "grass", fr: "herbe", cat: "Nom" }, { en: "animal", fr: "animal", cat: "Nom" },
  { en: "dog", fr: "chien", cat: "Nom" }, { en: "cat", fr: "chat", cat: "Nom" },
  { en: "bird", fr: "oiseau", cat: "Nom" }, { en: "weather", fr: "météo / temps", cat: "Nom" },
  { en: "rain", fr: "pluie / pleuvoir", cat: "Nom" }, { en: "snow", fr: "neige / neiger", cat: "Nom" },
  { en: "wind", fr: "vent", cat: "Nom" }, { en: "fire", fr: "feu", cat: "Nom" },
  { en: "air", fr: "air", cat: "Nom" }, { en: "dark", fr: "sombre / obscurité", cat: "Adjectif" },
  { en: "wet", fr: "mouillé / humide", cat: "Adjectif" }, { en: "dry", fr: "sec", cat: "Adjectif" },
  { en: "sand", fr: "sable", cat: "Nom" }, { en: "stone", fr: "pierre", cat: "Nom" },
  { en: "bright", fr: "brillant / lumineux", cat: "Adjectif" }, { en: "season", fr: "saison", cat: "Nom" },
  { en: "cloud", fr: "nuage", cat: "Nom" },
  // LOT 14
  { en: "car", fr: "voiture", cat: "Nom" }, { en: "bus", fr: "bus", cat: "Nom" },
  { en: "train", fr: "train", cat: "Nom" }, { en: "plane", fr: "avion", cat: "Nom" },
  { en: "boat", fr: "bateau", cat: "Nom" }, { en: "bike", fr: "vélo", cat: "Nom" },
  { en: "road", fr: "route / chemin", cat: "Nom" }, { en: "street", fr: "rue", cat: "Nom" },
  { en: "map", fr: "carte / plan", cat: "Nom" }, { en: "travel", fr: "voyager / voyage", cat: "Verbe" },
  { en: "trip", fr: "voyage / trajet", cat: "Nom" }, { en: "airport", fr: "aéroport", cat: "Nom" },
  { en: "station", fr: "gare / station", cat: "Nom" }, { en: "ticket", fr: "billet / ticket", cat: "Nom" },
  { en: "passport", fr: "passeport", cat: "Nom" }, { en: "hotel", fr: "hôtel", cat: "Nom" },
  { en: "north", fr: "nord", cat: "Nom" }, { en: "south", fr: "sud", cat: "Nom" },
  { en: "east", fr: "est", cat: "Nom" }, { en: "west", fr: "ouest", cat: "Nom" },
  { en: "arrive", fr: "arriver", cat: "Verbe" }, { en: "depart", fr: "partir / décoller", cat: "Verbe" },
  { en: "drive", fr: "conduire", cat: "Verbe" }, { en: "fly", fr: "voler", cat: "Verbe" },
  { en: "cross", fr: "traverser", cat: "Verbe" }, { en: "distance", fr: "distance", cat: "Nom" },
  { en: "speed", fr: "vitesse", cat: "Nom" }, { en: "traffic", fr: "circulation / trafic", cat: "Nom" },
  { en: "park", fr: "parc / se garer", cat: "Nom" }, { en: "path", fr: "chemin / sentier", cat: "Nom" },
  { en: "bridge", fr: "pont", cat: "Nom" }, { en: "direction", fr: "direction", cat: "Nom" },
  { en: "ride", fr: "monter (vélo / cheval)", cat: "Verbe" },
  // LOT 15
  { en: "work", fr: "travail / travailler", cat: "Nom" }, { en: "job", fr: "emploi / métier", cat: "Nom" },
  { en: "office", fr: "bureau", cat: "Nom" }, { en: "school", fr: "école", cat: "Nom" },
  { en: "class", fr: "classe / cours", cat: "Nom" }, { en: "student", fr: "étudiant(e)", cat: "Nom" },
  { en: "teacher", fr: "professeur", cat: "Nom" }, { en: "lesson", fr: "leçon / cours", cat: "Nom" },
  { en: "exam", fr: "examen", cat: "Nom" }, { en: "study", fr: "étudier / études", cat: "Verbe" },
  { en: "test", fr: "test / tester", cat: "Nom" }, { en: "question", fr: "question", cat: "Nom" },
  { en: "answer", fr: "réponse / répondre", cat: "Nom" }, { en: "idea", fr: "idée", cat: "Nom" },
  { en: "problem", fr: "problème", cat: "Nom" }, { en: "solution", fr: "solution", cat: "Nom" },
  { en: "project", fr: "projet", cat: "Nom" }, { en: "plan", fr: "plan / planifier", cat: "Nom" },
  { en: "goal", fr: "objectif / but", cat: "Nom" }, { en: "result", fr: "résultat", cat: "Nom" },
  { en: "success", fr: "succès / réussite", cat: "Nom" }, { en: "fail", fr: "échouer", cat: "Verbe" },
  { en: "skill", fr: "compétence", cat: "Nom" }, { en: "knowledge", fr: "connaissance", cat: "Nom" },
  { en: "experience", fr: "expérience", cat: "Nom" }, { en: "practice", fr: "pratique", cat: "Nom" },
  { en: "effort", fr: "effort", cat: "Nom" }, { en: "team", fr: "équipe", cat: "Nom" },
  { en: "meeting", fr: "réunion", cat: "Nom" }, { en: "business", fr: "affaires / entreprise", cat: "Nom" },
  { en: "company", fr: "entreprise / société", cat: "Nom" }, { en: "salary", fr: "salaire", cat: "Nom" },
  { en: "manager", fr: "manager / directeur", cat: "Nom" },
  // LOT 16
  { en: "internet", fr: "internet", cat: "Nom" }, { en: "website", fr: "site web", cat: "Nom" },
  { en: "screen", fr: "écran", cat: "Nom" }, { en: "keyboard", fr: "clavier", cat: "Nom" },
  { en: "mouse", fr: "souris", cat: "Nom" }, { en: "file", fr: "fichier", cat: "Nom" },
  { en: "data", fr: "données", cat: "Nom" }, { en: "software", fr: "logiciel", cat: "Nom" },
  { en: "app", fr: "application", cat: "Nom" }, { en: "email", fr: "e-mail / courriel", cat: "Nom" },
  { en: "message", fr: "message", cat: "Nom" }, { en: "send", fr: "envoyer", cat: "Verbe" },
  { en: "receive", fr: "recevoir", cat: "Verbe" }, { en: "download", fr: "télécharger", cat: "Verbe" },
  { en: "upload", fr: "uploader", cat: "Verbe" }, { en: "search", fr: "rechercher / chercher", cat: "Verbe" },
  { en: "connect", fr: "connecter", cat: "Verbe" }, { en: "network", fr: "réseau", cat: "Nom" },
  { en: "digital", fr: "numérique", cat: "Adjectif" }, { en: "online", fr: "en ligne", cat: "Adjectif" },
  { en: "offline", fr: "hors ligne", cat: "Adjectif" }, { en: "password", fr: "mot de passe", cat: "Nom" },
  { en: "account", fr: "compte", cat: "Nom" }, { en: "update", fr: "mise à jour", cat: "Nom" },
  { en: "click", fr: "cliquer", cat: "Verbe" }, { en: "share", fr: "partager", cat: "Verbe" },
  { en: "save", fr: "sauvegarder", cat: "Verbe" }, { en: "delete", fr: "supprimer", cat: "Verbe" },
  { en: "video", fr: "vidéo", cat: "Nom" }, { en: "photo", fr: "photo", cat: "Nom" },
  { en: "camera", fr: "appareil photo / caméra", cat: "Nom" }, { en: "code", fr: "code / coder", cat: "Nom" },
  { en: "print", fr: "imprimer", cat: "Verbe" },
  // LOT 17
  { en: "doctor", fr: "médecin", cat: "Nom" }, { en: "hospital", fr: "hôpital", cat: "Nom" },
  { en: "medicine", fr: "médicament / médecine", cat: "Nom" }, { en: "pill", fr: "pilule / comprimé", cat: "Nom" },
  { en: "disease", fr: "maladie", cat: "Nom" }, { en: "illness", fr: "maladie / indisposition", cat: "Nom" },
  { en: "injury", fr: "blessure", cat: "Nom" }, { en: "treatment", fr: "traitement", cat: "Nom" },
  { en: "surgery", fr: "chirurgie / opération", cat: "Nom" }, { en: "fever", fr: "fièvre", cat: "Nom" },
  { en: "cough", fr: "toux / tousser", cat: "Nom" }, { en: "headache", fr: "mal de tête", cat: "Nom" },
  { en: "allergy", fr: "allergie", cat: "Nom" }, { en: "recover", fr: "se rétablir / guérir", cat: "Verbe" },
  { en: "rest", fr: "repos / se reposer", cat: "Nom" }, { en: "sleep", fr: "sommeil / dormir", cat: "Nom" },
  { en: "exercise", fr: "exercice", cat: "Nom" }, { en: "stress", fr: "stress", cat: "Nom" },
  { en: "energy", fr: "énergie", cat: "Nom" }, { en: "diet", fr: "régime / alimentation", cat: "Nom" },
  { en: "weight", fr: "poids", cat: "Nom" }, { en: "birth", fr: "naissance", cat: "Nom" },
  { en: "death", fr: "mort", cat: "Nom" }, { en: "alive", fr: "vivant", cat: "Adjectif" },
  { en: "dead", fr: "mort", cat: "Adjectif" }, { en: "emergency", fr: "urgence", cat: "Nom" },
  { en: "accident", fr: "accident", cat: "Nom" }, { en: "breath", fr: "respiration / souffle", cat: "Nom" },
  { en: "breathe", fr: "respirer", cat: "Verbe" }, { en: "mental", fr: "mental", cat: "Adjectif" },
  { en: "physical", fr: "physique", cat: "Adjectif" }, { en: "pregnant", fr: "enceinte", cat: "Adjectif" },
  { en: "nurse", fr: "infirmier(e)", cat: "Nom" },
  // LOT 18
  { en: "love", fr: "amour / aimer", cat: "Nom" }, { en: "hate", fr: "haine / haïr", cat: "Nom" },
  { en: "fear", fr: "peur / craindre", cat: "Nom" }, { en: "hope", fr: "espoir / espérer", cat: "Nom" },
  { en: "joy", fr: "joie", cat: "Nom" }, { en: "worry", fr: "s'inquiéter / inquiétude", cat: "Verbe" },
  { en: "surprise", fr: "surprise / surprendre", cat: "Nom" }, { en: "proud", fr: "fier", cat: "Adjectif" },
  { en: "shame", fr: "honte", cat: "Nom" }, { en: "excited", fr: "excité / enthousiaste", cat: "Adjectif" },
  { en: "bored", fr: "ennuyé", cat: "Adjectif" }, { en: "calm", fr: "calme", cat: "Adjectif" },
  { en: "nervous", fr: "nerveux", cat: "Adjectif" }, { en: "confident", fr: "confiant", cat: "Adjectif" },
  { en: "lonely", fr: "seul / solitaire", cat: "Adjectif" }, { en: "funny", fr: "drôle / amusant", cat: "Adjectif" },
  { en: "serious", fr: "sérieux", cat: "Adjectif" }, { en: "honest", fr: "honnête", cat: "Adjectif" },
  { en: "brave", fr: "courageux", cat: "Adjectif" }, { en: "lazy", fr: "paresseux", cat: "Adjectif" },
  { en: "patient", fr: "patient", cat: "Adjectif" }, { en: "polite", fr: "poli", cat: "Adjectif" },
  { en: "rude", fr: "impoli / grossier", cat: "Adjectif" }, { en: "generous", fr: "généreux", cat: "Adjectif" },
  { en: "selfish", fr: "égoïste", cat: "Adjectif" }, { en: "creative", fr: "créatif", cat: "Adjectif" },
  { en: "curious", fr: "curieux", cat: "Adjectif" }, { en: "mood", fr: "humeur", cat: "Nom" },
  { en: "feeling", fr: "sentiment", cat: "Nom" }, { en: "emotion", fr: "émotion", cat: "Nom" },
  { en: "attitude", fr: "attitude", cat: "Nom" }, { en: "behavior", fr: "comportement", cat: "Nom" },
  { en: "opinion", fr: "opinion / avis", cat: "Nom" },
  // LOT 19
  { en: "buy", fr: "acheter", cat: "Verbe" }, { en: "sell", fr: "vendre", cat: "Verbe" },
  { en: "price", fr: "prix", cat: "Nom" }, { en: "cost", fr: "coût / coûter", cat: "Nom" },
  { en: "cheap", fr: "bon marché", cat: "Adjectif" }, { en: "expensive", fr: "cher / coûteux", cat: "Adjectif" },
  { en: "store", fr: "magasin", cat: "Nom" }, { en: "shop", fr: "boutique / faire des achats", cat: "Nom" },
  { en: "market", fr: "marché", cat: "Nom" }, { en: "bank", fr: "banque", cat: "Nom" },
  { en: "spend", fr: "dépenser", cat: "Verbe" }, { en: "bill", fr: "facture / billet", cat: "Nom" },
  { en: "coin", fr: "pièce de monnaie", cat: "Nom" }, { en: "cash", fr: "espèces / liquide", cat: "Nom" },
  { en: "credit", fr: "crédit", cat: "Nom" }, { en: "tax", fr: "taxe / impôt", cat: "Nom" },
  { en: "discount", fr: "réduction", cat: "Nom" }, { en: "offer", fr: "offre", cat: "Nom" },
  { en: "receipt", fr: "reçu", cat: "Nom" }, { en: "order", fr: "commande / commander", cat: "Nom" },
  { en: "deliver", fr: "livrer", cat: "Verbe" }, { en: "package", fr: "colis / paquet", cat: "Nom" },
  { en: "return", fr: "retourner / rembourser", cat: "Verbe" },
  { en: "exchange", fr: "échange / échanger", cat: "Nom" },
  { en: "rent", fr: "loyer / louer", cat: "Nom" }, { en: "own", fr: "posséder", cat: "Verbe" },
  { en: "earn", fr: "gagner de l'argent", cat: "Verbe" }, { en: "invest", fr: "investir", cat: "Verbe" },
  { en: "profit", fr: "profit / bénéfice", cat: "Nom" }, { en: "loss", fr: "perte", cat: "Nom" },
  { en: "budget", fr: "budget", cat: "Nom" }, { en: "save", fr: "économiser / épargner", cat: "Verbe" },
  { en: "pay", fr: "payer", cat: "Verbe" },
  // LOT 20
  { en: "music", fr: "musique", cat: "Nom" }, { en: "song", fr: "chanson", cat: "Nom" },
  { en: "movie", fr: "film", cat: "Nom" }, { en: "game", fr: "jeu", cat: "Nom" },
  { en: "sport", fr: "sport", cat: "Nom" }, { en: "dance", fr: "danser / danse", cat: "Verbe" },
  { en: "sing", fr: "chanter", cat: "Verbe" }, { en: "draw", fr: "dessiner", cat: "Verbe" },
  { en: "paint", fr: "peindre", cat: "Verbe" }, { en: "art", fr: "art", cat: "Nom" },
  { en: "show", fr: "spectacle / montrer", cat: "Nom" }, { en: "concert", fr: "concert", cat: "Nom" },
  { en: "win", fr: "gagner", cat: "Verbe" }, { en: "lose", fr: "perdre", cat: "Verbe" },
  { en: "score", fr: "score / marquer", cat: "Nom" }, { en: "match", fr: "match", cat: "Nom" },
  { en: "race", fr: "course", cat: "Nom" }, { en: "hobby", fr: "loisir / passe-temps", cat: "Nom" },
  { en: "fun", fr: "amusant / amusement", cat: "Adjectif" }, { en: "enjoy", fr: "apprécier / profiter", cat: "Verbe" },
  { en: "relax", fr: "se relaxer", cat: "Verbe" }, { en: "vacation", fr: "vacances", cat: "Nom" },
  { en: "holiday", fr: "jour férié / vacances", cat: "Nom" }, { en: "party", fr: "fête", cat: "Nom" },
  { en: "celebrate", fr: "célébrer / fêter", cat: "Verbe" }, { en: "laugh", fr: "rire", cat: "Verbe" },
  { en: "smile", fr: "sourire", cat: "Verbe" }, { en: "hug", fr: "câlin / serrer dans les bras", cat: "Nom" },
  { en: "visit", fr: "rendre visite / visiter", cat: "Verbe" }, { en: "invite", fr: "inviter", cat: "Verbe" },
  { en: "welcome", fr: "bienvenue / accueillir", cat: "Nom" }, { en: "theater", fr: "théâtre", cat: "Nom" },
  { en: "kiss", fr: "embrasser / bisou", cat: "Verbe" },
  // LOT 21
  { en: "place", fr: "endroit / lieu", cat: "Nom" }, { en: "area", fr: "zone / quartier", cat: "Nom" },
  { en: "neighborhood", fr: "quartier / voisinage", cat: "Nom" },
  { en: "building", fr: "bâtiment / immeuble", cat: "Nom" },
  { en: "address", fr: "adresse", cat: "Nom" }, { en: "police", fr: "police", cat: "Nom" },
  { en: "government", fr: "gouvernement", cat: "Nom" }, { en: "law", fr: "loi", cat: "Nom" },
  { en: "rule", fr: "règle", cat: "Nom" }, { en: "vote", fr: "voter / vote", cat: "Verbe" },
  { en: "power", fr: "pouvoir / puissance", cat: "Nom" }, { en: "leader", fr: "dirigeant / chef", cat: "Nom" },
  { en: "service", fr: "service", cat: "Nom" }, { en: "public", fr: "public", cat: "Adjectif" },
  { en: "private", fr: "privé", cat: "Adjectif" }, { en: "community", fr: "communauté", cat: "Nom" },
  { en: "society", fr: "société", cat: "Nom" }, { en: "culture", fr: "culture", cat: "Nom" },
  { en: "language", fr: "langue", cat: "Nom" }, { en: "religion", fr: "religion", cat: "Nom" },
  { en: "tradition", fr: "tradition", cat: "Nom" }, { en: "history", fr: "histoire", cat: "Nom" },
  { en: "war", fr: "guerre", cat: "Nom" }, { en: "peace", fr: "paix", cat: "Nom" },
  { en: "economy", fr: "économie", cat: "Nom" }, { en: "population", fr: "population", cat: "Nom" },
  { en: "environment", fr: "environnement", cat: "Nom" }, { en: "resource", fr: "ressource", cat: "Nom" },
  { en: "develop", fr: "développer", cat: "Verbe" }, { en: "improve", fr: "améliorer", cat: "Verbe" },
  { en: "freedom", fr: "liberté", cat: "Nom" }, { en: "justice", fr: "justice", cat: "Nom" },
  { en: "right", fr: "droit (légal)", cat: "Nom" },
  // LOT 22
  { en: "speak", fr: "parler", cat: "Verbe" }, { en: "talk", fr: "parler / discuter", cat: "Verbe" },
  { en: "listen", fr: "écouter", cat: "Verbe" }, { en: "word", fr: "mot", cat: "Nom" },
  { en: "sentence", fr: "phrase", cat: "Nom" }, { en: "story", fr: "histoire / récit", cat: "Nom" },
  { en: "news", fr: "nouvelles / informations", cat: "Nom" },
  { en: "information", fr: "information", cat: "Nom" },
  { en: "report", fr: "rapport / signaler", cat: "Nom" }, { en: "letter", fr: "lettre", cat: "Nom" },
  { en: "sign", fr: "signe / panneau", cat: "Nom" }, { en: "meaning", fr: "signification / sens", cat: "Nom" },
  { en: "explain", fr: "expliquer", cat: "Verbe" }, { en: "describe", fr: "décrire", cat: "Verbe" },
  { en: "agree", fr: "être d'accord", cat: "Verbe" }, { en: "disagree", fr: "ne pas être d'accord", cat: "Verbe" },
  { en: "suggest", fr: "suggérer", cat: "Verbe" }, { en: "recommend", fr: "recommander", cat: "Verbe" },
  { en: "warn", fr: "avertir", cat: "Verbe" }, { en: "promise", fr: "promettre / promesse", cat: "Verbe" },
  { en: "apologize", fr: "s'excuser", cat: "Verbe" }, { en: "thank", fr: "remercier", cat: "Verbe" },
  { en: "greet", fr: "saluer", cat: "Verbe" }, { en: "introduce", fr: "présenter (quelqu'un)", cat: "Verbe" },
  { en: "conversation", fr: "conversation", cat: "Nom" }, { en: "discussion", fr: "discussion", cat: "Nom" },
  { en: "argument", fr: "argument / dispute", cat: "Nom" }, { en: "joke", fr: "blague / plaisanter", cat: "Nom" },
  { en: "truth", fr: "vérité", cat: "Nom" }, { en: "lie", fr: "mensonge / mentir", cat: "Nom" },
  { en: "silence", fr: "silence", cat: "Nom" }, { en: "voice", fr: "voix", cat: "Nom" },
  { en: "repeat", fr: "répéter", cat: "Verbe" },
  // LOT 23
  { en: "science", fr: "science", cat: "Nom" }, { en: "technology", fr: "technologie", cat: "Nom" },
  { en: "research", fr: "recherche", cat: "Nom" }, { en: "experiment", fr: "expérience / expérimenter", cat: "Nom" },
  { en: "theory", fr: "théorie", cat: "Nom" }, { en: "fact", fr: "fait", cat: "Nom" },
  { en: "evidence", fr: "preuve", cat: "Nom" }, { en: "discovery", fr: "découverte", cat: "Nom" },
  { en: "invention", fr: "invention", cat: "Nom" }, { en: "machine", fr: "machine", cat: "Nom" },
  { en: "tool", fr: "outil", cat: "Nom" }, { en: "system", fr: "système", cat: "Nom" },
  { en: "process", fr: "processus / procédé", cat: "Nom" }, { en: "method", fr: "méthode", cat: "Nom" },
  { en: "measure", fr: "mesurer / mesure", cat: "Verbe" }, { en: "calculate", fr: "calculer", cat: "Verbe" },
  { en: "analyze", fr: "analyser", cat: "Verbe" }, { en: "design", fr: "concevoir / conception", cat: "Verbe" },
  { en: "build", fr: "construire", cat: "Verbe" }, { en: "control", fr: "contrôler", cat: "Verbe" },
  { en: "manage", fr: "gérer", cat: "Verbe" }, { en: "produce", fr: "produire", cat: "Verbe" },
  { en: "product", fr: "produit", cat: "Nom" }, { en: "material", fr: "matériau / matière", cat: "Nom" },
  { en: "structure", fr: "structure", cat: "Nom" }, { en: "space", fr: "espace", cat: "Nom" },
  { en: "force", fr: "force", cat: "Nom" }, { en: "temperature", fr: "température", cat: "Nom" },
  { en: "level", fr: "niveau", cat: "Nom" }, { en: "type", fr: "type / genre", cat: "Nom" },
  { en: "model", fr: "modèle", cat: "Nom" }, { en: "test", fr: "tester", cat: "Verbe" },
  { en: "power2", fr: "puissance / énergie", cat: "Nom" },
  // LOT 24
  { en: "can", fr: "pouvoir (capacité)", cat: "Modal" }, { en: "could", fr: "pourrait / pouvait", cat: "Modal" },
  { en: "will", fr: "futur / vouloir bien", cat: "Modal" }, { en: "would", fr: "conditionnel", cat: "Modal" },
  { en: "should", fr: "devoir (conseil)", cat: "Modal" }, { en: "must", fr: "devoir (obligation)", cat: "Modal" },
  { en: "may", fr: "avoir la permission / peut-être", cat: "Modal" },
  { en: "might", fr: "pourrait (éventualité)", cat: "Modal" },
  { en: "have to", fr: "devoir (obligation externe)", cat: "Expression" },
  { en: "used to", fr: "avait l'habitude de", cat: "Expression" },
  { en: "able to", fr: "capable de", cat: "Expression" },
  { en: "want to", fr: "vouloir", cat: "Expression" },
  { en: "need to", fr: "avoir besoin de", cat: "Expression" },
  { en: "going to", fr: "aller (futur proche)", cat: "Expression" },
  { en: "there is", fr: "il y a (singulier)", cat: "Expression" },
  { en: "there are", fr: "il y a (pluriel)", cat: "Expression" },
  { en: "a lot of", fr: "beaucoup de", cat: "Expression" },
  { en: "kind of", fr: "une sorte de / plutôt", cat: "Expression" },
  { en: "in order to", fr: "afin de / pour", cat: "Expression" },
  { en: "as well as", fr: "ainsi que", cat: "Expression" },
  { en: "such as", fr: "tel que / comme", cat: "Expression" },
  { en: "at least", fr: "au moins", cat: "Expression" },
  { en: "instead of", fr: "à la place de", cat: "Expression" },
  { en: "in fact", fr: "en fait", cat: "Expression" },
  { en: "of course", fr: "bien sûr", cat: "Expression" },
  { en: "for example", fr: "par exemple", cat: "Expression" },
  { en: "as soon as", fr: "dès que", cat: "Expression" },
  { en: "as long as", fr: "tant que / du moment que", cat: "Expression" },
  { en: "rather than", fr: "plutôt que", cat: "Expression" },
  { en: "due to", fr: "en raison de", cat: "Expression" },
  { en: "based on", fr: "basé sur", cat: "Expression" },
  { en: "shall", fr: "futur formel", cat: "Modal" },
  { en: "at most", fr: "au plus", cat: "Expression" },
  // LOT 25
  { en: "relationship", fr: "relation / rapport", cat: "Nom" }, { en: "marriage", fr: "mariage", cat: "Nom" },
  { en: "husband", fr: "mari", cat: "Nom" }, { en: "wife", fr: "femme (épouse)", cat: "Nom" },
  { en: "couple", fr: "couple", cat: "Nom" }, { en: "partner", fr: "partenaire", cat: "Nom" },
  { en: "neighbor", fr: "voisin", cat: "Nom" }, { en: "colleague", fr: "collègue", cat: "Nom" },
  { en: "boss", fr: "patron / chef", cat: "Nom" }, { en: "customer", fr: "client", cat: "Nom" },
  { en: "stranger", fr: "étranger / inconnu", cat: "Nom" }, { en: "enemy", fr: "ennemi", cat: "Nom" },
  { en: "trust", fr: "confiance / faire confiance", cat: "Nom" },
  { en: "respect", fr: "respect / respecter", cat: "Nom" },
  { en: "support", fr: "soutien / soutenir", cat: "Nom" }, { en: "help", fr: "aide / aider", cat: "Nom" },
  { en: "care", fr: "se soucier / prendre soin", cat: "Verbe" }, { en: "accept", fr: "accepter", cat: "Verbe" },
  { en: "refuse", fr: "refuser", cat: "Verbe" }, { en: "choose", fr: "choisir", cat: "Verbe" },
  { en: "decide", fr: "décider", cat: "Verbe" }, { en: "prefer", fr: "préférer", cat: "Verbe" },
  { en: "compare", fr: "comparer", cat: "Verbe" }, { en: "achieve", fr: "atteindre / accomplir", cat: "Verbe" },
  { en: "affect", fr: "affecter / influencer", cat: "Verbe" }, { en: "cause", fr: "causer / cause", cat: "Verbe" },
  { en: "avoid", fr: "éviter", cat: "Verbe" }, { en: "allow", fr: "permettre / autoriser", cat: "Verbe" },
  { en: "prevent", fr: "empêcher / prévenir", cat: "Verbe" }, { en: "protect", fr: "protéger", cat: "Verbe" },
  { en: "compete", fr: "concourir / rivaliser", cat: "Verbe" },
  { en: "date", fr: "date / rendez-vous amoureux", cat: "Nom" }, { en: "share", fr: "partager", cat: "Verbe" },
  // LOT 26
  { en: "reason", fr: "raison", cat: "Nom" }, { en: "purpose", fr: "but / objectif", cat: "Nom" },
  { en: "value", fr: "valeur", cat: "Nom" }, { en: "quality", fr: "qualité", cat: "Nom" },
  { en: "quantity", fr: "quantité", cat: "Nom" }, { en: "number", fr: "nombre", cat: "Nom" },
  { en: "amount", fr: "montant / quantité", cat: "Nom" }, { en: "part", fr: "partie", cat: "Nom" },
  { en: "group", fr: "groupe", cat: "Nom" }, { en: "order", fr: "ordre", cat: "Nom" },
  { en: "form", fr: "forme / formulaire", cat: "Nom" }, { en: "point", fr: "point", cat: "Nom" },
  { en: "line", fr: "ligne", cat: "Nom" }, { en: "side", fr: "côté", cat: "Nom" },
  { en: "example", fr: "exemple", cat: "Nom" }, { en: "case", fr: "cas", cat: "Nom" },
  { en: "situation", fr: "situation", cat: "Nom" }, { en: "condition", fr: "condition", cat: "Nom" },
  { en: "chance", fr: "chance / hasard", cat: "Nom" }, { en: "risk", fr: "risque", cat: "Nom" },
  { en: "choice", fr: "choix", cat: "Nom" }, { en: "option", fr: "option", cat: "Nom" },
  { en: "difference", fr: "différence", cat: "Nom" }, { en: "change", fr: "changement", cat: "Nom" },
  { en: "movement", fr: "mouvement", cat: "Nom" }, { en: "action", fr: "action", cat: "Nom" },
  { en: "effect", fr: "effet", cat: "Nom" }, { en: "impact", fr: "impact", cat: "Nom" },
  { en: "detail", fr: "détail", cat: "Nom" }, { en: "step", fr: "étape / pas", cat: "Nom" },
  { en: "stage", fr: "stade / étape", cat: "Nom" }, { en: "phase", fr: "phase", cat: "Nom" },
  { en: "link", fr: "lien / relier", cat: "Nom" },
  // LOT 27
  { en: "large", fr: "grand / large", cat: "Adjectif" }, { en: "medium", fr: "moyen", cat: "Adjectif" },
  { en: "huge", fr: "énorme", cat: "Adjectif" }, { en: "tiny", fr: "minuscule / tout petit", cat: "Adjectif" },
  { en: "wide", fr: "large (largeur)", cat: "Adjectif" }, { en: "narrow", fr: "étroit", cat: "Adjectif" },
  { en: "deep", fr: "profond", cat: "Adjectif" }, { en: "shallow", fr: "peu profond", cat: "Adjectif" },
  { en: "heavy", fr: "lourd", cat: "Adjectif" }, { en: "light2", fr: "léger", cat: "Adjectif" },
  { en: "round", fr: "rond", cat: "Adjectif" }, { en: "flat", fr: "plat", cat: "Adjectif" },
  { en: "sharp", fr: "tranchant / vif", cat: "Adjectif" }, { en: "rough", fr: "rugueux / brutal", cat: "Adjectif" },
  { en: "smooth", fr: "lisse / doux", cat: "Adjectif" }, { en: "loud", fr: "bruyant / fort", cat: "Adjectif" },
  { en: "quiet", fr: "silencieux / calme", cat: "Adjectif" }, { en: "clear", fr: "clair / net", cat: "Adjectif" },
  { en: "soft", fr: "doux / mou", cat: "Adjectif" }, { en: "thick", fr: "épais", cat: "Adjectif" },
  { en: "thin2", fr: "fin / mince", cat: "Adjectif" }, { en: "straight", fr: "droit / direct", cat: "Adjectif" },
  { en: "complex", fr: "complexe", cat: "Adjectif" }, { en: "simple", fr: "simple", cat: "Adjectif" },
  { en: "natural", fr: "naturel", cat: "Adjectif" }, { en: "normal", fr: "normal", cat: "Adjectif" },
  { en: "common", fr: "commun / courant", cat: "Adjectif" }, { en: "rare", fr: "rare", cat: "Adjectif" },
  { en: "popular", fr: "populaire", cat: "Adjectif" }, { en: "typical", fr: "typique", cat: "Adjectif" },
  { en: "actual", fr: "réel / effectif", cat: "Adjectif" }, { en: "basic", fr: "basique / de base", cat: "Adjectif" },
  { en: "direct", fr: "direct", cat: "Adjectif" },
  // LOT 28
  { en: "push", fr: "pousser", cat: "Verbe" }, { en: "pull", fr: "tirer", cat: "Verbe" },
  { en: "carry", fr: "porter / transporter", cat: "Verbe" }, { en: "throw", fr: "lancer / jeter", cat: "Verbe" },
  { en: "catch", fr: "attraper", cat: "Verbe" }, { en: "hit", fr: "frapper / toucher", cat: "Verbe" },
  { en: "jump", fr: "sauter", cat: "Verbe" }, { en: "climb", fr: "grimper / escalader", cat: "Verbe" },
  { en: "fall", fr: "tomber", cat: "Verbe" }, { en: "drop", fr: "laisser tomber", cat: "Verbe" },
  { en: "lift", fr: "soulever", cat: "Verbe" }, { en: "pick", fr: "choisir / cueillir", cat: "Verbe" },
  { en: "touch", fr: "toucher", cat: "Verbe" }, { en: "break", fr: "casser / briser", cat: "Verbe" },
  { en: "fix", fr: "réparer", cat: "Verbe" }, { en: "cut", fr: "couper", cat: "Verbe" },
  { en: "fill", fr: "remplir", cat: "Verbe" }, { en: "clean2", fr: "nettoyer", cat: "Verbe" },
  { en: "wash", fr: "laver", cat: "Verbe" }, { en: "hide", fr: "cacher / se cacher", cat: "Verbe" },
  { en: "turn", fr: "tourner", cat: "Verbe" }, { en: "mix", fr: "mélanger", cat: "Verbe" },
  { en: "add", fr: "ajouter", cat: "Verbe" }, { en: "remove", fr: "enlever / supprimer", cat: "Verbe" },
  { en: "replace", fr: "remplacer", cat: "Verbe" }, { en: "separate", fr: "séparer", cat: "Verbe" },
  { en: "collect", fr: "collecter / rassembler", cat: "Verbe" }, { en: "sort", fr: "trier / classer", cat: "Verbe" },
  { en: "lock", fr: "verrouiller", cat: "Verbe" }, { en: "unlock", fr: "déverrouiller", cat: "Verbe" },
  { en: "press", fr: "appuyer / presser", cat: "Verbe" }, { en: "squeeze", fr: "presser / serrer", cat: "Verbe" },
  { en: "fold", fr: "plier", cat: "Verbe" },
  // LOT 29
  { en: "according to", fr: "selon / d'après", cat: "Expression" },
  { en: "furthermore", fr: "de plus / en outre", cat: "Adverbe" },
  { en: "moreover", fr: "de plus / qui plus est", cat: "Adverbe" },
  { en: "nevertheless", fr: "néanmoins", cat: "Adverbe" },
  { en: "consequently", fr: "par conséquent", cat: "Adverbe" },
  { en: "significant", fr: "significatif / important", cat: "Adjectif" },
  { en: "various", fr: "divers / varié", cat: "Adjectif" },
  { en: "particular", fr: "particulier", cat: "Adjectif" },
  { en: "major", fr: "majeur / principal", cat: "Adjectif" },
  { en: "minor", fr: "mineur / secondaire", cat: "Adjectif" },
  { en: "primary", fr: "primaire / principal", cat: "Adjectif" },
  { en: "secondary", fr: "secondaire", cat: "Adjectif" },
  { en: "general", fr: "général", cat: "Adjectif" },
  { en: "specific", fr: "spécifique / précis", cat: "Adjectif" },
  { en: "main", fr: "principal", cat: "Adjectif" },
  { en: "additional", fr: "supplémentaire", cat: "Adjectif" },
  { en: "recent", fr: "récent", cat: "Adjectif" }, { en: "current", fr: "actuel", cat: "Adjectif" },
  { en: "future", fr: "futur", cat: "Adjectif" }, { en: "past", fr: "passé", cat: "Adjectif" },
  { en: "present", fr: "présent", cat: "Adjectif" }, { en: "original", fr: "original", cat: "Adjectif" },
  { en: "personal", fr: "personnel", cat: "Adjectif" }, { en: "social", fr: "social", cat: "Adjectif" },
  { en: "political", fr: "politique", cat: "Adjectif" }, { en: "economic", fr: "économique", cat: "Adjectif" },
  { en: "global", fr: "mondial / global", cat: "Adjectif" }, { en: "local", fr: "local", cat: "Adjectif" },
  { en: "national", fr: "national", cat: "Adjectif" },
  { en: "international", fr: "international", cat: "Adjectif" },
  { en: "official", fr: "officiel", cat: "Adjectif" }, { en: "final", fr: "final / définitif", cat: "Adjectif" },
  { en: "total", fr: "total", cat: "Adjectif" },
  // LOT 30
  { en: "thing", fr: "chose", cat: "Nom" }, { en: "way", fr: "façon / chemin", cat: "Nom" },
  { en: "issue", fr: "problème / question", cat: "Nom" }, { en: "state", fr: "état", cat: "Nom" },
  { en: "consider", fr: "considérer", cat: "Verbe" }, { en: "appear", fr: "apparaître / sembler", cat: "Verbe" },
  { en: "seem", fr: "sembler / paraître", cat: "Verbe" }, { en: "expect", fr: "s'attendre à", cat: "Verbe" },
  { en: "require", fr: "nécessiter / exiger", cat: "Verbe" },
  { en: "remember", fr: "se souvenir de", cat: "Verbe" },
  { en: "forget", fr: "oublier", cat: "Verbe" }, { en: "notice", fr: "remarquer", cat: "Verbe" },
  { en: "realize", fr: "réaliser / se rendre compte", cat: "Verbe" },
  { en: "imagine", fr: "imaginer", cat: "Verbe" },
  { en: "wonder", fr: "se demander", cat: "Verbe" }, { en: "guess", fr: "deviner / supposer", cat: "Verbe" },
  { en: "admit", fr: "admettre / avouer", cat: "Verbe" }, { en: "deny", fr: "nier / refuser", cat: "Verbe" },
  { en: "confirm", fr: "confirmer", cat: "Verbe" }, { en: "check", fr: "vérifier / contrôler", cat: "Verbe" },
  { en: "review", fr: "examiner / réviser", cat: "Verbe" }, { en: "solve", fr: "résoudre", cat: "Verbe" },
  { en: "handle", fr: "gérer / manier", cat: "Verbe" },
  { en: "deal with", fr: "faire face à / traiter", cat: "Expression" },
  { en: "depend on", fr: "dépendre de", cat: "Expression" },
  { en: "look for", fr: "chercher", cat: "Expression" },
  { en: "look at", fr: "regarder", cat: "Expression" },
  { en: "think about", fr: "penser à / réfléchir à", cat: "Expression" },
  { en: "talk about", fr: "parler de", cat: "Expression" },
  { en: "work on", fr: "travailler sur", cat: "Expression" },
  { en: "come back", fr: "revenir / retourner", cat: "Expression" },
  { en: "give up", fr: "abandonner / renoncer", cat: "Expression" },
  { en: "find out", fr: "découvrir / apprendre", cat: "Expression" },
];

const WORDS_PER_LOT = 33;
const TOTAL_LOTS = 30;

const lotTitles = [
  "Pronoms et Famille", "Verbes essentiels I", "Verbes essentiels II", "Nombres et Temps",
  "Questions et Liaisons", "Adjectifs I", "Adjectifs II", "Lieu et Espace", "Corps humain",
  "Maison et Objets", "Nourriture et Boissons", "Vetements et Couleurs", "Nature et Environnement",
  "Transport et Voyage", "Travail et Education", "Technologie et Internet", "Sante et Medecine",
  "Emotions et Personnalite", "Shopping et Argent", "Loisirs et Divertissement", "Ville et Services",
  "Communication", "Science et Methode", "Modaux et Expressions", "Relations sociales",
  "Concepts abstraits", "Descriptions physiques", "Verbes d action", "Vocabulaire academique",
  "Derniers essentiels"
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
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#F1F5F9" }}>
              Onglet Mots
            </h2>
            <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#94A3B8" }}>
              Retrouvez le contenu actuel de l’application dans cet onglet.
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
