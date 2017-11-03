/*应用模块管理*/

/**
 * 初始化事件
 */
function init(){
	fnInitGrid();
	
	$("#C_LAYERTYPE").combobox({
		onChange: function (n,o) {
           if(n=="1" || n=="3"){
        	   $('#app_layer').show();
        	   $('#app_group').hide();
           }else if(n=="2"){
        	   $.ajax({
       	    	//请求地址                               
       	       url:"/T_POWERLAYERS/search.action",
       		   data:{"search.C_LAYERTYPE*eq":'1'},//设置请求参数 
       		   type:"post",//请求方法
//       		   async:false, 
       		   dataType:"json",//设置服务器响应类型
       		  //success：请求成功之后执行的回调函数   data：服务器响应的数据
       		   success:function(data){
       			   $('#app_layer').hide();
       			   $('#app_group').show();
       			$("#C_LAYER2").empty();
       			  var option=[];
       			   for(var i in data){
       				option.push({"id":data[i].C_LAYER,"text":data[i].C_LAYERNAME});
       			   }
       			   $("#C_LAYER2").combobox("loadData", option);
       		   }
       	   });
           	
        	   
        	   
           }
		}
	});
}

/**
 * 初始化表格
 */
function fnInitGrid() {
	$("#app_table").datagrid({
		url : '/T_POWERLAYERS/queryPage.action?sort.C_ID=ASC',
		method : 'post',
		singleSelect : false,
		rownumbers : true,
		sortable : true,
		selectOnCheck : true,
		checkOnSelect : true,
		fitColumns : true,
		striped:true,
		nowrap : false,
		pagination : true,
		pageSize:20
	});
	
    $('#start_time,#end_time').datebox({
		formatter: function(date) {
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			var d = date.getDate();
			return y + '-' + (m < 10 ? ('0' + m) : m) + '-'
			+ (d < 10 ? ('0' + d) : d);
		},
		parser: function(date) {
			if (!date)
				return new Date();
			var ss = (date.split('-'));
			var y = parseInt(ss[0], 10);
			var m = parseInt(ss[1], 10);
			var d = parseInt(ss[2], 10);
			if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
				return new Date(y, m - 1, d);
			} else {
				return new Date();
			}
		}
	});
    
    var p = $('#app_table').datagrid('getPager');    
    $(p).pagination({    
//        pageSize: 20,//每页显示的记录条数，默认为10  
        //pageList:[5,10,15,20],//每页显示几条记录  
        beforePageText: '第',//页数文本框前显示的汉字   
        afterPageText: '页    共 {pages} 页',   
        displayMsg: '当前显示 {from} - {to} 条记录    共 {total} 条记录',   
        onBeforeRefresh:function(){    
            $(this).pagination('loading');//正在加载数据中...  
            $(this).pagination('loaded'); //数据加载完毕  
        }    
    });    
}

/**
 * 添加应用
 */
function fnAddApp(){
	$('#app_form').form('clear');
	$('#app_dlg').dialog('open');
}


/**
 * 保存图层信息
 */
function fnSaveApp(){
	//判断添加的是图层还是图层组 重新拼接保存的图层信息
	var flag = $('#C_LAYERTYPE').combobox('getValue');
	var layer=""
    var layerID=""
	if(flag=="1" || flag=="3"){
		layerID = 'C_LAYER1';
		layer = $('#C_LAYER1').textbox('getValue');
	}else if(flag == "2"){
		layerID = 'C_LAYER2';
		var layers = $('#C_LAYER2').combobox('getValues');
		for(var i=0;i<layers.length-1;i++){
			layer+=layers[i]+','
		}
		layer+=layers[layers.length-1];
	}
	var name = $('#C_LAYERNAME').textbox('getValue');
	if(name==""|| name.trim()==""){
		$('#C_LAYERNAME').focus();
		swal('图层名称不能为空','',"warning");
		return;
	}else if(layer == ""){
		$('#'+layerID).focus();
		swal('图层不能为空','',"warning");
		return;
	}
	$.post('/T_POWERLAYERS/save.action',
		{C_LAYERNAME:$('#C_LAYERNAME').textbox('getValue'),
		C_LAYERURL:$('#C_LAYERURL').textbox('getValue'),
		C_SERVICETYPE:$('#C_SERVICETYPE').textbox('getValue'),
		C_BBOX:$('#C_BBOX').textbox('getValue'),
		C_LAYERTYPE:$('#C_LAYERTYPE').combobox('getValue'),
		C_LAYER:layer,
		C_IMAGE:$('#C_IMAGE').textbox('getValue'),
		C_ISDEFAULTLAYER:$('#C_ISDEFAULTLAYER').combobox('getValue'),
		C_ISSHOW:$('#C_ISSHOW').combobox('getValue'),
		C_ID:$('#C_ID').val()
		},
		function(result){
			$('#app_dlg').dialog('close');
				$.messager.alert('提示',"<div class='div3'></div><div class='div1'>"+result.title+"!</div>");
				$("#app_table").datagrid("reload")
	},"json");
}

/**
 * 修改
 */
function fnUpdateApp(){
	var rows = $('#app_table').datagrid('getSelections');
	if(rows == null || rows == ""){
		$.messager.alert('提示','<div class="div4"></div><div class="div1">请选择需要修改的数据！</div>');
		return;
	}
	if(rows.length>1){
		$.messager.alert('提示','<div class="div4"></div><div class="div1">只能选择一条数据进行修改！</div>');
		return;
	}
	if(rows[0].C_ID == '0'){
		$.messager.alert('提示','<div class="div4"></div><div class="div1">基础模块信息不允许修改！</div>');
		return;
	}
	$('#app_form').form('clear');
	$('#app_dlg').dialog('open');
	$('#app_form').form('load',rows[0]);
	if(rows[0].C_LAYERTYPE=="2"){
		$('#app_layer').hide();
		$('#app_group').shwo();
		$('#C_LAYER2').combobox('setValues',rows[0].C_LAYER.split(","));
	}
	$('#C_ID').val(rows[0].C_ID);
	$('#C_LAYER1').textbox('setValue',rows[0].C_LAYER);
}

function fnDeleteApp(){
	var rows = $('#app_table').datagrid('getSelections');
	if(rows == null || rows == ""){
		$.messager.alert('提示','<div class="div4"></div><div class="div1">请选择需要删除的数据！</div>');
		return;
	}
	var cids = [];
	for(var i=0;i<rows.length;i++){
		if(rows[i].C_ID == '0'){
			$.messager.alert('提示','<div class="div4"></div><div class="div1">基础模块信息不允许修改！</div>');
			return;
		}
		cids[i] = rows[i].C_ID;
	}
	var cidStr = JSON.stringify(cids);
	if (rows){
        $.messager.confirm('确认','<div class="div6"></div><div class="div1">删除选中数据信息吗？</div>',function(r){
            if (r){
            	
            	//删除表单数据
            	$.post('/T_POWERLAYERS/deleteByCids.action',
                		{
                	     "C_ID":cidStr
                		},
                		function(result){
                			if (result.success){
                				$.messager.alert('提示',"<div class='div3'></div><div class='div1'>"+result.title+"!</div>");
                				$("#app_table").datagrid('reload');
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