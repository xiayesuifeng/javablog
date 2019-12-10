package com.blog.mapper;

import com.blog.domain.Comment;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface CommentMapper {
    @Select("SELECT * FROM comments WHERE id=#{id}")
    @Results({
            @Result(column = "create_time",property = "createTime"),
            @Result(column = "uid", property = "uid"),
            @Result(column = "uid",property = "username",one = @One(select = "com.blog.mapper.UserMapper.getUsername")),
            @Result(column = "uid",property = "avatar",one = @One(select = "com.blog.mapper.UserMapper.getUserAvatarById"))
    })
    List<Comment> getComments(@Param("id") Integer id);

    @Insert("INSERT INTO comments (id,uid,comment) VALUES (#{id},#{uid},#{comment})")
    void addComment(Comment comment);

    @Delete("DELETE FROM comments WHERE cid=#{cid}")
    void deleteComment(@Param("cid") Integer cid);

    @Delete("DELETE FROM comments WHERE id=#{id}")
    void deleteComments(@Param("id") Integer id);
}
