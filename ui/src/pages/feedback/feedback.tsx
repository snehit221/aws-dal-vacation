import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'

interface FeedbackItem {
  feedbackId: string;
  comment: string;
  sentiment_score: number;
  sentiment_magnitude: number;
  attitude: string;
}

function Feedback() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    axios.get('https://zv11jgvox0.execute-api.us-east-1.amazonaws.com/prod/fetchFeedback')
      .then(response => {
        const data = JSON.parse(response.data.body);
        if (Array.isArray(data)) {
          setFeedback(data);
        } else {
          console.error('Expected an array, but received:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching feedback:', error);
      });
  }, []);

  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
  };

  const thTdStyle = {
    border: '1px solid black',
    padding: '8px',
    textAlign: 'left',
  };


  return (
    <table>
      <thead>
        <tr>
          <th>Feedback ID</th>
          <th>Comment</th>
          <th>Sentiment Score</th>
          <th>Sentiment Magnitude</th>
          <th>Attitude</th>
        </tr>
      </thead>
      <tbody>
        {feedback.map((item) => (
          <tr key={item.feedbackId}>
            <td>{item.feedbackId}</td>
            <td>{item.comment}</td>
            <td>{item.sentiment_score}</td>
            <td>{item.sentiment_magnitude}</td>
            <td>{item.attitude}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Feedback;
