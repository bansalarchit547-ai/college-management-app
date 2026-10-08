import React from 'react';
import { 
  Users, 
  Briefcase, 
  BookOpen, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  GraduationCap, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DashboardViewProps {
  onOpenAddStudent: () => void;
  onOpenAddEmployee: () => void;
  onOpenIssueBook: () => void;
  onOpenAddPayment: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAddStudent,
  onOpenAddEmployee,
  onOpenIssueBook,
  onOpenAddPayment,
}) => {
  const { 
    students, 
    employees, 
    books, 
    borrowRecords, 
    transactions, 
    proctorLogs, 
    exams,
    setActiveTab 
  } = useApp();

  // Metrics calculation
  const totalStudents = students.length;
  const teachingStaff = employees.filter(e => e.category === 'Teaching').length;
  const nonTeachingStaff = employees.filter(e => e.category === 'Non-Teaching').length;
  
  const totalBooksCount = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const activeBorrowedBooks = borrowRecords.filter(r => r.status === 'Issued' || r.status === 'Overdue').length;
  const overdueCount = borrowRecords.filter(r => r.status === 'Overdue').length;

  const totalFeeCollected = students.reduce((acc, s) => acc + s.paidFee, 0);
  const totalFeePending = students.reduce((acc, s) => acc + s.pendingFee, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);

  // Year-wise breakdown
  const yearCounts = {
    '1st Year': students.filter(s => s.year === '1st Year').length,
    '2nd Year': students.filter(s => s.year === '2nd Year').length,
    '3rd Year': students.filter(s => s.year === '3rd Year').length,
    '4th Year': students.filter(s => s.year === '4th Year').length,
  };

  // Batch breakdown
  const batches = ['2024-2028', '2023-2027', '2022-2026', '2021-2025'] as const;
  const batchCounts = batches.map(b => ({
    batch: b,
    count: students.filter(s => s.batch === b).length
  }));

  // Proctor alerts (<75% attendance)
  const lowAttendanceStudents = students.filter(s => s.attendancePercentage < 75);

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-sky-700 via-indigo-700 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold backdrop-blur-md mb-2">
            <span>Semester Spring 2026</span>
            <span>•</span>
            <span>All Departments Operational</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            CampusPulse ERP Overview
          </h1>
          <p className="text-sky-100 text-sm mt-1 max-w-xl">
            Integrated institutional management for Students, Teaching & Non-Teaching Staff, Library Circulation, Proctor Mentorship, and Accounts.
          </p>
        </div>

        {/* Quick Actions Floating Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
          <button
            onClick={onOpenAddStudent}
            className="flex items-center space-x-2 bg-white text-sky-900 font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow hover:bg-sky-50 transition"
          >
            <PlusCircle className="w-4 h-4 text-sky-600" />
            <span>New Student</span>
          </button>
          <button
            onClick={onOpenIssueBook}
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 hover:bg-white/20 transition"
          >
            <BookOpen className="w-4 h-4 text-sky-300" />
            <span>Issue Book</span>
          </button>
          <button
            onClick={onOpenAddPayment}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow transition"
          >
            <DollarSign className="w-4 h-4" />
            <span>Collect Fee</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Students */}
        <div 
          onClick={() => setActiveTab('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900">{totalStudents}</div>
            <div className="flex items-center text-xs text-slate-500 mt-1 space-x-1">
              <span className="font-semibold text-sky-600">4 Batches</span>
              <span>across 5 Engineering Branches</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Average CGPA</span>
            <span className="font-bold text-slate-800">8.21 / 10</span>
          </div>
        </div>

        {/* Card 2: Employees */}
        <div 
          onClick={() => setActiveTab('employees')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">College Staff</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900">{employees.length}</div>
            <div className="flex items-center text-xs text-slate-500 mt-1 space-x-2">
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                {teachingStaff} Teaching
              </span>
              <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                {nonTeachingStaff} Non-Teaching
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Faculty-Student Ratio</span>
            <span className="font-bold text-slate-800">1 : {(totalStudents / (teachingStaff || 1)).toFixed(1)}</span>
          </div>
        </div>

        {/* Card 3: Library */}
        <div 
          onClick={() => setActiveTab('library')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Library Loans</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900">{activeBorrowedBooks}</div>
            <div className="flex items-center text-xs text-slate-500 mt-1 space-x-1">
              <span>Books currently issued out of</span>
              <span className="font-semibold text-slate-700">{totalBooksCount}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Overdue Returns</span>
            <span className={`font-bold ${overdueCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {overdueCount} book(s)
            </span>
          </div>
        </div>

        {/* Card 4: Accounts / Fee Collected */}
        <div 
          onClick={() => setActiveTab('accounts')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fee Collection</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{(totalFeeCollected / 100000).toFixed(2)} L
            </div>
            <div className="flex items-center text-xs text-amber-700 mt-1 font-medium">
              Pending: ₹{(totalFeePending / 1000).toFixed(0)}k dues
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Expenses Recorded</span>
            <span className="font-bold text-rose-600">₹{(totalExpenses / 100000).toFixed(2)} L</span>
          </div>
        </div>

      </div>

      {/* Two Column Section: Year-wise & Batch Distribution + Proctor At-Risk Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Student Breakdown & Academic Progress */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Year-wise Student Strength */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Year-wise & Batch Student Distribution</h3>
                <p className="text-xs text-slate-500">Active enrollments grouped by academic seniority</p>
              </div>
              <button 
                onClick={() => setActiveTab('students')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center space-x-1"
              >
                <span>View Full Registry</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Year Progress Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(yearCounts) as Array<keyof typeof yearCounts>).map((year) => {
                const count = yearCounts[year];
                const pct = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
                return (
                  <div key={year} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-semibold text-slate-500">{year}</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{count}</p>
                    <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
                      <div 
                        className="bg-sky-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 text-right">{pct}% total</p>
                  </div>
                );
              })}
            </div>

            {/* Batch breakdown tags */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-600 mb-2">Graduating Batches:</p>
              <div className="flex flex-wrap gap-2">
                {batchCounts.map(({ batch, count }) => (
                  <div key={batch} className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 transition">
                    <span className="font-bold text-sky-700">Batch {batch}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>{count} Students</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department Strengths */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">Academic Departments Overview</h3>
            <p className="text-xs text-slate-500 mb-4">Faculty mentors & student distribution per discipline</p>

            <div className="space-y-3">
              {[
                { name: 'Computer Science & Engineering', icon: '💻', students: students.filter(s => s.department === 'Computer Science & Engineering').length, faculty: employees.filter(e => e.department === 'Computer Science & Engineering').length },
                { name: 'Electronics & Communication', icon: '📡', students: students.filter(s => s.department === 'Electronics & Communication').length, faculty: employees.filter(e => e.department === 'Electronics & Communication').length },
                { name: 'Mechanical Engineering', icon: '⚙️', students: students.filter(s => s.department === 'Mechanical Engineering').length, faculty: employees.filter(e => e.department === 'Mechanical Engineering').length },
                { name: 'Information Technology', icon: '🌐', students: students.filter(s => s.department === 'Information Technology').length, faculty: employees.filter(e => e.department === 'Information Technology').length },
                { name: 'Civil Engineering', icon: '🏗️', students: students.filter(s => s.department === 'Civil Engineering').length, faculty: employees.filter(e => e.department === 'Civil Engineering').length },
              ].map((dept) => (
                <div key={dept.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100 transition">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{dept.icon}</span>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">{dept.name}</p>
                      <p className="text-[11px] text-slate-500">{dept.faculty} Faculty Members</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-full">
                      {dept.students} Students
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Proctor Alerts & Recent Activity */}
        <div className="space-y-6">
          
          {/* Proctor Deficit & Risk Warnings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Proctor Attendance Alerts</h3>
              </div>
              <span className="text-[11px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                {lowAttendanceStudents.length} Flagged
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Students falling below the mandatory 75% attendance threshold:
            </p>

            {lowAttendanceStudents.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-1" />
                All students currently satisfy minimum attendance norms!
              </div>
            ) : (
              <div className="space-y-2.5">
                {lowAttendanceStudents.map((std) => (
                  <div key={std.id} className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{std.name}</p>
                      <p className="text-[11px] text-slate-500">{std.rollNo} • {std.year}</p>
                      <p className="text-[10px] text-rose-700 mt-0.5">Proctor: {std.proctorName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-rose-600 bg-rose-100 px-2 py-1 rounded-lg">
                        {std.attendancePercentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setActiveTab('proctor')}
              className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition text-center"
            >
              Open Proctor Portal
            </button>
          </div>

          {/* Recent Financial & Fee Activity */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
              <button 
                onClick={() => setActiveTab('accounts')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {transactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="flex items-start justify-between text-xs pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-slate-800 truncate">{tx.title}</p>
                    <p className="text-[11px] text-slate-400">{tx.paymentDate} • {tx.paymentMode}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`font-bold ${tx.type === 'Income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info: Exams Upcoming */}
          <div className="bg-gradient-to-br from-indigo-50 to-sky-50 p-5 rounded-2xl border border-indigo-100/70">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide">Exam Schedule</h4>
            </div>
            <p className="text-xs text-indigo-950 font-medium">
              {exams.length} examinations registered in the current academic calendar.
            </p>
            <button
              onClick={() => setActiveTab('exams')}
              className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <span>Manage Results & Grade Cards</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
