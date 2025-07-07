package com.todo.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.todo.app.entity.Category;
import com.todo.app.entity.Todo;
import com.todo.app.mapper.CategoryMapper;
import com.todo.app.mapper.TodoMapper;

@Controller
public class TodoController {
	
	private static final Logger logger = LoggerFactory.getLogger(TodoController.class);
	
	@Autowired
	TodoMapper todoMapper;
	
	@Autowired
	CategoryMapper categoryMapper;

	@RequestMapping(value="/")
	public String index(Model model) {
		logger.info("アクセス： /");

//		List<Todo> list = todoMapper.selectAll();

		List<Todo> list = todoMapper.selectIncomplete();
		List<Todo> doneList = todoMapper.selectComplete();
		List<Category> categories = categoryMapper.findAllCategory();
		
		logger.debug("list:" + list.size() + "件");
		logger.debug("doneList:" + doneList.size() + "件");
		
		model.addAttribute("todos", list);
		model.addAttribute("doneTodos", doneList);
		model.addAttribute("categories", categories);

		return "index";
	}
	
	@RequestMapping(value="/add")
	@ResponseBody
	public Map<String, Object> add(@Valid Todo todo, BindingResult result){
		logger.info("アクセス：/add");
		
		Map<String, Object> response = new HashMap<>();
		
		if (result.hasErrors()) {
			response.put("success", false);
			response.put("errors", result.getAllErrors());
			
			return response;
		}
		
		todoMapper.add(todo);
		response.put("success", true);
		response.put("todo", todo);
		
		return response;
	}
	
	@RequestMapping(value="/update")
	@ResponseBody
	public Map<String, Object> update(@Valid Todo todo, BindingResult result){
		logger.info("アクセス：/add");
		
		Map<String, Object> response = new HashMap<>();
		
		if (result.hasErrors()) {
			response.put("success", false);
			response.put("errors", result.getAllErrors());
			
			return response;
		}
		
		todoMapper.update(todo);
		response.put("success", true);
		response.put("todo", todo);
		
		return response;
	}

	@RequestMapping(value="/delete")
	@ResponseBody
	public void delete() {
		logger.info("アクセス：/delete");
		
		todoMapper.delete();
	}

}
