import { useState } from "react";
import { FaVolumeUp, FaBookOpen, FaGamepad, FaExchangeAlt } from "react-icons/fa";
import { speakSequence, stopSpeech } from "../utils/speech";

// ========== DONNÉES PÉDAGOGIQUES : TEMPS GRAMMATICAUX ==========

interface TenseInfo {
  name: string;
  category: "Present" | "Past" | "Future" | "Other";
  formulaActive: string;
  formulaPassive?: string;
  exampleActive: string;
  examplePassive?: string;
  usage: string;
}

const tensesList: TenseInfo[] = [
  // PRESENT
  {
    name: "Present Simple",
    category: "Present",
    formulaActive: "S + Base Verb (+ s/es à la 3e pers.)",
    formulaPassive: "S + am/is/are + Past Participle",
    exampleActive: "She writes a report every day.",
    examplePassive: "A report is written by her every day.",
    usage: "Habitudes, vérités générales, faits permanents.",
  },
  {
    name: "Present Continuous",
    category: "Present",
    formulaActive: "S + am/is/are + Verb-ING",
    formulaPassive: "S + am/is/are + being + Past Participle",
    exampleActive: "They are repairing the car.",
    examplePassive: "The car is being repaired by them.",
    usage: "Action en cours au moment où l'on parle.",
  },
  {
    name: "Present Perfect Simple",
    category: "Present",
    formulaActive: "S + have/has + Past Participle",
    formulaPassive: "S + have/has + been + Past Participle",
    exampleActive: "He has finished the project.",
    examplePassive: "The project has been finished by him.",
    usage: "Bilan, action passée avec un impact ou résultat dans le présent.",
  },
  {
    name: "Present Perfect Continuous",
    category: "Present",
    formulaActive: "S + have/has + been + Verb-ING",
    formulaPassive: "Non usité au passif (trop lourd)",
    exampleActive: "I have been learning English for 3 months.",
    examplePassive: "—",
    usage: "Action commencée dans le passé qui continue encore dans le présent (accent sur la durée/continuité).",
  },

  // PAST
  {
    name: "Past Simple",
    category: "Past",
    formulaActive: "S + Verb-ED (ou forme V2)",
    formulaPassive: "S + was/were + Past Participle",
    exampleActive: "They built this house in 1990.",
    examplePassive: "This house was built in 1990.",
    usage: "Action datée, terminée et coupée du présent.",
  },
  {
    name: "Past Continuous",
    category: "Past",
    formulaActive: "S + was/were + Verb-ING",
    formulaPassive: "S + was/were + being + Past Participle",
    exampleActive: "She was reading a book when I arrived.",
    examplePassive: "A book was being read when I arrived.",
    usage: "Action en cours de déroulement à un moment précis du passé.",
  },
  {
    name: "Past Perfect Simple (Plu-perfect)",
    category: "Past",
    formulaActive: "S + had + Past Participle",
    formulaPassive: "S + had + been + Past Participle",
    exampleActive: "We had left before he arrived.",
    examplePassive: "The decision had been made before the meeting.",
    usage: "Action passée antérieure à une autre action passée.",
  },
  {
    name: "Past Perfect Continuous",
    category: "Past",
    formulaActive: "S + had + been + Verb-ING",
    formulaPassive: "Non usité au passif",
    exampleActive: "She had been waiting for 2 hours before the bus came.",
    examplePassive: "—",
    usage: "Durée d'une action passée qui s'est déroulée jusqu'à un autre point du passé.",
  },

  // FUTURE
  {
    name: "Future Simple (WILL)",
    category: "Future",
    formulaActive: "S + will + Base Verb",
    formulaPassive: "S + will be + Past Participle",
    exampleActive: "The team will launch the app next week.",
    examplePassive: "The app will be launched next week.",
    usage: "Décision spontanée, prédiction, promesse.",
  },
  {
    name: "Future Intentional (GOING TO)",
    category: "Future",
    formulaActive: "S + am/is/are + going to + Base Verb",
    formulaPassive: "S + am/is/are + going to be + Past Participle",
    exampleActive: "They are going to renovate the building.",
    examplePassive: "The building is going to be renovated.",
    usage: "Intention planifiée ou prédiction basée sur un indice présent.",
  },
  {
    name: "Future Continuous",
    category: "Future",
    formulaActive: "S + will be + Verb-ING",
    formulaPassive: "Rare / Non usité au passif",
    exampleActive: "This time tomorrow, I will be flying to London.",
    examplePassive: "—",
    usage: "Action qui sera en train de se dérouler à un moment précis du futur.",
  },
  {
    name: "Future Perfect Simple",
    category: "Future",
    formulaActive: "S + will have + Past Participle",
    formulaPassive: "S + will have been + Past Participle",
    exampleActive: "By 5 PM, she will have completed the exam.",
    examplePassive: "By 5 PM, the exam will have been completed.",
    usage: "Action qui sera accomplie/terminée avant un moment donné du futur.",
  },
  {
    name: "Future Perfect Continuous",
    category: "Future",
    formulaActive: "S + will have been + Verb-ING",
    formulaPassive: "Non usité au passif",
    exampleActive: "By next month, I will have been working here for 5 years.",
    examplePassive: "—",
    usage: "Durée d'une action mesurée jusqu'à un point spécifique du futur.",
  },

  // OTHER
  {
    name: "Conditional Present (WOULD)",
    category: "Other",
    formulaActive: "S + would + Base Verb",
    formulaPassive: "S + would be + Past Participle",
    exampleActive: "He would help us if he had time.",
    examplePassive: "We would be helped if he had time.",
    usage: "Hypothèse, souhait ou politesse.",
  },
  {
    name: "Imperative (Ordre / Conseil)",
    category: "Other",
    formulaActive: "Base Verb (sans sujet)",
    formulaPassive: "Let + S + be + Past Participle",
    exampleActive: "Clean your room!",
    examplePassive: "Let your room be cleaned!",
    usage: "Donner une instruction, un ordre ou un conseil.",
  },
];


// ========== GENERATEUR / CONJUGUEUR DE DÉMONSTRATION ==========

function generateConjugation(verbBase: string, tenseName: string, isPassive: boolean): string {
  const v = verbBase.toLowerCase().trim();
  if (!v) return "Entrez un verbe valide";

  // Petite logique de démonstration pour verbes simples
  const isRegular = !["eat", "write", "go", "break", "take", "do", "build"].includes(v);
  const pastForm = isRegular ? v + "ed" : v === "eat" ? "ate" : v === "write" ? "wrote" : v === "go" ? "went" : v + "ed";
  const participleForm = isRegular ? v + "ed" : v === "eat" ? "eaten" : v === "write" ? "written" : v === "go" ? "gone" : v + "ed";
  const ingForm = v.endsWith("e") ? v.slice(0, -1) + "ing" : v + "ing";

  if (!isPassive) {
    switch (tenseName) {
      case "Present Simple": return `I / You / We / They ${v} — He / She / It ${v}s`;
      case "Present Continuous": return `I am ${ingForm} | He is ${ingForm} | They are ${ingForm}`;
      case "Present Perfect Simple": return `I / You / We / They have ${participleForm} | He has ${participleForm}`;
      case "Present Perfect Continuous": return `I / You / We / They have been ${ingForm} | He has been ${ingForm}`;
      case "Past Simple": return `I / You / He / She / We / They ${pastForm}`;
      case "Past Continuous": return `I / He / She was ${ingForm} | We / They were ${ingForm}`;
      case "Past Perfect Simple": return `I / You / He / She / We / They had ${participleForm}`;
      case "Past Perfect Continuous": return `I / You / He / She / We / They had been ${ingForm}`;
      case "Future Simple (WILL)": return `I / You / He / She / We / They will ${v}`;
      case "Future Intentional (GOING TO)": return `I am going to ${v} | He is going to ${v} | They are going to ${v}`;
      case "Future Continuous": return `I / You / He / She / We / They will be ${ingForm}`;
      case "Future Perfect Simple": return `I / You / He / She / We / They will have ${participleForm}`;
      case "Future Perfect Continuous": return `I / You / He / She / We / They will have been ${ingForm}`;
      case "Conditional Present (WOULD)": return `I / You / He / She / We / They would ${v}`;
      case "Imperative (Ordre / Conseil)": return `${v.toUpperCase()}! / Don't ${v}!`;
      default: return `${v}`;
    }
  } else {
    switch (tenseName) {
      case "Present Simple": return `It is ${participleForm} / They are ${participleForm}`;
      case "Present Continuous": return `It is being ${participleForm}`;
      case "Present Perfect Simple": return `It has been ${participleForm}`;
      case "Past Simple": return `It was ${participleForm} / They were ${participleForm}`;
      case "Past Continuous": return `It was being ${participleForm}`;
      case "Past Perfect Simple": return `It had been ${participleForm}`;
      case "Future Simple (WILL)": return `It will be ${participleForm}`;
      case "Future Intentional (GOING TO)": return `It is going to be ${participleForm}`;
      case "Future Perfect Simple": return `It will have been ${participleForm}`;
      case "Conditional Present (WOULD)": return `It would be ${participleForm}`;
      default: return "Forme passive non usitée ou trop lourde à ce temps.";
    }
  }
}

// ========== COMPOSANT PRINCIPAL ==========

export default function ConjugationLessonTab() {
  const [activeTab, setActiveTab] = useState<"tenses" | "verbs" | "practice">("tenses");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // État du conjugueur interactif
  const [customVerb, setCustomVerb] = useState<string>("work");
  const [selectedTense, setSelectedTense] = useState<string>("Present Perfect Continuous");
  const [isPassiveMode, setIsPassiveMode] = useState<boolean>(false);

  const speakText = (text: string) => {
    stopSpeech();
    speakSequence([{ text, lang: "en-US" }]);
  };

  const filteredTenses = tensesList.filter(
    (t) => categoryFilter === "All" || t.category === categoryFilter
  );

  return (
    <div style={{ color: "#F1F5F9", paddingBottom: "80px" }}>
      {/* En-tête */}
      <div style={{ padding: "20px 0", borderBottom: "1px solid #1E293B", textAlign: "center" }}>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <FaBookOpen style={{ color: "#38BDF8" }} /> Conjugaison Anglaise Complète
        </h2>
        <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#94A3B8" }}>
          Temps grammaticaux, Voix Active / Passive, Verbes Irréguliers & Phrasal Verbs.
        </p>

        {/* Boutons de navigation */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "16px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("tenses")}
            style={{
              background: activeTab === "tenses" ? "#3B82F6" : "#1E293B",
              border: "none",
              borderRadius: "8px",
              padding: "8px 14px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FaBookOpen /> Les Temps & Le Passif
          </button>
          <button
            onClick={() => setActiveTab("practice")}
            style={{
              background: activeTab === "practice" ? "#3B82F6" : "#1E293B",
              border: "none",
              borderRadius: "8px",
              padding: "8px 14px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FaGamepad /> Conju-Générateur
          </button>
        </div>
      </div>

      {/* TAB 1 : LES TEMPS GRAMMATICAUX ET VOIX PASSSIVE */}
      {activeTab === "tenses" && (
        <div style={{ padding: "16px 0", display: "grid", gap: "20px" }}>
          {/* Filtres par catégories */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            {["All", "Present", "Past", "Future", "Other"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  background: categoryFilter === cat ? "#38BDF8" : "#0F172A",
                  color: categoryFilter === cat ? "#0F172A" : "#94A3B8",
                  border: "1px solid #1E293B",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {cat === "All" ? "Tous" : cat}
              </button>
            ))}
          </div>

          {/* Cartes des temps */}
          <div style={{ display: "grid", gap: "16px" }}>
            {filteredTenses.map((tense, idx) => (
              <div
                key={idx}
                style={{
                  background: "#1E293B",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #334155",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h3 style={{ margin: 0, fontSize: "17px", color: "#60A5FA" }}>{tense.name}</h3>
                  <span
                    style={{
                      background: "#0F172A",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      color: "#FACC15",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {tense.category}
                  </span>
                </div>

                <div style={{ fontSize: "12px", color: "#CBD5E1", marginBottom: "12px" }}>
                  💡 <strong>Usage :</strong> {tense.usage}
                </div>

                {/* Formules et exemples Actifs / Passifs */}
                <div style={{ display: "grid", gap: "10px" }}>
                  {/* VOIX ACTIVE */}
                  <div
                    onClick={() => speakText(tense.exampleActive)}
                    style={{
                      background: "#0F172A",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      cursor: "pointer",
                    //   borderLeft: "4px solid #38BDF8",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ textAlign: "center", width: "100%" }}>
                      <div style={{ fontSize: "11px", color: "#38BDF8", fontWeight: 700, textTransform: "uppercase" }}>
                        Voix Active : <span style={{ color: "#94A3B8" }}>{tense.formulaActive}</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: "14px", marginTop: "4px" }}>
                        "{tense.exampleActive}"
                      </div>
                    </div>
                    <FaVolumeUp style={{ color: "#64748B", flexShrink: 0, marginLeft: "10px" }} />
                  </div>

                  {/* VOIX PASSIVE */}
                  {tense.formulaPassive && (
                    <div
                      onClick={() => tense.examplePassive && speakText(tense.examplePassive)}
                      style={{
                        background: "#0F172A",
                        borderRadius: "8px",
                        padding: "10px 12px",
                        cursor: tense.examplePassive !== "—" ? "pointer" : "default",
                        // borderLeft: "4px solid #F59E0B",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ textAlign: "center", width: "100%" }}>
                        <div style={{ fontSize: "11px", color: "#F59E0B", fontWeight: 700, textTransform: "uppercase" }}>
                          Voix Passive : <span style={{ color: "#94A3B8" }}>{tense.formulaPassive}</span>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: "14px", marginTop: "4px" }}>
                          {tense.examplePassive !== "—" ? `"${tense.examplePassive}"` : "— Non usité —"}
                        </div>
                      </div>
                      {tense.examplePassive !== "—" && (
                        <FaVolumeUp style={{ color: "#64748B", flexShrink: 0, marginLeft: "10px" }} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2 : CONJU-GÉNÉRATEUR INTERACTIF */}
      {activeTab === "practice" && (
        <div style={{ padding: "20px 0" }}>
          <div style={{ background: "#1E293B", borderRadius: "16px", padding: "20px", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: "18px", color: "#F8FAFC", textAlign: "center" }}>
              Générateur de Conjugaison
            </h3>
            <p style={{ fontSize: "13px", color: "#94A3B8", textAlign: "center", margin: "0 0 20px" }}>
              Saisis un verbe, choisis le temps grammatical et bascule entre la voix active et passive.
            </p>

            {/* Formulaire de contrôle */}
            <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "#94A3B8", display: "block", marginBottom: "4px" }}>Verbe à l'infinitif (Base Verb) :</label>
                <input
                  type="text"
                  value={customVerb}
                  onChange={(e) => setCustomVerb(e.target.value)}
                  placeholder="Ex: work, eat, write, play..."
                  style={{
                    width: "100%",
                    background: "#0F172A",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    padding: "10px",
                    color: "#FFF",
                    fontSize: "16px",
                    fontWeight: 700,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#94A3B8", display: "block", marginBottom: "4px" }}>Temps Grammatical :</label>
                <select
                  value={selectedTense}
                  onChange={(e) => setSelectedTense(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#0F172A",
                    border: "1px solid #334155",
                    color: "#FFF",
                    padding: "10px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  {tensesList.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bouton de bascule Voix Active / Passive */}
              <button
                onClick={() => setIsPassiveMode(!isPassiveMode)}
                style={{
                  background: isPassiveMode ? "#F59E0B" : "#38BDF8",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "#0F172A",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <FaExchangeAlt /> Basculer vers la Voix {isPassiveMode ? "Active" : "Passive"}
              </button>
            </div>

            {/* Résultat traduit */}
            <div
              style={{
                background: "#0F172A",
                borderRadius: "12px",
                padding: "18px",
                textAlign: "center",
                border: "1px solid #1E293B",
              }}
            >
              <div style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>
                Conjugaison ({isPassiveMode ? "Voix Passive" : "Voix Active"}) :
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#38BDF8", margin: "10px 0" }}>
                "{generateConjugation(customVerb, selectedTense, isPassiveMode)}"
              </div>

              <button
                onClick={() => speakText(generateConjugation(customVerb, selectedTense, isPassiveMode))}
                style={{
                  marginTop: "6px",
                  background: "#10B981",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaVolumeUp /> Écouter la prononciation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}