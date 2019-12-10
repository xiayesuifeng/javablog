package com.blog.mapper;

import com.blog.domain.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface UserMapper {
    @Insert("INSERT INTO users(avatar,username,password) VALUES(#{avatar},#{username},#{password})")
    void addUser(User user);

    @Select("SELECT username FROM users WHERE id=#{id}")
    String getUsername(@Param("id") Integer id);

    @Select("SELECT avatar FROM users WHERE id=#{id}")
    String getUserAvatarById(@Param("id") Integer id);

    @Select("SELECT avatar FROM users WHERE username=#{username}")
    String getUserAvatar(@Param("username") String username);

    @Select("SELECT id FROM users WHERE username=#{username}")
    Integer getUserId(@Param("username") String username);

    @Select("SELECT * FROM users WHERE username=#{username} AND password=#{password}")
    List<User> findUser(User user);

    @Select("SELECT * FROM users WHERE username=#{username}")
    User findUserByUsername(@Param("username") String username);

    @Select("SELECT * FROM users")
    List<User> findAllUser();

    @Update("UPDATE users SET avatar=#{avatar},username=#{username},password=#{password}")
    void editUser(User user);

    @Delete("DELETE FROM users WHERE id=#{id}")
    void deleteUser(@Param("id") Integer id);
}