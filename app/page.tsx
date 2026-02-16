'use client';

import { useState } from 'react';

export default function ReferralPage() {
  const [formData, setFormData] = useState({
    referrerName: '',
    referrerEmail: '',
    leadName: '',
    leadAddress: '',
    leadPhone: '',
    leadEmail: '',
    leadNotes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit referral');
      }

      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/10 mb-6">
              <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">Referral Submitted!</h1>
            <p className="text-xl text-secondary mb-8">
              Thanks, {formData.referrerName}! We'll reach out to {formData.leadName} soon.<br />
              You'll earn <span className="text-accent font-bold">$500</span> if they go solar!
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  referrerName: '',
                  referrerEmail: '',
                  leadName: '',
                  leadAddress: '',
                  leadPhone: '',
                  leadEmail: '',
                  leadNotes: ''
                });
              }}
              className="btn-secondary"
            >
              Submit Another Referral
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Refer & Earn $500</h1>
          <p className="text-xl text-secondary">
            Help your friends save money while earning rewards
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Your Info Section */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Your Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="referrerName" className="block text-sm font-medium mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="referrerName"
                  name="referrerName"
                  value={formData.referrerName}
                  onChange={handleChange}
                  required
                  className="w-full"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label htmlFor="referrerEmail" className="block text-sm font-medium mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  id="referrerEmail"
                  name="referrerEmail"
                  value={formData.referrerEmail}
                  onChange={handleChange}
                  required
                  className="w-full"
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>

          {/* Friend's Info Section */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Friend's Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="leadName" className="block text-sm font-medium mb-2">
                  Friend's Name *
                </label>
                <input
                  type="text"
                  id="leadName"
                  name="leadName"
                  value={formData.leadName}
                  onChange={handleChange}
                  required
                  className="w-full"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label htmlFor="leadAddress" className="block text-sm font-medium mb-2">
                  Friend's Address *
                </label>
                <input
                  type="text"
                  id="leadAddress"
                  name="leadAddress"
                  value={formData.leadAddress}
                  onChange={handleChange}
                  required
                  className="w-full"
                  placeholder="123 Main St, Phoenix, AZ 85001"
                />
              </div>
              <div>
                <label htmlFor="leadPhone" className="block text-sm font-medium mb-2">
                  Friend's Phone *
                </label>
                <input
                  type="tel"
                  id="leadPhone"
                  name="leadPhone"
                  value={formData.leadPhone}
                  onChange={handleChange}
                  required
                  className="w-full"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label htmlFor="leadEmail" className="block text-sm font-medium mb-2">
                  Friend's Email
                </label>
                <input
                  type="email"
                  id="leadEmail"
                  name="leadEmail"
                  value={formData.leadEmail}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="jane@example.com (optional)"
                />
              </div>
              <div>
                <label htmlFor="leadNotes" className="block text-sm font-medium mb-2">
                  Why would they be a good fit?
                </label>
                <textarea
                  id="leadNotes"
                  name="leadNotes"
                  value={formData.leadNotes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full resize-none"
                  placeholder="e.g., High electric bills, south-facing roof, interested in solar..."
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Submitting...' : 'Send Referral'}
          </button>

          {/* Fine Print */}
          <p className="text-sm text-secondary text-center">
            * You'll receive $500 when your referral installs solar with Happy Solar.
          </p>
        </form>
      </div>
    </div>
  );
}
