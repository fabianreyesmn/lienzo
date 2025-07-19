
import lemmatize from 'wink-lemmatizer';

const vowels = "aeiouáéíóú";
const strongVowels = "aeoáéó";
const weakVowels = "iu";

const isVowel = (char: string): boolean => vowels.includes(char.toLowerCase());
const isStrong = (char: string): boolean => strongVowels.includes(char.toLowerCase());
const isWeak = (char: string): boolean => weakVowels.includes(char.toLowerCase());

// Exceptions for diphthongs and triphthongs for syllable counting
const exceptions: { [key: string]: number } = {
  'hiato': 2,
  'diptongo': 1,
  'triptongo': 1
};

const countSyllablesInWord = (word: string): number => {
    if (word.length <= 3 && word.length > 0) {
        const lemma = lemmatize.verb(word) || lemmatize.noun(word) || word;
        if (lemma.length <= 3 && vowels.split('').some(v => lemma.includes(v))) {
             return 1;
        }
    }
    
    if (word in exceptions) {
        return exceptions[word];
    }
    
    word = word.toLowerCase().replace(/[^a-zñáéíóúü]/g, '');

    if (word.length === 0) return 0;
    
    let syllableCount = 0;
    let lastCharWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const charIsVowel = isVowel(char);
        
        if (charIsVowel) {
            if (!lastCharWasVowel) {
                syllableCount++;
            } else {
                const prevChar = word[i-1];
                // Hiatus: two strong vowels together
                if (isStrong(prevChar) && isStrong(char)) {
                    syllableCount++;
                }
                // Diphthong rule simplification: weak+strong or strong+weak or weak+weak count as one.
                // The logic !lastCharWasVowel handles the first vowel. Here we just avoid double counting.
            }
        }
        lastCharWasVowel = charIsVowel;
    }

    // Handle 'h' creating a hiatus with a preceding vowel
    for (let i = 1; i < word.length - 1; i++) {
        if (word[i] === 'h' && isVowel(word[i-1]) && isVowel(word[i+1])) {
             if(isStrong(word[i-1]) && isStrong(word[i+1])){
                syllableCount++;
            }
        }
    }

    // Final 'e' is often silent in spanish words if they end in certain consonants, but that's too complex.
    // Let's adjust for final 'es' which often adds a syllable
    if (word.endsWith("es") && word.length > 3 && isVowel(word[word.length - 3])) {
       // This is a heuristic, may not be perfect. e.g. "amables"
    }

    // A word without vowels is not possible in Spanish, but as a fallback.
    if (syllableCount === 0 && word.length > 0) return 1;

    return syllableCount;
};

export const countSyllables = (text: string): number => {
    if (!text.trim()) return 0;
    const words = text.trim().split(/\s+/);
    return words.reduce((acc, word) => acc + countSyllablesInWord(word), 0);
};
