import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  UserCheck, 
  BookOpen, 
  CreditCard, 
  Award,
  ChevronRight,
  ShieldAlert,
  Building
} from 'lucide-react';
import { useApp, NavigationTab } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, students, employees, borrowRecords, proctorLogs } = useApp();

  const highRiskCount = proctorLogs.filter(p => p.academicRisk === 'High').length;
  const activeBorrowsCount = borrowRecords.filter(b => b.status === 'Issued' || b.status === 'Overdue').length;

  const navItems: Array<{
    id: NavigationTab;
    label: string;
    sublabel: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      sublabel: 'Campus metrics & KPIs',
      icon: LayoutDashboard,
    },
    {
      id: 'students',
      label: 'Students',
      sublabel: 'Year & Batch-wise records',
      icon: Users,
      badge: students.length,
      badgeColor: 'bg-sky-100 text-sky-800'
    },
    {
      id: 'employees',
      label: 'Employees',
      sublabel: 'Teaching & Non-Teaching',
      icon: Briefcase,
      badge: employees.length,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'proctor',
      label: 'Proctor System',
      sublabel: 'Mentorship & Student Risk',
      icon: UserCheck,
      badge: highRiskCount > 0 ? `${highRiskCount} Alerts` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'library',
      label: 'Library',
      sublabel: 'Catalog & Circulation',
      icon: BookOpen,
      badge: activeBorrowsCount > 0 ? activeBorrowsCount : undefined,
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'accounts',
      label: 'Accounts & Fees',
      sublabel: 'Fee dues, payroll & cashflow',
      icon: CreditCard,
    },
    {
      id: 'exams',
      label: 'Exams & Results',
      sublabel: 'Marksheets, SGPA & CGPA',
      icon: Award,
    },
  ];

  const handleSelect = (tab: NavigationTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div className="flex-1 overflow-y-auto py-5 px-4">
          
          {/* Institution Header in Drawer */}
          <div className="px-3 pb-5 mb-4 border-b border-slate-100 lg:hidden flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-sky-600" />
              <span className="font-bold text-slate-800">Campus ERP Navigation</span>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
            >
              ✕
            </button>
          </div>

          <div className="mb-2 px-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Main Modules</p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all group ${
                    isActive
                      ? 'bg-sky-600 text-white font-semibold shadow-md shadow-sky-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                    <div className="truncate">
                      <p className="text-sm leading-tight truncate">{item.label}</p>
                      <p className={`text-[11px] leading-tight truncate ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                        {item.sublabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 flex-shrink-0 ml-2">
                    {item.badge !== undefined && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-sky-200 translate-x-0.5' : 'text-slate-300 opacity-0 group-hover:opacity-100'
                    }`} />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom System Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 m-3 rounded-xl">
          <div className="flex items-center space-x-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-semibold text-slate-700">Windows & Mobile Ready</p>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Data synced to local memory. Works offline or online.
          </p>
        </div>
      </aside>
    </>
  );
};
