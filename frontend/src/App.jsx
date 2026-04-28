import { useState } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFeedbackSubmitted = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: 'white', padding: '48px 16px'}}>
      <div style={{maxWidth: '1280px', margin: '0 auto'}}>
        <div style={{marginBottom: '48px', textAlign: 'center'}}>
          <h1 style={{fontSize: '48px', fontWeight: 'bold', textAlign: 'center', color: 'black', marginBottom: '16px'}}>
            Student Feedback Management System
          </h1>
          <p style={{textAlign: 'center', color: '#666', fontSize: '18px', maxWidth: '640px', margin: '0 auto'}}>Collect, manage, and analyze student feedback efficiently</p>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px'}}>
          <div>
            <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />
          </div>
          <div>
            <FeedbackList key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
