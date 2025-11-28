package com.goticket.controller;

import com.goticket.model.Event;
import com.goticket.model.Seat;
import com.goticket.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    // 🔹 Create a new event (manager/admin)
    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        return ResponseEntity.ok(eventService.createEvent(event));
    }

    // 🔹 Get all events (users/managers/admins)
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // 🔹 Get event by ID
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id)
                .orElse(null);
        if (event == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(event);
    }

    // 🔹 Update event (manager/admin)
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        return ResponseEntity.ok(eventService.updateEvent(id, updatedEvent));
    }

    // 🔹 Delete event (manager/admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok("✅ Event deleted successfully");
    }
    @GetMapping("/{id}/seats")
    public ResponseEntity<List<Seat>> getSeatsForEvent(@PathVariable Long id) {
        List<Seat> seats = eventService.getSeatsForEvent(id);
        return ResponseEntity.ok(seats);
    }
}
