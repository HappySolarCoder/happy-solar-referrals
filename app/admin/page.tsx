'use client';

import { useState, useEffect } from 'react';

interface Referral {
  id: string;
  createdAt: string;
  referrerName: string;
  referrerEmail: string;
  leadName: string;
  leadAddress: string;
  leadPhone: string;
  leadEmail: string;
  leadNotes: string;
  status: string;
  assignedSetter: string;
  incentiveAmount: number;
  incentiveStatus: string;
}

export default function AdminDashboard() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const response = await fetch('/api/referrals');
      const data = await response.json();
      setReferrals(data);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/referrals', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });
      fetchReferrals(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const updateSetter = async (id: string, assignedSetter: string) => {
    try {
      await fetch('/api/referrals', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, assignedSetter }),
      });
      fetchReferrals(); // Refresh data
    } catch (error) {
      console.error('Error updating setter:', error);
    }
  };

  const filteredReferrals = filter === 'all' 
    ? referrals 
    : referrals.filter(r => r.status === filter);

  const stats = {
    total: referrals.length,
    submitted: referrals.filter(r => r.status === 'submitted').length,
    contacted: referrals.filter(r => r.status === 'contacted').length,
    appointment: referrals.filter(r => r.status === 'appointment').length,
    closed: referrals.filter(r => r.status === 'closed').length,
    pendingIncentives: referrals.filter(r => r.incentiveStatus === 'pending' && r.status === 'closed').length * 500,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4">Referral Dashboard</h1>
        <p className="text-xl text-secondary">
          Manage and track all referrals
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card">
          <div className="text-secondary text-sm font-medium mb-2">Total Referrals</div>
          <div className="text-4xl font-bold text-accent">{stats.total}</div>
        </div>
        <div className="card">
          <div className="text-secondary text-sm font-medium mb-2">New (Submitted)</div>
          <div className="text-4xl font-bold">{stats.submitted}</div>
        </div>
        <div className="card">
          <div className="text-secondary text-sm font-medium mb-2">Closed Deals</div>
          <div className="text-4xl font-bold text-green-500">{stats.closed}</div>
        </div>
        <div className="card">
          <div className="text-secondary text-sm font-medium mb-2">Pending Incentives</div>
          <div className="text-4xl font-bold text-accent">${stats.pendingIncentives.toLocaleString()}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'btn-primary' : 'btn-secondary'}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilter('submitted')}
          className={filter === 'submitted' ? 'btn-primary' : 'btn-secondary'}
        >
          Submitted ({stats.submitted})
        </button>
        <button
          onClick={() => setFilter('contacted')}
          className={filter === 'contacted' ? 'btn-primary' : 'btn-secondary'}
        >
          Contacted ({stats.contacted})
        </button>
        <button
          onClick={() => setFilter('appointment')}
          className={filter === 'appointment' ? 'btn-primary' : 'btn-secondary'}
        >
          Appointment ({stats.appointment})
        </button>
        <button
          onClick={() => setFilter('closed')}
          className={filter === 'closed' ? 'btn-primary' : 'btn-secondary'}
        >
          Closed ({stats.closed})
        </button>
      </div>

      {/* Referrals Table */}
      <div className="card overflow-x-auto">
        {filteredReferrals.length === 0 ? (
          <div className="text-center py-12 text-secondary">
            <p className="text-xl mb-4">No referrals yet</p>
            <p>Share the referral link to get started!</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-secondary font-medium">Date</th>
                <th className="text-left py-4 px-4 text-secondary font-medium">Referred By</th>
                <th className="text-left py-4 px-4 text-secondary font-medium">Lead Name</th>
                <th className="text-left py-4 px-4 text-secondary font-medium">Contact</th>
                <th className="text-left py-4 px-4 text-secondary font-medium">Status</th>
                <th className="text-left py-4 px-4 text-secondary font-medium">Assigned To</th>
                <th className="text-left py-4 px-4 text-secondary font-medium">Incentive</th>
              </tr>
            </thead>
            <tbody>
              {filteredReferrals.map((referral) => (
                <tr key={referral.id} className="border-b border-border hover:bg-white/5">
                  <td className="py-4 px-4">
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium">{referral.referrerName}</div>
                    <div className="text-sm text-secondary">{referral.referrerEmail}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium">{referral.leadName}</div>
                    <div className="text-sm text-secondary">{referral.leadAddress}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">{referral.leadPhone}</div>
                    {referral.leadEmail && (
                      <div className="text-sm text-secondary">{referral.leadEmail}</div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={referral.status}
                      onChange={(e) => updateStatus(referral.id, e.target.value)}
                      className="px-3 py-1 rounded bg-transparent border border-border text-sm"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="contacted">Contacted</option>
                      <option value="appointment">Appointment</option>
                      <option value="closed">Closed</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <input
                      type="text"
                      value={referral.assignedSetter}
                      onChange={(e) => updateSetter(referral.id, e.target.value)}
                      placeholder="Assign setter..."
                      className="px-3 py-1 text-sm rounded bg-transparent border border-border w-full"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-accent font-bold">${referral.incentiveAmount}</div>
                    <div className="text-xs text-secondary">{referral.incentiveStatus}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
