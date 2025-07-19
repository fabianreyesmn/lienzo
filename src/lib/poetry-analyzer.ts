
export interface AnalyzedLine {
    text: string;
    rhyme: string;
}

// Normaliza la palabra para el análisis de rima (quita tildes, convierte a minúsculas)
const normalizeWord = (word: string): string => {
    return word
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

// Obtiene la última palabra de un verso
const getLastWord = (line: string): string => {
    const words = line.trim().match(/\b(\w+)\b/g);
    return words ? words[words.length - 1] : "";
};

// Obtiene la terminación relevante para la rima (desde la última vocal acentuada)
const getRhymeEnding = (word: string): string => {
    const normalized = normalizeWord(word);
    if (normalized.length === 0) return "";

    const vowels = "aeiou";
    let lastVowelIndex = -1;
    let stressedVowelIndex = -1;

    // Encuentra la última vocal tónica (o la antepenúltima sílaba para esdrújulas, simplificado aquí)
    for (let i = normalized.length - 1; i >= 0; i--) {
        if (vowels.includes(normalized[i])) {
            if (lastVowelIndex === -1) lastVowelIndex = i;

            // Simplificación: consideramos tónica la última o penúltima vocal
            // Una lógica real necesitaría reglas de acentuación completas.
            if (stressedVowelIndex === -1) {
                 stressedVowelIndex = i;
            }
        }
    }
    
    // Heurística para palabras agudas (acento en la última sílaba)
    if (normalized.length > 3 && !vowels.includes(normalized[normalized.length-2])) {
        stressedVowelIndex = lastVowelIndex;
    }


    if (stressedVowelIndex !== -1) {
        return normalized.substring(stressedVowelIndex);
    }

    return normalized; // Fallback
};


// Compara si dos palabras riman (consonante)
const doWordsRhyme = (word1: string, word2: string): boolean => {
    if (!word1 || !word2) return false;
    
    const ending1 = getRhymeEnding(word1);
    const ending2 = getRhymeEnding(word2);

    // Consideramos rima si las terminaciones de 3 o más letras son idénticas
    if (ending1.length >= 3 && ending1 === ending2) {
        return true;
    }
    // Rima asonante simple (mismas vocales)
    const vowels = "aeiou";
    const vowels1 = ending1.split('').filter(c => vowels.includes(c)).join('');
    const vowels2 = ending2.split('').filter(c => vowels.includes(c)).join('');

    return vowels1.length > 0 && vowels1 === vowels2;
};

// Genera el esquema de rimas para un texto completo
export const getRhymeScheme = (text: string): AnalyzedLine[] => {
    const lines = text.split('\n');
    const lastWords = lines.map(getLastWord);
    const rhymeGroups: string[][] = [];
    const rhymeLabels = new Array(lines.length).fill("");

    for (let i = 0; i < lastWords.length; i++) {
        if (!lastWords[i] || rhymeLabels[i] !== "") continue;

        let foundGroup = false;
        for (let j = 0; j < rhymeGroups.length; j++) {
            if (doWordsRhyme(lastWords[i], rhymeGroups[j][0])) {
                rhymeGroups[j].push(lastWords[i]);
                rhymeLabels[i] = String.fromCharCode(65 + j); // 'A', 'B', 'C'...
                foundGroup = true;
                break;
            }
        }

        if (!foundGroup) {
            rhymeGroups.push([lastWords[i]]);
            rhymeLabels[i] = String.fromCharCode(65 + rhymeGroups.length - 1);
        }
    }
    
     // Asignar etiquetas a las rimas encontradas
    for (let i = 0; i < lastWords.length; i++) {
        if (!lastWords[i] || rhymeLabels[i] !== "") continue;
         for (let j = 0; j < rhymeGroups.length; j++) {
             if (doWordsRhyme(lastWords[i], rhymeGroups[j][0])) {
                 rhymeLabels[i] = String.fromCharCode(65 + j);
                 break;
             }
         }
    }


    return lines.map((line, index) => ({
        text: line,
        rhyme: lastWords[index] ? rhymeLabels[index] : "-",
    }));
};
