package com.blog.controller;

import com.blog.core.Result;
import com.blog.core.ResultGenerator;
import com.blog.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tag")
public class TagController {

    @Autowired
    private ArticleService articleService;

    @GetMapping
    public Result getTags() {
        return ResultGenerator.genSuccessResult("tags",articleService.findAllTag());
    }

    @GetMapping("/{tag}")
    public Result getTag(@PathVariable("tag") String tag) {
        return ResultGenerator.genSuccessResult("articles",articleService.findArticleByTag(tag));
    }
}
