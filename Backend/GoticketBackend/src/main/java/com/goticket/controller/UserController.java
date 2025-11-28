package com.goticket.controller;

import com.goticket.model.User;
import com.goticket.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Health check endpoint - only matches /api/users/check
    @GetMapping("/check")
    public Map<String, String> check() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        response.put("message", "Backend is reachable and CORS is working!");
        return response;
    }

    // Get all users - matches /api/users
    @GetMapping("")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get user by id (only if id is a number) - matches /api/users/123
    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id).orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get user by email - matches /api/users/by-email?email=someone@example.com
    @GetMapping("/by-email")
    public ResponseEntity<?> getUserByEmail(@RequestParam("email") String email) {
        try {
            User user = userService.getUserByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not foundd"));
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(404).body(error);
        }
    }

    // Update user by id (only if id is a number)
    @PutMapping("/{id:[0-9]+}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        try {
            // Log the incoming request for debugging
            System.out.println("=== Profile Update Request ===");
            System.out.println("User ID: " + id);
            System.out.println("Update Data - Name: " + updatedUser.getName());
            System.out.println("Update Data - Email: " + updatedUser.getEmail());
            System.out.println("Update Data - Password: " + (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty() ? "[PROVIDED]" : "[NOT PROVIDED]"));
            
            User updated = userService.updateUser(id, updatedUser);
            
            System.out.println("=== Profile Update Success ===");
            System.out.println("Updated User - Name: " + updated.getName());
            System.out.println("Updated User - Email: " + updated.getEmail());
            
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            System.out.println("=== Profile Update Error ===");
            System.out.println("Error: " + e.getMessage());
            
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("message", "Failed to update user profile");
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Delete user by id (only if id is a number)
    @DeleteMapping("/{id:[0-9]+}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Handles CORS preflight OPTIONS requests for /{id}
    @RequestMapping(value = "/{id:[0-9]+}", method = RequestMethod.OPTIONS)
    public void options() {
        // Handles CORS preflight requests
    }
}