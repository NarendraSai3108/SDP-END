import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import config from "../config";

const UserBookEvent = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [bookingData, setBookingData] = useState({
    numberOfTickets: 1,
    specialRequests: ""
  });
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 EventID from URL params:", eventId);
    fetchEvent();
    fetchUser();
    // eslint-disable-next-line
  }, [eventId]);

  // Just add this debug section right after the event data is fetched:

const fetchEvent = async () => {
  try {
    setLoading(true);
    console.log("🔄 Fetching event from:", `${config.BACKEND_URL}/api/events/${eventId}`);
    
    const res = await axios.get(`${config.BACKEND_URL}/api/events/${eventId}`);
    console.log("✅ RAW API Response:", res);
    console.log("✅ Response Status:", res.status);
    console.log("✅ Response Headers:", res.headers);
    console.log("✅ Response Data:", res.data);
    
    // Log each field individually
    if (res.data) {
      console.log("📊 Event Fields Debug:");
      console.log("- ID:", res.data.id);
      console.log("- Title:", res.data.title);
      console.log("- Price:", res.data.price);
      console.log("- TotalSeats:", res.data.totalSeats);
      console.log("- DateTime:", res.data.dateTime);
      console.log("- Venue:", res.data.venue);
      console.log("- Description:", res.data.description);
      console.log("- Category:", res.data.category);
      
      setEvent(res.data);
      console.log("📊 Event state set successfully");
    } else {
      console.log("⚠️ No event data in response");
      setMessage("Event data not found.");
    }
  } catch (error) {
    console.error("❌ Full Error Object:", error);
    console.error("❌ Error Response:", error.response);
    console.error("❌ Error Status:", error.response?.status);
    console.error("❌ Error Data:", error.response?.data);
    console.error("❌ Error Message:", error.message);
    
    if (error.response?.status === 404) {
      setMessage("Event not found - the event with this ID doesn't exist.");
    } else if (error.response?.status === 400) {
      setMessage("Invalid event ID format.");
    } else if (error.response?.status === 500) {
      setMessage("Server error - check your backend logs.");
    } else if (error.code === 'NETWORK_ERROR') {
      setMessage("Network error - is your backend running?");
    } else {
      setMessage(`Failed to load event: ${error.message}`);
    }
  } finally {
    setLoading(false);
  }
};

  // Get userId function (same as UserDashboard)
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

  const fetchUser = async () => {
    try {
      const userId = getUserId();
      console.log("🔄 Fetching user for userId:", userId);
      
      if (!userId) {
        console.log("❌ No userId found");
        return setUser(null);
      }
      
      const res = await axios.get(`${config.BACKEND_URL}/api/users/${userId}`);
      console.log("✅ User data received:", res.data);
      
      setUser({
        id: res.data.id,
        username: res.data.name,
        name: res.data.name,
        email: res.data.email
      });
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      setUser(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!bookingData.numberOfTickets || bookingData.numberOfTickets < 1) {
      newErrors.numberOfTickets = "Please select at least 1 ticket";
    }
    
    // Use totalSeats instead of capacity
    if (event && bookingData.numberOfTickets > event.totalSeats) {
      newErrors.numberOfTickets = `Only ${event.totalSeats} tickets available`;
    }
    
    if (bookingData.numberOfTickets > 10) {
      newErrors.numberOfTickets = "Maximum 10 tickets per booking";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage("Please fix the errors below");
      return;
    }

    if (!user) {
      setMessage("Please log in to book tickets");
      return;
    }

    if (!event) {
      setMessage("Event data not loaded. Please refresh the page.");
      return;
    }

    setBooking(true);
    setMessage("");

    try {
      const bookingPayload = {
        userId: parseInt(user.id),
        eventId: parseInt(eventId),
        numberOfTickets: parseInt(bookingData.numberOfTickets),
        specialRequests: bookingData.specialRequests.trim() || null,
        bookingDate: new Date().toISOString(),
        totalPrice: calculateTotalPrice()
      };

      console.log("🔄 Creating booking with payload:", bookingPayload);

      const response = await axios.post(`${config.BACKEND_URL}/api/bookings`, bookingPayload);
      
      console.log("✅ Booking created successfully:", response.data);
      
      setMessage("Booking confirmed! Redirecting to your bookings...");
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
      
    } catch (error) {
      console.error("❌ Booking error:", error);
      if (error.response?.data?.message) {
        setMessage(`Booking failed: ${error.response.data.message}`);
      } else if (error.response?.data?.error) {
        setMessage(`Booking failed: ${error.response.data.error}`);
      } else {
        setMessage("Booking failed. Please try again.");
      }
    } finally {
      setBooking(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // Calculate total price using 'price' field instead of 'ticketPrice'
  const calculateTotalPrice = () => {
    console.log("💰 Calculating total price:");
    console.log("- Event:", event);
    console.log("- Event price:", event?.price); // Using 'price' instead of 'ticketPrice'
    console.log("- Number of tickets:", bookingData.numberOfTickets);
    
    if (!event || !event.price || !bookingData.numberOfTickets) {
      console.log("💰 Missing data for calculation, returning 0");
      return 0;
    }
    
    const price = parseFloat(event.price);
    const tickets = parseInt(bookingData.numberOfTickets);
    const total = price * tickets;
    
    console.log(`💰 Calculation: ${price} × ${tickets} = ${total}`);
    return total;
  };

  const totalPrice = calculateTotalPrice();

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
      fontSize: "0.9rem",
      margin: 0,
      fontWeight: "500"
    },
    userSection: {
      display: "flex",
      alignItems: "center",
      gap: "1.5rem"
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
      fontSize: "1.3rem",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 2px 8px rgba(251, 191, 36, 0.2)"
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
      fontSize: "0.8rem",
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
      justifyContent: "center",
      gap: "2rem",
      flexWrap: "wrap"
    },
    eventCard: {
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "24px",
      boxShadow: "0 8px 40px rgba(139, 92, 246, 0.25)",
      padding: "2.5rem",
      maxWidth: "500px",
      width: "100%",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      height: "fit-content"
    },
    bookingCard: {
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "24px",
      boxShadow: "0 8px 40px rgba(139, 92, 246, 0.25)",
      padding: "2.5rem",
      maxWidth: "500px",
      width: "100%",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      height: "fit-content"
    },
    eventHeader: {
      marginBottom: "2rem",
      textAlign: "center"
    },
    eventIcon: {
      width: "80px",
      height: "80px",
      background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      borderRadius: "50%",
      fontSize: "2.5rem",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1.5rem auto",
      fontWeight: "700",
      boxShadow: "0 6px 24px rgba(139, 92, 246, 0.4)",
      border: "4px solid rgba(255, 255, 255, 0.9)"
    },
    eventTitle: {
      fontSize: "1.8rem",
      fontWeight: "800",
      color: "#7c3aed",
      marginBottom: "0.5rem"
    },
    eventCategory: {
      display: "inline-block",
      background: "rgba(139, 92, 246, 0.1)",
      color: "#7c3aed",
      padding: "0.5rem 1rem",
      borderRadius: "20px",
      fontSize: "0.9rem",
      fontWeight: "600",
      border: "1px solid rgba(139, 92, 246, 0.2)"
    },
    eventDetails: {
      display: "grid",
      gap: "1.5rem",
      marginTop: "2rem"
    },
    detailItem: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "1rem",
      background: "rgba(139, 92, 246, 0.05)",
      borderRadius: "12px",
      border: "1px solid rgba(139, 92, 246, 0.1)"
    },
    detailIcon: {
      fontSize: "1.5rem",
      minWidth: "30px"
    },
    detailContent: {
      flex: 1
    },
    detailLabel: {
      fontSize: "0.9rem",
      color: "#6b7280",
      fontWeight: "600",
      marginBottom: "0.25rem"
    },
    detailValue: {
      fontSize: "1.1rem",
      color: "#374151",
      fontWeight: "600"
    },
    bookingHeader: {
      marginBottom: "2rem",
      textAlign: "center"
    },
    bookingIcon: {
      width: "80px",
      height: "80px",
      background: "linear-gradient(135deg, #10b981, #059669)",
      borderRadius: "50%",
      fontSize: "2.5rem",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1.5rem auto",
      fontWeight: "700",
      boxShadow: "0 6px 24px rgba(16, 185, 129, 0.4)",
      border: "4px solid rgba(255, 255, 255, 0.9)"
    },
    bookingTitle: {
      fontSize: "1.8rem",
      fontWeight: "800",
      color: "#10b981",
      marginBottom: "0.5rem"
    },
    bookingSubtitle: {
      fontSize: "1rem",
      color: "#6b7280"
    },
    form: {
      display: "grid",
      gap: "2rem"
    },
    formGroup: {
      display: "grid",
      gap: "0.75rem"
    },
    label: {
      fontSize: "1rem",
      color: "#7c3aed",
      fontWeight: "700"
    },
    input: {
      width: "100%",
      padding: "1.2rem 1.4rem",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "1rem",
      fontFamily: "inherit",
      background: "rgba(255, 255, 255, 0.9)",
      transition: "all 0.3s",
      boxSizing: "border-box"
    },
    textarea: {
      width: "100%",
      padding: "1.2rem 1.4rem",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "1rem",
      fontFamily: "inherit",
      background: "rgba(255, 255, 255, 0.9)",
      transition: "all 0.3s",
      boxSizing: "border-box",
      resize: "vertical",
      minHeight: "100px"
    },
    error: {
      color: "#dc2626",
      fontSize: "0.875rem",
      fontWeight: "600"
    },
    priceBreakdown: {
      background: "rgba(139, 92, 246, 0.05)",
      borderRadius: "12px",
      padding: "1.5rem",
      border: "1px solid rgba(139, 92, 246, 0.1)"
    },
    priceRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "0.75rem"
    },
    priceLabel: {
      color: "#6b7280",
      fontWeight: "600"
    },
    priceValue: {
      color: "#374151",
      fontWeight: "700"
    },
    totalRow: {
      borderTop: "2px solid rgba(139, 92, 246, 0.2)",
      paddingTop: "0.75rem",
      marginTop: "0.75rem"
    },
    totalLabel: {
      color: "#7c3aed",
      fontSize: "1.2rem",
      fontWeight: "800"
    },
    totalValue: {
      color: "#7c3aed",
      fontSize: "1.4rem",
      fontWeight: "800"
    },
    buttonContainer: {
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap"
    },
    bookBtn: {
      background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      color: "white",
      border: "none",
      padding: "1.2rem 2.5rem",
      borderRadius: "12px",
      fontWeight: "700",
      fontSize: "1.1rem",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
      transition: "all 0.3s",
      flex: 1,
      minWidth: "200px"
    },
    cancelBtn: {
      background: "rgba(139, 92, 246, 0.1)",
      color: "#7c3aed",
      border: "2px solid rgba(139, 92, 246, 0.25)",
      padding: "1.2rem 2.5rem",
      borderRadius: "12px",
      fontWeight: "700",
      fontSize: "1.1rem",
      cursor: "pointer",
      transition: "all 0.3s",
      flex: 1,
      minWidth: "200px"
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
    errorMessage: {
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
      padding: "4rem",
      gridColumn: "1 / -1"
    },
    loadingSpinner: {
      width: "50px",
      height: "50px",
      border: "5px solid rgba(139, 92, 246, 0.2)",
      borderTop: "5px solid #8b5cf6",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    },
    loadingText: {
      color: "#8b5cf6",
      fontSize: "1.3rem",
      fontWeight: "700"
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
  if (loading && !document.querySelector('#booking-spinner-keyframes')) {
    const style = document.createElement('style');
    style.id = 'booking-spinner-keyframes';
    style.textContent = spinnerKeyframes;
    document.head.appendChild(style);
  }

  // Input focus/blur handlers
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
      if (buttonType === 'book') {
        e.target.style.boxShadow = "0 6px 20px rgba(139, 92, 246, 0.5)";
      } else if (buttonType === 'cancel') {
        e.target.style.background = "rgba(139, 92, 246, 0.15)";
      } else if (buttonType === 'back') {
        e.target.style.background = "rgba(255, 255, 255, 0.25)";
        e.target.style.boxShadow = "0 4px 12px rgba(255, 255, 255, 0.2)";
      }
    } else {
      e.target.style.transform = "translateY(0) scale(1)";
      if (buttonType === 'book') {
        e.target.style.boxShadow = "0 4px 15px rgba(139, 92, 246, 0.4)";
      } else if (buttonType === 'cancel') {
        e.target.style.background = "rgba(139, 92, 246, 0.1)";
      } else if (buttonType === 'back') {
        e.target.style.background = "rgba(255, 255, 255, 0.15)";
        e.target.style.boxShadow = "0 2px 8px rgba(255, 255, 255, 0.1)";
      }
    }
  };

  // Format date for display using 'dateTime' field
  const formatEventDate = (dateTimeString) => {
    if (!dateTimeString) return "TBA";
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "TBA";
    }
  };

  // Format time separately using 'dateTime' field
  const formatEventTime = (dateTimeString) => {
    if (!dateTimeString) return "TBA";
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "TBA";
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div style={styles.brandSection}>
            <div style={styles.brandIcon}>🎫</div>
            <div>
              <div style={styles.brandText}>Go Ticket</div>
              <div style={styles.brandSubtext}>User Panel</div>
            </div>
          </div>
        </div>
        
        <div style={styles.mainContent}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <div style={styles.loadingText}>Loading event details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div style={styles.brandSection}>
            <div style={styles.brandIcon}>🎫</div>
            <div>
              <div style={styles.brandText}>Go Ticket</div>
              <div style={styles.brandSubtext}>User Panel</div>
            </div>
          </div>
          
          <button 
            style={styles.backBtn}
            onClick={handleBackToDashboard}
            onMouseEnter={(e) => handleButtonHover(e, true, 'back')}
            onMouseLeave={(e) => handleButtonHover(e, false, 'back')}
          >
            ← Back to Dashboard
          </button>
        </div>
        
        <div style={styles.mainContent}>
          <div style={styles.eventCard}>
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>❌</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#dc2626", marginBottom: "1rem" }}>
                Event Not Found
              </div>
              <div style={{ color: "#6b7280", marginBottom: "2rem" }}>
                The event you're looking for doesn't exist or may have been removed.
              </div>
              {message && <div style={styles.errorMessage}>{message}</div>}
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
            <div style={styles.brandSubtext}>User Panel</div>
          </div>
        </div>
        
        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {(user?.username || user?.name) ? (user.username || user.name).charAt(0).toUpperCase() : "U"}
            </div>
            <div style={styles.userDetails}>
              <div style={styles.userName}>{user?.username || user?.name || "User"}</div>
              <div style={styles.userRole}>Customer</div>
            </div>
          </div>
          
          <button 
            style={styles.backBtn}
            onClick={handleBackToDashboard}
            onMouseEnter={(e) => handleButtonHover(e, true, 'back')}
            onMouseLeave={(e) => handleButtonHover(e, false, 'back')}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Event Details Card */}
        <div style={styles.eventCard}>
          <div style={styles.eventHeader}>
            <div style={styles.eventIcon}>🎭</div>
            {/* Using 'title' field from your database */}
            <div style={styles.eventTitle}>{event.title || "Event Title"}</div>
            <div style={styles.eventCategory}>{event.category || "EVENT"}</div>
          </div>

          <div style={styles.eventDetails}>
            <div style={styles.detailItem}>
              <div style={styles.detailIcon}>📅</div>
              <div style={styles.detailContent}>
                <div style={styles.detailLabel}>Date</div>
                {/* Using 'dateTime' field */}
                <div style={styles.detailValue}>{formatEventDate(event.dateTime)}</div>
              </div>
            </div>

            <div style={styles.detailItem}>
              <div style={styles.detailIcon}>🕒</div>
              <div style={styles.detailContent}>
                <div style={styles.detailLabel}>Time</div>
                {/* Using 'dateTime' field */}
                <div style={styles.detailValue}>{formatEventTime(event.dateTime)}</div>
              </div>
            </div>

            <div style={styles.detailItem}>
              <div style={styles.detailIcon}>📍</div>
              <div style={styles.detailContent}>
                <div style={styles.detailLabel}>Venue</div>
                <div style={styles.detailValue}>{event.venue || "TBA"}</div>
              </div>
            </div>

            <div style={styles.detailItem}>
              <div style={styles.detailIcon}>👥</div>
              <div style={styles.detailContent}>
                <div style={styles.detailLabel}>Capacity</div>
                {/* Using 'totalSeats' field */}
                <div style={styles.detailValue}>{event.totalSeats || "0"} people</div>
              </div>
            </div>

            <div style={styles.detailItem}>
              <div style={styles.detailIcon}>💰</div>
              <div style={styles.detailContent}>
                <div style={styles.detailLabel}>Ticket Price</div>
                {/* Using 'price' field */}
                <div style={styles.detailValue}>₹{event.price || "0"}</div>
              </div>
            </div>

            {event.description && (
              <div style={styles.detailItem}>
                <div style={styles.detailIcon}>📝</div>
                <div style={styles.detailContent}>
                  <div style={styles.detailLabel}>Description</div>
                  <div style={styles.detailValue}>{event.description}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Card */}
        <div style={styles.bookingCard}>
          <div style={styles.bookingHeader}>
            <div style={styles.bookingIcon}>🎟️</div>
            <div style={styles.bookingTitle}>Book Your Tickets</div>
            <div style={styles.bookingSubtitle}>Reserve your spot for this amazing event</div>
          </div>

          <form onSubmit={handleBooking} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>🎫 Number of Tickets</label>
              <input
                style={styles.input}
                type="number"
                name="numberOfTickets"
                value={bookingData.numberOfTickets}
                onChange={handleChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                min="1"
                max="10"
                required
              />
              {errors.numberOfTickets && <div style={styles.error}>{errors.numberOfTickets}</div>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>💬 Special Requests (Optional)</label>
              <textarea
                style={styles.textarea}
                name="specialRequests"
                value={bookingData.specialRequests}
                onChange={handleChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Any special requirements or requests..."
                maxLength="500"
              />
            </div>

            {/* Price Breakdown */}
            <div style={styles.priceBreakdown}>
              <div style={styles.priceRow}>
                <span style={styles.priceLabel}>Ticket Price:</span>
                {/* Using 'price' field */}
                <span style={styles.priceValue}>₹{event.price || 0}</span>
              </div>
              <div style={styles.priceRow}>
                <span style={styles.priceLabel}>Number of Tickets:</span>
                <span style={styles.priceValue}>× {bookingData.numberOfTickets}</span>
              </div>
              <div style={{...styles.priceRow, ...styles.totalRow}}>
                <span style={styles.totalLabel}>Total Amount:</span>
                <span style={styles.totalValue}>₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div style={styles.buttonContainer}>
              <button
                type="submit"
                style={styles.bookBtn}
                disabled={booking || totalPrice === 0}
                onMouseEnter={(e) => !booking && handleButtonHover(e, true, 'book')}
                onMouseLeave={(e) => !booking && handleButtonHover(e, false, 'book')}
              >
                {booking ? "🔄 Processing..." : "🎉 Confirm Booking"}
              </button>
              
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={handleBackToDashboard}
                disabled={booking}
                onMouseEnter={(e) => !booking && handleButtonHover(e, true, 'cancel')}
                onMouseLeave={(e) => !booking && handleButtonHover(e, false, 'cancel')}
              >
                ❌ Cancel
              </button>
            </div>
          </form>

          {/* Messages */}
          {message && (
            <div style={message.includes("confirmed") || message.includes("success") ? styles.message : styles.errorMessage}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <span>{message.includes("confirmed") || message.includes("success") ? "✅" : "❌"}</span>
                <span>{message}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBookEvent;