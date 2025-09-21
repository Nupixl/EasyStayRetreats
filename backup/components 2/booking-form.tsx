'use client';

import { useState } from 'react';

interface BookingFormProps {
  retreatId: number;
  retreatTitle: string;
}

export function BookingForm({ retreatId, retreatTitle }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Get the base path from the config
      const basePath = '/app';
      
      const response = await fetch(`${basePath}/api/retreats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          retreatId
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="booking_form-wrapper">
      <div className="booking_form-header">
        <h3 className="heading-style-h4 margin-bottom-small">
          Book {retreatTitle}
        </h3>
        <p className="text-size-regular text-color-neutral-600 margin-bottom-medium">
          Fill out the form below and we'll get back to you within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="booking_form">
        <div className="booking_form-group">
          <label htmlFor="name" className="booking_form-label">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="booking_form-input"
            placeholder="Enter your full name"
          />
        </div>

        <div className="booking_form-group">
          <label htmlFor="email" className="booking_form-label">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="booking_form-input"
            placeholder="Enter your email address"
          />
        </div>

        <div className="booking_form-group">
          <label htmlFor="phone" className="booking_form-label">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="booking_form-input"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="booking_form-group">
          <label htmlFor="message" className="booking_form-label">
            Additional Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="booking_form-textarea"
            placeholder="Tell us about your wellness goals or any special requirements..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="button is-primary booking_form-submit"
        >
          {isSubmitting ? 'Submitting...' : 'Request Booking'}
        </button>

        {submitStatus === 'success' && (
          <div className="booking_form-success">
            <p className="text-size-regular text-color-secondary">
              ✅ Thank you! Your booking request has been submitted successfully. We'll contact you soon.
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="booking_form-error">
            <p className="text-size-regular text-color-red">
              ❌ There was an error submitting your request. Please try again.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
