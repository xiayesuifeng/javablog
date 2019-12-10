package com.blog.mapper;

import com.blog.domain.Category;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface CategoryMapper {
    @Select("SELECT * FROM categories")
    List<Category> getCategories();

    @Select("SELECT * FROM categories WHERE id=#{id}")
    Category getCategoryById(@Param("id") Integer id);

    @Select("SELECT id FROM categories WHERE name='other'")
    Integer getOhterCategoryId();

    @Insert("INSERT INTO categories(name) VALUES(#{name})")
    Integer addCategory(@Param("name") String name);

    @Update("UPDATE categories SET name=#{name} WHERE id=#{id}")
    void editCategory(Category category);

    @Delete("DELETE FROM categories WHERE id=#{id}")
    void deleteCategory(@Param("id") Integer id);
}
