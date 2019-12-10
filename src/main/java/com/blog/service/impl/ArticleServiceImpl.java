package com.blog.service.impl;

import com.blog.domain.Info;
import com.blog.mapper.ArticleMapper;
import com.blog.domain.Article;
import com.blog.mapper.CommentMapper;
import com.blog.mapper.MarkdownMapper;
import com.blog.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleMapper articleMapper;

    @Autowired
    private MarkdownMapper markdownMapper;

    @Autowired
    private CommentMapper commentMapper;

    @Override
    public List<Article> findAllArticle() {
        return articleMapper.getArticles();
    }

    @Override
    public Article findArticleById(int id) {
        return articleMapper.getArticleById(id);
    }

    @Override
    public List<Article> findArticleByCategoryId(int id) {
        return articleMapper.getArticleByCategoryId(id);
    }

    @Override
    public String findArticleByUUID(String uuid, String mode) {
        String md = markdownMapper.getMarkdown(uuid);
        if (mode.equals("description_md")) {
            if (md.length() > 100)
                md = md.substring(0, 100);
        }

        return md;
    }

    @Override
    public List<String> findAllTag() {
        return articleMapper.getTags();
    }

    @Override
    public List<Article> findArticleByTag(String tag) {
        return articleMapper.getArticleByTag(tag);
    }

    @Override
    public void addArticle(Article article) {
        String uuid = UUID.randomUUID().toString();
        article.setUuid(uuid);
        Info info = Info.getInstance();
        if (!info.getUseCategory())
            article.setCategoryId(Info.getInstance().getCategoryId());
        articleMapper.addArticle(article);
        markdownMapper.addMarkdown(uuid,article.getContext());
    }

    @Override
    public String editArticle(Article article) {
        String uuid = articleMapper.getArticleUuidById(article.getId());
        if (uuid.isEmpty())
            return "get uuid fail";
        Info info = Info.getInstance();
        if (!info.getUseCategory())
            article.setCategoryId(Info.getInstance().getCategoryId());
        articleMapper.editArticle(article);
        markdownMapper.editMarkdown(uuid,article.getContext());
        return null;
    }

    @Override
    public String deleteArticle(int id) {
        String uuid = articleMapper.getArticleUuidById(id);
        if (uuid.isEmpty())
            return "get uuid fail";

        articleMapper.deleteArticle(id);
        markdownMapper.deleteMarkdown(uuid);
        commentMapper.deleteComments(id);
        return null;
    }
}
