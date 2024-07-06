import { useEffect, useState } from 'react';
import axios from 'axios';
import './feedback.css';

interface FeedbackItem {
  feedbackId: string;
  userId: string;
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

  return (
    <div>
      <h1 className="feedback-title">Customers' Feedback</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Feedback ID</th>
              <th>User Name</th>
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
                <td>{item.userId}</td>
                <td>{item.comment}</td>
                <td>{item.sentiment_score}</td>
                <td>{item.sentiment_magnitude}</td>
                <td>{item.attitude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Feedback;
