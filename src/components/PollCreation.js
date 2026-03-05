import React, { useState } from 'react';
import './PollCreation.css';

const PollCreation = ({ onCreatePoll }) => {
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    options: ['', ''],
    endDate: '',
    endTime: ''
  });
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData({ ...formData, options: [...formData.options, ''] });
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const validateForm = () => {
    if (!formData.question.trim()) {
      setError('Please enter a question');
      return false;
    }

    const filledOptions = formData.options.filter(opt => opt.trim());
    if (filledOptions.length < 2) {
      setError('Please enter at least 2 options');
      return false;
    }

    if (!formData.endDate || !formData.endTime) {
      setError('Please select end date and time');
      return false;
    }

    const selectedDateTime = new Date(formData.endDate + 'T' + formData.endTime);
    if (selectedDateTime <= new Date()) {
      setError('End time must be in the future');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (validateForm()) {
      onCreatePoll({
        ...formData,
        options: formData.options.filter(opt => opt.trim())
      });
      
      // Reset form
      setFormData({
        question: '',
        description: '',
        options: ['', ''],
        endDate: '',
        endTime: ''
      });
    }
  };

  return (
    <div className="poll-creation">
      <h2>Create New Poll</h2>
      <p className="subtitle">Fill in the details to create a new poll</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Question <span className="required">*</span></label>
          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            placeholder="What's your question?"
            maxLength="200"
          />
        </div>

        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add more context..."
            rows="3"
            maxLength="500"
          />
        </div>

        <div className="form-group">
          <label>Options <span className="required">*</span></label>
          {formData.options.map((option, index) => (
            <div key={index} className="option-input">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                maxLength="100"
              />
              {formData.options.length > 2 && (
                <button type="button" onClick={() => removeOption(index)} className="remove-btn">
                  ✕
                </button>
              )}
            </div>
          ))}
          
          {formData.options.length < 10 && (
            <button type="button" onClick={addOption} className="add-option-btn">
              + Add Option
            </button>
          )}
        </div>

        <div className="datetime-group">
          <div className="form-group">
            <label>End Date <span className="required">*</span></label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={today}
            />
          </div>

          <div className="form-group">
            <label>End Time <span className="required">*</span></label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-btn">
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default PollCreation;