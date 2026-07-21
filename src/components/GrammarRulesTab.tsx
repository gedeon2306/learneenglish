import { useState } from "react";
import { FaVolumeUp, FaBookOpen, FaSearch, FaBolt, FaArrowRight, FaInfoCircle } from "react-icons/fa";
import { speakSequence, stopSpeech } from "../utils/speech";

// ========== DONNÉES PÉDAGOGIQUES : RÈGLES GRAMMATICALES ==========

interface Example {
  en: string;
  fr: string;
  note?: string;
}

interface GrammarRule {
  id: number;
  title: string;
  category: "Structures & Expressions" | "Comparatifs & Superlatifs" | "Quantificateurs" | "Adjectifs & Adverbes";
  formula?: string;
  explanation: string;
  keyPoints?: string[];
  examples: Example[];
}

const grammarRules: GrammarRule[] = [
  {
    id: 1,
    title: "1. L'expression 'Thanks for'",
    category: "Structures & Expressions",
    formula: "Thanks for + Verbe-ING (gérondif)  OU  Thanks for + Nom",
    explanation:
      "L'expression 'thanks for' (merci pour) est utilisée pour exprimer de la gratitude pour des actions spécifiques ou une aide reçue.",
    keyPoints: [
      "Suivi d'un verbe terminant par -ING s'il s'agit d'une action.",
      "Suivi directement d'un NOM s'il s'agit d'un objet ou d'un concept."
    ],
    examples: [
      {
        en: "Thanks for helping me with my homework.",
        fr: "Merci de m’avoir aidé pour mes devoirs.",
        note: "helping est le verbe help à la forme -ing."
      },
      {
        en: "Thanks for the advice.",
        fr: "Merci pour le conseil.",
        note: "advice est un nom."
      }
    ]
  },
  {
    id: 2,
    title: "2. Les Comparatifs de Supériorité",
    category: "Comparatifs & Superlatifs",
    formula: "Adjectif court + -er + than  |  more + Adjectif long + than",
    explanation:
      "Les comparatifs sont utilisés pour comparer deux choses ou deux personnes.",
    keyPoints: [
      "Adjectifs courts (1-2 syllabes) : ajoutez '-er' à la fin (ex: tall → taller).",
      "Adjectifs se terminant par '-y' : le 'y' devient 'i' + '-er' (ex: happy → happier).",
      "Adjectifs longs (2+ syllabes) : utilisez 'more' devant l'adjectif (ex: more interesting than)."
    ],
    examples: [
      {
        en: "He is taller than his brother.",
        fr: "Il est plus grand que son frère.",
        note: "Taller est la forme comparative de tall."
      },
      {
        en: "This box is smaller than that one.",
        fr: "Cette boîte est plus petite que celle-là.",
        note: "Smaller est la forme comparative de small."
      }
    ]
  },
  {
    id: 3,
    title: "3. Utilisation de 'Any' et 'Some'",
    category: "Quantificateurs",
    formula: "Questions / Négations → ANY  |  Affirmations / Offres → SOME",
    explanation:
      "Le mot 'any' est souvent employé dans les questions et les phrases négatives pour indiquer une quantité ou un nombre indéfini, incertain ou général. À l'inverse, 'some' est employé dans les phrases affirmatives.",
    keyPoints: [
      "ANY dans les questions : 'Do you have any questions?' (Avez-vous des questions ?)",
      "ANY dans les négations : 'I don't have any money.' (Je n'ai pas du tout d'argent.)",
      "SOME dans les affirmations : 'I have some friends.' (J'ai des amis.)"
    ],
    examples: [
      {
        en: "Do you have any questions?",
        fr: "Avez-vous des questions ?",
        note: "Question : présence de 'any'."
      },
      {
        en: "I don't have any money.",
        fr: "Je n'ai pas d'argent du tout.",
        note: "Phrase négative : 'any' souligne l'absence totale."
      },
      {
        en: "I would like some water, please.",
        fr: "J'aimerais de l'eau, s'il vous plaît.",
        note: "Phrase affirmative / demande polie : utilisation de 'some'."
      }
    ]
  },
  {
    id: 4,
    title: "4. Le mot 'Certain'",
    category: "Quantificateurs",
    formula: "Certain + Nom pluriel / dénombrable",
    explanation:
      "Le mot 'certain' est utilisé pour parler de choses ou de personnes spécifiques, mais pas de la totalité d'un groupe.",
    keyPoints: [
      "Permet de cibler une partie spécifique sans tout englober.",
      "Différent de 'all' (tous) ou 'every' (chaque)."
    ],
    examples: [
      {
        en: "Certain books are on sale.",
        fr: "Certains livres sont en solde.",
        note: "Cela signifie que seuls certains livres sont en solde, pas tous."
      }
    ]
  },
  {
    id: 5,
    title: "5. L'expression 'Think of'",
    category: "Structures & Expressions",
    formula: "Think of + Verbe-ING (gérondif)  OU  Think of + Nom",
    explanation:
      "L'expression 'think of' est utilisée pour exprimer l'idée d'envisager, d'imaginer ou de planifier de faire quelque chose.",
    keyPoints: [
      "Quand elle est suivie d'une action, le verbe se met obligatoirement à la forme -ING (gérondif).",
      "Exprime une intention, une possibilité ou une réflexion en cours."
    ],
    examples: [
      {
        en: "I'm thinking of starting a new project.",
        fr: "J'envisage de commencer un nouveau projet.",
        note: "thinking of + starting (-ing)."
      },
      {
        en: "What do you think of this idea?",
        fr: "Que penses-tu de cette idée ?",
        note: "Demander un avis sur quelque chose."
      }
    ]
  },
  {
    id: 6,
    title: "6. L'expression 'Spend time on / -ing'",
    category: "Structures & Expressions",
    formula: "Spend time ON + Nom  OU  Spend time + Verbe-ING",
    explanation:
      "Cette expression décrit l'action de consacrer du temps à une activité ou un but particulier, en considérant le temps comme une ressource investie. Le participe passé de 'spend' est 'spent'.",
    keyPoints: [
      "Suivi de 'ON' devant un nom : 'Spend time on hobbies'.",
      "Suivi directement d'un verbe en '-ING' pour une action : 'Spend time reading'.",
      "Passé : I spent 2 hours studying yesterday."
    ],
    examples: [
      {
        en: "I spend a lot of time on my hobbies.",
        fr: "Je passe beaucoup de temps sur mes loisirs.",
        note: "On + Nom (my hobbies)."
      },
      {
        en: "I spend a lot of time reading books.",
        fr: "Je passe beaucoup de temps à lire des livres.",
        note: "Spend + Verbe-ING (reading)."
      }
    ]
  },
  {
    id: 7,
    title: "7. Les Règles du Gérondif (-ING)",
    category: "Structures & Expressions",
    formula: "Préposition (for, of, on, about, in, at, without) + Verbe-ING",
    explanation:
      "En anglais, après TOUTE préposition (sauf 'to' dans certains cas d'infinitif), le verbe qui suit se met TOUJOURS au gérondif (-ING).",
    keyPoints: [
      "Après prépositions : thanks for coming, interested in learning, good at playing.",
      "Comme sujet de la phrase : 'Swimming is good for health' (Nager est bon pour la santé).",
      "Après certains verbes de goût/préférence : enjoy, mind, avoid, consider, suggest."
    ],
    examples: [
      {
        en: "Thank you for listening.",
        fr: "Merci de votre écoute / d'avoir écouté.",
        note: "Préposition 'for' + listening."
      },
      {
        en: "He is good at playing guitar.",
        fr: "Il est doué pour jouer de la guitare.",
        note: "Préposition 'at' + playing."
      }
    ]
  },
  {
    id: 8,
    title: "8. Utilisation de 'About'",
    category: "Structures & Expressions",
    formula: "About + Nom  |  About + Verbe-ING  |  To be about to + Verbe",
    explanation:
      "La préposition 'about' a deux sens principaux : 'à propos de / au sujet de' ou 'environ / à peu près'.",
    keyPoints: [
      "Sujet/Thème : 'We talk about the future' (Nous parlons du futur).",
      "Approximation : 'It takes about 10 minutes' (Cela prend environ 10 minutes).",
      "Imminence (be about to) : 'I am about to leave' (Je suis sur le point de partir)."
    ],
    examples: [
      {
        en: "What is this book about?",
        fr: "De quoi parle ce livre ?",
        note: "Sujet / Thématique."
      },
      {
        en: "How about going to the cinema?",
        fr: "Que dirais-tu d'aller au cinéma ?",
        note: "Proposition : how about + going (-ing)."
      }
    ]
  },
  {
    id: 9,
    title: "9. Les Superlatifs (Le plus / La plus)",
    category: "Comparatifs & Superlatifs",
    formula: "the + Adjectif-est  OU  the most + Adjectif long",
    explanation:
      "Le superlatif est utilisé pour indiquer que quelque chose ou quelqu'un est 'le plus' ou 'la plus' d'un groupe. Rien ne peut le dépasser.",
    keyPoints: [
      "1. Adjectifs courts (1 syllabe) : THE + Adjectif + -EST (ex: full → the fullest, tall → the tallest).",
      "2. Adjectifs longs (2+ syllabes) : THE MOST + Adjectif (ex: interesting → the most interesting, beautiful → the most beautiful)."
    ],
    examples: [
      {
        en: "He is the tallest student in the class.",
        fr: "Il est le plus grand élève de la classe.",
        note: "Adjectif court : tall → the tallest."
      },
      {
        en: "This is the most interesting book I've ever read.",
        fr: "C'est le livre le plus intéressant que j'aie jamais lu.",
        note: "Adjectif long : interesting → the most interesting."
      }
    ]
  },
  {
    id: 10,
    title: "10. Formation des Adverbes en '-LY'",
    category: "Adjectifs & Adverbes",
    formula: "Adjectif + -ly  (ex: slow → slowly, quick → quickly)",
    explanation:
      "Pour transformer un adjectif en adverbe (afin de décrire COMMENT une action est effectuée), on ajoute généralement la terminaison '-ly'.",
    keyPoints: [
      "Règle générale : Adjectif + -ly (ex: quiet → quietly, beautiful → beautifully).",
      "Adjectifs se terminant par '-y' : le 'y' devient 'i' + '-ly' (ex: happy → happily, easy → easily).",
      "Exceptions courantes : good → well, fast → fast, hard → hard."
    ],
    examples: [
      {
        en: "She speaks English fluently.",
        fr: "Elle parle anglais couramment.",
        note: "Fluently est l'adverbe issu de fluent."
      },
      {
        en: "He solved the problem easily.",
        fr: "Il a résolu le problème facilement.",
        note: "Easily est l'adverbe issu de easy (y -> i + ly)."
      }
    ]
  }
];

// ========== COMPOSANT PRINCIPAL ==========

export default function GrammarRulesTab() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Toutes");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const speakText = (text: string) => {
    stopSpeech();
    speakSequence([{ text, lang: "en-US" }]);
  };

  const categories = ["Toutes", "Structures & Expressions", "Comparatifs & Superlatifs", "Quantificateurs", "Adjectifs & Adverbes"];

  const filteredRules = grammarRules.filter((rule) => {
    const matchesCategory = selectedCategory === "Toutes" || rule.category === selectedCategory;
    const matchesSearch =
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.examples.some((ex) => ex.en.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ color: "#F1F5F9", paddingBottom: "80px" }}>
      {/* En-tête du composant */}
      <div style={{ padding: "20px 0", borderBottom: "1px solid #1E293B", textAlign: "center" }}>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <FaBookOpen style={{ color: "#38BDF8" }} /> Règles d'Or & Grammaire Anglaise
        </h2>
        <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#94A3B8" }}>
          Gérondif (-ing), comparatifs, superlatifs, quantificateurs (some/any) et expressions clés.
        </p>
      </div>

      <div style={{ padding: "16px 0", display: "grid", gap: "20px" }}>
        {/* Barre de recherche et filtres de catégories */}
        <div style={{ display: "grid", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <FaSearch style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B" }} />
            <input
              type="text"
              placeholder="Rechercher une règle ou un mot clé (ex: thanks for, superlatif, any...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 10px 10px 38px",
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#FFF",
                fontSize: "14px",
                boxSizing: "border-box",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? "#38BDF8" : "#0F172A",
                  color: selectedCategory === cat ? "#0F172A" : "#94A3B8",
                  border: "1px solid #1E293B",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des cartes de règles */}
        <div style={{ display: "grid", gap: "16px" }}>
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              style={{
                background: "#1E293B",
                borderRadius: "12px",
                padding: "18px",
                border: "1px solid #334155",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <h3 style={{ margin: 0, fontSize: "17px", color: "#60A5FA" }}>{rule.title}</h3>
                <span
                  style={{
                    background: "#0F172A",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    color: "#FACC15",
                    fontWeight: 700,
                  }}
                >
                  {rule.category}
                </span>
              </div>

              {/* Formule clé si elle existe */}
              {rule.formula && (
                <div
                  style={{
                    background: "#0F172A",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#38BDF8",
                    marginBottom: "10px",
                    border: "1px solid #1E293B",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <FaBolt style={{ color: "#FACC15", flexShrink: 0 }} />
                  <span>Formule : {rule.formula}</span>
                </div>
              )}

              <p style={{ fontSize: "13px", color: "#CBD5E1", margin: "0 0 10px", lineHeight: "1.5" }}>
                {rule.explanation}
              </p>

              {/* Points clés */}
              {rule.keyPoints && rule.keyPoints.length > 0 && (
                <div style={{ marginBottom: "12px", background: "#0F172A", padding: "10px 12px", borderRadius: "6px" }}>
                  <div style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    Points essentiels à retenir :
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#CBD5E1" }}>
                    {rule.keyPoints.map((pt, idx) => (
                      <li key={idx} style={{ marginBottom: "2px" }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exemples */}
              <div style={{ display: "grid", gap: "8px" }}>
                <div style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 700 }}>Exemples d'application :</div>
                {rule.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    onClick={() => speakText(ex.en)}
                    style={{
                      background: "#0F172A",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid #1E293B"
                    }}
                  >
                    <div style={{ textAlign: "center" , width: "100%" }}>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "#F8FAFC" }}>
                        "{ex.en}"
                      </div>
                      <div style={{ fontSize: "12px", color: "#4ADE80", marginTop: "2px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                        <FaArrowRight style={{ fontSize: "10px" }} /> {ex.fr}
                      </div><br />
                      {ex.note && (
                        <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                          <FaInfoCircle style={{ fontSize: "10px" }} /> {ex.note}
                        </div>
                      )}
                    </div>
                    <FaVolumeUp style={{ color: "#64748B", flexShrink: 0, marginLeft: "10px" }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}