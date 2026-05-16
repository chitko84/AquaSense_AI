/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RiskLevel } from '../types';

export interface PredictionInput {
  rainfall_mm: number;
  water_level_m: number;
  community_reports: number;
  nearby_flood_reports: number;
  weather_warning: number; // 0 or 1
  historical_flood_frequency: number; // 0 to 1
  route_risk_score: number; // 0 to 100
  shelter_occupancy_rate: number; // 0 to 1
}

export interface PredictionResult {
  risk_level: RiskLevel;
  risk_score: number;
  main_factors: string[];
  recommendation: string;
  model_source: "External ML Model Simulation";
}

/**
 * Simulates a flood risk prediction from an external ML model.
 * In a production environment, this would be replaced with an API call:
 * 
 * fetch(`${MODEL_API_URL}/predict-risk`, {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify(inputData)
 * })
 */
export async function predictFloodRisk(input: PredictionInput): Promise<PredictionResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  let score = 0;
  const factors: string[] = [];

  // Scored Scoring Logic
  if (input.rainfall_mm > 60) {
    score += 25;
    factors.push(`Intense Rainfall (${input.rainfall_mm}mm) detected`);
  } else if (input.rainfall_mm > 30) {
    score += 10;
  }

  if (input.water_level_m > 3) {
    score += 30;
    factors.push(`Critical Water Level (${input.water_level_m}m) reached`);
  } else if (input.water_level_m > 2) {
    score += 15;
  }

  if (input.nearby_flood_reports > 3) {
    score += 20;
    factors.push(`High density of nearby flood reports (${input.nearby_flood_reports})`);
  }

  if (input.weather_warning === 1) {
    score += 15;
    factors.push("Active severe weather warning");
  }

  if (input.historical_flood_frequency > 0.6) {
    score += 15;
    factors.push("High historical flood susceptibility in this sector");
  }

  if (input.route_risk_score > 60) {
    score += 10;
    factors.push("Evacuation route risk index exceeds safety threshold");
  }

  if (input.shelter_occupancy_rate > 0.8) {
    factors.push("Emergency shelters nearing peak occupancy");
  }

  // Normalize score
  score = Math.min(100, Math.max(0, score));

  let level = RiskLevel.LOW;
  let recommendation = "Maintain normal operational awareness. Monitor weather updates.";

  if (score > 75) {
    level = RiskLevel.CRITICAL;
    recommendation = "IMMEDIATE EVACUATION REQUIRED. Deploy all emergency response teams. Water levels exceeding safe containment thresholds.";
  } else if (score > 50) {
    level = RiskLevel.HIGH;
    recommendation = "Prepare for potential evacuation. Consolidate community resources. Rising water levels in lowland sectors.";
  } else if (score > 25) {
    level = RiskLevel.MEDIUM;
    recommendation = "Increased monitoring frequency recommended. Alert community volunteers. Minor flooding possible in known saturated zones.";
  }

  return {
    risk_level: level,
    risk_score: score,
    main_factors: factors.length > 0 ? factors : ["No critical threat vectors detected"],
    recommendation,
    model_source: "External ML Model Simulation"
  };
}
