package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    List<User> getAllUsers();
    void addUser(User user);
    void deleteUser(int userId);
    User getUserById(int id);
    User getUserByName(String name);
    User findByUsername(String username);
    User findUserById(int id);
}
