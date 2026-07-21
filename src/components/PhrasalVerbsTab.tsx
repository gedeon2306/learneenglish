import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaListUl, FaThLarge, FaCheck, FaRegCircle, FaTimes, FaArrowLeft, FaArrowRight, FaVolumeUp } from "react-icons/fa";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/storage";
import { speakSequence, stopSpeech } from "../utils/speech";

type PhrasalVerb = {
  group: string;
  phrase: string;
  translation: string;
  example: string;
  exampleFrench:string;
};

const groupTitles: Record<string, string> = {
  "BRING/CALL": "Autour de BRING et CALL",
  "COME/GET": "Autour de COME et GET",
  "GIVE/GO": "Autour de GIVE et GO",
  "LOOK/TAKE": "Autour de LOOK et TAKE",
  "PUT/TURN": "Autour de PUT et TURN",
  "BREAK/HOLD": "Autour de BREAK et HOLD",
  "KEEP/RUN": "Autour de KEEP et RUN",
  "SET/FALL": "Autour de SET et FALL",
  "AUTRES": "D'autres verbes indispensables du quotidien",
};

const phrasalVerbs: PhrasalVerb[] = [
  // ========== BRING / CALL ==========
  { group: "BRING/CALL", phrase: "Bring about", translation: "Entraîner / Provoquer (un changement)", example: "The new law brought about big changes.", exampleFrench: "La nouvelle loi a entraîné de grands changements." },
  { group: "BRING/CALL", phrase: "Bring back", translation: "Rapporter / Ramener", example: "Can you bring back my book?", exampleFrench: "Peux-tu me rapporter mon livre ?" },
  { group: "BRING/CALL", phrase: "Bring up", translation: "Élever (un enfant) / Évoquer (un sujet)", example: "She brought up three kids. / Don't bring up politics.", exampleFrench: "Elle a élevé trois enfants. / Ne parle pas de politique." },
  { group: "BRING/CALL", phrase: "Call back", translation: "Rappeler (au téléphone)", example: "I'll call you back in 10 minutes.", exampleFrench: "Je te rappelle dans 10 minutes." },
  { group: "BRING/CALL", phrase: "Call off", translation: "Annuler", example: "They called off the meeting.", exampleFrench: "Ils ont annulé la réunion." },

  // ========== COME / GET ==========
  { group: "COME/GET", phrase: "Come across", translation: "Rencontrer ou trouver par hasard", example: "I came across an old photo today.", exampleFrench: "Je suis tombé sur une vieille photo aujourd'hui." },
  { group: "COME/GET", phrase: "Come back", translation: "Revenir", example: "When are you coming back?", exampleFrench: "Quand reviens-tu ?" },
  { group: "COME/GET", phrase: "Come in", translation: "Entrer", example: "Please, come in!", exampleFrench: "Entrez, s'il vous plaît !" },
  { group: "COME/GET", phrase: "Come up with", translation: "Inventer / Trouver (une idée, une solution)", example: "He came up with a great idea.", exampleFrench: "Il a trouvé une excellente idée." },
  { group: "COME/GET", phrase: "Get ahead", translation: "Progresser dans la vie / prendre de l'avance", example: "She works hard to get ahead in her career.", exampleFrench: "Elle travaille dur pour progresser dans sa carrière." },
  { group: "COME/GET", phrase: "Get along (with)", translation: "Bien s'entendre (avec quelqu'un)", example: "Do you get along with your boss?", exampleFrench: "Est-ce que tu t'entends bien avec ton patron ?" },
  { group: "COME/GET", phrase: "Get away", translation: "S'échapper / S'enfuir", example: "The thief got away.", exampleFrench: "Le voleur s'est enfui." },
  { group: "COME/GET", phrase: "Get in / out", translation: "Monter / Descendre (voiture, taxi)", example: "Get in the car.", exampleFrench: "Monte dans la voiture." },
  { group: "COME/GET", phrase: "Get on / off", translation: "Monter / Descendre (train, bus, avion, vélo)", example: "Get off the bus at the next stop.", exampleFrench: "Descends du bus au prochain arrêt." },
  { group: "COME/GET", phrase: "Get over", translation: "Se remettre (d'une maladie, d'une rupture)", example: "She finally got over her breakup.", exampleFrench: "Elle s'est enfin remise de sa rupture." },
  { group: "COME/GET", phrase: "Get up", translation: "Se lever", example: "I get up at 7 AM every day.", exampleFrench: "Je me lève à 7h tous les jours." },

  // ========== GIVE / GO ==========
  { group: "GIVE/GO", phrase: "Give away", translation: "Donner (gratuitement) / Révéler (un secret)", example: "They are giving away free tickets.", exampleFrench: "Ils distribuent des billets gratuits." },
  { group: "GIVE/GO", phrase: "Give back", translation: "Rendre / Restituer", example: "Give me back my pen.", exampleFrench: "Rends-moi mon stylo." },
  { group: "GIVE/GO", phrase: "Give up", translation: "Abandonner / Arrêter (une habitude)", example: "Never give up! / I gave up smoking.", exampleFrench: "N'abandonne jamais ! / J'ai arrêté de fumer." },
  { group: "GIVE/GO", phrase: "Go off", translation: "Sonner (alarme) / Exploser / Tourner (nourriture)", example: "My alarm went off at 6 AM. / The milk went off.", exampleFrench: "Mon réveil a sonné à 6h du matin. / Le lait a tourné." },
  { group: "GIVE/GO", phrase: "Go on", translation: "Continuer", example: "Please, go on reading.", exampleFrench: "Continue ta lecture, s'il te plaît." },
  { group: "GIVE/GO", phrase: "Go out", translation: "Sortir (faire la fête, se promener)", example: "Do you want to go out tonight?", exampleFrench: "Tu veux sortir ce soir ?" },

  // ========== LOOK / TAKE ==========
  { group: "LOOK/TAKE", phrase: "Look after", translation: "S'occuper de / Prendre soin de", example: "Can you look after my dog?", exampleFrench: "Peux-tu t'occuper de mon chien ?" },
  { group: "LOOK/TAKE", phrase: "Look at", translation: "Regarder", example: "Look at the board.", exampleFrench: "Regarde le tableau." },
  { group: "LOOK/TAKE", phrase: "Look down on", translation: "Mépriser / Regarder de haut", example: "She looks down on people who don't share her views.", exampleFrench: "Elle méprise les gens qui ne partagent pas ses opinions." },
  { group: "LOOK/TAKE", phrase: "Look for", translation: "Chercher", example: "I'm looking for my keys.", exampleFrench: "Je cherche mes clés." },
  { group: "LOOK/TAKE", phrase: "Look forward to", translation: "Attendre avec impatience", example: "I look forward to meeting you.", exampleFrench: "J'ai hâte de vous rencontrer." },
  { group: "LOOK/TAKE", phrase: "Look into", translation: "Examiner / Étudier", example: "I'll look into the problem tomorrow.", exampleFrench: "J'examinerai le problème demain." },
  { group: "LOOK/TAKE", phrase: "Look out", translation: "Faire attention", example: "Look out for the cars.", exampleFrench: "Fais attention aux voitures." },
  { group: "LOOK/TAKE", phrase: "Look up", translation: "Chercher (dans un dictionnaire/sur le web)", example: "Look up the word if you don't know it.", exampleFrench: "Cherche le mot si tu ne le connais pas." },
  { group: "LOOK/TAKE", phrase: "Take off", translation: "Décoller (avion) OU Enlever (un vêtement)", example: "The plane takes off at noon. / Take off your shoes.", exampleFrench: "L'avion décolle à midi. / Enlève tes chaussures." },
  { group: "LOOK/TAKE", phrase: "Take over", translation: "Prendre le contrôle / Prendre la relève", example: "The manager will take over next week.", exampleFrench: "Le directeur prendra la relève la semaine prochaine." },
  { group: "LOOK/TAKE", phrase: "Take up", translation: "Se mettre à (un sport, un loisir)", example: "I want to take up photography.", exampleFrench: "Je veux me mettre à la photographie." },
  { group: "LOOK/TAKE", phrase: "Look like", translation: "Ressembler à", example: "She looks like her mother.", exampleFrench: "Elle ressemble à sa mère." },

  // ========== PUT / TURN ==========
  { group: "PUT/TURN", phrase: "Put off", translation: "Reporter / Remettre à plus tard", example: "Never put off until tomorrow what you can do today.", exampleFrench: "Ne remets jamais à demain ce que tu peux faire aujourd'hui." },
  { group: "PUT/TURN", phrase: "Put on", translation: "Mettre (un vêtement, de la musique)", example: "Put on your coat, it's cold.", exampleFrench: "Mets ton manteau, il fait froid." },
  { group: "PUT/TURN", phrase: "Put out", translation: "Éteindre (un feu, une cigarette)", example: "The firefighters put out the fire.", exampleFrench: "Les pompiers ont éteint l'incendie." },
  { group: "PUT/TURN", phrase: "Put up with", translation: "Supporter / Tolérer", example: "I can't put up with his behavior anymore.", exampleFrench: "Je ne peux plus supporter son comportement." },
  { group: "PUT/TURN", phrase: "Turn off", translation: "Éteindre (un appareil, la lumière)", example: "Turn off the TV.", exampleFrench: "Éteins la télévision." },
  { group: "PUT/TURN", phrase: "Turn on", translation: "Allumer (un appareil, la lumière)", example: "Turn on the lights.", exampleFrench: "Allume les lumières." },
  { group: "PUT/TURN", phrase: "Turn out", translation: "S'avérer / Se révéler être", example: "The test turned out to be very easy.", exampleFrench: "Le test s'est avéré très facile." },
  { group: "PUT/TURN", phrase: "Turn up / down", translation: "Augmenter / Baisser (le volume)", example: "Can you turn up the radio?", exampleFrench: "Peux-tu monter le son de la radio ?" },

  // ========== BREAK / HOLD ==========
  { group: "BREAK/HOLD", phrase: "Break down", translation: "Tomber en panne OU Fondre en larmes", example: "My car broke down. / She broke down after the news.", exampleFrench: "Ma voiture est tombée en panne. / Elle a fondu en larmes après la nouvelle." },
  { group: "BREAK/HOLD", phrase: "Break out", translation: "Se déclarer / Éclater (guerre, incendie, épidémie)", example: "A fire broke out in the building.", exampleFrench: "Un incendie s'est déclaré dans le bâtiment." },
  { group: "BREAK/HOLD", phrase: "Break up", translation: "Se séparer / Rompre", example: "They decided to break up.", exampleFrench: "Ils ont décidé de se séparer." },
  { group: "BREAK/HOLD", phrase: "Hold on", translation: "Patienter / Attendre (souvent au téléphone)", example: "Hold on a minute, please.", exampleFrench: "Patientez une minute, s'il vous plaît." },
  { group: "BREAK/HOLD", phrase: "Hold up", translation: "Retarder OU Braquer / Voler", example: "I was held up in traffic. / They held up a bank.", exampleFrench: "J'ai été retardé par les embouteillages. / Ils ont braqué une banque." },

  // ========== KEEP / RUN ==========
  { group: "KEEP/RUN", phrase: "Keep on", translation: "Continuer à (faire quelque chose)", example: "Keep on trying, don't give up!", exampleFrench: "Continue d'essayer, n'abandonne pas !" },
  { group: "KEEP/RUN", phrase: "Keep up (with)", translation: "Maintenir le rythme / Rester au même niveau", example: "It's hard to keep up with the technology.", exampleFrench: "C'est difficile de rester à la page avec la technologie." },
  { group: "KEEP/RUN", phrase: "Run into", translation: "Croiser / Rencontrer par hasard (quelqu'un)", example: "I ran into an old friend at the supermarket.", exampleFrench: "J'ai croisé un vieil ami au supermarché." },
  { group: "KEEP/RUN", phrase: "Run out (of)", translation: "Manquer de / Ne plus avoir de", example: "We are running out of time / milk.", exampleFrench: "Nous manquons de temps / Nous n'avons plus de lait." },
  { group: "KEEP/RUN", phrase: "Run over", translation: "Écraser ou renverser (avec un véhicule)", example: "The dog was almost run over by a car.", exampleFrench: "Le chien a failli se faire écraser par une voiture." },

  // ========== SET / FALL ==========
  { group: "SET/FALL", phrase: "Fall apart", translation: "Tomber en morceaux / S'effondrer", example: "Their marriage is falling apart.", exampleFrench: "Leur mariage bat de l'aile / s'effondre." },
  { group: "SET/FALL", phrase: "Fall behind", translation: "Prendre du retard", example: "He fell behind with his schoolwork.", exampleFrench: "Il a pris du retard dans ses devoirs." },
  { group: "SET/FALL", phrase: "Set off", translation: "Prendre la route / Se mettre en route", example: "We need to set off early tomorrow.", exampleFrench: "Nous devons nous mettre en route tôt demain." },
  { group: "SET/FALL", phrase: "Set up", translation: "Installer / Configurer / Créer (une entreprise)", example: "She wants to set up her own business.", exampleFrench: "Elle veut créer sa propre entreprise." },

  // ========== AUTRES ==========
  { group: "AUTRES", phrase: "Be sick of", translation: "En avoir marre / En avoir plein le dos", example: "I am sick of this rainy weather.", exampleFrench: "J'en ai marre de ce temps pluvieux." },
  { group: "AUTRES", phrase: "Be sick on", translation: "Vomir sur (quelqu'un ou quelque chose)", example: "The baby was sick on my new shirt.", exampleFrench: "Le bébé a vomi sur ma nouvelle chemise." },
  { group: "AUTRES", phrase: "Wake up", translation: "Se réveiller", example: "I wake up at 7 AM every day.", exampleFrench: "Je me réveille à 7 heures tous les jours." },
  { group: "AUTRES", phrase: "Blow up", translation: "Exploser / Faire sauter OU Gonfler", example: "The bomb blew up. / Blow up the balloons.", exampleFrench: "La bombe a explosé. / Gonfle les ballons." },
  { group: "AUTRES", phrase: "Break in", translation: "Entrer par effraction / Faire une pause", example: "Someone tried to break in last night.", exampleFrench: "Quelqu'un a essayé d'entrer par effraction la nuit dernière." },
  { group: "AUTRES", phrase: "Cheer up", translation: "Redonner le sourire / Reprendre courage", example: "Cheer up! Things will get better.", exampleFrench: "Courage ! Ça va s'arranger." },
  { group: "AUTRES", phrase: "Deal with", translation: "Faire face à / Traiter", example: "He has to deal with many problems.", exampleFrench: "Il doit faire face à beaucoup de problèmes." },
  { group: "AUTRES", phrase: "Depend on", translation: "Dépendre de", example: "It depends on the weather.", exampleFrench: "Ça dépend du temps." },
  { group: "AUTRES", phrase: "Drop off", translation: "Déposer (quelqu'un ou quelque chose en voiture)", example: "Can you drop me off at the station?", exampleFrench: "Peux-tu me déposer à la gare ?" },
  { group: "AUTRES", phrase: "Find out", translation: "Découvrir / Apprendre (une information)", example: "I need to find out what happened.", exampleFrench: "Je dois découvrir ce qu'il s'est passé." },
  { group: "AUTRES", phrase: "Get sick of", translation: "Commencer à en avoir assez / Se lasser de", example: "You will get sick of that song if you listen to it all day.", exampleFrench: "Tu vas te lasser de cette chanson si tu l'écoutes toute la journée." },
  { group: "AUTRES", phrase: "Go over", translation: "Revoir / Examiner", example: "Let's go over the plan once more.", exampleFrench: "Revoyons le plan encore une fois." },
  { group: "AUTRES", phrase: "Grow up", translation: "Grandir / Devenir adulte", example: "I grew up in Paris.", exampleFrench: "J'ai grandi à Paris." },
  { group: "AUTRES", phrase: "Hang up", translation: "Raccrocher (le téléphone)", example: "Don't hang up on me!", exampleFrench: "Ne me raccroche pas au nez !" },
  { group: "AUTRES", phrase: "Look out", translation: "Faire attention", example: "Look out for the cars.", exampleFrench: "Fais attention aux voitures." },
  { group: "AUTRES", phrase: "Make sick", translation: "Rendre malade OU Dégoûter profondément", example: "The way he lies makes me sick.", exampleFrench: "Sa façon de mentir me dégoûte profondément." },
  { group: "AUTRES", phrase: "Put away", translation: "Ranger / Mettre de côté", example: "Please put away your toys.", exampleFrench: "S'il te plaît, range tes jouets." },
  { group: "AUTRES", phrase: "Show up", translation: "Arriver / Se pointer / Faire son apparition", example: "He didn't show up at the party.", exampleFrench: "Il ne s'est pas pointé à la fête." },
  { group: "AUTRES", phrase: "Sick up", translation: "Vomir / Rejeter (nourriture)", example: "The cat sicked up its food on the rug.", exampleFrench: "Le chat a vomi sa nourriture sur le tapis." },
  { group: "AUTRES", phrase: "Take after", translation: "Ressembler à (un parent)", example: "She takes after her mother.", exampleFrench: "Elle ressemble à sa mère." },
  { group: "AUTRES", phrase: "Talk about", translation: "Parler de", example: "Let's talk about the project.", exampleFrench: "Parlons du projet." },
  { group: "AUTRES", phrase: "Think about", translation: "Penser à / réfléchir à", example: "Think about your future.", exampleFrench: "Pense à ton avenir." },
  { group: "AUTRES", phrase: "Turn down", translation: "Refuser / Baisser (le volume)", example: "She turned down the job offer.", exampleFrench: "Elle a refusé l'offre d'emploi." },
  { group: "AUTRES", phrase: "Work on", translation: "Travailler sur", example: "I'm working on a new design.", exampleFrench: "Je travaille sur un nouveau design." },
  { group: "AUTRES", phrase: "Work out", translation: "Faire du sport OU Trouver une solution / Fonctionner", example: "I work out three times a week. / Everything will work out.", exampleFrench: "Je fais du sport trois fois par semaine. / Tout va s'arranger." },
  { group: "AUTRES", phrase: "Be into", translation: "Être intéressé par / apprécier", example: "I'm really into jazz music.", exampleFrench: "Je suis vraiment fan de jazz." },
  { group: "AUTRES", phrase: "Comply with", translation: "Se conformer à / respecter", example: "You must comply with the rules.", exampleFrench: "Tu dois te conformer aux règles." },
  { group: "AUTRES", phrase: "Hang out", translation: "Traîner / passer du temps avec", example: "We hung out at the mall yesterday.", exampleFrench: "Nous avons traîné au centre commercial hier." },
  { group: "AUTRES", phrase: "Make up (one's mind)", translation: "Se décider / faire son choix", example: "I can't make up my mind about the color.", exampleFrench: "Je n'arrive pas à me décider pour la couleur." },
  { group: "AUTRES", phrase: "Move in", translation: "Emménager", example: "We moved in last week.", exampleFrench: "Nous avons emménagé la semaine dernière." },
  { group: "AUTRES", phrase: "Move out", translation: "Déménager / quitter un logement", example: "They moved out of the city.", exampleFrench: "Ils ont déménagé hors de la ville." },
  { group: "AUTRES", phrase: "Slow down", translation: "Ralentir", example: "Slow down, you're driving too fast.", exampleFrench: "Ralentis, tu conduis trop vite." },
  { group: "AUTRES", phrase: "Hear about", translation: "Entendre parler de", example: "Have you heard about the new project?", exampleFrench: "As-tu entendu parler du nouveau projet ?" },
  { group: "AUTRES", phrase: "Clear up", translation: "Éclaircir / résoudre (un malentendu)", example: "Let's clear up this misunderstanding.", exampleFrench: "Éclaircissons ce malentendu." },
  { group: "AUTRES", phrase: "Figure out", translation: "Comprendre / trouver une solution", example: "I need to figure out how to fix this.", exampleFrench: "Je dois trouver comment réparer ça." },
  { group: "AUTRES", phrase: "Speed up", translation: "Accélérer", example: "We need to speed up the process.", exampleFrench: "Nous devons accélérer le processus." },
  { group: "AUTRES", phrase: "Roll back", translation: "Annuler / revenir en arrière (mise à jour)", example: "They rolled back the software update.", exampleFrench: "Ils ont annulé la mise à jour du logiciel." },
  { group: "AUTRES", phrase: "Dive in / into", translation: "Plonger dans / se lancer dans", example: "Let's dive into the details.", exampleFrench: "Plongeons dans les détails." },
  { group: "AUTRES", phrase: "Go through", translation: "Parcourir / traverser (une épreuve)", example: "We went through the report together.", exampleFrench: "Nous avons parcouru le rapport ensemble." },
  { group: "AUTRES", phrase: "Skim through", translation: "Parcourir rapidement / survoler", example: "I skimmed through the article.", exampleFrench: "J'ai survolé l'article." },
  { group: "AUTRES", phrase: "Reach out", translation: "Contacter / tendre la main", example: "Reach out to me if you need help.", exampleFrench: "Contacte-moi si tu as besoin d'aide." },
];

export default function PhrasalVerbsTab() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [learned, setLearned] = useState<Record<string, boolean>>(() => loadFromStorage(STORAGE_KEYS.learnedPhrasalVerbs, {}));

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.learnedPhrasalVerbs, learned);
  }, [learned]);

  const filtered = useMemo(
    () => phrasalVerbs.filter((item) =>
      item.phrase.toLowerCase().includes(search.toLowerCase()) ||
      item.translation.toLowerCase().includes(search.toLowerCase()) ||
      item.example.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  const grouped = useMemo(() => {
    const groups: Record<string, PhrasalVerb[]> = {};
    filtered.forEach((item) => {
      groups[item.group] = groups[item.group] || [];
      groups[item.group].push(item);
    });
    return groups;
  }, [filtered]);

  useEffect(() => {
    if (cardIndex >= filtered.length) {
      setCardIndex(Math.max(0, filtered.length - 1));
    }
  }, [filtered.length, cardIndex]);

  const totalLearned = Object.values(learned).filter(Boolean).length;
  const currentCard = filtered[Math.min(cardIndex, Math.max(filtered.length - 1, 0))];

  const toggleReveal = (phrase: string) => setRevealed((prev) => ({ ...prev, [phrase]: !prev[phrase] }));
  const toggleLearned = (phrase: string) => setLearned((prev) => ({ ...prev, [phrase]: !prev[phrase] }));

  const speakPhrasalVerb = (item: PhrasalVerb) => {
    stopSpeech();
    speakSequence([
      { text: item.phrase, lang: "en-US" },
      { text: item.translation, lang: "fr-FR" },
      { text: `Exemple : ${item.example}`, lang: "en-US" },
      { text: `Traduction : ${item.exampleFrench}`, lang: "fr-FR" },
    ]);
  };

  return (
    <div>
      <div style={{ padding: "20px 0", borderBottom: "1px solid #1E293B" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#F1F5F9" }}>
              Phrasal Verbs
            </h2>
            <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#94A3B8" }}>
              Liste majeure des phrasal verbs : verbes, traductions et exemples.
            </p>
          </div>
          <div style={{ width: "100%", maxWidth: "640px" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#94A3B8" }}>
              {totalLearned} / {phrasalVerbs.length} phrasal verbs appris
            </p>
            <div style={{ marginTop: "8px", width: "100%", background: "#1E293B", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
              <div style={{ width: (totalLearned / phrasalVerbs.length * 100) + "%", background: "#3B82F6", height: "100%", borderRadius: "4px", transition: "width 0.3s" }} />
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
              placeholder="Rechercher un phrasal verb, traduction ou exemple..."
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
          <p style={{ color: "#94A3B8", fontSize: "14px" }}>Aucun phrasal verb ne correspond à votre recherche.</p>
        </div>
      ) : view === "list" ? (
        <div style={{ padding: "0 0 80px" }}>
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} style={{ padding: "16px 0" }}>
              <h3 style={{ margin: 0, fontSize: "17px", color: "#F1F5F9" }}>{groupTitles[group] || group}</h3>
              <div style={{ display: "grid", gap: "10px", marginTop: "12px" }}>
                {items.map((item) => {
                  const isRevealed = revealed[item.phrase];
                  const isLearned = learned[item.phrase];
                  return (
                    <div
                      key={item.phrase}
                      onClick={() => toggleReveal(item.phrase)}
                      style={{
                        background: isLearned ? "#052e16" : "#1E293B",
                        border: "1px solid " + (isLearned ? "#10B981" : "#334155"),
                        borderRadius: "10px",
                        padding: "12px 14px",
                        marginBottom: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "12px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                          <span style={{ fontWeight: 700, fontSize: "16px", color: isLearned ? "#4ADE80" : "#F1F5F9" }}>{item.phrase}</span>
                          {isRevealed ? (
                            <div style={{ marginTop: "6px", fontSize: "14px", color: "#94A3B8", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                              🇫🇷 {item.translation}
                            </div>
                          ) : (
                            <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>Appuie pour voir la traduction</div>
                          )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", justifyContent: "flex-end" }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleLearned(item.phrase); }}
                            style={{ background: isLearned ? "#10B981" : "#334155", border: "none", borderRadius: "6px", padding: "4px 8px", color: "#fff", fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                          >
                            {isLearned ? <FaCheck /> : <FaRegCircle />}
                          </button>
                          <button
                            type="button"
                            style={{ background: "#334155", border: "none", borderRadius: "6px", padding: "4px 8px", color: "#fff", fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                            onClick={(e) => { e.stopPropagation(); speakPhrasalVerb(item); }}
                          >
                            <FaVolumeUp />
                          </button>
                        </div>
                      </div>
                      {isRevealed && (
                        <div style={{ margin: "8px 0 0", color: "#94A3B8", fontSize: "13px" }}>
                          <div style={{ fontWeight: 700, marginBottom: "6px" }}>Exemple :</div>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>🇬🇧</div> {item.example} <br />
                          <div style={{ marginTop: "4px", display: "inline-flex", alignItems: "center", gap: "6px" }}>🇫🇷</div> {item.exampleFrench}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "20px 0 80px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ color: "#94A3B8", fontSize: "13px", marginBottom: "8px" }}>{cardIndex + 1} / {filtered.length}</p>
          <div
            onClick={() => currentCard && toggleReveal(currentCard.phrase)}
            style={{
              width: "100%",
              maxWidth: "360px",
              minHeight: "200px",
              background: revealed[currentCard?.phrase] ? "#1E3A5F" : "#1E293B",
              border: "2px solid " + (revealed[currentCard?.phrase] ? "#3B82F6" : "#334155"),
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
            }}
          >
            {currentCard ? (
              <>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#F1F5F9", marginBottom: "10px" }}>{currentCard.phrase}</div>
                {revealed[currentCard.phrase] ? (
                  <>
                    <div style={{ fontSize: "22px", fontWeight: 700, color: "#60A5FA" }}>🇫🇷 {currentCard.translation}</div>
                    <div style={{ marginTop: "16px", color: "#94A3B8", fontSize: "13px", textAlign: "left", width: "100%" }}>
                      <div style={{ marginBottom: "6px", fontWeight: 700 }}>Exemple :</div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>🇬🇧</div> {currentCard.example} <br />
                      <div style={{ marginTop: "4px", display: "inline-flex", alignItems: "center", gap: "6px" }}>🇫🇷</div> {currentCard.exampleFrench}
                    </div>
                  </>
                ) : (
                  <p style={{ margin: 0, color: "#64748B", fontSize: "13px" }}>Appuie pour voir la traduction</p>
                )}
              </>
            ) : (
              <p style={{ margin: 0, color: "#94A3B8", fontSize: "14px" }}>Aucun phrasal verb à afficher.</p>
            )}
          </div>

          {currentCard && revealed[currentCard.phrase] && (
            <>
              <div style={{ display: "flex", gap: "12px", marginTop: "16px", width: "100%", maxWidth: "360px" }}>
                <button
                  onClick={() => {
                    toggleLearned(currentCard.phrase);
                    setRevealed((prev) => ({ ...prev, [currentCard.phrase]: false }));
                    setCardIndex((prev) => Math.min(filtered.length - 1, prev + 1));
                  }}
                  style={{ flex: 1, background: "#10B981", border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <FaCheck /> Je sais
                </button>
                <button
                  onClick={() => {
                    setRevealed((prev) => ({ ...prev, [currentCard.phrase]: false }));
                    setCardIndex((prev) => Math.min(filtered.length - 1, prev + 1));
                  }}
                  style={{ flex: 1, background: "#EF4444", border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <FaTimes /> A revoir
                </button>
              </div>
              <button
                type="button"
                onClick={() => currentCard && speakPhrasalVerb(currentCard)}
                style={{ width: "100%", maxWidth: "360px", background: "#334155", border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "12px" }}
              >
                <FaVolumeUp /> Son
              </button>
            </>
          )}

          <div style={{ display: "flex", gap: "8px", marginTop: "16px", justifyContent: "center" }}>
            <button
              onClick={() => { setCardIndex((prev) => Math.max(0, prev - 1)); setRevealed({}); }}
              style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "8px", padding: "8px 16px", color: "#94A3B8", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <FaArrowLeft /> Préc
            </button>
            <button
              onClick={() => { setCardIndex((prev) => Math.min(filtered.length - 1, prev + 1)); setRevealed({}); }}
              style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "8px", padding: "8px 16px", color: "#94A3B8", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              Suiv <FaArrowRight />
            </button>
          </div>

          <div style={{ display: "flex", gap: "4px", marginTop: "16px", flexWrap: "wrap", justifyContent: "center", maxWidth: "360px" }}>
            {filtered.map((item, index) => (
              <div
                key={item.phrase}
                onClick={() => { setCardIndex(index); setRevealed({}); }}
                style={{ width: "8px", height: "8px", borderRadius: "50%", cursor: "pointer", background: learned[item.phrase] ? "#10B981" : index === cardIndex ? "#3B82F6" : "#334155" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
