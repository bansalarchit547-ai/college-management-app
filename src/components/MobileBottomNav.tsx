import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BookOpen, 
  CreditCard, 
  Award,
  UserCheck
} from 'lucide-react';
import { useApp, NavigationTab } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const items: Array<{ id: NavigationTab; label: string; icon: React.ElementType }> = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'employees', label: 'Staff', icon: Briefcase },
    { id: 'proctor', label: 'Proctor', icon: UserCheck },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'exams', label: 'Exams', icon: Award },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 lg:hidden shadow-lg print:hidden safe-area-pb">
      <div className="grid grid-cols-7 h-16 items-center px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 transition-all ${
                isActive ? 'text-sky-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-sky-50' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full px-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
