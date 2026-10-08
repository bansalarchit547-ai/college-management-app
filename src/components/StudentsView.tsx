import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  Eye, 
  GraduationCap, 
  Phone, 
  Mail, 
  UserCheck, 
  CheckCircle, 
  AlertCircle,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Student, AcademicYear, Batch, Department } from '../types';

interface StudentsViewProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  isAddModalOpen,
  onCloseAddModal,
  onOpenAddModal
}) => {
  const { students, employees, addStudent, updateStudent, deleteStudent } = useApp();

  const [selectedYear, setSelectedYear] = useState<AcademicYear | 'All'>('All');
  const [selectedBatch, setSelectedBatch] = useState<Batch | 'All'>('All');
  const [selectedDept, setSelectedDept] = useState<Department | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State for Adding / Editing
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    rollNo: '',
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science & Engineering',
    year: '1st Year',
    semester: 1,
    batch: '2024-2028',
    section: 'A',
    proctorId: '',
    proctorName: '',
    gender: 'Male',
    dob: '2006-01-01',
    cgpa: 8.0,
    attendancePercentage: 85,
    feeStatus: 'Paid',
    totalFee: 120000,
    paidFee: 120000,
    pendingFee: 0,
    parentName: '',
    parentPhone: '',
    address: '',
    admissionDate: new Date().toISOString().split('T')[0]
  });

  const teachingStaff = employees.filter(e => e.category === 'Teaching');

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesYear = selectedYear === 'All' || student.year === selectedYear;
    const matchesBatch = selectedBatch === 'All' || student.batch === selectedBatch;
    const matchesDept = selectedDept === 'All' || student.department === selectedDept;
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.proctorName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesYear && matchesBatch && matchesDept && matchesSearch;
  });

  const handleOpenAdd = () => {
    const defaultProctor = teachingStaff[0];
    setFormData({
      rollNo: `24CS0${students.length + 10}`,
      name: '',
      email: '',
      phone: '',
      department: 'Computer Science & Engineering',
      year: '1st Year',
      semester: 1,
      batch: '2024-2028',
      section: 'A',
      proctorId: defaultProctor ? defaultProctor.id : '',
      proctorName: defaultProctor ? defaultProctor.name : 'Unassigned',
      gender: 'Male',
      dob: '2006-01-01',
      cgpa: 8.0,
      attendancePercentage: 85,
      feeStatus: 'Paid',
      totalFee: 120000,
      paidFee: 120000,
      pendingFee: 0,
      parentName: '',
      parentPhone: '',
      address: '',
      admissionDate: new Date().toISOString().split('T')[0]
    });
    setEditingStudent(null);
    onOpenAddModal();
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      rollNo: student.rollNo,
      name: student.name,
      email: student.email,
      phone: student.phone,
      department: student.department,
      year: student.year,
      semester: student.semester,
      batch: student.batch,
      section: student.section,
      proctorId: student.proctorId,
      proctorName: student.proctorName,
      gender: student.gender,
      dob: student.dob,
      cgpa: student.cgpa,
      attendancePercentage: student.attendancePercentage,
      feeStatus: student.feeStatus,
      totalFee: student.totalFee,
      paidFee: student.paidFee,
      pendingFee: student.pendingFee,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      address: student.address,
      admissionDate: student.admissionDate
    });
    onOpenAddModal();
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNo) {
      alert("Please provide student name and roll number.");
      return;
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    } else {
      addStudent(formData);
    }
    onCloseAddModal();
  };

  const handleProctorChange = (proctorId: string) => {
    const selected = teachingStaff.find(t => t.id === proctorId);
    setFormData(prev => ({
      ...prev,
      proctorId,
      proctorName: selected ? selected.name : 'Unassigned'
    }));
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove student record for ${name}?`)) {
      deleteStudent(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Student Directory</h2>
            <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {filteredStudents.length} Students
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Year-wise and Batch-wise academic records with Proctor assignments
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-sky-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Year-wise tabs */}
      <div className="flex overflow-x-auto pb-1 gap-2 no-scrollbar">
        {(['All', '1st Year', '2nd Year', '3rd Year', '4th Year'] as const).map((year) => {
          const count = year === 'All' ? students.length : students.filter(s => s.year === year).length;
          const isSelected = selectedYear === year;
          return (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{year === 'All' ? 'All Academic Years' : year}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Row: Batches, Department & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search name, roll no, proctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
            />
          </div>

          {/* Batch Selector */}
          <div>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50 text-slate-700"
            >
              <option value="All">All Batches</option>
              <option value="2024-2028">Batch 2024-2028</option>
              <option value="2023-2027">Batch 2023-2027</option>
              <option value="2022-2026">Batch 2022-2026</option>
              <option value="2021-2025">Batch 2021-2025</option>
            </select>
          </div>

          {/* Department Selector */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50 text-slate-700"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science & Engineering">Computer Science & Eng</option>
              <option value="Electronics & Communication">Electronics & Comm</option>
              <option value="Mechanical Engineering">Mechanical Eng</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Civil Engineering">Civil Eng</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSelectedYear('All');
                setSelectedBatch('All');
                setSelectedDept('All');
                setSearchQuery('');
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition text-center"
            >
              Reset Filters
            </button>
          </div>

        </div>
      </div>

      {/* Students Data Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Year & Batch</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Proctor</th>
                <th className="py-3.5 px-4 text-center">Attendance</th>
                <th className="py-3.5 px-4 text-center">CGPA</th>
                <th className="py-3.5 px-4 text-center">Fee Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No students found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="text-[11px] text-slate-500">{s.rollNo} • Sec {s.section}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{s.year}</p>
                      <p className="text-[11px] text-slate-500">Batch {s.batch}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-800 font-medium truncate max-w-[160px] block">
                        {s.department}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5 text-slate-700">
                        <UserCheck className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                        <span className="truncate max-w-[140px]">{s.proctorName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
                        s.attendancePercentage >= 75
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700 animate-pulse'
                      }`}>
                        {s.attendancePercentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                        {s.cgpa.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        s.feeStatus === 'Paid' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : s.feeStatus === 'Partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {s.feeStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => setViewingStudent(s)}
                          title="View Profile"
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(s)}
                          title="Edit Student"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          title="Delete Student"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Card List */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredStudents.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No students found matching current filters.
            </div>
          ) : (
            filteredStudents.map((s) => (
              <div key={s.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-sm">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.rollNo} • {s.department}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    s.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {s.feeStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Year / Batch</span>
                    <span className="font-bold text-slate-800">{s.year}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Attendance</span>
                    <span className={`font-bold ${s.attendancePercentage < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {s.attendancePercentage}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">CGPA</span>
                    <span className="font-bold text-slate-800">{s.cgpa.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="truncate">Proctor: <strong className="text-slate-700">{s.proctorName}</strong></span>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => setViewingStudent(s)} className="text-sky-600 font-semibold p-1">View</button>
                    <button onClick={() => handleOpenEdit(s)} className="text-indigo-600 font-semibold p-1">Edit</button>
                    <button onClick={() => handleDelete(s.id, s.name)} className="text-rose-600 font-semibold p-1">Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingStudent ? 'Edit Student Details' : 'Register New Student'}
              </h3>
              <button 
                onClick={onCloseAddModal}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Roll / USN Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    placeholder="e.g. 24CS025"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ananya Rao"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ananya@campus.edu"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year *</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value as AcademicYear })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch *</label>
                  <select
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value as Batch })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="2024-2028">Batch 2024-2028</option>
                    <option value="2023-2027">Batch 2023-2027</option>
                    <option value="2022-2026">Batch 2022-2026</option>
                    <option value="2021-2025">Batch 2021-2025</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section & Semester</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Sec A"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                    <input
                      type="number"
                      min="1"
                      max="8"
                      placeholder="Sem 1-8"
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                      className="text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assign Faculty Proctor *</label>
                  <select
                    value={formData.proctorId}
                    onChange={(e) => handleProctorChange(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">Select a Faculty Member</option>
                    {teachingStaff.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Attendance % & CGPA</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Attendance %"
                      value={formData.attendancePercentage}
                      onChange={(e) => setFormData({ ...formData, attendancePercentage: parseFloat(e.target.value) || 0 })}
                      className="text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="CGPA (0-10)"
                      value={formData.cgpa}
                      onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                      className="text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="Father / Mother name"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent Contact</label>
                  <input
                    type="text"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onCloseAddModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md transition"
                >
                  {editingStudent ? 'Save Changes' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Viewing Student Profile Details Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-sky-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                  {viewingStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{viewingStudent.name}</h3>
                  <p className="text-xs text-slate-500">{viewingStudent.rollNo} • {viewingStudent.year} (Sem {viewingStudent.semester})</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Department</span>
                  <span className="font-semibold text-slate-800">{viewingStudent.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Batch</span>
                  <span className="font-semibold text-slate-800">Batch {viewingStudent.batch}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Assigned Proctor</span>
                  <span className="font-bold text-sky-700">{viewingStudent.proctorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Current CGPA</span>
                  <span className="font-bold text-slate-800">{viewingStudent.cgpa} / 10.0</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Attendance</span>
                  <span className={`font-bold ${viewingStudent.attendancePercentage < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {viewingStudent.attendancePercentage}% {viewingStudent.attendancePercentage < 75 ? '(Deficit Alert)' : ''}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Fee Status</span>
                  <span className={`font-bold ${viewingStudent.feeStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {viewingStudent.feeStatus} (Paid ₹{viewingStudent.paidFee.toLocaleString()})
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-800">Contact & Family Details:</p>
                <div className="text-slate-600 space-y-1">
                  <p>📧 Email: <span className="font-medium text-slate-800">{viewingStudent.email || 'N/A'}</span></p>
                  <p>📱 Student Phone: <span className="font-medium text-slate-800">{viewingStudent.phone || 'N/A'}</span></p>
                  <p>👨‍👩‍👦 Parent / Guardian: <span className="font-medium text-slate-800">{viewingStudent.parentName} ({viewingStudent.parentPhone})</span></p>
                  <p>📍 Residence: <span className="font-medium text-slate-800">{viewingStudent.address}</span></p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
