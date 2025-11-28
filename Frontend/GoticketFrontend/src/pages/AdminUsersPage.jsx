import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.BACKEND_URL}/api/admin/allUsers`);
      // filter only USER role (not MANAGER/ADMIN)
      setUsers(res.data.filter((u) => u.role === "USER"));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.BACKEND_URL}/api/admin/addUser`, newUser);
      setNewUser({ name: "", email: "", password: "" }); // reset form
      setShowAddModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${config.BACKEND_URL}/api/admin/delete/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    container: {
      padding: '0',
      background: 'transparent',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    controls: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      gap: '1rem',
      flexWrap: 'wrap'
    },
    searchContainer: {
      position: 'relative',
      flex: '1',
      maxWidth: '400px',
      minWidth: '300px'
    },
    searchInput: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 3rem',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      fontFamily: 'inherit'
    },
    searchIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '1.2rem',
      color: '#6b7280'
    },
    addButton: {
      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      color: 'white',
      border: 'none',
      padding: '0.75rem 2rem',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap'
    },
    statsCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    statCard: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(139, 92, 246, 0.1)',
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    statLabel: {
      fontSize: '0.9rem',
      color: '#6b7280',
      fontWeight: '500'
    },
    tableContainer: {
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(139, 92, 246, 0.1)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: '#f8fafc',
      padding: '1rem',
      textAlign: 'left',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#374151',
      borderBottom: '1px solid #e5e7eb'
    },
    tableRow: {
      borderBottom: '1px solid #f1f5f9',
      transition: 'background-color 0.2s ease'
    },
    tableCell: {
      padding: '1rem',
      fontSize: '0.9rem',
      color: '#374151'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '600',
      fontSize: '0.9rem'
    },
    userDetails: {
      display: 'flex',
      flexDirection: 'column'
    },
    userName: {
      fontWeight: '500',
      color: '#1f2937'
    },
    userEmail: {
      fontSize: '0.8rem',
      color: '#6b7280'
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '500',
      textAlign: 'center'
    },
    approvedBadge: {
      background: '#d1fae5',
      color: '#065f46'
    },
    pendingBadge: {
      background: '#fef3c7',
      color: '#92400e'
    },
    actionButton: {
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      fontSize: '0.8rem',
      fontWeight: '500',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s ease'
    },
    deleteButton: {
      background: '#fee2e2',
      color: '#dc2626'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '1.5rem'
    },
    formGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box'
    },
    modalButtons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      marginTop: '2rem'
    },
    cancelButton: {
      padding: '0.75rem 1.5rem',
      border: '2px solid #e5e7eb',
      background: 'white',
      color: '#374151',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer'
    },
    submitButton: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer'
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      fontSize: '1.1rem',
      color: '#6b7280'
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: '#6b7280'
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.6s ease-out; }
        
        .search-input:focus { border-color: #8b5cf6; }
        .input-focus:focus { border-color: #8b5cf6; }
        .table-row:hover { background-color: #f8fafc; }
        .add-button:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3); }
        .action-button:hover { transform: scale(1.05); }
        .delete-button:hover { background-color: #fecaca; }
        
        @media (max-width: 768px) {
          .controls-responsive { flex-direction: column; align-items: stretch; }
          .search-responsive { max-width: 100%; min-width: auto; margin-bottom: 1rem; }
          .stats-responsive { grid-template-columns: repeat(2, 1fr); }
          .table-responsive { font-size: 0.8rem; }
          .table-cell-responsive { padding: 0.5rem; }
        }
        
        @media (max-width: 480px) {
          .stats-responsive { grid-template-columns: 1fr; }
          .modal-responsive { width: 95%; padding: 1rem; }
        }
      `}</style>

      <div style={styles.container} className="fade-in">
        {/* Stats Cards */}
        <div style={styles.statsCards} className="stats-responsive">
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{users.length}</div>
            <div style={styles.statLabel}>Total Users</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{users.filter(u => u.approved).length}</div>
            <div style={styles.statLabel}>Approved Users</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{users.filter(u => !u.approved).length}</div>
            <div style={styles.statLabel}>Pending Approval</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{new Date().toLocaleDateString()}</div>
            <div style={styles.statLabel}>Last Updated</div>
          </div>
        </div>

        {/* Controls */}
        <div style={styles.controls} className="controls-responsive">
          <div style={styles.searchContainer} className="search-responsive">
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              className="search-input"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={styles.addButton}
            className="add-button"
          >
            <span>➕</span>
            Add New User
          </button>
        </div>

        {/* Users Table */}
        <div style={styles.tableContainer}>
          {loading ? (
            <div style={styles.loading}>
              <span>⏳ Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                No users found
              </div>
              <div>
                {searchTerm ? 'Try adjusting your search criteria' : 'No users have been added yet'}
              </div>
            </div>
          ) : (
            <table style={styles.table} className="table-responsive">
              <thead>
                <tr>
                  <th style={styles.tableHeader}>User</th>
                  <th style={styles.tableHeader}>ID</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} style={styles.tableRow} className="table-row">
                    <td style={styles.tableCell} className="table-cell-responsive">
                      <div style={styles.userInfo}>
                        <div style={styles.avatar}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={styles.userDetails}>
                          <div style={styles.userName}>{user.name}</div>
                          <div style={styles.userEmail}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.tableCell} className="table-cell-responsive">
                      <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        #{user.id}
                      </span>
                    </td>
                    <td style={styles.tableCell} className="table-cell-responsive">
                      <span style={{
                        ...styles.statusBadge,
                        ...(user.approved ? styles.approvedBadge : styles.pendingBadge)
                      }}>
                        {user.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td style={styles.tableCell} className="table-cell-responsive">
                      <button
                        onClick={() => deleteUser(user.id)}
                        style={{
                          ...styles.actionButton,
                          ...styles.deleteButton
                        }}
                        className="action-button delete-button"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent} className="modal-responsive">
              <h2 style={styles.modalTitle}>Add New User</h2>
              <form onSubmit={addUser}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter user's full name"
                    value={newUser.name}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    className="input-focus"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter user's email"
                    value={newUser.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    className="input-focus"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter secure password"
                    value={newUser.password}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    className="input-focus"
                  />
                </div>

                <div style={styles.modalButtons}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={styles.submitButton}
                  >
                    Add User
                  </button>
                  </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUsersPage;