# CampusPulse - College Management ERP Application
> Complete institutional management system for Windows & Mobile, supporting Student Registry (Year & Batch wise), Employees (Teaching & Non-Teaching), Proctor Mentorship System, Central Library Circulation, Accounts & Fee Management, and Exam Results / Marksheets.

---

## 🌟 Key Features & Modules

### 1. 🎓 Student Management (Year-wise & Batch-wise)
- **Year-wise Breakdown:** 1st Year, 2nd Year, 3rd Year, 4th Year.
- **Batch Cohorts:** 2024-2028, 2023-2027, 2022-2026, 2021-2025.
- **Multi-Branch Coverage:** Computer Science & Engineering, Information Technology, Electronics & Communication, Mechanical Engineering, Civil Engineering.
- **Profile Registry:** USN/Roll Number, Section, Assigned Faculty Proctor, CGPA, Attendance Tracking %, Fee Payment Status, and Parent/Guardian contacts.
- Add, Edit, Delete, and Search across students.

### 2. 👨‍🏫 Employee & Staff Management (Teaching & Non-Teaching)
- **Teaching Faculty:** Professors, Associate Professors, Assistant Professors, Head of Departments (HOD), Specialization, Research Qualifications, and Proctor mentorship ward assignments.
- **Non-Teaching Staff:** Chief Librarian, Accounts Officers, Administration Superintendent, System & Network Administrators, Lab Instructors.
- Monthly salary payroll tracking, date of joining, contact information, and service records.

### 3. 🛡️ Proctor & Mentorship System
- Dedicated faculty-to-student mentor tracking.
- **Automatic Attendance Deficit Alerts:** Flags students with `< 75%` attendance immediately.
- **Risk Assessment:** High, Medium, and Low risk classification.
- Proctor 1-on-1 counseling log records with session topics, observations, action items, and parent notification status.

### 4. 📚 Central Library Management
- **Catalog Management:** Books inventory, ISBN, Author, Department, Shelf Stack location, Total copies, and real-time Available copies.
- **Circulation Desk:** Issue books to students or faculty with automatic return due dates.
- **Circulation Tracking:** Active loans, overdue tracking, and return processing with overdue fine assessment recorded automatically in Accounts.

### 5. 💳 Accounts & Finance Module
- **Fee Inflow:** Student tuition, hostel, exam fees, and library fines collection.
- **Expense Outflow:** Faculty and non-teaching payroll disbursements, laboratory hardware purchases, software licensing, and campus maintenance.
- **Live Treasury Balance:** Automatic calculation of net institutional fund reserves and outstanding student fee receivables.
- **Receipt Generator:** University payment voucher and receipt with print support.

### 6. 🏆 Exams & Results Evaluation
- **Examination Scheduling:** Mid-Term 1, Mid-Term 2, Semester End Examinations, and Practical Viva tests.
- **Mark Sheet Generation:** Subject-wise internal and external marks, credit allocation, grade points, and letter grades (O, A+, A, B+, B, F).
- **SGPA & CGPA Engine:** Automated GPA calculations and distinction classification.
- **Printable Transcripts:** Formal university grade cards ready for print and export.

---

## 🚀 How to Run the Application

### Option A: Using the Windows Launcher Script
Double-click `run-app.bat` inside this directory:
```bash
run-app.bat
```

### Option B: Terminal Command
```bash
cmd /c npm run dev
```
Then open your browser at:
```
http://localhost:3000
```

---

## 📱 Mobile & Windows Cross-Platform Usage

- **On Windows Desktop:**
  - Full desktop layout with multi-column views, persistent sidebar, high-density data tables, and print-ready receipts/transcripts.
- **On Mobile Devices (Android / iOS):**
  - Fully responsive mobile design with touch-friendly cards, mobile bottom navigation bar, and collapsible navigation drawer.
  - To access from your phone on the same Wi-Fi network, launch the dev server with host enabled and navigate to your PC's IP address (e.g. `http://<YOUR_PC_IP>:3000`).

---

## 💾 Data Persistence & Backup
- All records (Students, Employees, Proctor logs, Library loans, Accounts, Exams) automatically persist in `localStorage`.
- Use the **"Backup"** button in the top navigation bar to download a full JSON database snapshot at any time.
- Use **"Reset Demo"** to restore rich sample demonstration data anytime.
