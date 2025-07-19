
export interface AnalyzedLine {
    text: string;
    rhyme: string;
}

const vowels = "aeiouáéíóú";
const strongVowels = "aeoáéó";
const weakVowels = "iuíú";

// Normaliza la palabra para el análisis de rima (quita tildes, convierte a minúsculas)
const normalizeWord = (word: string): string => {
    return word
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

// Obtiene la última palabra de un verso
const getLastWord = (line: string): string => {
    // Expresión regular mejorada para capturar palabras, incluyendo ñ y acentos
    const words = line.trim().match(/\b[\w\u00C0-\u017F_]+\b/g);
    return words ? words[words.length - 1] : "";
};


// Encuentra el índice de la sílaba tónica (la que lleva el acento)
const findStressedVowelIndex = (word: string): number => {
    const normalized = normalizeWord(word);
    if (!normalized) return -1;

    const accentIndex = word.search(/[áéíóú]/);
    if (accentIndex !== -1) {
        return accentIndex;
    }

    const lastChar = normalized.slice(-1);
    const secondLastChar = normalized.slice(-2, -1);
    
    // Reglas de acentuación para palabras sin tilde explícita
    // Agudas: terminan en n, s, o vocal. Acento en la última sílaba.
    if ("ns".includes(lastChar) || vowels.includes(lastChar)) {
         // buscar la última vocal
        for (let i = normalized.length - 1; i >= 0; i--) {
            if (vowels.includes(normalized[i])) return i;
        }
    } 
    // Graves: no terminan en n, s, o vocal. Acento en la penúltima sílaba.
    else {
        let vowelCount = 0;
        for (let i = normalized.length - 1; i >= 0; i--) {
            if (vowels.includes(normalized[i])) {
                vowelCount++;
                if (vowelCount === 2) return i;
            }
        }
        // Si solo tiene una sílaba, esa es la tónica
        for (let i = normalized.length - 1; i >= 0; i--) {
            if (vowels.includes(normalized[i])) return i;
        }
    }
    
    return -1; // Fallback
}


// Obtiene la terminación relevante para la rima (desde la última vocal acentuada)
const getRhymeEnding = (word: string): string => {
    if (!word) return "";
    const stressedVowelIndex = findStressedVowelIndex(word);
    
    if (stressedVowelIndex !== -1) {
        return normalizeWord(word.substring(stressedVowelIndex));
    }

    return normalizeWord(word); // Fallback
};


// Compara si dos palabras riman (consonante)
const doWordsRhyme = (word1: string, word2: string): boolean => {
    if (!word1 || !word2 || word1 === word2) return false;
    
    const ending1 = getRhymeEnding(word1);
    const ending2 = getRhymeEnding(word2);

    // Para rima consonante, la terminación debe ser idéntica y de al menos 2 caracteres.
    if (ending1 && ending2 && ending1.length >= 2 && ending1 === ending2) {
        return true;
    }

    return false;
};

// Genera el esquema de rimas para un texto completo
export const getRhymeScheme = (text: string): AnalyzedLine[] => {
    const lines = text.split('\n');
    const lastWords = lines.map(getLastWord);
    const rhymeGroups: { representative: string, label: string }[] = [];
    const rhymeLabels = new Array(lines.length).fill("");

    for (let i = 0; i < lastWords.length; i++) {
        const currentWord = lastWords[i];
        if (!currentWord || rhymeLabels[i]) continue;

        let foundGroup = false;
        // Intenta encontrar un grupo de rima existente
        for (const group of rhymeGroups) {
            if (doWordsRhyme(currentWord, group.representative)) {
                rhymeLabels[i] = group.label;
                foundGroup = true;
                break;
            }
        }

        // Si no se encontró grupo, crea uno nuevo
        if (!foundGroup) {
            const newLabel = String.fromCharCode(65 + rhymeGroups.length);
            rhymeGroups.push({ representative: currentWord, label: newLabel });
            rhymeLabels[i] = newLabel;
        }
    }
    
    // Segunda pasada para asignar etiquetas a palabras que riman con nuevos grupos
    for (let i = 0; i < lastWords.length; i++) {
        if (!lastWords[i] || rhymeLabels[i]) continue;
         for (const group of rhymeGroups) {
             if (doWordsRhyme(lastWords[i], group.representative)) {
                 rhymeLabels[i] = group.label;
                 break;
             }
         }
    }


    return lines.map((line, index) => ({
        text: line,
        rhyme: lastWords[index] ? rhymeLabels[index] : "-",
    }));
};
