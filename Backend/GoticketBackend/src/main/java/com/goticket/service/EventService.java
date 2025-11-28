package com.goticket.service;

import com.goticket.model.Event;
import com.goticket.model.Seat;

import java.util.List;
import java.util.Optional;

public interface EventService {
    Event createEvent(Event event);
    Event updateEvent(Long id, Event event);
    void deleteEvent(Long id);

    List<Event> getAllEvents();
    Optional<Event> getEventById(Long id);

    List<Seat> getSeatsForEvent(Long eventId);
    List<Seat> getAvailableSeatsForEvent(Long eventId);
}
