package com.blog.service;

import com.blog.domain.Article;

import java.util.List;

public interface ArticleService {
    List<Article> findAllArticle();

    Article findArticleById(int id);
    List<Article> findArticleByCategoryId(int id);
    String findArticleByUUID(String uuid,String mode);

    List<String> findAllTag();
    List<Article> findArticleByTag(String tag);

    void addArticle(Article article);
    String editArticle(Article article);
    String deleteArticle(int id);

}
