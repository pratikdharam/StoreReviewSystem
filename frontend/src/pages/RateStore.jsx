import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RateStore = () => {
  const { storeId } = useParams();
  const [rating, setRating] = useState(1);
  const navigate = useNavigate();

  const submitRating = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/ratings",
        { storeId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Rating submitted!");
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to submit rating.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold">Rate Store</h2>
      <select
        className="border p-2 w-full mb-2"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      >
        <option value="1">1 - Poor</option>
        <option value="2">2 - Fair</option>
        <option value="3">3 - Good</option>
        <option value="4">4 - Very Good</option>
        <option value="5">5 - Excellent</option>
      </select>
      <button className="bg-blue-500 text-white p-2 w-full" onClick={submitRating}>
        Submit Rating
      </button>
    </div>
  );
};

export default RateStore;
