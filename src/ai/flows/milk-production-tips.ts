// src/ai/flows/milk-production-tips.ts
'use server';
/**
 * @fileOverview Generates personalized milk production tips for farmers based on their data and local agricultural data.
 *
 * - generateMilkProductionTips - A function that generates milk production tips for a farmer.
 * - MilkProductionTipsInput - The input type for the generateMilkProductionTips function.
 * - MilkProductionTipsOutput - The return type for the generateMilkProductionTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MilkProductionTipsInputSchema = z.object({
  farmerId: z.string().describe('The ID of the farmer.'),
  previousMilkTests: z
    .string()
    .describe(
      'The farmer’s previous milk test results in JSON format. Keys should be test names, and values should be the test results.'
    ),
  localAgriculturalData: z
    .string()
    .describe(
      'Local agricultural data relevant to milk production, in JSON format. Include information on weather patterns, common feed types, and best practices for the region.'
    ),
});
export type MilkProductionTipsInput = z.infer<typeof MilkProductionTipsInputSchema>;

const MilkProductionTipsOutputSchema = z.object({
  tips: z
    .string()
    .describe(
      'Personalized tips for the farmer to improve their milk production practices.'
    ),
});
export type MilkProductionTipsOutput = z.infer<typeof MilkProductionTipsOutputSchema>;

export async function generateMilkProductionTips(
  input: MilkProductionTipsInput
): Promise<MilkProductionTipsOutput> {
  return generateMilkProductionTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'milkProductionTipsPrompt',
  input: {schema: MilkProductionTipsInputSchema},
  output: {schema: MilkProductionTipsOutputSchema},
  prompt: `You are an AI assistant providing personalized advice to dairy farmers to improve their milk production.

  Based on the farmer's previous milk test data and local agricultural data, generate a few actionable tips that the farmer can use to improve milk production practices.

  Farmer ID: {{{farmerId}}}
  Previous Milk Tests: {{{previousMilkTests}}}
  Local Agricultural Data: {{{localAgriculturalData}}}

  Tips:
  `, // Ensure the output only contains the tips.
});

const generateMilkProductionTipsFlow = ai.defineFlow(
  {
    name: 'generateMilkProductionTipsFlow',
    inputSchema: MilkProductionTipsInputSchema,
    outputSchema: MilkProductionTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
