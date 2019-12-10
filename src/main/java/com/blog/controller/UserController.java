package com.blog.controller;

import com.blog.core.Result;
import com.blog.core.ResultCode;
import com.blog.core.ResultGenerator;
import com.blog.domain.User;
import com.blog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Result login(@RequestBody User user, WebRequest webRequest) {
        String result = userService.login(user);
        if (result == null) {
            webRequest.setAttribute("username", user.getUsername(), WebRequest.SCOPE_SESSION);
            return ResultGenerator.genSuccessResult("user",user);
        } else {
            return ResultGenerator.genFailResult(result);
        }
    }

    @PostMapping("/logout")
    public Result logout(WebRequest webRequest) {
        webRequest.removeAttribute("username", WebRequest.SCOPE_SESSION);
        return ResultGenerator.genSuccessResult();
    }

    @PostMapping("/signup")
    public Result signUp(@RequestBody User user) {
        userService.addUser(user);
        return ResultGenerator.genSuccessResult();
    }


    @GetMapping("/user")
    public Result getUser() {
        return ResultGenerator.genSuccessResult("users", userService.getUser());
    }

    @GetMapping("/user/{username}")
    public Result getUserByUsername(@PathVariable("username") String username,WebRequest webRequest) {
        String username1 = (String) webRequest.getAttribute("username", WebRequest.SCOPE_SESSION);
        if (username.equals(username1)){
            User user = userService.getUser(username);
            if (user == null)
                return new Result().setCode(ResultCode.NOT_FOUND).setMessage("用户不存在");
            else
                return ResultGenerator.genSuccessResult("user", userService.getUser(username));
        }else{
            return new Result().setCode(ResultCode.UNAUTHORIZED).setMessage("无权限");
        }
    }

    @GetMapping("/user/avatar")
    public Result getUserAvatar(WebRequest webRequest) {
        String username = (String) webRequest.getAttribute("username", WebRequest.SCOPE_SESSION);
        return ResultGenerator.genSuccessResult("avatar",userService.getUserAvatar(username));
    }

    @PutMapping("/user/{id}")
    public Result editUser(@RequestBody User user, @PathVariable("id") int id) {
        userService.editUser(user);
        return ResultGenerator.genSuccessResult();
    }

    @DeleteMapping("/user/{id}")
    public Result deleteUser(@PathVariable("id") int id) {
        userService.deleteUser(id);
        return ResultGenerator.genSuccessResult();
    }
}
