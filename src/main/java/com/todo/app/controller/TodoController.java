package com.todo.app.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.todo.app.entity.Todo;
import com.todo.app.mapper.TodoMapper;

@Controller
public class TodoController {
	
	private static final Logger logger = LoggerFactory.getLogger(TodoController.class);
	
	@Autowired
	TodoMapper todoMapper;

	@RequestMapping(value="/")
	public String index(Model model) {
		logger.info("アクセス： /");

//		List<Todo> list = todoMapper.selectAll();

		List<Todo> list = todoMapper.selectIncomplete();
		List<Todo> doneList = todoMapper.selectComplete();
		
		logger.debug("list:" + list.size() + "件");
		logger.debug("doneList:" + doneList.size() + "件");
		
		model.addAttribute("todos",list);
		model.addAttribute("doneTodos",doneList);

		return "index";
	}

	@RequestMapping(value="/add")
	@ResponseBody
	public Todo add(Todo todo) {
		logger.info("アクセス：/add");
		
		todoMapper.add(todo);
		return todo;
	}

	@RequestMapping(value="/update")
	@ResponseBody
	public void update(Todo todo) {
		logger.info("アクセス：/update");
		
		todoMapper.update(todo);
	}

	@RequestMapping(value="/delete")
	@ResponseBody
	public void delete() {
		logger.info("アクセス：/delete");
		
		todoMapper.delete();
	}

}
