import { useState } from "react";
import { FaVolumeUp, FaRandom, FaBookOpen, FaGamepad, FaClock } from "react-icons/fa";
import { GoClockFill } from "react-icons/go";
import { speakSequence, stopSpeech } from "../utils/speech";

// ========== DONNÉES PÉDAGOGIQUES ==========

const timeRules = [
  {
    title: "L'heure pile",
    code: "o'clock",
    example: "8:00 → It's eight o'clock",
    explanation: "On utilise 'o'clock' uniquement pour les heures pile (quand il y a 00 minute).",
    color: "#38BDF8",
  },
  {
    title: "La demi-heure (30 min)",
    code: "half past",
    example: "8:30 → It's half past eight",
    explanation: "Signifie littéralement 'une demi-heure après [l'heure]'.",
    color: "#FACC15",
  },
  {
    title: "Le quart d'heure passé (15 min)",
    code: "quarter past",
    example: "8:15 → It's (a) quarter past eight",
    explanation: "Signifie 'un quart d'heure passé [l'heure]'.",
    color: "#4ADE80",
  },
  {
    title: "Le quart d'heure avant (45 min / -15)",
    code: "quarter to",
    example: "8:45 → It's (a) quarter to nine",
    explanation: "Attention ! On annonce le quart d'heure restant vers L'HEURE SUIVANTE (9h dans l'exemple).",
    color: "#F87171",
  },
  {
    title: "De 1 à 29 minutes",
    code: "PAST",
    example: "8:10 → It's ten past eight",
    explanation: "Structure : [Minutes] + PAST + [Heure actuelle].",
    color: "#818CF8",
  },
  {
    title: "De 31 à 59 minutes",
    code: "TO",
    example: "8:50 → It's ten to nine",
    explanation: "Structure : [Minutes restantes jusqu'à l'heure suivante] + TO + [Heure suivante].",
    color: "#FB923C",
  },
];

const periodExamples = [
  { term: "A.M.", meaning: "Du matin (Minuit à 11h59)", example: "9:00 AM = Nine in the morning" },
  { term: "P.M.", meaning: "De l'après-midi / soir (Midi à 23h59)", example: "3:00 PM = Three in the afternoon" },
  { term: "Noon / Midday", meaning: "Midi (12:00 PM)", example: "It's noon / It's midday" },
  { term: "Midnight", meaning: "Minuit (12:00 AM)", example: "It's midnight" },
];

// ========== FONCTIONS DE CONVERSION HEURE EN ANGLAIS ==========

const numbersToWords = [
  "zero", "one", "two", "three", "four", "five", "six", "seven",
  "eight", "nine", "ten", "eleven", "twelve"
];

function timeToEnglish(hour24: number, minute: number): { traditional: string; digital: string } {
  // Conversion 24h vers 12h
  const h12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const nextH12 = (hour24 + 1) % 12 === 0 ? 12 : (hour24 + 1) % 12;
  
  const currentHourWord = numbersToWords[h12];
  const nextHourWord = numbersToWords[nextH12];

  let traditional = "";

  if (minute === 0) {
    if (hour24 === 12) traditional = "It's noon";
    else if (hour24 === 0) traditional = "It's midnight";
    else traditional = `It's ${currentHourWord} o'clock`;
  } else if (minute === 15) {
    traditional = `It's quarter past ${currentHourWord}`;
  } else if (minute === 30) {
    traditional = `It's half past ${currentHourWord}`;
  } else if (minute === 45) {
    traditional = `It's quarter to ${nextHourWord}`;
  } else if (minute < 30) {
    const minWord = minuteToWord(minute);
    traditional = `It's ${minWord} past ${currentHourWord}`;
  } else {
    const minToNext = 60 - minute;
    const minWord = minuteToWord(minToNext);
    traditional = `It's ${minWord} to ${nextHourWord}`;
  }

  // Format digital simple (ex: "Eight thirty", "Eight fifteen")
  let digital = "";
  if (minute === 0) {
    digital = `It's ${currentHourWord} o'clock`;
  } else {
    const minStr = minute < 10 ? `oh ${numbersToWords[minute]}` : minuteToWord(minute);
    digital = `It's ${currentHourWord} ${minStr}`;
  }

  return { traditional, digital };
}

function minuteToWord(min: number): string {
  if (min <= 12) return numbersToWords[min];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty"];
  if (min < 20) {
    const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    return teens[min - 10];
  }
  const t = Math.floor(min / 10);
  const u = min % 10;
  return u === 0 ? tens[t] : `${tens[t]}-${numbersToWords[u]}`;
}

// ========== COMPOSANT PRINCIPAL ==========

export default function TimeTab() {
  const [activeSection, setActiveSection] = useState<"lesson" | "practice">("lesson");
  const [selectedHour, setSelectedHour] = useState<number>(8);
  const [selectedMinute, setSelectedMinute] = useState<number>(15);

  const speakText = (text: string) => {
    stopSpeech();
    speakSequence([{ text, lang: "en-US" }]);
  };

  const handleRandomTime = () => {
    const h = Math.floor(Math.random() * 24);
    // Génère des minutes multiples de 5 pour des cas pratiques fréquents
    const mOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const m = mOptions[Math.floor(Math.random() * mOptions.length)];
    setSelectedHour(h);
    setSelectedMinute(m);
  };

  const formattedTimeStr = `${selectedHour.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}`;
  const timeTranslations = timeToEnglish(selectedHour, selectedMinute);
  const periodTag = selectedHour < 12 ? "A.M." : "P.M.";

  return (
    <div style={{ color: "#F1F5F9", paddingBottom: "80px" }}>
      {/* En-tête */}
      <div style={{ padding: "20px 0", borderBottom: "1px solid #1E293B", textAlign: "center" }}>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <GoClockFill style={{ color: "#38BDF8" }} /> Dire l'Heure en Anglais
        </h2>
        <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#94A3B8" }}>
          Maîtrise les expressions indispensables : o'clock, half past, quarter to, AM et PM.
        </p>

        {/* Boutons de navigation */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
          <button
            onClick={() => setActiveSection("lesson")}
            style={{
              background: activeSection === "lesson" ? "#3B82F6" : "#1E293B",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FaBookOpen /> Cours complet
          </button>
          <button
            onClick={() => setActiveSection("practice")}
            style={{
              background: activeSection === "practice" ? "#3B82F6" : "#1E293B",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FaGamepad /> Horloge interactive
          </button>
        </div>
      </div>

      {activeSection === "lesson" ? (
        <div style={{ padding: "16px 0", display: "grid", gap: "24px" }}>
          {/* SECTION 1: LES RÈGLES DE BASE */}
          <div style={{ background: "#1E293B", borderRadius: "12px", padding: "16px", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "18px", color: "#60A5FA" }}>
              1. Les structures essentielles
            </h3>
            <div style={{ display: "grid", gap: "10px" }}>
              {timeRules.map((rule, idx) => (
                <div
                  key={idx}
                  onClick={() => speakText(rule.example.split("→")[1].trim())}
                  style={{
                    background: "#0F172A",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    border: "1px solid #1E293B",
                  }}
                >
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: rule.color }}>
                      {rule.title} <span style={{ opacity: 0.8, fontSize: "13px" }}>({rule.code})</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: "14px", margin: "4px 0" }}>
                      {rule.example}
                    </div>
                    <div style={{ fontSize: "12px", color: "#94A3B8" }}>{rule.explanation}</div>
                  </div>
                  <FaVolumeUp style={{ color: "#64748B", flexShrink: 0, marginLeft: "10px" }} />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: AM vs PM, MIDI & MINUIT */}
          <div style={{ background: "#1E293B", borderRadius: "12px", padding: "16px", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "18px", color: "#60A5FA" }}>
              2. AM / PM, Midi et Minuit
            </h3>
            <div style={{ display: "grid", gap: "8px" }}>
              {periodExamples.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => speakText(item.example)}
                  style={{
                    background: "#0F172A",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <span style={{ fontWeight: 800, color: "#FACC15", marginRight: "10px" }}>{item.term}</span>
                    <span style={{ fontWeight: 600 }}>{item.meaning}</span>
                    <div style={{ fontSize: "12px", color: "#94A3B8" }}>Ex : {item.example}</div>
                  </div>
                  <FaVolumeUp style={{ color: "#64748B", flexShrink: 0, marginLeft: "10px" }} />
                </div>
              ))}
            </div>
          </div>

          {/* ASTUCE REPERE VISUEL */}
          <div
            style={{
              background: "#0F172A",
              // borderLeft: "4px solid #38BDF8",
              padding: "12px 16px",
              borderRadius: "4px",
              fontSize: "13px",
              lineHeight: "1.6",
            }}
          >
            <strong>💡 Astuce simple pour se souvenir de PAST et TO :</strong>
            <ul style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
              <li>De <strong>1 à 29 minutes</strong> : on compte les minutes <strong>passées (PAST)</strong>.</li>
              <li>De <strong>31 à 59 minutes</strong> : on compte les minutes qu'il reste <strong>avant (TO)</strong> l'heure suivante.</li>
              <li>En anglais informel (ex: horaires de bus/avions), on peut aussi simplement lire l'heure chiffre par chiffre : <em>8:20 = "Eight twenty"</em>.</li>
            </ul>
          </div>
        </div>
      ) : (
        /* SECTION INTERACTIVE : SIMULATEUR D'HEURE */
        <div style={{ padding: "20px 0" }}>
          <div style={{ background: "#1E293B", borderRadius: "16px", padding: "20px", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: "18px", color: "#F8FAFC", textAlign: "center" }}>
              Horloge & Lecteur Vocal
            </h3>
            <p style={{ fontSize: "13px", color: "#94A3B8", textAlign: "center", margin: "0 0 20px" }}>
              Ajuste l'heure ou clique sur le dé pour tester la formulation exacte en anglais.
            </p>

            {/* Affichage Digital / Horloge */}
            <div
              style={{
                background: "#0F172A",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center",
                border: "2px solid #38BDF8",
                marginBottom: "20px",
              }}
            >
              <FaClock style={{ fontSize: "36px", color: "#38BDF8", marginBottom: "8px" }} />
              <div style={{ fontSize: "42px", fontWeight: 900, color: "#FFF", letterSpacing: "2px" }}>
                {formattedTimeStr} <span style={{ fontSize: "18px", color: "#FACC15" }}>{periodTag}</span>
              </div>
            </div>

            {/* Contrôles de sélection */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "10px", marginBottom: "20px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "#94A3B8", display: "block", marginBottom: "4px" }}>Heure (0 - 23h) :</label>
                <select
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(parseInt(e.target.value, 10))}
                  style={{
                    width: "100%",
                    background: "#0F172A",
                    border: "1px solid #334155",
                    color: "#FFF",
                    padding: "10px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >
                  {Array.from({ length: 24 }).map((_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")} h
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#94A3B8", display: "block", marginBottom: "4px" }}>Minutes :</label>
                <select
                  value={selectedMinute}
                  onChange={(e) => setSelectedMinute(parseInt(e.target.value, 10))}
                  style={{
                    width: "100%",
                    background: "#0F172A",
                    border: "1px solid #334155",
                    color: "#FFF",
                    padding: "10px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >
                  {Array.from({ length: 60 }).map((_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")} min
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  onClick={handleRandomTime}
                  title="Heure aléatoire"
                  style={{
                    background: "#334155",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    color: "#FFF",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  <FaRandom />
                </button>
              </div>
            </div>

            {/* Expressions anglaises résultantes */}
            <div style={{ display: "grid", gap: "10px" }}>
              {/* Forme Traditionnelle (Past / To / O'clock / Half) */}
              <div
                onClick={() => speakText(timeTranslations.traditional)}
                style={{
                  background: "#0F172A",
                  borderRadius: "12px",
                  padding: "14px",
                  textAlign: "center",
                  cursor: "pointer",
                  border: "1px solid #1E293B",
                }}
              >
                <div style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>
                  Forme traditionnelle (Recommandée) :
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#38BDF8", margin: "6px 0" }}>
                  "{timeTranslations.traditional}"
                </div>
                <button
                  style={{
                    background: "#10B981",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaVolumeUp /> Écouter
                </button>
              </div>

              {/* Forme Digitale / Simplifiée */}
              <div
                onClick={() => speakText(timeTranslations.digital)}
                style={{
                  background: "#0F172A",
                  borderRadius: "12px",
                  padding: "14px",
                  textAlign: "center",
                  cursor: "pointer",
                  border: "1px solid #1E293B",
                }}
              >
                <div style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>
                  Forme directe / digitale :
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#94A3B8", margin: "6px 0" }}>
                  "{timeTranslations.digital}"
                </div>
                <button
                  style={{
                    background: "#3B82F6",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaVolumeUp /> Écouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}