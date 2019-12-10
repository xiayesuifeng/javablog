package com.blog.service.impl;

import com.blog.domain.User;
import com.blog.mapper.UserMapper;
import com.blog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public String login(User user) {
        if (userMapper.findUser(user).size() == 0) {
            return "用户名或密码错误";
        }
        return null;
    }

    @Override
    public void addUser(User user) {
        userMapper.addUser(user);
    }

    @Override
    public void editUser(User user) {

    }

    @Override
    public void deleteUser(int id) {
        userMapper.deleteUser(id);
    }

    @Override
    public List<User> getUser() {
        return userMapper.findAllUser();
    }

    @Override
    public User getUser(String username) {
        return userMapper.findUserByUsername(username);
    }

    @Override
    public String getUserAvatar(String username) {
        return userMapper.getUserAvatar(username);
    }

    @Override
    public Integer getUserId(String username) {
        return userMapper.getUserId(username);
    }
}
