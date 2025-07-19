
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

const PoetrySuggestionsInputSchema = z.object({
  word: z.string().describe('The word to get suggestions for.'),
});
export type PoetrySuggestionsInput = z.infer<typeof PoetrySuggestionsInputSchema>;

const PoetrySuggestionsOutputSchema = z.object({
  rhymes: z.array(z.string()).describe('A list of words that rhyme with the input word. Should be relevant and creative.'),
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
  prompt: `You are a poetry assistant. Your task is to provide a list of rhymes and synonyms for the given word.
The suggestions should be suitable for poetry, avoiding overly technical or obscure words unless they fit a creative context.
For the word "{{word}}", provide a list of rhymes and a list of synonyms.
Generate at least 5 rhymes and 5 synonyms if possible.
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
