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
};

const irregularVerbs: IrregularVerb[] = [
  { base: "arise", preterit: "arose", pastParticiple: "arisen", translation: "survenir / s'élever" },
  { base: "awake", preterit: "awoke", pastParticiple: "awoken", translation: "se réveiller" },
  { base: "be (am/is/are)", preterit: "was/were", pastParticiple: "been", translation: "être" },
  { base: "bear", preterit: "bore", pastParticiple: "borne", translation: "porter / supporter" },
  { base: "beat", preterit: "beat", pastParticiple: "beaten", translation: "battre" },
  { base: "become", preterit: "became", pastParticiple: "become", translation: "devenir" },
  { base: "begin", preterit: "began", pastParticiple: "begun", translation: "commencer" },
  { base: "bend", preterit: "bent", pastParticiple: "bent", translation: "se courber / plier" },
  { base: "bet", preterit: "bet", pastParticiple: "bet", translation: "parier" },
  { base: "bind", preterit: "bound", pastParticiple: "bound", translation: "lier / relier" },
  { base: "bite", preterit: "bit", pastParticiple: "bitten", translation: "mordre" },
  { base: "bleed", preterit: "bled", pastParticiple: "bled", translation: "saigner" },
  { base: "blow", preterit: "blew", pastParticiple: "blown", translation: "souffler" },
  { base: "break", preterit: "broke", pastParticiple: "broken", translation: "casser" },
  { base: "breed", preterit: "bred", pastParticiple: "bred", translation: "élever (des animaux)" },
  { base: "bring", preterit: "brought", pastParticiple: "brought", translation: "apporter" },
  { base: "broadcast", preterit: "broadcast", pastParticiple: "broadcast", translation: "diffuser / émettre" },
  { base: "build", preterit: "built", pastParticiple: "built", translation: "construire" },
  { base: "burn", preterit: "burnt / burned", pastParticiple: "burnt / burned", translation: "brûler" },
  { base: "burst", preterit: "burst", pastParticiple: "burst", translation: "éclater" },
  { base: "buy", preterit: "bought", pastParticiple: "bought", translation: "acheter" },
  { base: "cast", preterit: "cast", pastParticiple: "cast", translation: "jeter / lancer" },
  { base: "catch", preterit: "caught", pastParticiple: "caught", translation: "attraper" },
  { base: "choose", preterit: "chose", pastParticiple: "chosen", translation: "choisir" },
  { base: "cling", preterit: "clung", pastParticiple: "clung", translation: "s'accrocher" },
  { base: "come", preterit: "came", pastParticiple: "come", translation: "venir" },
  { base: "cost", preterit: "cost", pastParticiple: "cost", translation: "coûter" },
  { base: "creep", preterit: "crept", pastParticiple: "crept", translation: "ramper" },
  { base: "cut", preterit: "cut", pastParticiple: "cut", translation: "couper" },
  { base: "deal", preterit: "dealt", pastParticiple: "dealt", translation: "distribuer / négocier" },
  { base: "dig", preterit: "dug", pastParticiple: "dug", translation: "creuser" },
  { base: "do", preterit: "did", pastParticiple: "done", translation: "faire" },
  { base: "draw", preterit: "drew", pastParticiple: "drawn", translation: "dessiner / tirer" },
  { base: "dream", preterit: "dreamt / dreamed", pastParticiple: "dreamt / dreamed", translation: "rêver" },
  { base: "drink", preterit: "drank", pastParticiple: "drunk", translation: "boire" },
  { base: "drive", preterit: "drove", pastParticiple: "driven", translation: "conduire" },
  { base: "eat", preterit: "ate", pastParticiple: "eaten", translation: "manger" },
  { base: "fall", preterit: "fell", pastParticiple: "fallen", translation: "tomber" },
  { base: "feed", preterit: "fed", pastParticiple: "fed", translation: "nourrir" },
  { base: "feel", preterit: "felt", pastParticiple: "felt", translation: "ressentir / éprouver" },
  { base: "fight", preterit: "fought", pastParticiple: "fought", translation: "se battre" },
  { base: "find", preterit: "found", pastParticiple: "found", translation: "trouver" },
  { base: "flee", preterit: "fled", pastParticiple: "fled", translation: "s'enfuir" },
  { base: "fly", preterit: "flew", pastParticiple: "flown", translation: "voler (dans les airs)" },
  { base: "forbid", preterit: "forbade", pastParticiple: "forbidden", translation: "interdire" },
  { base: "forget", preterit: "forgot", pastParticiple: "forgotten", translation: "oublier" },
  { base: "forgive", preterit: "forgave", pastParticiple: "forgiven", translation: "pardonner" },
  { base: "freeze", preterit: "froze", pastParticiple: "frozen", translation: "geler / congeler" },
  { base: "get", preterit: "got", pastParticiple: "got / gotten", translation: "obtenir / devenir" },
  { base: "give", preterit: "gave", pastParticiple: "given", translation: "donner" },
  { base: "go", preterit: "went", pastParticiple: "gone", translation: "aller" },
  { base: "grow", preterit: "grew", pastParticiple: "grown", translation: "grandir / pousser" },
  { base: "hang", preterit: "hung", pastParticiple: "hung", translation: "pendre / accrocher" },
  { base: "have", preterit: "had", pastParticiple: "had", translation: "avoir" },
  { base: "hear", preterit: "heard", pastParticiple: "heard", translation: "entendre" },
  { base: "hide", preterit: "hid", pastParticiple: "hidden", translation: "se cacher" },
  { base: "hit", preterit: "hit", pastParticiple: "hit", translation: "frapper / toucher" },
  { base: "hold", preterit: "held", pastParticiple: "held", translation: "tenir" },
  { base: "hurt", preterit: "hurt", pastParticiple: "hurt", translation: "blesser / faire mal" },
  { base: "keep", preterit: "kept", pastParticiple: "kept", translation: "garder" },
  { base: "kneel", preterit: "knelt", pastParticiple: "knelt", translation: "s'agenouiller" },
  { base: "know", preterit: "knew", pastParticiple: "known", translation: "savoir / connaître" },
  { base: "lay", preterit: "laid", pastParticiple: "laid", translation: "poser à plat" },
  { base: "lead", preterit: "led", pastParticiple: "led", translation: "mener / guider" },
  { base: "lean", preterit: "leant / leaned", pastParticiple: "leant / leaned", translation: "se pencher" },
  { base: "leap", preterit: "leapt / leaped", pastParticiple: "leapt / leaped", translation: "sauter" },
  { base: "learn", preterit: "learnt / learned", pastParticiple: "learnt / learned", translation: "apprendre" },
  { base: "leave", preterit: "left", pastParticiple: "left", translation: "quitter / laisser" },
  { base: "lend", preterit: "lent", pastParticiple: "lent", translation: "prêter" },
  { base: "let", preterit: "let", pastParticiple: "let", translation: "laisser / permettre" },
  { base: "lie", preterit: "lay", pastParticiple: "lain", translation: "être couché / s'allonger" },
  { base: "light", preterit: "lit / lighted", pastParticiple: "lit / lighted", translation: "allumer" },
  { base: "lose", preterit: "lost", pastParticiple: "lost", translation: "perdre" },
  { base: "make", preterit: "made", pastParticiple: "made", translation: "fabriquer / faire" },
  { base: "mean", preterit: "meant", pastParticiple: "meant", translation: "vouloir dire / signifier" },
  { base: "meet", preterit: "met", pastParticiple: "met", translation: "rencontrer" },
  { base: "pay", preterit: "paid", pastParticiple: "paid", translation: "payer" },
  { base: "put", preterit: "put", pastParticiple: "put", translation: "mettre" },
  { base: "read", preterit: "read", pastParticiple: "read", translation: "lire" },
  { base: "ride", preterit: "rode", pastParticiple: "ridden", translation: "monter (vélo, cheval)" },
  { base: "ring", preterit: "rang", pastParticiple: "rung", translation: "sonner" },
  { base: "rise", preterit: "rose", pastParticiple: "risen", translation: "se lever / augmenter" },
  { base: "run", preterit: "ran", pastParticiple: "run", translation: "courir" },
  { base: "say", preterit: "said", pastParticiple: "said", translation: "dire" },
  { base: "see", preterit: "saw", pastParticiple: "seen", translation: "voir" },
  { base: "seek", preterit: "sought", pastParticiple: "sought", translation: "chercher" },
  { base: "sell", preterit: "sold", pastParticiple: "sold", translation: "vendre" },
  { base: "send", preterit: "sent", pastParticiple: "sent", translation: "envoyer" },
  { base: "set", preterit: "set", pastParticiple: "set", translation: "fixer / installer" },
  { base: "shake", preterit: "shook", pastParticiple: "shaken", translation: "secouer" },
  { base: "shine", preterit: "shone", pastParticiple: "shone", translation: "briller" },
  { base: "shoot", preterit: "shot", pastParticiple: "shot", translation: "tirer (arme) / filmer" },
  { base: "show", preterit: "showed", pastParticiple: "shown", translation: "montrer" },
  { base: "shrink", preterit: "shrank", pastParticiple: "shrunk", translation: "rétrécir" },
  { base: "shut", preterit: "shut", pastParticiple: "shut", translation: "fermer" },
  { base: "sing", preterit: "sang", pastParticiple: "sung", translation: "chanter" },
  { base: "sink", preterit: "sank", pastParticiple: "sunk", translation: "couler / sombrer" },
  { base: "sit", preterit: "sat", pastParticiple: "sat", translation: "s'asseoir" },
  { base: "sleep", preterit: "slept", pastParticiple: "slept", translation: "dormir" },
  { base: "slide", preterit: "slid", pastParticiple: "slid", translation: "glisser" },
  { base: "smell", preterit: "smelt / smelled", pastParticiple: "smelt / smelled", translation: "sentir (odeur)" },
  { base: "speak", preterit: "spoke", pastParticiple: "spoken", translation: "parler" },
  { base: "speed", preterit: "sped", pastParticiple: "sped", translation: "aller vite" },
  { base: "spend", preterit: "spent", pastParticiple: "spent", translation: "passer (du temps) / dépenser" },
  { base: "spit", preterit: "spat", pastParticiple: "spat", translation: "cracher" },
  { base: "split", preterit: "split", pastParticiple: "split", translation: "fendre / diviser" },
  { base: "spoil", preterit: "spoilt / spoiled", pastParticiple: "spoilt / spoiled", translation: "gâcher / gâter" },
  { base: "spread", preterit: "spread", pastParticiple: "spread", translation: "répandre / étaler" },
  { base: "spring", preterit: "sprang", pastParticiple: "sprung", translation: "bondir" },
  { base: "stand", preterit: "stood", pastParticiple: "stood", translation: "être debout" },
  { base: "steal", preterit: "stole", pastParticiple: "stolen", translation: "voler / dérober" },
  { base: "stick", preterit: "stuck", pastParticiple: "stuck", translation: "coller" },
  { base: "sting", preterit: "stung", pastParticiple: "stung", translation: "piquer" },
  { base: "stink", preterit: "stank", pastParticiple: "stunk", translation: "puer" },
  { base: "strike", preterit: "struck", pastParticiple: "struck", translation: "frapper / gréver" },
  { base: "swear", preterit: "swore", pastParticiple: "sworn", translation: "jurer" },
  { base: "sweep", preterit: "swept", pastParticiple: "swept", translation: "balayer" },
  { base: "swim", preterit: "swam", pastParticiple: "swum", translation: "nager" },
  { base: "swing", preterit: "swung", pastParticiple: "swung", translation: "se balancer" },
  { base: "take", preterit: "took", pastParticiple: "taken", translation: "prendre" },
  { base: "teach", preterit: "taught", pastParticiple: "taught", translation: "enseigner" },
  { base: "tear", preterit: "tore", pastParticiple: "torn", translation: "déchirer" },
  { base: "tell", preterit: "told", pastParticiple: "told", translation: "dire / raconter" },
  { base: "think", preterit: "thought", pastParticiple: "thought", translation: "penser" },
  { base: "throw", preterit: "threw", pastParticiple: "thrown", translation: "jeter" },
  { base: "understand", preterit: "understood", pastParticiple: "understood", translation: "comprendre" },
  { base: "wake", preterit: "woke", pastParticiple: "woken", translation: "se réveiller" },
  { base: "wear", preterit: "wore", pastParticiple: "worn", translation: "porter (des vêtements)" },
  { base: "win", preterit: "won", pastParticiple: "won", translation: "gagner" },
  { base: "write", preterit: "wrote", pastParticiple: "written", translation: "écrire" },
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
                      <span style={{ fontWeight: 700, fontSize: "16px", color: isLearned ? "#4ADE80" : "#F1F5F9" }}>{item.base}</span>
                      {isRevealed ? (
                        <div style={{ marginTop: "6px", fontSize: "14px", color: "#94A3B8", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <span>Prétérit : <span style={{ fontWeight: 700 }}>{item.preterit}</span></span>
                          <span>·</span>
                          <span>Participe : <span style={{ fontWeight: 700 }}>{item.pastParticiple}</span></span>
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
                      <div style={{ fontWeight: 700, marginBottom: "6px" }}>Traduction :</div>
                      <div>🇫🇷 <span style={{ fontWeight: 700 }}>{item.translation}</span></div>
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
              minHeight: "220px",
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
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#F1F5F9", marginBottom: "10px" }}>{currentCard.base}</div>
                {revealed[currentCard.base] ? (
                  <>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#60A5FA", marginBottom: "8px" }}>Prétérit : <span style={{ color: "#F1F5F9" }}>{currentCard.preterit}</span></div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#60A5FA", marginBottom: "8px" }}>Participe passé : <span style={{ color: "#F1F5F9" }}>{currentCard.pastParticiple}</span></div>
                    <div style={{ marginTop: "10px", color: "#94A3B8", fontSize: "13px" }}>🇫🇷 {currentCard.translation}</div>
                  </>
                ) : (
                  <p style={{ margin: 0, color: "#64748B", fontSize: "13px" }}>Appuie pour voir les formes</p>
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