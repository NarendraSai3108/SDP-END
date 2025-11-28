import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

const ManagerProfilePage = () => {
  const [manager, setManager] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    lastLogin: "",
    role: "MANAGER"
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchManagerProfile();
    // eslint-disable-next-line
  }, []);

  // Updated getManagerId function (same as ManagerDashboard)
  const getManagerId = () => {
    const userStr = localStorage.getItem("user");
    const userIdStr = localStorage.getItem("userId");
    
    console.log("🔍 Manager Profile - userStr from localStorage:", userStr);
    console.log("🔍 Manager Profile - userIdStr from localStorage:", userIdStr);
    
    if (userIdStr) {
      return userIdStr;
    } else if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        console.log("🔍 Manager Profile - parsed userObj:", userObj);
        return userObj.id?.toString();
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        return null;
      }
    }
    return null;
  };

  const fetchManagerProfile = async () => {
    try {
      const managerId = getManagerId();
      console.log("🔄 Fetching manager profile for managerId:", managerId);
      
      if (!managerId) {
        console.log("❌ No managerId found, redirecting to login");
        setMessage("Session expired. Please log in again.");
        setLoading(false);
        return;
      }
      
      const res = await axios.get(`${config.BACKEND_URL}/api/users/${managerId}`);
      console.log("✅ Manager profile data received:", res.data);
      
      setManager({
        id: res.data.id,
        username: res.data.name, // Backend sends 'name', frontend uses 'username'
        email: res.data.email,
        password: "", // Always empty for security
        lastLogin: res.data.lastLogin,
        role: res.data.role
      });
      setMessage(""); // Clear any error messages
    } catch (error) {
      console.error("❌ Error fetching manager profile:", error);
      if (error.response?.status === 404) {
        setMessage("Manager profile not found. Please log in again.");
      } else if (error.response?.status === 400) {
        setMessage("Invalid session. Please log in again.");
      } else {
        setMessage("Failed to fetch profile. Please try again or log in again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setManager({ ...manager, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const managerId = getManagerId();
    if (!managerId) {
      setMessage("Session expired. Please log in again.");
      setSaving(false);
      return;
    }

    try {
      // Send data in the format backend expects
      const payload = {
        name: manager.username, // Frontend 'username' maps to backend 'name'
        email: manager.email,   // Include current email (backend expects it)
        password: manager.password || "" // Send empty string if no password provided
      };

      console.log("🔄 Sending manager profile update request:", payload);
      console.log("🔄 Update API URL:", `${config.BACKEND_URL}/api/users/${manager.id}`);
      
      const response = await axios.put(`${config.BACKEND_URL}/api/users/${manager.id}`, payload);
      
      console.log("✅ Manager profile update response:", response.data);
      
      setEditMode(false);
      setMessage("Profile updated successfully!");
      
      // Update localStorage with new data
      const updatedUser = { ...JSON.parse(localStorage.getItem("user") || "{}"), name: manager.username };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Refresh profile data
      await fetchManagerProfile();
      
    } catch (error) {
      console.error("❌ Manager profile update error:", error);
      if (error.response?.data?.error) {
        setMessage(`Failed to update profile: ${error.response.data.error}`);
      } else {
        setMessage("Failed to update profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/manager");
  };

  const styles = {
    container: { 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #0891b2 0%, #0284c7 50%, #0369a1 100%)",
      padding: "0",
      fontFamily: "Segoe UI, Roboto, sans-serif"
    },
    topBar: {
      background: "rgba(8, 145, 178, 0.95)",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backdropFilter: "blur(15px)",
      boxShadow: "0 4px 20px rgba(8, 145, 178, 0.3)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      position: "sticky",
      top: 0,
      zIndex: 1000
    },
    brandSection: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem"
    },
    brandIcon: {
      width: "40px",
      height: "40px",
      background: "linear-gradient(135deg, #f59e0b, #d97706)",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.4rem",
      fontWeight: "bold",
      color: "white",
      boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)"
    },
    brandText: {
      color: "white",
      fontSize: "1.7rem",
      fontWeight: "700",
      margin: 0,
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
    },
    brandSubtext: {
      color: "rgba(255, 255, 255, 0.85)",
      fontSize: "0.9rem",
      margin: 0,
      fontWeight: "500"
    },
    backBtn: {
      background: "rgba(255, 255, 255, 0.15)",
      color: "white",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      padding: "0.7rem 1.3rem",
      borderRadius: "10px",
      fontSize: "0.9rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      backdropFilter: "blur(5px)",
      boxShadow: "0 2px 8px rgba(255, 255, 255, 0.1)"
    },
    mainContent: {
      padding: "2rem",
      display: "flex",
      justifyContent: "center"
    },
    profileCard: {
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "24px",
      boxShadow: "0 8px 40px rgba(8, 145, 178, 0.25)",
      padding: "3rem 2.8rem",
      maxWidth: "600px",
      width: "100%",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(255, 255, 255, 0.3)"
    },
    header: {
      marginBottom: "2.5rem",
      textAlign: "center"
    },
    avatar: {
      width: "100px",
      height: "100px",
      background: "linear-gradient(135deg, #0891b2, #0284c7)",
      borderRadius: "50%",
      fontSize: "3rem",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1.5rem auto",
      fontWeight: "700",
      boxShadow: "0 6px 24px rgba(8, 145, 178, 0.4)",
      border: "4px solid rgba(255, 255, 255, 0.9)"
    },
    title: {
      fontSize: "2rem",
      fontWeight: "800",
      color: "#0891b2",
      marginBottom: "0.5rem"
    },
    subtitle: {
      fontSize: "1.1rem",
      color: "#6b7280",
      marginBottom: "1.5rem",
      opacity: 0.9
    },
    roleTag: {
      display: "inline-block",
      background: "rgba(8, 145, 178, 0.1)",
      color: "#0891b2",
      padding: "0.5rem 1.2rem",
      borderRadius: "20px",
      fontSize: "0.9rem",
      fontWeight: "600",
      border: "1px solid rgba(8, 145, 178, 0.2)"
    },
    formSection: {
      textAlign: "left"
    },
    label: {
      display: "block",
      textAlign: "left",
      fontSize: "1rem",
      color: "#0891b2",
      fontWeight: "700",
      marginBottom: "0.6rem"
    },
    input: {
      width: "100%",
      padding: "1.2rem 1.4rem",
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
      padding: "1.2rem 1.4rem",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "1rem",
      marginBottom: "1.8rem",
      fontFamily: "inherit",
      background: "#f3f4f6",
      color: "#9ca3af",
      boxSizing: "border-box"
    },
    infoDisplay: {
      width: "100%",
      padding: "1.2rem 1.4rem",
      background: "#f8fafc",
      borderRadius: "12px",
      fontSize: "1.1rem",
      marginBottom: "1.8rem",
      color: "#374151",
      fontWeight: "500",
      border: "2px solid #e5e7eb"
    },
    btnRow: {
      display: "flex",
      justifyContent: "center",
      gap: "1.2rem",
      marginTop: "2.5rem",
      flexWrap: "wrap"
    },
    editBtn: {
      background: "linear-gradient(135deg, #0891b2, #0284c7)",
      color: "white",
      border: "none",
      padding: "1.2rem 2.5rem",
      borderRadius: "12px",
      fontWeight: "700",
      fontSize: "1rem",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(8, 145, 178, 0.4)",
      transition: "all 0.3s",
      minWidth: "160px"
    },
    saveBtn: {
      background: "linear-gradient(135deg, #10b981, #059669)",
      color: "white",
      border: "none",
      padding: "1.2rem 2.5rem",
      borderRadius: "12px",
      fontWeight: "700",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "all 0.3s",
      minWidth: "160px",
      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
    },
    cancelBtn: {
      background: "rgba(8, 145, 178, 0.1)",
      color: "#0891b2",
      border: "2px solid rgba(8, 145, 178, 0.25)",
      padding: "1.2rem 2.5rem",
      borderRadius: "12px",
      fontWeight: "700",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "all 0.3s",
      minWidth: "160px"
    },
    message: {
      marginTop: "2rem",
      color: "#10b981",
      fontWeight: "700",
      padding: "1.2rem",
      background: "rgba(16, 185, 129, 0.1)",
      borderRadius: "12px",
      border: "1px solid rgba(16, 185, 129, 0.3)",
      textAlign: "center"
    },
    error: {
      marginTop: "2rem",
      color: "#dc2626",
      fontWeight: "700",
      padding: "1.2rem",
      background: "rgba(220, 38, 38, 0.1)",
      borderRadius: "12px",
      border: "1px solid rgba(220, 38, 38, 0.3)",
      textAlign: "center"
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1.5rem",
      padding: "4rem"
    },
    loadingSpinner: {
      width: "50px",
      height: "50px",
      border: "5px solid rgba(8, 145, 178, 0.2)",
      borderTop: "5px solid #0891b2",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    },
    loadingText: {
      color: "#0891b2",
      fontSize: "1.3rem",
      fontWeight: "700"
    },
    warningContainer: {
      textAlign: "center",
      padding: "3rem"
    },
    warningIcon: {
      fontSize: "4rem",
      marginBottom: "1.5rem"
    },
    warningTitle: {
      fontSize: "1.8rem",
      fontWeight: "800",
      color: "#dc2626",
      marginBottom: "1rem"
    },
    warningText: {
      fontSize: "1.2rem",
      color: "#6b7280",
      marginBottom: "2rem",
      lineHeight: "1.6"
    },
    loginBtn: {
      background: "linear-gradient(135deg, #f59e0b, #d97706)",
      color: "white",
      border: "none",
      padding: "1rem 2rem",
      borderRadius: "12px",
      fontWeight: "700",
      fontSize: "1rem",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)",
      transition: "all 0.3s"
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
  if (loading && !document.querySelector('#profile-spinner-keyframes')) {
    const style = document.createElement('style');
    style.id = 'profile-spinner-keyframes';
    style.textContent = spinnerKeyframes;
    document.head.appendChild(style);
  }

  // Enhanced input handlers with focus effects
  const handleInputFocus = (e) => {
    e.target.style.borderColor = "#0891b2";
    e.target.style.boxShadow = "0 0 0 4px rgba(8, 145, 178, 0.12)";
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = "#e5e7eb";
    e.target.style.boxShadow = "none";
  };

  // Button hover effects
  const handleButtonHover = (e, isHover, buttonType) => {
    if (isHover) {
      e.target.style.transform = "translateY(-2px) scale(1.02)";
      if (buttonType === 'edit') {
        e.target.style.boxShadow = "0 6px 20px rgba(8, 145, 178, 0.5)";
      } else if (buttonType === 'save') {
        e.target.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.5)";
      } else if (buttonType === 'cancel') {
        e.target.style.background = "rgba(8, 145, 178, 0.15)";
      } else if (buttonType === 'back') {
        e.target.style.background = "rgba(255, 255, 255, 0.25)";
        e.target.style.boxShadow = "0 4px 12px rgba(255, 255, 255, 0.2)";
      } else if (buttonType === 'login') {
        e.target.style.boxShadow = "0 6px 20px rgba(245, 158, 11, 0.5)";
      }
    } else {
      e.target.style.transform = "translateY(0) scale(1)";
      if (buttonType === 'edit') {
        e.target.style.boxShadow = "0 4px 15px rgba(8, 145, 178, 0.4)";
      } else if (buttonType === 'save') {
        e.target.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.4)";
      } else if (buttonType === 'cancel') {
        e.target.style.background = "rgba(8, 145, 178, 0.1)";
      } else if (buttonType === 'back') {
        e.target.style.background = "rgba(255, 255, 255, 0.15)";
        e.target.style.boxShadow = "0 2px 8px rgba(255, 255, 255, 0.1)";
      } else if (buttonType === 'login') {
        e.target.style.boxShadow = "0 4px 15px rgba(245, 158, 11, 0.4)";
      }
    }
  };

  // Show session expired prompt if no valid managerId
  if (!getManagerId()) {
    return (
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div style={styles.brandSection}>
            <div style={styles.brandIcon}>🎫</div>
            <div>
              <div style={styles.brandText}>Go Ticket</div>
              <div style={styles.brandSubtext}>Manager Panel</div>
            </div>
          </div>
        </div>
        
        <div style={styles.mainContent}>
          <div style={styles.profileCard}>
            <div style={styles.warningContainer}>
              <div style={styles.warningIcon}>⚠️</div>
              <div style={styles.warningTitle}>Session Expired</div>
              <div style={styles.warningText}>
                Your manager session has expired or is invalid. Please log in again to access your profile.
              </div>
              <button 
                style={styles.loginBtn} 
                onClick={() => navigate("/login")}
                onMouseEnter={(e) => handleButtonHover(e, true, 'login')}
                onMouseLeave={(e) => handleButtonHover(e, false, 'login')}
              >
                🔑 Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Top Navigation Bar */}
      <div style={styles.topBar}>
        <div style={styles.brandSection}>
          <div style={styles.brandIcon}>🎫</div>
          <div>
            <div style={styles.brandText}>Go Ticket</div>
            <div style={styles.brandSubtext}>Manager Panel</div>
          </div>
        </div>
        
        <button 
          style={styles.backBtn}
          onClick={handleBackToDashboard}
          onMouseEnter={(e) => handleButtonHover(e, true, 'back')}
          onMouseLeave={(e) => handleButtonHover(e, false, 'back')}
        >
          <span>← Back to Dashboard</span>
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.profileCard}>
          {/* Show loading state */}
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
              <div style={styles.loadingText}>Loading manager profile...</div>
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <div style={styles.header}>
                <div style={styles.avatar}>
                  {manager.username ? manager.username.charAt(0).toUpperCase() : "M"}
                </div>
                <div style={styles.title}>Manager Profile</div>
                <div style={styles.subtitle}>
                  {editMode ? "Update your profile information" : "Your manager profile information"}
                </div>
                <div style={styles.roleTag}>Event Manager</div>
              </div>
              
              {/* Profile Form */}
              {!editMode ? (
                /* View Mode */
                <div style={styles.formSection}>
                  <div>
                    <label style={styles.label}>👤 Manager Name</label>
                    <div style={styles.infoDisplay}>
                      {manager.username || "Manager"}
                    </div>
                  </div>
                  
                  <div>
                    <label style={styles.label}>📧 Email Address</label>
                    <div style={styles.infoDisplay}>
                      {manager.email || "No email provided"}
                    </div>
                  </div>
                  
                  <div>
                    <label style={styles.label}>👔 Role</label>
                    <div style={styles.infoDisplay}>
                      Event Manager
                    </div>
                  </div>

                  <div>
                    <label style={styles.label}>🕒 Last Login</label>
                    <div style={styles.infoDisplay}>
                      {manager.lastLogin ? new Date(manager.lastLogin).toLocaleString() : "Never"}
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
                </div>
              ) : (
                /* Edit Mode */
                <div style={styles.formSection}>
                  <form onSubmit={handleSave}>
                    <div>
                      <label style={styles.label}>👤 Manager Name</label>
                      <input
                        style={styles.input}
                        name="username"
                        type="text"
                        value={manager.username}
                        onChange={handleChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        required
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <div>
                      <label style={styles.label}>📧 Email Address</label>
                      <input
                        style={styles.inputDisabled}
                        name="email"
                        type="email"
                        value={manager.email}
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
                        value={manager.password}
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
                        onClick={() => { setEditMode(false); setMessage(""); fetchManagerProfile(); }}
                        disabled={saving}
                        onMouseEnter={(e) => !saving && handleButtonHover(e, true, 'cancel')}
                        onMouseLeave={(e) => !saving && handleButtonHover(e, false, 'cancel')}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Messages */}
              {message && (
                <div style={message.includes("success") ? styles.message : styles.error}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <span>{message.includes("success") ? "✅" : "❌"}</span>
                    <span>{message}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerProfilePage;