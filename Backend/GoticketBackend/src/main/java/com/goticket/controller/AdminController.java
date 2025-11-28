package com.goticket.controller;

import com.goticket.model.User;
import com.goticket.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    // 🔹 Add a new user (with role = USER)
    @PostMapping("/addUser")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        user.setRole("USER"); // force role USER
        return ResponseEntity.ok(userService.registerUser(user));
    }

    // 🔹 Add a new manager
    @PostMapping("/addManager")
    public ResponseEntity<User> addManager(@RequestBody User user) {
        user.setRole("MANAGER"); // force role MANAGER
        return ResponseEntity.ok(userService.registerUser(user));
    }

    // 🔹 Get all users (any role)
    @GetMapping("/allUsers")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // 🔹 Get only managers
    @GetMapping("/allManagers")
    public ResponseEntity<List<User>> getAllManagers() {
        List<User> managers = userService.getAllUsers()
                                         .stream()
                                         .filter(user -> "MANAGER".equalsIgnoreCase(user.getRole()))
                                         .collect(Collectors.toList());
        return ResponseEntity.ok(managers);
    }

    // 🔹 Delete user by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("✅ User deleted successfully");
    }

    // 🔹 Health-check or confirmation route
    @GetMapping("/check")
    public ResponseEntity<String> checkExecution() {
        return ResponseEntity.ok("🚀 Backend is running fine! 🚀");
    }

}
