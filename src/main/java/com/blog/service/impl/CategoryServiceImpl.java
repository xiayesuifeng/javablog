package com.blog.service.impl;

import com.blog.domain.Category;
import com.blog.mapper.CategoryMapper;
import com.blog.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public List<Category> findAllCategory() {
        return categoryMapper.getCategories();
    }

    @Override
    public Category findCategoryById(int id) {
        return categoryMapper.getCategoryById(id);
    }

    @Override
    public void addCategory(String name) {
        categoryMapper.addCategory(name);
    }

    @Override
    public void editCategory(Category category) {
        categoryMapper.editCategory(category);
    }

    @Override
    public void deleteCategory(int id) {
        categoryMapper.deleteCategory(id);
    }
}
