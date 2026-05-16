/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PredictionResult } from './predictionService';

export interface AIContextData {
  locationName: string;
  nearestShelter: string;
  safestRouteRisk: string;
  availableShelterSpace: number;
}

export interface AIAdviceResult {
  summary: string;
  safetyAdvice: string[];
  routeAdvice: string;
  shelterAdvice: string;
  disclaimer: string;
}

/**
 * Generates an AI-powered explanation and advice based on model predictions.
 * This simulates the Gemini AI layer that translates raw ML data into human-readable guidance.
 */
export async function generateAISafetyAdvice(
  predictionResult: PredictionResult,
  contextData: AIContextData
): Promise<AIAdviceResult> {
  // Simulate AI reasoning latency
  await new Promise(resolve => setTimeout(resolve, 1200));

  /**
   * FUTURE REPLACEMENT FOR REAL GEMINI API:
   * 
   * // Initialize Gemini API (Server-side recommended for production)
   * // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
   * 
   * const prompt = `
   *   You are an Emergency AI Assistant. 
   *   Analyze this flood risk prediction: ${JSON.stringify(predictionResult)}
   *   Current context: ${JSON.stringify(contextData)}
   *   Provide a summary, 4-5 safety action steps, route advice, shelter advice, and a standard disclaimer.
   *   Use cautious language (estimated, recommended).
   * `;
   * 
   * const result = await model.generateContent(prompt);
   * // Parse the response...
   */

  const { risk_level, main_factors } = predictionResult;
  const { locationName, nearestShelter, availableShelterSpace } = contextData;

  const summary = `The ${locationName} sector is currently estimated to be at ${risk_level} Risk. This assessment is derived from critical indicators including ${main_factors.join(', ').toLowerCase()} observed in the real-time telemetry stream.`;

  const safetyAdvice = [
    "Prioritize immediate personal safety over property protection.",
    "Avoid driving or walking through any standing or moving flood water.",
    "Monitor official Alor Setar emergency broadcasts and community alerts.",
    `Prepare an emergency go-bag if water levels continue to rise in the ${locationName} vicinity.`
  ];

  if (risk_level === 'Critical' || risk_level === 'High') {
    safetyAdvice.unshift("Follow pre-planned evacuation protocols to higher ground immediately.");
  }

  const routeAdvice = `Based on current saturation levels, the safest recommended route is strongly advised even if it involves a longer duration. It has been estimated to bypass active runoff zones identified by the Sentinel model.`;

  const shelterAdvice = `${nearestShelter} is currently identified as a suitable survival node. It has approximately ${availableShelterSpace} available spaces and is accessible via currently validated low-risk corridors.`;

  const disclaimer = "This AI-generated analysis is intended for situational awareness and decision support. It does not replace official emergency instructions from civil authorities. Always prioritize instructions from local first responders and official government updates.";

  return {
    summary,
    safetyAdvice,
    routeAdvice,
    shelterAdvice,
    disclaimer
  };
}
