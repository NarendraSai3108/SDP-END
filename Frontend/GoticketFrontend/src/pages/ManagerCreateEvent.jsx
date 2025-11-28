import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

const ManagerCreateEvent = () => {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    capacity: "",
    ticketPrice: "",
    category: "",
    imageUrl: ""
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const eventCategories = [
    { value: "CONCERT", label: "🎵 Concert" },
    { value: "CONFERENCE", label: "📊 Conference" },
    { value: "WORKSHOP", label: "🔧 Workshop" },
    { value: "SEMINAR", label: "📚 Seminar" },
    { value: "SPORTS", label: "⚽ Sports" },
    { value: "FESTIVAL", label: "🎪 Festival" },
    { value: "EXHIBITION", label: "🖼️ Exhibition" },
    { value: "THEATER", label: "🎭 Theater" },
    { value: "NETWORKING", label: "🤝 Networking" },
    { value: "OTHER", label: "📋 Other" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!eventData.name. trim()) newErrors.name = "Event name is required";
    if (!eventData.description.trim()) newErrors.description = "Description is required";
    if (!eventData.date) newErrors.date = "Event date is required";
    if (! eventData.time) newErrors. time = "Event time is required";
    if (!eventData.venue. trim()) newErrors.venue = "Venue is required";
    if (!eventData.capacity || eventData.capacity <= 0) newErrors.capacity = "Valid capacity is required";
    if (! eventData.ticketPrice || eventData.ticketPrice < 0) newErrors.ticketPrice = "Valid ticket price is required";
    if (!eventData.category) newErrors.category = "Event category is required";
    
    const selectedDate = new Date(`${eventData.date}T${eventData.time}`);
    const now = new Date();
    if (selectedDate <= now) {
      newErrors.date = "Event must be scheduled for a future date and time";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage("Please fix the errors below");
      return;
    }
    
    setSaving(true);
    setMessage("");

    try {
      const eventDateTime = `${eventData.date}T${eventData.time}:00`;
      
      // ✅ FIX: Round the price to 2 decimal places to avoid floating-point errors
      const price = Math.round(parseFloat(eventData.ticketPrice) * 100) / 100;
      
      const payload = {
        title: eventData.name. trim(),
        description: eventData.description.trim(),
        dateTime: eventDateTime,
        venue: eventData.venue.trim(),
        totalSeats: parseInt(eventData.capacity, 10),
        price: price  // ✅ Use the rounded price
      };

      console.log("🔄 Creating event with payload:", payload);
      console.log("💰 Original price:", eventData.ticketPrice);
      console.log("💰 Sent price:", price);

      const response = await axios.post(`${config. BACKEND_URL}/api/events`, payload);
      
      console. log("✅ Event created successfully!", response.data);
      console.log("💰 Returned price:", response.data.price);
      
      setMessage("Event created successfully!  Redirecting to dashboard...");
      
      setTimeout(() => {
        navigate("/manager");
      }, 2000);
      
    } catch (error) {
      console. error("❌ Event creation error:", error);
      console.error("❌ Error response:", error.response);
      
      let errorMsg = "Failed to create event. Please try again. ";
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (typeof errorData === 'string') {
          errorMsg = `Failed to create event: ${errorData}`;
        } else if (errorData.message) {
          errorMsg = `Failed to create event: ${errorData.message}`;
        } else if (errorData. error) {
          errorMsg = `Failed to create event: ${errorData.error}`;
        } else {
          errorMsg = `Failed to create event: ${JSON.stringify(errorData)}`;
        }
      }
      
      setMessage(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/manager");
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinTime = () => {
    const today = new Date();
    const selectedDate = new Date(eventData.date);
    
    if (selectedDate. toDateString() === today.toDateString()) {
      const hours = today.getHours(). toString().padStart(2, '0');
      const minutes = today.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return "";
  };

  const styles = {
    container: { 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #0891b2 0%, #0284c7 50%, #0369a1 100%)",
      padding: "0",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    },
    topBar: {
      background: "rgba(8, 145, 178, 0.95)",
      padding: "1. 25rem 2. 5rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backdropFilter: "blur(15px)",
      boxShadow: "0 4px 20px rgba(8, 145, 178, 0.3)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
    },
    brandSection: {
      display: "flex",
      alignItems: "center",
      gap: "1rem"
    },
    brandIcon: {
      width: "48px",
      height: "48px",
      background: "linear-gradient(135deg, #f59e0b, #d97706)",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.6rem",
      fontWeight: "bold",
      color: "white",
      boxShadow: "0 4px 12px rgba(245, 158, 11, 0.4)"
    },
    brandText: {
      color: "white",
      fontSize: "1.8rem",
      fontWeight: "700",
      margin: 0,
      letterSpacing: "-0.5px"
    },
    brandSubtext: {
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: "0.95rem",
      margin: 0,
      fontWeight: "500"
    },
    backBtn: {
      background: "rgba(255, 255, 255, 0.2)",
      color: "white",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      padding: "0. 75rem 1.5rem",
      borderRadius: "10px",
      fontSize: "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      backdropFilter: "blur(5px)"
    },
    mainContent: {
      padding: "3rem 2rem",
      display: "flex",
      justifyContent: "center"
    },
    createEventCard: {
      background: "rgba(255, 255, 255, 0.98)",
      borderRadius: "24px",
      boxShadow: "0 20px 60px rgba(8, 145, 178, 0.25)",
      padding: "3rem",
      maxWidth: "900px",
      width: "100%",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(255, 255, 255, 0.5)"
    },
    header: {
      marginBottom: "3rem",
      textAlign: "center",
      borderBottom: "2px solid #e5e7eb",
      paddingBottom: "2rem"
    },
    icon: {
      width: "90px",
      height: "90px",
      background: "linear-gradient(135deg, #0891b2, #0284c7)",
      borderRadius: "50%",
      fontSize: "2.8rem",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1. 5rem auto",
      fontWeight: "700",
      boxShadow: "0 8px 30px rgba(8, 145, 178, 0.5)",
      border: "5px solid rgba(255, 255, 255, 0.95)"
    },
    title: {
      fontSize: "2. 2rem",
      fontWeight: "800",
      color: "#0891b2",
      marginBottom: "0.75rem",
      letterSpacing: "-0.5px"
    },
    subtitle: {
      fontSize: "1.05rem",
      color: "#6b7280",
      lineHeight: "1.6"
    },
    form: {
      display: "grid",
      gap: "2rem"
    },
    formSection: {
      display: "grid",
      gap: "1. 75rem"
    },
    row: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "2rem"
    },
    fullWidth: {
      gridColumn: "1 / -1"
    },
    fieldGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.6rem"
    },
    label: {
      display: "flex",
      alignItems: "center",
      gap: "0. 5rem",
      fontSize: "0.95rem",
      color: "#0891b2",
      fontWeight: "700",
      letterSpacing: "0.3px"
    },
    required: {
      color: "#ef4444",
      fontSize: "1. 1rem"
    },
    input: {
      width: "100%",
      padding: "1rem 1.25rem",
      border: "2px solid #e5e7eb",
      borderRadius: "10px",
      fontSize: "1rem",
      fontFamily: "inherit",
      background: "#ffffff",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
      color: "#1f2937"
    },
    select: {
      width: "100%",
      padding: "1rem 1.25rem",
      border: "2px solid #e5e7eb",
      borderRadius: "10px",
      fontSize: "1rem",
      fontFamily: "inherit",
      background: "#ffffff",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
      cursor: "pointer",
      color: "#1f2937",
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230891b2' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center"
    },
    textarea: {
      width: "100%",
      padding: "1rem 1.25rem",
      border: "2px solid #e5e7eb",
      borderRadius: "10px",
      fontSize: "1rem",
      fontFamily: "inherit",
      background: "#ffffff",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
      resize: "vertical",
      minHeight: "140px",
      lineHeight: "1.6",
      color: "#1f2937"
    },
    error: {
      color: "#ef4444",
      fontSize: "0.85rem",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
      marginTop: "0.25rem"
    },
    buttonContainer: {
  display: "flex",
  justifyContent: "center",
  gap: "3rem",  // ✅ Changed to 3rem for more space
  marginTop: "2.5rem",
  paddingTop: "2rem",
  borderTop: "2px solid #e5e7eb",
  flexWrap: "wrap"  // ✅ Added this
},
    createBtn: {
      background: "linear-gradient(135deg, #10b981, #059669)",
      color: "white",
      border: "none",
      padding: "1.1rem 3. 5rem",
      borderRadius: "12px",
      fontWeight: "700",
      fontSize: "1. 05rem",
      cursor: "pointer",
      boxShadow: "0 4px 20px rgba(16, 185, 129, 0.4)",
      transition: "all 0.3s ease",
      minWidth: "200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem"
    },
    cancelBtn: {
      background: "#ffffff",
      color: "#0891b2",
      border: "2px solid #0891b2",
      padding: "1.1rem 3.5rem",
      borderRadius: "12px",
      fontWeight: "700",
      fontSize: "1.05rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      minWidth: "200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem"
    },
    message: {
      marginTop: "2rem",
      color: "#059669",
      fontWeight: "600",
      padding: "1. 25rem 1.5rem",
      background: "rgba(16, 185, 129, 0.1)",
      borderRadius: "12px",
      border: "1. 5px solid rgba(16, 185, 129, 0. 3)",
      textAlign: "center",
      fontSize: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem"
    },
    errorMessage: {
      marginTop: "2rem",
      color: "#dc2626",
      fontWeight: "600",
      padding: "1.25rem 1.5rem",
      background: "rgba(220, 38, 38, 0.1)",
      borderRadius: "12px",
      border: "1.5px solid rgba(220, 38, 38, 0.3)",
      textAlign: "center",
      fontSize: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem"
    }
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = "#0891b2";
    e.target.style.boxShadow = "0 0 0 4px rgba(8, 145, 178, 0.15)";
    e.target.style.transform = "translateY(-1px)";
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = "#e5e7eb";
    e.target.style.boxShadow = "none";
    e.target.style.transform = "translateY(0)";
  };

  const handleButtonHover = (e, isHover, buttonType) => {
    if (isHover) {
      e.target.style.transform = "translateY(-3px) scale(1.03)";
      if (buttonType === 'create') {
        e.target. style.boxShadow = "0 8px 30px rgba(16, 185, 129, 0.6)";
      } else if (buttonType === 'cancel') {
        e.target.style.background = "#f0fdfa";
        e.target. style.borderColor = "#0891b2";
      } else if (buttonType === 'back') {
        e.target. style.background = "rgba(255, 255, 255, 0.3)";
      }
    } else {
      e.target.style.transform = "translateY(0) scale(1)";
      if (buttonType === 'create') {
        e.target.style.boxShadow = "0 4px 20px rgba(16, 185, 129, 0.4)";
      } else if (buttonType === 'cancel') {
        e. target.style.background = "#ffffff";
        e.target.style.borderColor = "#0891b2";
      } else if (buttonType === 'back') {
        e.target. style.background = "rgba(255, 255, 255, 0.2)";
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.brandSection}>
          <div style={styles.brandIcon}>🎫</div>
          <div>
            <div style={styles. brandText}>Go Ticket</div>
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

      <div style={styles.mainContent}>
        <div style={styles.createEventCard}>
          <div style={styles.header}>
            <div style={styles.icon}>➕</div>
            <div style={styles.title}>Create New Event</div>
            <div style={styles.subtitle}>
              Fill in the details below to create an exciting new event for your audience
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formSection}>
              <div style={styles. row}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    🎭 Event Name <span style={styles.required}>*</span>
                  </label>
                  <input
                    style={styles.input}
                    type="text"
                    name="name"
                    value={eventData.name}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder="Enter event name"
                    maxLength="100"
                  />
                  {errors.name && (
                    <div style={styles.error}>
                      <span>⚠️</span> {errors.name}
                    </div>
                  )}
                </div>
                
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    📂 Category <span style={styles.required}>*</span>
                  </label>
                  <select
                    style={styles.select}
                    name="category"
                    value={eventData.category}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  >
                    <option value="">Select category</option>
                    {eventCategories.map(cat => (
                      <option key={cat. value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  {errors. category && (
                    <div style={styles.error}>
                      <span>⚠️</span> {errors.category}
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    📅 Event Date <span style={styles.required}>*</span>
                  </label>
                  <input
                    style={styles.input}
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    min={getMinDate()}
                  />
                  {errors.date && (
                    <div style={styles.error}>
                      <span>⚠️</span> {errors.date}
                    </div>
                  )}
                </div>
                
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    🕒 Event Time <span style={styles.required}>*</span>
                  </label>
                  <input
                    style={styles.input}
                    type="time"
                    name="time"
                    value={eventData.time}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    min={getMinTime()}
                  />
                  {errors. time && (
                    <div style={styles.error}>
                      <span>⚠️</span> {errors.time}
                    </div>
                  )}
                </div>
              </div>

              <div style={{...styles.fieldGroup, ... styles.fullWidth}}>
                <label style={styles.label}>
                  📍 Venue <span style={styles.required}>*</span>
                </label>
                <input
                  style={styles.input}
                  type="text"
                  name="venue"
                  value={eventData.venue}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Enter venue name and address"
                  maxLength="200"
                />
                {errors.venue && (
                  <div style={styles.error}>
                    <span>⚠️</span> {errors. venue}
                  </div>
                )}
              </div>

              <div style={styles. row}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    👥 Capacity <span style={styles.required}>*</span>
                  </label>
                  <input
                    style={styles.input}
                    type="number"
                    name="capacity"
                    value={eventData.capacity}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder="Enter maximum capacity"
                    min="1"
                    max="100000"
                  />
                  {errors.capacity && (
                    <div style={styles.error}>
                      <span>⚠️</span> {errors.capacity}
                    </div>
                  )}
                </div>
                
                <div style={styles.fieldGroup}>
                  <label style={styles. label}>
                    💰 Ticket Price (₹) <span style={styles.required}>*</span>
                  </label>
                  <input
                    style={styles.input}
                    type="number"
                    name="ticketPrice"
                    value={eventData.ticketPrice}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder="Enter ticket price"
                    min="0"
                    step="1"
                  />
                  {errors.ticketPrice && (
                    <div style={styles.error}>
                      <span>⚠️</span> {errors.ticketPrice}
                    </div>
                  )}
                </div>
              </div>

              <div style={{...styles.fieldGroup, ...styles.fullWidth}}>
                <label style={styles.label}>
                  📝 Event Description <span style={styles.required}>*</span>
                </label>
                <textarea
                  style={styles.textarea}
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Describe your event - what attendees can expect, schedule, special features, etc."
                  maxLength="1000"
                />
                {errors.description && (
                  <div style={styles.error}>
                    <span>⚠️</span> {errors.description}
                  </div>
                )}
              </div>

              <div style={{...styles.fieldGroup, ...styles.fullWidth}}>
                <label style={styles.label}>
                  🖼️ Event Image URL (Optional)
                </label>
                <input
                  style={styles.input}
                  type="url"
                  name="imageUrl"
                  value={eventData.imageUrl}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Enter image URL for your event poster"
                />
              </div>
            </div>

            <div style={styles.buttonContainer}>
              <button
                type="submit"
                style={styles.createBtn}
                disabled={saving}
                onMouseEnter={(e) => ! saving && handleButtonHover(e, true, 'create')}
                onMouseLeave={(e) => !saving && handleButtonHover(e, false, 'create')}
              >
                {saving ? (
                  <>
                    <span>🔄</span>
                    <span>Creating Event...</span>
                  </>
                ) : (
                  <>
                    <span>🎉</span>
                    <span>Create Event</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                style={styles. cancelBtn}
                onClick={handleBackToDashboard}
                disabled={saving}
                onMouseEnter={(e) => !saving && handleButtonHover(e, true, 'cancel')}
                onMouseLeave={(e) => !saving && handleButtonHover(e, false, 'cancel')}
              >
                <span>✕</span>
                <span>Cancel</span>
              </button>
            </div>
          </form>

          {message && (
            <div style={message.includes("success") ? styles.message : styles. errorMessage}>
              <span>{message. includes("success") ? "✅" : "❌"}</span>
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerCreateEvent;