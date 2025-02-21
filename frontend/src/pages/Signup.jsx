import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Name validation (20-60 characters)
    if (!user.name || user.name.length < 20 || user.name.length > 60) {
      newErrors.name = "Name must be between 20 and 60 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.email || !emailRegex.test(user.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation (8-16 chars, uppercase, special char)
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    if (!user.password || !passwordRegex.test(user.password)) {
      newErrors.password = 
        "Password must be 8-16 characters with at least one uppercase letter and one special character";
    }

    // Address validation (max 400 chars)
    if (!user.address || user.address.length > 400) {
      newErrors.address = "Address cannot exceed 400 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:5000/auth/register", user);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed!";
      const serverErrors = error.response?.data?.errors || [];
      
      if (Array.isArray(serverErrors)) {
        const errObj = serverErrors.reduce((acc, err) => ({
          ...acc,
          server: [...(acc.server || []), err]
        }), {});
        setErrors(prev => ({ ...prev, ...errObj }));
      } else {
        setErrors(prev => ({ ...prev, server: errorMessage }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md">
        <form className="bg-white p-8 rounded-lg shadow-md" onSubmit={handleSignup}>
          <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

          {errors.server && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {Array.isArray(errors.server) 
                ? errors.server.map((err, index) => (
                    <div key={index}>{err}</div>
                  ))
                : errors.server}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`border rounded w-full p-3 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Full Name (20-60 characters)"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className={`border rounded w-full p-3 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Email Address"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className={`border rounded w-full p-3 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Password (8-16 characters)"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`border rounded w-full p-3 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Address (max 400 characters)"
              rows="3"
              value={user.address}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              className="border rounded w-full p-3 border-gray-300"
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
            >
              <option value="user">Normal User</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded w-full font-bold hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-500 hover:text-blue-600">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;