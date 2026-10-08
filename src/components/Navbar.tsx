import React from 'react';
import { 
  GraduationCap, 
  Menu, 
  Download, 
  RotateCcw, 
  Calendar, 
  Building2,
  Printer,
  HardDrive,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { resetToSampleData, exportDatabase, isDiskSynced } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-sky-500"
              aria-label="Toggle navigation"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold tracking-tight text-slate-900">CampusPulse</span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-sky-100 text-sky-800">
                    College ERP
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Engineering & Technology Institute Management
                </p>
              </div>
            </div>
          </div>

          {/* Center: Disk Saved Status & Academic Semester Badge */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/80">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span className="text-xs font-medium text-slate-700">Academic Year 2026-27</span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-semibold text-emerald-600">Active Term</span>
            </div>

            {/* Permanent Disk Database Status */}
            <div 
              title="Data is permanently stored in data/database.json on your computer disk"
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isDiskSynced 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>{isDiskSynced ? 'Disk Synced' : 'Saving to Disk...'}</span>
            </div>
          </div>

          {/* Right: Quick Tools */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              title="Print Current View"
              className="p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={exportDatabase}
              title="Backup & Export Database (JSON)"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Backup</span>
            </button>

            <button
              onClick={resetToSampleData}
              title="Reset to Sample Demo Data"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Profile Avatar indicator */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-sky-500/30">
                AD
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-none">Admin Office</p>
                <p className="text-[10px] text-slate-500 leading-tight">Superuser</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
