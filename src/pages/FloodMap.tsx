import React, { useState, useMemo, useEffect } from 'react';
import { 
  Layers, 
  Map as MapIcon, 
  LocateFixed, 
  ZoomIn, 
  ZoomOut, 
  Info, 
  Filter, 
  AlertTriangle, 
  Home, 
  ChevronRight,
  Navigation,
  CheckCircle2,
  Users,
  Search,
  X,
  MapPin,
  Zap,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

import RiskBadge from '../components/RiskBadge';
import { RiskLevel, ShelterStatus } from '../types';
import { FLOOD_REPORTS, SHELTERS, RISK_ZONES } from '../constants';

// Custom Icons for different entities
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const iconColors = {
  user: '#0ea5e9', // cyan-500
  low: '#22c55e', // green-500
  medium: '#eab308', // yellow-500
  high: '#f97316', // orange-500
  critical: '#ef4444', // red-500
  shelter: '#8b5cf6', // purple-500
};

const MALAYSIA_CENTER: [number, number] = [4.2105, 101.9758];
const ALOR_SETAR_CENTER: [number, number] = [6.1248, 100.3678];

// Map Helper Component to allow programmatic flying/re-centering
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Map Legend Component
function MapLegend() {
  return (
    <div className="absolute top-6 left-6 z-[1000] bg-slate-900/60 backdrop-blur-xl border border-white/5 p-5 rounded-2xl shadow-2xl pointer-events-none">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping shadow-[0_0_8px_red]"></div>
        <h4 className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Live Map Data</h4>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: iconColors.critical, color: iconColors.critical }}></div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">High Danger</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: iconColors.shelter, color: iconColors.shelter }}></div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Safe Shelter</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: iconColors.user, color: iconColors.user }}></div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Your Location</span>
        </div>
      </div>
    </div>
  );
}

// Map Controls Component - must be used inside MapContainer to use useMap
function MapControls({ onCenterMalaysia }: { onCenterMalaysia: () => void }) {
  const map = useMap();
  
  return (
    <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-3">
      <div className="flex flex-col bg-slate-900/80 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
        <button 
          onClick={() => map.zoomIn()}
          className="p-4 text-slate-400 hover:text-white transition-all active:bg-slate-800"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button 
          onClick={() => map.zoomOut()}
          className="p-4 text-slate-400 hover:text-white transition-all border-t border-slate-800 active:bg-slate-800"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>
      <button 
        onClick={onCenterMalaysia}
        className="p-4 bg-slate-900/80 backdrop-blur-lg border border-slate-700/50 rounded-2xl text-cyan-400 shadow-2xl hover:scale-105 active:scale-95 transition-all"
        title="Re-center Malaysia"
      >
        <LocateFixed className="w-5 h-5" />
      </button>
    </div>
  );
}

// Simulation Fallback Component
function MapSimulationFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 border-2 border-slate-800 rounded-3xl">
      <div className="text-center p-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-6" />
        <h3 className="text-white font-black uppercase tracking-widest mb-2">Map Offline</h3>
        <p className="text-slate-500 text-[10px] max-w-[240px]">Interactive mapping services currently unavailable. Please check your internet connection.</p>
      </div>
    </div>
  );
}

// Separate Real Map component for cleaner lifecycle management
const RealMalaysiaMap = ({ 
  viewCenter, 
  viewZoom, 
  filteredReports, 
  filteredShelters, 
  filteredZones, 
  selectNode,
  onCenterMalaysia
}: any) => {
  return (
    <MapContainer 
      center={viewCenter} 
      zoom={viewZoom} 
      className="w-full h-full"
      zoomControl={false}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapController center={viewCenter} zoom={viewZoom} />

      {/* Map UI Overlays */}
      <MapLegend />
      <MapControls onCenterMalaysia={onCenterMalaysia} />

      {/* Risk Markers */}
      {filteredReports.map((report: any, index: number) => (
        <Marker 
          key={`report-${report.id}-${index}`} 
          position={[report.lat, report.lng]}
          icon={createCustomIcon(
            report.severity === RiskLevel.CRITICAL ? iconColors.critical : 
            report.severity === RiskLevel.HIGH ? iconColors.high : 
            report.severity === RiskLevel.MEDIUM ? iconColors.medium : iconColors.low
          )}
          eventHandlers={{ click: () => selectNode(report, 'report') }}
        >
          <Popup className="tactical-popup">
             <div className="p-2">
                <p className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1 text-center">FLOOD REPORT</p>
                <h4 className="text-[10px] font-black text-slate-900 uppercase mb-2 text-center">{report.location}</h4>
                <div className="flex justify-center mb-2">
                   <RiskBadge level={report.severity} className="scale-75" />
                </div>
                <p className="text-[8px] text-slate-500 italic mb-2 text-center">{report.description}</p>
                <Link 
                  to={`/incident/${report.id}`} 
                  className="w-full py-1.5 bg-slate-900 text-white text-[8px] font-black uppercase rounded shadow-md text-center block"
                >
                  View Details
                </Link>
             </div>
          </Popup>
        </Marker>
      ))}

      {/* Shelter Markers */}
      {filteredShelters.map((shelter: any, index: number) => (
        <Marker 
          key={`shelter-${shelter.id}-${index}`} 
          position={[shelter.lat, shelter.lng]}
          icon={createCustomIcon(iconColors.shelter)}
          eventHandlers={{ click: () => selectNode(shelter, 'shelter') }}
        >
          <Popup>
             <div className="p-2">
                <p className="text-[8px] font-black text-green-600 uppercase tracking-widest mb-1 text-center">SAFE SHELTER</p>
                <h4 className="text-[10px] font-black text-slate-900 uppercase mb-2 text-center">{shelter.name}</h4>
                <p className="text-[8px] text-slate-500 mb-2 text-center">{shelter.currentOccupancy}/{shelter.totalCapacity} Spots filled</p>
                <button 
                  onClick={() => selectNode(shelter, 'shelter')} 
                  className="w-full py-1.5 bg-green-600 text-white text-[8px] font-black uppercase rounded shadow-md"
                >
                  Details
                </button>
             </div>
          </Popup>
        </Marker>
      ))}

      {/* Risk Zones - Visualized as Circles */}
      {filteredZones.map((zone: any, index: number) => (
        <Circle 
          key={`zone-${zone.id}-${index}`}
          center={[zone.lat, zone.lng]}
          radius={zone.radius}
          pathOptions={{ 
            color: zone.risk === RiskLevel.CRITICAL ? '#ef4444' : '#f97316',
            fillColor: zone.risk === RiskLevel.CRITICAL ? '#ef4444' : '#f97316',
            fillOpacity: 0.1,
            dashArray: '5, 10'
          }}
          eventHandlers={{ click: () => selectNode(zone, 'zone') }}
        />
      ))}

      {/* User Location */}
      <Marker 
        position={[6.1822, 100.3710]} // Static user location for demo
        icon={createCustomIcon(iconColors.user)}
      >
        <Popup>
           <div className="p-2 text-center">
              <p className="text-[10px] font-black text-cyan-600 uppercase">You are here</p>
              <p className="text-[8px] text-slate-400">Area: Kedah/AIU</p>
           </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default function FloodMap() {
  const [stateFilter, setStateFilter] = useState('All Malaysia');
  const [typeFilter, setTypeFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewCenter, setViewCenter] = useState<[number, number]>(MALAYSIA_CENTER);
  const [viewZoom, setViewZoom] = useState(6);

  // States list for filter
  const states = [
    'All Malaysia', 'Kedah', 'Kelantan', 'Terengganu', 'Johor', 'Selangor', 
    'Pahang', 'Sabah', 'Sarawak'
  ];

  const filteredReports = useMemo(() => {
    return FLOOD_REPORTS.filter(report => {
      const matchesSearch = report.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState = stateFilter === 'All Malaysia' || report.state === stateFilter;
      const matchesType = typeFilter === 'all' || typeFilter === 'reports';
      const matchesRisk = riskFilter === 'all' || report.severity.toLowerCase() === riskFilter.toLowerCase();
      const matchesStatus = statusFilter === 'all' || report.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesState && matchesType && matchesRisk && matchesStatus;
    });
  }, [stateFilter, typeFilter, riskFilter, statusFilter, searchQuery]);

  const filteredShelters = useMemo(() => {
    return SHELTERS.filter(shelter => {
      const matchesSearch = shelter.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState = stateFilter === 'All Malaysia' || shelter.state === stateFilter;
      const matchesType = typeFilter === 'all' || typeFilter === 'shelters';
      const matchesRisk = riskFilter === 'all' || shelter.routeRisk.toLowerCase() === riskFilter.toLowerCase();
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'available' && shelter.status === ShelterStatus.AVAILABLE) ||
        (statusFilter === 'almost full' && shelter.status === ShelterStatus.ALMOST_FULL) ||
        (statusFilter === 'full' && shelter.status === ShelterStatus.FULL);

      return matchesSearch && matchesState && matchesType && matchesRisk && matchesStatus;
    });
  }, [stateFilter, typeFilter, riskFilter, statusFilter, searchQuery]);

  const filteredZones = useMemo(() => {
    return RISK_ZONES.filter(zone => {
      const matchesSearch = zone.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState = stateFilter === 'All Malaysia' || zone.state === stateFilter;
      const matchesType = typeFilter === 'all' || typeFilter === 'zones';
      const matchesRisk = riskFilter === 'all' || zone.risk.toLowerCase() === riskFilter.toLowerCase();
      const matchesStatus = statusFilter === 'all';
      
      return matchesSearch && matchesState && matchesType && matchesRisk && matchesStatus;
    });
  }, [stateFilter, typeFilter, riskFilter, statusFilter, searchQuery]);

  const stats = useMemo(() => ({
    totalReports: FLOOD_REPORTS.length,
    activeZones: RISK_ZONES.length,
    availableShelters: SHELTERS.filter(s => s.status === ShelterStatus.AVAILABLE).length,
    criticalLocations: FLOOD_REPORTS.filter(r => r.severity === RiskLevel.CRITICAL).length + 
                       RISK_ZONES.filter(z => z.risk === RiskLevel.CRITICAL).length
  }), []);

  const handleStateChange = (state: string) => {
    setStateFilter(state);
    if (state === 'Kedah') {
      setViewCenter(ALOR_SETAR_CENTER);
      setViewZoom(13);
    } else if (state === 'All Malaysia') {
      setViewCenter(MALAYSIA_CENTER);
      setViewZoom(6);
    }
  };

  const selectNode = (item: any, type: string) => {
    setSelectedItem({ ...item, type });
    if (item.lat && item.lng) {
      setViewCenter([item.lat, item.lng]);
      setViewZoom(15);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full min-h-[calc(100vh-140px)]">
      {/* Top Header & Stats */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-600" />
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase relative inline-block">
              Live Flood Map
              <div className="absolute -top-1 -right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </h1>
          </div>
          <p className="text-slate-500 text-sm font-medium italic">
            National <span className="text-cyan-600 font-bold">Flood Overview</span> — {stateFilter}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <div className="hidden sm:flex items-center gap-4 md:gap-8 border-r border-slate-200 pr-4 md:pr-8 md:mr-2">
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Risk Areas</p>
                 <p className="text-sm font-black text-red-600 font-mono">{stats.activeZones.toString().padStart(2, '0')}</p>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Reports</p>
                 <p className="text-sm font-black text-slate-900">{stats.totalReports}</p>
              </div>
              <div className="hidden md:block text-right">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Shelters</p>
                 <p className="text-sm font-black text-green-600">{stats.availableShelters}</p>
              </div>
           </div>

           <div className="relative group w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/50 transition-all w-full shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Detail Panel / Sidebar */}
        <div className="w-full lg:w-96 flex flex-col gap-6 order-2 lg:order-1">
           {/* Comprehensive Filters */}
           <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div>
                 <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Select State</h3>
                 </div>
                 <select 
                   value={stateFilter}
                   onChange={(e) => handleStateChange(e.target.value)}
                   className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-cyan-500/50"
                 >
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Show Category</h3>
                    <div className="flex flex-col gap-2">
                       {['all', 'reports', 'zones', 'shelters'].map(t => (
                          <button 
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase text-left transition-all border ${typeFilter === t ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}`}
                          >
                             {t}
                          </button>
                       ))}
                    </div>
                 </div>
                 <div>
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Risk Level</h3>
                    <div className="flex flex-col gap-2">
                       {['all', 'low', 'medium', 'high', 'critical'].map(r => (
                          <button 
                            key={r}
                            onClick={() => setRiskFilter(r)}
                            className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase text-left transition-all border ${riskFilter === r ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}`}
                          >
                             {r}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           </section>
           
           {/* Selected Item Panel */}
           <AnimatePresence mode="wait">
             {selectedItem ? (
                <motion.section 
                  key={selectedItem.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl border-2 border-slate-900 shadow-2xl flex-1 flex flex-col overflow-hidden"
                >
                   <div className="h-1.5 w-full bg-cyan-600"></div>
                   <div className="p-8 flex-1 overflow-y-auto scrollbar-hide">
                      <header className="flex items-start justify-between mb-8">
                         <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${
                              selectedItem.type === 'report' ? 'bg-red-50 border-red-100 text-red-600' : 
                              selectedItem.type === 'shelter' ? 'bg-green-50 border-green-100 text-green-600' :
                              'bg-amber-50 border-amber-100 text-amber-600'
                            }`}>
                               {selectedItem.type === 'report' ? <AlertTriangle className="w-8 h-8" /> : 
                                selectedItem.type === 'shelter' ? <Home className="w-8 h-8" /> : <Layers className="w-8 h-8" />}
                            </div>
                            <div>
                               <h4 className="text-base font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{selectedItem.location || selectedItem.name}</h4>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{selectedItem.state} sector</p>
                            </div>
                         </div>
                         <button onClick={() => setSelectedItem(null)} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
                            <X className="w-5 h-5 text-slate-400" />
                         </button>
                      </header>

                      {/* Tactical Specs */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                         <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Status</p>
                            <p className="text-[11px] font-black text-slate-900 uppercase">{selectedItem.status || 'Active'}</p>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Risk Level</p>
                            <RiskBadge level={selectedItem.severity || selectedItem.risk || selectedItem.routeRisk || RiskLevel.LOW} className="scale-90 origin-left" />
                         </div>
                         <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Details</p>
                            <p className="text-[11px] font-black text-slate-900 uppercase">
                               {selectedItem.waterLevel || (selectedItem.availableSpace !== undefined ? `${selectedItem.availableSpace} Open` : 'Spatial')}
                            </p>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Last Updated</p>
                            <p className="text-[11px] font-black text-slate-900 uppercase">01:45 SEC</p>
                         </div>
                      </div>

                      {/* AI Reasoning */}
                      <div className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden mb-8 shadow-2xl">
                         <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Zap className="w-16 h-16 text-cyan-400" />
                         </div>
                         <h5 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 font-mono">
                            <Zap className="w-4 h-4 animate-pulse" /> AI Safety Info
                         </h5>
                         <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic border-l-2 border-cyan-600 pl-4">
                            {selectedItem.type === 'report' 
                              ? `For ${selectedItem.location}, AquaSense AI estimates the risk based on report severity, shelter availability, route risk, and future weather predictions.`
                              : selectedItem.type === 'shelter'
                              ? `Shelter is reliable. Current space used: ${((selectedItem.currentOccupancy/selectedItem.totalCapacity)*100).toFixed(1)}%. Basic services are stable.`
                              : `Risk mapping indicates rising water for ${selectedItem.name}. High chance of flooding within the next few hours.`}
                         </p>
                      </div>

                      <button className="w-full py-4 bg-cyan-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-cyan-900/20 hover:bg-cyan-500 border-b-4 border-cyan-800 transition-all active:translate-y-1 active:border-b-0">
                         Get Directions
                      </button>
                   </div>
                </motion.section>
             ) : (
                <section className="flex-1 flex flex-col gap-6">
                   <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                         <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                           <Zap className="w-3 h-3 text-cyan-500" /> Recent Reports
                         </h4>
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{filteredReports.length} Reports</span>
                      </div>
                      
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                         {filteredReports.map(report => (
                            <button 
                              key={report.id}
                              onClick={() => selectNode(report, 'report')}
                              className="w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-all text-left flex items-center justify-between group"
                            >
                               <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                  <div>
                                     <p className="text-[10px] font-black text-slate-900 uppercase leading-none mb-1 group-hover:text-cyan-600 transition-colors">{report.location}</p>
                                     <p className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">{report.state} Sector</p>
                                  </div>
                               </div>
                               <RiskBadge level={report.severity} className="scale-75 origin-right" />
                            </button>
                         ))}
                         {filteredReports.length === 0 && (
                            <div className="py-8 text-center">
                               <p className="text-[10px] text-slate-400 italic">No incidents matching filters.</p>
                            </div>
                         )}
                      </div>
                   </div>

                   <div className="bg-white border-2 border-slate-200 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center flex-1 opacity-60">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                         <MapIcon className="w-8 h-8 text-slate-300" />
                      </div>
                      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Explore the Map</h4>
                      <p className="text-[9px] text-slate-400 font-medium italic max-w-[150px]">Select a coordinated node on the sentinel map to extract telemetry data.</p>
                   </div>
                </section>
             )}
           </AnimatePresence>
        </div>

        {/* The Interactive Map */}
        <div className="relative bg-slate-100 rounded-3xl border-2 border-slate-200 overflow-hidden shadow-2xl h-[450px] lg:h-auto lg:flex-1 order-1 lg:order-2">
           <RealMalaysiaMap 
             viewCenter={viewCenter}
             viewZoom={viewZoom}
             filteredReports={filteredReports}
             filteredShelters={filteredShelters}
             filteredZones={filteredZones}
             selectNode={selectNode}
             onCenterMalaysia={() => {
               setViewCenter(MALAYSIA_CENTER);
               setViewZoom(6);
             }}
           />
        </div>
      </div>

    </div>
  );
}
