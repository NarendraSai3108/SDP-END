import React, { useState } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminNavBar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Check if we're on the main admin page (to show dashboard content)
  const isMainAdminPage = location.pathname === '/admin';

  // Mock data for dashboard (only used on main admin page)
  const dashboardData = {
    stats: {
      totalUsers: 1245,
      totalManagers: 45,
      totalEvents: 234,
      totalRevenue: 2456789,
      todayBookings: 89,
      activeEvents: 12
    },
    recentUsers: [
      { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', joinDate: '2024-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending', joinDate: '2024-01-14' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'Active', joinDate: '2024-01-13' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', status: 'Inactive', joinDate: '2024-01-12' }
    ],
    recentEvents: [
      { id: 1, name: 'Summer Concert 2024', venue: 'Central Park', date: '2024-02-15', bookings: 456, status: 'Active' },
      { id: 2, name: 'Tech Conference', venue: 'Convention Center', date: '2024-02-20', bookings: 123, status: 'Active' },
      { id: 3, name: 'Food Festival', venue: 'Downtown Square', date: '2024-02-25', bookings: 789, status: 'Sold Out' }
    ]
  };

  // Inline styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    navbar: {
      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #7c3aed 100%)',
      backdropFilter: 'blur(15px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 20px rgba(139, 92, 246, 0.2)',
      padding: '1rem 0'
    },
    navContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      textDecoration: 'none',
      color: 'white'
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      background: 'rgba(255, 255, 255, 0.15)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    logoText: {
      display: 'flex',
      flexDirection: 'column'
    },
    brand: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: 'white'
    },
    panelText: {
      fontSize: '0.8rem',
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: '500'
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.6rem 1.2rem',
      color: 'rgba(255, 255, 255, 0.9)',
      textDecoration: 'none',
      borderRadius: '10px',
      fontWeight: '500',
      fontSize: '0.95rem',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    navItemActive: {
      background: 'rgba(255, 255, 255, 0.15)',
      color: 'white'
    },
    userMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.5rem',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      position: 'relative'
    },
    userAvatar: {
      width: '36px',
      height: '36px',
      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
      color: 'white',
      fontSize: '0.9rem'
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.1rem'
    },
    userName: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: 'white'
    },
    userRole: {
      fontSize: '0.75rem',
      color: 'rgba(255, 255, 255, 0.7)'
    },
    dropdownArrow: {
      fontSize: '0.7rem',
      color: 'rgba(255, 255, 255, 0.8)',
      transition: 'transform 0.3s ease',
      transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
    },
    dropdownMenu: {
      position: 'absolute',
      top: 'calc(100% + 0.5rem)',
      right: '0',
      minWidth: '220px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(15px)',
      borderRadius: '12px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      overflow: 'hidden',
      zIndex: 1000
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      color: '#374151',
      textDecoration: 'none',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      width: '100%',
      textAlign: 'left'
    },
    mainContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem'
    },
    welcomeSection: {
      background: 'white',
      borderRadius: '20px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(139, 92, 246, 0.1)'
    },
    welcomeTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    welcomeSubtitle: {
      fontSize: '1.1rem',
      color: '#6b7280'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(139, 92, 246, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    statCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
    },
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      marginBottom: '1rem'
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
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem'
    },
    section: {
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(139, 92, 246, 0.1)'
    },
    sectionTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: '#f8fafc',
      padding: '0.75rem',
      textAlign: 'left',
      fontSize: '0.85rem',
      fontWeight: '600',
      color: '#374151',
      borderBottom: '1px solid #e5e7eb'
    },
    tableCell: {
      padding: '0.75rem',
      borderBottom: '1px solid #f1f5f9',
      fontSize: '0.9rem',
      color: '#374151'
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '500',
      textAlign: 'center'
    },
    statusActive: {
      background: '#d1fae5',
      color: '#065f46'
    },
    statusPending: {
      background: '#fef3c7',
      color: '#92400e'
    },
    statusInactive: {
      background: '#fee2e2',
      color: '#991b1b'
    },
    statusSoldOut: {
      background: '#e0e7ff',
      color: '#3730a3'
    }
  };

  const [hoveredCard, setHoveredCard] = useState(null);

  // Helper function to check if a nav item is active
  const isNavItemActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.includes(path)) return true;
    return false;
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.6s ease-out; }
        
        @media (max-width: 768px) {
          .content-grid-responsive { grid-template-columns: 1fr !important; }
          .stats-grid-responsive { grid-template-columns: repeat(2, 1fr) !important; }
          .nav-links-responsive { display: none !important; }
        }
        
        @media (max-width: 480px) {
          .stats-grid-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={styles.container}>
        {/* Navigation Bar - Always shows */}
        <nav style={styles.navbar}>
          <div style={styles.navContainer}>
            <Link to="/admin" style={styles.logo}>
              <div style={styles.logoIcon}>🎫</div>
              <div style={styles.logoText}>
                <span style={styles.brand}>Go Ticket</span>
                <span style={styles.panelText}>Admin Panel</span>
              </div>
            </Link>

            <div style={styles.navLinks} className="nav-links-responsive">
              <Link 
                to="/admin"
                style={{
                  ...styles.navItem,
                  ...(isNavItemActive('/admin') ? styles.navItemActive : {})
                }}
              >
                <span>📊</span>
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/admin/users"
                style={{
                  ...styles.navItem,
                  ...(isNavItemActive('/admin/users') ? styles.navItemActive : {})
                }}
              >
                <span>👥</span>
                <span>Users</span>
              </Link>
              <Link 
                to="/admin/managers"
                style={{
                  ...styles.navItem,
                  ...(isNavItemActive('/admin/managers') ? styles.navItemActive : {})
                }}
              >
                <span>🏢</span>
                <span>Managers</span>
              </Link>
              <Link 
                to="/admin/profile"
                style={{
                  ...styles.navItem,
                  ...(isNavItemActive('/admin/profile') ? styles.navItemActive : {})
                }}
              >
                <span>⚙️</span>
                <span>Profile</span>
              </Link>
            </div>

            <div style={styles.userMenu} onClick={toggleDropdown}>
              <div style={styles.userAvatar}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div style={styles.userInfo}>
                <span style={styles.userName}>{user?.name || 'Admin'}</span>
                <span style={styles.userRole}>Administrator</span>
              </div>
              <div style={styles.dropdownArrow}>▼</div>

              {dropdownOpen && (
                <div style={styles.dropdownMenu}>
                  <Link to="/admin/profile" style={styles.dropdownItem}>
                    <span>👤</span>
                    Profile Settings
                  </Link>
                  <Link to="/admin/settings" style={styles.dropdownItem}>
                    <span>⚙️</span>
                    System Settings
                  </Link>
                  <div style={{ height: '1px', background: 'rgba(0,0,0,0.1)', margin: '0.5rem 0' }}></div>
                  <button onClick={handleLogout} style={{ ...styles.dropdownItem, color: '#dc2626' }}>
                    <span>🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <div style={styles.mainContent}>
          {/* Show dashboard content ONLY on main admin page (/admin) */}
          {isMainAdminPage && (
            <div className="fade-in">
              {/* Welcome Section */}
              <div style={styles.welcomeSection}>
                <h1 style={styles.welcomeTitle}>
                  Welcome back, {user?.name || 'Admin'}! 👋
                </h1>
                <p style={styles.welcomeSubtitle}>
                  Here's what's happening with your Go Ticket platform today.
                </p>
              </div>

              {/* Stats Cards */}
              <div style={styles.statsGrid} className="stats-grid-responsive">
                <div 
                  style={{
                    ...styles.statCard,
                    ...(hoveredCard === 'users' ? styles.statCardHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard('users')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                    👥
                  </div>
                  <div style={styles.statNumber}>{dashboardData.stats.totalUsers.toLocaleString()}</div>
                  <div style={styles.statLabel}>Total Users</div>
                </div>

                <div 
                  style={{
                    ...styles.statCard,
                    ...(hoveredCard === 'managers' ? styles.statCardHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard('managers')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                    🏢
                  </div>
                  <div style={styles.statNumber}>{dashboardData.stats.totalManagers}</div>
                  <div style={styles.statLabel}>Active Managers</div>
                </div>

                <div 
                  style={{
                    ...styles.statCard,
                    ...(hoveredCard === 'events' ? styles.statCardHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard('events')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    🎭
                  </div>
                  <div style={styles.statNumber}>{dashboardData.stats.totalEvents}</div>
                  <div style={styles.statLabel}>Total Events</div>
                </div>

                <div 
                  style={{
                    ...styles.statCard,
                    ...(hoveredCard === 'revenue' ? styles.statCardHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard('revenue')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    💰
                  </div>
                  <div style={styles.statNumber}>₹{(dashboardData.stats.totalRevenue / 100000).toFixed(1)}L</div>
                  <div style={styles.statLabel}>Total Revenue</div>
                </div>

                <div 
                  style={{
                    ...styles.statCard,
                    ...(hoveredCard === 'bookings' ? styles.statCardHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard('bookings')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                    🎫
                  </div>
                  <div style={styles.statNumber}>{dashboardData.stats.todayBookings}</div>
                  <div style={styles.statLabel}>Today's Bookings</div>
                </div>

                <div 
                  style={{
                    ...styles.statCard,
                    ...(hoveredCard === 'active' ? styles.statCardHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard('active')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                    ⚡
                  </div>
                  <div style={styles.statNumber}>{dashboardData.stats.activeEvents}</div>
                  <div style={styles.statLabel}>Active Events</div>
                </div>
              </div>

              {/* Content Grid */}
              <div style={styles.contentGrid} className="content-grid-responsive">
                {/* Recent Users */}
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>
                    <span>👥</span>
                    Recent Users
                  </h2>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>Name</th>
                        <th style={styles.tableHeader}>Status</th>
                        <th style={styles.tableHeader}>Join Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentUsers.map(userData => (
                        <tr key={userData.id}>
                          <td style={styles.tableCell}>
                            <div>
                              <div style={{ fontWeight: '500' }}>{userData.name}</div>
                              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{userData.email}</div>
                            </div>
                          </td>
                          <td style={styles.tableCell}>
                            <span style={{
                              ...styles.statusBadge,
                              ...(userData.status === 'Active' ? styles.statusActive : 
                                  userData.status === 'Pending' ? styles.statusPending : styles.statusInactive)
                            }}>
                              {userData.status}
                            </span>
                          </td>
                          <td style={styles.tableCell}>{userData.joinDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Recent Events */}
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>
                    <span>🎭</span>
                    Recent Events
                  </h2>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>Event</th>
                        <th style={styles.tableHeader}>Bookings</th>
                        <th style={styles.tableHeader}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentEvents.map(event => (
                        <tr key={event.id}>
                          <td style={styles.tableCell}>
                            <div>
                              <div style={{ fontWeight: '500' }}>{event.name}</div>
                              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                📍 {event.venue} • 📅 {event.date}
                              </div>
                            </div>
                          </td>
                          <td style={styles.tableCell}>{event.bookings}</td>
                          <td style={styles.tableCell}>
                            <span style={{
                              ...styles.statusBadge,
                              ...(event.status === 'Active' ? styles.statusActive : 
                                  event.status === 'Sold Out' ? styles.statusSoldOut : styles.statusPending)
                            }}>
                              {event.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Outlet for nested routes - This renders AdminUsersPage, AdminManagersPage, AdminProfilePage */}
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminNavBar;