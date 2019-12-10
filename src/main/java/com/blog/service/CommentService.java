package com.blog.service;

import com.blog.domain.Comment;

import java.util.List;

public interface CommentService {
    List<Comment> getComments(int id);

    void addComment(Comment comment);

    void deleteComment(int cid);

    void deleteComments(int id);
}
