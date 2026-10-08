import React, { useState } from 'react';
import { 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Search, 
  PhoneCall, 
  MessageSquare, 
  Calendar, 
  TrendingDown, 
  X, 
  FileText,
  User,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProctorLog } from '../types';

export const ProctorView: React.FC = () => {
  const { students, employees, proctorLogs, addProctorLog, deleteProctorLog } = useApp();

  const [selectedRisk, setSelectedRisk] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form for new proctor meeting log
  const [formData, setFormData] = useState<Omit<ProctorLog, 'id'>>({
    proctorId: '',
    proctorName: '',
    studentId: '',
    studentName: '',
    studentRoll: '',
    meetingDate: new Date().toISOString().split('T')[0],
    topic: 'Academic Review & Counseling',
    notes: '',
    actionItems: '',
    parentContacted: false,
    attendanceRate: 85,
    academicRisk: 'Low'
  });

  const teachingProctors = employees.filter(e => e.category === 'Teaching' && e.isProctor);

  const filteredLogs = proctorLogs.filter(log => {
    const matchesRisk = selectedRisk === 'All' || log.academicRisk === selectedRisk;
    const matchesProctor = selectedFaculty === 'All' || log.proctorId === selectedFaculty;
    const matchesSearch = 
      log.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.studentRoll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.proctorName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRisk && matchesProctor && matchesSearch;
  });

  // Calculate proctor mentor stats
  const studentsWithDeficit = students.filter(s => s.attendancePercentage < 75);

  const handleOpenAdd = () => {
    const defaultStudent = students[0];
    const defaultProctor = teachingProctors.find(p => p.id === defaultStudent?.proctorId) || teachingProctors[0];

    setFormData({
      proctorId: defaultProctor ? defaultProctor.id : '',
      proctorName: defaultProctor ? defaultProctor.name : '',
      studentId: defaultStudent ? defaultStudent.id : '',
      studentName: defaultStudent ? defaultStudent.name : '',
      studentRoll: defaultStudent ? defaultStudent.rollNo : '',
      meetingDate: new Date().toISOString().split('T')[0],
      topic: 'Semester Academic & Attendance Review',
      notes: '',
      actionItems: '',
      parentContacted: defaultStudent?.attendancePercentage < 75,
      attendanceRate: defaultStudent ? defaultStudent.attendancePercentage : 85,
      academicRisk: defaultStudent && defaultStudent.attendancePercentage < 75 ? 'High' : 'Low'
    });
    setIsLogModalOpen(true);
  };

  const handleStudentSelect = (studentId: string) => {
    const std = students.find(s => s.id === studentId);
    if (!std) return;

    const assignedProctor = employees.find(e => e.id === std.proctorId);

    setFormData(prev => ({
      ...prev,
      studentId: std.id,
      studentName: std.name,
      studentRoll: std.rollNo,
      proctorId: std.proctorId,
      proctorName: assignedProctor ? assignedProctor.name : std.proctorName,
      attendanceRate: std.attendancePercentage,
      academicRisk: std.attendancePercentage < 75 ? 'High' : std.attendancePercentage < 80 ? 'Medium' : 'Low'
    }));
  };

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.notes) {
      alert("Please provide mentorship discussion notes.");
      return;
    }
    addProctorLog(formData);
    setIsLogModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Faculty Proctor & Mentorship System</h2>
            <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {teachingProctors.length} Faculty Mentors
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Proctors conduct regular 1-on-1 counseling, monitor attendance, intervene in academic backlogs, and liaise with parents.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-sky-600/20 transition flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Mentorship Session</span>
        </button>
      </div>

      {/* Proctor Stats & Alerts Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-rose-50/80 border border-rose-200 p-4 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-rose-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-rose-800 uppercase">Attendance Risk (&lt;75%)</p>
            <p className="text-2xl font-black text-rose-950">{studentsWithDeficit.length} Students</p>
            <p className="text-[11px] text-rose-700 mt-0.5">Mandatory parent alert dispatched</p>
          </div>
        </div>

        <div className="bg-sky-50/80 border border-sky-200 p-4 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-sky-600/20">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-sky-800 uppercase">Mentorship Sessions</p>
            <p className="text-2xl font-black text-sky-950">{proctorLogs.length} Recorded</p>
            <p className="text-[11px] text-sky-700 mt-0.5">Continuous appraisal logs</p>
          </div>
        </div>

        <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-800 uppercase">Average Student Attendance</p>
            <p className="text-2xl font-black text-emerald-950">
              {(students.reduce((acc, s) => acc + s.attendancePercentage, 0) / (students.length || 1)).toFixed(1)}%
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5">Overall campus health</p>
          </div>
        </div>

      </div>

      {/* Proctor Mentors Roster */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Assigned Faculty Proctors & Ward Allocations</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {teachingProctors.map(proctor => {
            const wards = students.filter(s => s.proctorId === proctor.id);
            const flaggedWards = wards.filter(w => w.attendancePercentage < 75);

            return (
              <div key={proctor.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-slate-900">{proctor.name}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      {wards.length} Wards
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{proctor.designation} • {proctor.department}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Attendance Risk:</span>
                  <span className={`font-bold ${flaggedWards.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {flaggedWards.length > 0 ? `${flaggedWards.length} student(s) <75%` : 'All safe'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search student, roll no, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
            />
          </div>

          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50 text-slate-700"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">High Risk (Immediate Attention)</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk (Normal Progress)</option>
            </select>
          </div>

          <div>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50 text-slate-700"
            >
              <option value="All">All Proctors</option>
              {teachingProctors.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Mentorship Logs History List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Mentorship Logs & Follow-up History</h3>
          <span className="text-xs text-slate-500">{filteredLogs.length} Sessions Logged</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No mentorship logs found matching filters.
            </div>
          ) : (
            filteredLogs.map(log => {
              const riskColor = 
                log.academicRisk === 'High' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                log.academicRisk === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                'bg-emerald-100 text-emerald-800 border-emerald-200';

              return (
                <div key={log.id} className="p-5 space-y-3 hover:bg-slate-50/70 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-sm flex-shrink-0">
                        {log.studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-900">{log.studentName}</h4>
                          <span className="text-xs text-slate-500">({log.studentRoll})</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Proctor: <strong className="text-slate-700">{log.proctorName}</strong> • Date: {log.meetingDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${riskColor}`}>
                        {log.academicRisk} Risk
                      </span>
                      {log.parentContacted && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center space-x-1">
                          <PhoneCall className="w-3 h-3" />
                          <span>Parent Alerted</span>
                        </span>
                      )}
                      <button
                        onClick={() => deleteProctorLog(log.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete Log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Topic & Notes */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-1.5">
                    <p className="font-bold text-slate-800">📌 Topic: {log.topic}</p>
                    <p className="text-slate-700 leading-relaxed"><strong className="text-slate-500">Observations:</strong> {log.notes}</p>
                    {log.actionItems && (
                      <p className="text-slate-700"><strong className="text-slate-500">Action Plan:</strong> {log.actionItems}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Log Session Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Record Proctor Mentorship Session</h3>
              <button onClick={() => setIsLogModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitLog} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Student Ward *</label>
                <select
                  required
                  value={formData.studentId}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select a student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNo} - {s.department}) - Att: {s.attendancePercentage}%
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Date *</label>
                <input
                  type="date"
                  required
                  value={formData.meetingDate}
                  onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Session Topic *</label>
                <input
                  type="text"
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g. Low Attendance Counseling, Academic Progress, Career Guidance"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Academic Risk Assessment</label>
                  <select
                    value={formData.academicRisk}
                    onChange={(e) => setFormData({ ...formData, academicRisk: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk (At-Risk)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.parentContacted}
                      onChange={(e) => setFormData({ ...formData, parentContacted: e.target.checked })}
                      className="w-4 h-4 text-sky-600 rounded"
                    />
                    <span>Parent Contacted</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Proctor Discussion Notes *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Summarize discussion points, personal grievances, remedial plan..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recommended Action Items</label>
                <input
                  type="text"
                  value={formData.actionItems}
                  onChange={(e) => setFormData({ ...formData, actionItems: e.target.value })}
                  placeholder="e.g. Attend remedial classes, submit medical certificate, weekly log"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md transition"
                >
                  Save Proctor Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
