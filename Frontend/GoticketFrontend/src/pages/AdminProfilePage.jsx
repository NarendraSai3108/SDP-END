import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";

const AdminProfilePage = () => {
  const [admin, setAdmin] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalAdmin, setOriginalAdmin] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.BACKEND_URL}/api/admin/profile/${user.id}`);
      setAdmin(res.data);
      setOriginalAdmin(res.data);
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    if (!admin.name || !admin.email) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);
      await axios.put(`${config.BACKEND_URL}/api/admin/profile/${user.id}`, {
        name: admin.name,
        email: admin.email
      });
      
      // Update localStorage user data
      const updatedUser = { ...user, name: admin.name, email: admin.email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setOriginalAdmin(admin);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      setSaving(true);
      await axios.put(`${config.BACKEND_URL}/api/admin/change-password/${user.id}`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowChangePassword(false);
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Error changing password. Please check your current password and try again.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setAdmin(originalAdmin);
    setIsEditing(false);
  };

  const styles = {
    container: {
      padding: '0',
      background: 'transparent',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    profileCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '2.5rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(139, 92, 246, 0.1)',
      maxWidth: '600px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2.5rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    subtitle: {
      fontSize: '1rem',
      color: '#6b7280'
    },
    profileSection: {
      marginBottom: '2rem'
    },
    avatarContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '2rem'
    },
    avatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '2.5rem',
      fontWeight: '700',
      boxShadow: '0 8px 25px rgba(6, 182, 212, 0.3)'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      boxSizing: 'border-box'
    },
    inputReadOnly: {
      backgroundColor: '#f9fafb',
      cursor: 'not-allowed'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '2rem'
    },
    button: {
      padding: '0.875rem 2rem',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      minWidth: '140px',
      justifyContent: 'center'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
    },
    secondaryButton: {
      background: 'white',
      color: '#374151',
      border: '2px solid #e5e7eb'
    },
    dangerButton: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
    },
    successButton: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
    },
    infoCard: {
      background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
      border: '1px solid #93c5fd',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '2rem'
    },
    infoTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    infoText: {
      fontSize: '0.9rem',
      color: '#1e40af',
      lineHeight: '1.5'
    },
    passwordSection: {
      background: '#f8fafc',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      padding: '2rem',
      marginTop: '2rem'
    },
    passwordTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '4rem',
      fontSize: '1.2rem',
      color: '#6b7280'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    statCard: {
      background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
      padding: '1.5rem',
      borderRadius: '12px',
      textAlign: 'center',
      border: '1px solid #bae6fd'
    },
    statNumber: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#0369a1',
      marginBottom: '0.25rem'
    },
    statLabel: {
      fontSize: '0.8rem',
      color: '#0369a1',
      fontWeight: '500'
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <span>⏳ Loading profile...</span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.6s ease-out; }
        
        .input-focus:focus { 
          border-color: #06b6d4; 
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1); 
        }
        
        .button-hover:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); 
        }
        
        .primary-button:hover { 
          box-shadow: 0 8px 30px rgba(6, 182, 212, 0.4); 
        }
        
        .secondary-button:hover { 
          background: #f9fafb; 
          border-color: #06b6d4; 
        }
        
        .danger-button:hover { 
          box-shadow: 0 8px 30px rgba(239, 68, 68, 0.4); 
        }
        
        .success-button:hover { 
          box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4); 
        }
        
        @media (max-width: 768px) {
          .profile-card-responsive { 
            margin: 1rem; 
            padding: 2rem 1.5rem; 
          }
          .button-group-responsive { 
            flex-direction: column; 
          }
          .stats-responsive { 
            grid-template-columns: repeat(2, 1fr); 
          }
        }
        
        @media (max-width: 480px) {
          .stats-responsive { 
            grid-template-columns: 1fr; 
          }
        }
      `}</style>

      <div style={styles.container} className="fade-in">
        <div style={styles.profileCard} className="profile-card-responsive">
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>My Profile</h1>
            <p style={styles.subtitle}>Manage your account information and security settings</p>
          </div>

          {/* Avatar */}
          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>
              {admin.name ? admin.name.charAt(0).toUpperCase() : '👤'}
            </div>
          </div>

          {/* Stats Cards */}
          <div style={styles.statsGrid} className="stats-responsive">
            <div style={styles.statCard}>
              <div style={styles.statNumber}>#{user.id}</div>
              <div style={styles.statLabel}>Admin ID</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{admin.role || 'ADMIN'}</div>
              <div style={styles.statLabel}>Role</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{new Date().toLocaleDateString()}</div>
              <div style={styles.statLabel}>Last Login</div>
            </div>
          </div>

          {/* Info Card */}
          <div style={styles.infoCard}>
            <div style={styles.infoTitle}>
              <span>ℹ️</span>
              Account Information
            </div>
            <div style={styles.infoText}>
              You can update your name and email address. For security reasons, please use the password change section below to update your password.
            </div>
          </div>

          {/* Profile Form */}
          <div style={styles.profileSection}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={admin.name || ""}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={{
                  ...styles.input,
                  ...(isEditing ? {} : styles.inputReadOnly)
                }}
                className="input-focus"
                readOnly={!isEditing}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address *</label>
              <input
                type="email"
                name="email"
                value={admin.email || ""}
                onChange={handleChange}
                placeholder="Enter your email address"
                style={{
                  ...styles.input,
                  ...(isEditing ? {} : styles.inputReadOnly)
                }}
                className="input-focus"
                readOnly={!isEditing}
              />
            </div>

            {/* Action Buttons */}
            <div style={styles.buttonGroup} className="button-group-responsive">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      ...styles.button,
                      ...styles.primaryButton
                    }}
                    className="button-hover primary-button"
                  >
                    <span>✏️</span>
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowChangePassword(!showChangePassword)}
                    style={{
                      ...styles.button,
                      ...styles.secondaryButton
                    }}
                    className="button-hover secondary-button"
                  >
                    <span>🔐</span>
                    Change Password
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={updateProfile}
                    disabled={saving}
                    style={{
                      ...styles.button,
                      ...styles.successButton,
                      opacity: saving ? 0.7 : 1
                    }}
                    className="button-hover success-button"
                  >
                    <span>{saving ? '⏳' : '💾'}</span>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={saving}
                    style={{
                      ...styles.button,
                      ...styles.secondaryButton
                    }}
                    className="button-hover secondary-button"
                  >
                    <span>❌</span>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Password Change Section */}
          {showChangePassword && (
            <div style={styles.passwordSection}>
              <h3 style={styles.passwordTitle}>
                <span>🔒</span>
                Change Password
              </h3>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Current Password *</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  style={styles.input}
                  className="input-focus"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>New Password *</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password (min 6 characters)"
                  style={styles.input}
                  className="input-focus"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm New Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  style={styles.input}
                  className="input-focus"
                />
              </div>

              <div style={styles.buttonGroup}>
                <button
                  onClick={changePassword}
                  disabled={saving}
                  style={{
                    ...styles.button,
                    ...styles.dangerButton,
                    opacity: saving ? 0.7 : 1
                  }}
                  className="button-hover danger-button"
                >
                  <span>{saving ? '⏳' : '🔐'}</span>
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  disabled={saving}
                  style={{
                    ...styles.button,
                    ...styles.secondaryButton
                  }}
                  className="button-hover secondary-button"
                >
                  <span>❌</span>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminProfilePage;