package com.blog.service;

import com.blog.domain.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserService {

    String login(User user);

    void addUser(User user);

    void editUser(User user);

    void deleteUser(int id);

    List<User> getUser();

    User getUser(String username);

    String getUserAvatar(String username);

    Integer getUserId(@Param("username") String username);
}
