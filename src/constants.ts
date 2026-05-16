/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RiskLevel, ShelterStatus, ReportStatus, Shelter, FloodReport, FamilyMember, Alert, RiskZone } from './types';

export const SHELTERS: Shelter[] = [
  {
    id: 's1',
    name: 'AIU Multipurpose Hall',
    address: 'Albukhary International University, Alor Setar',
    distance: '0.5 km',
    totalCapacity: 500,
    currentOccupancy: 110,
    availableSpace: 390,
    status: ShelterStatus.AVAILABLE,
    facilities: ['Food', 'Medical', 'Prayer Area'],
    contact: '04-7000001',
    routeRisk: RiskLevel.LOW,
    lat: 6.1825,
    lng: 100.3712,
    state: 'Kedah'
  },
  {
    id: 's2',
    name: 'Dewan Komuniti Alor Setar',
    address: 'City Centre, Alor Setar',
    distance: '4.2 km',
    totalCapacity: 300,
    currentOccupancy: 120,
    availableSpace: 180,
    status: ShelterStatus.AVAILABLE,
    facilities: ['Food', 'Water'],
    contact: '04-7000002',
    routeRisk: RiskLevel.MEDIUM,
    lat: 6.1210,
    lng: 100.3670,
    state: 'Kedah'
  },
  {
    id: 's3',
    name: 'Masjid Al-Bukhary',
    address: 'Jalan Langgar, Alor Setar',
    distance: '1.2 km',
    totalCapacity: 400,
    currentOccupancy: 370,
    availableSpace: 30,
    status: ShelterStatus.ALMOST_FULL,
    facilities: ['Water', 'Prayer Area'],
    contact: '04-7000003',
    routeRisk: RiskLevel.LOW,
    lat: 6.1780,
    lng: 100.3685,
    state: 'Kedah'
  },
  {
    id: 's4',
    name: 'SK Titi Gajah',
    address: 'Kampung Titi Gajah, Alor Setar',
    distance: '5.8 km',
    totalCapacity: 200,
    currentOccupancy: 200,
    availableSpace: 0,
    status: ShelterStatus.FULL,
    facilities: ['Dormitory'],
    contact: '04-7000004',
    routeRisk: RiskLevel.HIGH,
    lat: 6.1600,
    lng: 100.3300,
    state: 'Kedah'
  }
];

export const FLOOD_REPORTS: FloodReport[] = [
  {
    id: 'r1',
    location: 'Jalan Kuala Kedah',
    severity: RiskLevel.HIGH,
    waterLevel: '0.8m',
    status: ReportStatus.VERIFIED,
    description: 'High runoff from nearby river. Road partially submerged.',
    timestamp: '2026-05-14T08:30:00Z',
    lat: 6.1065,
    lng: 100.3000,
    state: 'Kedah'
  },
  {
    id: 'r2',
    location: 'Anak Bukit',
    severity: RiskLevel.MEDIUM,
    waterLevel: '0.4m',
    status: ReportStatus.PENDING,
    description: 'Water ponding near residential area.',
    timestamp: '2026-05-14T09:15:00Z',
    lat: 6.1630,
    lng: 100.3900,
    state: 'Kedah'
  },
  {
    id: 'r3',
    location: 'Alor Setar City Centre',
    severity: RiskLevel.CRITICAL,
    waterLevel: '1.2m',
    status: ReportStatus.VERIFIED,
    description: 'Flash flood alert. Heavy rainfall causing city drainage overflow.',
    timestamp: '2026-05-14T10:00:00Z',
    lat: 6.1248,
    lng: 100.3678,
    state: 'Kedah'
  },
  {
    id: 'r4',
    location: 'Kota Bharu Center',
    severity: RiskLevel.CRITICAL,
    waterLevel: '1.5m',
    status: ReportStatus.VERIFIED,
    description: 'Major river overflow detected.',
    timestamp: '2026-05-13T18:00:00Z',
    lat: 6.1254,
    lng: 102.2381,
    state: 'Kelantan'
  },
  {
    id: 'r5',
    location: 'Kuala Terengganu Coastal',
    severity: RiskLevel.HIGH,
    waterLevel: '0.8m',
    status: ReportStatus.VERIFIED,
    description: 'Coastal flooding due to high tide and heavy rain.',
    timestamp: '2026-05-13T18:30:00Z',
    lat: 5.3296,
    lng: 103.1370,
    state: 'Terengganu'
  },
  {
    id: 'r6',
    location: 'Segamat Town',
    severity: RiskLevel.HIGH,
    waterLevel: 'Knee level',
    status: ReportStatus.VERIFIED,
    description: 'Flash floods in low-lying areas.',
    timestamp: '2026-05-13T19:00:00Z',
    lat: 2.5148,
    lng: 102.8158,
    state: 'Johor'
  },
  {
    id: 'r7',
    location: 'Shah Alam Section 13',
    severity: RiskLevel.MEDIUM,
    waterLevel: 'Ankle level',
    status: ReportStatus.PENDING,
    description: 'Water ponding on roads.',
    timestamp: '2026-05-13T19:30:00Z',
    lat: 3.0738,
    lng: 101.5183,
    state: 'Selangor'
  },
  {
    id: 'r8',
    location: 'Kuantan Riverfront',
    severity: RiskLevel.MEDIUM,
    waterLevel: 'Rising',
    status: ReportStatus.VERIFIED,
    description: 'River level monitored.',
    timestamp: '2026-05-13T20:00:00Z',
    lat: 3.8077,
    lng: 103.3260,
    state: 'Pahang'
  },
  {
    id: 'r9',
    location: 'Kota Kinabalu Waterfront',
    severity: RiskLevel.MEDIUM,
    waterLevel: 'Surface water',
    status: ReportStatus.PENDING,
    description: 'Drainage overflow expected.',
    timestamp: '2026-05-13T20:30:00Z',
    lat: 5.9804,
    lng: 116.0735,
    state: 'Sabah'
  },
  {
    id: 'r10',
    location: 'Kuching Riverbank',
    severity: RiskLevel.LOW,
    waterLevel: 'Normal',
    status: ReportStatus.VERIFIED,
    description: 'Water level stable.',
    timestamp: '2026-05-13T21:00:00Z',
    lat: 1.5533,
    lng: 110.3592,
    state: 'Sarawak'
  }
];

export const RISK_ZONES: RiskZone[] = [
  { id: 'z1', name: "Alor Setar Basin", lat: 6.1248, lng: 100.3678, radius: 2000, risk: RiskLevel.HIGH, status: 'Active', state: 'Kedah', type: 'Flood risk zone' },
  { id: 'z2', name: "Kota Bharu Riverside", lat: 6.1254, lng: 102.2381, radius: 3000, risk: RiskLevel.CRITICAL, status: 'Active', state: 'Kelantan', type: 'Flood risk zone' },
  { id: 'z3', name: "Kuala Terengganu Coastal", lat: 5.3296, lng: 103.1370, radius: 2500, risk: RiskLevel.HIGH, status: 'Active', state: 'Terengganu', type: 'Flood risk zone' },
  { id: 'z4', name: "Segamat Central", lat: 2.5148, lng: 102.8158, radius: 2000, risk: RiskLevel.HIGH, status: 'Active', state: 'Johor', type: 'Flood risk zone' },
  { id: 'z5', name: "Shah Alam Sector", lat: 3.0738, lng: 101.5183, radius: 1500, risk: RiskLevel.MEDIUM, status: 'Watch', state: 'Selangor', type: 'Flood risk zone' },
  { id: 'z6', name: "Kuantan Industrial", lat: 3.8077, lng: 103.3260, radius: 1800, risk: RiskLevel.MEDIUM, status: 'Watch', state: 'Pahang', type: 'Flood risk zone' },
  { id: 'z7', name: "KK Waterfront", lat: 5.9804, lng: 116.0735, radius: 2200, risk: RiskLevel.MEDIUM, status: 'Watch', state: 'Sabah', type: 'Flood risk zone' },
  { id: 'z8', name: "Kuching Riverbank", lat: 1.5533, lng: 110.3592, radius: 1000, risk: RiskLevel.LOW, status: 'Stable', state: 'Sarawak', type: 'Flood risk zone' },
];

export const FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: '1',
    name: 'Ahmad (Father)',
    status: 'Safe',
    location: 'AIU Multipurpose Hall',
    lastUpdated: '10 mins ago'
  },
  {
    id: '2',
    name: 'Siti (Mother)',
    status: 'Safe',
    location: 'AIU Multipurpose Hall',
    lastUpdated: '10 mins ago'
  },
  {
    id: '3',
    name: 'Zul (Brother)',
    status: 'Warning',
    location: 'Kuala Kedah',
    lastUpdated: '2 mins ago'
  }
];

export const ALERTS: Alert[] = [
  {
    id: '1',
    title: 'Flash Flood Warning',
    message: 'Heavy rain expected in Alor Setar area for the next 3 hours.',
    severity: RiskLevel.HIGH,
    timestamp: '2026-05-13T17:00:00Z'
  },
  {
    id: '2',
    title: 'River Level Alert',
    message: 'Sungai Kedah water level is reaching dangerous levels.',
    severity: RiskLevel.CRITICAL,
    timestamp: '2026-05-13T17:45:00Z'
  }
];
