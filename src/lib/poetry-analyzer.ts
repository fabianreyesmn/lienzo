
export interface AnalyzedLine {
    text: string;
    rhyme: string;
}

const vowels = "aeiouáéíóú";

// Normaliza la palabra para el análisis de rima (quita tildes, convierte a minúsculas)
const normalizeWord = (word: string): string => {
    return word.toLowerCase();
};

// Obtiene la última palabra de un verso
const getLastWord = (line: string): string => {
    const words = line.trim().match(/\b[\w\u00C0-\u017F_]+\b/g);
    return words ? words[words.length - 1] : "";
};


// Encuentra el índice de la sílaba tónica (la que lleva el acento)
const findStressedVowelIndex = (word: string): number => {
    const normalized = word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const original = word.toLowerCase();
    
    if (!normalized) return -1;

    // 1. Check for explicit accent
    const accentIndex = original.search(/[áéíóú]/);
    if (accentIndex !== -1) {
        return accentIndex;
    }

    // 2. Word ends in vowel, 'n', or 's' -> stressed on the second to last syllable (grave/llana)
    const lastChar = normalized.slice(-1);
    const lastCharIsVowelNS = vowels.includes(lastChar.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || lastChar === 'n' || lastChar === 's';
    
    if (word.length > 1 && lastCharIsVowelNS) {
        let vowelCount = 0;
        for (let i = original.length - 1; i >= 0; i--) {
            if (vowels.includes(original[i])) {
                vowelCount++;
                if (vowelCount === 2) return i;
            }
        }
    }
    
    // 3. Otherwise -> stressed on the last syllable (aguda)
    for (let i = original.length - 1; i >= 0; i--) {
        if (vowels.includes(original[i])) return i;
    }
    
    return -1; // Fallback
}


// Obtiene la terminación relevante para la rima (solo las vocales desde la última vocal acentuada)
const getRhymeEnding = (word: string): string => {
    if (!word) return "";
    const originalWord = word.toLowerCase();
    const stressedVowelIndex = findStressedVowelIndex(originalWord);
    
    if (stressedVowelIndex !== -1) {
        const ending = originalWord.substring(stressedVowelIndex);
        const normalizedEnding = ending.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return normalizedEnding.replace(/[^aeiou]/g, ""); // Keep only vowels
    }

    return ""; // Fallback
};


// Compara si dos palabras riman (asonante)
const doWordsRhyme = (word1: string, word2: string): boolean => {
    if (!word1 || !word2 || normalizeWord(word1) === normalizeWord(word2)) return false;
    
    const ending1 = getRhymeEnding(word1);
    const ending2 = getRhymeEnding(word2);

    // For assonant rhyme, the vowel sequence must be identical and non-empty.
    if (ending1 && ending1 === ending2) {
        return true;
    }

    return false;
};

// Genera el esquema de rimas para un texto completo
export const getRhymeScheme = (text: string): AnalyzedLine[] => {
    const lines = text.split('\n');
    const lastWords = lines.map(getLastWord);
    const rhymeLabels = new Array(lines.length).fill("");
    const rhymeGroups: { representative: string; label: string }[] = [];

    for (let i = 0; i < lastWords.length; i++) {
        const currentWord = lastWords[i];
        if (!currentWord || rhymeLabels[i]) {
            continue;
        }

        let foundGroup = false;
        // Check against existing rhyme groups
        for (const group of rhymeGroups) {
            if (doWordsRhyme(currentWord, group.representative)) {
                rhymeLabels[i] = group.label;
                foundGroup = true;
                break;
            }
        }

        // If no group was found, create a new one
        if (!foundGroup) {
            const newLabel = String.fromCharCode(65 + rhymeGroups.length);
            rhymeGroups.push({ representative: currentWord, label: newLabel });
            rhymeLabels[i] = newLabel;
        }
    }

    return lines.map((line, index) => ({
        text: line,
        rhyme: lastWords[index] ? rhymeLabels[index] : "-",
    }));
};
