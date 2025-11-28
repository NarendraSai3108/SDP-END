import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

const UserProfilePage = () => {
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    lastLogin: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  
  // Get userId from the user object in localStorage
  const getUserId = () => {
    const userStr = localStorage.getItem("user");
    const userIdStr = localStorage.getItem("userId");
    
    if (userIdStr) {
      return userIdStr;
    } else if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        return userObj.id?.toString();
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        return null;
      }
    }
    return null;
  };

  const userId = getUserId();

  useEffect(() => {
    // Debug logging for localStorage
    console.log("🔍 Debug - All localStorage items:");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`${key}: ${value}`);
    }
    
    const userObj = localStorage.getItem("user");
    console.log("🔍 Debug - User object:", userObj);
    console.log("🔍 Debug - Extracted userId:", userId);

    // Check if userId exists and is valid
    if (!userId || userId === 'null' || userId === 'undefined') {
      console.error("❌ No valid userId found!");
      setMessage("Please log in again. User session not found.");
      setLoading(false);
      return;
    }

    console.log("✅ Found valid userId:", userId);
    fetchUserProfile();
    // eslint-disable-next-line
  }, []);

  const fetchUserProfile = async () => {
    if (!userId || userId === 'null' || userId === 'undefined') {
      setMessage("Please log in again. User session not found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("🔄 Fetching profile for userId:", userId);
      console.log("🔄 API URL:", `${config.BACKEND_URL}/api/users/${userId}`);
      
      const res = await axios.get(`${config.BACKEND_URL}/api/users/${userId}`);
      
      console.log("✅ Profile data received:", res.data);
      
      setUser({
        id: res.data.id,
        username: res.data.name, // Backend sends 'name', frontend uses 'username'
        email: res.data.email,
        password: "",
        lastLogin: res.data.lastLogin
      });
      setMessage(""); // Clear any error messages
    } catch (error) {
      console.error("❌ Fetch profile error:", error);
      if (error.response?.status === 404) {
        setMessage("User not found. Please log in again.");
      } else if (error.response?.status === 400) {
        setMessage("Invalid user ID. Please log in again.");
      } else {
        setMessage("Failed to fetch profile. Please try again or log in again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    if (!userId || userId === 'null' || userId === 'undefined') {
      setMessage("Session expired. Please log in again.");
      setSaving(false);
      return;
    }

    try {
      // Send data in the format backend expects
      const payload = {
        name: user.username, // Frontend 'username' maps to backend 'name'
        email: user.email,   // Include current email (backend expects it)
        password: user.password || "" // Send empty string if no password provided
      };

      console.log("🔄 Sending update request:", payload);
      console.log("🔄 Update API URL:", `${config.BACKEND_URL}/api/users/${user.id}`);
      
      const response = await axios.put(`${config.BACKEND_URL}/api/users/${user.id}`, payload);
      
      console.log("✅ Update response:", response.data);
      
      setEditMode(false);
      setMessage("Profile updated successfully!");
      fetchUserProfile();
    } catch (error) {
      console.error("❌ Update error:", error);
      if (error.response?.data?.error) {
        setMessage(`Failed to update profile: ${error.response.data.error}`);
      } else {
        setMessage("Failed to update profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleGoToLogin = () => {
    // Clear any existing session data
    localStorage.clear();
    navigate("/login");
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Segoe UI, Roboto, sans-serif",
      padding: "2rem"
    },
    card: {
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "24px",
      boxShadow: "0 8px 40px rgba(139, 92, 246, 0.25)",
      padding: "3rem 2.8rem",
      maxWidth: "480px",
      width: "100%",
      backdropFilter: "blur(15px)",
      textAlign: "center",
      border: "1px solid rgba(255, 255, 255, 0.3)"
    },
    header: {
      marginBottom: "2rem"
    },
    avatar: {
      width: "85px",
      height: "85px",
      background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
      borderRadius: "50%",
      fontSize: "2.8rem",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1.5rem auto",
      fontWeight: "700",
      boxShadow: "0 4px 20px rgba(139, 92, 246, 0.4)",
      border: "3px solid rgba(255, 255, 255, 0.9)"
    },
    name: {
      fontSize: "1.7rem",
      fontWeight: "700",
      color: "#7c3aed",
      marginBottom: "0.5rem"
    },
    email: {
      fontSize: "1.1rem",
      color: "#8b5cf6",
      marginBottom: "1.5rem",
      opacity: 0.9
    },
    info: {
      fontSize: "1rem",
      color: "#6b7280",
      marginBottom: "2rem",
      padding: "1.2rem",
      background: "rgba(139, 92, 246, 0.08)",
      borderRadius: "14px",
      border: "1px solid rgba(139, 92, 246, 0.15)"
    },
    formSection: {
      textAlign: "left"
    },
    label: {
      display: "block",
      textAlign: "left",
      fontSize: "1rem",
      color: "#7c3aed",
      fontWeight: "600",
      marginBottom: "0.6rem"
    },
    input: {
      width: "100%",
      padding: "1rem 1.2rem",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "1rem",
      marginBottom: "1.8rem",
      fontFamily: "inherit",
      background: "rgba(255, 255, 255, 0.9)",
      transition: "all 0.3s",
      boxSizing: "border-box"
    },
    inputDisabled: {
      width: "100%",
      padding: "1rem 1.2rem",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "1rem",
      marginBottom: "1.8rem",
      fontFamily: "inherit",
      background: "#f3f4f6",
      color: "#9ca3af",
      boxSizing: "border-box"
    },
    btnRow: {
      display: "flex",
      justifyContent: "center",
      gap: "1.2rem",
      marginTop: "2.5rem",
      flexWrap: "wrap"
    },
    editBtn: {
      background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
      color: "white",
      border: "none",
      padding: "1rem 2.5rem",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
      transition: "all 0.3s",
      minWidth: "140px"
    },
    cancelBtn: {
      background: "rgba(139, 92, 246, 0.1)",
      color: "#7c3aed",
      border: "2px solid rgba(139, 92, 246, 0.25)",
      padding: "1rem 2.5rem",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "all 0.3s",
      minWidth: "140px"
    },
    saveBtn: {
      background: "linear-gradient(135deg, #10b981, #059669)",
      color: "white",
      border: "none",
      padding: "1rem 2.5rem",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "all 0.3s",
      minWidth: "140px",
      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
    },
    loginBtn: {
      background: "linear-gradient(135deg, #f59e0b, #d97706)",
      color: "white",
      border: "none",
      padding: "1rem 2rem",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)",
      transition: "all 0.3s",
      marginTop: "1rem"
    },
    message: {
      marginTop: "2rem",
      color: "#10b981",
      fontWeight: "600",
      padding: "1rem",
      background: "rgba(16, 185, 129, 0.1)",
      borderRadius: "10px",
      border: "1px solid rgba(16, 185, 129, 0.3)"
    },
    error: {
      marginTop: "2rem",
      color: "#dc2626",
      fontWeight: "600",
      padding: "1rem",
      background: "rgba(220, 38, 38, 0.1)",
      borderRadius: "10px",
      border: "1px solid rgba(220, 38, 38, 0.3)"
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem"
    },
    loadingSpinner: {
      width: "40px",
      height: "40px",
      border: "4px solid rgba(139, 92, 246, 0.2)",
      borderTop: "4px solid #8b5cf6",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    },
    loadingText: {
      color: "#7c3aed",
      fontSize: "1.2rem",
      fontWeight: "600"
    },
    warningContainer: {
      textAlign: "center"
    },
    warningIcon: {
      fontSize: "4rem",
      marginBottom: "1rem"
    },
    warningTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#dc2626",
      marginBottom: "1rem"
    },
    warningText: {
      fontSize: "1.1rem",
      color: "#6b7280",
      marginBottom: "2rem",
      lineHeight: "1.6"
    }
  };

  // Add CSS animation for loading spinner
  const spinnerKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // Inject keyframes into document head
  if (loading && !document.querySelector('#spinner-keyframes')) {
    const style = document.createElement('style');
    style.id = 'spinner-keyframes';
    style.textContent = spinnerKeyframes;
    document.head.appendChild(style);
  }

  // Enhanced input handlers with focus effects
  const handleInputFocus = (e) => {
    e.target.style.borderColor = "#8b5cf6";
    e.target.style.boxShadow = "0 0 0 4px rgba(139, 92, 246, 0.12)";
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = "#e5e7eb";
    e.target.style.boxShadow = "none";
  };

  // Button hover effects
  const handleButtonHover = (e, isHover, buttonType) => {
    if (isHover) {
      e.target.style.transform = "translateY(-2px) scale(1.02)";
      if (buttonType === 'edit' || buttonType === 'login') {
        e.target.style.boxShadow = "0 6px 20px rgba(139, 92, 246, 0.5)";
      } else if (buttonType === 'save') {
        e.target.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.5)";
      } else if (buttonType === 'cancel') {
        e.target.style.background = "rgba(139, 92, 246, 0.15)";
      }
    } else {
      e.target.style.transform = "translateY(0) scale(1)";
      if (buttonType === 'edit' || buttonType === 'login') {
        e.target.style.boxShadow = "0 4px 15px rgba(139, 92, 246, 0.4)";
      } else if (buttonType === 'save') {
        e.target.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.4)";
      } else if (buttonType === 'cancel') {
        e.target.style.background = "rgba(139, 92, 246, 0.1)";
      }
    }
  };

  // Show login prompt if no valid userId
  if (!userId || userId === 'null' || userId === 'undefined') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.warningContainer}>
            <div style={styles.warningIcon}>⚠️</div>
            <div style={styles.warningTitle}>Session Not Found</div>
            <div style={styles.warningText}>
              Please log in to view your profile. Your session may have expired or you haven't logged in yet.
            </div>
            <button 
              style={styles.loginBtn} 
              onClick={handleGoToLogin}
              onMouseEnter={(e) => handleButtonHover(e, true, 'login')}
              onMouseLeave={(e) => handleButtonHover(e, false, 'login')}
            >
              🔑 Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <div style={styles.loadingText}>Loading your profile...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.avatar}>
            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
        
        {!editMode ? (
          <>
            <div style={styles.name}>{user.username || "User"}</div>
            <div style={styles.email}>{user.email}</div>
            <div style={styles.info}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.2rem" }}>🕒</span>
                <span><b>Last Login:</b> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}</span>
              </div>
            </div>
            <div style={styles.btnRow}>
              <button 
                style={styles.editBtn} 
                onClick={() => setEditMode(true)}
                onMouseEnter={(e) => handleButtonHover(e, true, 'edit')}
                onMouseLeave={(e) => handleButtonHover(e, false, 'edit')}
              >
                ✏️ Edit Profile
              </button>
            </div>
            {message && <div style={message.includes("success") ? styles.message : styles.error}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <span>{message.includes("success") ? "✅" : "❌"}</span>
                <span>{message}</span>
              </div>
            </div>}
          </>
        ) : (
          <div style={styles.formSection}>
            <form onSubmit={handleSave}>
              <div>
                <label style={styles.label}>👤 Username</label>
                <input
                  style={styles.input}
                  name="username"
                  type="text"
                  value={user.username}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                  placeholder="Enter your username"
                />
              </div>
              
              <div>
                <label style={styles.label}>📧 Email</label>
                <input
                  style={styles.inputDisabled}
                  name="email"
                  type="email"
                  value={user.email}
                  disabled
                  placeholder="Email cannot be changed"
                />
              </div>
              
              <div>
                <label style={styles.label}>🔐 New Password</label>
                <input
                  style={styles.input}
                  name="password"
                  type="password"
                  value={user.password}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Enter new password (optional)"
                />
              </div>
              
              <div style={styles.btnRow}>
                <button
                  style={styles.saveBtn}
                  type="submit"
                  disabled={saving}
                  onMouseEnter={(e) => !saving && handleButtonHover(e, true, 'save')}
                  onMouseLeave={(e) => !saving && handleButtonHover(e, false, 'save')}
                >
                  {saving ? "💾 Saving..." : "💾 Save Changes"}
                </button>
                <button
                  style={styles.cancelBtn}
                  type="button"
                  onClick={() => { setEditMode(false); setMessage(""); fetchUserProfile(); }}
                  disabled={saving}
                  onMouseEnter={(e) => !saving && handleButtonHover(e, true, 'cancel')}
                  onMouseLeave={(e) => !saving && handleButtonHover(e, false, 'cancel')}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
            
            {message && (
              <div style={message.includes("success") ? styles.message : styles.error}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <span>{message.includes("success") ? "✅" : "❌"}</span>
                  <span>{message}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;