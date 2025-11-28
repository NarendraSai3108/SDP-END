package com.goticket. model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonFormat;  // ← ADD THIS IMPORT

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String description;
    private String venue;
    
    @Column(name = "date_time")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")  // ← ADD THIS ANNOTATION
    private LocalDateTime dateTime;
    
    private Double price;
    
    @Column(name = "total_seats")
    private Integer totalSeats;
    
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Seat> seats;

    @OneToMany(mappedBy = "event")
    @JsonIgnore
    private List<Booking> bookings;

    // Getters and Setters
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }
    
    public String getTitle() { 
        return title; 
    }
    
    public void setTitle(String title) { 
        this.title = title; 
    }
    
    public String getDescription() { 
        return description; 
    }
    
    public void setDescription(String description) { 
        this.description = description; 
    }
    
    public String getVenue() { 
        return venue; 
    }
    
    public void setVenue(String venue) { 
        this.venue = venue; 
    }
    
    public LocalDateTime getDateTime() { 
        return dateTime; 
    }
    
    public void setDateTime(LocalDateTime dateTime) { 
        this.dateTime = dateTime; 
    }
    
    public Double getPrice() { 
        return price; 
    }
    
    public void setPrice(Double price) { 
        this.price = price; 
    }
    
    public Integer getTotalSeats() { 
        return totalSeats; 
    }
    
    public void setTotalSeats(Integer totalSeats) { 
        this. totalSeats = totalSeats; 
    }
    
    public List<Seat> getSeats() { 
        return seats; 
    }
    
    public void setSeats(List<Seat> seats) { 
        this.seats = seats; 
    }
    
    public List<Booking> getBookings() { 
        return bookings; 
    }
    
    public void setBookings(List<Booking> bookings) { 
        this.bookings = bookings; 
    }
}