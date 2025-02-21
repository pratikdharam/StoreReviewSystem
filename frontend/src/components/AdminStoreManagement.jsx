import { useState, useEffect } from "react";
import axios from "axios";

const AdminStoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [storeOwners, setStoreOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [storesRes, ownersRes] = await Promise.all([
        axios.get("http://localhost:5000/stores", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/users", {
          headers: { Authorization: `Bearer ${token}` },
          params: { role: "store_owner" }
        })
      ]);

      setStores(storesRes.data);
      setStoreOwners(ownersRes.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/stores",
        newStore,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Reset form and refetch data
      setNewStore({ name: "", email: "", address: "", ownerId: "" });
      setShowAddModal(false);
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add store");
    }
  };

  const handleDelete = async (storeId) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/stores/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      setError("Failed to delete store");
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Store Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add New Store
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Stores Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left">Store Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Address</th>
              <th className="p-4 text-left">Owner</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} className="border-t">
                <td className="p-4">{store.name}</td>
                <td className="p-4">{store.email}</td>
                <td className="p-4">{store.address}</td>
                <td className="p-4">{store.owner?.name || 'No owner'}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(store.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Store Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Store</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  className="border rounded w-full p-2"
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="border rounded w-full p-2"
                  value={newStore.email}
                  onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Address
                </label>
                <textarea
                  className="border rounded w-full p-2"
                  value={newStore.address}
                  onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Store Owner
                </label>
                <select
                  className="border rounded w-full p-2"
                  value={newStore.ownerId}
                  onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
                  required
                >
                  <option value="">Select Store Owner</option>
                  {storeOwners.map(owner => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStoreManagement;