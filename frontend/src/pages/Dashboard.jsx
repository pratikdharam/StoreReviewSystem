import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [userRole, setUserRole] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserRole(res.data.role);

        // Fetch data based on role
        if (res.data.role === "admin") {
          const adminData = await axios.get("http://localhost:5000/admin/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDashboardData(adminData.data);
        } else if (res.data.role === "user") {
          const storeList = await axios.get("http://localhost:5000/stores");
          setStores(storeList.data);
        } else if (res.data.role === "store_owner") {
          const ratingList = await axios.get("http://localhost:5000/ratings", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRatings(ratingList.data);
        }
      } catch (error) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>

      {/* Admin Dashboard */}
      {userRole === "admin" && dashboardData && (
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-blue-200 p-4 rounded shadow-md">
            <h3 className="text-xl font-bold">Total Users</h3>
            <p>{dashboardData.totalUsers}</p>
          </div>
          <div className="bg-green-200 p-4 rounded shadow-md">
            <h3 className="text-xl font-bold">Total Stores</h3>
            <p>{dashboardData.totalStores}</p>
          </div>
          <div className="bg-yellow-200 p-4 rounded shadow-md">
            <h3 className="text-xl font-bold">Total Ratings</h3>
            <p>{dashboardData.totalRatings}</p>
          </div>
        </div>
      )}

      {/* Normal User Dashboard */}
      {userRole === "user" && stores.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mt-6">Available Stores</h3>
          {stores.map((store) => (
            <div key={store.id} className="border p-4 my-2 rounded">
              <h4 className="font-bold">{store.name}</h4>
              <p>Address: {store.address}</p>
              <p>Rating: {store.rating || "No ratings yet"}</p>
              <button
                className="bg-blue-500 text-white p-2 mt-2"
                onClick={() => navigate(`/rate/${store.id}`)}
              >
                Rate Store
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Store Owner Dashboard */}
      {userRole === "store_owner" && ratings.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mt-6">Store Ratings</h3>
          {ratings.map((rating) => (
            <div key={rating.id} className="border p-4 my-2 rounded">
              <p>
                <strong>{rating.User.name}</strong>: {rating.rating} ⭐
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
