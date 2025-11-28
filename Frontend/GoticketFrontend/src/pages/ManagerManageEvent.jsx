import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

const ManagerManageEvent = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manager, setManager] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("date");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    upcomingEvents: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchManager();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    filterAndSortEvents();
    // eslint-disable-next-line
  }, [events, searchTerm, filterCategory, sortBy]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config. BACKEND_URL}/api/events`);
      console.log("📊 Events fetched:", res.data);
      setEvents(res.data);
      calculateStats(res.data);
    } catch (error) {
      console.error("❌ Error fetching events:", error);
      setMessage("Failed to load events. Please try again.");
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
        return setManager(null);
      }
      
      const res = await axios.get(`${config.BACKEND_URL}/api/users/${managerId}`);
      setManager({
        id: res.data.id,
        username: res.data.name,
        email: res.data.email,
        role: res.data.role
      });
    } catch (error) {
      console.error("❌ Error fetching manager:", error);
      setManager(null);
    }
  };

  const calculateStats = (eventsData) => {
    const now = new Date();
    const upcomingEvents = eventsData. filter(event => {
      const eventDate = new Date(event.dateTime);
      return eventDate > now;
    }). length;

    const totalBookings = eventsData.reduce((sum, event) => {
      return sum + (event.bookingsCount ?  event.bookingsCount : 0);
    }, 0);
    
    const totalRevenue = eventsData.reduce((sum, event) => {
      const bookings = event.bookingsCount ?  event.bookingsCount : 0;
      const price = event.price ? event.price : 0;
      return sum + (bookings * price);
    }, 0);

    setStats({
      totalEvents: eventsData.length,
      totalBookings,
      totalRevenue,
      upcomingEvents
    });
  };

  const filterAndSortEvents = () => {
    let filtered = [... events];

    if (searchTerm) {
      filtered = filtered.filter(event => {
        const title = event.title ? event.title : "";
        const venue = event.venue ? event.venue : "";
        const description = event.description ? event.description : "";
        return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
               description. toLowerCase().includes(searchTerm. toLowerCase());
      });
    }

    if (filterCategory !== "ALL") {
      filtered = filtered.filter(event => {
        const category = event.category ? event.category : "";
        return category. toUpperCase() === filterCategory.toUpperCase();
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          const dateA = new Date(a. dateTime ?  a.dateTime : 0);
          const dateB = new Date(b.dateTime ? b. dateTime : 0);
          return dateA - dateB;
        case "title":
          const titleA = a.title ? a.title : "";
          const titleB = b.title ? b. title : "";
          return titleA.localeCompare(titleB);
        case "price":
          const priceA = a. price ? a.price : 0;
          const priceB = b.price ? b.price : 0;
          return priceB - priceA;
        case "capacity":
          const seatsA = a.totalSeats ? a.totalSeats : 0;
          const seatsB = b.totalSeats ? b.totalSeats : 0;
          return seatsB - seatsA;
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  };

  const handleEditEvent = (eventId) => {
    navigate(`/manager/edit-event/${eventId}`);
  };

  const handleViewBookings = (eventId) => {
    navigate(`/manager/event-bookings/${eventId}`);
  };

  const handleDeleteEvent = async (eventId) => {
    if (! window.confirm("Are you sure you want to delete this event?  This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`${config. BACKEND_URL}/api/events/${eventId}`);
      setMessage("Event deleted successfully!");
      fetchEvents();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ Error deleting event:", error);
      setMessage("Failed to delete event. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCreateNewEvent = () => {
    navigate("/manager/create-event");
  };

  const handleBackToDashboard = () => {
    navigate("/manager");
  };

  const eventCategories = [
    "ALL", "CONCERT", "CONFERENCE", "WORKSHOP", "SEMINAR", 
    "SPORTS", "FESTIVAL", "EXHIBITION", "THEATER", "NETWORKING", "OTHER"
  ];

  const formatEventDate = (dateString) => {
    if (!dateString) {
      return "TBA";
    }
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        console.error("❌ Invalid date:", dateString);
        return "Invalid Date";
      }
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("❌ Error formatting date:", error);
      return "TBA";
    }
  };

  const isUpcoming = (dateString) => {
    if (!dateString) {
      return false;
    }
    const eventDate = new Date(dateString);
    return ! isNaN(eventDate.getTime()) && eventDate > new Date();
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
      fontSize: "0. 9rem",
      margin: 0,
      fontWeight: "500"
    },
    actionsSection: {
      display: "flex",
      alignItems: "center",
      gap: "1rem"
    },
    backBtn: {
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
    createBtn: {
      background: "linear-gradient(135deg, #10b981, #059669)",
      color: "white",
      border: "none",
      padding: "0.7rem 1.5rem",
      borderRadius: "10px",
      fontSize: "0.9rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
    },
    mainContent: {
      padding: "2rem"
    },
    header: {
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "20px",
      padding: "2. 5rem",
      marginBottom: "2rem",
      boxShadow: "0 8px 32px rgba(8, 145, 178, 0.15)",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(255, 255, 255, 0.3)"
    },
    headerTitle: {
      fontSize: "2.3rem",
      fontWeight: "700",
      color: "#0891b2",
      marginBottom: "0.5rem",
      textShadow: "0 2px 4px rgba(8, 145, 178, 0.1)"
    },
    headerSubtitle: {
      fontSize: "1.1rem",
      color: "#6b7280",
      fontWeight: "500",
      marginBottom: "2rem"
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1.5rem",
      marginBottom: "2rem"
    },
    statCard: {
      background: "rgba(8, 145, 178, 0.1)",
      borderRadius: "16px",
      padding: "1.5rem",
      textAlign: "center",
      border: "1px solid rgba(8, 145, 178, 0.2)"
    },
    statValue: {
      fontSize: "2rem",
      fontWeight: "800",
      color: "#0891b2",
      marginBottom: "0.5rem"
    },
    statLabel: {
      fontSize: "0.9rem",
      color: "#6b7280",
      fontWeight: "600"
    },
    filtersSection: {
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "20px",
      padding: "2rem",
      marginBottom: "2rem",
      boxShadow: "0 6px 24px rgba(8, 145, 178, 0.12)",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(255, 255, 255, 0.3)"
    },
    filtersGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr",
      gap: "1. 5rem",
      alignItems: "end"
    },
    filterGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem"
    },
    label: {
      fontSize: "1rem",
      color: "#0891b2",
      fontWeight: "700"
    },
    input: {
      padding: "1rem 1.2rem",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "1rem",
      fontFamily: "inherit",
      background: "rgba(255, 255, 255, 0.9)",
      transition: "all 0.3s",
      boxSizing: "border-box"
    },
    select: {
      padding: "1rem 1.2rem",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "1rem",
      fontFamily: "inherit",
      background: "rgba(255, 255, 255, 0.9)",
      transition: "all 0.3s",
      boxSizing: "border-box",
      cursor: "pointer"
    },
    eventsSection: {
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "20px",
      padding: "2rem",
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
      justifyContent: "space-between"
    },
    eventsCount: {
      fontSize: "1rem",
      color: "#6b7280",
      fontWeight: "500"
    },
    eventsGrid: {
      display: "grid",
      gap: "1.5rem"
    },
    eventCard: {
      background: "rgba(248, 250, 252, 0.9)",
      borderRadius: "16px",
      padding: "2rem",
      boxShadow: "0 4px 16px rgba(8, 145, 178, 0.08)",
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: "2rem",
      transition: "all 0.3s ease",
      border: "1px solid rgba(8, 145, 178, 0.1)",
      position: "relative"
    },
    eventInfo: {
      display: "grid",
      gap: "1rem"
    },
    eventHeader: {
      display: "flex",
      alignItems: "center",
      gap: "1rem"
    },
    eventTitle: {
      fontSize: "1.4rem",
      fontWeight: "700",
      color: "#1f2937",
      margin: 0
    },
    eventStatus: {
      padding: "0.25rem 0.75rem",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: "600",
      textTransform: "uppercase"
    },
    upcomingStatus: {
      background: "rgba(16, 185, 129, 0.1)",
      color: "#059669",
      border: "1px solid rgba(16, 185, 129, 0.3)"
    },
    pastStatus: {
      background: "rgba(156, 163, 175, 0.1)",
      color: "#6b7280",
      border: "1px solid rgba(156, 163, 175, 0.3)"
    },
    eventDetails: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
      color: "#6b7280",
      fontSize: "0.95rem"
    },
    eventDetail: {
      display: "flex",
      alignItems: "center",
      gap: "0. 5rem",
      fontWeight: "500"
    },
    eventActions: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      minWidth: "120px"
    },
    actionBtn: {
      padding: "0.75rem 1.5rem",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "0.9rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "none",
      textAlign: "center"
    },
    editBtn: {
      background: "linear-gradient(135deg, #0891b2, #0284c7)",
      color: "white",
      boxShadow: "0 2px 8px rgba(8, 145, 178, 0.3)"
    },
    viewBtn: {
      background: "rgba(8, 145, 178, 0.1)",
      color: "#0891b2",
      border: "1px solid rgba(8, 145, 178, 0.3)"
    },
    deleteBtn: {
      background: "rgba(239, 68, 68, 0.1)",
      color: "#dc2626",
      border: "1px solid rgba(239, 68, 68, 0.3)"
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
    message: {
      marginBottom: "2rem",
      color: "#10b981",
      fontWeight: "700",
      padding: "1rem",
      background: "rgba(16, 185, 129, 0.1)",
      borderRadius: "12px",
      border: "1px solid rgba(16, 185, 129, 0.3)",
      textAlign: "center"
    },
    errorMessage: {
      marginBottom: "2rem",
      color: "#dc2626",
      fontWeight: "700",
      padding: "1rem",
      background: "rgba(220, 38, 38, 0.1)",
      borderRadius: "12px",
      border: "1px solid rgba(220, 38, 38, 0.3)",
      textAlign: "center"
    }
  };

  const handleButtonHover = (e, isHover, type) => {
    if (isHover) {
      e. target.style.transform = "translateY(-2px) scale(1.02)";
      if (type === 'create') {
        e. target.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.5)";
      } else if (type === 'back') {
        e.target. style.background = "rgba(255, 255, 255, 0.25)";
      } else if (type === 'edit') {
        e.target. style.boxShadow = "0 4px 12px rgba(8, 145, 178, 0.4)";
      } else if (type === 'delete') {
        e.target.style.background = "rgba(239, 68, 68, 0.2)";
      }
    } else {
      e.target. style.transform = "translateY(0) scale(1)";
      if (type === 'create') {
        e.target.style. boxShadow = "0 4px 15px rgba(16, 185, 129, 0.4)";
      } else if (type === 'back') {
        e.target.style.background = "rgba(255, 255, 255, 0.15)";
      } else if (type === 'edit') {
        e.target.style.boxShadow = "0 2px 8px rgba(8, 145, 178, 0.3)";
      } else if (type === 'delete') {
        e.target.style.background = "rgba(239, 68, 68, 0.1)";
      }
    }
  };

  const handleEventCardHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 8px 24px rgba(8, 145, 178, 0.15)";
    } else {
      e.currentTarget.style. transform = "translateY(0)";
      e.currentTarget. style.boxShadow = "0 4px 16px rgba(8, 145, 178, 0.08)";
    }
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = "#0891b2";
    e.target.style.boxShadow = "0 0 0 4px rgba(8, 145, 178, 0.12)";
  };

  const handleInputBlur = (e) => {
    e.target. style.borderColor = "#e5e7eb";
    e.target.style.boxShadow = "none";
  };

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
        
        <div style={styles.actionsSection}>
          <button 
            style={styles.createBtn}
            onClick={handleCreateNewEvent}
            onMouseEnter={(e) => handleButtonHover(e, true, 'create')}
            onMouseLeave={(e) => handleButtonHover(e, false, 'create')}
          >
            <span>➕</span>
            Create Event
          </button>
          
          <button 
            style={styles.backBtn}
            onClick={handleBackToDashboard}
            onMouseEnter={(e) => handleButtonHover(e, true, 'back')}
            onMouseLeave={(e) => handleButtonHover(e, false, 'back')}
          >
            <span>← Dashboard</span>
          </button>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles. header}>
          <div style={styles.headerTitle}>Manage Events 🎭</div>
          <div style={styles.headerSubtitle}>
            Create, edit, and monitor all your events from one central location. 
          </div>
          
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{stats.totalEvents}</div>
              <div style={styles.statLabel}>Total Events</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{stats.totalBookings}</div>
              <div style={styles.statLabel}>Total Bookings</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>₹{stats.totalRevenue. toLocaleString()}</div>
              <div style={styles. statLabel}>Total Revenue</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{stats.upcomingEvents}</div>
              <div style={styles.statLabel}>Upcoming Events</div>
            </div>
          </div>
        </div>

        {message && (
          <div style={message.includes("success") ? styles.message : styles. errorMessage}>
            <span>{message. includes("success") ? "✅" : "❌"}</span>
            <span style={{ marginLeft: "0.5rem" }}>{message}</span>
          </div>
        )}

        <div style={styles.filtersSection}>
          <div style={styles.filtersGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>🔍 Search Events</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Search by title, venue, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
            
            <div style={styles.filterGroup}>
              <label style={styles.label}>📂 Category</label>
              <select
                style={styles.select}
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              >
                {eventCategories.map(category => (
                  <option key={category} value={category}>
                    {category === "ALL" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={styles.filterGroup}>
              <label style={styles.label}>📊 Sort By</label>
              <select
                style={styles.select}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="price">Price (High to Low)</option>
                <option value="capacity">Capacity (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        <div style={styles.eventsSection}>
          <div style={styles.eventsTitle}>
            <span>🎭 Your Events</span>
            <span style={styles.eventsCount}>
              {filteredEvents.length} of {events.length} events
            </span>
          </div>
          
          {loading ?  (
            <div style={styles.loading}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
              Loading your events...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎭</div>
              <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                {events.length === 0 ? "No events created yet." : "No events match your filters."}
              </div>
              <div style={{ fontSize: "1rem", marginTop: "0.5rem", color: "#9ca3af" }}>
                {events.length === 0 ? "Create your first event to get started!" : "Try adjusting your search or filters."}
              </div>
            </div>
          ) : (
            <div style={styles.eventsGrid}>
              {filteredEvents.map(event => {
                const eventTitle = event.title ?  event.title : "Untitled Event";
                const eventVenue = event.venue ? event. venue : "TBA";
                const eventPrice = event.price ? event.price : 0;
                const eventSeats = event.totalSeats ? event.totalSeats : 0;
                const eventBookings = event.bookingsCount ? event.bookingsCount : 0;
                const eventCategory = event.category ? event.category : "Uncategorized";
                const isEventUpcoming = isUpcoming(event.dateTime);
                
                return (
                  <div 
                    style={styles.eventCard} 
                    key={event.id}
                    onMouseEnter={(e) => handleEventCardHover(e, true)}
                    onMouseLeave={(e) => handleEventCardHover(e, false)}
                  >
                    <div style={styles.eventInfo}>
                      <div style={styles.eventHeader}>
                        <div style={styles.eventTitle}>{eventTitle}</div>
                        <div style={{
                          ... styles.eventStatus,
                          ...(isEventUpcoming ?  styles.upcomingStatus : styles.pastStatus)
                        }}>
                          {isEventUpcoming ? "Upcoming" : "Past"}
                        </div>
                      </div>
                      
                      <div style={styles. eventDetails}>
                        <div style={styles.eventDetail}>
                          <span>📅</span>
                          <span>{formatEventDate(event.dateTime)}</span>
                        </div>
                        <div style={styles.eventDetail}>
                          <span>📍</span>
                          <span>{eventVenue}</span>
                        </div>
                        <div style={styles.eventDetail}>
                          <span>💰</span>
                          <span>₹{eventPrice}</span>
                        </div>
                        <div style={styles.eventDetail}>
                          <span>👥</span>
                          <span>{eventSeats} seats</span>
                        </div>
                        <div style={styles.eventDetail}>
                          <span>🎟️</span>
                          <span>{eventBookings} bookings</span>
                        </div>
                        <div style={styles.eventDetail}>
                          <span>📂</span>
                          <span>{eventCategory}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={styles.eventActions}>
                      <button 
                        style={{... styles.actionBtn, ... styles.editBtn}}
                        onClick={() => handleEditEvent(event. id)}
                        onMouseEnter={(e) => handleButtonHover(e, true, 'edit')}
                        onMouseLeave={(e) => handleButtonHover(e, false, 'edit')}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        style={{... styles.actionBtn, ...styles. viewBtn}}
                        onClick={() => handleViewBookings(event.id)}
                      >
                        👥 Bookings
                      </button>
                      <button 
                        style={{...styles.actionBtn, ...styles.deleteBtn}}
                        onClick={() => handleDeleteEvent(event.id)}
                        onMouseEnter={(e) => handleButtonHover(e, true, 'delete')}
                        onMouseLeave={(e) => handleButtonHover(e, false, 'delete')}
                      >
                        🗑️ Delete
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

export default ManagerManageEvent;