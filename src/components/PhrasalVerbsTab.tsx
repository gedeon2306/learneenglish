import { useEffect, useMemo, useState } from "react";

type PhrasalVerb = {
  group: string;
  phrase: string;
  translation: string;
  example: string;
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
  { group: "BRING/CALL", phrase: "Bring up", translation: "Élever (un enfant) / Évoquer (un sujet)", example: "She brought up three kids. / Don't bring up politics." },
  { group: "BRING/CALL", phrase: "Bring back", translation: "Rapporter / Ramener", example: "Can you bring back my book?" },
  { group: "BRING/CALL", phrase: "Bring about", translation: "Entraîner / Provoquer (un changement)", example: "The new law brought about big changes." },
  { group: "BRING/CALL", phrase: "Call off", translation: "Annuler", example: "They called off the meeting." },
  { group: "BRING/CALL", phrase: "Call back", translation: "Rappeler (au téléphone)", example: "I'll call you back in 10 minutes." },

  { group: "COME/GET", phrase: "Come across", translation: "Rencontrer ou trouver par hasard", example: "I came across an old photo today." },
  { group: "COME/GET", phrase: "Come back", translation: "Revenir", example: "When are you coming back?" },
  { group: "COME/GET", phrase: "Come in", translation: "Entrer", example: "Please, come in!" },
  { group: "COME/GET", phrase: "Come up with", translation: "Inventer / Trouver (une idée, une solution)", example: "He came up with a great idea." },
  { group: "COME/GET", phrase: "Get up", translation: "Se lever", example: "I get up at 7 AM every day." },
  { group: "COME/GET", phrase: "Get along (with)", translation: "Bien s'entendre (avec quelqu'un)", example: "Do you get along with your boss?" },
  { group: "COME/GET", phrase: "Get over", translation: "Se remettre (d'une maladie, d'une rupture)", example: "She finally got over her breakup." },
  { group: "COME/GET", phrase: "Get away", translation: "S'échapper / S'enfuir", example: "The thief got away." },
  { group: "COME/GET", phrase: "Get in / out", translation: "Monter / Descendre (voiture, taxi)", example: "Get in the car." },
  { group: "COME/GET", phrase: "Get on / off", translation: "Monter / Descendre (train, bus, avion, vélo)", example: "Get off the bus at the next stop." },
  { group: "COME/GET", phrase: "Get ahead", translation: "Progresser dans la vie / prendre de l'avance", example: "She works hard to get ahead in her career." },

  { group: "GIVE/GO", phrase: "Give up", translation: "Abandonner / Arrêter (une habitude)", example: "Never give up! / I gave up smoking." },
  { group: "GIVE/GO", phrase: "Give back", translation: "Rendre / Restituer", example: "Give me back my pen." },
  { group: "GIVE/GO", phrase: "Give away", translation: "Donner (gratuitement) / Révéler (un secret)", example: "They are giving away free tickets." },
  { group: "GIVE/GO", phrase: "Go on", translation: "Continuer", example: "Please, go on reading." },
  { group: "GIVE/GO", phrase: "Go out", translation: "Sortir (faire la fête, se promener)", example: "Do you want to go out tonight?" },
  { group: "GIVE/GO", phrase: "Go off", translation: "Sonner (alarme) / Exploser / Tourner (nourriture)", example: "My alarm went off at 6 AM. / The milk went off." },

  { group: "LOOK/TAKE", phrase: "Look for", translation: "Chercher", example: "I'm looking for my keys." },
  { group: "LOOK/TAKE", phrase: "Look after", translation: "S'occuper de / Prendre soin de", example: "Can you look after my dog?" },
  { group: "LOOK/TAKE", phrase: "Look forward to", translation: "Attendre avec impatience", example: "I look forward to meeting you." },
  { group: "LOOK/TAKE", phrase: "Look up", translation: "Chercher (dans un dictionnaire/sur le web)", example: "Look up the word if you don't know it." },
  { group: "LOOK/TAKE", phrase: "Look out", translation: "Faire attention", example: "Look out for the cars." },
  { group: "LOOK/TAKE", phrase: "Look into", translation: "Examiner / Étudier", example: "I'll look into the problem tomorrow." },
  { group: "LOOK/TAKE", phrase: "Look down on", translation: "Mépriser / Regarder de haut", example: "She looks down on people who don't share her views." },
  { group: "LOOK/TAKE", phrase: "Take off", translation: "Décoller (avion) OU Enlever (un vêtement)", example: "The plane takes off at noon. / Take off your shoes." },
  { group: "LOOK/TAKE", phrase: "Take over", translation: "Prendre le contrôle / Prendre la relève", example: "The manager will take over next week." },
  { group: "LOOK/TAKE", phrase: "Take up", translation: "Se mettre à (un sport, un loisir)", example: "I want to take up photography." },

  { group: "PUT/TURN", phrase: "Put on", translation: "Mettre (un vêtement, de la musique)", example: "Put on your coat, it's cold." },
  { group: "PUT/TURN", phrase: "Put off", translation: "Reporter / Remettre à plus tard", example: "Never put off until tomorrow what you can do today." },
  { group: "PUT/TURN", phrase: "Put up with", translation: "Supporter / Tolérer", example: "I can't put up with his behavior anymore." },
  { group: "PUT/TURN", phrase: "Put out", translation: "Éteindre (un feu, une cigarette)", example: "The firefighters put out the fire." },
  { group: "PUT/TURN", phrase: "Turn on / off", translation: "Allumer / Éteindre (un appareil, la lumière)", example: "Turn off the TV." },
  { group: "PUT/TURN", phrase: "Turn up / down", translation: "Augmenter / Baisser (le volume)", example: "Can you turn up the radio?" },
  { group: "PUT/TURN", phrase: "Turn out", translation: "S'avérer / Se révéler être", example: "The test turned out to be very easy." },

  { group: "BREAK/HOLD", phrase: "Break down", translation: "Tomber en panne OU Fondre en larmes", example: "My car broke down. / She broke down after the news." },
  { group: "BREAK/HOLD", phrase: "Break up", translation: "Se séparer / Rompre", example: "They decided to break up." },
  { group: "BREAK/HOLD", phrase: "Break out", translation: "Se déclarer / Éclater (guerre, incendie, épidémie)", example: "A fire broke out in the building." },
  { group: "BREAK/HOLD", phrase: "Hold on", translation: "Patienter / Attendre (souvent au téléphone)", example: "Hold on a minute, please." },
  { group: "BREAK/HOLD", phrase: "Hold up", translation: "Retarder OU Braquer / Voler", example: "I was held up in traffic. / They held up a bank." },

  { group: "KEEP/RUN", phrase: "Keep on", translation: "Continuer à (faire quelque chose)", example: "Keep on trying, don't give up!" },
  { group: "KEEP/RUN", phrase: "Keep up (with)", translation: "Maintenir le rythme / Rester au même niveau", example: "It's hard to keep up with the technology." },
  { group: "KEEP/RUN", phrase: "Run out (of)", translation: "Manquer de / Ne plus avoir de", example: "We are running out of time / milk." },
  { group: "KEEP/RUN", phrase: "Run into", translation: "Croiser / Rencontrer par hasard (quelqu'un)", example: "I ran into an old friend at the supermarket." },
  { group: "KEEP/RUN", phrase: "Run over", translation: "Écraser ou renverser (avec un véhicule)", example: "The dog was almost run over by a car." },

  { group: "SET/FALL", phrase: "Set up", translation: "Installer / Configurer / Créer (une entreprise)", example: "She wants to set up her own business." },
  { group: "SET/FALL", phrase: "Set off", translation: "Prendre la route / Se mettre en route", example: "We need to set off early tomorrow." },
  { group: "SET/FALL", phrase: "Fall apart", translation: "Tomber en morceaux / S'effondrer", example: "Their marriage is falling apart." },
  { group: "SET/FALL", phrase: "Fall behind", translation: "Prendre du retard", example: "He fell behind with his schoolwork." },

  { group: "AUTRES", phrase: "Blow up", translation: "Exploser / Faire sauter OU Gonfler", example: "The bomb blew up. / Blow up the balloons." },
  { group: "AUTRES", phrase: "Cheer up", translation: "Redonner le sourire / Reprendre courage", example: "Cheer up! Things will get better." },
  { group: "AUTRES", phrase: "Drop off", translation: "Déposer (quelqu'un ou quelque chose en voiture)", example: "Can you drop me off at the station?" },
  { group: "AUTRES", phrase: "Find out", translation: "Découvrir / Apprendre (une information)", example: "I need to find out what happened." },
  { group: "AUTRES", phrase: "Grow up", translation: "Grandir / Devenir adulte", example: "I grew up in Paris." },
  { group: "AUTRES", phrase: "Hang up", translation: "Raccrocher (le téléphone)", example: "Don't hang up on me!" },
  { group: "AUTRES", phrase: "Show up", translation: "Arriver / Se pointer / Faire son apparition", example: "He didn't show up at the party." },
  { group: "AUTRES", phrase: "Work out", translation: "Faire du sport OU Trouver une solution / Fonctionner", example: "I work out three times a week. / Everything will work out." },
  { group: "AUTRES", phrase: "Look out", translation: "Faire attention", example: "Look out for the cars." },
  { group: "AUTRES", phrase: "Take after", translation: "Ressembler à (un parent)", example: "She takes after her mother." },
  { group: "AUTRES", phrase: "Break in", translation: "Entrer par effraction / Faire une pause", example: "Someone tried to break in last night." },
  { group: "AUTRES", phrase: "Turn down", translation: "Refuser / Baisser (le volume)", example: "She turned down the job offer." },
  { group: "AUTRES", phrase: "Go over", translation: "Revoir / Examiner", example: "Let's go over the plan once more." },
  { group: "AUTRES", phrase: "Put away", translation: "Ranger / Mettre de côté", example: "Please put away your toys." },
];

export default function PhrasalVerbsTab() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [learned, setLearned] = useState<Record<string, boolean>>({});

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
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCardIndex(0); }}
            placeholder="🔍 Rechercher un phrasal verb, traduction ou exemple..."
            style={{ width: "100%", boxSizing: "border-box", background: "#1E293B", border: "1px solid #334155", borderRadius: "10px", padding: "12px 14px", color: "#E2E8F0", fontSize: "14px", outline: "none" }}
          />
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
            <button
              onClick={() => setView("list")}
              style={{ flex: 1, minWidth: "120px", background: view === "list" ? "#3B82F6" : "#1E293B", border: "none", borderRadius: "8px", padding: "8px", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: view === "list" ? 700 : 400 }}
            >
              📋 Liste
            </button>
            <button
              onClick={() => setView("cards")}
              style={{ flex: 1, minWidth: "120px", background: view === "cards" ? "#3B82F6" : "#1E293B", border: "none", borderRadius: "8px", padding: "8px", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: view === "cards" ? 700 : 400 }}
            >
              🃏 Cartes
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
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 700, fontSize: "16px", color: isLearned ? "#4ADE80" : "#F1F5F9" }}>{item.phrase}</span>
                          {isRevealed ? (
                            <div style={{ marginTop: "4px", fontSize: "14px", color: "#94A3B8" }}>
                              🇫🇷 {item.translation}
                            </div>
                          ) : (
                            <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>Appuie pour voir la traduction</div>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleLearned(item.phrase); }}
                          style={{ background: isLearned ? "#10B981" : "#334155", border: "none", borderRadius: "6px", padding: "4px 8px", color: "#fff", fontSize: "14px", cursor: "pointer" }}
                        >
                          {isLearned ? "✓" : "○"}
                        </button>
                      </div>
                      {isRevealed && (
                        <p style={{ margin: "8px 0 0", color: "#94A3B8", fontSize: "13px" }}><strong>Exemple :</strong> {item.example}</p>
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
          <div style={{ width: "100%", maxWidth: "420px", textAlign: "center" }}>
            <p style={{ color: "#94A3B8", fontSize: "13px", marginBottom: "8px" }}>{cardIndex + 1} / {filtered.length}</p>
            <div
              onClick={() => currentCard && toggleReveal(currentCard.phrase)}
              style={{
                width: "100%",
                minHeight: "220px",
                background: "#1E293B",
                border: "2px solid #334155",
                borderRadius: "18px",
                padding: "24px",
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
                      <div style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "10px" }}>{currentCard.phrase}</div>
                      <div style={{ fontSize: "22px", fontWeight: 700, color: "#60A5FA" }}>{currentCard.translation}</div>
                      <p style={{ marginTop: "16px", color: "#94A3B8", fontSize: "13px" }}><strong>Exemple :</strong> {currentCard.example}</p>
                    </>
                  ) : (
                    <p style={{ margin: 0, color: "#64748B", fontSize: "13px" }}>Appuie pour voir la traduction</p>
                  )}
                </>
              ) : (
                <p style={{ margin: 0, color: "#94A3B8", fontSize: "14px" }}>Aucun phrasal verb à afficher.</p>
              )}
            </div>
            {currentCard && (
              <div style={{ display: "flex", gap: "12px", marginTop: "16px", width: "100%", maxWidth: "360px" }}>
                <button
                  onClick={() => { toggleLearned(currentCard.phrase); setRevealed((prev) => ({ ...prev, [currentCard.phrase]: false })); }}
                  style={{ flex: 1, background: "#10B981", border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
                >
                  ✓ Je sais
                </button>
                <button
                  onClick={() => { setCardIndex((prev) => Math.min(filtered.length - 1, prev + 1)); setRevealed((prev) => ({ ...prev, [currentCard.phrase]: false })); }}
                  style={{ flex: 1, background: "#EF4444", border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
                >
                  ✗ A revoir
                </button>
              </div>
            )}
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button
                onClick={() => { setCardIndex((prev) => Math.max(0, prev - 1)); setRevealed({}); }}
                style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "8px", padding: "8px 16px", color: "#94A3B8", cursor: "pointer" }}
              >
                ← Préc
              </button>
              <button
                onClick={() => { setCardIndex((prev) => Math.min(filtered.length - 1, prev + 1)); setRevealed({}); }}
                style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "8px", padding: "8px 16px", color: "#94A3B8", cursor: "pointer" }}
              >
                Suiv →
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
        </div>
      )}
    </div>
  );
}
