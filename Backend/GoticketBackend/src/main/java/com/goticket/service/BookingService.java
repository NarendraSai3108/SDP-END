package com.goticket.service;

import com.goticket.model.Booking;

import java.util.List;
import java.util.Optional;

public interface BookingService {
    Booking bookTickets(Booking booking);
    void cancelBooking(Long id);

    List<Booking> getAllBookings();
    Optional<Booking> getBookingById(Long id);
    List<Booking> getBookingsForUser(Long userId);
}
