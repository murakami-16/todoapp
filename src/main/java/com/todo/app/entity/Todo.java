package com.todo.app.entity;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
	
	@Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "日付を正しい形式で入力して下さい。")
	private String time_limit;
	
	private String image;
	
	private String detail;
	
	@Pattern(regexp = "priority0[1-3]", message = "優先度以外を選択して下さい。")
	private String priority;
	
	private int done_flg2;
	
	private Long parent_id;
	
	@NotNull(message = "カテゴリ以外を選択してください")
	@Min(value = 1, message = "カテゴリ以外を選択してください")
	private Integer category_id;
	
	private String title_memo;
	
	private String parent_title;
}