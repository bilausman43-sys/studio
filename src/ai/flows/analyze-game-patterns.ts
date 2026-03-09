'use server';
/**
 * @fileOverview An AI agent that analyzes historical Aviator game data to identify patterns and trends.
 *
 * - analyzeGamePatterns - A function that handles the analysis of historical game data.
 * - AnalyzeGamePatternsInput - The input type for the analyzeGamePatterns function.
 * - AnalyzeGamePatternsOutput - The return type for the analyzeGamePatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeGamePatternsInputSchema = z.object({
  historicalGameData: z.array(
    z.object({
      crashMultiplier: z.number().describe('The multiplier at which the airplane crashed in a specific game round.'),
    })
  ).describe('An array of historical Aviator game rounds, each containing the crash multiplier.'),
});
export type AnalyzeGamePatternsInput = z.infer<typeof AnalyzeGamePatternsInputSchema>;

const AnalyzeGamePatternsOutputSchema = z.object({
  commonCrashMultipliers: z.array(z.number()).describe('A list of frequently observed crash multipliers, sorted from most frequent to least frequent.'),
  statisticalTrends: z.string().describe('A detailed summary of statistical trends observed in the historical game data, such as average crash multiplier, variance, and notable patterns.'),
  safeZones: z.array(z.string()).describe('Suggested multiplier ranges or specific multipliers that are considered "safe zones" for cashing out, based on the historical data analysis. Example: ["1.2x - 1.5x", "Below 2.0x"].'),
});
export type AnalyzeGamePatternsOutput = z.infer<typeof AnalyzeGamePatternsOutputSchema>;

export async function analyzeGamePatterns(input: AnalyzeGamePatternsInput): Promise<AnalyzeGamePatternsOutput> {
  return analyzeGamePatternsFlow(input);
}

const analyzeGamePatternsPrompt = ai.definePrompt({
  name: 'analyzeGamePatternsPrompt',
  input: {schema: AnalyzeGamePatternsInputSchema},
  output: {schema: AnalyzeGamePatternsOutputSchema},
  prompt: `You are an expert AI game analyst specializing in the Aviator game. Your task is to analyze historical Aviator game data to identify patterns, statistical trends, and potential "safe zones" for players.

Analyze the following historical game crash multipliers:
{{#each historicalGameData}}
- {{this.crashMultiplier}}x
{{/each}}

Based on this data, provide the following insights in JSON format:
1.  **commonCrashMultipliers**: Identify and list the most frequently occurring crash multipliers.
2.  **statisticalTrends**: Describe any statistical trends you observe. This could include the average crash multiplier, the range of multipliers, the distribution of crashes (e.g., are low multipliers more common, or high ones?), and any other notable patterns.
3.  **safeZones**: Suggest multiplier ranges or specific multipliers that could be considered "safe zones" for cashing out, based on the historical data to minimize risk.

Ensure your analysis is purely based on the provided historical data and does not involve predictions of future outcomes.`,
});

const analyzeGamePatternsFlow = ai.defineFlow(
  {
    name: 'analyzeGamePatternsFlow',
    inputSchema: AnalyzeGamePatternsInputSchema,
    outputSchema: AnalyzeGamePatternsOutputSchema,
  },
  async (input) => {
    const {output} = await analyzeGamePatternsPrompt(input);
    return output!;
  }
);
