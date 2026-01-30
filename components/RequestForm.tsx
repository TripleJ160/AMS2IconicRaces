'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface FormData {
  driver: string;
  raceName: string;
  year: string;
  wikipediaLink: string;
  notes: string;
}

interface FormErrors {
  driver?: string;
  raceName?: string;
  year?: string;
  wikipediaLink?: string;
  notes?: string;
}

export function RequestForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    driver: '',
    raceName: '',
    year: '',
    wikipediaLink: '',
    notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Driver validation
    if (!formData.driver.trim()) {
      newErrors.driver = 'Driver name is required';
    }

    // Race name validation
    if (!formData.raceName.trim()) {
      newErrors.raceName = 'Race name is required';
    }

    // Year validation
    if (!formData.year.trim()) {
      newErrors.year = 'Year is required';
    } else {
      const yearNum = parseInt(formData.year, 10);
      const currentYear = new Date().getFullYear();
      if (isNaN(yearNum) || yearNum < 1950 || yearNum > currentYear) {
        newErrors.year = `Year must be between 1950 and ${currentYear}`;
      }
    }

    // Wikipedia link validation
    if (!formData.wikipediaLink.trim()) {
      newErrors.wikipediaLink = 'Wikipedia link is required';
    } else {
      try {
        const url = new URL(formData.wikipediaLink);
        if (!url.hostname.includes('wikipedia.org')) {
          newErrors.wikipediaLink = 'Please enter a valid Wikipedia URL';
        }
      } catch {
        newErrors.wikipediaLink = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous success message
    setShowSuccess(false);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create request document in Firestore
      const requestsRef = collection(db, 'requests');
      await addDoc(requestsRef, {
        userId: user!.uid,
        raceTitle: formData.raceName.trim(),
        driver: formData.driver.trim(),
        year: parseInt(formData.year, 10),
        wikipediaLink: formData.wikipediaLink.trim(),
        notes: formData.notes.trim() || null, // Store null if empty
        votes: 0,
        upvotedBy: [],
        createdAt: serverTimestamp(),
      });

      // Show success message
      setShowSuccess(true);

      // Reset form
      setFormData({
        driver: '',
        raceName: '',
        year: '',
        wikipediaLink: '',
        notes: '',
      });
      setErrors({});

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting request:', error);
      setErrors({
        raceName: 'Failed to submit request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // If user is not authenticated, show sign-in prompt
  if (!user) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Submit a Request
        </h2>
        <p className="text-gray-400 mb-4">
          Sign in to suggest legendary racing moments you&apos;d like to see added to the collection.
        </p>
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">
            Please sign in using the sidebar to submit requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        Submit a Request
      </h2>
      <p className="text-gray-400 mb-6">
        Suggest a legendary racing moment you&apos;d like to see recreated in AMS2.
      </p>

      {/* Success Message */}
      {showSuccess && (
        <div 
          className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg"
          role="alert"
        >
          <p className="text-green-400 font-medium">
            ✓ Request submitted successfully!
          </p>
          <p className="text-green-300 text-sm mt-1">
            Your suggestion has been added to the community voting board.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Driver Field */}
        <div className="mb-4">
          <label 
            htmlFor="driver" 
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Driver <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="driver"
            value={formData.driver}
            onChange={(e) => handleChange('driver', e.target.value)}
            className={`w-full px-4 py-2 bg-gray-800 border ${
              errors.driver ? 'border-red-500' : 'border-gray-700'
            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent`}
            placeholder="e.g., Ayrton Senna"
            disabled={isSubmitting}
            aria-invalid={!!errors.driver}
            aria-describedby={errors.driver ? 'driver-error' : undefined}
          />
          {errors.driver && (
            <p id="driver-error" className="mt-1 text-sm text-red-500">
              {errors.driver}
            </p>
          )}
        </div>

        {/* Race Name Field */}
        <div className="mb-4">
          <label 
            htmlFor="raceName" 
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Race Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="raceName"
            value={formData.raceName}
            onChange={(e) => handleChange('raceName', e.target.value)}
            className={`w-full px-4 py-2 bg-gray-800 border ${
              errors.raceName ? 'border-red-500' : 'border-gray-700'
            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent`}
            placeholder="e.g., Monaco Grand Prix"
            disabled={isSubmitting}
            aria-invalid={!!errors.raceName}
            aria-describedby={errors.raceName ? 'raceName-error' : undefined}
          />
          {errors.raceName && (
            <p id="raceName-error" className="mt-1 text-sm text-red-500">
              {errors.raceName}
            </p>
          )}
        </div>

        {/* Year Field */}
        <div className="mb-4">
          <label 
            htmlFor="year" 
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Year <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="year"
            value={formData.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className={`w-full px-4 py-2 bg-gray-800 border ${
              errors.year ? 'border-red-500' : 'border-gray-700'
            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent`}
            placeholder="e.g., 1988"
            min="1950"
            max={new Date().getFullYear()}
            disabled={isSubmitting}
            aria-invalid={!!errors.year}
            aria-describedby={errors.year ? 'year-error' : undefined}
          />
          {errors.year && (
            <p id="year-error" className="mt-1 text-sm text-red-500">
              {errors.year}
            </p>
          )}
        </div>

        {/* Wikipedia Link Field */}
        <div className="mb-4">
          <label 
            htmlFor="wikipediaLink" 
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Wikipedia Link <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="wikipediaLink"
            value={formData.wikipediaLink}
            onChange={(e) => handleChange('wikipediaLink', e.target.value)}
            className={`w-full px-4 py-2 bg-gray-800 border ${
              errors.wikipediaLink ? 'border-red-500' : 'border-gray-700'
            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent`}
            placeholder="https://en.wikipedia.org/wiki/..."
            disabled={isSubmitting}
            aria-invalid={!!errors.wikipediaLink}
            aria-describedby={errors.wikipediaLink ? 'wikipediaLink-error' : undefined}
          />
          {errors.wikipediaLink && (
            <p id="wikipediaLink-error" className="mt-1 text-sm text-red-500">
              {errors.wikipediaLink}
            </p>
          )}
        </div>

        {/* Additional Notes Field */}
        <div className="mb-6">
          <label 
            htmlFor="notes" 
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Additional Notes <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent resize-none"
            placeholder="Any additional context, corrections needed, or specific details about this race..."
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-gray-500">
            Use this to mention race card corrections, historical inaccuracies, or any other relevant information.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-accent-red hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}
