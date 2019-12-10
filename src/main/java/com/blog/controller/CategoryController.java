package com.blog.controller;

import com.blog.core.Result;
import com.blog.core.ResultCode;
import com.blog.core.ResultGenerator;
import com.blog.domain.Category;
import com.blog.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public Result getCategories() {
        return ResultGenerator.genSuccessResult("categorys", categoryService.findAllCategory());
    }

    @GetMapping("/{id}")
    public Result getCategoryByID(@PathVariable("id") int id) {
        Category category = categoryService.findCategoryById(id);
        if (category == null)
            return new Result().setCode(ResultCode.NOT_FOUND);
        else
            return ResultGenerator.genSuccessResult("category", category);
    }

    @PostMapping
    public Result addCategory(@RequestBody Category category) {
        categoryService.addCategory(category.getName());
        return ResultGenerator.genSuccessResult();

    }

    @PutMapping("/{id}")
    public Result editCategory(@PathVariable("id") int id, @RequestBody Category category) {
        category.setId(id);
        categoryService.editCategory(category);
        return ResultGenerator.genSuccessResult();
    }

    @DeleteMapping("/{id}")
    public Result deleteCategory(@PathVariable("id") int id) {
        categoryService.deleteCategory(id);
        return ResultGenerator.genSuccessResult();

    }
}
