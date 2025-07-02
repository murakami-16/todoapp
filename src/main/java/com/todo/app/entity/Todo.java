package com.todo.app.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class Todo {

	
	private long id;
	
	@NotBlank(message = "タスク名が入力されていません。")
	@Size(max = 30, message = "タスク名は{max}文字までです。")
	private String title;
	
	private int done_flg;
	
	@Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "日付が入力されていません。")
	private String time_limit;
	
}