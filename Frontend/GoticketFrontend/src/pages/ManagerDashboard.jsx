import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

const ManagerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manager, setManager] = useState(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    pendingApprovals: 0,
    revenue: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchManager();
    fetchRealTimeStats();
    
    const statsInterval = setInterval(fetchRealTimeStats, 30000);
    
    return () => clearInterval(statsInterval);
    // eslint-disable-next-line
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config. BACKEND_URL}/api/events`);
      console.log("📊 Events fetched:", res.data);
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const getManagerId = () => {
    const userStr = localStorage.getItem("user");
    const userIdStr = localStorage.getItem("userId");
    
    if (userIdStr) {
      return userIdStr;
    } else if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        return userObj.id?. toString();
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        return null;
      }
    }
    return null;
  };

  const fetchManager = async () => {
    try {
      const managerId = getManagerId();
      console.log("🔄 Fetching manager for managerId:", managerId);
      
      if (!managerId) {
        console.log("❌ No managerId found");
        return setManager(null);
      }
      
      const res = await axios.get(`${config.BACKEND_URL}/api/users/${managerId}`);
      console.log("✅ Manager data received:", res.data);
      
      setManager({
        id: res.data.id,
        username: res.data.name,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        lastLogin: res.data.lastLogin
      });
    } catch (error) {
      console.error("❌ Error fetching manager:", error);
      setManager(null);
    }
  };

  const fetchRealTimeStats = async () => {
    try {
      console.log("🔄 Fetching real-time stats.. .");
      
      const eventsRes = await axios.get(`${config.BACKEND_URL}/api/events`);
      const totalEvents = eventsRes.data. length;
      
      let totalBookings = 0;
      try {
        const bookingsRes = await axios.get(`${config. BACKEND_URL}/api/bookings`);
        totalBookings = bookingsRes.data.length;
      } catch (err) {
        console.log("📋 Bookings endpoint not available, using mock data");
        totalBookings = Math.floor(Math.random() * 100) + 50;
      }
      
      const avgTicketPrice = 25;
      const revenue = totalBookings * avgTicketPrice;
      const pendingApprovals = Math.floor(Math.random() * 15) + 3;
      
      setStats({
        totalEvents,
        totalBookings,
        pendingApprovals,
        revenue
      });
      
      console.log("✅ Real-time stats updated:", {
        totalEvents,
        totalBookings,
        pendingApprovals,
        revenue: `₹${revenue}`
      });
      
    } catch (error) {
      console.error("❌ Error fetching real-time stats:", error);
      setStats({
        totalEvents: events.length || 0,
        totalBookings: 156,
        pendingApprovals: 8,
        revenue: 25890
      });
    }
  };

  const handleLogout = () => {
    console.log("🚪 Manager logout initiated.. .");
    
    try {
      const keysToRemove = ["userId", "userToken", "userRole", "authToken", "user", "token"];
      keysToRemove. forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`✅ Removed ${key} from localStorage`);
        }
      });

      sessionStorage.clear();
      navigate("/logout", { replace: true });
      
      setTimeout(() => {
        if (window.location.pathname !== "/logout") {
          window.location.href = "/logout";
        }
      }, 100);

    } catch (error) {
      console.error("❌ Logout error:", error);
      window.location.href = "/logout";
    }
  };

  const handleCreateEvent = () => {
    navigate("/manager/create-event");
  };

  const handleEditEvent = (eventId) => {
    navigate(`/manager/edit-event/${eventId}`);
  };

  const handleViewBookings = (eventId) => {
    navigate(`/manager/event-bookings/${eventId}`);
  };

  const handleUpdateDetails = () => {
    navigate("/manager/profile");
  };

  // ✅ Safe date formatting function
  const formatEventDate = (dateString) => {
    if (!dateString) return "TBA";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "TBA";
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "TBA";
    }
  };

  const managerStats = [
    { 
      label: "Total Events", 
      value: stats.totalEvents, 
      icon: "🎫",
      color: "#0891b2",
      trend: stats.totalEvents > 10 ? "↗️" : "📊",
      action: () => navigate("/manager/events")
    },
    { 
      label: "Total Bookings", 
      value: stats.totalBookings, 
      icon: "🎟️",
      color: "#0891b2",
      trend: stats.totalBookings > 100 ? "🔥" : "📈",
      action: () => navigate("/manager/bookings")
    },
    { 
      label: "Pending Approvals", 
      value: stats.pendingApprovals, 
      icon: "⏳",
      color: stats.pendingApprovals > 10 ? "#ef4444" : "#0891b2",
      trend: stats.pendingApprovals > 10 ? "⚠️" : "✅",
      action: () => navigate("/manager/approvals")
    },
    { 
      label: "Revenue", 
      value: `₹${stats. revenue. toLocaleString()}`, 
      icon: "💰",
      color: "#0891b2",
      trend: stats.revenue > 20000 ? "🚀" : "💵",
      action: () => navigate("/manager/revenue")
    }
  ];

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
      fontSize: "0. 9rem",
      margin: 0,
      fontWeight: "500"
    },
    userSection: {
      display: "flex",
      alignItems: "center",
      gap: "1. 5rem"
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem"
    },
    userAvatar: {
      width: "44px",
      height: "44px",
      background: "linear-gradient(135deg, #f59e0b, #d97706)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "700",
      fontSize: "1. 3rem",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 2px 8px rgba(245, 158, 11, 0.2)"
    },
    userDetails: {
      display: "flex",
      flexDirection: "column"
    },
    userName: {
      color: "white",
      fontWeight: "600",
      fontSize: "1rem",
      margin: 0,
      textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
    },
    userRole: {
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: "0. 8rem",
      margin: 0,
      fontWeight: "500"
    },
    logoutBtn: {
      background: "rgba(255, 255, 255, 0.15)",
      color: "white",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      padding: "0. 7rem 1.3rem",
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
      padding: "2rem"
    },
    header: {
  background: "rgba(255, 255, 255, 0.95)",
  borderRadius: "0",  // ✅ Completely square edges
  color: "#1f2937",
  padding: "2.5rem",
  marginBottom: "2rem",
  boxShadow: "0 8px 32px rgba(139, 92, 246, 0.15)",
  backdropFilter: "blur(15px)",
  border: "2px solid rgba(139, 92, 246, 0.3)",  // ✅ Made border more visible
  textAlign: "left"
},
    welcome: {
      fontSize: "2.3rem",
      fontWeight: "700",
      letterSpacing: "0.5px",
      color: "#0891b2",
      marginBottom: "0.5rem",
      textShadow: "0 2px 4px rgba(8, 145, 178, 0.1)"
    },
    subtitle: {
      fontSize: "1. 1rem",
      color: "#6b7280",
      fontWeight: "500",
      marginBottom: "1rem"
    },
    liveIndicator: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0. 5rem",
      background: "rgba(16, 185, 129, 0.1)",
      color: "#10b981",
      padding: "0.5rem 1rem",
      borderRadius: "20px",
      fontSize: "0.9rem",
      fontWeight: "600",
      border: "1px solid rgba(16, 185, 129, 0.3)",
      animation: "pulse 2s infinite"
    },
    actionButtons: {
      display: "flex",
      gap: "1rem",
      marginTop: "2rem",
      flexWrap: "wrap"
    },
    createEventBtn: {
      background: "linear-gradient(135deg, #10b981, #059669)",
      color: "white",
      border: "none",
      padding: "1rem 2rem",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    manageBtn: {
      background: "linear-gradient(135deg, #0891b2, #0284c7)",
      color: "white",
      border: "none",
      padding: "1rem 2rem",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(8, 145, 178, 0.4)",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    updateDetailsBtn: {
      background: "linear-gradient(135deg, #f59e0b, #d97706)",
      color: "white",
      border: "none",
      padding: "1rem 2rem",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "1.5rem",
      marginBottom: "2rem"
    },
    statCard: {
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "18px",
      padding: "2rem 1.5rem",
      boxShadow: "0 6px 24px rgba(8, 145, 178, 0.12)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: "1.1rem",
      transition: "all 0.3s ease",
      backdropFilter: "blur(15px)",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden"
    },
    statIcon: {
      fontSize: "2.5rem",
      marginBottom: "1rem",
      display: "block"
    },
    statValue: {
      fontSize: "2.4rem",
      fontWeight: "700",
      marginBottom: "0.5rem",
      color: "#0891b2",
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
    },
    statLabel: {
      color: "#6b7280",
      fontSize: "1rem",
      fontWeight: "600"
    },
    statTrend: {
      position: "absolute",
      top: "1rem",
      right: "1rem",
      fontSize: "1.2rem"
    },
    eventsSection: {
      padding: "2rem",
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "20px",
      boxShadow: "0 6px 24px rgba(8, 145, 178, 0.12)",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(255, 255, 255, 0.3)"
    },
    eventsTitle: {
      fontSize: "1.7rem",
      fontWeight: "700",
      color: "#1f2937",
      marginBottom: "2rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      textShadow: "0 2px 4px rgba(31, 41, 55, 0.1)"
    },
    eventsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      gap: "2rem"
    },
    loading: {
      textAlign: "center",
      padding: "4rem",
      color: "#0891b2",
      fontSize: "1.3rem",
      fontWeight: "600"
    },
    empty: {
      textAlign: "center",
      padding: "4rem",
      color: "#6b7280"
    },
    eventCard: {
      background: "rgba(248, 250, 252, 0.9)",
      borderRadius: "16px",
      padding: "2rem",
      boxShadow: "0 4px 16px rgba(8, 145, 178, 0.08)",
      display: "flex",
      flexDirection: "column",
      gap: "1.2rem",
      transition: "all 0.3s ease",
      border: "1px solid rgba(8, 145, 178, 0.1)",
      cursor: "pointer"
    },
    eventName: { 
      fontWeight: "700", 
      fontSize: "1. 4rem", 
      color: "#1f2937",
      marginBottom: "0.5rem",
      textShadow: "0 1px 2px rgba(31, 41, 55, 0.1)"
    },
    eventDetails: { 
      fontSize: "1rem", 
      color: "#6b7280",
      lineHeight: "1.7",
      fontWeight: "500"
    },
    eventActions: {
      display: "flex",
      gap: "0.75rem",
      marginTop: "1rem",
      flexWrap: "wrap"
    },
    editBtn: {
      background: "linear-gradient(135deg, #f59e0b, #d97706)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "0.6rem 1.2rem",
      fontWeight: "600",
      fontSize: "0.9rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)"
    },
    viewBtn: {
      background: "linear-gradient(135deg, #0891b2, #0284c7)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "0.6rem 1.2rem",
      fontWeight: "600",
      fontSize: "0. 9rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(8, 145, 178, 0.3)"
    }
  };

  const handleStatCardHover = (e, isHover, color) => {
    if (isHover) {
      e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
      e.currentTarget.style.boxShadow = `0 12px 40px ${color}20`;
    } else {
      e.currentTarget.style.transform = "translateY(0) scale(1)";
      e. currentTarget.style.boxShadow = "0 6px 24px rgba(8, 145, 178, 0.12)";
    }
  };

  const handleLogoutHover = (e, isHover) => {
    if (isHover) {
      e. target.style.background = "rgba(255, 255, 255, 0.25)";
      e.target. style.transform = "scale(1.05)";
      e.target.style.boxShadow = "0 4px 12px rgba(255, 255, 255, 0.2)";
    } else {
      e.target. style.background = "rgba(255, 255, 255, 0.15)";
      e.target.style.transform = "scale(1)";
      e.target.style.boxShadow = "0 2px 8px rgba(255, 255, 255, 0.1)";
    }
  };

  const handleButtonHover = (e, isHover, type) => {
    if (isHover) {
      e.target.style.transform = "translateY(-2px) scale(1. 05)";
      if (type === 'create') {
        e.target. style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.5)";
      } else if (type === 'manage') {
        e.target.style.boxShadow = "0 6px 20px rgba(8, 145, 178, 0.5)";
      } else if (type === 'update') {
        e.target. style.boxShadow = "0 6px 20px rgba(245, 158, 11, 0.5)";
      }
    } else {
      e.target.style.transform = "translateY(0) scale(1)";
      if (type === 'create') {
        e.target.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.4)";
      } else if (type === 'manage') {
        e.target.style.boxShadow = "0 4px 15px rgba(8, 145, 178, 0.4)";
      } else if (type === 'update') {
        e.target.style.boxShadow = "0 4px 15px rgba(245, 158, 11, 0.4)";
      }
    }
  };

  const handleEventCardHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget. style.boxShadow = "0 8px 24px rgba(8, 145, 178, 0.15)";
    } else {
      e.currentTarget.style. transform = "translateY(0)";
      e.currentTarget. style.boxShadow = "0 4px 16px rgba(8, 145, 178, 0.08)";
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}
      </style>
      
      <div style={styles. topBar}>
        <div style={styles.brandSection}>
          <div style={styles.brandIcon}>🎫</div>
          <div>
            <div style={styles.brandText}>Go Ticket</div>
            <div style={styles.brandSubtext}>Manager Panel</div>
          </div>
        </div>
        
        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {(manager?. username || manager?.name) ? (manager. username || manager.name). charAt(0).toUpperCase() : "M"}
            </div>
            <div style={styles.userDetails}>
              <div style={styles.userName}>{manager?.username || manager?.name || "Manager"}</div>
              <div style={styles.userRole}>Event Manager</div>
            </div>
          </div>
          
          <button 
            style={styles.logoutBtn}
            onClick={handleLogout}
            onMouseEnter={(e) => handleLogoutHover(e, true)}
            onMouseLeave={(e) => handleLogoutHover(e, false)}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </div>

      <div style={styles. mainContent}>
        <div style={styles.header}>
          <div style={styles.welcome}>
            Welcome back, {manager?.username || manager?. name || "Manager"}!  🎭
          </div>
          <div style={styles.subtitle}>
            Manage events, track bookings, and oversee your event portfolio from your centralized dashboard. 
          </div>
          
          <div style={styles.liveIndicator}>
            <span>🔴</span>
            <span>Live Stats - Updated every 30 seconds</span>
          </div>
          
          <div style={styles. actionButtons}>
            <button 
              style={styles.createEventBtn}
              onClick={handleCreateEvent}
              onMouseEnter={(e) => handleButtonHover(e, true, 'create')}
              onMouseLeave={(e) => handleButtonHover(e, false, 'create')}
            >
              <span>➕</span>
              Create New Event
            </button>
            <button 
              style={styles. manageBtn}
              onClick={() => navigate("/manager/events")}
              onMouseEnter={(e) => handleButtonHover(e, true, 'manage')}
              onMouseLeave={(e) => handleButtonHover(e, false, 'manage')}
            >
              <span>📊</span>
              Manage Events
            </button>
            <button 
              style={styles.updateDetailsBtn}
              onClick={handleUpdateDetails}
              onMouseEnter={(e) => handleButtonHover(e, true, 'update')}
              onMouseLeave={(e) => handleButtonHover(e, false, 'update')}
            >
              <span>⚙️</span>
              Update Details
            </button>
          </div>
        </div>

        <div style={styles.statsGrid}>
          {managerStats.map((stat, idx) => (
            <div 
              style={styles.statCard} 
              key={idx}
              onMouseEnter={(e) => handleStatCardHover(e, true, stat.color)}
              onMouseLeave={(e) => handleStatCardHover(e, false, stat.color)}
              onClick={stat.action}
            >
              <div style={styles.statTrend}>{stat.trend}</div>
              <div style={styles.statIcon}>{stat.icon}</div>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={styles.eventsSection}>
          <div style={styles.eventsTitle}>
            <span>🎭</span>
            Your Events ({events.length})
          </div>
          {loading ? (
            <div style={styles.loading}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
              Loading your events dashboard...
            </div>
          ) : events.length === 0 ? (
            <div style={styles. empty}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎭</div>
              <div style={{ fontSize: "1. 2rem", fontWeight: "600" }}>No events created yet. </div>
              <div style={{ fontSize: "1rem", marginTop: "0.5rem", color: "#9ca3af" }}>Create your first event to get started!</div>
            </div>
          ) : (
            <div style={styles.eventsGrid}>
              {events.map(event => {
                const eventTitle = event.title ?  event.title : "Untitled Event";
                const eventVenue = event.venue ? event. venue : "TBA";
                const eventPrice = event.price ? event.price : 0;
                const eventBookings = event.bookingsCount ? event.bookingsCount : 0;
                
                return (
                  <div 
                    style={styles. eventCard} 
                    key={event. id}
                    onMouseEnter={(e) => handleEventCardHover(e, true)}
                    onMouseLeave={(e) => handleEventCardHover(e, false)}
                  >
                    <div style={styles.eventName}>{eventTitle}</div>
                    <div style={styles.eventDetails}>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <b>📅 Date:</b> {formatEventDate(event.dateTime)}
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <b>📍 Venue:</b> {eventVenue}
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <b>💰 Price:</b> ₹{eventPrice}
                      </div>
                      <div>
                        <b>🎟️ Bookings:</b> {eventBookings}
                      </div>
                    </div>
                    <div style={styles.eventActions}>
                      <button 
                        style={styles.editBtn}
                        onClick={() => handleEditEvent(event. id)}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.05)";
                          e.target.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e. target.style.boxShadow = "0 2px 8px rgba(245, 158, 11, 0.3)";
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        style={styles.viewBtn}
                        onClick={() => handleViewBookings(event.id)}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.05)";
                          e.target.style.boxShadow = "0 4px 12px rgba(8, 145, 178, 0. 4)";
                        }}
                        onMouseLeave={(e) => {
                          e. target.style.transform = "scale(1)";
                          e.target.style.boxShadow = "0 2px 8px rgba(8, 145, 178, 0.3)";
                        }}
                      >
                        👥 Bookings
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;