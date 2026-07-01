import { useState } from "react";
import WordsTab from "./components/WordsTab";
import PhrasalVerbsTab from "./components/PhrasalVerbsTab";
import IrregularVerbsTab from "./components/IrregularVerbsTab";
import ExpressionsTab from "./components/ExpressionsTab";
import ShadowingTab from "./components/ShadowingTab";

const tabs = [
  { id: "words", label: "Mots" },
  { id: "irregular", label: "Verbes irréguliers" },
  { id: "phrasal", label: "Phrasal Verbs" },
  { id: "expressions", label: "Expressions" },
  { id: "shadowing", label: "Shadowing" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("words");

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", color: "#E2E8F0", fontFamily: "'Segoe UI', sans-serif" }}>
      <header style={{ padding: "20px 16px", borderBottom: "1px solid #1E293B" }}>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#60A5FA" }}>
          learnEnglish with JihrelDev
        </h1>
        <p style={{ margin: "8px 0 0", color: "#94A3B8", fontSize: "14px" }}>
          Votre allié pour apprendre l'anglais : vocabulaire, verbes et expressions clés à portée de main.
        </p>
      </header>

      <div style={{ padding: "16px", borderBottom: "1px solid #1E293B", background: "#0B1220" }}>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flexShrink: 0,
                background: activeTab === tab.id ? "#3B82F6" : "#1E293B",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                padding: "10px 18px",
                cursor: "pointer",
                fontWeight: activeTab === tab.id ? 700 : 500,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main style={{ padding: "16px" }}>
        {activeTab === "words" && <WordsTab />}
        {activeTab === "irregular" && <IrregularVerbsTab />}
        {activeTab === "phrasal" && <PhrasalVerbsTab />}
        {activeTab === "expressions" && <ExpressionsTab />}
        {activeTab === "shadowing" && <ShadowingTab />}
      </main>
    </div>
  );
}
