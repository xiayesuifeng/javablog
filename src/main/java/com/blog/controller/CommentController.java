package com.blog.controller;

import com.blog.core.Result;
import com.blog.core.ResultGenerator;
import com.blog.domain.Comment;
import com.blog.service.CommentService;
import com.blog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping("/api/comment")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public Result getComment(@PathVariable("id") int id) {
        return ResultGenerator.genSuccessResult("comments", commentService.getComments(id));
    }

    @PostMapping
    public Result addComment(@RequestBody Comment comment, WebRequest webRequest) {
        String username = (String) webRequest.getAttribute("username",WebRequest.SCOPE_SESSION);
        Integer userId = userService.getUserId(username);
        if (userId == null)
            return ResultGenerator.genFailResult("获取用户ID失败");
        else{
            comment.setUid(userId);
            commentService.addComment(comment);
            return ResultGenerator.genSuccessResult();
        }
    }

    @DeleteMapping("/{id}")
    public Result deleteComment(@PathVariable("id") int id) {
        commentService.deleteComment(id);
        return ResultGenerator.genSuccessResult();
    }
}
