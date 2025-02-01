import React, { useState } from 'react';
import './styles/App.css';

const EmailPopup = ({ onEmailSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(''); // Clear error on new input
  };

  const handleSubmit = async () => {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      // Call sendEmail function on valid email
      await sendEmail(email); 
      onEmailSubmit(email); // Pass email back to the parent if needed
    } else {
      setError('Please enter a valid email address.');
    }
  };

  // Send email to the entered email address
  const sendEmail = async (email) => {
    try {
      const response = await fetch('http://localhost:8001/send-email', {  // Make sure this matches your backend endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (result.success) {
        console.log('Email sent successfully:', result.message);
      } else {
        console.log('Failed to send email:', result.message);
      }
    } catch (error) {
      console.log('Error sending email:', error);
    }
  };

  return (
    <div className="email-popup">
      <div className="email-popup-content">
        <h2>Welcome to GRD!</h2>
        <p>Please enter your email to continue:</p>
        <input
          type="email"
          className="email-input"
          placeholder="Enter your email"
          value={email}
          onChange={handleInputChange}
        />
        {error && <p className="error-message">{error}</p>}
        <button className="button-40" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default EmailPopup;
