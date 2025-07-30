/**
 *
 */
$(function(){
// 配列→オブジェクト変換関数
function toObject(arr) {
	const obj = {};
	arr.forEach(({name, value}) => {
		obj[name] = value;
	});
	return obj;
}

//完了済みの個数取得・表示
  let doneCount = $('#donetodes').children("tr").length;
  $('#done_count').text(doneCount);

//更新処理
$('.todo input, .todo select').change(function () {
	const todo = $(this).parents('.todo');
	const id = todo.find('input[name="id"]');
	const title = todo.find('input[name="title"]');
	const timeLimit = todo.find('input[name="time_limit"]');
	const isDone = todo.find('input[name="done_flg"]').prop("checked");
	const priority = todo.find('select[name="priority"]');
	const category = todo.find('select[name="category_id"]');
	const isDone2 = todo.find('input[name="done_flg2"]').prop("checked");
	const parentId = todo.find('input[name="parent_id"]').val();
	let doneFlg = isDone ? 1 : 0;
	let doneFlg2 = isDone2 ? 1 : 0;

	const params = {
		id: id.val(),
		title: title.val(),
		time_limit: timeLimit.val(),
		priority: priority.val(),
		category_id: category.val(),
		parent_id: parentId,
		done_flg: doneFlg,
		done_flg2: doneFlg2
	};

	// Ajaxで更新＋バリデーション判定
	$.post("/update", params)
		.then(function (res) {
			if (!res.success) {
				const message = res.errors.map(e => e.defaultMessage).join('\n');
				alert(message);
				
				return;
			}
			
			// parent_id を復元
			if (res.todo.parent_id) {
				todo.attr('data-parent-id', res.todo.parent_id);
				todo.addClass('child-task');
			} else {
				todo.removeAttr('data-parent-id');
				todo.removeClass('child-task');
			}
			
			// 完了ボタン押下後の動作（DOM更新）
			let doneCount = parseInt($('#done_count').text(), 10) || 0;
			
			if ($(this).prop('name') === "done_flg") {
				if (isDone) {
					const parentId = todo.attr('data-parent-id');
					if (parentId) {
						const parentRow = $(`tr.todo input[name="id"][value="${parentId}"]`).closest('tr');
						const isParentChecked = parentRow.find('input[name="done_flg"]').prop('checked');
						if (!isParentChecked) {
							// 親が完了していない場合は移動をスキップ（チェックは入れたまま）
							console.log('親タスクが完了していないため、子タスクは移動しません。');
							return;
						}
					}
					
					$(todo).appendTo('#donetodes');
					todo.find('input[name="title"]').css('text-decoration', 'line-through');
					todo.find('input[name="time_limit"]').hide();
					todo.find('select[name="priority"]').hide();
					todo.find('select[name="category_id"]').hide();
					todo.find('input[name="done_flg2"]').hide();
					todo.find('button[data-target="#modalC"]').hide();
					doneCount++;
				} else {
					$(todo).appendTo('#todes');
					todo.find('input[name="title"]').css('text-decoration', 'none');
					todo.find('input[name="time_limit"]').show();
					todo.find('select[name="priority"]').show();
					todo.find('select[name="category_id"]').show();
					todo.find('input[name="done_flg2"]').show();
					todo.find('button[data-target="#modalC"]').show();
					
					if (!isDone) {
						// 親タスクなら末尾に、子タスクなら親タスクの直後に再挿入
						const parent_id = todo.attr('data-parent-id');
						let moved = true;
						
						if (parent_id) {
							// 子タスク → 親の状態を確認
							const parentRow = $(`tr.todo input[name="id"][value="${parent_id}"]`).closest('tr');
							const isParentChecked = parentRow.find('input[name="done_flg"]').prop('checked');
							
							if (!isParentChecked) {
								console.log('親が未完了のため、子タスクを移動させません');
								moved = false;
							}
						}
						
						if (moved) {
							if (parent_id) {
								// 子タスク → 親の直後に移動
								const parentRow = $(`tr.todo input[name="id"][value="${parent_id}"]`).closest('tr');
								todo.insertAfter(parentRow);
							} else {
								// 親タスク → todesに移動（既に移動済みだけど再度念のため）
								todo.appendTo('#todes');
							}
							
							// 移動した場合だけカウントを減らす
							doneCount--;
							$("#done_count").text(doneCount);
						}
					}
				}
				$("#done_count").text(doneCount);
			}
		}.bind(this)) // ← bindして this を維持
		.fail(function () {
			alert('通信エラーが発生しました。もう一度お試しください。');
		});
});

//完了済みタスク表示/非表示切り替え
$('.button_for_show').click(function(){
    let showState = $('#done_table').css('display');
    if(showState == "none") {
        $('#done_table').show();
        $(this).css({ transform: ' rotate(225deg)','bottom':'-4px' });
    }else{
        $('#done_table').hide();
        $(this).css({ transform: ' rotate(45deg)','bottom':'4px' });
    }
})

// 子タスク追加ボタンがクリックされた時
$('.btn.btn-light').click(function() {
	// 親タスクのIDを取得
	var parentId = $(this).closest('tr').find('input[name="id"]').val();

	// モーダル内の親タスクIDフィールドに設定
	$('#add_form_c input[name="parent_id"]').val(parentId);
});

// モーダルを開いたときに親IDをセット（子タスク用）
$('[data-target="#modalC"]').click(function(){
	const $tr = $(this).closest('tr'); // この行のtrを取得
	const parentId = $tr.find('input[name="id"]').val();
	
	const $modal = $tr.find('#modalC');
	
	$modal.find('input[name="parent_id"]').val(parentId);
});

//追加処理
$('#add_t').click(function() {
	const params1 = $('#add_form_a').serializeArray();
	
	// idを含んでいたら削除（これが最も重要）
	const filtered = params1.filter(p => p.name !== 'id');
	
	const data = {};
		filtered.forEach(p => {
			if (p.name === 'id') return;  // 念のための保険
			data[p.name] = p.value;
		});

		console.log("送信データ:", data);  // ←ここでidが入っていないか必ずチェック
	
	$.post('/add', data)
		.then(function(res) {
			console.log('レスポンス:', res);
			if(res.success){
				// タスク行を複製し、新規タスクを反映
				const clone = $('#todes tr:first').clone(true);
				clone.find('input[name="id"]').val(res.todo.id);
				clone.find('input[name="title"]').val(res.todo.title);
				clone.find('input[name="time_limit"]').val(res.todo.time_limit);
				clone.find('select[name="priority"]').val(res.todo.priority);
				clone.find('select[name="category_id"]').val(res.todo.category_id);
				//$('#todes').append(clone[0]);
				
				if (res.todo.parent_id) {
					clone.attr('data-parent-id', res.todo.parent_id);      // DOM属性に追加
					clone.addClass('child-task');                          // 見た目にも class 追加
				}
				
				// 親の直下に追加する
				const parentRow = $(`tr.todo input[name="id"][value="${res.todo.parent_id}"]`).closest('tr');
				if (parentRow.length > 0) {
					clone.insertAfter(parentRow);
				} else {
					$('#todes').append(clone[0]);
				}
				
				// モーダルを閉じてフォームを初期化
				$('#modalAdd').modal('hide');
				$('#add_form_a')[0].reset();
			} else {
				// バリデーションエラー表示
				const message = res.errors.map(e => e.defaultMessage).join('\n');
				alert(message);
			}
		})
		.fail(function() {
			alert('通信に失敗しました。もう一度お試しください。');
		});
});

$('#add_c').click(function() {
	const params2 = $('#add_form_c').serializeArray();
	
	// idを含んでいたら削除（これが最も重要）
	const filtered = params2.filter(p => p.name !== 'id');
	
	const data = {};
		filtered.forEach(p => {
			if (p.name === 'id') return;  // 念のための保険
			data[p.name] = p.value;
		});

		console.log("送信データ:", data);  // ←ここでidが入っていないか必ずチェック
	
	$.post('/add', data)
		.then(function(res) {
			if(res.success){
				console.log('レスポンス:', res);
				// タスク行を複製し、新規タスクを反映
				const clone = $('#todes tr:first').clone(true);
				clone.find('input[name="id"]').val(res.todo.id);
				clone.find('input[name="title"]').val(res.todo.title);
				clone.find('input[name="time_limit"]').val(res.todo.time_limit);
				clone.find('select[name="priority"]').val(res.todo.priority);
				clone.find('select[name="category_id"]').val(res.todo.category_id);
				$('#todes').append(clone[0]);
				
				// モーダルを閉じてフォームを初期化
				$('#modalC').modal('hide');
				$('#add_form_c')[0].reset();
			} else {
				// バリデーションエラー表示
				const message = res.errors.map(e => e.defaultMessage).join('\n');
				alert(message);
			}
		})
		.fail(function() {
			alert('通信に失敗しました。もう一度お試しください。');
		});
});

// 親タスク表示
$(document).on('click', '[data-toggle="modal"][data-target="#modalC"]', function() {
	const $tr = $(this).closest('tr');
	const parentId = $tr.find('input[name="id"]').val();
	const parentTitle = $tr.find('input[name="title"]').val();
	
	const $modal = $('#modalC'); // ← 外にある共通モーダルを取得
	
	$modal.find('input[name="parent_id"]').val(parentId);
	$modal.find('input[name="parent_title"]').val(parentTitle);
});

//削除処理
$('#delete').click(function(){
	// 完了済み（donetodes）を一括削除
    $.post("/delete").done(function(){
        $('#donetodes').empty();
        $('#done_count').text(0);
    })
})

// 親チェックボックス変更時に子タスクのチェックを連動させる
$('input[name="done_flg"]').change(function() {
	const $parentRow = $(this).closest('tr');
	const parentId = $parentRow.find('input[name="id"]').val();
	const isChecked = $(this).prop('checked');
	
	// 子タスクのdone_flgも連動
	$(`tr.todo[data-parent-id="${parentId}"]`).each(function () {
		$(this).find('input[name="done_flg"]').prop('checked', isChecked).trigger('change');
	});
});

$('#delete_done_flg2').click(function() {
    if (confirm("done_flg2 がチェックされたタスクを全て削除しますか？")) {
        $.post("/deleteDoneFlg2")
            .done(function() {
                // DOM上の done_flg2 チェック済み行を削除
                $('.todo').filter(function() {
                    return $(this).find('input[name="done_flg2"]').prop('checked');
                }).remove();

                // カウントも再計算（必要に応じて）
                let newDoneCount = $('#donetodes').children('tr').length;
                $('#done_count').text(newDoneCount);
            })
            .fail(function() {
                alert("削除に失敗しました。");
            });
    }
});

$(function() {
	// 初期化時に、親タスクの下にトグル行を追加
	$('tr.todo').each(function () {
		const $row = $(this);
		const todoId = $row.find('input[name="id"]').val();
		
		// この親IDに紐づく子タスクがあるか確認
		const hasChildren = $(`tr.todo[data-parent-id="${todoId}"]`).length > 0;
		
		if ($row.attr('data-parent-id') == null && hasChildren) {
			const toggleRow = $(`
				<tr class="toggle-row" data-parent-id="${todoId}">
					<td style="width: 2rem; padding-left: 0.5rem; border: none;">
						<button class="btn btn-sm toggle-children-btn" style="border: none; background: none; box-shadow: none;" data-parent-id="${todoId}">
							▼
						</button>
					</td>
					<td colspan="6" style="border: none;"></td>
				</tr>
			`);
			
			$row.after(toggleRow);
		}
	});

	// トグルボタンの処理
	$(document).on('click', '.toggle-children-btn', function () {
		const parentId = $(this).data('parent-id');
		const $children = $(`tr.todo[data-parent-id="${parentId}"]`);
		const isVisible = $children.first().is(':visible');
		
		if (isVisible) {
			$children.hide();
			$(this).text('▶');
		} else {
			$children.show();
			$(this).text('▼');
		}
	});
});

})