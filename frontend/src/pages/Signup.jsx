import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/auth/register", user);
      navigate("/");
    } catch (error) {
      alert("Signup failed!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSignup}>
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        <input
          type="text"
          placeholder="Name"
          className="border p-2 w-full mb-2"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-2"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          className="border p-2 w-full mb-2"
          onChange={(e) => setUser({ ...user, address: e.target.value })}
        />
        <select
          className="border p-2 w-full mb-2"
          onChange={(e) => setUser({ ...user, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button className="bg-green-500 text-white p-2 w-full">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
