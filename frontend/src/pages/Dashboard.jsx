import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UpdatePassword from "./UpdatePassword";
import AdminStoreManagement from "../components/AdminStoreManagement";

const Dashboard = () => {
  const [userRole, setUserRole] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [storeData, setStoreData] = useState(null);
  const [storeRatings, setStoreRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [sortConfig, setSortConfig] = useState({
    field: "name",
    order: "ASC",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        // Get user role and data
        const userResponse = await axios.get("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(userResponse.data.role);

        // Fetch role-specific data
        switch (userResponse.data.role) {
          case "admin":
            const [adminStats, allUsers, allStores] = await Promise.all([
              axios.get("http://localhost:5000/admin/dashboard", {
                headers: { Authorization: `Bearer ${token}` },
              }),
              axios.get("http://localhost:5000/users", {
                headers: { Authorization: `Bearer ${token}` },
              }),
              axios.get("http://localhost:5000/stores", {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ]);
            setDashboardData(adminStats.data);
            setUsers(allUsers.data);
            setStores(allStores.data);
            break;

          case "user":
            const storeResponse = await axios.get(
              "http://localhost:5000/stores",
              {
                params: { sortBy: sortConfig.field, order: sortConfig.order },
              }
            );
            setStores(storeResponse.data);
            break;

          case "store_owner":
            const ratingsResponse = await axios.get(
              "http://localhost:5000/ratings/store-owner",
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setStoreData(ratingsResponse.data);
            break;
        }

        setLoading(false);
      } catch (error) {
        setError("Error fetching dashboard data");
        setLoading(false);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };

    fetchDashboardData();
  }, [navigate, sortConfig]);

  const handleSort = (field) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === "ASC" ? "DESC" : "ASC",
    }));
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = (data) => {
    return data.filter((item) => {
      return (
        item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        item.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        item.address.toLowerCase().includes(filters.address.toLowerCase()) &&
        (filters.role ? item.role === filters.role : true)
      );
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="space-x-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Update Password
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {showPasswordModal && (
        <UpdatePassword onClose={() => setShowPasswordModal(false)} />
      )}

      <div className="container mx-auto p-6">
        {/* Admin Dashboard */}
        {userRole === "admin" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">Total Users</h3>
                <p className="text-3xl">{dashboardData?.totalUsers}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">Total Stores</h3>
                <p className="text-3xl">{dashboardData?.totalStores}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">Total Ratings</h3>
                <p className="text-3xl">{dashboardData?.totalRatings}</p>
              </div>
            </div>
            <AdminStoreManagement />

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold mb-4">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Filter by name"
                  className="border p-2 rounded"
                  value={filters.name}
                  onChange={handleFilter}
                />
                <input
                  type="text"
                  name="email"
                  placeholder="Filter by email"
                  className="border p-2 rounded"
                  value={filters.email}
                  onChange={handleFilter}
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Filter by address"
                  className="border p-2 rounded"
                  value={filters.address}
                  onChange={handleFilter}
                />
                <select
                  name="role"
                  className="border p-2 rounded"
                  value={filters.role}
                  onChange={handleFilter}
                >
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="store_owner">Store Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold mb-4">Users</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th
                        className="p-4 cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        Name{" "}
                        {sortConfig.field === "name" &&
                          (sortConfig.order === "ASC" ? "↑" : "↓")}
                      </th>
                      <th
                        className="p-4 cursor-pointer"
                        onClick={() => handleSort("email")}
                      >
                        Email{" "}
                        {sortConfig.field === "email" &&
                          (sortConfig.order === "ASC" ? "↑" : "↓")}
                      </th>
                      <th className="p-4">Address</th>
                      <th className="p-4">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applyFilters(users).map((user) => (
                      <tr key={user.id} className="border-t">
                        <td className="p-4">{user.name}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">{user.address}</td>
                        <td className="p-4">{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stores Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Stores</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Address</th>
                      <th className="p-4">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stores.map((store) => (
                      <tr key={store.id} className="border-t">
                        <td className="p-4">{store.name}</td>
                        <td className="p-4">{store.email}</td>
                        <td className="p-4">{store.address}</td>
                        <td className="p-4">{store.rating || "No ratings"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Normal User Dashboard */}
        {userRole === "user" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Available Stores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <div key={store.id} className="border p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-2">{store.name}</h4>
                  <p className="text-gray-600 mb-2">{store.address}</p>
                  <p className="mb-4">
                    Rating: {store.rating || "No ratings yet"}
                  </p>
                  <button
                    onClick={() => navigate(`/rate/${store.id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Rate Store
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Store Owner Dashboard */}
        {userRole === "store_owner" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Store Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded">
                  <p className="text-sm text-gray-600">Total Ratings</p>
                  <p className="text-2xl font-bold">
                    {storeData?.stats?.totalRatings || 0}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded">
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold">
                    {storeData?.stats?.averageRating || "0"} ⭐
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Rating History</h3>
              {storeData?.ratings?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-4 text-left">Customer</th>
                        <th className="p-4 text-left">Rating</th>
                        <th className="p-4 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {storeData.ratings.map((rating) => (
                        <tr key={rating.id} className="border-t">
                          <td className="p-4">{rating.User.name}</td>
                          <td className="p-4">{"⭐".repeat(rating.rating)}</td>
                          <td className="p-4">
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No ratings yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
