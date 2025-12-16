'use server';

/**
 * @fileOverview Generates a sarcastic reply based on user input, language, and sarcasm level.
 *
 * - generateSarcasticReply - A function that generates a sarcastic reply.
 * - GenerateSarcasticReplyInput - The input type for the generateSarcasticReply function.
 * - GenerateSarcasticReplyOutput - The return type for the generateSarcasticReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSarcasticReplyInputSchema = z.object({
  message: z.string().describe('The user input message.'),
  language: z.enum(['English', 'Kiswahili', 'Sheng']).describe('The language for the sarcastic reply.'),
  sarcasmLevel: z.enum(['Mild', 'Medium', 'Nuclear']).describe('The level of sarcasm in the reply.'),
});
export type GenerateSarcasticReplyInput = z.infer<typeof GenerateSarcasticReplyInputSchema>;

const GenerateSarcasticReplyOutputSchema = z.object({
  reply: z.string().describe('The generated sarcastic reply.'),
});
export type GenerateSarcasticReplyOutput = z.infer<typeof GenerateSarcasticReplyOutputSchema>;

export async function generateSarcasticReply(input: GenerateSarcasticReplyInput): Promise<GenerateSarcasticReplyOutput> {
  return generateSarcasticReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSarcasticReplyPrompt',
  input: {schema: GenerateSarcasticReplyInputSchema},
  output: {schema: GenerateSarcasticReplyOutputSchema},
  prompt: `You are a sarcastic AI assistant. Generate a sarcastic reply to the following message in the specified language and sarcasm level.

Language: {{{language}}}
Sarcasm Level: {{{sarcasmLevel}}}
Message: {{{message}}}

Reply: `,
});

const generateSarcasticReplyFlow = ai.defineFlow(
  {
    name: 'generateSarcasticReplyFlow',
    inputSchema: GenerateSarcasticReplyInputSchema,
    outputSchema: GenerateSarcasticReplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
