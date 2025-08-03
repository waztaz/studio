'use server';
/**
 * @fileOverview A smart duvet advisor AI agent.
 *
 * - recommendDuvet - A function that handles the duvet recommendation process.
 * - RecommendDuvetInput - The input type for the recommendDuvet function.
 * - RecommendDuvetOutput - The return type for the recommendDuvet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendDuvetInputSchema = z.object({
  temperature: z
    .string()
    .describe('Your preferred sleeping temperature (e.g., warm, cool, neutral).'),
  allergy: z
    .string()
    .describe('Any allergies you have (e.g., dust mites, down, latex).'),
  weight: z.string().describe('Your preferred duvet weight (e.g., light, medium, heavy).'),
  style: z.string().describe('Your preferred duvet style (e.g., modern, traditional, minimalist).'),
  budget: z.string().describe('Your budget for a new duvet (e.g., under $100, $100-$200, over $200).'),
});
export type RecommendDuvetInput = z.infer<typeof RecommendDuvetInputSchema>;

const RecommendDuvetOutputSchema = z.object({
  recommendation: z.string().describe('A duvet recommendation based on the user preferences.'),
  reasoning: z.string().describe('The reasoning behind the recommendation.'),
});
export type RecommendDuvetOutput = z.infer<typeof RecommendDuvetOutputSchema>;

export async function recommendDuvet(input: RecommendDuvetInput): Promise<RecommendDuvetOutput> {
  return recommendDuvetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendDuvetPrompt',
  input: {schema: RecommendDuvetInputSchema},
  output: {schema: RecommendDuvetOutputSchema},
  prompt: `You are a helpful AI assistant that recommends duvets based on user preferences.

  Consider the following user preferences when making your recommendation:

  Temperature: {{{temperature}}}
  Allergies: {{{allergy}}}
  Weight: {{{weight}}}
  Style: {{{style}}}
  Budget: {{{budget}}}

  Based on these preferences, recommend a specific type of duvet and explain your reasoning.
`,
});

const recommendDuvetFlow = ai.defineFlow(
  {
    name: 'recommendDuvetFlow',
    inputSchema: RecommendDuvetInputSchema,
    outputSchema: RecommendDuvetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
