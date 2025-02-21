import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RateStore = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStoreAndRating = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        // Fetch store details and user's existing rating
        const [storeRes, ratingRes] = await Promise.all([
          axios.get(`http://localhost:5000/stores/${storeId}`),
          axios.get(`http://localhost:5000/ratings/user/${storeId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setStore(storeRes.data);
        if (ratingRes.data) {
          setUserRating(ratingRes.data);
          setRating(ratingRes.data.rating);
        }
      } catch (error) {
        setError("Failed to fetch store details");
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAndRating();
  }, [storeId, navigate]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      if (userRating) {
        // Update existing rating
        await axios.put(
          `http://localhost:5000/ratings/${userRating.id}`,
          { rating },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Rating updated successfully!");
      } else {
        // Submit new rating
        await axios.post(
          "http://localhost:5000/ratings",
          { storeId, rating },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Rating submitted successfully!");
      }

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">Store not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {store.name}
            </h2>
            <p className="text-gray-600 mb-6">{store.address}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Your Rating
            </label>
            <div className="flex flex-col space-y-2">
              <select
                className="border rounded w-full p-3"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
              <div className="text-yellow-400 text-2xl">
                {"★".repeat(rating)}{"☆".repeat(5 - rating)}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting
                ? "Submitting..."
                : userRating
                ? "Update Rating"
                : "Submit Rating"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateStore;