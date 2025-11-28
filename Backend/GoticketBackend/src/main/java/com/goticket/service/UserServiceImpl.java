package com.goticket.service;

import com.goticket.model.User;
import com.goticket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User registerUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public boolean validateUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isPresent() && user.get().getPassword().equals(password);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            // Update name if provided and not empty
            if (updatedUser.getName() != null && !updatedUser.getName().trim().isEmpty()) {
                user.setName(updatedUser.getName().trim());
            }
            
            // Update email only if provided and different (though frontend doesn't allow email changes)
            if (updatedUser.getEmail() != null && !updatedUser.getEmail().trim().isEmpty()) {
                user.setEmail(updatedUser.getEmail().trim());
            }
            
            // Update password only if provided and not empty
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().trim().isEmpty()) {
                user.setPassword(updatedUser.getPassword());
            }
            
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User promoteToManager(Long id) {
        return userRepository.findById(id).map(user -> {
            user.setRole("MANAGER");
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Correct implementation matching the interface!
    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}