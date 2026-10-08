import React, { useState } from 'react';
import { 
  Award, 
  Calendar, 
  Plus, 
  Search, 
  FileText, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  X,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudentResult, ExamRecord, AcademicYear, Batch, Department } from '../types';

export const ExamsView: React.FC = () => {
  const { exams, results, students, addExam, addResult } = useApp();

  const [activeTab, setActiveTab] = useState<'results' | 'schedules'>('results');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedBatch, setSelectedBatch] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [viewingResult, setViewingResult] = useState<StudentResult | null>(null);
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  const [isAddMarksOpen, setIsAddMarksOpen] = useState(false);

  // New Exam Form
  const [examForm, setExamForm] = useState<Omit<ExamRecord, 'id'>>({
    title: 'Semester End Assessment Fall 2026',
    academicYear: '2nd Year',
    batch: '2023-2027',
    semester: 4,
    department: 'Computer Science & Engineering',
    examType: 'Semester End Exam',
    startDate: '2026-11-20',
    endDate: '2026-12-05',
    status: 'Scheduled'
  });

  // Marks Entry Form
  const [marksForm, setMarksForm] = useState({
    studentId: '',
    examId: exams[0]?.id || '',
    subjects: [
      { code: 'CS501', name: 'Software Engineering & Agile', credits: 4, internalMarks: 25, externalMarks: 60, maxMarks: 100, obtainedMarks: 85, grade: 'A+', gradePoints: 9 },
      { code: 'CS502', name: 'Computer Networks', credits: 4, internalMarks: 24, externalMarks: 62, maxMarks: 100, obtainedMarks: 86, grade: 'A+', gradePoints: 9 },
      { code: 'CS503', name: 'Machine Learning Fundamentals', credits: 4, internalMarks: 28, externalMarks: 65, maxMarks: 100, obtainedMarks: 93, grade: 'O', gradePoints: 10 },
      { code: 'CS504L', name: 'Networks & ML Laboratory', credits: 2, internalMarks: 48, externalMarks: 45, maxMarks: 100, obtainedMarks: 93, grade: 'O', gradePoints: 10 },
    ]
  });

  const filteredResults = results.filter(res => {
    const matchesDept = selectedDept === 'All' || res.department === selectedDept;
    const matchesBatch = selectedBatch === 'All' || res.batch === selectedBatch;
    const matchesSearch = 
      res.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.studentRoll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.examTitle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDept && matchesBatch && matchesSearch;
  });

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    addExam(examForm);
    setIsAddExamOpen(false);
  };

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === marksForm.studentId);
    const exam = exams.find(ex => ex.id === marksForm.examId);
    if (!student || !exam) {
      alert("Please select student and exam.");
      return;
    }

    const totalObtained = marksForm.subjects.reduce((a, s) => a + s.obtainedMarks, 0);
    const totalMax = marksForm.subjects.reduce((a, s) => a + s.maxMarks, 0);
    const percentage = parseFloat(((totalObtained / totalMax) * 100).toFixed(1));
    
    // SGPA calculation
    const totalCredits = marksForm.subjects.reduce((a, s) => a + s.credits, 0);
    const weightedPoints = marksForm.subjects.reduce((a, s) => a + (s.credits * s.gradePoints), 0);
    const sgpa = parseFloat((weightedPoints / totalCredits).toFixed(2));

    const newResult: Omit<StudentResult, 'id'> = {
      examId: exam.id,
      examTitle: exam.title,
      studentId: student.id,
      studentName: student.name,
      studentRoll: student.rollNo,
      department: student.department,
      batch: student.batch,
      semester: student.semester,
      academicYear: student.year,
      subjects: marksForm.subjects,
      totalMarks: totalObtained,
      maxTotalMarks: totalMax,
      percentage,
      sgpa,
      cgpa: student.cgpa,
      resultStatus: percentage >= 85 ? 'Distinction' : percentage >= 50 ? 'Passed' : 'Backlog',
      publishedDate: new Date().toISOString().split('T')[0]
    };

    addResult(newResult);
    setIsAddMarksOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Examinations & Academic Results</h2>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-0.5 rounded-full">
              University Grading Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Internal assessments, semester grade cards, SGPA/CGPA evaluation & printable transcripts
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddMarksOpen(true)}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Enter Marks</span>
          </button>
          <button
            onClick={() => setIsAddExamOpen(true)}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl transition"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Exam</span>
          </button>
        </div>
      </div>

      {/* Tabs: Results vs Schedules */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('results')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'results'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Published Results & Transcripts ({results.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schedules')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'schedules'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Exam Schedules ({exams.length})</span>
        </button>
      </div>

      {/* TAB 1: RESULTS & MARKSHEETS */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search student, roll no, exam..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>

              <div>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 text-slate-700"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Mechanical Engineering">Mechanical</option>
                  <option value="Information Technology">IT</option>
                  <option value="Civil Engineering">Civil</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 text-slate-700"
                >
                  <option value="All">All Batches</option>
                  <option value="2024-2028">Batch 2024-2028</option>
                  <option value="2023-2027">Batch 2023-2027</option>
                  <option value="2022-2026">Batch 2022-2026</option>
                  <option value="2021-2025">Batch 2021-2025</option>
                </select>
              </div>

            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Examination</th>
                    <th className="py-3 px-4">Year / Batch</th>
                    <th className="py-3 px-4 text-center">Total Marks</th>
                    <th className="py-3 px-4 text-center">SGPA</th>
                    <th className="py-3 px-4 text-center">CGPA</th>
                    <th className="py-3 px-4 text-center">Classification</th>
                    <th className="py-3 px-4 text-right">Grade Card</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredResults.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No examination results recorded yet.
                      </td>
                    </tr>
                  ) : (
                    filteredResults.map(res => (
                      <tr key={res.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{res.studentName}</p>
                          <p className="text-[11px] text-slate-500">{res.studentRoll} • {res.department}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800">{res.examTitle}</span>
                          <p className="text-[10px] text-slate-400">Sem {res.semester} • Published {res.publishedDate}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-700">{res.academicYear}</span>
                          <p className="text-[10px] text-slate-400">Batch {res.batch}</p>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-800">
                          {res.totalMarks} / {res.maxTotalMarks} ({res.percentage}%)
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {res.sgpa.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {res.cgpa.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            res.resultStatus === 'Distinction' ? 'bg-emerald-100 text-emerald-800' :
                            res.resultStatus === 'Passed' ? 'bg-sky-100 text-sky-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {res.resultStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setViewingResult(res)}
                            className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition inline-flex items-center space-x-1"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                            <span>Transcript</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: EXAM SCHEDULES */}
      {activeTab === 'schedules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.map(exam => (
            <div key={exam.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {exam.examType}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {exam.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mt-2.5">{exam.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{exam.department}</p>

                <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                  <p><strong className="text-slate-600">Year / Batch:</strong> {exam.academicYear} (Batch {exam.batch})</p>
                  <p><strong className="text-slate-600">Semester:</strong> Semester {exam.semester}</p>
                  <p><strong className="text-slate-600">Schedule:</strong> {exam.startDate} to {exam.endDate}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    setMarksForm(prev => ({ ...prev, examId: exam.id }));
                    setIsAddMarksOpen(true);
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Record Student Marks →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Exam Modal */}
      {isAddExamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Schedule New Examination</h3>
              <button onClick={() => setIsAddExamOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Exam Title *</label>
                <input
                  type="text"
                  required
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  placeholder="e.g. Mid-Term 1 Assessment Fall 2026"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                  <select
                    value={examForm.academicYear}
                    onChange={(e) => setExamForm({ ...examForm, academicYear: e.target.value as AcademicYear })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch</label>
                  <select
                    value={examForm.batch}
                    onChange={(e) => setExamForm({ ...examForm, batch: e.target.value as Batch })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="2024-2028">Batch 2024-2028</option>
                    <option value="2023-2027">Batch 2023-2027</option>
                    <option value="2022-2026">Batch 2022-2026</option>
                    <option value="2021-2025">Batch 2021-2025</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <select
                  value={examForm.department}
                  onChange={(e) => setExamForm({ ...examForm, department: e.target.value as Department })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={examForm.startDate}
                    onChange={(e) => setExamForm({ ...examForm, startDate: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={examForm.endDate}
                    onChange={(e) => setExamForm({ ...examForm, endDate: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddExamOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-xl"
                >
                  Create Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enter Marks Modal */}
      {isAddMarksOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Enter Exam Marks & Generate Grade Card</h3>
              <button onClick={() => setIsAddMarksOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMarks} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Student *</label>
                  <select
                    required
                    value={marksForm.studentId}
                    onChange={(e) => setMarksForm({ ...marksForm, studentId: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="">Select a student...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.rollNo} - {s.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Exam *</label>
                  <select
                    required
                    value={marksForm.examId}
                    onChange={(e) => setMarksForm({ ...marksForm, examId: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  >
                    {exams.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800 mb-2">Subject-wise Marks & Credits:</p>
                <div className="space-y-2.5">
                  {marksForm.subjects.map((sub, idx) => (
                    <div key={sub.code} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{sub.name}</p>
                        <p className="text-[11px] text-slate-500">{sub.code} • {sub.credits} Credits</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Obtained / 100</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={sub.obtainedMarks}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              const updated = [...marksForm.subjects];
                              updated[idx].obtainedMarks = val;
                              updated[idx].grade = val >= 90 ? 'O' : val >= 80 ? 'A+' : val >= 70 ? 'A' : val >= 60 ? 'B+' : val >= 50 ? 'B' : 'F';
                              updated[idx].gradePoints = val >= 90 ? 10 : val >= 80 ? 9 : val >= 70 ? 8 : val >= 60 ? 7 : val >= 50 ? 6 : 0;
                              setMarksForm({ ...marksForm, subjects: updated });
                            }}
                            className="w-20 p-1.5 rounded-lg border border-slate-200 text-center font-bold"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Grade</span>
                          <span className="inline-block p-1.5 font-bold text-indigo-700 bg-indigo-50 rounded-lg text-center min-w-[36px]">
                            {sub.grade}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddMarksOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow"
                >
                  Publish Grade Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Official Student Transcript / Grade Card Modal */}
      {viewingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 print:shadow-none print:border-0 print:p-0">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Official Marksheet</span>
              <button onClick={() => setViewingResult(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* University Transcript Header */}
            <div className="text-center py-4 border-b-2 border-slate-900">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-900 text-white font-bold mb-2 shadow-md">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-black tracking-wide text-slate-900 uppercase">
                CampusPulse Institute of Engineering & Technology
              </h2>
              <p className="text-xs text-slate-600 font-medium">Affiliated to State Technical University • Accredited A++</p>
              <div className="mt-2 inline-block px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-full">
                STATEMENT OF GRADES & CUMULATIVE TRANSCRIPT
              </div>
            </div>

            {/* Student & Exam Details Grid */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
              <div className="space-y-1">
                <p><span className="text-slate-400 uppercase font-semibold text-[10px]">Student Name:</span> <strong>{viewingResult.studentName}</strong></p>
                <p><span className="text-slate-400 uppercase font-semibold text-[10px]">USN / Roll No:</span> <strong>{viewingResult.studentRoll}</strong></p>
                <p><span className="text-slate-400 uppercase font-semibold text-[10px]">Department:</span> {viewingResult.department}</p>
              </div>
              <div className="space-y-1 text-right">
                <p><span className="text-slate-400 uppercase font-semibold text-[10px]">Exam Name:</span> <strong>{viewingResult.examTitle}</strong></p>
                <p><span className="text-slate-400 uppercase font-semibold text-[10px]">Year / Batch:</span> {viewingResult.academicYear} (Batch {viewingResult.batch})</p>
                <p><span className="text-slate-400 uppercase font-semibold text-[10px]">Date of Issue:</span> {viewingResult.publishedDate}</p>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="py-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                    <th className="py-2 px-3">Subject Code & Name</th>
                    <th className="py-2 px-3 text-center">Credits</th>
                    <th className="py-2 px-3 text-center">Max</th>
                    <th className="py-2 px-3 text-center">Obtained</th>
                    <th className="py-2 px-3 text-center">Grade</th>
                    <th className="py-2 px-3 text-center">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {viewingResult.subjects.map(sub => (
                    <tr key={sub.code}>
                      <td className="py-2 px-3">
                        <span className="font-semibold text-slate-800">{sub.name}</span>
                        <span className="text-[10px] text-slate-400 ml-2">({sub.code})</span>
                      </td>
                      <td className="py-2 px-3 text-center font-medium">{sub.credits}</td>
                      <td className="py-2 px-3 text-center text-slate-500">{sub.maxMarks}</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{sub.obtainedMarks}</td>
                      <td className="py-2 px-3 text-center font-black text-indigo-700">{sub.grade}</td>
                      <td className="py-2 px-3 text-center font-medium">{sub.gradePoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cumulative Summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Marks</span>
                <span className="font-bold text-slate-900">{viewingResult.totalMarks} / {viewingResult.maxTotalMarks}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Percentage</span>
                <span className="font-bold text-slate-900">{viewingResult.percentage}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Semester SGPA</span>
                <span className="font-black text-indigo-700 text-sm">{viewingResult.sgpa.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Overall CGPA</span>
                <span className="font-black text-slate-900 text-sm">{viewingResult.cgpa.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer / Signatures */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-end justify-between text-[11px] text-slate-500">
              <div className="text-center">
                <div className="w-32 border-b border-slate-300 pb-1 mb-1 font-signature text-slate-700 font-semibold italic">
                  Exam Controller
                </div>
                <span>Controller of Examinations</span>
              </div>

              <div className="text-center">
                <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                  viewingResult.resultStatus === 'Distinction' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                }`}>
                  Final Status: {viewingResult.resultStatus}
                </span>
              </div>

              <div className="text-center">
                <div className="w-32 border-b border-slate-300 pb-1 mb-1 font-signature text-slate-700 font-semibold italic">
                  Dr. Principal
                </div>
                <span>Dean / Principal Signature</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex justify-between print:hidden">
              <button
                onClick={() => setViewingResult(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Transcript</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
