package com.blog.controller;

import com.blog.domain.Info;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {

    @RequestMapping("/api/info")
    public Info getInfo() {
        return Info.getInstance();
    }
}
