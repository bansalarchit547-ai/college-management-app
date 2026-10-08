import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  BookMarked, 
  User, 
  X,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Book } from '../types';

interface LibraryViewProps {
  isIssueModalOpen: boolean;
  onOpenIssueModal: () => void;
  onCloseIssueModal: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  isIssueModalOpen,
  onOpenIssueModal,
  onCloseIssueModal
}) => {
  const { 
    books, 
    borrowRecords, 
    students, 
    employees, 
    addBook, 
    issueBook, 
    returnBook, 
    deleteBook 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'circulation'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [returnFineModalRecord, setReturnFineModalRecord] = useState<any | null>(null);
  const [fineInput, setFineInput] = useState<number>(0);

  // New Book Form
  const [bookForm, setBookForm] = useState<Omit<Book, 'id' | 'borrowedCount'>>({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    edition: '1st Edition',
    department: 'Computer Science & Engineering',
    shelfLocation: 'Stack CS-101',
    totalCopies: 10,
    availableCopies: 10
  });

  // Issue Book Form
  const [issueForm, setIssueForm] = useState({
    bookId: '',
    borrowerType: 'Student' as 'Student' | 'Faculty',
    borrowerId: '',
    borrowerName: '',
    identifier: '',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // default 14 days
  });

  const filteredBooks = books.filter(b => {
    const matchesDept = selectedDept === 'All' || b.department === selectedDept;
    const matchesSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const activeBorrows = borrowRecords.filter(r => r.status === 'Issued' || r.status === 'Overdue');
  const pastBorrows = borrowRecords.filter(r => r.status === 'Returned');

  const handleOpenAddBook = () => {
    setBookForm({
      isbn: `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      title: '',
      author: '',
      publisher: '',
      edition: '1st Edition',
      department: 'Computer Science & Engineering',
      shelfLocation: 'Stack CS-101',
      totalCopies: 10,
      availableCopies: 10
    });
    setIsAddBookModalOpen(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title || !bookForm.author) {
      alert("Please provide book title and author.");
      return;
    }
    addBook(bookForm);
    setIsAddBookModalOpen(false);
  };

  const handleOpenIssue = (preselectedBookId?: string) => {
    const bookId = preselectedBookId || (books.find(b => b.availableCopies > 0)?.id || '');
    const defaultStudent = students[0];

    setIssueForm({
      bookId,
      borrowerType: 'Student',
      borrowerId: defaultStudent ? defaultStudent.id : '',
      borrowerName: defaultStudent ? defaultStudent.name : '',
      identifier: defaultStudent ? defaultStudent.rollNo : '',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    onOpenIssueModal();
  };

  const handleBorrowerSelect = (type: 'Student' | 'Faculty', id: string) => {
    if (type === 'Student') {
      const s = students.find(item => item.id === id);
      if (s) {
        setIssueForm(prev => ({
          ...prev,
          borrowerType: 'Student',
          borrowerId: s.id,
          borrowerName: s.name,
          identifier: s.rollNo
        }));
      }
    } else {
      const f = employees.find(item => item.id === id);
      if (f) {
        setIssueForm(prev => ({
          ...prev,
          borrowerType: 'Faculty',
          borrowerId: f.id,
          borrowerName: f.name,
          identifier: f.empCode
        }));
      }
    }
  };

  const handleConfirmIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.bookId || !issueForm.borrowerId) {
      alert("Please select a book and a borrower.");
      return;
    }
    issueBook(
      issueForm.bookId,
      issueForm.borrowerType,
      issueForm.borrowerId,
      issueForm.borrowerName,
      issueForm.identifier,
      issueForm.dueDate
    );
    onCloseIssueModal();
  };

  const handleInitiateReturn = (record: any) => {
    const isOverdue = record.status === 'Overdue';
    const estimatedFine = isOverdue ? 50 : 0;
    setFineInput(estimatedFine);
    setReturnFineModalRecord(record);
  };

  const handleConfirmReturn = () => {
    if (returnFineModalRecord) {
      returnBook(returnFineModalRecord.id, Number(fineInput) || 0);
      setReturnFineModalRecord(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Central Library Circulation & Catalog</h2>
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {books.reduce((acc, b) => acc + b.totalCopies, 0)} Total Volumes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Book repository, lending records, active loans and overdue management
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleOpenIssue()}
            className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-md shadow-sky-600/20 transition"
          >
            <BookMarked className="w-4 h-4" />
            <span>Issue Book</span>
          </button>
          <button
            onClick={handleOpenAddBook}
            className="flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-md shadow-purple-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Title</span>
          </button>
        </div>
      </div>

      {/* Tabs: Catalog vs Circulation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'catalog'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Book Inventory Catalog ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('circulation')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'circulation'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Active Borrowings & History ({activeBorrows.length} Active)</span>
        </button>
      </div>

      {/* TAB 1: BOOK CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          
          {/* Search & Dept Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
              />
            </div>

            <div className="w-full sm:w-64">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50/50 text-slate-700"
              >
                <option value="All">All Disciplines</option>
                <option value="Computer Science & Engineering">CSE</option>
                <option value="Information Technology">IT</option>
                <option value="Electronics & Communication">ECE</option>
                <option value="Mechanical Engineering">Mechanical</option>
                <option value="Civil Engineering">Civil</option>
              </select>
            </div>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
                No library titles found matching query.
              </div>
            ) : (
              filteredBooks.map((book) => {
                const isAvailable = book.availableCopies > 0;
                return (
                  <div key={book.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {book.shelfLocation}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isAvailable ? `${book.availableCopies} Available` : 'Out of Stock'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mt-2.5 line-clamp-2 leading-snug">
                        {book.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">by {book.author}</p>
                      
                      <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                        <p>ISBN: {book.isbn}</p>
                        <p>{book.publisher} • {book.edition}</p>
                        <p className="text-purple-700 font-medium">{book.department}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Total Copies: <strong className="text-slate-800">{book.totalCopies}</strong>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          disabled={!isAvailable}
                          onClick={() => handleOpenIssue(book.id)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                            isAvailable 
                              ? 'bg-sky-50 text-sky-700 hover:bg-sky-100' 
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          Issue Out
                        </button>
                        <button
                          onClick={() => deleteBook(book.id)}
                          title="Remove Book"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
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

        </div>
      )}

      {/* TAB 2: CIRCULATION & BORROWINGS */}
      {activeTab === 'circulation' && (
        <div className="space-y-6">
          
          {/* Active Borrowings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Current Active Book Issues</h3>
                <p className="text-xs text-slate-500">Books currently in circulation</p>
              </div>
              <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-full">
                {activeBorrows.length} Active Loans
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {activeBorrows.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No books currently issued out.
                </div>
              ) : (
                activeBorrows.map(record => {
                  const isOverdue = record.status === 'Overdue';
                  return (
                    <div key={record.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isOverdue ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{record.bookTitle}</h4>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Borrower: <strong className="text-slate-800">{record.borrowerName}</strong> ({record.borrowerIdentifier})
                            <span className="text-slate-400 ml-2">• {record.borrowerType}</span>
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Issued: {record.borrowDate} • Due: <strong className={isOverdue ? 'text-rose-600' : 'text-slate-700'}>{record.dueDate}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 self-end sm:self-center">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          isOverdue ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-sky-100 text-sky-800'
                        }`}>
                          {record.status}
                        </span>

                        <button
                          onClick={() => handleInitiateReturn(record)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Return Book</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Past Returned History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Returned History</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {pastBorrows.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">No returned history.</div>
              ) : (
                pastBorrows.map(record => (
                  <div key={record.id} className="p-3.5 flex items-center justify-between text-xs text-slate-600">
                    <div>
                      <p className="font-semibold text-slate-800">{record.bookTitle}</p>
                      <p className="text-[11px] text-slate-400">
                        {record.borrowerName} ({record.borrowerIdentifier}) • Returned on {record.returnDate}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Returned
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* MODAL: Issue Book */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Issue Library Book</h3>
              <button onClick={onCloseIssueModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmIssue} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Book Title *</label>
                <select
                  required
                  value={issueForm.bookId}
                  onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a title...</option>
                  {books.filter(b => b.availableCopies > 0).map(b => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.availableCopies} available) - {b.shelfLocation}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Borrower Category</label>
                  <select
                    value={issueForm.borrowerType}
                    onChange={(e) => {
                      const newType = e.target.value as 'Student' | 'Faculty';
                      setIssueForm(prev => ({ ...prev, borrowerType: newType }));
                      if (newType === 'Student') {
                        handleBorrowerSelect('Student', students[0]?.id || '');
                      } else {
                        handleBorrowerSelect('Faculty', employees[0]?.id || '');
                      }
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty Member</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Return Due Date *</label>
                  <input
                    type="date"
                    required
                    value={issueForm.dueDate}
                    onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Borrower Person *</label>
                {issueForm.borrowerType === 'Student' ? (
                  <select
                    required
                    value={issueForm.borrowerId}
                    onChange={(e) => handleBorrowerSelect('Student', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Student...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.rollNo} - {s.department})
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    required
                    value={issueForm.borrowerId}
                    onChange={(e) => handleBorrowerSelect('Faculty', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Faculty...</option>
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.empCode} - {e.department})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onCloseIssueModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md transition"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add New Book */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add Book to Central Catalog</h3>
              <button onClick={() => setIsAddBookModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  placeholder="e.g. Clean Architecture"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Author(s) *</label>
                <input
                  type="text"
                  required
                  value={bookForm.author}
                  onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                  placeholder="e.g. Robert C. Martin"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ISBN Number</label>
                  <input
                    type="text"
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={bookForm.department}
                    onChange={(e) => setBookForm({ ...bookForm, department: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Information Technology">IT</option>
                    <option value="Electronics & Communication">ECE</option>
                    <option value="Mechanical Engineering">Mechanical</option>
                    <option value="Civil Engineering">Civil</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Shelf Location</label>
                  <input
                    type="text"
                    value={bookForm.shelfLocation}
                    onChange={(e) => setBookForm({ ...bookForm, shelfLocation: e.target.value })}
                    placeholder="Stack CS-204"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Copies Stock</label>
                  <input
                    type="number"
                    min="1"
                    value={bookForm.totalCopies}
                    onChange={(e) => {
                      const count = parseInt(e.target.value) || 1;
                      setBookForm({ ...bookForm, totalCopies: count, availableCopies: count });
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return & Fine Modal */}
      {returnFineModalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Confirm Book Return</h3>
            <p className="text-xs text-slate-600">
              Returning <strong>{returnFineModalRecord.bookTitle}</strong> borrowed by {returnFineModalRecord.borrowerName}.
            </p>

            {returnFineModalRecord.status === 'Overdue' && (
              <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 text-xs">
                <p className="font-bold text-rose-800">⚠️ Book is Overdue!</p>
                <p className="text-rose-600 text-[11px] mt-0.5">Please assess overdue fine to be recorded in accounts.</p>
                <div className="mt-2">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Fine Amount (₹)</label>
                  <input
                    type="number"
                    value={fineInput}
                    onChange={(e) => setFineInput(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-2 rounded-lg border border-rose-200"
                  />
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setReturnFineModalRecord(null)}
                className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReturn}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
              >
                Accept Return
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
