// Gestionnaire de persistance pour le localStorage
const STORAGE_KEYS = {
  learnedWords: "learnEnglish_learnedWords",
  currentLot: "learnEnglish_currentLot",
  learnedPhrasalVerbs: "learnEnglish_learnedPhrasalVerbs",
  learnedExpressions: "learnEnglish_learnedExpressions",
  learnedIrregularVerbs: "learnEnglish_learnedIrregularVerbs",
};

// Helpers pour stocker et récupérer les données
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn("Erreur lors de la sauvegarde dans localStorage :", error);
  }
};

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.warn("Erreur lors du chargement depuis localStorage :", error);
    return defaultValue;
  }
};

export {
  STORAGE_KEYS,
  saveToStorage,
  loadFromStorage,
};
