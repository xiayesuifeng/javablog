package com.blog.mapper;

import com.blog.domain.Article;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface ArticleMapper {
    @Select("SELECT * FROM articles ORDER BY created_at DESC")
    @Results({
            @Result(column = "created_at", property = "createdAt"),
            @Result(column = "updated_at", property = "updatedAt"),
            @Result(column = "category_id",property = "categoryId")
    })
    List<Article> getArticles();

    @Select("SELECT * FROM articles WHERE id=#{id}")
    @Results({
            @Result(column = "created_at", property = "createdAt"),
            @Result(column = "updated_at", property = "updatedAt"),
            @Result(column = "category_id",property = "categoryId")
    })
    Article getArticleById(Integer id);

    @Select("SELECT * FROM articles WHERE category_id=#{id} ORDER BY created_at DESC")
    @Results({
            @Result(column = "created_at", property = "createdAt"),
            @Result(column = "updated_at", property = "updatedAt"),
            @Result(column = "category_id",property = "categoryId")
    })
    List<Article> getArticleByCategoryId(Integer id);

    @Select("SELECT uuid FROM articles WHERE id=#{id}")
    String getArticleUuidById(Integer id);

    @Insert("INSERT INTO articles(title,tag,category_id,uuid) VALUES(#{title},#{tag},#{categoryId},#{uuid})")
    void addArticle(Article article);

    @Update("UPDATE articles SET title=#{title},tag=#{tag},category_id=#{categoryId} WHERE id=#{id}")
    void editArticle(Article article);

    @Delete("DELETE FROM articles WHERE id=#{id}")
    void deleteArticle(Integer id);

    @Select("SELECT DISTINCT tag FROM articles")
    List<String> getTags();

    @Select("SELECT * FROM articles WHERE tag=#{tag} ORDER BY created_at DESC")
    @Results({
            @Result(column = "created_at", property = "createdAt"),
            @Result(column = "updated_at", property = "updatedAt"),
            @Result(column = "category_id",property = "categoryId")
    })
    List<Article> getArticleByTag(String tag);
}
