import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Student, 
  Employee, 
  Book, 
  BookBorrowRecord, 
  Transaction, 
  ProctorLog, 
  ExamRecord, 
  StudentResult 
} from '../types';
import { 
  initialStudents, 
  initialEmployees, 
  initialBooks, 
  initialBorrowRecords, 
  initialTransactions, 
  initialProctorLogs, 
  initialExams, 
  initialResults 
} from '../data/mockData';

export type NavigationTab = 
  | 'dashboard' 
  | 'students' 
  | 'employees' 
  | 'proctor' 
  | 'library' 
  | 'accounts' 
  | 'exams';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  
  // Data
  students: Student[];
  employees: Employee[];
  books: Book[];
  borrowRecords: BookBorrowRecord[];
  transactions: Transaction[];
  proctorLogs: ProctorLog[];
  exams: ExamRecord[];
  results: StudentResult[];
  isDiskSynced: boolean;

  // Student actions
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Employee actions
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updated: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Library actions
  addBook: (book: Omit<Book, 'id' | 'borrowedCount'>) => void;
  updateBook: (id: string, updated: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  issueBook: (bookId: string, borrowerType: 'Student' | 'Faculty', borrowerId: string, borrowerName: string, identifier: string, dueDate: string) => void;
  returnBook: (borrowId: string, fineAmount?: number) => void;

  // Accounts actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'receiptNo'>) => void;
  deleteTransaction: (id: string) => void;

  // Proctor actions
  addProctorLog: (log: Omit<ProctorLog, 'id'>) => void;
  deleteProctorLog: (id: string) => void;

  // Exam actions
  addExam: (exam: Omit<ExamRecord, 'id'>) => void;
  updateExam: (id: string, updated: Partial<ExamRecord>) => void;
  addResult: (res: Omit<StudentResult, 'id'>) => void;
  deleteResult: (id: string) => void;

  // Maintenance
  resetToSampleData: () => void;
  exportDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'campuspulse_students',
  EMPLOYEES: 'campuspulse_employees',
  BOOKS: 'campuspulse_books',
  BORROWS: 'campuspulse_borrows',
  TRANSACTIONS: 'campuspulse_transactions',
  PROCTOR: 'campuspulse_proctor',
  EXAMS: 'campuspulse_exams',
  RESULTS: 'campuspulse_results',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isDiskSynced, setIsDiskSynced] = useState<boolean>(true);
  const isInitialLoadDone = useRef(false);

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKS);
    return saved ? JSON.parse(saved) : initialBooks;
  });

  const [borrowRecords, setBorrowRecords] = useState<BookBorrowRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BORROWS);
    return saved ? JSON.parse(saved) : initialBorrowRecords;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [proctorLogs, setProctorLogs] = useState<ProctorLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROCTOR);
    return saved ? JSON.parse(saved) : initialProctorLogs;
  });

  const [exams, setExams] = useState<ExamRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXAMS);
    return saved ? JSON.parse(saved) : initialExams;
  });

  const [results, setResults] = useState<StudentResult[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESULTS);
    return saved ? JSON.parse(saved) : initialResults;
  });

  // Helper to persist everything directly to computer disk file (data/database.json)
  const saveToDisk = async (payload: {
    students: Student[];
    employees: Employee[];
    books: Book[];
    borrowRecords: BookBorrowRecord[];
    transactions: Transaction[];
    proctorLogs: ProctorLog[];
    exams: ExamRecord[];
    results: StudentResult[];
  }) => {
    try {
      setIsDiskSynced(false);
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload, null, 2)
      });
      if (res.ok) {
        setIsDiskSynced(true);
      }
    } catch (err) {
      console.warn('Disk save fallback to localStorage:', err);
    }
  };

  // 1. Initial Load: Fetch from disk file /api/db on mount
  useEffect(() => {
    const fetchFromDisk = async () => {
      try {
        const res = await fetch('/api/db');
        if (res.ok) {
          const diskData = await res.json();
          if (diskData && diskData.students && Array.isArray(diskData.students)) {
            setStudents(diskData.students);
            if (diskData.employees) setEmployees(diskData.employees);
            if (diskData.books) setBooks(diskData.books);
            if (diskData.borrowRecords) setBorrowRecords(diskData.borrowRecords);
            if (diskData.transactions) setTransactions(diskData.transactions);
            if (diskData.proctorLogs) setProctorLogs(diskData.proctorLogs);
            if (diskData.exams) setExams(diskData.exams);
            if (diskData.results) setResults(diskData.results);
            
            // Also update localStorage as cache
            localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(diskData.students));
            if (diskData.employees) localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(diskData.employees));
            if (diskData.books) localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(diskData.books));
            if (diskData.borrowRecords) localStorage.setItem(STORAGE_KEYS.BORROWS, JSON.stringify(diskData.borrowRecords));
            if (diskData.transactions) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(diskData.transactions));
            if (diskData.proctorLogs) localStorage.setItem(STORAGE_KEYS.PROCTOR, JSON.stringify(diskData.proctorLogs));
            if (diskData.exams) localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(diskData.exams));
            if (diskData.results) localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(diskData.results));
          } else {
            // First time seed
            saveToDisk({
              students: initialStudents,
              employees: initialEmployees,
              books: initialBooks,
              borrowRecords: initialBorrowRecords,
              transactions: initialTransactions,
              proctorLogs: initialProctorLogs,
              exams: initialExams,
              results: initialResults
            });
          }
        }
      } catch (e) {
        console.error('Could not connect to /api/db, using browser storage', e);
      } finally {
        isInitialLoadDone.current = true;
      }
    };

    fetchFromDisk();
  }, []);

  // 2. Auto-save to both localStorage AND computer disk file on any change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    localStorage.setItem(STORAGE_KEYS.BORROWS, JSON.stringify(borrowRecords));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    localStorage.setItem(STORAGE_KEYS.PROCTOR, JSON.stringify(proctorLogs));
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));

    if (isInitialLoadDone.current) {
      saveToDisk({
        students,
        employees,
        books,
        borrowRecords,
        transactions,
        proctorLogs,
        exams,
        results
      });
    }
  }, [students, employees, books, borrowRecords, transactions, proctorLogs, exams, results]);

  // Student methods
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`
    };
    setStudents(prev => [newStudent, ...prev]);
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  // Employee methods
  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`
    };
    setEmployees(prev => [newEmp, ...prev]);
  };

  const updateEmployee = (id: string, updated: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  // Library methods
  const addBook = (bookData: Omit<Book, 'id' | 'borrowedCount'>) => {
    const newBook: Book = {
      ...bookData,
      id: `bk-${Date.now()}`,
      borrowedCount: 0
    };
    setBooks(prev => [newBook, ...prev]);
  };

  const updateBook = (id: string, updated: Partial<Book>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const issueBook = (
    bookId: string, 
    borrowerType: 'Student' | 'Faculty', 
    borrowerId: string, 
    borrowerName: string, 
    identifier: string, 
    dueDate: string
  ) => {
    const book = books.find(b => b.id === bookId);
    if (!book || book.availableCopies <= 0) return;

    const newBorrow: BookBorrowRecord = {
      id: `brw-${Date.now()}`,
      bookId,
      bookTitle: book.title,
      borrowerType,
      borrowerId,
      borrowerName,
      borrowerIdentifier: identifier,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'Issued',
      fineAmount: 0
    };

    setBorrowRecords(prev => [newBorrow, ...prev]);
    setBooks(prev => prev.map(b => b.id === bookId ? {
      ...b,
      availableCopies: Math.max(0, b.availableCopies - 1),
      borrowedCount: b.borrowedCount + 1
    } : b));
  };

  const returnBook = (borrowId: string, fineAmount: number = 0) => {
    const record = borrowRecords.find(r => r.id === borrowId);
    if (!record) return;

    setBorrowRecords(prev => prev.map(r => r.id === borrowId ? {
      ...r,
      status: 'Returned',
      returnDate: new Date().toISOString().split('T')[0],
      fineAmount
    } : r));

    setBooks(prev => prev.map(b => b.id === record.bookId ? {
      ...b,
      availableCopies: Math.min(b.totalCopies, b.availableCopies + 1),
      borrowedCount: Math.max(0, b.borrowedCount - 1)
    } : b));

    if (fineAmount > 0) {
      addTransaction({
        type: 'Income',
        category: 'Library Fine',
        title: `Library Overdue Fine - ${record.bookTitle}`,
        partyName: record.borrowerName,
        partyIdentifier: record.borrowerIdentifier,
        amount: fineAmount,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMode: 'Cash',
        status: 'Completed',
        remarks: `Returned overdue book: ${record.bookTitle}`
      });
    }
  };

  // Accounts methods
  const addTransaction = (txData: Omit<Transaction, 'id' | 'receiptNo'>) => {
    const code = txData.type === 'Income' ? 'REC' : 'EXP';
    const num = Math.floor(1000 + Math.random() * 9000);
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      receiptNo: `${code}-2026-${num}`
    };
    setTransactions(prev => [newTx, ...prev]);

    // If transaction is student fee payment, update student paid fee
    if (txData.type === 'Income' && txData.category === 'Tuition Fee' && txData.partyIdentifier) {
      setStudents(prev => prev.map(s => {
        if (s.rollNo === txData.partyIdentifier) {
          const newPaid = s.paidFee + txData.amount;
          const newPending = Math.max(0, s.totalFee - newPaid);
          return {
            ...s,
            paidFee: newPaid,
            pendingFee: newPending,
            feeStatus: newPending === 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Pending'
          };
        }
        return s;
      }));
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Proctor methods
  const addProctorLog = (logData: Omit<ProctorLog, 'id'>) => {
    const newLog: ProctorLog = {
      ...logData,
      id: `prc-${Date.now()}`
    };
    setProctorLogs(prev => [newLog, ...prev]);
  };

  const deleteProctorLog = (id: string) => {
    setProctorLogs(prev => prev.filter(l => l.id !== id));
  };

  // Exam methods
  const addExam = (examData: Omit<ExamRecord, 'id'>) => {
    const newExam: ExamRecord = {
      ...examData,
      id: `ex-${Date.now()}`
    };
    setExams(prev => [newExam, ...prev]);
  };

  const updateExam = (id: string, updated: Partial<ExamRecord>) => {
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  };

  const addResult = (resData: Omit<StudentResult, 'id'>) => {
    const newResult: StudentResult = {
      ...resData,
      id: `res-${Date.now()}`
    };
    setResults(prev => [newResult, ...prev]);
  };

  const deleteResult = (id: string) => {
    setResults(prev => prev.filter(r => r.id !== id));
  };

  const resetToSampleData = () => {
    if (window.confirm("Reset all campus data to initial demo state? Current modifications will be replaced.")) {
      setStudents(initialStudents);
      setEmployees(initialEmployees);
      setBooks(initialBooks);
      setBorrowRecords(initialBorrowRecords);
      setTransactions(initialTransactions);
      setProctorLogs(initialProctorLogs);
      setExams(initialExams);
      setResults(initialResults);
      localStorage.clear();
      saveToDisk({
        students: initialStudents,
        employees: initialEmployees,
        books: initialBooks,
        borrowRecords: initialBorrowRecords,
        transactions: initialTransactions,
        proctorLogs: initialProctorLogs,
        exams: initialExams,
        results: initialResults
      });
    }
  };

  const exportDatabase = () => {
    const exportData = {
      students,
      employees,
      books,
      borrowRecords,
      transactions,
      proctorLogs,
      exams,
      results,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campuspulse_erp_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        students,
        employees,
        books,
        borrowRecords,
        transactions,
        proctorLogs,
        exams,
        results,
        isDiskSynced,
        addStudent,
        updateStudent,
        deleteStudent,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addBook,
        updateBook,
        deleteBook,
        issueBook,
        returnBook,
        addTransaction,
        deleteTransaction,
        addProctorLog,
        deleteProctorLog,
        addExam,
        updateExam,
        addResult,
        deleteResult,
        resetToSampleData,
        exportDatabase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
