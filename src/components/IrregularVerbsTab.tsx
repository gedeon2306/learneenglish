import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaListUl, FaThLarge, FaCheck, FaRegCircle, FaTimes, FaArrowLeft, FaArrowRight, FaVolumeUp } from "react-icons/fa";
import { FiActivity } from "react-icons/fi";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/storage";
import { speakSequence, stopSpeech } from "../utils/speech";

type IrregularVerb = {
  base: string;
  preterit: string;
  pastParticiple: string;
  translation: string;
  pronunciationBase: string;
  pronunciationPreterit: string;
  pronunciationPastParticiple: string;
};

const irregularVerbs: IrregularVerb[] = [
  { base: "arise", preterit: "arose", pastParticiple: "arisen", translation: "survenir / s'élever", pronunciationBase: "e-raïz", pronunciationPreterit: "e-roz", pronunciationPastParticiple: "e-ri-zeun" },
  { base: "awake", preterit: "awoke", pastParticiple: "awoken", translation: "se réveiller", pronunciationBase: "e-weïk", pronunciationPreterit: "e-wok", pronunciationPastParticiple: "e-wo-keun" },
  { base: "be (am/is/are)", preterit: "was/were", pastParticiple: "been", translation: "être", pronunciationBase: "bii", pronunciationPreterit: "woz/weur", pronunciationPastParticiple: "biin" },
  { base: "bear", preterit: "bore", pastParticiple: "borne", translation: "porter / supporter", pronunciationBase: "ber", pronunciationPreterit: "bor", pronunciationPastParticiple: "born" },
  { base: "beat", preterit: "beat", pastParticiple: "beaten", translation: "battre", pronunciationBase: "biit", pronunciationPreterit: "biit", pronunciationPastParticiple: "bii-teun" },
  { base: "become", preterit: "became", pastParticiple: "become", translation: "devenir", pronunciationBase: "bi-keum", pronunciationPreterit: "bi-keïm", pronunciationPastParticiple: "bi-keum" },
  { base: "begin", preterit: "began", pastParticiple: "begun", translation: "commencer", pronunciationBase: "bi-guin", pronunciationPreterit: "bi-gan", pronunciationPastParticiple: "bi-geun" },
  { base: "bend", preterit: "bent", pastParticiple: "bent", translation: "se courber / plier", pronunciationBase: "bend", pronunciationPreterit: "bent", pronunciationPastParticiple: "bent" },
  { base: "bet", preterit: "bet", pastParticiple: "bet", translation: "parier", pronunciationBase: "bet", pronunciationPreterit: "bet", pronunciationPastParticiple: "bet" },
  { base: "bind", preterit: "bound", pastParticiple: "bound", translation: "lier / relier", pronunciationBase: "baïnd", pronunciationPreterit: "baownd", pronunciationPastParticiple: "baownd" },
  { base: "bite", preterit: "bit", pastParticiple: "bitten", translation: "mordre", pronunciationBase: "baït", pronunciationPreterit: "bit", pronunciationPastParticiple: "bi-teun" },
  { base: "bleed", preterit: "bled", pastParticiple: "bled", translation: "saigner", pronunciationBase: "bliid", pronunciationPreterit: "bled", pronunciationPastParticiple: "bled" },
  { base: "blow", preterit: "blew", pastParticiple: "blown", translation: "souffler", pronunciationBase: "blo", pronunciationPreterit: "bloo", pronunciationPastParticiple: "blone" },
  { base: "break", preterit: "broke", pastParticiple: "broken", translation: "casser", pronunciationBase: "breïk", pronunciationPreterit: "brok", pronunciationPastParticiple: "bro-keun" },
  { base: "breed", preterit: "bred", pastParticiple: "bred", translation: "élever (des animaux)", pronunciationBase: "briid", pronunciationPreterit: "bred", pronunciationPastParticiple: "bred" },
  { base: "bring", preterit: "brought", pastParticiple: "brought", translation: "apporter", pronunciationBase: "bring", pronunciationPreterit: "brot", pronunciationPastParticiple: "brot" },
  { base: "broadcast", preterit: "broadcast", pastParticiple: "broadcast", translation: "diffuser / émettre", pronunciationBase: "brod-kast", pronunciationPreterit: "brod-kast", pronunciationPastParticiple: "brod-kast" },
  { base: "build", preterit: "built", pastParticiple: "built", translation: "construire", pronunciationBase: "bild", pronunciationPreterit: "bilt", pronunciationPastParticiple: "bilt" },
  { base: "burn", preterit: "burnt / burned", pastParticiple: "burnt / burned", translation: "brûler", pronunciationBase: "beurn", pronunciationPreterit: "beurnt", pronunciationPastParticiple: "beurnt" },
  { base: "burst", preterit: "burst", pastParticiple: "burst", translation: "éclater", pronunciationBase: "beurst", pronunciationPreterit: "beurst", pronunciationPastParticiple: "beurst" },
  { base: "buy", preterit: "bought", pastParticiple: "bought", translation: "acheter", pronunciationBase: "baï", pronunciationPreterit: "bot", pronunciationPastParticiple: "bot" },
  { base: "cast", preterit: "cast", pastParticiple: "cast", translation: "jeter / lancer", pronunciationBase: "kast", pronunciationPreterit: "kast", pronunciationPastParticiple: "kast" },
  { base: "catch", preterit: "caught", pastParticiple: "caught", translation: "attraper", pronunciationBase: "katch", pronunciationPreterit: "kot", pronunciationPastParticiple: "kot" },
  { base: "choose", preterit: "chose", pastParticiple: "chosen", translation: "choisir", pronunciationBase: "tchooz", pronunciationPreterit: "tchoz", pronunciationPastParticiple: "tcho-zeun" },
  { base: "cling", preterit: "clung", pastParticiple: "clung", translation: "s'accrocher", pronunciationBase: "kling", pronunciationPreterit: "kleung", pronunciationPastParticiple: "kleung" },
  { base: "come", preterit: "came", pastParticiple: "come", translation: "venir", pronunciationBase: "keum", pronunciationPreterit: "keïm", pronunciationPastParticiple: "keum" },
  { base: "cost", preterit: "cost", pastParticiple: "cost", translation: "coûter", pronunciationBase: "kost", pronunciationPreterit: "kost", pronunciationPastParticiple: "kost" },
  { base: "creep", preterit: "crept", pastParticiple: "crept", translation: "ramper", pronunciationBase: "kriip", pronunciationPreterit: "krept", pronunciationPastParticiple: "krept" },
  { base: "cut", preterit: "cut", pastParticiple: "cut", translation: "couper", pronunciationBase: "keut", pronunciationPreterit: "keut", pronunciationPastParticiple: "keut" },
  { base: "deal", preterit: "dealt", pastParticiple: "dealt", translation: "distribuer / négocier", pronunciationBase: "diil", pronunciationPreterit: "delt", pronunciationPastParticiple: "delt" },
  { base: "dig", preterit: "dug", pastParticiple: "dug", translation: "creuser", pronunciationBase: "dig", pronunciationPreterit: "deug", pronunciationPastParticiple: "deug" },
  { base: "do", preterit: "did", pastParticiple: "done", translation: "faire", pronunciationBase: "doo", pronunciationPreterit: "did", pronunciationPastParticiple: "deunn" },
  { base: "draw", preterit: "drew", pastParticiple: "drawn", translation: "dessiner / tirer", pronunciationBase: "dro", pronunciationPreterit: "droo", pronunciationPastParticiple: "dron" },
  { base: "dream", preterit: "dreamt / dreamed", pastParticiple: "dreamt / dreamed", translation: "rêver", pronunciationBase: "driim", pronunciationPreterit: "dremt", pronunciationPastParticiple: "dremt" },
  { base: "drink", preterit: "drank", pastParticiple: "drunk", translation: "boire", pronunciationBase: "drink", pronunciationPreterit: "drank", pronunciationPastParticiple: "dreunk" },
  { base: "drive", preterit: "drove", pastParticiple: "driven", translation: "conduire", pronunciationBase: "draïv", pronunciationPreterit: "drov", pronunciationPastParticiple: "dri-veun" },
  { base: "eat", preterit: "ate", pastParticiple: "eaten", translation: "manger", pronunciationBase: "iit", pronunciationPreterit: "eït", pronunciationPastParticiple: "ii-teun" },
  { base: "fall", preterit: "fell", pastParticiple: "fallen", translation: "tomber", pronunciationBase: "fol", pronunciationPreterit: "fel", pronunciationPastParticiple: "fo-leun" },
  { base: "feed", preterit: "fed", pastParticiple: "fed", translation: "nourrir", pronunciationBase: "fiid", pronunciationPreterit: "fed", pronunciationPastParticiple: "fed" },
  { base: "feel", preterit: "felt", pastParticiple: "felt", translation: "ressentir / éprouver", pronunciationBase: "fiil", pronunciationPreterit: "felt", pronunciationPastParticiple: "felt" },
  { base: "fight", preterit: "fought", pastParticiple: "fought", translation: "se battre", pronunciationBase: "faït", pronunciationPreterit: "fot", pronunciationPastParticiple: "fot" },
  { base: "find", preterit: "found", pastParticiple: "found", translation: "trouver", pronunciationBase: "faïnd", pronunciationPreterit: "faownd", pronunciationPastParticiple: "faownd" },
  { base: "flee", preterit: "fled", pastParticiple: "fled", translation: "s'enfuir", pronunciationBase: "flii", pronunciationPreterit: "fled", pronunciationPastParticiple: "fled" },
  { base: "fly", preterit: "flew", pastParticiple: "flown", translation: "voler (dans les airs)", pronunciationBase: "flaï", pronunciationPreterit: "floo", pronunciationPastParticiple: "flone" },
  { base: "forbid", preterit: "forbade", pastParticiple: "forbidden", translation: "interdire", pronunciationBase: "for-bid", pronunciationPreterit: "for-bad", pronunciationPastParticiple: "for-bi-deun" },
  { base: "forget", preterit: "forgot", pastParticiple: "forgotten", translation: "oublier", pronunciationBase: "for-guet", pronunciationPreterit: "for-got", pronunciationPastParticiple: "for-go-teun" },
  { base: "forgive", preterit: "forgave", pastParticiple: "forgiven", translation: "pardonner", pronunciationBase: "for-guiv", pronunciationPreterit: "for-gueïv", pronunciationPastParticiple: "for-gui-veun" },
  { base: "freeze", preterit: "froze", pastParticiple: "frozen", translation: "geler / congeler", pronunciationBase: "friiz", pronunciationPreterit: "froz", pronunciationPastParticiple: "fro-zeun" },
  { base: "get", preterit: "got", pastParticiple: "got / gotten", translation: "obtenir / devenir", pronunciationBase: "guet", pronunciationPreterit: "got", pronunciationPastParticiple: "got / go-teun" },
  { base: "give", preterit: "gave", pastParticiple: "given", translation: "donner", pronunciationBase: "guiv", pronunciationPreterit: "gueïv", pronunciationPastParticiple: "gui-veun" },
  { base: "go", preterit: "went", pastParticiple: "gone", translation: "aller", pronunciationBase: "go", pronunciationPreterit: "went", pronunciationPastParticiple: "gon" },
  { base: "grow", preterit: "grew", pastParticiple: "grown", translation: "grandir / pousser", pronunciationBase: "gro", pronunciationPreterit: "groo", pronunciationPastParticiple: "grone" },
  { base: "hang", preterit: "hung", pastParticiple: "hung", translation: "pendre / accrocher", pronunciationBase: "hang", pronunciationPreterit: "heung", pronunciationPastParticiple: "heung" },
  { base: "have", preterit: "had", pastParticiple: "had", translation: "avoir", pronunciationBase: "hav", pronunciationPreterit: "had", pronunciationPastParticiple: "had" },
  { base: "hear", preterit: "heard", pastParticiple: "heard", translation: "entendre", pronunciationBase: "hir", pronunciationPreterit: "heurd", pronunciationPastParticiple: "heurd" },
  { base: "hide", preterit: "hid", pastParticiple: "hidden", translation: "se cacher", pronunciationBase: "haïd", pronunciationPreterit: "hid", pronunciationPastParticiple: "hi-deun" },
  { base: "hit", preterit: "hit", pastParticiple: "hit", translation: "frapper / toucher", pronunciationBase: "hit", pronunciationPreterit: "hit", pronunciationPastParticiple: "hit" },
  { base: "hold", preterit: "held", pastParticiple: "held", translation: "tenir", pronunciationBase: "hold", pronunciationPreterit: "held", pronunciationPastParticiple: "held" },
  { base: "hurt", preterit: "hurt", pastParticiple: "hurt", translation: "blesser / faire mal", pronunciationBase: "heurt", pronunciationPreterit: "heurt", pronunciationPastParticiple: "heurt" },
  { base: "keep", preterit: "kept", pastParticiple: "kept", translation: "garder", pronunciationBase: "kiip", pronunciationPreterit: "kept", pronunciationPastParticiple: "kept" },
  { base: "kneel", preterit: "knelt", pastParticiple: "knelt", translation: "s'agenouiller", pronunciationBase: "niil", pronunciationPreterit: "nelt", pronunciationPastParticiple: "nelt" },
  { base: "know", preterit: "knew", pastParticiple: "known", translation: "savoir / connaître", pronunciationBase: "no", pronunciationPreterit: "niou", pronunciationPastParticiple: "none" },
  { base: "lay", preterit: "laid", pastParticiple: "laid", translation: "poser à plat", pronunciationBase: "leï", pronunciationPreterit: "leïd", pronunciationPastParticiple: "leïd" },
  { base: "lead", preterit: "led", pastParticiple: "led", translation: "mener / guider", pronunciationBase: "liid", pronunciationPreterit: "led", pronunciationPastParticiple: "led" },
  { base: "lean", preterit: "leant / leaned", pastParticiple: "leant / leaned", translation: "se pencher", pronunciationBase: "liin", pronunciationPreterit: "lent", pronunciationPastParticiple: "lent" },
  { base: "leap", preterit: "leapt / leaped", pastParticiple: "leapt / leaped", translation: "sauter", pronunciationBase: "liip", pronunciationPreterit: "lept", pronunciationPastParticiple: "lept" },
  { base: "learn", preterit: "learnt / learned", pastParticiple: "learnt / learned", translation: "apprendre", pronunciationBase: "leurn", pronunciationPreterit: "leurnt", pronunciationPastParticiple: "leurnt" },
  { base: "leave", preterit: "left", pastParticiple: "left", translation: "quitter / laisser", pronunciationBase: "liiv", pronunciationPreterit: "left", pronunciationPastParticiple: "left" },
  { base: "lend", preterit: "lent", pastParticiple: "lent", translation: "prêter", pronunciationBase: "lend", pronunciationPreterit: "lent", pronunciationPastParticiple: "lent" },
  { base: "let", preterit: "let", pastParticiple: "let", translation: "laisser / permettre", pronunciationBase: "let", pronunciationPreterit: "let", pronunciationPastParticiple: "let" },
  { base: "lie", preterit: "lay", pastParticiple: "lain", translation: "être couché / s'allonger", pronunciationBase: "laï", pronunciationPreterit: "leï", pronunciationPastParticiple: "leïn" },
  { base: "light", preterit: "lit / lighted", pastParticiple: "lit / lighted", translation: "allumer", pronunciationBase: "laït", pronunciationPreterit: "lit", pronunciationPastParticiple: "lit" },
  { base: "lose", preterit: "lost", pastParticiple: "lost", translation: "perdre", pronunciationBase: "looz", pronunciationPreterit: "lost", pronunciationPastParticiple: "lost" },
  { base: "make", preterit: "made", pastParticiple: "made", translation: "fabriquer / faire", pronunciationBase: "meïk", pronunciationPreterit: "meïd", pronunciationPastParticiple: "meïd" },
  { base: "mean", preterit: "meant", pastParticiple: "meant", translation: "vouloir dire / signifier", pronunciationBase: "miin", pronunciationPreterit: "ment", pronunciationPastParticiple: "ment" },
  { base: "meet", preterit: "met", pastParticiple: "met", translation: "rencontrer", pronunciationBase: "miit", pronunciationPreterit: "met", pronunciationPastParticiple: "met" },
  { base: "pay", preterit: "paid", pastParticiple: "paid", translation: "payer", pronunciationBase: "peï", pronunciationPreterit: "peïd", pronunciationPastParticiple: "peïd" },
  { base: "put", preterit: "put", pastParticiple: "put", translation: "mettre", pronunciationBase: "pout", pronunciationPreterit: "pout", pronunciationPastParticiple: "pout" },
  { base: "read", preterit: "read", pastParticiple: "read", translation: "lire", pronunciationBase: "riid", pronunciationPreterit: "red", pronunciationPastParticiple: "red" },
  { base: "ride", preterit: "rode", pastParticiple: "ridden", translation: "monter (vélo, cheval)", pronunciationBase: "raïd", pronunciationPreterit: "rod", pronunciationPastParticiple: "ri-deun" },
  { base: "ring", preterit: "rang", pastParticiple: "rung", translation: "sonner", pronunciationBase: "ring", pronunciationPreterit: "rang", pronunciationPastParticiple: "reung" },
  { base: "rise", preterit: "rose", pastParticiple: "risen", translation: "se lever / augmenter", pronunciationBase: "raïz", pronunciationPreterit: "roz", pronunciationPastParticiple: "ri-zeun" },
  { base: "run", preterit: "ran", pastParticiple: "run", translation: "courir", pronunciationBase: "reunn", pronunciationPreterit: "ran", pronunciationPastParticiple: "reunn" },
  { base: "say", preterit: "said", pastParticiple: "said", translation: "dire", pronunciationBase: "seï", pronunciationPreterit: "sed", pronunciationPastParticiple: "sed" },
  { base: "see", preterit: "saw", pastParticiple: "seen", translation: "voir", pronunciationBase: "sii", pronunciationPreterit: "so", pronunciationPastParticiple: "siin" },
  { base: "seek", preterit: "sought", pastParticiple: "sought", translation: "chercher", pronunciationBase: "siik", pronunciationPreterit: "sot", pronunciationPastParticiple: "sot" },
  { base: "sell", preterit: "sold", pastParticiple: "sold", translation: "vendre", pronunciationBase: "sel", pronunciationPreterit: "sold", pronunciationPastParticiple: "sold" },
  { base: "send", preterit: "sent", pastParticiple: "sent", translation: "envoyer", pronunciationBase: "send", pronunciationPreterit: "sent", pronunciationPastParticiple: "sent" },
  { base: "set", preterit: "set", pastParticiple: "set", translation: "fixer / installer", pronunciationBase: "set", pronunciationPreterit: "set", pronunciationPastParticiple: "set" },
  { base: "shake", preterit: "shook", pastParticiple: "shaken", translation: "secouer", pronunciationBase: "cheïk", pronunciationPreterit: "chook", pronunciationPastParticiple: "cheï-keun" },
  { base: "shine", preterit: "shone", pastParticiple: "shone", translation: "briller", pronunciationBase: "chaïn", pronunciationPreterit: "chon", pronunciationPastParticiple: "chon" },
  { base: "shoot", preterit: "shot", pastParticiple: "shot", translation: "tirer (arme) / filmer", pronunciationBase: "choot", pronunciationPreterit: "chot", pronunciationPastParticiple: "chot" },
  { base: "show", preterit: "showed", pastParticiple: "shown", translation: "montrer", pronunciationBase: "cho", pronunciationPreterit: "chod", pronunciationPastParticiple: "chone" },
  { base: "shrink", preterit: "shrank", pastParticiple: "shrunk", translation: "rétrécir", pronunciationBase: "chrink", pronunciationPreterit: "chrank", pronunciationPastParticiple: "chreunk" },
  { base: "shut", preterit: "shut", pastParticiple: "shut", translation: "fermer", pronunciationBase: "cheut", pronunciationPreterit: "cheut", pronunciationPastParticiple: "cheut" },
  { base: "sing", preterit: "sang", pastParticiple: "sung", translation: "chanter", pronunciationBase: "sing", pronunciationPreterit: "sang", pronunciationPastParticiple: "seung" },
  { base: "sink", preterit: "sank", pastParticiple: "sunk", translation: "couler / sombrer", pronunciationBase: "sink", pronunciationPreterit: "sank", pronunciationPastParticiple: "seunk" },
  { base: "sit", preterit: "sat", pastParticiple: "sat", translation: "s'asseoir", pronunciationBase: "sit", pronunciationPreterit: "sat", pronunciationPastParticiple: "sat" },
  { base: "sleep", preterit: "slept", pastParticiple: "slept", translation: "dormir", pronunciationBase: "sliip", pronunciationPreterit: "slept", pronunciationPastParticiple: "slept" },
  { base: "slide", preterit: "slid", pastParticiple: "slid", translation: "glisser", pronunciationBase: "slaïd", pronunciationPreterit: "slid", pronunciationPastParticiple: "slid" },
  { base: "smell", preterit: "smelt / smelled", pastParticiple: "smelt / smelled", translation: "sentir (odeur)", pronunciationBase: "smel", pronunciationPreterit: "smelt", pronunciationPastParticiple: "smelt" },
  { base: "speak", preterit: "spoke", pastParticiple: "spoken", translation: "parler", pronunciationBase: "spiik", pronunciationPreterit: "spok", pronunciationPastParticiple: "spo-keun" },
  { base: "speed", preterit: "sped", pastParticiple: "sped", translation: "aller vite", pronunciationBase: "spiid", pronunciationPreterit: "sped", pronunciationPastParticiple: "sped" },
  { base: "spend", preterit: "spent", pastParticiple: "spent", translation: "passer (du temps) / dépenser", pronunciationBase: "spend", pronunciationPreterit: "spent", pronunciationPastParticiple: "spent" },
  { base: "spit", preterit: "spat", pastParticiple: "spat", translation: "cracher", pronunciationBase: "spit", pronunciationPreterit: "spat", pronunciationPastParticiple: "spat" },
  { base: "split", preterit: "split", pastParticiple: "split", translation: "fendre / diviser", pronunciationBase: "split", pronunciationPreterit: "split", pronunciationPastParticiple: "split" },
  { base: "spoil", preterit: "spoilt / spoiled", pastParticiple: "spoilt / spoiled", translation: "gâcher / gâter", pronunciationBase: "spoïl", pronunciationPreterit: "spoïlt", pronunciationPastParticiple: "spoïlt" },
  { base: "spread", preterit: "spread", pastParticiple: "spread", translation: "répandre / étaler", pronunciationBase: "spred", pronunciationPreterit: "spred", pronunciationPastParticiple: "spred" },
  { base: "spring", preterit: "sprang", pastParticiple: "sprung", translation: "bondir", pronunciationBase: "spring", pronunciationPreterit: "sprang", pronunciationPastParticiple: "spreung" },
  { base: "stand", preterit: "stood", pastParticiple: "stood", translation: "être debout", pronunciationBase: "stand", pronunciationPreterit: "stood", pronunciationPastParticiple: "stood" },
  { base: "steal", preterit: "stole", pastParticiple: "stolen", translation: "voler / dérober", pronunciationBase: "stiil", pronunciationPreterit: "stol", pronunciationPastParticiple: "sto-leun" },
  { base: "stick", preterit: "stuck", pastParticiple: "stuck", translation: "coller", pronunciationBase: "stik", pronunciationPreterit: "steuk", pronunciationPastParticiple: "steuk" },
  { base: "sting", preterit: "stung", pastParticiple: "stung", translation: "piquer", pronunciationBase: "sting", pronunciationPreterit: "steung", pronunciationPastParticiple: "steung" },
  { base: "stink", preterit: "stank", pastParticiple: "stunk", translation: "puer", pronunciationBase: "stink", pronunciationPreterit: "stank", pronunciationPastParticiple: "steunk" },
  { base: "strike", preterit: "struck", pastParticiple: "struck", translation: "frapper / gréver", pronunciationBase: "straïk", pronunciationPreterit: "streuk", pronunciationPastParticiple: "streuk" },
  { base: "swear", preterit: "swore", pastParticiple: "sworn", translation: "jurer", pronunciationBase: "swer", pronunciationPreterit: "swor", pronunciationPastParticiple: "sworn" },
  { base: "sweep", preterit: "swept", pastParticiple: "swept", translation: "balayer", pronunciationBase: "swiip", pronunciationPreterit: "swept", pronunciationPastParticiple: "swept" },
  { base: "swim", preterit: "swam", pastParticiple: "swum", translation: "nager", pronunciationBase: "swim", pronunciationPreterit: "swam", pronunciationPastParticiple: "sweum" },
  { base: "swing", preterit: "swung", pastParticiple: "swung", translation: "se balancer", pronunciationBase: "swing", pronunciationPreterit: "sweung", pronunciationPastParticiple: "sweung" },
  { base: "take", preterit: "took", pastParticiple: "taken", translation: "prendre", pronunciationBase: "teïk", pronunciationPreterit: "took", pronunciationPastParticiple: "teï-keun" },
  { base: "teach", preterit: "taught", pastParticiple: "taught", translation: "enseigner", pronunciationBase: "tiitch", pronunciationPreterit: "tot", pronunciationPastParticiple: "tot" },
  { base: "tear", preterit: "tore", pastParticiple: "torn", translation: "déchirer", pronunciationBase: "ter", pronunciationPreterit: "tor", pronunciationPastParticiple: "torn" },
  { base: "tell", preterit: "told", pastParticiple: "told", translation: "dire / raconter", pronunciationBase: "tel", pronunciationPreterit: "told", pronunciationPastParticiple: "told" },
  { base: "think", preterit: "thought", pastParticiple: "thought", translation: "penser", pronunciationBase: "think", pronunciationPreterit: "thot", pronunciationPastParticiple: "thot" },
  { base: "throw", preterit: "threw", pastParticiple: "thrown", translation: "jeter", pronunciationBase: "thro", pronunciationPreterit: "throo", pronunciationPastParticiple: "throne" },
  { base: "understand", preterit: "understood", pastParticiple: "understood", translation: "comprendre", pronunciationBase: "eun-deur-stand", pronunciationPreterit: "eun-deur-stood", pronunciationPastParticiple: "eun-deur-stood" },
  { base: "wake", preterit: "woke", pastParticiple: "woken", translation: "se réveiller", pronunciationBase: "weïk", pronunciationPreterit: "wok", pronunciationPastParticiple: "wo-keun" },
  { base: "wear", preterit: "wore", pastParticiple: "worn", translation: "porter (des vêtements)", pronunciationBase: "wer", pronunciationPreterit: "wor", pronunciationPastParticiple: "worn" },
  { base: "win", preterit: "won", pastParticiple: "won", translation: "gagner", pronunciationBase: "win", pronunciationPreterit: "weun", pronunciationPastParticiple: "weun" },
  { base: "write", preterit: "wrote", pastParticiple: "written", translation: "écrire", pronunciationBase: "raït", pronunciationPreterit: "rot", pronunciationPastParticiple: "ri-teun" },
];

export default function IrregularVerbsTab() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [learned, setLearned] = useState<Record<string, boolean>>(() => loadFromStorage(STORAGE_KEYS.learnedIrregularVerbs, {}));

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.learnedIrregularVerbs, learned);
  }, [learned]);

  const filtered = useMemo(
    () => irregularVerbs.filter((item) =>
      item.base.toLowerCase().includes(search.toLowerCase()) ||
      item.preterit.toLowerCase().includes(search.toLowerCase()) ||
      item.pastParticiple.toLowerCase().includes(search.toLowerCase()) ||
      item.translation.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  useEffect(() => {
    if (cardIndex >= filtered.length) {
      setCardIndex(Math.max(0, filtered.length - 1));
    }
  }, [filtered.length, cardIndex]);

  const totalLearned = Object.values(learned).filter(Boolean).length;
  const currentCard = filtered[Math.min(cardIndex, Math.max(filtered.length - 1, 0))];

  const toggleReveal = (base: string) => setRevealed((prev) => ({ ...prev, [base]: !prev[base] }));
  const hideCard = (base: string) => setRevealed((prev) => ({ ...prev, [base]: false }));
  const toggleLearned = (base: string) => setLearned((prev) => ({ ...prev, [base]: !prev[base] }));

  const speakVerb = (item: IrregularVerb) => {
    stopSpeech();
    speakSequence([
      { text: item.base, lang: "en-US" },
      { text: "Prétérit", lang: "fr-FR" },
      { text: item.preterit, lang: "en-US" },
      { text: "Participe passé", lang: "fr-FR" },
      { text: item.pastParticiple, lang: "en-US" },
      { text: "Traduction", lang: "fr-FR" },
      { text: item.translation, lang: "fr-FR" },
    ]);
  };

  return (
    <div>
      <div style={{ padding: "20px 0", borderBottom: "1px solid #1E293B" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#F1F5F9" }}>
              <FiActivity style={{ color: "#38BDF8" }} /> Verbes Irréguliers
            </h2>
            <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#94A3B8" }}>
              Liste essentielle des verbes irréguliers anglais avec leurs formes et traductions.
            </p>
            <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#64748B" }}>
              Le futur se forme avec will + base verbale, sans forme irrégulière spécifique.
            </p>
          </div>
          <div style={{ width: "100%", maxWidth: "640px" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#94A3B8" }}>
              {totalLearned} / {irregularVerbs.length} verbes appris
            </p>
            <div style={{ marginTop: "8px", width: "100%", background: "#1E293B", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
              <div style={{ width: (totalLearned / irregularVerbs.length * 100) + "%", background: "#3B82F6", height: "100%", borderRadius: "4px", transition: "width 0.3s" }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 0", borderBottom: "1px solid #1E293B" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaSearch style={{ color: "#94A3B8", minWidth: "18px" }} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCardIndex(0); }}
              placeholder="Rechercher un verbe, un prétérit, un participe ou une traduction..."
              style={{ width: "100%", boxSizing: "border-box", background: "#1E293B", border: "1px solid #334155", borderRadius: "10px", padding: "12px 14px", color: "#E2E8F0", fontSize: "14px", outline: "none" }}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
            <button
              onClick={() => setView("list")}
              style={{ flex: 1, minWidth: "120px", background: view === "list" ? "#3B82F6" : "#1E293B", border: "none", borderRadius: "8px", padding: "8px", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: view === "list" ? 700 : 400, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
            >
              <FaListUl /> Liste
            </button>
            <button
              onClick={() => setView("cards")}
              style={{ flex: 1, minWidth: "120px", background: view === "cards" ? "#3B82F6" : "#1E293B", border: "none", borderRadius: "8px", padding: "8px", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: view === "cards" ? 700 : 400, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
            >
              <FaThLarge /> Cartes
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 0" }}>
        <p style={{ margin: 0, color: "#94A3B8", fontSize: "13px" }}>
          {filtered.length} résultat(s) · {totalLearned} appris
        </p>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: "16px 0" }}>
          <p style={{ color: "#94A3B8", fontSize: "14px" }}>Aucun verbe irrégulier ne correspond à votre recherche.</p>
        </div>
      ) : view === "list" ? (
        <div style={{ padding: "0 0 80px" }}>
          <div style={{ display: "grid", gap: "10px" }}>
            {filtered.map((item) => {
              const isRevealed = revealed[item.base];
              const isLearned = learned[item.base];
              return (
                <div
                  key={item.base}
                  onClick={() => toggleReveal(item.base)}
                  style={{
                    background: isLearned ? "#052e16" : "#1E293B",
                    border: "1px solid " + (isLearned ? "#10B981" : "#334155"),
                    borderRadius: "10px",
                    padding: "12px 14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: "16px", color: isLearned ? "#4ADE80" : "#F1F5F9" }}>
                        {item.base} <span style={{fontSize: "13px", color: "#38BDF8", fontStyle: "italic", fontWeight: 600, marginLeft: "4px"}}>[{item.pronunciationBase}]</span>
                      </span>
                      {isRevealed ? (
                        <div style={{ marginTop: "6px", fontSize: "14px", color: "#94A3B8", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                          <div style={{display: "flex", alignItems: "center", gap: "6px"}}>
                            <span>Prétérit : <span style={{ fontWeight: 700 }}>{item.preterit}</span> <span style={{fontSize: "11px", color: "#38BDF8", fontStyle: "italic", fontWeight: 600}}>[{item.pronunciationPreterit}]</span></span>
                            <span>·</span>
                            <span>Participe : <span style={{ fontWeight: 700 }}>{item.pastParticiple}</span> <span style={{fontSize: "11px", color: "#38BDF8", fontStyle: "italic", fontWeight: 600}}>[{item.pronunciationPastParticiple}]</span></span>
                          </div>
                        </div>
                      ) : (
                        <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>Appuie pour voir les formes</div>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", justifyContent: "flex-end" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleLearned(item.base); }}
                        style={{ background: isLearned ? "#10B981" : "#334155", border: "none", borderRadius: "6px", padding: "4px 8px", color: "#fff", fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                      >
                        {isLearned ? <FaCheck /> : <FaRegCircle />}
                      </button>
                      <button
                        type="button"
                        style={{ background: "#334155", border: "none", borderRadius: "6px", padding: "4px 8px", color: "#fff", fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                        onClick={(e) => { e.stopPropagation(); speakVerb(item); }}
                      >
                        <FaVolumeUp />
                      </button>
                    </div>
                  </div>
                  {isRevealed && (
                    <div style={{ margin: "8px 0 0", color: "#94A3B8", fontSize: "13px" }}>
                      <div style={{ fontWeight: 700, marginBottom: "4px" }}>Traduction :</div>
                      <div>🇫🇷 <span style={{ fontWeight: 700, color: "#E2E8F0" }}>{item.translation}</span></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ padding: "20px 0 80px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ color: "#94A3B8", fontSize: "13px", marginBottom: "8px" }}>{cardIndex + 1} / {filtered.length}</p>
          <div
            onClick={() => currentCard && toggleReveal(currentCard.base)}
            style={{
              width: "100%",
              maxWidth: "360px",
              minHeight: "240px",
              background: revealed[currentCard?.base] ? "#1E3A5F" : "#1E293B",
              border: "2px solid " + (revealed[currentCard?.base] ? "#3B82F6" : "#334155"),
              borderRadius: "16px",
              padding: "24px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: currentCard ? "pointer" : "default",
              textAlign: "center",
              transition: "all 0.3s",
              position: "relative"
            }}
          >
            {currentCard ? (
              <>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#F1F5F9", marginBottom: "4px" }}>{currentCard.base}</div>
                <div style={{ fontSize: "14px", color: "#38BDF8", fontStyle: "italic", fontWeight: 600, marginBottom: "12px" }}>[{currentCard.pronunciationBase}]</div>
                
                {revealed[currentCard.base] ? (
                  <>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#60A5FA", marginTop: "8px", marginBottom: "2px" }}>Prétérit : <span style={{ color: "#F1F5F9" }}>{currentCard.preterit}</span></div>
                    <div style={{ fontSize: "13px", color: "#38BDF8", fontStyle: "italic", fontWeight: 600, marginBottom: "10px" }}>[{currentCard.pronunciationPreterit}]</div>
                    
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#60A5FA", marginBottom: "2px" }}>Participe passé : <span style={{ color: "#F1F5F9" }}>{currentCard.pastParticiple}</span></div>
                    <div style={{ fontSize: "13px", color: "#38BDF8", fontStyle: "italic", fontWeight: 600, marginBottom: "12px" }}>[{currentCard.pronunciationPastParticiple}]</div>
                    
                    <div style={{ marginTop: "8px", color: "#E2E8F0", fontSize: "15px", borderTop: "1px solid #3B82F6", paddingTop: "12px", width: "80%" }}>
                      🇫🇷 {currentCard.translation}
                    </div>
                  </>
                ) : (
                  <p style={{ margin: "16px 0 0", color: "#64748B", fontSize: "13px" }}>Appuie pour voir les formes</p>
                )}
              </>
            ) : (
              <p style={{ margin: 0, color: "#94A3B8", fontSize: "14px" }}>Aucun verbe irrégulier à afficher.</p>
            )}
          </div>

          {currentCard && (
            <div style={{ width: "100%", maxWidth: "360px", marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {revealed[currentCard.base] && (
                <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                  <button
                    onClick={() => {
                      toggleLearned(currentCard.base);
                      hideCard(currentCard.base);
                      setCardIndex((prev) => Math.min(filtered.length - 1, prev + 1));
                    }}
                    style={{ flex: 1, background: "#10B981", border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                  >
                    <FaCheck /> Je sais
                  </button>
                  <button
                    onClick={() => {
                      hideCard(currentCard.base);
                      setCardIndex((prev) => Math.min(filtered.length - 1, prev + 1));
                    }}
                    style={{ flex: 1, background: "#EF4444", border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                  >
                    <FaTimes /> À revoir
                  </button>
                </div>
              )}
              
              <button
                type="button"
                onClick={() => speakVerb(currentCard)}
                style={{ width: "100%", background: "#334155", border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                <FaVolumeUp /> Écouter
              </button>
            </div>
          )}

          <div style={{ display: "flex", gap: "8px", marginTop: "16px", justifyContent: "center" }}>
            <button
              onClick={() => {
                if (currentCard) hideCard(currentCard.base);
                setCardIndex((prev) => Math.max(0, prev - 1));
              }}
              style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "8px", padding: "8px 16px", color: "#94A3B8", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <FaArrowLeft /> Préc
            </button>
            <button
              onClick={() => {
                if (currentCard) hideCard(currentCard.base);
                setCardIndex((prev) => Math.min(filtered.length - 1, prev + 1));
              }}
              style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "8px", padding: "8px 16px", color: "#94A3B8", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              Suiv <FaArrowRight />
            </button>
          </div>

          <div style={{ display: "flex", gap: "4px", marginTop: "16px", flexWrap: "wrap", justifyContent: "center", maxWidth: "360px" }}>
            {filtered.map((item, index) => (
              <div
                key={item.base}
                onClick={() => {
                  if (currentCard) hideCard(currentCard.base);
                  setCardIndex(index);
                }}
                style={{ width: "8px", height: "8px", borderRadius: "50%", cursor: "pointer", background: learned[item.base] ? "#10B981" : index === cardIndex ? "#3B82F6" : "#334155" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}