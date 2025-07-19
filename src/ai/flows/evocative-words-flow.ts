
'use server';
/**
 * @fileOverview An AI flow to generate evocative words based on a theme.
 *
 * - getEvocativeWords - A function that gets a list of evocative words for a given theme.
 * - EvocativeWordsInput - The input type for the getEvocativeWords function.
 * - EvocativeWordsOutput - The return type for the getEvocativeWords function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const EvocativeWordsInputSchema = z.object({
  theme: z.string().describe('The theme or feeling to get evocative words for.'),
});
export type EvocativeWordsInput = z.infer<typeof EvocativeWordsInputSchema>;

const EvocativeWordsOutputSchema = z.object({
  words: z.array(z.string()).describe('A list of evocative words related to the theme. Should be a mix of concrete nouns, abstract concepts, verbs, and adjectives.'),
});
export type EvocativeWordsOutput = z.infer<typeof EvocativeWordsOutputSchema>;

export async function getEvocativeWords(input: EvocativeWordsInput): Promise<EvocativeWordsOutput> {
  return evocativeWordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evocativeWordsPrompt',
  input: { schema: EvocativeWordsInputSchema },
  output: { schema: EvocativeWordsOutputSchema },
  prompt: `You are a creative assistant and muse for a poet.
Your task is to provide a list of evocative and inspiring words based on a given theme.
The list should contain a rich variety of words: concrete nouns, abstract concepts, sensory details, verbs, and adjectives.
Avoid clichés. Aim for originality and emotional resonance.
Generate between 15 and 20 words for the theme: "{{theme}}".
All output must be in Spanish.
`,
});

const evocativeWordsFlow = ai.defineFlow(
  {
    name: 'evocativeWordsFlow',
    inputSchema: EvocativeWordsInputSchema,
    outputSchema: EvocativeWordsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('The AI model did not return an output.');
    }
    return output;
  }
);
