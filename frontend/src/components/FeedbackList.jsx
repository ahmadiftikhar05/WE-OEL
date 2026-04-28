import { useState, useEffect } from 'react';
import axios from 'axios';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/feedbacks');
      setFeedbacks(response.data);
      setFilteredFeedbacks(response.data);

      // Extract unique subjects
      const uniqueSubjects = [...new Set(response.data.map(fb => fb.subject))];
      setSubjects(uniqueSubjects);
    } catch (error) {
      setError('Failed to fetch feedbacks');
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectFilter = async (subject) => {
    setSelectedSubject(subject);
    if (!subject) {
      setFilteredFeedbacks(feedbacks);
      setAverageRating(0);
    } else {
      try {
        const response = await axios.get(`http://localhost:3000/api/feedbacks/${subject}`);
        setFilteredFeedbacks(response.data.feedbacks);
        setAverageRating(response.data.averageRating);
      } catch (error) {
        setError('Failed to filter feedbacks');
        console.error('Error filtering feedbacks:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid black'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '32px', marginBottom: '12px'}}>📊</div>
          <div style={{fontSize: '18px', color: '#666', fontWeight: '500'}}>Loading feedbacks...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{backgroundColor: '#fef2f2', border: '2px solid #fca5a5', color: '#991b1b', padding: '16px 24px', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
        <span style={{fontSize: '24px'}}>⚠️</span>
        <div>
          <p style={{fontWeight: 'bold'}}>Error Loading Feedback</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{backgroundColor: 'white', border: '1px solid black', overflow: 'hidden'}}>
      <div style={{padding: '32px', borderBottom: '1px solid black'}}>
        <h3 style={{fontSize: '32px', fontWeight: 'bold', color: 'black', marginBottom: '24px'}}>Feedback List</h3>
        
        <div style={{marginBottom: '24px'}}>
          <label htmlFor="subjectFilter" style={{display: 'block', fontSize: '14px', fontWeight: 'bold', color: 'black', marginBottom: '12px'}}>
            Filter by Subject:
          </label>
          <select
            style={{width: '100%', padding: '12px 16px', border: '1px solid black', backgroundColor: 'white', color: 'black', borderRadius: '4px', fontFamily: 'inherit'}}
            id="subjectFilter"
            value={selectedSubject}
            onChange={(e) => handleSubjectFilter(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        {selectedSubject && averageRating > 0 && (
          <div style={{border: '1px solid black', padding: '16px'}}>
            <p style={{color: 'black', fontWeight: 'bold', fontSize: '18px'}}>
              {selectedSubject}
            </p>
            <p style={{color: 'black', marginTop: '8px'}}>
              Average Rating: <span style={{fontSize: '24px', fontWeight: 'bold', color: 'black'}}>{averageRating}/5</span>
              <span style={{marginLeft: '12px', fontSize: '18px'}}>{renderStars(Math.round(averageRating))}</span>
            </p>
          </div>
        )}
      </div>

      <div style={{padding: '32px'}}>
        {filteredFeedbacks.length === 0 ? (
          <div style={{textAlign: 'center', paddingTop: '32px', paddingBottom: '32px'}}>
            <p style={{color: 'black', fontWeight: '500'}}>No feedbacks found. Submit one to get started!</p>
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', fontSize: '14px', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '1px solid black'}}>
                  <th style={{textAlign: 'left', padding: '16px', fontWeight: 'bold', color: 'black'}}>Student Name</th>
                  <th style={{textAlign: 'left', padding: '16px', fontWeight: 'bold', color: 'black'}}>Subject</th>
                  <th style={{textAlign: 'left', padding: '16px', fontWeight: 'bold', color: 'black'}}>Rating</th>
                  <th style={{textAlign: 'left', padding: '16px', fontWeight: 'bold', color: 'black'}}>Comments</th>
                  <th style={{textAlign: 'left', padding: '16px', fontWeight: 'bold', color: 'black'}}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.map((feedback, index) => (
                  <tr key={feedback._id} style={{borderBottom: '1px solid black'}}>
                    <td style={{padding: '16px', color: 'black', fontWeight: '500'}}>{feedback.studentName}</td>
                    <td style={{padding: '16px', color: 'black'}}><span style={{border: '1px solid black', backgroundColor: 'white', color: 'black', padding: '4px 12px', fontSize: '12px', fontWeight: 'bold'}}>{feedback.subject}</span></td>
                    <td style={{padding: '16px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{fontSize: '20px'}}>{renderStars(feedback.rating)}</span>
                        <span style={{fontWeight: 'bold', color: 'black'}}>({feedback.rating}/5)</span>
                      </div>
                    </td>
                    <td style={{padding: '16px', color: 'black', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={feedback.comments || 'N/A'}>{feedback.comments || <span style={{color: 'black'}}>-</span>}</td>
                    <td style={{padding: '16px', color: 'black', fontSize: '12px', whiteSpace: 'nowrap'}}>{formatDate(feedback.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackList;