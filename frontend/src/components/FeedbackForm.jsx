import { useState } from 'react';
import axios from 'axios';

const FeedbackForm = ({ onFeedbackSubmitted }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    subject: '',
    rating: '',
    comments: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:3000/api/feedback', {
        ...formData,
        rating: parseInt(formData.rating)
      });

      setMessage('Feedback submitted successfully!');
      setFormData({
        studentName: '',
        subject: '',
        rating: '',
        comments: ''
      });
      setErrors({});

      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage('Error: ' + (error.response.data.error || 'Failed to submit feedback'));
      } else {
        setMessage('Error: Failed to submit feedback');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{backgroundColor: 'white', border: '1px solid black', padding: '24px'}}>
      <div style={{marginBottom: '24px'}}>
        <h3 style={{fontSize: '24px', fontWeight: 'bold', color: 'black'}}>Submit Feedback</h3>
      </div>

      {message && (
        <div style={{marginBottom: '24px', padding: '16px', borderLeft: '4px solid black', backgroundColor: '#f3f4f6', color: 'black'}}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <div>
          <label htmlFor="studentName" style={{display: 'block', fontSize: '14px', fontWeight: 'bold', color: 'black', marginBottom: '8px'}}>
            Student Name <span style={{color: '#dc2626'}}>*</span>
          </label>
          <input
            type="text"
            style={{width: '100%', padding: '8px 12px', border: errors.studentName ? '1px solid #dc2626' : '1px solid black', backgroundColor: errors.studentName ? '#f3f4f6' : 'white', borderRadius: '4px', outline: 'none', color: 'black', fontFamily: 'inherit'}}
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          {errors.studentName && <p style={{color: '#dc2626', fontSize: '14px', marginTop: '4px'}}>{errors.studentName}</p>}
        </div>

        <div>
          <label htmlFor="subject" style={{display: 'block', fontSize: '14px', fontWeight: 'bold', color: 'black', marginBottom: '8px'}}>
            Subject <span style={{color: '#dc2626'}}>*</span>
          </label>
          <select
            style={{width: '100%', padding: '8px 12px', border: errors.subject ? '1px solid #dc2626' : '1px solid black', backgroundColor: errors.subject ? '#f3f4f6' : 'white', borderRadius: '4px', outline: 'none', color: 'black', fontFamily: 'inherit'}}
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          >
            <option value="">Select a subject</option>
            <option value="Maths">Maths</option>
            <option value="Science">Science</option>
          </select>
          {errors.subject && <p style={{color: '#dc2626', fontSize: '14px', marginTop: '4px'}}>{errors.subject}</p>}
        </div>

        <div>
          <label htmlFor="rating" style={{display: 'block', fontSize: '14px', fontWeight: 'bold', color: 'black', marginBottom: '8px'}}>
            Rating <span style={{color: '#dc2626'}}>*</span>
          </label>
          <input
            type="number"
            min="1"
            max="5"
            style={{width: '100%', padding: '8px 12px', border: errors.rating ? '1px solid #dc2626' : '1px solid black', backgroundColor: errors.rating ? '#f3f4f6' : 'white', borderRadius: '4px', outline: 'none', color: 'black', fontFamily: 'inherit'}}
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            placeholder="Enter rating (1-5)"
          />
          {errors.rating && <p style={{color: '#dc2626', fontSize: '14px', marginTop: '4px'}}>{errors.rating}</p>}
        </div>

        <div>
          <label htmlFor="comments" style={{display: 'block', fontSize: '14px', fontWeight: 'bold', color: 'black', marginBottom: '8px'}}>
            Comments (Optional)
          </label>
          <textarea
            style={{width: '100%', padding: '8px 12px', border: '1px solid black', borderRadius: '4px', outline: 'none', resize: 'none', color: 'black', fontFamily: 'inherit'}}
            id="comments"
            name="comments"
            rows="3"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Add any comments..."
          ></textarea>
        </div>

        <button
          type="submit"
          style={{width: '100%', backgroundColor: 'black', color: 'white', fontWeight: 'bold', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer', opacity: isSubmitting ? 0.5 : 1}}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
//           )}
//         </button>
//       </form>
//     </div>
//   );
};

export default FeedbackForm;