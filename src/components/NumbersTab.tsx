import { useState } from "react";
import { FaVolumeUp, FaRandom, FaBookOpen, FaGamepad } from "react-icons/fa";
import { speakSequence, stopSpeech } from "../utils/speech";

// ========== DONNÉES PÉDAGOGIQUES ==========

const baseDigits = [
  { num: "0", en: "Zero", pron: "zi-ro" },
  { num: "1", en: "One", pron: "wonn" },
  { num: "2", en: "Two", pron: "too" },
  { num: "3", en: "Three", pron: "thrii" },
  { num: "4", en: "Four", pron: "for" },
  { num: "5", en: "Five", pron: "faïv" },
  { num: "6", en: "Six", pron: "six" },
  { num: "7", en: "Seven", pron: "se-ven" },
  { num: "8", en: "Eight", pron: "eït" },
  { num: "9", en: "Nine", pron: "naïn" },
];

const tensAndLarge = [
  { num: "10", en: "Ten", note: "Dix" },
  { num: "11", en: "Eleven", note: "Onze" },
  { num: "12", en: "Twelve", note: "Douze" },
  { num: "13-19", en: "-teen (ex: Fourteen)", note: "Se termine par -teen" },
  { num: "20, 30, 40...", en: "-ty (ex: Twenty, Thirty)", note: "Se termine par -ty" },
  { num: "21", en: "Twenty-one", note: "Un trait d'union entre la dizaine et l'unité" },
  { num: "100", en: "One hundred", note: "Hundred = Cent" },
  { num: "1,000", en: "One thousand", note: "Thousand = Mille (virgule pour séparer les milliers en anglais)" },
  { num: "1,000,000", en: "One million", note: "Million = Million" },
];

const decimalsExamples = [
  { num: "0.5", en: "Zero point five", note: "Ou simplement 'Point five'" },
  { num: "3.14", en: "Three point one four", note: "Chaque chiffre après le point se lit UN PAR UN !" },
  { num: "12.85", en: "Twelve point eight five", note: "Pas 'eighty-five', mais 'eight five'" },
  { num: "0.01", en: "Zero point zero one", note: "'Zero' ou parfois 'oh' (point oh one)" },
  { num: "$5.99", en: "Five dollars and ninety-nine cents", note: "Cas particulier : pour l'argent, on lit comme un nombre entier" },
];

// ========== FONCTION DE CONVERSION DÉCIMALES/NOMBRES EN ANGLAIS ==========

function numberToEnglish(numStr: string): string {
  const clean = numStr.trim();
  if (!clean || isNaN(Number(clean))) return "Invalid number";

  if (clean.includes(".")) {
    const [integerPart, decimalPart] = clean.split(".");
    const intInEn = integerToEnglish(parseInt(integerPart || "0", 10));
    
    const digitNames = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const decimalsInEn = decimalPart
      .split("")
      .map((d) => digitNames[parseInt(d, 10)] || d)
      .join(" ");

    return `${intInEn} point ${decimalsInEn}`;
  }

  return integerToEnglish(parseInt(clean, 10));
}

function integerToEnglish(n: number): string {
  if (n === 0) return "zero";
  if (n < 0) return "minus " + integerToEnglish(Math.abs(n));

  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

  if (n < 10) return ones[n];
  if (n < 20) return teens[n - 10];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? "-" + ones[n % 10] : "");
  if (n < 1000) return ones[Math.floor(n / 100)] + " hundred" + (n % 100 !== 0 ? " " + integerToEnglish(n % 100) : "");
  if (n < 1000000) return integerToEnglish(Math.floor(n / 1000)) + " thousand" + (n % 1000 !== 0 ? " " + integerToEnglish(n % 1000) : "");
  if (n < 1000000000) return integerToEnglish(Math.floor(n / 1000000)) + " million" + (n % 1000000 !== 0 ? " " + integerToEnglish(n % 1000000) : "");

  return n.toString();
}

// ========== COMPOSANT PRINCIPAL ==========

export default function NumbersTab() {
  const [activeSection, setActiveSection] = useState<"lesson" | "practice">("lesson");
  const [customInput, setCustomInput] = useState<string>("12.5");

  const speakText = (text: string) => {
    stopSpeech();
    speakSequence([{ text, lang: "en-US" }]);
  };

  const handleRandomNumber = () => {
    const isDecimal = Math.random() > 0.4;
    if (isDecimal) {
      const val = (Math.random() * 999).toFixed(2);
      setCustomInput(val);
    } else {
      const val = Math.floor(Math.random() * 10000).toString();
      setCustomInput(val);
    }
  };

  const translatedEnglish = numberToEnglish(customInput);

  return (
    <div style={{ color: "#F1F5F9", paddingBottom: "80px" }}>
      {/* En-tête */}
      <div style={{ padding: "20px 0", borderBottom: "1px solid #1E293B", textAlign: "center" }}>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>
          Les Chiffres & Nombres en Anglais
        </h2>
        <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#94A3B8" }}>
          Apprends à lire les chiffres, les grands nombres et les nombres à virgule (décimaux).
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
            <FaBookOpen /> Leçon complet
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
            <FaGamepad /> Entraînement interactif
          </button>
        </div>
      </div>

      {activeSection === "lesson" ? (
        <div style={{ padding: "16px 0", display: "grid", gap: "24px" }}>
          {/* SECTION 1: CHIFFRES DE BASE */}
          <div style={{ background: "#1E293B", borderRadius: "12px", padding: "16px", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "18px", color: "#60A5FA" }}>
              1. Les chiffres de base (0 à 9)
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}>
              {baseDigits.map((item) => (
                <div
                  key={item.num}
                  onClick={() => speakText(item.en)}
                  style={{
                    background: "#0F172A",
                    borderRadius: "8px",
                    padding: "10px",
                    textAlign: "center",
                    cursor: "pointer",
                    border: "1px solid #1E293B",
                  }}
                >
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#38BDF8" }}>{item.num}</div>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>{item.en}</div>
                  <div style={{ fontSize: "11px", color: "#94A3B8" }}>[{item.pron}]</div>
                  <FaVolumeUp style={{ marginTop: "6px", color: "#64748B", fontSize: "12px" }} />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: GRANDS NOMBRES ET RÈGLES */}
          <div style={{ background: "#1E293B", borderRadius: "12px", padding: "16px", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "18px", color: "#60A5FA" }}>
              2. Dizaines, Centaines et Milliers
            </h3>
            <div style={{ display: "grid", gap: "8px" }}>
              {tensAndLarge.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => speakText(item.en)}
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
                    <span style={{ fontWeight: 800, color: "#FACC15", marginRight: "10px" }}>{item.num}</span>
                    <span style={{ fontWeight: 600 }}>{item.en}</span>
                    <div style={{ fontSize: "12px", color: "#94A3B8" }}>{item.note}</div>
                  </div>
                  <FaVolumeUp style={{ color: "#64748B", flexShrink: 0, marginLeft: "10px" }} />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: NOMBRES À VIRGULE */}
          <div style={{ background: "#1E293B", borderRadius: "12px", padding: "16px", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px", color: "#60A5FA" }}>
              3. Les Nombres à Virgule (Decimal Numbers)
            </h3>

            {/* Règle importante */}
            <div
              style={{
                background: "#0F172A",
                borderLeft: "4px solid #38BDF8",
                padding: "10px 12px",
                borderRadius: "4px",
                marginBottom: "14px",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              <strong>Règle d'or en anglais :</strong>
              <ul style={{ margin: "4px 0 0", paddingLeft: "18px" }}>
                <li>On utilise un <strong>POINT (.)</strong> et non une virgule pour les décimales. Le point se dit <strong>"POINT"</strong>.</li>
                <li>Chaque chiffre situé <strong>après le point se lit individuellement</strong> (ex: 3.14 = Three point one four).</li>
              </ul>
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              {decimalsExamples.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => speakText(item.en)}
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
                    <span style={{ fontWeight: 800, color: "#4ADE80", marginRight: "10px" }}>{item.num}</span>
                    <span style={{ fontWeight: 600 }}>{item.en}</span>
                    <div style={{ fontSize: "12px", color: "#94A3B8" }}>{item.note}</div>
                  </div>
                  <FaVolumeUp style={{ color: "#64748B", flexShrink: 0, marginLeft: "10px" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* SECTION INTERACTIVE : CONVERTISSEUR ET TESTEUR */
        <div style={{ padding: "20px 0" }}>
          <div style={{ background: "#1E293B", borderRadius: "16px", padding: "20px", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: "18px", color: "#F8FAFC", textAlign: "center" }}>
              Générateur & Lecteur de Nombres
            </h3>
            <p style={{ fontSize: "13px", color: "#94A3B8", textAlign: "center", margin: "0 0 20px" }}>
              Tape n'importe quel chiffre ou nombre à virgule (avec un point) pour écouter sa lecture exacte en anglais.
            </p>

            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Ex: 45.89 ou 1050"
                style={{
                  flex: 1,
                  background: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  padding: "12px",
                  color: "#FFF",
                  fontSize: "18px",
                  fontWeight: 700,
                  outline: "none",
                }}
              />
              <button
                onClick={handleRandomNumber}
                title="Générer un nombre aléatoire"
                style={{
                  background: "#334155",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0 16px",
                  color: "#FFF",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                <FaRandom />
              </button>
            </div>

            {/* Résultat traduit */}
            <div
              style={{
                background: "#0F172A",
                borderRadius: "12px",
                padding: "16px",
                textAlign: "center",
                border: "1px solid #1E293B",
              }}
            >
              <div style={{ fontSize: "12px", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>
                Lecture en anglais :
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#38BDF8", margin: "8px 0" }}>
                "{translatedEnglish}"
              </div>

              <button
                onClick={() => speakText(translatedEnglish)}
                style={{
                  marginTop: "8px",
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