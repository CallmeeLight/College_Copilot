import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Wallet, AlertCircle, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';
import { FeeEntry, FeeStatus } from '../types';
import { generateId, formatDate, getRelativeDeadline, daysUntil, getDateOffset } from '../utils/helpers';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

interface FeesProps {
  fees: FeeEntry[];
  setFees: (val: FeeEntry[] | ((prev: FeeEntry[]) => FeeEntry[])) => void;
}

const emptyFee = {
  feeType: '',
  amount: 5000,
  dueDate: getDateOffset(14),
  status: 'unpaid' as FeeStatus,
};

export default function Fees({ fees, setFees }: FeesProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeEntry | null>(null);
  const [form, setForm] = useState(emptyFee);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FeeStatus | 'all'>('all');

  // Compute fee stats
  const stats = useMemo(() => {
    let totalPending = 0;
    let totalPaid = 0;
    let overdueCount = 0;

    fees.forEach(f => {
      const isActuallyOverdue = f.status !== 'paid' && daysUntil(f.dueDate) < 0;
      if (f.status === 'paid') {
        totalPaid += f.amount;
      } else {
        totalPending += f.amount;
        if (isActuallyOverdue || f.status === 'overdue') {
          overdueCount++;
        }
      }
    });

    return { totalPending, totalPaid, overdueCount };
  }, [fees]);

  const filteredFees = useMemo(() => {
    return fees
      .filter(f => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'overdue') {
          return f.status === 'overdue' || (f.status === 'unpaid' && daysUntil(f.dueDate) < 0);
        }
        return f.status === filterStatus;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [fees, filterStatus]);

  const openAdd = () => {
    setEditingFee(null);
    setForm(emptyFee);
    setModalOpen(true);
  };

  const openEdit = (f: FeeEntry) => {
    setEditingFee(f);
    setForm({
      feeType: f.feeType,
      amount: f.amount,
      dueDate: f.dueDate,
      status: f.status,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.feeType.trim() || form.amount <= 0) {
      toast.error('Please specify a valid Fee Type and Amount');
      return;
    }

    if (editingFee) {
      setFees(prev =>
        prev.map(f => (f.id === editingFee.id ? { ...f, ...form } : f))
      );
      toast.success('Fee record updated');
    } else {
      setFees(prev => [...prev, { id: generateId(), ...form }]);
      toast.success('Fee reminder scheduled');
    }
    setModalOpen(false);
  };

  const toggleStatus = (id: string, current: FeeStatus) => {
    const nextStatus: FeeStatus = current === 'paid' ? 'unpaid' : 'paid';
    setFees(prev =>
      prev.map(f => (f.id === id ? { ...f, status: nextStatus } : f))
    );
    toast.success(nextStatus === 'paid' ? 'Marked as Paid 🎉' : 'Marked as Unpaid');
  };

  const handleDelete = () => {
    if (deleteId) {
      setFees(prev => prev.filter(f => f.id !== deleteId));
      toast.success('Fee record removed');
      setDeleteId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">💰 Fee Reminders & Tracking</h1>
          <p className="page-subtitle">Track college semester, hostel, lab, and exam dues on time</p>
        </div>
        <button onClick={openAdd} className="glass-button glass-button-primary text-xs">
          <Plus size={14} /> Add Fee Reminder
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="glass-card bg-amber-500/[0.04] border-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Total Pending Dues</span>
            <AlertCircle size={16} className="text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">
            ₹{stats.totalPending.toLocaleString('en-IN')}
          </p>
          <p className="text-[0.65rem] text-slate-500 mt-1">
            Across {fees.filter(f => f.status !== 'paid').length} pending heads
          </p>
        </div>

        <div className="glass-card bg-green-500/[0.04] border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Total Paid</span>
            <CheckCircle size={16} className="text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">
            ₹{stats.totalPaid.toLocaleString('en-IN')}
          </p>
          <p className="text-[0.65rem] text-slate-500 mt-1">Cleared this academic cycle</p>
        </div>

        <div className="glass-card bg-red-500/[0.04] border-red-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Overdue Heads</span>
            <Clock size={16} className="text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">
            {stats.overdueCount}
          </p>
          <p className="text-[0.65rem] text-slate-500 mt-1">Requires immediate attention</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'unpaid', 'overdue', 'paid'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs capitalize transition-all ${
              filterStatus === status
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Fee List */}
      {filteredFees.length === 0 ? (
        <div className="empty-state glass-card">
          <p className="empty-state-icon">💳</p>
          <p className="text-sm text-slate-400 mb-3">No fee records found</p>
          <button onClick={openAdd} className="glass-button glass-button-primary text-xs">
            <Plus size={14} /> Add First Fee Entry
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFees.map(fee => {
            const isDueSoon = fee.status !== 'paid' && daysUntil(fee.dueDate) <= 5 && daysUntil(fee.dueDate) >= 0;
            const isPastDue = fee.status !== 'paid' && daysUntil(fee.dueDate) < 0;

            return (
              <div
                key={fee.id}
                className={`glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                  isPastDue
                    ? 'border-red-500/30 bg-red-500/[0.03]'
                    : isDueSoon
                    ? 'border-amber-500/20 bg-amber-500/[0.02]'
                    : ''
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      fee.status === 'paid'
                        ? 'bg-green-500/10 text-green-400'
                        : isPastDue
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-indigo-500/10 text-indigo-400'
                    }`}
                  >
                    <Wallet size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{fee.feeType}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400">
                        Due: {formatDate(fee.dueDate)}
                      </span>
                      <span className="text-[0.65rem] text-slate-500">
                        ({getRelativeDeadline(fee.dueDate)})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-left sm:text-right">
                    <p className="text-base font-bold text-white">
                      ₹{fee.amount.toLocaleString('en-IN')}
                    </p>
                    <span className={`badge ${
                      fee.status === 'paid'
                        ? 'badge-paid'
                        : isPastDue
                        ? 'badge-overdue'
                        : 'badge-unpaid'
                    } text-[0.65rem]`}>
                      {fee.status === 'paid' ? 'Paid' : isPastDue ? 'Overdue' : 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleStatus(fee.id, fee.status)}
                      className={`glass-button text-xs !py-1.5 !px-3 ${
                        fee.status === 'paid'
                          ? 'glass-button-secondary text-slate-400'
                          : 'glass-button-primary'
                      }`}
                    >
                      {fee.status === 'paid' ? 'Mark Pending' : 'Mark Paid'}
                    </button>

                    <button
                      onClick={() => openEdit(fee)}
                      className="glass-button-ghost p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 size={13} />
                    </button>

                    <button
                      onClick={() => setDeleteId(fee.id)}
                      className="glass-button-ghost p-1.5 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Note on payments */}
      <div className="mt-6 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center text-[0.7rem] text-slate-500">
        💡 College Copilot is a financial tracking and reminder tool. Actual payments are to be completed via your official college portal.
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFee ? 'Update Fee Reminder' : 'Add Fee Reminder'}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Fee Category / Title *</label>
            <input
              type="text"
              value={form.feeType}
              onChange={e => setForm(f => ({ ...f, feeType: e.target.value }))}
              className="glass-input"
              placeholder="e.g. Semester 2 Tuition, Hostel Fee, Convocation Fee"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Amount (₹) *</label>
            <input
              type="number"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))}
              className="glass-input"
              placeholder="5000"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Payment Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              className="glass-input"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Current Status</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value as FeeStatus }))}
              className="glass-input"
            >
              <option value="unpaid">Unpaid / Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="glass-button glass-button-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="glass-button glass-button-primary flex-1"
            >
              {editingFee ? 'Update' : 'Schedule'} Reminder
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Remove Fee Entry"
        message="Are you sure you want to remove this fee reminder?"
      />
    </div>
  );
}
