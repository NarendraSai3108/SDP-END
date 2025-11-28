import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import config from "../config";
import UserProfilePage from "./UserProfilePage"; 

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); 
  const [showProfileInline, setShowProfileInline] = useState(false); 

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchUser();
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

  const getUserId = () => {
    const userStr = localStorage.getItem("user");
    const userIdStr = localStorage.getItem("userId");
    
    console.log("🔍 Debug - userStr from localStorage:", userStr);
    console.log("🔍 Debug - userIdStr from localStorage:", userIdStr);
    
    if (userIdStr) {
      return userIdStr;
    } else if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        console.log("🔍 Debug - parsed userObj:", userObj);
        return userObj.id?. toString();
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        return null;
      }
    }
    return null;
  };

  const fetchUser = async () => {
    try {
      const userId = getUserId();
      console.log("🔄 Fetching user for userId:", userId);
      
      if (!userId) {
        console. log("❌ No userId found, setting user to null");
        return setUser(null);
      }
      
      const res = await axios.get(`${config.BACKEND_URL}/api/users/${userId}`);
      console.log("✅ User data received:", res.data);
      
      setUser({
        id: res.data. id,
        username: res. data.name,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        bookings: res.data.bookings || [],
        lastLogin: res.data.lastLogin
      });
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      setUser(null);
    }
  };

  const handleLogout = () => {
    console.log("🚪 Logout button clicked");
    console.log("📍 Current location:", window.location.pathname);
    console.log("🗂️ localStorage before clear:", { 
      userId: localStorage.getItem("userId"),
      userToken: localStorage.getItem("userToken")
    });

    try {
      const keysToRemove = ["userId", "userToken", "userRole", "authToken", "user", "token"];
      keysToRemove.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`✅ Removed ${key} from localStorage`);
        }
      });

      sessionStorage.clear();
      
      console.log("✅ All storage cleared");
      console.log("🔄 Navigating to /logout.. .");

      navigate("/logout", { replace: true });
      
      setTimeout(() => {
        if (window.location.pathname !== "/logout") {
          console. log("⚠️ Navigation failed, using window.location");
          window.location.href = "/logout";
        }
      }, 100);

    } catch (error) {
      console.error("❌ Logout error:", error);
      window.location.href = "/logout";
    }
  };

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

  const stats = [
    { label: "Total Events", value: events.length },
    { label: "My Bookings", value: user?. bookings?.length || "-", link: "/user/bookings" },
    { label: "My Profile", value: user?.username || user?.name || "-", link: "/user/profile", action: () => setShowProfileInline(true) },
    { label: "Last Login", value: user?.lastLogin ?  new Date(user. lastLogin).toLocaleDateString() : "-" }
  ];

  const styles = {
    container: { 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)",
      padding: "0",
      fontFamily: "Segoe UI, Roboto, sans-serif"
    },
    topBar: {
      background: "rgba(139, 92, 246, 0.95)",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backdropFilter: "blur(15px)",
      boxShadow: "0 4px 20px rgba(139, 92, 246, 0.3)",
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
      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.4rem",
      fontWeight: "bold",
      color: "white",
      boxShadow: "0 2px 8px rgba(251, 191, 36, 0.3)"
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
      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "700",
      fontSize: "1. 3rem",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 2px 8px rgba(251, 191, 36, 0. 2)"
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
      color: "#7c3aed",
      marginBottom: "0.5rem",
      textShadow: "0 2px 4px rgba(124, 58, 237, 0.1)",
      textAlign: "left"
    },
    subtitle: {
      fontSize: "1. 1rem",
      color: "#6b7280",
      fontWeight: "500",
      textAlign: "left"
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1. 5rem",
      marginBottom: "2rem"
    },
    statCard: {
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "18px",
      padding: "2rem 1.5rem",
      boxShadow: "0 6px 24px rgba(139, 92, 246, 0.12)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: "1.1rem",
      transition: "all 0.3s ease",
      backdropFilter: "blur(15px)",
      cursor: "pointer"
    },
    statValue: {
      fontSize: "2.4rem",
      color: "#8b5cf6",
      fontWeight: "700",
      marginBottom: "0.5rem",
      textShadow: "0 2px 4px rgba(139, 92, 246, 0.1)"
    },
    statLabel: {
      color: "#6b7280",
      fontSize: "1rem",
      fontWeight: "600"
    },
    statLink: {
      display: "inline-block",
      marginTop: "0.75rem",
      fontSize: "0.9rem",
      color: "#6366f1",
      textDecoration: "none",
      padding: "0.5rem 1rem",
      borderRadius: "8px",
      background: "rgba(99, 102, 241, 0.1)",
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none",
      fontWeight: "600"
    },
    eventsSection: {
      padding: "2rem",
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "20px",
      boxShadow: "0 6px 24px rgba(139, 92, 246, 0.12)",
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
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "2rem"
    },
    loading: {
      textAlign: "center",
      padding: "4rem",
      color: "#6366f1",
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
      padding: "0",
      boxShadow: "0 4px 16px rgba(139, 92, 246, 0.08)",
      display: "flex",
      flexDirection: "column",
      gap: "0",
      transition: "all 0.3s ease",
      border: "1px solid rgba(139, 92, 246, 0.1)",
      cursor: "pointer",
      overflow: "hidden"
    },
    eventNameHeader: {
      background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
      padding: "1.5rem 2rem",
      borderBottom: "3px solid rgba(255, 255, 255, 0.2)"
    },
    eventName: { 
      fontWeight: "800", 
      fontSize: "1. 5rem", 
      color: "white",
      margin: 0,
      textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      letterSpacing: "0.3px"
    },
    eventContent: {
      padding: "2rem",
      display: "flex",
      flexDirection: "column",
      gap: "1. 2rem"
    },
    eventDetails: { 
      fontSize: "1rem", 
      color: "#6b7280",
      lineHeight: "1.7",
      fontWeight: "500"
    },
    bookBtn: {
      marginTop: "1rem",
      background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      padding: "0.9rem 1.8rem",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      alignSelf: "flex-start",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)"
    },
    closeProfileBtn: {
      display: "block",
      margin: "2rem auto 0 auto",
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      padding: "0.9rem 2. 2rem",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
      transition: "all 0.3s ease"
    }
  };

  const handleBook = (eventId) => {
    navigate(`/book/${eventId}`);
  };

  const handleCardHover = (e, isHover) => {
    if (isHover) {
      e. target.style.transform = "translateY(-6px) scale(1.02)";
      e.target.style.boxShadow = "0 12px 40px rgba(139, 92, 246, 0.2)";
    } else {
      e.target.style.transform = "translateY(0) scale(1)";
      e. target.style.boxShadow = "0 6px 24px rgba(139, 92, 246, 0.12)";
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

  const handleStatCardHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget. style.boxShadow = "0 8px 32px rgba(139, 92, 246, 0.2)";
    } else {
      e.currentTarget. style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 6px 24px rgba(139, 92, 246, 0.12)";
    }
  };

  const handleEventCardHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget. style.boxShadow = "0 12px 32px rgba(139, 92, 246, 0.25)";
    } else {
      e.currentTarget.style. transform = "translateY(0)";
      e.currentTarget. style.boxShadow = "0 4px 16px rgba(139, 92, 246, 0.08)";
    }
  };

  const handleBookBtnHover = (e, isHover) => {
    if (isHover) {
      e.target.style.transform = "scale(1.05)";
      e.target. style.boxShadow = "0 6px 16px rgba(139, 92, 246, 0.4)";
    } else {
      e.target.style.transform = "scale(1)";
      e.target.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.3)";
    }
  };

  const handleStatLinkHover = (e, isHover) => {
    if (isHover) {
      e.target.style.background = "rgba(99, 102, 241, 0.2)";
      e.target. style.transform = "scale(1.05)";
    } else {
      e.target.style.background = "rgba(99, 102, 241, 0.1)";
      e.target.style.transform = "scale(1)";
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles. brandSection}>
          <div style={styles.brandIcon}>🎫</div>
          <div>
            <div style={styles.brandText}>Go Ticket</div>
            <div style={styles.brandSubtext}>User Panel</div>
          </div>
        </div>
        
        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {(user?. username || user?.name) ?  (user. username || user.name). charAt(0). toUpperCase() : "U"}
            </div>
            <div style={styles.userDetails}>
              <div style={styles.userName}>{user?.username || user?.name || "User"}</div>
              <div style={styles.userRole}>Customer</div>
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
            Welcome back, {user?.username || user?. name || "User"}!  🎉
          </div>
          <div style={styles.subtitle}>
            Discover and book events, manage your bookings, and edit your profile. 
          </div>
        </div>

        <div style={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <div 
              style={styles.statCard} 
              key={idx}
              onMouseEnter={(e) => handleStatCardHover(e, true)}
              onMouseLeave={(e) => handleStatCardHover(e, false)}
            >
              <div style={styles.statValue}>{stat. value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
              {stat.link && ! stat.action && (
                <Link 
                  to={stat. link} 
                  style={styles.statLink}
                  onMouseEnter={(e) => handleStatLinkHover(e, true)}
                  onMouseLeave={(e) => handleStatLinkHover(e, false)}
                >
                  View Details
                </Link>
              )}
              {stat.action && (
                <button 
                  style={styles. statLink} 
                  onClick={stat.action}
                  onMouseEnter={(e) => handleStatLinkHover(e, true)}
                  onMouseLeave={(e) => handleStatLinkHover(e, false)}
                >
                  View Details
                </button>
              )}
            </div>
          ))}
        </div>

        {showProfileInline && (
          <div>
            <UserProfilePage />
            <button
              style={styles.closeProfileBtn}
              onClick={() => setShowProfileInline(false)}
              onMouseEnter={(e) => {
                e.target.style. transform = "scale(1.05)";
                e.target. style.boxShadow = "0 6px 16px rgba(139, 92, 246, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target. style.transform = "scale(1)";
                e.target. style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.3)";
              }}
            >
              Close Profile
            </button>
          </div>
        )}

        {! showProfileInline && (
          <div style={styles.eventsSection}>
            <div style={styles.eventsTitle}>
              <span>🎭</span>
              All Events ({events.length})
            </div>
            {loading ? (
              <div style={styles.loading}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
                Loading events...
              </div>
            ) : events.length === 0 ? (
              <div style={styles. empty}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎭</div>
                <div style={{ fontSize: "1. 2rem", fontWeight: "600" }}>No events available at the moment.</div>
                <div style={{ fontSize: "1rem", marginTop: "0.5rem", color: "#9ca3af" }}>Check back later for exciting events!</div>
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
                      style={styles.eventCard} 
                      key={event. id}
                      onMouseEnter={(e) => handleEventCardHover(e, true)}
                      onMouseLeave={(e) => handleEventCardHover(e, false)}
                    >
                      <div style={styles.eventNameHeader}>
                        <div style={styles. eventName}>{eventTitle}</div>
                      </div>
                      
                      <div style={styles. eventContent}>
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
                        <button 
                          style={styles.bookBtn} 
                          onClick={() => handleBook(event.id)}
                          onMouseEnter={(e) => handleBookBtnHover(e, true)}
                          onMouseLeave={(e) => handleBookBtnHover(e, false)}
                        >
                          Book Now 🎫
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;