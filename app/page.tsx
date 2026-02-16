'use client';

import { useState } from 'react';

interface FormErrors {
  referrerName?: string;
  referrerEmail?: string;
  leadName?: string;
  leadAddress?: string;
  leadPhone?: string;
}

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

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.referrerName.trim()) {
      newErrors.referrerName = 'Your name is required';
    }

    if (!formData.referrerEmail.trim()) {
      newErrors.referrerEmail = 'Your email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.referrerEmail)) {
      newErrors.referrerEmail = 'Please enter a valid email';
    }

    if (!formData.leadName.trim()) {
      newErrors.leadName = "Friend's name is required";
    }

    if (!formData.leadAddress.trim()) {
      newErrors.leadAddress = "Friend's address is required";
    }

    if (!formData.leadPhone.trim()) {
      newErrors.leadPhone = "Friend's phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
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
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                  className={`w-full ${errors.referrerName ? 'error' : ''}`}
                  placeholder="John Smith"
                />
                {errors.referrerName && (
                  <p className="error-message">{errors.referrerName}</p>
                )}
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
                  className={`w-full ${errors.referrerEmail ? 'error' : ''}`}
                  placeholder="john@example.com"
                />
                {errors.referrerEmail && (
                  <p className="error-message">{errors.referrerEmail}</p>
                )}
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
                  className={`w-full ${errors.leadName ? 'error' : ''}`}
                  placeholder="Jane Doe"
                />
                {errors.leadName && (
                  <p className="error-message">{errors.leadName}</p>
                )}
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
                  className={`w-full ${errors.leadAddress ? 'error' : ''}`}
                  placeholder="123 Main St, Phoenix, AZ 85001"
                />
                {errors.leadAddress && (
                  <p className="error-message">{errors.leadAddress}</p>
                )}
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
                  className={`w-full ${errors.leadPhone ? 'error' : ''}`}
                  placeholder="(555) 123-4567"
                />
                {errors.leadPhone && (
                  <p className="error-message">{errors.leadPhone}</p>
                )}
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
