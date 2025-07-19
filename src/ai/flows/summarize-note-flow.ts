
'use server';
/**
 * @fileOverview An AI flow to summarize a note and extract key concepts.
 *
 * - summarizeNote - A function that analyzes a note.
 * - SummarizeNoteInput - The input type for the summarizeNote function.
 * - SummarizeNoteOutput - The return type for the summarizeNote function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SummarizeNoteInputSchema = z.object({
  noteContent: z.string().describe('The full text content of the note to be analyzed.'),
});
export type SummarizeNoteInput = z.infer<typeof SummarizeNoteInputSchema>;

const SummarizeNoteOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the note, in 2-3 sentences.'),
  keywords: z.array(z.string()).describe('A list of 5-10 key concepts or topics found in the note.'),
});
export type SummarizeNoteOutput = z.infer<typeof SummarizeNoteOutputSchema>;

export async function summarizeNote(input: SummarizeNoteInput): Promise<SummarizeNoteOutput> {
  return summarizeNoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNotePrompt',
  input: { schema: SummarizeNoteInputSchema },
  output: { schema: SummarizeNoteOutputSchema },
  prompt: `You are an expert analyst. Your task is to read the following text and provide a concise summary and a list of key concepts.

Read the entire note content provided below.
1.  Generate a clear and concise summary of the main points, no longer than 3 sentences.
2.  Extract a list of 5 to 10 of the most important keywords or topics from the text. These should represent the core themes.

All output must be in Spanish.

Note Content:
---
{{{noteContent}}}
---
`,
});

const summarizeNoteFlow = ai.defineFlow(
  {
    name: 'summarizeNoteFlow',
    inputSchema: SummarizeNoteInputSchema,
    outputSchema: SummarizeNoteOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('The AI model did not return an output.');
    }
    return output;
  }
);
