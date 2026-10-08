import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  Receipt, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  FileText,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';

interface AccountsViewProps {
  isAddPaymentOpen: boolean;
  onOpenAddPayment: () => void;
  onCloseAddPayment: () => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  isAddPaymentOpen,
  onOpenAddPayment,
  onCloseAddPayment
}) => {
  const { 
    transactions, 
    students, 
    employees, 
    addTransaction, 
    deleteTransaction 
  } = useApp();

  const [filterType, setFilterType] = useState<'All' | 'Income' | 'Expense'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingReceipt, setViewingReceipt] = useState<Transaction | null>(null);

  // Form for New Transaction
  const [txForm, setTxForm] = useState<Omit<Transaction, 'id' | 'receiptNo'>>({
    type: 'Income',
    category: 'Tuition Fee',
    title: '',
    partyName: '',
    partyIdentifier: '',
    amount: 10000,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: 'UPI / NetBanking',
    status: 'Completed',
    remarks: ''
  });

  // Financial Stats
  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((a, b) => a + b.amount, 0);
  const netSurplus = totalIncome - totalExpense;

  const totalStudentPendingFees = students.reduce((a, s) => a + s.pendingFee, 0);

  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'All' || t.type === filterType;
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.partyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.partyIdentifier && t.partyIdentifier.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesSearch;
  });

  const handleOpenAddIncome = () => {
    const defaultStudent = students.find(s => s.pendingFee > 0) || students[0];
    setTxForm({
      type: 'Income',
      category: 'Tuition Fee',
      title: `Semester Fee - ${defaultStudent ? defaultStudent.name : ''}`,
      partyName: defaultStudent ? defaultStudent.name : '',
      partyIdentifier: defaultStudent ? defaultStudent.rollNo : '',
      amount: defaultStudent ? (defaultStudent.pendingFee || 60000) : 60000,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: 'UPI / NetBanking',
      status: 'Completed',
      remarks: 'Tuition fee installment payment'
    });
    onOpenAddPayment();
  };

  const handleStudentSelect = (rollNo: string) => {
    const s = students.find(std => std.rollNo === rollNo);
    if (s) {
      setTxForm(prev => ({
        ...prev,
        partyName: s.name,
        partyIdentifier: s.rollNo,
        title: `Semester Fee - ${s.name} (${s.rollNo})`,
        amount: s.pendingFee > 0 ? s.pendingFee : 60000
      }));
    }
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.partyName || txForm.amount <= 0) {
      alert("Please provide party name and a valid amount.");
      return;
    }
    addTransaction(txForm);
    onCloseAddPayment();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Institutional Accounts & Finance</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
              FY 2026-27 Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Student fee billing, institutional expenses, payroll vouchers and receipts
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenAddIncome}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment / Voucher</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Income Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Inflow / Fees</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">
            ₹{totalIncome.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Student tuition & library receipts</p>
        </div>

        {/* Expense Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Institutional Outflow</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-700 mt-2">
            ₹{totalExpense.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Staff payroll, labs & utilities</p>
        </div>

        {/* Net Fund */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Surplus Balance</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 ${netSurplus >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
            ₹{netSurplus.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Available treasury reserves</p>
        </div>

        {/* Pending Student Fees */}
        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Pending Student Dues</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-950 mt-2">
            ₹{totalStudentPendingFees.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-amber-800 mt-1">Outstanding semester installments</p>
        </div>

      </div>

      {/* Filter Row: Type (All, Income, Expense) & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          <div className="flex space-x-2 w-full sm:w-auto">
            {(['All', 'Income', 'Expense'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                  filterType === type 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'All' ? 'All Transactions' : type === 'Income' ? 'Fee Incomes' : 'Expenses & Payroll'}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search receipt, name, roll no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

        </div>
      </div>

      {/* Transactions Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Ledger Entries & Payment Vouchers</h3>
          <span className="text-xs text-slate-500">{filteredTransactions.length} Entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Receipt / Voucher</th>
                <th className="py-3 px-4">Particulars & Category</th>
                <th className="py-3 px-4">Party / Student</th>
                <th className="py-3 px-4">Date & Mode</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'Income';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900">{tx.receiptNo}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-800">{tx.title}</p>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{tx.partyName}</p>
                        {tx.partyIdentifier && (
                          <p className="text-[11px] text-slate-500">{tx.partyIdentifier}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-slate-800 font-medium">{tx.paymentDate}</p>
                        <p className="text-[11px] text-slate-500">{tx.paymentMode}</p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-sm font-black ${isIncome ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {isIncome ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setViewingReceipt(tx)}
                          className="px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition inline-flex items-center space-x-1"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment / Expense Modal */}
      {isAddPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Record Financial Voucher</h3>
              <button onClick={onCloseAddPayment} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Transaction Nature *</label>
                  <select
                    value={txForm.type}
                    onChange={(e) => {
                      const type = e.target.value as 'Income' | 'Expense';
                      setTxForm(prev => ({
                        ...prev,
                        type,
                        category: type === 'Income' ? 'Tuition Fee' : 'Faculty Salary'
                      }));
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-semibold"
                  >
                    <option value="Income">Inflow / Fee Collection</option>
                    <option value="Expense">Outflow / Expenditure / Payroll</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={txForm.category}
                    onChange={(e) => setTxForm({ ...txForm, category: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  >
                    {txForm.type === 'Income' ? (
                      <>
                        <option value="Tuition Fee">Tuition Fee</option>
                        <option value="Hostel Fee">Hostel Fee</option>
                        <option value="Exam Fee">Exam Fee</option>
                        <option value="Library Fine">Library Fine</option>
                      </>
                    ) : (
                      <>
                        <option value="Faculty Salary">Faculty Salary</option>
                        <option value="Staff Salary">Non-Teaching Staff Salary</option>
                        <option value="Lab Equipment">Lab Equipment</option>
                        <option value="Campus Maintenance">Campus Maintenance</option>
                        <option value="Software Licensing">Software Licensing</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {txForm.type === 'Income' && txForm.category === 'Tuition Fee' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quick-Select Student</label>
                  <select
                    onChange={(e) => handleStudentSelect(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-sky-50/50"
                  >
                    <option value="">Select student...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.rollNo}>
                        {s.name} ({s.rollNo}) - Pending: ₹{s.pendingFee.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Party / Student / Vendor Name *</label>
                <input
                  type="text"
                  required
                  value={txForm.partyName}
                  onChange={(e) => setTxForm({ ...txForm, partyName: e.target.value })}
                  placeholder="e.g. Diya Patel or Dell India Pvt Ltd"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Transaction Title / Description *</label>
                <input
                  type="text"
                  required
                  value={txForm.title}
                  onChange={(e) => setTxForm({ ...txForm, title: e.target.value })}
                  placeholder="e.g. 4th Sem Tuition Fee Installment"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={txForm.amount}
                    onChange={(e) => setTxForm({ ...txForm, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Date</label>
                  <input
                    type="date"
                    required
                    value={txForm.paymentDate}
                    onChange={(e) => setTxForm({ ...txForm, paymentDate: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode</label>
                <select
                  value={txForm.paymentMode}
                  onChange={(e) => setTxForm({ ...txForm, paymentMode: e.target.value as any })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="UPI / NetBanking">UPI / NetBanking</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Cash">Cash Counter</option>
                  <option value="Cheque">Bank Demand Draft / Cheque</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onCloseAddPayment}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition"
                >
                  Post Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 print:shadow-none print:border-0">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
              <h3 className="text-sm font-bold text-slate-800">Payment Voucher Receipt</h3>
              <button onClick={() => setViewingReceipt(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="py-4 space-y-4 text-xs font-sans">
              <div className="text-center pb-3 border-b border-dashed border-slate-200">
                <h2 className="text-base font-black tracking-wide text-slate-900 uppercase">CampusPulse Institute of Technology</h2>
                <p className="text-[11px] text-slate-500">Accounts & Bursar Department</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Campus Road, Tech District • Ph: +91 80 2345 6789</p>
                <div className="inline-block mt-2 px-2.5 py-0.5 bg-slate-100 rounded text-[11px] font-mono font-bold text-slate-800">
                  {viewingReceipt.receiptNo}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-semibold text-slate-800">{viewingReceipt.paymentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Party / Student:</span>
                  <span className="font-bold text-slate-900">{viewingReceipt.partyName}</span>
                </div>
                {viewingReceipt.partyIdentifier && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">ID / Roll No:</span>
                    <span className="font-semibold text-slate-800">{viewingReceipt.partyIdentifier}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Description:</span>
                  <span className="font-semibold text-slate-800 text-right">{viewingReceipt.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-800">{viewingReceipt.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-semibold text-slate-800">{viewingReceipt.paymentMode}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <span className="font-bold text-slate-700">Total Amount:</span>
                <span className="text-lg font-black text-slate-900">₹{viewingReceipt.amount.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2 text-[10px] text-center text-slate-400">
                System generated institutional receipt. No signature required.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between print:hidden">
              <button
                onClick={() => setViewingReceipt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
