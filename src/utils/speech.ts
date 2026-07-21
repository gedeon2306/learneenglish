export type SpeechPart = {
  text: string;
  lang?: string;
  rate?: number;
  pitch?: number;
};

export const cleanSpeechText = (text: string, lang: string = "en-US") => {
  let normalized = text.trim();

  if (lang === "en-US" && normalized.toUpperCase() === "I") {
    normalized = "eye";
  }

  if (lang === "en-US" && normalized === "-teen (ex: Fourteen)") {
    normalized = "Fourteen";
  }

  if (lang === "en-US" && normalized === "-ty (ex: Twenty, Thirty)") {
    normalized = "Thirty";
  }

  normalized = normalized.replace(/\s*\([^)]*\)\s*/g, " ");
  normalized = normalized.replace(/\s*\/\s*/g, lang === "fr-FR" ? " ou " : " or ");
  normalized = normalized.replace(/\bou\b/gi, lang === "fr-FR" ? "où" : "or");
  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
};

export const stopSpeech = () => {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return;
  }

  window.speechSynthesis.cancel();
};

export const speakSequence = (parts: SpeechPart[]) => {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return;
  }

  window.speechSynthesis.cancel();

  const speakPart = (index: number) => {
    if (index >= parts.length) {
      return;
    }

    const part = parts[index];
    const cleanedText = cleanSpeechText(part.text, part.lang ?? "en-US");
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = part.lang ?? "en-US";
    utterance.rate = part.rate ?? 0.95;
    utterance.pitch = part.pitch ?? 1;
    utterance.onend = () => speakPart(index + 1);
    utterance.onerror = () => speakPart(index + 1);
    window.speechSynthesis.speak(utterance);
  };

  speakPart(0);
};
