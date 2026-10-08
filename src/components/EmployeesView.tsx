import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Briefcase, 
  GraduationCap, 
  Trash2, 
  Edit, 
  Eye, 
  UserCheck, 
  BadgeCheck, 
  Building2,
  Calendar,
  DollarSign,
  X,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Employee, EmployeeCategory, Department } from '../types';

interface EmployeesViewProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  isAddModalOpen,
  onCloseAddModal,
  onOpenAddModal
}) => {
  const { employees, students, addEmployee, updateEmployee, deleteEmployee } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<EmployeeCategory | 'All'>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    empCode: '',
    name: '',
    email: '',
    phone: '',
    category: 'Teaching',
    designation: 'Assistant Professor',
    department: 'Computer Science & Engineering',
    qualification: 'M.Tech, Ph.D.',
    specialization: 'Computer Systems',
    dateOfJoining: new Date().toISOString().split('T')[0],
    salary: 85000,
    isProctor: true,
    assignedWardsCount: 0,
    status: 'Active',
    experienceYears: 5
  });

  const filteredEmployees = employees.filter(emp => {
    const matchesCat = selectedCategory === 'All' || emp.category === selectedCategory;
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesDept && matchesSearch;
  });

  const handleOpenAdd = () => {
    setFormData({
      empCode: `EMP-${Date.now().toString().slice(-4)}`,
      name: '',
      email: '',
      phone: '',
      category: 'Teaching',
      designation: 'Assistant Professor',
      department: 'Computer Science & Engineering',
      qualification: 'M.Tech / Ph.D.',
      specialization: '',
      dateOfJoining: new Date().toISOString().split('T')[0],
      salary: 85000,
      isProctor: true,
      assignedWardsCount: 0,
      status: 'Active',
      experienceYears: 3
    });
    setEditingEmployee(null);
    onOpenAddModal();
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      empCode: emp.empCode,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      category: emp.category,
      designation: emp.designation,
      department: emp.department,
      qualification: emp.qualification,
      specialization: emp.specialization || '',
      dateOfJoining: emp.dateOfJoining,
      salary: emp.salary,
      isProctor: emp.isProctor,
      assignedWardsCount: emp.assignedWardsCount,
      status: emp.status,
      experienceYears: emp.experienceYears
    });
    onOpenAddModal();
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.empCode) {
      alert("Please provide employee name and code.");
      return;
    }

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, formData);
    } else {
      addEmployee(formData);
    }
    onCloseAddModal();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove employee record for ${name}?`)) {
      deleteEmployee(id);
    }
  };

  // Find wards assigned to this employee if proctor
  const getWardsForEmployee = (empId: string) => {
    return students.filter(s => s.proctorId === empId);
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Faculty & Staff Directory</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {filteredEmployees.length} Staff Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Teaching faculty & Non-teaching administrative personnel records
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Category Tabs: All, Teaching, Non-Teaching */}
      <div className="flex overflow-x-auto pb-1 gap-2 no-scrollbar">
        {[
          { label: 'All Personnel', value: 'All', count: employees.length },
          { label: 'Teaching Faculty', value: 'Teaching', count: employees.filter(e => e.category === 'Teaching').length },
          { label: 'Non-Teaching Staff', value: 'Non-Teaching', count: employees.filter(e => e.category === 'Non-Teaching').length },
        ].map(tab => {
          const isSelected = selectedCategory === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setSelectedCategory(tab.value as any)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search faculty name, code, designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 text-slate-700"
            >
              <option value="All">All Departments & Cells</option>
              <option value="Computer Science & Engineering">CSE</option>
              <option value="Electronics & Communication">ECE</option>
              <option value="Mechanical Engineering">Mechanical</option>
              <option value="Information Technology">Information Tech</option>
              <option value="Civil Engineering">Civil Eng</option>
              <option value="Library">Library</option>
              <option value="Accounts">Accounts</option>
              <option value="Administration">Administration</option>
            </select>
          </div>

          <div>
            <button
              onClick={() => {
                setSelectedCategory('All');
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

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
            No employees found matching the filters.
          </div>
        ) : (
          filteredEmployees.map((emp) => {
            const wards = getWardsForEmployee(emp.id);
            const isTeaching = emp.category === 'Teaching';

            return (
              <div 
                key={emp.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isTeaching ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{emp.name}</h4>
                        <p className="text-xs text-slate-500">{emp.empCode}</p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      isTeaching ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {emp.category}
                    </span>
                  </div>

                  <div className="mt-3.5 space-y-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="font-semibold text-slate-800">{emp.designation}</p>
                      <p className="text-[11px] text-slate-500">{emp.department}</p>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1">
                      <p className="truncate">🎓 {emp.qualification}</p>
                      {emp.specialization && (
                        <p className="truncate text-slate-500">🔬 {emp.specialization}</p>
                      )}
                      <p className="text-slate-500">⏱️ {emp.experienceYears} Years Exp • Joined {emp.dateOfJoining}</p>
                    </div>

                    {isTeaching && emp.isProctor && (
                      <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-100 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-800 font-semibold flex items-center space-x-1">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Active Proctor Mentor</span>
                        </span>
                        <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          {wards.length} Wards
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    ₹{(emp.salary / 1000).toFixed(0)}k <span className="text-[10px] text-slate-400 font-normal">/mo</span>
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setViewingEmployee(emp)}
                      title="View Details"
                      className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(emp)}
                      title="Edit Employee"
                      className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id, emp.name)}
                      title="Delete Employee"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingEmployee ? 'Edit Staff Details' : 'Register College Employee'}
              </h3>
              <button onClick={onCloseAddModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Employee Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.empCode}
                    onChange={(e) => setFormData({ ...formData, empCode: e.target.value })}
                    placeholder="e.g. T-CSE-105 or NT-ADM-209"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Kavita Nair"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Staff Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as EmployeeCategory })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Teaching">Teaching Faculty</option>
                    <option value="Non-Teaching">Non-Teaching Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation *</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="Professor / Lab Tech / Librarian"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department / Office *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Library">Library</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Administration">Administration</option>
                    <option value="Facilities">Facilities & Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="Ph.D, M.Tech, M.Com, MCA"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                    placeholder="85000"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="faculty@campus.edu"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 94441 00000"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

              </div>

              {formData.category === 'Teaching' && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="proctorToggle"
                    checked={formData.isProctor}
                    onChange={(e) => setFormData({ ...formData, isProctor: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="proctorToggle" className="text-xs font-semibold text-emerald-900 cursor-pointer">
                    Eligible for Student Proctor Mentorship Program
                  </label>
                </div>
              )}

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
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition"
                >
                  {editingEmployee ? 'Update Record' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Viewing Employee Details Modal */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                  {viewingEmployee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{viewingEmployee.name}</h3>
                  <p className="text-xs text-slate-500">{viewingEmployee.empCode} • {viewingEmployee.designation}</p>
                </div>
              </div>
              <button onClick={() => setViewingEmployee(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Category</span>
                  <span className="font-semibold text-slate-800">{viewingEmployee.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Department</span>
                  <span className="font-semibold text-slate-800">{viewingEmployee.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Experience</span>
                  <span className="font-bold text-slate-800">{viewingEmployee.experienceYears} Years</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Monthly Salary</span>
                  <span className="font-bold text-emerald-700">₹{viewingEmployee.salary.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-800">Academic & Work Profile:</p>
                <p className="text-slate-600 mt-1">🎓 Qualification: {viewingEmployee.qualification}</p>
                {viewingEmployee.specialization && (
                  <p className="text-slate-600">🔬 Specialization: {viewingEmployee.specialization}</p>
                )}
                <p className="text-slate-600">📅 Date Joined: {viewingEmployee.dateOfJoining}</p>
                <p className="text-slate-600">📧 Email: {viewingEmployee.email}</p>
                <p className="text-slate-600">📱 Phone: {viewingEmployee.phone}</p>
              </div>

              {/* Assigned Student Wards */}
              {viewingEmployee.category === 'Teaching' && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="font-bold text-slate-800 mb-2">
                    Assigned Mentorship Wards ({getWardsForEmployee(viewingEmployee.id).length}):
                  </p>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {getWardsForEmployee(viewingEmployee.id).length === 0 ? (
                      <p className="text-slate-400 italic">No students currently assigned as proctor wards.</p>
                    ) : (
                      getWardsForEmployee(viewingEmployee.id).map(w => (
                        <div key={w.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-800">{w.name}</span>
                            <span className="text-slate-500 text-[11px] ml-2">({w.rollNo})</span>
                          </div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            w.attendancePercentage < 75 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {w.attendancePercentage}% Att.
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingEmployee(null)}
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
