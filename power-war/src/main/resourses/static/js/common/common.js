var dateArr = [];//日期
var textArr = [];//文本框
var btnArr = [];//按钮
var selectArr = [];//下拉框
var checkboxArr = [];//复选框
var tableId = "data_table";//表格id
var formId = "form_tb";//表单id
var tableName = "";//表名
var C_NAME_EN = "b_base";//
var dialgTitle = "";
var btnLength="";
var selectData = [];
var radioData = [];
var checkboxData = [];
var clength = 0;
var flength = 0;
var rlength = 0;
var rdlength = 0;
var sdlength = 0;
var slength = 0;
var checkIndex = 0;
var radioIndex = 0;
var selectIndex = 0;
var selectArrData=[];
var filedLength=0;//表单字段长度
var requiredFileds = [];
var rqLength = 0;//
//初始化方法
function init(tableName){
	if(tableName !='' && tableName != undefined){
		C_NAME_EN = tableName;
	}
	btnLength = 0;
	InitFormInfo();
}

/**
 * 获取表单和字段数据
 */
function InitFormInfo(){
	$.ajax({
	    url:'/'+C_NAME_EN+'/info',
	    type:'POST', //GET
	    async:false,    //或false,是否异步
	    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
	    success:function(data,textStatus,jqXHR){
	    	filedLength = data.fileds.length;
	    	InitDiv();
	    	InitDlg();
	    	//创建form表单
	    	InitForm(data);
	    	//var reltable = data.reltable;//关联表表数据
	    	//var relfields = data.relfileds;//关联表表字段数据
	    },
	    error:function(xhr,textStatus){
	        
	    },
	})
}

/**
 * 根据表单和字段数据创建表单
 * @param data json格式数据
 */
function InitForm(data){
	tableName = data.C_CODE;
	dialgTitle = data.C_NAME_CN;
	document.getElementById("dlg").innerHTML=""; 
	var div = document.getElementById('logAdmin');
	var chidren_div = document.createElement('div');
	chidren_div.setAttribute("class","top");   
	div.appendChild(chidren_div);
	var title_div = document.createElement('div');
	title_div.setAttribute("class","top-left1");   
	chidren_div.appendChild(title_div);
	title_div.innerHTML =data.C_NAME_CN;
	var link_div = document.createElement('div');
	link_div.setAttribute("class","dd2");
	//图标按钮
	creatLink(link_div,'添加','/images/organization/add.png',"addInfo()");
	creatLink(link_div,'修改','/images/organization/amend.png',"updateInfo()");
	creatLink(link_div,'删除','/images/organization/cha.png',"deleteInfo()");
	chidren_div.appendChild(link_div);
	
	
	//创建table表格
	createTable(data,div);
	
	var dlg = document.getElementById('dlg');
	//创建form表单
	var formElement = createForm(data);
    //表单字段信息
    var fileds = data.fileds;
    //初始化表单字段
    InitFormFileds(formElement,fileds);
    $('#dlg').attr('title',data.C_NAME_CN);
    dlg.appendChild(formElement);
    InitDate();
    InitTextBox();
	InitBtn();
	InitSelect();
	InitHideMsg();
}

//创建主div
function InitDiv(){
	$("#logAdmin").remove();
	var div = document.createElement("div");
	div.id='logAdmin';
	$("#center-bottom").append(div);
}

//创建form弹出框
function InitDlg(){
	$("#dlg").remove();
	var dlgDiv = document.createElement("div");
	dlgDiv.setAttribute("style","max-height:800px;width:480px;");//height:"+filedLength*90+"px"
	dlgDiv.setAttribute("data-options","modal:true");
	dlgDiv.setAttribute("close","true");
	dlgDiv.id='dlg';
	$("#center-bottom").append(dlgDiv);
}

//创建表格
function createTable(data,top_div) {
	var table = document.createElement("table");
	table.id = tableId;
	table.setAttribute("style","width:100%;height:760px");
	var columns=getColumn(data.fileds);
	top_div.appendChild(table);
	
	//根据表字段长度判断是否显示滚动条
	var tableFitColumns=true;
	if(data.fileds.length>14){
		tableFitColumns=false;
	}
	initDataGrid(table.id,columns,data.C_CODE,tableFitColumns);
} 

//获取datagrid列
function getColumn(fileds){
	var columns =  new Array();
	//添加选择框
	columns.push({field:'ck',checkbox:true});
	for(var index in fileds) {
		var column = new Object();
        column.title=fileds[index].C_NAME_CN;
        column.field=fileds[index].C_CODE;
        column.width=200;
        column.align="center";
        column.sortable="true";
        var showType = fileds[index].C_SHOWTYPE;
        var enable = fileds[index].C_ENABLE;
        //显示数据
        var data = fileds[index].C_DATA;
        //设置隐藏字段
        if("0" == enable){
        	column.hidden="true";
        }
        if("date" == showType){
        	column.formatter=fnDateFormatter;
        }
//        if("select" == showType){
//        	if(data!='' && data != null){
//            	selectData[sdlength] = eval('(' + data + ')');
//            }
//        	column.formatter=fnSelect;
//        	sdlength++;
//        }
        if("radio" == showType){
        	if(data!='' && data != null){
            	radioData[rdlength] = eval('(' + data + ')');
            }
			column.formatter=fnRadio;
			rdlength++;
		}
        var name = fileds[index].C_NAME_EN;
        if("checkbox" == showType){
        	if(data!='' && data != null){
    			checkboxData[clength] = eval('(' + data + ')');
    		}
    		column.formatter=fnCheckbox;
    		clength++;
		}
        columns.push(column);	
   	}
	return new Array(columns);
}

//格式化日期显示格式
function fnDateFormatter(value,row,index){
	return DateTimeFormatter(value);
}

//select转换
function fnSelect(value,row,index){
	if(selectIndex==0&& index ==1 && selectIndex!=index){
		slength= 0;
    }
    if(selectIndex!= 0 && selectIndex!=index){
    	slength= 0;
    }
	sData = selectData[slength];
	slength++;
	selectIndex = index;
	if(sData != undefined){
		for(var i=0;i<sData.length;i++){
			if(sData[i].value == value){
				return sData[i].name;
			}
		}
	}
}

//radio转换
function fnRadio(value,row,index){
	if(radioIndex==0&& index ==1 && radioIndex !=index){
		rlength= 0;
    }
    if(radioIndex!= 0 && radioIndex!=index){
    	rlength= 0;
    }
	rData = radioData[rlength];
	rlength++;
	radioIndex = index;
	for(var i=0;i<rData.length;i++){
		if(rData[i].value == value){
			return rData[i].name;
		}
	}
	
}

//checkbox转换
function fnCheckbox(value,row,index){
	if(checkIndex==0&& index ==1&& checkIndex!=index){
    	flength= 0;
    }
    if(checkIndex!= 0 && checkIndex!=index){
    	flength= 0;
    }
    checkIndex = index;
	if(value=="" || value == null){
		flength++;
		return value;
	}
    value=value.split(",");
    var str ="";
    cbData = checkboxData[flength];
	for(var i=0;i<value.length;i++){
		var val= value[i];
		for(var j=0;j<cbData.length;j++){
			if(cbData[j].value == val){
				str = str+" "+cbData[j].name;
			}
		}
	}
	flength++;
	return str;
}

//初始化datagrid
function initDataGrid(tableId,columns,code,tableFitColumns){
	$('#'+tableId).datagrid({
	    url:'/'+code+'/queryPage.action',
	    columns:columns,
	    rownumbers : true,
	    singleSelect: false,
		collapsible : true,
		fitColumns : tableFitColumns, //X方向显示滚动条
		remoteSort: false,
		nowrap : false,
		striped:true,
		pagination : true
	});
	var p = $('#'+tableId).datagrid('getPager');    
    $(p).pagination({    
        beforePageText: '第',//页数文本框前显示的汉字   
        afterPageText: '页    共 {pages} 页',   
        displayMsg: '当前显示 {from} - {to} 条记录    共 {total} 条记录',   
        onBeforeRefresh:function(){    
            $(this).pagination('loading');//正在加载数据中...  
            $(this).pagination('loaded'); //数据加载完毕  
        }    
    });
}


//初始化表单字段
function InitFormFileds(formElement,fileds){
	var j=0;//日期
    var t=0;//文本
	var s=0;//下拉框
	var c=0;//复选框
	//添加文本输入框
	var div = document.createElement('div');
	for(var i=0;i<fileds.length;i++){
		var showtype = fileds[i].C_SHOWTYPE;
		if("timestamp" == showtype || "date" == showtype){
	    	dateArr[j] = fileds[i].C_NAME_EN;
  	        j++;
	    }
	    if("text" == showtype || "password" == showtype){
	    	textArr[t] = fileds[i].C_NAME_EN;
	    	t++;
	    }
		if("select" == showtype){
			$.ajax({
			    //请求地址                               
			    url:"/T_ENUMERATE/search.action",
			    data:{"search.C_TYPE*eq":fileds[i].C_DATA,
			    	"sort.C_SORTID":"ASC"},//设置请求参数 
			     type:"post",//请求方法
			    async:false, 
			    dataType:"json",//设置服务器响应类型
			   //success：请求成功之后执行的回调函数   data：服务器响应的数据
			    success:function(data){
			       if(data!=""){
			    	   selectArrData[s] = data;
			       }
			    }
			}); 
	    	selectArr[s] = fileds[i].C_NAME_EN;
//	    	selectArrData[s] = fileds[i].C_DATA;
	    	s++;
	    }
		if("checkbox" == showtype){
			checkboxArr[c] = fileds[i].C_CODE;
			c++;
		}
		createInput(formElement,fileds[i]);
	}
	//创建隐藏c_id
	createHiddenInput(div,'hidden',"C_ID","C_ID");
	
	var buttonDiv = document.createElement('div');
	buttonDiv.setAttribute("class","module_btn");
	buttonDiv.setAttribute("style","text-align:center;margin-top:30px;");
	creatButton(buttonDiv,'保存',"saveInfo()","save");
	creatButton(buttonDiv,'关闭',"closeDlg()","close");
	div.appendChild(buttonDiv);
	formElement.appendChild(div);
}

//创建隐藏框
function createHiddenInput(div,type,id,name){
	var input = document.createElement('input');
	input.type=type;
	input.id = id;
	input.name= name;
	div.appendChild(input);
}

//创建文本框、下拉框、单选按钮、复选框等组件
function createInput(formElement,filed){
	var filedDiv = document.createElement('div');
	var span_1 = document.createElement('span');
	var label = document.createElement('label');
	span_1.appendChild(label);
	span_1.style = "display:inline-block;width:60px";
	label.innerHTML = filed.C_NAME_CN+":";
	filedDiv.appendChild(span_1);
	filedDiv.style="margin-left:50px;margin-top:20px;"
	formElement.appendChild(filedDiv);
	var data = filed.C_DATA;
	var showType = filed.C_SHOWTYPE;
	var isRequired = filed.C_ISREQUIRED;
	if(data != "" && data !=null){
//		var jsonData =  eval('(' + data + ')');
		if("select" == showType){
				var span = document.createElement('span');
				var tmpSelect = document.createElement("select");
				tmpSelect.name = filed.C_CODE;
				tmpSelect.id = filed.C_NAME_EN;
				tmpSelect.style="width:200px";
				span.appendChild(tmpSelect);
				filedDiv.appendChild(span);
		}/*else{
			var span_2 = document.createElement('span');
			span_2.style="margin-left:8px;";
			for (var i = 0; i < jsonData.length; i++) {
				var tmpInput = document.createElement("input");
		        tmpInput.type = showType;
		        tmpInput.name = filed.C_CODE;
				tmpInput.value=jsonData[i].value;
				span_2.appendChild(tmpInput);
				span_2.append(jsonData[i].name);
				filedDiv.appendChild(span_2);
			}
		}*/
	}else{
		if(showType=="textarea"){
			var textarea = document.createElement("textarea");
			textarea.cols='26';
			textarea.rows='5';
			textarea.style="border:1px solid #b0e7dd";
			textarea.name=filed.C_CODE;
			textarea.id = filed.C_NAME_EN;
			var span_2 = document.createElement('span');
			span_2.style="margin-left:8px;";
			span_2.appendChild(textarea);
			filedDiv.appendChild(span_2);
		}else{
			var input = document.createElement("input");
			var showType = filed.C_SHOWTYPE;
			if(showType == "date"){
				showType = "text";
			}
			input.type=showType;
			input.name=filed.C_CODE;
			input.id = filed.C_NAME_EN;
			input.style="width:200px";
			var span_2 = document.createElement('span');
			span_2.appendChild(input);
			filedDiv.appendChild(span_2);
		}
	}
	var span_3 = document.createElement('span');
	var span_4 = document.createElement('span');
	if(isRequired=="1"){
		span_3.innerHTML = "*";
		requiredFileds[rqLength] = filed.C_NAME_EN;
		span_4.innerHTML ="*";
		span_4.innerHTML = "<font color='red'>请输入"+filed.C_NAME_CN+"</font>";
		span_4.style="width:200px;";
		span_4.id = "span_"+filed.C_NAME_EN;
		filedDiv.appendChild(span_3);
		filedDiv.appendChild(span_4);
		rqLength++;
	}
		
}

//创建form表单
function createForm(data){
	var formElement = document.createElement('form');
    formElement.setAttribute('id',formId);
    formElement.setAttribute('name',data.C_NAME_EN);
    formElement.setAttribute('action','/'+tableName+'/save.action');
    formElement.setAttribute('method','post');
    return formElement;
}

//创建button按钮
function creatButton(div,value,event,id){
    var a = document.createElement("a");
	a.setAttribute("href","javascript:void(0)");
	a.innerHTML = value;
	a.id=id;
	btnArr[btnLength] =id;
	if(value=="保存"){
		a.setAttribute("style","margin-right:15px;");
	}
	a.setAttribute("class","easyui-linkbutton");
	a.setAttribute("onclick",event);
    div.appendChild(a);
	btnLength++;
}

//创建链接
function creatLink(div,value,src,event){
	var a = document.createElement("a");
	a.setAttribute("href","javascript:void(0)");
	a.innerHTML = value;
	a.setAttribute("onclick",event);
    div.appendChild(a);
    
    var img = document.createElement("img");
	img.src=src;
	a.appendChild(img);
}

/**
 * 保存信息
 */
function saveInfo(){
	//校验必填项
	var data={};
	$("#"+formId).serializeArray().map(function(x){data[x.name]=x.value;});
	for(var i=0;i<requiredFileds.length;i++){
		var rqFiled = requiredFileds[i];
		var column = "C_"+rqFiled.toUpperCase();
		var value = data[column];
		if(value == undefined || value ==""){
			$("#span_"+rqFiled).show(); 
			return;
		}
	}
	$.ajax({
	    url:'/'+tableName+'/save.action',
	    type:'POST', //GET
	    async:false,    //或false,是否异步
	    data:$("#"+formId).serialize(),
	    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
	    success:function(result,textStatus,jqXHR){
	    	$("#dlg").dialog('close');
	    	$.messager.alert('提示','<div class="div3"></div><div class="div1">'+result.title+'</div>');
	    	$("#"+tableId).datagrid('reload');
	    	flength=0;
	    	rlength=0;
	    	slength=0;
	    },
	    error:function(xhr,textStatus){
	       
	    },
	})
}

//添加点击事件
function addInfo(){
	$("#"+formId).form('clear');
	$('#dlg').dialog({title: dialgTitle+"添加"});
	$('#dlg').dialog('open');
	InitHideMsg();
}

//修改点击事件
function updateInfo(){
	var rows = $('#'+tableId).datagrid('getSelections');
	if(rows == "" || rows == null){
		$.messager.alert('提示','<div class="div7"></div><div class="div1">请选择需要修改的数据！</div>');
		return;
	}
	if(rows.length>1){
		$.messager.alert('提示','<div class="div7"></div><div class="div1">只能选择一条信息修改！</div>');
		return;
	}
	var obj = rows[0];
	for(var i=0;i<dateArr.length;i++){
		var filed = "c_"+dateArr[i];
	    filed = filed.toUpperCase();
	    obj[filed] = DateTimeFormatter(obj[filed]);
	}
	$('#'+formId).form('load',obj);
	for(var i=0;i<checkboxArr.length;i++){
		var checkboxName = checkboxArr[i];
		var data = obj[checkboxName];
		if(data!="" && data!=null){
			data = data.split(",");
			for(var j=0;j<data.length;j++){
				var value = data[j];
				$("input[name="+checkboxName+"][value="+value+"]").prop("checked",true)
			}
		}
	}
	$('#dlg').dialog({title: dialgTitle+"修改"});
	$('#dlg').dialog('open');
	InitHideMsg();
}

//删除点击事件
function deleteInfo(){
	var rows = $('#'+tableId).datagrid('getSelections');
	if(rows == null || rows == ""){
		$.messager.alert('提示','<div class="div7"></div><div class="div1">请选择需要删除的数据！</div>');
		return;
	}
	var cids = [];
	for(var i=0;i<rows.length;i++){
		cids[i] = rows[i].C_ID;
	}
	var cidStr = JSON.stringify(cids);
    if (rows){
        $.messager.confirm('确认','<div class="div7"></div><div class="div1">删除选中数据信息吗？</div>',function(r){
            if (r){
            	$.ajax({
            	    url:'/'+tableName+'/deleteByCids.action',
            	    type:'POST', //GET
            	    async:false,    //或false,是否异步
            	    data:{"C_ID":cidStr},
            	    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            	    success:function(data,textStatus,jqXHR){
            	    	$.messager.alert('提示','<div class="div3"></div><div class="div1">'+data.title+'</div>');
            	    	$("#"+tableId).datagrid('reload'); 
            	    },
            	    error:function(xhr,textStatus){
            	        
            	    },
            	})
            }
        });
    } else {
    	$.messager.alert('提示','<div class="div4"></div><div class="div1">没有选中数据信息！</div>');
    }
}

//关闭按钮点击事件
function closeDlg(){
	$('#dlg').dialog('close');
}

//初始化日期格式
function InitDate(){
	for(var i =0;i<dateArr.length;i++){
		$('#'+dateArr[i]).datebox({
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
	}
}

/**
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
	return dt.format("yyyy-MM-dd"); //扩展的Date的format方法
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

/**
 * 初始化文本框
 */
function InitTextBox(){
   for(var i=0;i<textArr.length;i++){
	   $("#"+textArr[i]).textbox({
  			
	   });
   }
}

//初始化按钮
function InitBtn(){
	for(var i=0;i<btnArr.length;i++){
	   $("#"+btnArr[i]).linkbutton({
  			
	   });
   }
}

//初始化下拉框
function InitSelect(){
	for(var i=0;i<selectArr.length;i++){
		var data = selectArrData[i];
		var dataInfo = fnFormatterData(data);
		$("#"+selectArr[i]).combobox({
			data : dataInfo,
			textField : 'text',//绑定的显示值
			valueField : 'value'//绑定的提交到后台的值
		})
	}
}

//格式化下拉框初始值
function fnFormatterData(data){
	var columns =  new Array();
	for(var i = 0;i<data.length;i++) {
		var column = new Object();
		column.text = data[i].C_NAME;
		column.value = data[i].C_VALUE;
		columns.push(column);
	}
	return columns;
}

//隐藏提示信息
function InitHideMsg(){
	for(var i=0;i<requiredFileds.length;i++){
		var rqFiled = requiredFileds[i];
		$("#span_"+rqFiled).hide(); 
	}
}

/**
 * form表单提交初始化参数
 */
$.fn.ghostsf_serialize = function () {
    var a = this.serializeArray();
    var $radio = $('input[type=radio],input[type=checkbox]', this);
    var temp = {};
    $.each($radio, function () {
        if (!temp.hasOwnProperty(this.name)) {
            if ($("input[name='" + this.name + "']:checked").length == 0) {
                temp[this.name] = "";
                a.push({name: this.name, value: ""});
            }
        }
    });
    //console.log(a);
    return jQuery.param(a);
};