/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum ShelterStatus {
  AVAILABLE = 'Available',
  ALMOST_FULL = 'Almost Full',
  FULL = 'Full',
  CLOSED = 'Closed'
}

export enum ReportStatus {
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected',
  RESOLVED = 'Resolved'
}

export enum DamageCategory {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  SEVERE = 'Severe'
}

export enum ImpactReportStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  REVIEWED = 'Reviewed',
  ARCHIVED = 'Archived'
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  distance: string;
  totalCapacity: number;
  currentOccupancy: number;
  availableSpace: number;
  status: ShelterStatus;
  facilities: string[];
  contact: string;
  routeRisk: RiskLevel;
  lat: number;
  lng: number;
  state?: string;
}

export interface FloodReport {
  id: string;
  location: string;
  severity: RiskLevel;
  waterLevel: string;
  status: ReportStatus;
  description: string;
  timestamp: string;
  lat: number;
  lng: number;
  state?: string;
  reportType?: string;
  submittedBy?: string;
  emergencyHelpNeeded?: boolean;
  aiPhotoAnalysis?: any;
  verifiedAt?: string;
  resolvedAt?: string;
}

export interface PostFloodImpactReport {
  id: string;
  userId: string;
  relatedIncidentId: string;
  locationName: string;
  state: string;
  district?: string;
  floodDate: string;
  reportedBy: string;
  affectedHouseholds: number;
  affectedPeople: number;
  injuriesReported: number;
  evacuationNeeded: boolean;
  peopleMovedToShelter: number;
  housesAffected: number;
  vehiclesAffected: number;
  businessPremisesAffected: number;
  agricultureAffected: number;
  publicInfrastructureAffected: string;
  estimatedDamageCategory: DamageCategory;
  roadsBlocked: boolean;
  affectedRoadNames: string;
  bridgeDamage: boolean;
  publicTransportDisruption: boolean;
  shelterUsed: string;
  shelterOccupancyDuringFlood: number;
  foodWaterSupplyIssue: boolean;
  medicalAssistanceNeeded: boolean;
  recoveryNeeds: string[];
  impactSummary: string;
  photoUrl?: string;
  status: ImpactReportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RiskZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  risk: RiskLevel;
  status: string;
  state: string;
  type: string;
}

export interface Route {
  id: string;
  name: string;
  duration: number;
  riskLevel: RiskLevel;
  reason: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  status: 'Safe' | 'Warning' | 'Unknown';
  location: string;
  lastUpdated: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: RiskLevel;
  timestamp: string;
}
