export type AcademicYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
export type Batch = '2021-2025' | '2022-2026' | '2023-2027' | '2024-2028';
export type Department = 
  | 'Computer Science & Engineering' 
  | 'Information Technology' 
  | 'Electronics & Communication' 
  | 'Mechanical Engineering' 
  | 'Civil Engineering';

export type EmployeeCategory = 'Teaching' | 'Non-Teaching';

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  department: Department;
  year: AcademicYear;
  semester: number;
  batch: Batch;
  section: string;
  proctorId: string;
  proctorName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  cgpa: number;
  attendancePercentage: number;
  feeStatus: 'Paid' | 'Partial' | 'Pending';
  totalFee: number;
  paidFee: number;
  pendingFee: number;
  parentName: string;
  parentPhone: string;
  address: string;
  admissionDate: string;
  avatarUrl?: string;
}

export interface Employee {
  id: string;
  empCode: string;
  name: string;
  email: string;
  phone: string;
  category: EmployeeCategory;
  designation: string;
  department: Department | 'Administration' | 'Library' | 'Accounts' | 'Facilities' | 'Exam Cell';
  qualification: string;
  specialization?: string;
  dateOfJoining: string;
  salary: number;
  isProctor: boolean;
  assignedWardsCount: number;
  status: 'Active' | 'On Leave';
  experienceYears: number;
  avatarUrl?: string;
}

export interface ProctorLog {
  id: string;
  proctorId: string;
  proctorName: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  meetingDate: string;
  topic: string;
  notes: string;
  actionItems: string;
  parentContacted: boolean;
  attendanceRate: number;
  academicRisk: 'Low' | 'Medium' | 'High';
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  edition: string;
  department: string;
  shelfLocation: string;
  totalCopies: number;
  availableCopies: number;
  borrowedCount: number;
}

export interface BookBorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerType: 'Student' | 'Faculty';
  borrowerId: string;
  borrowerName: string;
  borrowerIdentifier: string; // Roll number or Emp code
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Issued' | 'Returned' | 'Overdue';
  fineAmount: number;
}

export interface Transaction {
  id: string;
  receiptNo: string;
  type: 'Income' | 'Expense';
  category: 
    | 'Tuition Fee' 
    | 'Hostel Fee' 
    | 'Exam Fee' 
    | 'Library Fine' 
    | 'Faculty Salary' 
    | 'Staff Salary' 
    | 'Lab Equipment' 
    | 'Campus Maintenance' 
    | 'Software Licensing' 
    | 'Events & Sports';
  title: string;
  partyName: string; // Student or Staff or Vendor name
  partyIdentifier?: string; // Roll or Emp ID
  amount: number;
  paymentDate: string;
  paymentMode: 'Cash' | 'Card' | 'UPI / NetBanking' | 'Cheque';
  status: 'Completed' | 'Pending';
  remarks?: string;
}

export interface SubjectMarks {
  code: string;
  name: string;
  credits: number;
  internalMarks: number;
  externalMarks: number;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
  gradePoints: number;
}

export interface ExamRecord {
  id: string;
  title: string;
  academicYear: AcademicYear;
  batch: Batch;
  semester: number;
  department: Department;
  examType: 'Mid-Term 1' | 'Mid-Term 2' | 'Semester End Exam' | 'Practical Viva';
  startDate: string;
  endDate: string;
  status: 'Scheduled' | 'Completed' | 'Published';
}

export interface StudentResult {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  department: Department;
  batch: Batch;
  semester: number;
  academicYear: AcademicYear;
  subjects: SubjectMarks[];
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  sgpa: number;
  cgpa: number;
  resultStatus: 'Passed' | 'Distinction' | 'Backlog' | 'Failed';
  publishedDate: string;
}
