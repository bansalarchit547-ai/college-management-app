import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { EmployeesView } from './components/EmployeesView';
import { ProctorView } from './components/ProctorView';
import { LibraryView } from './components/LibraryView';
import { AccountsView } from './components/AccountsView';
import { ExamsView } from './components/ExamsView';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Cross-view modal openers
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isIssueBookOpen, setIsIssueBookOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  const handleDashboardAddStudent = () => {
    setActiveTab('students');
    setIsAddStudentOpen(true);
  };

  const handleDashboardAddEmployee = () => {
    setActiveTab('employees');
    setIsAddEmployeeOpen(true);
  };

  const handleDashboardIssueBook = () => {
    setActiveTab('library');
    setIsIssueBookOpen(true);
  };

  const handleDashboardAddPayment = () => {
    setActiveTab('accounts');
    setIsAddPaymentOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Top Header */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Sidebar for Desktop / Drawer for Mobile */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Dynamic Content View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-full overflow-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenAddStudent={handleDashboardAddStudent}
              onOpenAddEmployee={handleDashboardAddEmployee}
              onOpenIssueBook={handleDashboardIssueBook}
              onOpenAddPayment={handleDashboardAddPayment}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              isAddModalOpen={isAddStudentOpen}
              onOpenAddModal={() => setIsAddStudentOpen(true)}
              onCloseAddModal={() => setIsAddStudentOpen(false)}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeesView
              isAddModalOpen={isAddEmployeeOpen}
              onOpenAddModal={() => setIsAddEmployeeOpen(true)}
              onCloseAddModal={() => setIsAddEmployeeOpen(false)}
            />
          )}

          {activeTab === 'proctor' && <ProctorView />}

          {activeTab === 'library' && (
            <LibraryView
              isIssueModalOpen={isIssueBookOpen}
              onOpenIssueModal={() => setIsIssueBookOpen(true)}
              onCloseIssueModal={() => setIsIssueBookOpen(false)}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountsView
              isAddPaymentOpen={isAddPaymentOpen}
              onOpenAddPayment={() => setIsAddPaymentOpen(true)}
              onCloseAddPayment={() => setIsAddPaymentOpen(false)}
            />
          )}

          {activeTab === 'exams' && <ExamsView />}
        </main>

      </div>

      {/* Native-style Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
