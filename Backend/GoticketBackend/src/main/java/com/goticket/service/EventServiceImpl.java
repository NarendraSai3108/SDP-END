package com.goticket.service;

import com.goticket.model.Event;
import com.goticket.model.Seat;
import com.goticket.repository.EventRepository;
import com.goticket.repository.SeatRepository;
import com.goticket.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Override
    public Event createEvent(Event event) {
        Event savedEvent = eventRepository.save(event);

        // Auto-generate seats if needed
        if (event.getSeats() != null) {
            for (Seat seat : event.getSeats()) {
                seat.setEvent(savedEvent);
                seatRepository.save(seat);
            }
        }
        return savedEvent;
    }

    @Override
    public Event updateEvent(Long id, Event updatedEvent) {
        return eventRepository.findById(id).map(event -> {
            event.setTitle(updatedEvent.getTitle());
            event.setDescription(updatedEvent.getDescription());
            event.setVenue(updatedEvent.getVenue());
            event.setDateTime(updatedEvent.getDateTime());
            return eventRepository.save(event);
        }).orElseThrow(() -> new RuntimeException("Event not found"));
    }

    @Override
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    @Override
    public List<Seat> getSeatsForEvent(Long eventId) {
        return seatRepository.findByEventId(eventId);
    }

    @Override
    public List<Seat> getAvailableSeatsForEvent(Long eventId) {
        return seatRepository.findByEventId(eventId).stream()
                .filter(seat -> !seat.isBooked())
                .collect(Collectors.toList());
    }
}
