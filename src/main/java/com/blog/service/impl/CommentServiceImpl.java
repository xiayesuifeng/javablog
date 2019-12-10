package com.blog.service.impl;

import com.blog.domain.Comment;
import com.blog.mapper.CommentMapper;
import com.blog.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentMapper commentMapper;

    @Override
    public List<Comment> getComments(int id) {
        return commentMapper.getComments(id);
    }

    @Override
    public void addComment(Comment comment) {
        commentMapper.addComment(comment);
    }

    @Override
    public void deleteComment(int cid) {
        commentMapper.deleteComment(cid);
    }

    @Override
    public void deleteComments(int id) {
        commentMapper.deleteComments(id);
    }
}
