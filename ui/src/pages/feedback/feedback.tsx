import { useEffect, useState } from "react";
import axios from "axios";
import "./feedback.css";
import { useNavigate } from "react-router-dom";

interface FeedbackItem {
  email: string;
  comment: string;
  id: string;
  location: string;
  number: number;
  price: number;
  sentiment_score: number;
  sentiment_magnitude: number;
  attitude: string;
}

function Feedback() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    axios
      .get(
        "https://w4pkjn6nhkwzqeedhvaavdyazu0taujl.lambda-url.us-east-1.on.aws/"
      )
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setFeedback(data);
        } else {
          console.error("Expected an array, but received:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching feedback:", error);
      });
  }, []);

  return (
    <div>
      <h1 className="feedback-title">Customers' Feedback</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Comment</th>
              <th>Room Number</th>
              <th>Room Price</th>
              <th>Room Location</th>
              <th>Sentiment Score</th>
              <th>Sentiment Magnitude</th>
              <th>Attitude</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((item, idx) => (
              <tr key={idx} onClick={() => navigate(`/room/${item.id}`)}>
                <td>{item.email}</td>
                <td>{item.comment}</td>
                <td>{item.number}</td>
                <td>{item.price}</td>
                <td>{item.location}</td>
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
