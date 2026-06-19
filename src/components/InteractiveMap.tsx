import { useState } from 'react';
import { Branch } from '../types';
import { MapPin, Navigation, Phone, Clock } from 'lucide-react';

interface InteractiveMapProps {
  branches: Branch[];
  selectedBranch: Branch;
  onSelectBranch: (branch: Branch) => void;
}

export default function InteractiveMap({ branches, selectedBranch, onSelectBranch }: InteractiveMapProps) {
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);

  // High-fidelity vector SVG representation of Tasikmalaya simplified layout
  return (
    <div className="relative w-full h-[400px] bg-[#eef5fc] rounded-2xl border border-[#cbd5e1] overflow-hidden shadow-xs flex flex-col">
      {/* Map stage */}
      <div className="relative flex-1 bg-[#e0ecf8] overflow-hidden flex items-center justify-center">
        {/* Decorative Grid Lines / Road lines simulation */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563eb" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Main Simulated Roads (Tasikmalaya Landmark style) */}
          {/* Malioboro St / Mangkubumi St running North-South */}
          <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round" />
          <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#ffffff" strokeWidth="2" strokeDasharray="6,4" strokeLinecap="round" />
          
          {/* Ringroad East-West running at the top */}
          <line x1="0%" y1="15%" x2="100%" y2="15%" stroke="#3b82f6" strokeWidth="16" strokeLinecap="round" />
          <line x1="0%" y1="15%" x2="100%" y2="15%" stroke="#ffffff" strokeWidth="3" strokeDasharray="8,5" strokeLinecap="round" />
          
          {/* Seturan road connection */}
          <line x1="50%" y1="30%" x2="90%" y2="30%" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
          <line x1="90%" y1="15%" x2="90%" y2="100%" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
          
          {/* Alun-alun Selatan Circle at the bottom */}
          <circle cx="50%" cy="85%" r="32" fill="none" stroke="#3b82f6" strokeWidth="12" />
          <circle cx="50%" cy="85%" r="20" fill="#22c55e" className="opacity-40 animate-pulse" />
          <circle cx="50%" cy="85%" r="1" fill="#14532d" />
          
          {/* Waterway / Code River simulation running next to Malioboro */}
          <path d="M 33% 0 Q 38% 30% 30% 60% T 35% 100%" fill="none" stroke="#93c5fd" strokeWidth="4" />
        </svg>

        {/* Legend / Peta Interaktif UI Overlay */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full text-xs font-semibold text-[#006e25] border border-emerald-100 shadow-xs flex items-center gap-1.5 z-10">
          <span className="w-2 h-2 rounded-full bg-[#28a745] animate-ping" />
          Peta Tasikmalaya (Simulasi Interaktif)
        </div>

        {/* Interactive Landmarks / Branch Pins */}
        {branches.map((branch) => {
          // Calculate relative map position based on sample coords to keep pins clean
          let left = '50%';
          let top = '50%';
          if (branch.id === 'b1') { // Alun-alun Tasikmalaya
            left = '50%';
            top = '45%';
          } else if (branch.id === 'b2') { // Mangkubumi Tasikmalaya
            left = '42%';
            top = '72%';
          }

          const isActive = selectedBranch.id === branch.id;
          const isHovered = hoveredBranch === branch.id;

          return (
            <button
              key={branch.id}
              onClick={() => onSelectBranch(branch)}
              onMouseEnter={() => setHoveredBranch(branch.id)}
              onMouseLeave={() => setHoveredBranch(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-hidden z-20"
              style={{ left, top }}
              id={`map-pin-btn-${branch.id}`}
            >
              <div className="relative flex flex-col items-center">
                {/* Visual Glow or Range Circle on Active or Hover */}
                {(isActive || isHovered) && (
                  <span className="absolute -inset-4 rounded-full bg-[#28a745]/20 animate-ping duration-1000" />
                )}

                {/* Pin Card Preview on Hover or Active */}
                {(isActive || isHovered) && (
                  <div className="absolute bottom-9 bg-white text-gray-900 px-3 py-1.5 rounded-lg shadow-md border border-emerald-100 whitespace-nowrap text-xs font-bold transition-all duration-200 z-30 flex flex-col items-start gap-0.5">
                    <span className="text-[#006e25] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#28a745]" />
                      {branch.nama}
                    </span>
                    <span className="text-[10px] text-gray-500 font-normal">{branch.jamBuka}</span>
                  </div>
                )}

                {/* Physical Pin Icon */}
                <div
                  className={`p-2.5 rounded-full transition-all duration-300 shadow-sm ${
                    isActive
                      ? 'bg-[#006e25] text-white scale-125 ring-4 ring-emerald-100'
                      : 'bg-white text-[#006e25] hover:bg-[#006e25] hover:text-white hover:scale-110'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                
                {/* Pin Tip / Shadow pointer */}
                <div 
                  className={`w-2 h-2 rotate-45 -mt-1 transition-colors duration-300 ${
                    isActive ? 'bg-[#006e25]' : 'bg-white group-hover:bg-[#006e25]'
                  }`} 
                />
              </div>
            </button>
          );
        })}

        {/* Map Center Compass Rose Decorator */}
        <div className="absolute right-3 bottom-3 pointer-events-none opacity-40 flex flex-col items-center text-gray-400">
          <Navigation className="w-6 h-6 rotate-[210deg] stroke-1" />
          <span className="text-[10px] font-bold">UTARA</span>
        </div>
      </div>

      {/* Selected Branch Detail Card At Bottom */}
      <div className="bg-white p-4 border-t border-[#cbd5e1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h4 className="font-display font-semibold text-gray-900 text-sm flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#28a745]" />
            {selectedBranch.nama}
          </h4>
          <p className="text-xs text-gray-500 mt-1 max-w-md">{selectedBranch.alamat}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-sm border border-gray-100">
            <Clock className="w-3.5 h-3.5 text-[#006e25]" />
            {selectedBranch.jamBuka}
          </div>
          
          <a
            href={`tel:${selectedBranch.telepon}`}
            className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors px-2 py-1 rounded-sm border border-emerald-100"
          >
            <Phone className="w-3.5 h-3.5" />
            Hubungi
          </a>
        </div>
      </div>
    </div>
  );
}
