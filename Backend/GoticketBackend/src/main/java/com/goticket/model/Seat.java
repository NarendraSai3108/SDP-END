package com.goticket.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore; // <-- 1. ADD THIS IMPORT

@Entity
@Table(name = "seats")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seatNumber;

    private boolean booked;

    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonIgnore // <-- 2. ADD THIS SINGLE LINE OF CODE
    private Event event;

    // ... (All your getters and setters stay exactly the same)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public boolean isBooked() { return booked; }
    public void setBooked(boolean booked) { this.booked = booked; }
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
}