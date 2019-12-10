package com.blog.service;

import com.blog.domain.Category;

import java.util.List;

public interface CategoryService {
    List<Category> findAllCategory();

    Category findCategoryById(int id);

    void addCategory(String name);

    void editCategory(Category category);

    void deleteCategory(int id);
}
