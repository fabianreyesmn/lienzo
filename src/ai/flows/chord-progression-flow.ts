
'use server';
/**
 * @fileOverview An AI flow to generate chord progressions for songwriting.
 *
 * - getChordProgressions - A function that gets chord progressions for a given key and mood.
 * - ChordProgressionsInput - The input type for the getChordProgressions function.
 * - ChordProgressionsOutput - The return type for the getChordProgressions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChordProgressionsInputSchema = z.object({
  key: z.string().describe('The musical key (e.g., "C Major", "A Minor").'),
  mood: z.string().describe('The desired mood or feeling (e.g., "Happy", "Sad", "Epic").'),
});
export type ChordProgressionsInput = z.infer<typeof ChordProgressionsInputSchema>;

const ChordProgressionsOutputSchema = z.object({
  progressions: z.array(z.string()).describe('A list of 4 to 6 chord progressions. Each progression should be a string with chords separated by " - ".'),
});
export type ChordProgressionsOutput = z.infer<typeof ChordProgressionsOutputSchema>;

export async function getChordProgressions(input: ChordProgressionsInput): Promise<ChordProgressionsOutput> {
  return chordProgressionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chordProgressionsPrompt',
  input: { schema: ChordProgressionsInputSchema },
  output: { schema: ChordProgressionsOutputSchema },
  prompt: `You are a music theory expert and a creative songwriter.
Your task is to provide a list of chord progressions based on a given musical key and mood.
The progressions should be suitable for popular music genres. Include both common progressions and some more creative or interesting ones.
For the key "{{key}}" and the mood "{{mood}}", generate a list of 4 to 6 distinct chord progressions.
Represent the chords clearly (e.g., Am, G, C, F). Use a "-" to separate chords in a progression.
Do not add any extra explanations, just the progressions.
All output must be in Spanish.
`,
});

const chordProgressionsFlow = ai.defineFlow(
  {
    name: 'chordProgressionsFlow',
    inputSchema: ChordProgressionsInputSchema,
    outputSchema: ChordProgressionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('The AI model did not return an output.');
    }
    return output;
  }
);
