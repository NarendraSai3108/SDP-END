package com.goticket.service;

import com.goticket.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User registerUser(User user);

    boolean validateUser(String email, String password);

    Optional<User> getUserById(Long id);

    User updateUser(Long id, User updatedUser);

    void deleteUser(Long id);

    List<User> getAllUsers();

    User promoteToManager(Long id);

    // Use only this for email lookup
    Optional<User> getUserByEmail(String email);
}