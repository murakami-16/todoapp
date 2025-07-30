package com.todo.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.todo.app.entity.Todo;

@Mapper
public interface TodoMapper {

	public List<Todo> selectAll();

	public List<Todo> selectIncomplete();

	public List<Todo> selectComplete();

	public void add(Todo todo);

	public void update(Todo todo);

	public void delete();
	
	// 追加：done_flg2=1 の行を一括削除
	public void deleteDoneFlg2();
	
	public List<Todo> selectIncompleteWithOrder();

}