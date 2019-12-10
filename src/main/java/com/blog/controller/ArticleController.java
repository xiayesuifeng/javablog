package com.blog.controller;

import com.blog.core.Result;
import com.blog.core.ResultGenerator;
import com.blog.domain.Article;
import com.blog.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/article")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping
    public Result getArticles() {
        return ResultGenerator.genSuccessResult("articles", articleService.findAllArticle());
    }

    @GetMapping("/id/{id}")
    public Result getArticleByID(@PathVariable("id") int id) {
        return ResultGenerator.genSuccessResult("article", articleService.findArticleById(id));
    }

    @GetMapping("/category/{category_id}")
    public Result getArticleByCategory(@PathVariable("category_id") int id) {
        return ResultGenerator.genSuccessResult("articles", articleService.findArticleByCategoryId(id));
    }

    @GetMapping("/uuid/{uuid}/{mode}")
    public Result getArticleByUUID(@PathVariable("uuid") String uuid, @PathVariable("mode") String mode) {
        String data = articleService.findArticleByUUID(uuid, mode);
        return ResultGenerator.genSuccessResult("markdown", data);
    }

    @PostMapping
    public Result addArticle(@RequestBody Article article) {
        articleService.addArticle(article);
        return ResultGenerator.genSuccessResult();
    }

    @PutMapping("/{id}")
    public Result editArticle(@RequestBody Article article, @PathVariable("id") int id) {
        article.setId(id);
        String result = articleService.editArticle(article);
        if (result == null)
            return ResultGenerator.genSuccessResult();
        else
            return ResultGenerator.genFailResult(result);
    }

    @DeleteMapping("/{id}")
    public Result deleteArticle(@PathVariable("id") int id) {
        String result = articleService.deleteArticle(id);
        if (result == null)
            return ResultGenerator.genSuccessResult();
        else
            return ResultGenerator.genFailResult(result);
    }
}
