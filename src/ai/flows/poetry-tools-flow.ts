
'use server';
/**
 * @fileOverview A set of AI tools for poetry writing.
 *
 * - getPoetrySuggestions - A function that gets rhymes and synonyms for a given word.
 * - PoetrySuggestionsInput - The input type for the getPoetrySuggestions function.
 * - PoetrySuggestionsOutput - The return type for the getPoetrySuggestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
//
const PoetrySuggestionsInputSchema = z.object({
  word: z.string().describe('The word to get suggestions for.'),
});
export type PoetrySuggestionsInput = z.infer<typeof PoetrySuggestionsInputSchema>;

const PoetrySuggestionsOutputSchema = z.object({
  rhymes: z.array(z.string()).describe('A list of words that have a perfect rhyme with the input word.'),
  slantRhymes: z.array(z.string()).describe('A list of words that have a slant (or assonant) rhyme with the input word. In Spanish, this means only the vowels match from the last stressed vowel.'),
  synonyms: z.array(z.string()).describe('A list of synonyms for the input word.'),
});
export type PoetrySuggestionsOutput = z.infer<typeof PoetrySuggestionsOutputSchema>;

export async function getPoetrySuggestions(input: PoetrySuggestionsInput): Promise<PoetrySuggestionsOutput> {
  return poetrySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'poetrySuggestionsPrompt',
  input: { schema: PoetrySuggestionsInputSchema },
  output: { schema: PoetrySuggestionsOutputSchema },
  prompt: `You are a poetry assistant. Your task is to provide a list of rhymes, slant rhymes, and synonyms for the given word.
The suggestions should be suitable for poetry and songwriting, avoiding overly technical or obscure words.
For the word "{{word}}", provide:
1. A list of perfect rhymes (rimas consonantes).
2. A list of slant rhymes (rimas imperfectas o asonantes).
3. A list of synonyms.
Generate at least 5 of each if possible.
All output must be in Spanish.
`,
});

const poetrySuggestionsFlow = ai.defineFlow(
  {
    name: 'poetrySuggestionsFlow',
    inputSchema: PoetrySuggestionsInputSchema,
    outputSchema: PoetrySuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('The AI model did not return an output.');
    }
    return output;
  }
);
