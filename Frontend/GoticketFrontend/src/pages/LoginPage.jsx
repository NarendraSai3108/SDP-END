import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import config from "../config"; // Use your existing config
import "./LoginPage.css";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔹 Auto-redirect once user is set in context
  useEffect(() => {
    console.log("🔍 LoginPage - Current user:", user);
    console.log("🔍 LoginPage - User role:", user?.role);

    if (user?.role === "ADMIN") {
      console.log("🔄 Redirecting to admin dashboard");
      navigate("/admin");
    } else if (user?.role === "MANAGER") {
      console.log("🔄 Redirecting to manager dashboard");
      navigate("/manager");
    } else if (user) {
      console.log("🔄 Redirecting to user dashboard");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔄 Starting login process...");

      // 🔹 Use axios to directly call /api/auth/login on your backend
      const loginRes = await axios.post(
        `${config.BACKEND_URL}/api/auth/login`,
        credentials
      );

      // Store the token in localStorage, if returned
      if (loginRes.data?.token) {
        localStorage.setItem("token", loginRes.data.token);
      }

      // 🔹 Fetch user by email and store in localStorage
      console.log("🔄 Fetching user data by email:", credentials.email);

      const userRes = await axios.get(
        `${config.BACKEND_URL}/api/users/by-email`,
        {
          params: { email: credentials.email },
          headers: {
            Authorization: loginRes.data?.token
              ? `Bearer ${loginRes.data.token}`
              : undefined,
          },
        }
      );

      console.log("✅ User data received:", userRes.data);
      console.log("✅ User role:", userRes.data.role);

      // Store complete user data in localStorage
      localStorage.setItem("user", JSON.stringify(userRes.data));
      localStorage.setItem("userId", userRes.data.id.toString());
      localStorage.setItem("userRole", userRes.data.role);

      // Navigation happens in useEffect once user is updated
      window.location.reload(); // Optionally reload to update AuthContext
    } catch (err) {
      console.error("❌ Login error:", err);

      if (err.response?.status === 404) {
        setError("User not found. Please check your email.");
      } else if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... (UI code is unchanged) ...
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #7c3aed 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(139, 92, 246, 0.15)',
        padding: '40px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white',
            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
          }}>
            👤
          </div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#333',
            margin: '0 0 10px 0'
          }}>
            Welcome Back
          </h2>
          <p style={{
            color: '#666',
            margin: '0',
            fontSize: '16px'
          }}>
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={credentials.email}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              placeholder="you@example.com"
              required
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={credentials.password}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              placeholder="••••••••"
              required
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              transform: loading ? 'none' : 'scale(1)',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 20px rgba(139, 92, 246, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? '🔄 Signing In...' : '🚀 Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{
              color: '#8b5cf6',
              textDecoration: 'none',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;