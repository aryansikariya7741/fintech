import React, { useState } from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  LayoutDashboard,
  Trophy,
  Gamepad2,
  MessageSquare,
  User,
  WalletCards,
  TrendingUp,
  BookOpen,
  Plus,
  X,
} from 'lucide-react';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#111827',
    color: 'white',
    display: 'flex',
  },
  sidebar: {
    width: '256px',
    backgroundColor: '#1F2937',
    padding: '16px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#9CA3AF',
    textDecoration: 'none',
    padding: '8px',
    borderRadius: '6px',
    transition: 'color 0.2s',
  },
  activeNavLink: {
    color: '#3B82F6',
  },
  mainContent: {
    flex: 1,
    padding: '32px',
  },
  chartContainer: {
    backgroundColor: '#1F2937',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
  },
  transactionsContainer: {
    backgroundColor: '#1F2937',
    borderRadius: '8px',
    padding: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#3B82F6',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  transactionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  transactionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#374151',
    padding: '16px',
    borderRadius: '8px',
  },
  transactionDate: {
    fontSize: '14px',
    color: '#9CA3AF',
  },
  income: {
    color: '#10B981',
  },
  expense: {
    color: '#EF4444',
  },
  summary: {
    backgroundColor: '#374151',
    padding: '24px',
    borderRadius: '8px',
    height: 'fit-content',
  },
  summaryBalance: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  modal: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#1F2937',
    padding: '24px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '400px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '14px',
    color: '#9CA3AF',
  },
  input: {
    backgroundColor: '#374151',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    width: '100%',
  },
  select: {
    backgroundColor: '#374151',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    width: '100%',
  },
};

const initialTransactions = [
  { id: '1', title: 'Salary', amount: 1200, type: 'income', date: new Date() },
  { id: '2', title: 'Rent', amount: 200, type: 'expense', date: new Date() },
  { id: '3', title: 'Stocks', amount: 1000, type: 'income', date: new Date() },
];

const sampleChartData = [
  { name: 'Jan', income: 1200, expense: 800 },
  { name: 'Feb', income: 1100, expense: 900 },
  { name: 'Mar', income: 1300, expense: 850 },
  { name: 'Apr', income: 1400, expense: 950 },
  { name: 'May', income: 1200, expense: 800 },
];

function TransactionModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      title,
      amount: parseFloat(amount),
      type,
      date: new Date(),
    });
    onClose();
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.title}>Add Transaction</h2>
          <button onClick={onClose} style={{ ...styles.navLink, padding: 0 }}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={styles.select}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <button type="submit" style={styles.addButton}>
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
}

function ExpenseChart({ data }) {
  return (
    <div style={{ height: '256px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#EF4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ExpenseTracker() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [showModal, setShowModal] = useState(false);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleAddTransaction = (newTransaction) => {
    const transaction = {
      ...newTransaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions([...transactions, transaction]);
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <WalletCards size={24} color="#3B82F6" />
          <h1 style={styles.logoText}>FinanceForge</h1>
        </div>
        
        <nav style={styles.nav}>
          <a href="#" style={styles.navLink}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" style={styles.navLink}>
            <Trophy size={20} />
            <span>Leaderboard</span>
          </a>
          <a href="#" style={styles.navLink}>
            <Gamepad2 size={20} />
            <span>Games</span>
          </a>
          <a href="#" style={styles.navLink}>
            <MessageSquare size={20} />
            <span>Forum</span>
          </a>
          <a href="#" style={styles.navLink}>
            <User size={20} />
            <span>Profile</span>
          </a>
          <a href="#" style={{ ...styles.navLink, ...styles.activeNavLink }}>
            <WalletCards size={20} />
            <span>Expenses</span>
          </a>
          <a href="#" style={styles.navLink}>
            <TrendingUp size={20} />
            <span>Investments</span>
          </a>
          <a href="#" style={styles.navLink}>
            <BookOpen size={20} />
            <span>Learning</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Chart Section */}
          <div style={styles.chartContainer}>
            <ExpenseChart data={sampleChartData} />
          </div>

          {/* Transactions Section */}
          <div style={styles.transactionsContainer}>
            <div style={styles.header}>
              <h2 style={styles.title}>Transactions</h2>
              <button
                onClick={() => setShowModal(true)}
                style={styles.addButton}
              >
                <Plus size={20} />
                <span>Add Transaction</span>
              </button>
            </div>

            <div style={styles.grid}>
              {/* Transactions List */}
              <div style={styles.transactionList}>
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    style={styles.transactionItem}
                  >
                    <div>
                      <h3 style={{ fontWeight: 500 }}>{transaction.title}</h3>
                      <p style={styles.transactionDate}>
                        {format(transaction.date, 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <span
                      style={
                        transaction.type === 'income'
                          ? styles.income
                          : styles.expense
                      }
                    >
                      {transaction.type === 'income' ? '+' : '-'}$
                      {transaction.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={styles.summary}>
                <div style={styles.summaryBalance}>
                  <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
                    Total Balance
                  </p>
                  <p>${balance.toFixed(2)}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={styles.summaryItem}>
                    <div>
                      <p style={{ fontSize: '14px', color: '#9CA3AF' }}>Income</p>
                      <p style={{ ...styles.income, fontSize: '18px', fontWeight: 600 }}>
                        +${totalIncome.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ ...styles.dot, backgroundColor: '#10B981' }} />
                  </div>

                  <div style={styles.summaryItem}>
                    <div>
                      <p style={{ fontSize: '14px', color: '#9CA3AF' }}>Expenses</p>
                      <p style={{ ...styles.expense, fontSize: '18px', fontWeight: 600 }}>
                        -${totalExpense.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ ...styles.dot, backgroundColor: '#EF4444' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddTransaction}
        />
      )}
    </div>
  );
}

export default ExpenseTracker;