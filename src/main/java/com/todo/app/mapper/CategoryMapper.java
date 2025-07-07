package com.todo.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.todo.app.entity.Category;

@Mapper
public interface CategoryMapper {
	
	public List<Category> findAllCategory();
	
	Category findById(Integer category_id);

}
