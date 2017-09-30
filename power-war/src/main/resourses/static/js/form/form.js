/*表单管理*/
var flag = true;
var editIndex = undefined;
var editIndex_dt = undefined;
var editerId =  new Array();
var excuteSql;
var isediter=false;
var rownumber=0;
var name_en = "";//表单英文名
var isFirstSearch=true;//是否第一次查询
/**
 * 初始化事件
 */
function init(){
	$("#form_table").datagrid({
		url: '/T_B_FORM_DEF/queryPage.action?sort.C_SROT_NO=ASC',
        method: 'post',
        fitColumns: true,
        singleSelect: false,
        rownumbers: true,
        showFooter: true,
        pagination:true,
        sortable:true,
        remoteSort: false,
        selectOnCheck: true,
        checkOnSelect: true,
        onDblClickRow: function (rowIndex, rowData) { 
          fnSearchFiled(rowData);
        }
	});
	
	
	$("#filed_table").datagrid({
		rownumbers: true,
		fitColumns : true,
		onClickRow: onClickRow,
		toolbar: '#tb',
		singleSelect: true
	});
	$("#data_table").datagrid({
		rownumbers: true,
		fitColumns : true,
		onClickRow: onClickRow_dt,
		toolbar: '#di_tb',
		singleSelect: true
	});
	var p = $('#form_table').datagrid('getPager');    
	$(p).pagination({    
	    pageSize: 10,//每页显示的记录条数，默认为10  
	    //pageList:[5,10,15,20],//每页显示几条记录  
	    beforePageText: '第',//页数文本框前显示的汉字   
	    afterPageText: '页    共 {pages} 页',   
	    displayMsg: '当前显示 {from} - {to} 条记录    共 {total} 条记录',   
	    onBeforeRefresh:function(){    
	        $(this).pagination('loading');//正在加载数据中...  
	        $(this).pagination('loaded'); //数据加载完毕  
	    }    
	});
	$.extend($.fn.validatebox.defaults.rules, {
        minLength: {
            validator: function (value, param) {
                return value.length >= param[0];
            },
            message: '请输入至少（2）个字符！'
        },
        chinese: {
            validator: function (value) {
                return /^[\Α-\￥]+$/i.test(value);
            },
            message: '请输入中文！'
        },
        existCheckName: {
            validator: function (value) {
            	var exist =false;
            	$.ajax({
                    url: '/t_b_form_def/search.action',
                    async:false,
                    type:"POST",
                    dataType:"json", 
                    data:{"search.C_NAME_EN*eq":value},
                    success: function(result){
                    	if(result == ""){
                    		exist = true;
                    	}
                    	if(name_en == value){
                    		exist = true;
                    	}
                  }});
                  return exist;
            },
            message: '您输入的表英文名已经存在，请重新输入！'
        },
        english: {
            validator: function (value) {
                return /^[A-Z_a-z0-9]+$/i.test(value);
            },
            message: '请输入英文！'
        },
        existCheckField: {
            validator: function(value,key){
              var formCode = "T_"+$("#C_NAME_EN").val();
              var exist =false;
                  $.ajax({
                    url: '/t_b_filed_def/search.action',
                    async:false,
                    type:"POST",
                    dataType:"json", 
                    data:{"search.C_NAME_EN*eq":value,"search.C_FORM_CODE*eq":formCode.toUpperCase()},
                    success: function(result){
                    	if(result == ""){
                    		$.ajax({
                                url: '/t_b_filed_def/search.action',
                                async:false,
                                type:"POST",
                                dataType:"json", 
                                data:{"search.C_NAME_EN*eq":value,"search.C_FORM_CODE*eq":'T_B_BASE'},
                                success: function(result){
                                  if(result == ""){
                                    exist = true;
                                  }else{
                                	  $.fn.validatebox.defaults.rules.existCheckField.message ="该字段为系统字段，不允许添加！";
                                  }
                                  if(isediter){
                                    exist = true;
                                  }
                              }});
                    	}else{
                    		$.fn.validatebox.defaults.rules.existCheckField.message ="当前字段已经存在，请重新输入！";
                    		exist = false;
                    	}
                    	if(isediter){
                    		exist = true;
                    	}
                  }});
                  return exist;
            },
            message: ''
          }
  });
	
	$('#tt').tabs({
	    border:false,
	    onSelect:function(title,index){
			fnSearchInfo(index);
			
	    }
	});
	
}

function fnSearchInfo(value){
	if(!flag&&value=="2"&&isFirstSearch){
		$.ajax({
		    url:'/t_b_form_event/search.action',
		    type:'POST', //GET
		    async:false,    //或false,是否异步
		    data:{'search.C_FORM_ID*eq':$("#form_id").val()},
		    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
		    success:function(data,textStatus,jqXHR){
		    	$('#event_form').form('load',data[0]);
		    	isFirstSearch = false;
		    },
		    error:function(xhr,textStatus){
		        
		    },
		})
	}
}

/**
 * 保存数据信息
 */
function fnSaveInfo(){
	if($("#C_NAME_EN").val()==""){
		$.messager.alert('提示','<div class="div7"></div><div class="div1">表英文名不能为空！</div>');
		return;
	}
	if(!$("#form_form").form('validate')){
		$.messager.alert('提示','<div class="div7"></div><div class="div1">表英文名重复，请重新输入！</div>');
		return;
	}
	var rows = $("#filed_table").datagrid("getRows");
	if(rows == ""){
		$.messager.alert('提示','<div class="div7"></div><div class="div1">字段信息不能为空！</div>');
		return;
	}
	if(!accept()){
		return;
	};
	$('#data_dlg').dialog('close');
	
	var C_NAME_EN = $('#C_NAME_EN').val();
	if(flag){
		$("#C_CODE").val("T_"+C_NAME_EN.toUpperCase());
	}
	var desc = $('#describe').textbox('getValue');
	if(desc ==""){
		var name_cn = $('#name_cn').textbox('getValue');
		$('#describe').textbox('setValue',name_cn);
	}
	excuteSql = []
	for(var i=0;i<editerId.length;i++){
		var id = editerId[i];
		var rows=$('#filed_table').datagrid('getRows');
		var rowData = rows[id];
		if(rowData==undefined){
			break;
		}
		var filed = "C_"+rowData.C_NAME_EN;
		var tableName = "T_"+C_NAME_EN;
		var sql = "alter table "+tableName.toUpperCase()+" add "+filed.toUpperCase()+" "+rowData.C_TYPE;
		if(rowData.C_LENGTH>0){
			sql = sql+"("+rowData.C_LENGTH+")";
		}
		excuteSql[i] = sql;
	}
	$.ajax({
	    url:'/T_B_FORM_DEF/save.action',
	    type:'POST', //GET
	    async:false,    //或false,是否异步
	    data:$("#form_form").serialize(),
	    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
	    success:function(result,textStatus,jqXHR){
	    	var data = result.data;
	    	if(data.C_ID==undefined){
	    		var formId = $("#form_id").val();
	    		data.C_ID = formId;
	    		$("#eventFormId").val(formId);
	    	}else{
	    		$("#eventFormId").val(data.C_ID);
	    	}
		 	$("#form_table").datagrid('reload');
		 	for(var i=0;i<rows.length;i++){
		 		var C_NAME_EN = "C_"+rows[i].C_NAME_EN;
	 			rows[i].C_CODE = C_NAME_EN.toUpperCase();
	 			rows[i].C_FORM_ID = data.C_ID;
	 			rows[i].C_FORM_CODE = data.C_CODE;
	 			rows[i].C_ID = '';
	 		}
	 		fnSaveFiled(rows);
	    },
	    error:function(xhr,textStatus){
	       
	    },
	})
}

/**
 * 保存字段信息
 * @param rows
 */
function fnSaveFiled(rows){
	if(rows[0].C_FORM_ID!='' && rows[0].C_FORM_ID!=undefined){
		$.ajax({
		    url:'/T_B_FILED_DEF/deleteBatch.action',
		    type:'POST', //GET
		    async:false,    //或false,是否异步
		    data:{'search.C_FORM_ID*eq':rows[0].C_FORM_ID},
		    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
		    success:function(data,textStatus,jqXHR){
		    	fnInsertFiled(rows);
		    },
		    error:function(xhr,textStatus){
		        
		    },
		})
	}else{
		fnInsertFiled(rows);
	}
}

/**
 * 添加字段信息
 * @param rows 字段信息
 */
function fnInsertFiled(rows){
	$.ajax({
	    url:'/T_B_FILED_DEF/insertBatch.action',
	    type:'POST', //GET
	    async:false,    //或false,是否异步
	    data:{'data':JSON.stringify(rows)},
	    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
	    success:function(data,textStatus,jqXHR){
	    	$.messager.alert('提示',"<div class='div3'></div><div class='div1'>添加表单成功!</div>");
	    	if(!flag&&excuteSql!=''){
	    		fnUpdateColumn();
	    	}
	    	fnSaveEventInfo();
	    },
	    error:function(xhr,textStatus){
	    	$.messager.alert('提示',"<div class='div4'></div><div class='div1'>添加表单失败!</div>");
	    	fnDeleteForm(rows[0].C_FORM_ID);
	    },
	})
}

/**
 * 保存事件数据
 */
function fnSaveEventInfo(){
	$.ajax({
	    url:'/t_b_form_event/save.action',
	    type:'POST', //GET
	    async:false,    //或false,是否异步
	    data:$("#event_form").serialize(),
	    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
	    success:function(result,textStatus,jqXHR){
	    	
	    },
	    error:function(xhr,textStatus){
	       
	    },
	})
}

/**
 * 更新表字段信息
 */
function fnUpdateColumn(){
	$.ajax({
	    url:'/form/updateColumn.action',
	    type:'POST', //GET
	    async:false,    //或false,是否异步
	    data:{'data':JSON.stringify(excuteSql)},
	    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
	    success:function(data,textStatus,jqXHR){
	    	
	    },
	    error:function(xhr,textStatus){
	    	$.messager.alert('提示',"<div class='div4'></div><div class='div1'>操作失败!</div>");
	    },
	})
}

/**
 * 添加字段信息失败后删除表单信息
 * @param formId 表单编号
 */
function fnDeleteForm(formId){
	$.ajax({
	    url:'/t_b_form_def/delete.action',
	    type:'POST', //GET
	    async:false,    //或false,是否异步
	    data:{'ID':formId},
	    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
	    success:function(data,textStatus,jqXHR){
	    	$("#form_table").datagrid('reload');
	    },
	    error:function(xhr,textStatus){
	    	
	    },
	})
}

/**
 * 修改数据信息
 */
function updateInfo(){
	flag = false;
	isFirstSearch = true;
	editerId =  new Array();
	var rows = $('#form_table').datagrid('getSelections');
	if(rows == null || rows == ""){
		$.messager.alert('提示','<div class="div7"></div><div class="div1">请选择需要修改的数据！</div>');
		return;
	}
	if(rows.length>1){
		$.messager.alert('提示','<div class="div7"></div><div class="div1">只能选择一条数据进行修改！</div>');
		return;
	}
	name_en = rows[0].C_NAME_EN;
	$('#form_form').form('load',rows[0]);
	$.ajax({
	    url:'/T_B_FILED_DEF/search.action',
	    type:'POST', //GET
	    async:false,    //或false,是否异步
	    data:{'search.C_FORM_ID*eq':rows[0].C_ID,"sort.C_SROT_NO":'ASC'},
	    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
	    success:function(data,textStatus,jqXHR){
	    	$('#data_dlg').dialog('open');
	    	$('#filed_table').datagrid('loadData',data);
	    	$("#tt").tabs("select",0);
	    },
	    error:function(xhr,textStatus){
	        
	    },
	})
}

/**
 * 删除数据项信息
 */
function deleteInfo(){
	var rows = $('#form_table').datagrid('getSelections');
	if(rows == null || rows == ""){
		$.messager.alert('提示','<div class="div7"></div><div class="div1">请选择需要删除的数据！</div>');
		return;
	}
	var cids = [];
	var codes = [];
	for(var i=0;i<rows.length;i++){
		if(rows[i].C_ID=='0'){
			$.messager.alert('提示','<div class="div7"></div><div class="div1">系统表不允许删除！</div>');
			return;
		}
		cids[i] = rows[i].C_ID;
		codes[i] = rows[i].C_CODE;
	}
	var cidStr = JSON.stringify(cids);
	var codeStr = JSON.stringify(codes);
    if (rows){
        $.messager.confirm('确认','<div class="div7"></div><div class="div1">删除选中数据信息吗？</div>',function(r){
            if (r){
            	for(var i=0;i<rows.length;i++){
            		//删除字段数据
            		$.ajax({
                	    url:'/T_B_FILED_DEF/deleteBatch.action',
                	    type:'POST', //GET
                	    async:false,    //或false,是否异步
                	    data:{ "search.C_FORM_ID*eq":rows[i].C_ID},
                	    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                	    success:function(data,textStatus,jqXHR){
                	              
                	    },
                	    error:function(xhr,textStatus){
                	        
                	    },
                	})
            	}
            	//删除表单数据
            	$.post('/T_B_FORM_DEF/deleteByCids.action',
                		{
                	     "C_ID":cidStr
                		},
                		function(result){
                			if (result.success){
                				$.messager.alert('提示',"<div class='div3'></div><div class='div1'>"+result.title+"!</div>");
                				$("#form_table").datagrid('reload');
                            } else {
                                $.messager.show({
                                    title: '错误',
                                    msg: result.title
                                });
                            }
                },'json');
            	//删除表结构
            	$.post('/form/deleteTable.action',
                		{
                	     "codes":codeStr
                		},
                		function(result){
                			if (result.success){
                				$.messager.alert('提示',"<div class='div3'></div><div class='div1'>"+result.title+"!</div>");
                				$("#form_table").datagrid('reload');
                            } else {
                                $.messager.show({
                                    title: '错误',
                                    msg: result.title
                                });
                            }
                },'json');
            }
        });
    } else {
    	$.messager.alert('提示','<div class="div4"></div><div class="div1">没有选中数据信息！</div>');
    }
}

/**
 * 添加事件
 */
function addInfo(){
	flag = true;
	$('#form_form').form('clear');
	$('#event_form').form('clear');
	$('#data_dlg').dialog('open');
	$('#filed_table').datagrid('loadData',{rows: []});
	$('#filed_table').datagrid('reload');  
	$('#C_ENABLE').combobox('setValue','1');
	$('#C_ISSYSTEM').combobox('setValue','0');
	$("#tt").tabs("select",0);
}

/**
 * 查询字段信息
 * @param rowdata
 */
function fnSearchFiled(rowdata){
	$.ajax({
	    url:'/T_B_FILED_DEF/search.action',
	    type:'POST', //GET
	    async:false,    //或false,是否异步
	    data:{'search.C_FORM_ID*eq':rowdata.C_ID,"sort.C_SROT_NO":'ASC'},
	    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
	    success:function(data,textStatus,jqXHR){
	    	$('#show_filed').datagrid('loadData',data);
	    	$('#filed_dlg').dialog('open');
	    },
	    error:function(xhr,textStatus){
	        
	    },
	})
}

/**
 * 搜索事件
 */
function searchInfo(){
	$("#search_form").form('clear');
	$('#search_dlg').dialog('open');
}

/**
 * 搜索框查询按钮事件
 */
function fnSearchFormInfo(){
	$('#search_dlg').dialog('close');
	$.ajax({
	    url:'/T_B_FORM_DEF/queryPage.action?sort.C_SROT_NO=ASC',
	    type:'POST', //GET
	    async:false,    //或false,是否异步
	    data:$("#search_form").serialize(),
	    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
	    success:function(data,textStatus,jqXHR){
	    	$('#form_table').datagrid('loadData',data);
	    },
	    error:function(xhr,textStatus){
	        
	    },
	})
}

/**
 * 创建数据表
 */
function createTable(){
	var rows = $('#form_table').datagrid('getSelections');
	if(rows == null || rows == ""){
		$.messager.alert('提示','<div class="div7"></div><div class="div1">请选择需要创建数据表的表单！</div>');
		return;
	}
	var cids = [];
	for(var i=0;i<rows.length;i++){
		if(rows[i].C_ID=='0'){
			$.messager.alert('提示','<div class="div7"></div><div class="div1">系统表不允许创建！</div>');
			return;
		}
		cids[i] = rows[i].C_ID;
	}
	var cidStr = JSON.stringify(cids);
    if (rows){
        $.messager.confirm('确认','<div class="div7"></div><div class="div1">创建选中表单数据表吗？</div>',function(r){
            if (r){
            	
            	//删除表单数据
            	$.post('/form/createTable.action',
                		{
                	     "cids":cidStr
                		},
                		function(result){
                			if (result.success){
                				$.messager.alert('提示',"<div class='div3'></div><div class='div1'>"+result.title+"</div>");
                            } else {
                                $.messager.show({
                                    title: '错误',
                                    msg: result.title
                                });
                            }
                },'json');
            }
        });
    } else {
    	$.messager.alert('提示','没有选中表单！');
    }
}


function endEditing(){
	if (editIndex == undefined){
		return true;
	}
	if ($('#filed_table').datagrid('validateRow', editIndex)){
		var ed = $('#filed_table').datagrid('getEditor', {index:editIndex,field:'C_TYPE'});
		if(ed != null){
			var typename = $(ed.target).combobox('getText');
			$('#filed_table').datagrid('getRows')[editIndex]['C_TYPENAME'] = typename;
		}
		var st = $('#filed_table').datagrid('getEditor', {index:editIndex,field:'C_SHOWTYPE'});
		if(st != null){
			var showtypename = $(st.target).combobox('getText');
			$('#filed_table').datagrid('getRows')[editIndex]['C_SHOWTYPENAME'] = showtypename;
		}
		
		$('#filed_table').datagrid('endEdit', editIndex);
		var tt = $('#filed_table').datagrid('getRows')[editIndex];
		if(tt != undefined){
			var cname = $('#filed_table').datagrid('getRows')[editIndex]['C_NAME_CN'];
			var desc = $('#filed_table').datagrid('getRows')[editIndex]['C_DESCRIBE'];
			if(desc == ""){
				$('#filed_table').datagrid('updateRow',{
					index: editIndex,
					row: {
						C_DESCRIBE: cname,
					}
				});
			}
		}
		editIndex = undefined;
		return true;
	} else {
		$.messager.alert('提示','<div class="div7"></div><div class="div1">输入的信息不能保存，请重新输入！</div>');
		return false;
	}
}

function onClickRow(e_index){
	rownumber = e_index;
	if (editIndex != e_index){
		isediter=true;
		if (endEditing()){
			$('#filed_table').datagrid('selectRow', e_index)
					.datagrid('beginEdit', e_index);
			if(!flag){
				//将字段英文名设置为只可读模式
				var cellEdit = $('#filed_table').datagrid('getEditor', {index:e_index,field:'C_NAME_EN'});
	            var $input = cellEdit.target; // 得到文本框对象
	            $input.prop('readonly',true); // 设值只读
			}
			editIndex = e_index;
		} else {
			$('#filed_table').datagrid('selectRow', editIndex);
		}
	}
}

function append(){
	if($("#C_NAME_EN").val()==""){
		$.messager.alert('提示','<div class="div7"></div><div class="div1">请先输入表单英文名！</div>');
		return false;
	}
	if (endEditing()){
		var sort = $('#filed_table').datagrid('getRows').length+1;
		$('#filed_table').datagrid('appendRow',{C_ENABLE:'1',C_ISNULL:'1',C_SROT_NO:sort,C_TYPE:"varchar2",C_SHOWTYPE:"text",C_LENGTH:255});
		$('#filed_table').datagrid('updateRow',{index:sort,_operate:"121"});
		editIndex = $('#filed_table').datagrid('getRows').length-1;
		$('#filed_table').datagrid('selectRow', editIndex)
				.datagrid('beginEdit', editIndex);
		editerId.push(editIndex);
		rownumber = editIndex;
		isediter = false;
	}
}

function removeit(){
	if (editIndex == undefined){return}
	$('#filed_table').datagrid('cancelEdit', editIndex)
			.datagrid('deleteRow', editIndex);
	editIndex = undefined;
}

function accept(){
	if (endEditing()){
		$('#filed_table').datagrid('acceptChanges');
		var aaa = $('#filed_table').datagrid('getRows')[editIndex];
		return true;
	}else{
		return false;
	}
}

//function fnInitCn(row){
//	return '<a style="color:blue" href="#" onclick="fnOpenDialog()">'+row.C_NAME_CN+'</a>';
//}


function endEditing_dt(){
	if (editIndex_dt == undefined){
		return true;
	}
	if ($('#data_table').datagrid('validateRow', editIndex_dt)){
		$('#data_table').datagrid('endEdit', editIndex_dt);
		editIndex_dt = undefined;
		return true;
	} else {
		$.messager.alert('提示','<div class="div7"></div><div class="div1">输入的信息不能保存，请重新输入！</div>');
		return false;
	}
}

function onClickRow_dt(e_index){
	if (editIndex_dt != e_index){
		isediter=true;
		if (endEditing_dt()){
			$('#data_table').datagrid('selectRow', e_index)
					.datagrid('beginEdit', e_index);
			editIndex_dt = e_index;
		} else {
			$('#data_table').datagrid('selectRow', editIndex_dt);
		}
	}
}

function append_dt(){
	if (endEditing_dt()){
		$('#data_table').datagrid('appendRow',{});
		editIndex_dt = $('#data_table').datagrid('getRows').length-1;
		$('#data_table').datagrid('selectRow', editIndex_dt)
				.datagrid('beginEdit', editIndex_dt);
	}
}

function removeit_dt(){
	if (editIndex_dt == undefined){return}
	$('#data_table').datagrid('cancelEdit', editIndex_dt)
			.datagrid('deleteRow', editIndex_dt);
	editIndex_dt = undefined;
}

function accept_dt(){
	if (endEditing_dt()){
		$('#data_table').datagrid('acceptChanges');
		var aaa = $('#data_table').datagrid('getRows')[editIndex_dt];
		return true;
	}else{
		return false;
	}
}

/**
 * @author 光芒
 * 
 * @requires jQuery
 * 
 * 格式化日期时间
 */
function DateTimeFormatter(value) {
	if (value == null || value == '') {
		return '';
	}
	var dt;
	if (value instanceof Date) {
		dt = value;
	} else {
		dt = new Date(value);

	}
	return dt.format("yyyy-MM-dd hh:mm:ss"); //扩展的Date的format方法(
}


Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1, // month
		"d+": this.getDate(), // day
		"h+": this.getHours(), // hour
		"m+": this.getMinutes(), // minute
		"s+": this.getSeconds(), // second
		"q+": Math.floor((this.getMonth() + 3) / 3), // quarter
		"S": this.getMilliseconds()
		// millisecond
	}
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
			.substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	return format;
}
  
