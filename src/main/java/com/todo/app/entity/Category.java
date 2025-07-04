package com.todo.app.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class Category {
	
	private Integer category_id;
	
	private String title_category;

}
