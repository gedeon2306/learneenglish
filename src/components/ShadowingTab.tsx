import { useEffect, useMemo, useState } from "react";
import { FaAssistiveListeningSystems } from "react-icons/fa";

type ShadowingLevel = {
  id: number;
  title: string;
  difficulty: string;
  english: string;
  french: string;
};

const levels: ShadowingLevel[] = [
  {
    id: 1,
    title: "Débutant absolu",
    difficulty: "Niveau 1",
    english: "Hi, my name is Anna. I am a student. I have a mother, a father, and a brother. My family is happy. We live in a small house. I like my house. Every morning, I get up, I eat breakfast, and I go to school. My mother is a teacher. My father works in an office. I love my family very much.",
    french: "Salut, je m'appelle Anna. Je suis étudiante. J'ai une mère, un père et un frère. Ma famille est heureuse. Nous vivons dans une petite maison. J'aime ma maison. Chaque matin, je me lève, je mange le petit-déjeuner, et je vais à l'école. Ma mère est professeure. Mon père travaille dans un bureau. J'aime beaucoup ma famille."
  },
  {
    id: 2,
    title: "Élémentaire",
    difficulty: "Niveau 2",
    english: "Today is a good day. The sun is bright and the sky is blue. I want to go outside and play with my dog. My dog is small and very kind. In the afternoon, I visit my friend. We talk, we laugh, and we eat lunch together. She has a cat, and I have a dog. After that, I go home and I read a book. At night, I watch a movie with my family before I sleep.",
    french: "Aujourd'hui est une bonne journée. Le soleil est brillant et le ciel est bleu. Je veux sortir et jouer avec mon chien. Mon chien est petit et très gentil. Dans l'après-midi, je rends visite à mon amie. Nous parlons, nous rions, et nous mangeons le déjeuner ensemble. Elle a un chat, et j'ai un chien. Après ça, je rentre à la maison et je lis un livre. Le soir, je regarde un film avec ma famille avant de dormir."
  },
  {
    id: 3,
    title: "Pré-intermédiaire",
    difficulty: "Niveau 3",
    english: "Last week, I was very busy at work. My job is difficult, but I like it. Every day, I take the bus to the office. I work with a great team, and my boss is kind. On Wednesday, we had an important meeting about a new project. I felt nervous, but I tried my best. In the evening, I was tired, so I decided to relax at home. I cooked dinner, I listened to music, and I called my sister to talk about our plans for the weekend.",
    french: "La semaine dernière, j'étais très occupé au travail. Mon travail est difficile, mais je l'aime. Chaque jour, je prends le bus pour aller au bureau. Je travaille avec une équipe formidable, et mon patron est gentil. Mercredi, nous avons eu une réunion importante sur un nouveau projet. Je me suis senti nerveux, mais j'ai fait de mon mieux. Le soir, j'étais fatigué, alors j'ai décidé de me détendre à la maison. J'ai cuisiné le dîner, j'ai écouté de la musique, et j'ai appelé ma sœur pour parler de nos plans pour le week-end."
  },
  {
    id: 4,
    title: "Intermédiaire",
    difficulty: "Niveau 4",
    english: "Yesterday, something interesting happened. I woke up early because I had an exam at school. I studied hard the night before, so I felt confident. When I arrived, I met an old friend I hadn't seen in years. We talked for a few minutes before the exam started. It was harder than I expected, but I did my best to answer every question. After the exam, my friend and I went to a restaurant to eat and to celebrate. We shared a meal, we laughed about old memories, and we promised to keep in touch this time.",
    french: "Hier, quelque chose d'intéressant s'est passé. Je me suis réveillé tôt parce que j'avais un examen à l'école. J'ai beaucoup étudié la nuit précédente, donc je me sentais confiant. Quand je suis arrivé, j'ai rencontré un vieil ami que je n'avais pas vu depuis des années. Nous avons parlé quelques minutes avant que l'examen ne commence. C'était plus difficile que prévu, mais j'ai fait de mon mieux pour répondre à chaque question. Après l'examen, mon ami et moi sommes allés dans un restaurant pour manger et célébrer. Nous avons partagé un repas, nous avons ri de vieux souvenirs, et nous avons promis de rester en contact cette fois."
  },
  {
    id: 5,
    title: "Intermédiaire fort",
    difficulty: "Niveau 5",
    english: "Last month, my brother broke his leg while he was playing football. He fell badly and had to go to the hospital. The doctor took an X-ray and told him he needed rest for several weeks. At first, he felt sad because he couldn't move much, but he understood it was necessary. My family brought him food, we spoke with him every day, and we tried to keep his spirits up. Slowly, he began to feel better. Two weeks later, he stood up on his own for the first time, and we all knew he had truly begun to heal.",
    french: "Le mois dernier, mon frère s'est cassé la jambe en jouant au football. Il est tombé mal et a dû aller à l'hôpital. Le médecin a fait une radio et lui a dit qu'il avait besoin de repos pendant plusieurs semaines. Au début, il se sentait triste parce qu'il ne pouvait pas beaucoup bouger, mais il a compris que c'était nécessaire. Ma famille lui apportait à manger, nous parlions avec lui chaque jour, et nous essayions de lui remonter le moral. Petit à petit, il a commencé à se sentir mieux. Deux semaines plus tard, il s'est levé tout seul pour la première fois, et nous avons tous su qu'il avait vraiment commencé à guérir."
  },
  {
    id: 6,
    title: "Intermédiaire avancé",
    difficulty: "Niveau 6",
    english: "When I was younger, I grew up in a small town, and I got along really well with my neighbors. Every summer, we would set off early in the morning to go camping near the lake. One year, our car broke down halfway there, and we had to look for help on the side of the road. It turned out that a kind farmer lived nearby, and he offered to fix it for us. We ended up staying at his farm for the night. Looking back, I never thought that a bad situation would turn into one of my favorite memories.",
    french: "Quand j'étais plus jeune, j'ai grandi dans une petite ville, et je m'entendais vraiment bien avec mes voisins. Chaque été, nous partions tôt le matin pour aller camper près du lac. Une année, notre voiture est tombée en panne à mi-chemin, et nous avons dû chercher de l'aide sur le bord de la route. Il s'est avéré qu'un fermier gentil habitait à proximité, et il nous a proposé de la réparer. Nous avons finalement passé la nuit dans sa ferme. En y repensant, je n'aurais jamais pensé qu'une mauvaise situation se transformerait en l'un de mes plus beaux souvenirs."
  },
  {
    id: 7,
    title: "Avancé",
    difficulty: "Niveau 7",
    english: "\"Hey, what's up? Long time no see!\" my friend said as soon as she saw me at the café. \"How's it going?\" I asked, smiling. \"So far, so good,\" she replied. We sat down, and she told me about her new job. \"Honestly, it's a piece of cake compared to my last one,\" she said. \"Good for you!\" I answered. \"By the way, are you free this weekend?\" She thought for a moment and said, \"I have no idea yet, but I'll let you know as soon as possible.\" Before leaving, she added, \"Take care, and let's keep in touch this time!\"",
    french: "« Salut, quoi de neuf ? Ça fait un bail ! » m'a dit mon amie dès qu'elle m'a vu au café. « Comment ça va ? » ai-je demandé en souriant. « Jusqu'ici, tout va bien », a-t-elle répondu. Nous nous sommes assis, et elle m'a parlé de son nouveau travail. « Honnêtement, c'est un jeu d'enfant comparé à mon dernier », a-t-elle dit. « Tant mieux pour toi ! » ai-je répondu. « Au fait, es-tu libre ce week-end ? » Elle a réfléchi un instant et a dit : « Je n'en ai aucune idée pour l'instant, mais je te le ferai savoir dès que possible. » Avant de partir, elle a ajouté : « Prends soin de toi, et restons en contact cette fois ! »"
  },
  {
    id: 8,
    title: "Avancé +",
    difficulty: "Niveau 8",
    english: "Starting a business is definitely not a piece of cake. When Marc decided to set up his own company, everyone thought he was out of his mind. He had to burn the midnight oil for months, and more than once, he got cold feet about the whole idea. To make matters worse, his first project cost him an arm and a leg, and it almost fell apart completely. Still, he refused to give up. \"Sooner or later, it will work out,\" he kept telling himself. In the end, hard work paid off, and today, his company calls the shots in its industry.",
    french: "Créer une entreprise n'est vraiment pas un jeu d'enfant. Quand Marc a décidé de créer sa propre société, tout le monde pensait qu'il était fou. Il a dû travailler tard la nuit pendant des mois, et plus d'une fois, il a eu la frousse à propos de toute cette idée. Pour ne rien arranger, son premier projet lui a coûté les yeux de la tête, et tout a failli s'effondrer complètement. Pourtant, il a refusé d'abandonner. « Tôt ou tard, ça va s'arranger », se répétait-il. Finalement, le travail acharné a porté ses fruits, et aujourd'hui, son entreprise fait la loi dans son secteur."
  },
  {
    id: 9,
    title: "Pré-avancé / quasi natif",
    difficulty: "Niveau 9",
    english: "Although the economy has faced significant challenges in recent years, various companies have managed to adapt and even thrive. According to several experts, the key factor is not simply the amount of money invested, but rather the ability to think outside the box. Furthermore, businesses that put up with short-term losses in order to focus on long-term goals tend to come out ahead in the long run. Consequently, many young entrepreneurs, instead of giving up at the first sign of difficulty, choose to bite the bullet and keep going, knowing that, at the end of the day, persistence is often what separates success from failure.",
    french: "Bien que l'économie ait connu d'importants défis ces dernières années, diverses entreprises ont réussi à s'adapter, voire à prospérer. Selon plusieurs experts, le facteur clé n'est pas simplement le montant investi, mais plutôt la capacité à sortir des sentiers battus. De plus, les entreprises qui supportent des pertes à court terme afin de se concentrer sur des objectifs à long terme ont tendance à s'en sortir mieux à long terme. Par conséquent, de nombreux jeunes entrepreneurs, au lieu d'abandonner au premier signe de difficulté, choisissent de prendre leur courage à deux mains et de continuer, sachant qu'en fin de compte, la persévérance est souvent ce qui sépare le succès de l'échec."
  },
  {
    id: 10,
    title: "Expert",
    difficulty: "Niveau 10",
    english: "By the time she turned thirty, Sarah had already been through more ups and downs than most people experience in a lifetime. She had grown up in a rough neighborhood, and although she often felt like giving up, she never let her circumstances hold her back. When her first business fell apart, she didn't cry over spilled milk; instead, she picked herself up, dusted herself off, and set off in a new direction. \"Sooner or later, hard work pays off,\" she used to say, half joking, half serious. Years later, having built a company from scratch and having overcome countless setbacks along the way, she finally understood what it truly meant to be on cloud nine. Looking back, she realized that every obstacle she had faced had, in its own way, taught her something invaluable — and that, in a nutshell, was the real secret to her success.",
    french: "Au moment où elle a eu trente ans, Sarah avait déjà traversé plus de hauts et de bas que la plupart des gens n'en vivent dans toute une vie. Elle avait grandi dans un quartier difficile, et bien qu'elle ait souvent eu envie d'abandonner, elle n'a jamais laissé sa situation la freiner. Quand sa première entreprise s'est effondrée, elle n'a pas pleuré sur le lait renversé ; au lieu de cela, elle s'est relevée, a repris ses esprits, et s'est lancée dans une nouvelle direction. « Tôt ou tard, le travail acharné finit par payer », avait-elle l'habitude de dire, mi-blague, mi-sérieuse. Des années plus tard, après avoir construit une entreprise à partir de rien et surmonté d'innombrables obstacles en chemin, elle a enfin compris ce que signifiait vraiment être aux anges. En y repensant, elle a réalisé que chaque obstacle rencontré lui avait, à sa manière, appris quelque chose de précieux — et que, en résumé, c'était là le véritable secret de sa réussite."
  },
];

export default function ShadowingTab() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentLevel = useMemo(() => levels.find((level) => level.id === selectedLevel) ?? levels[0], [selectedLevel]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentLevel.english);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
      setIsPaused(true);
    }
  };

  return (
    <div>
      <div style={{ padding: "20px 0", borderBottom: "1px solid #1E293B" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}>
          <div>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#F1F5F9" }}>
                <FaAssistiveListeningSystems style={{ color: "#38BDF8" }} /> Shadowing en 10 niveaux
              </h2>
            <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#94A3B8" }}>
              Pratique l'écoute, la compréhension, l'expression orale et l'articulation en anglais.
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 0", borderBottom: "1px solid #1E293B" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => {
                setSelectedLevel(level.id);
                setShowTranslation(false);
                setIsSpeaking(false);
                setIsPaused(false);
                if (typeof window !== "undefined") {
                  window.speechSynthesis?.cancel();
                }
              }}
              style={{
                background: selectedLevel === level.id ? "#3B82F6" : "#1E293B",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                padding: "8px 12px",
                cursor: "pointer",
                fontWeight: selectedLevel === level.id ? 700 : 500,
              }}
            >
              N{level.id}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 0", display: "grid", gap: "16px" }}>
        <div style={{ background: "#111827", border: "1px solid #1F2937", borderRadius: "14px", padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={{ margin: 0, color: "#60A5FA", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {currentLevel.difficulty}
              </p>
              <h3 style={{ margin: "4px 0 0", fontSize: "18px", color: "#F8FAFC" }}>{currentLevel.title}</h3>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={handleSpeak}
                style={{ background: "#10B981", border: "none", borderRadius: "8px", padding: "9px 12px", color: "#fff", cursor: "pointer", fontWeight: 600 }}
              >
                {isSpeaking ? "⏹ Arrêter" : isPaused ? "▶ Reprendre" : "▶ Écouter l'anglais"}
              </button>
              <button
                onClick={handlePause}
                style={{ background: "#F59E0B", border: "none", borderRadius: "8px", padding: "9px 12px", color: "#fff", cursor: "pointer", fontWeight: 600 }}
              >
                ⏸ Pause
              </button>
              <button
                onClick={() => setShowTranslation((prev) => !prev)}
                style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "8px", padding: "9px 12px", color: "#fff", cursor: "pointer", fontWeight: 600 }}
              >
                {showTranslation ? "Masquer la traduction" : "Voir la traduction"}
              </button>
            </div>
          </div>

          <div style={{ marginTop: "14px", display: "grid", gap: "10px" }}>
            <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "10px", padding: "12px" }}>
              <p style={{ margin: 0, color: "#94A3B8", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Instructions</p>
              <ul style={{ margin: "8px 0 0", paddingLeft: "18px", color: "#E2E8F0", fontSize: "14px", lineHeight: 1.6 }}>
                <li>Écoute le texte en entier une première fois.</li>
                <li>Écoute à nouveau en lisant le texte en même temps.</li>
                <li>Répète après chaque phrase ou en même temps que l'audio.</li>
                <li>Imite le rythme, l'intonation et la prononciation.</li>
                <li>Relis la traduction pour vérifier ta compréhension.</li>
              </ul>
            </div>

            <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "10px", padding: "12px" }}>
              <p style={{ margin: 0, color: "#F8FAFC", fontSize: "15px", fontWeight: 700 }}>Texte en anglais</p>
              <p style={{ margin: "8px 0 0", color: "#E2E8F0", fontSize: "15px", lineHeight: 1.7, whiteSpace: "pre-line" }}>{currentLevel.english}</p>
            </div>

            {showTranslation && (
              <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "10px", padding: "12px" }}>
                <p style={{ margin: 0, color: "#F8FAFC", fontSize: "15px", fontWeight: 700 }}>Traduction française</p>
                <p style={{ margin: "8px 0 0", color: "#CBD5E1", fontSize: "15px", lineHeight: 1.7, whiteSpace: "pre-line" }}>{currentLevel.french}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
