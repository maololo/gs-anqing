
var eistributionmodule = "";
var rowData="";//选择行数据
function init(){
    window.operateEventDistributionmodule = {
        'click .RoleOfdDeldte': function (e, value, row, index) {
            swal({
        		  title: "确定删除?",
        		  type: "warning",
        		  showCancelButton: true,
        		  confirmButtonColor: "#DD6B55",
        		  confirmButtonText: "确定",
        		  cancelButtonText: "取消",
        		  closeOnConfirm: false
        		},
        		function(){
        		$.post('/T_DISTRIBUTIONMODULE/delete.action',
              		{
              	     "ID":row.C_ID
              		},
              		function(result){
              			if (result.success){    
              				swal(result.title,'',"success");
              				$('#distributionmoduleTable').bootstrapTable('refresh');
                          } else {
                          	swal(result.title,'',"error");
                          }
                 },'json');
        		});
        },
        'click .RoleOfEdit': function (e, value, row, index) {
        	rowData = row;
            openDistributionmoduleDailog('/distributionmodule/distributionmoduleAdd.action','配线模块信息');
        }
    };
    $('#distributionmoduleTable').bootstrapTable({
    	url: '/T_DISTRIBUTIONMODULE/queryPage.action',
	    method:'post',
	    striped: true,
		dataType: "json",
		pagination: true,
		queryParamsType: "limit",
		singleSelect: false,
		contentType: "application/x-www-form-urlencoded",
		pageSize: 10,
		pageNumber:1,
		undefinedText:"",
//		search: true, //不显示 搜索框
		showColumns: false, //不显示下拉框（选择显示的列）
		sidePagination: "server", //服务端请求
		queryParams: queryParams,//分页参数
		clickToSelect: true,
//		height: 400,
        columns: [{
            field: 'C_CODE',
            title: '模块ID',
            align: 'center',
            valign: 'top',
            sortable: true,
            visible: false
        },{
            field: 'C_MODULENAME',
            title: '模块名称',
            align: 'center',
            valign: 'top',
            sortable: true
        },{
        	field: 'C_STATIONID',
        	title: '局站',
        	align: 'center',
        	valign: 'top',
        	sortable: true,
        	formatter:function(value,row,index){return formatfeatureName(value);}
        },{
        	field: 'C_TERMINALROWNUM',
        	title: '端子行数',
        	align: 'center',
        	valign: 'top',
        	sortable: true
        },{
        	field: 'C_TERMINALCOLUMNNUM',
        	title: '端子列数',
        	align: 'center',
        	valign: 'top',
        	sortable: true
        },{
        	field: 'C_CAPACITY',
        	title: '容量',
        	align: 'center',
        	valign: 'top',
        	sortable: true
        },{
        	field: 'C_RUNDATE',
        	title: '投运日期',
        	align: 'center',
        	valign: 'top',
        	sortable: true,
        	formatter:function(value,row,index){return DateTimeFormatter(value);}
        },{
        	field: 'C_REMARK',
        	title: '备注',
        	align: 'center',
        	valign: 'top',
        	sortable: true
        }, {
            field: '操作',
            title: '操作',
            align: 'center',
            valign: 'top',
            sortable: true,
            width : '125px',
            events: operateEventDistributionmodule,//给按钮注册事件
            formatter: operateFormatterDistributionmodule,//表格中增加按钮
        }]

    });

    
}
//端子行数离焦事件
function blurTerminalRownum(){
	var rownum = $("#C_TERMINALROWNUM").val().trim();
	 var reg = /^[1-9]\d*$/;
	 if(rownum!=""){
		 if(reg.test(rownum)){
			 var columnnum = $("#C_TERMINALCOLUMNNUM").val().trim();
			 if(columnnum!=""){
				 $("#C_CAPACITY").val(columnnum*rownum);
			 }else{
				 $("#C_CAPACITY").val('');
			 }
		 }else{
			 $("#C_TERMINALROWNUM").focus();
			 swal('端子行数只能为正整数!', '', "warning");
		 }	 
	 }
}
//端子列数离焦事件
function blurTerminalColumnnum(){
	var columnnum = $("#C_TERMINALCOLUMNNUM").val().trim();
	 if(columnnum!=""){
		 var reg = /^[1-9]\d*$/;
		 if(reg.test(columnnum)){
			 var rownum = $("#C_TERMINALROWNUM").val().trim();
			 if(rownum!=""){
				 $("#C_CAPACITY").val(columnnum*rownum);
			 }else{
				 $("#C_CAPACITY").val('');
			 }
		 }else{
			 $("#C_TERMINALCOLUMNNUM").focus();
			 swal('端子列数只能为正整数!', '', "warning");
		 }	 
	 }
}

function initDistributionmoduleDailog(){
	$("#checkDistributionmoduleDate").datetimepicker({
		  language: 'zh-CN',//显示中文
		  format: 'yyyy-mm-dd',//显示格式
		  minView: "month",//设置只显示到月份
		  initialDate: new Date(),//初始化当前日期
		  autoclose: true,//选中自动关闭
		  todayBtn: true//显示今日按钮
	});
}
//设置传入参数
function queryParams(params) {
	return {
		page_pn: params.pageNumber,
		sColumn:params.sort,
		order:params.order,
		page_size: params.limit
		
	}
};

function operateFormatterDistributionmodule(val,row,index){
    return  ['<button class="RoleOfEdit btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="修改"><span  class=" glyphicon glyphicon-edit " ><span></button>',
        '<button class="RoleOfdDeldte  btn btn-sm rolebtn" style="background: none;outline:none;color:red" title="删除"><span  class=" glyphicon glyphicon-trash " ><span></button>'
    ].join('');
}


function openDistributionmoduleDailog(url,title){
	distributionmodule = $.jsPanel({
		headerControls: { controls: "closeonly" },
        id:			 "distributionmodule",
        position:    'center',
        dragit: {containment: [100, 0, 0,160]},
        theme:       "#308374",
        contentSize: {width: 'auto', height: 'auto'},
        headerTitle: title,
        border:      '1px solid #066868',
        contentAjax: {
            url: url,
            autoload: true,
            done: function (data, textStatus, jqXHR, panel) {
            	initDistributionmoduleDailog();
            	if(rowData!=""){
            		rowData.C_RUNDATE = DateTimeFormatter(rowData.C_RUNDATE);
            		rowData.C_STATIONID = formatfeatureName(rowData.C_STATIONID);
            		initUpdateDistributionmodule(rowData);
            	}
              }
        },
        callback:    function () {
            this.content.css("padding", "5px");
        }
    });
}

function closeDistributionmodule(){
	if(distributionmodule!=""){
		distributionmodule.close();
		distributionmodule="";		
	}
}

//添加
function addDistributionmodule(){
	row = "";
	rowData = "";
	openDistributionmoduleDailog('/distributionmodule/distributionmoduleAdd.action','配线模块信息');
}

//数据回写
function initUpdateDistributionmodule(obj){
	for(var id in obj){
		var data = document.getElementById(id);
		if(data!=null && data.type == "select-one"){
 			 $('#'+id).selectpicker('val',obj[id]);
 		 }else{
 			 $('#'+id).val(obj[id]);
 		 }
	}
	rowData = "";
}

/**
 * 保存
 */
function submitDistributionmoduleInfo(){
	var distributionmoduleInfo = getFormJson('distributionmodule_form');
	if(distributionmoduleInfo.C_ID==''){
		distributionmoduleInfo.C_CODE = guid();
	}
	var distributionmoduleid = true;
	//根据选择的模糊数据转换成空间数据ID
	for(var i=0;i<blurData.length;i++){
		if(blurData[i].Name == distributionmoduleInfo.C_STATIONID){
			distributionmoduleInfo.C_STATIONID = blurData[i].ID;
			distributionmoduleid = false;
			break;
		}
	}
	if(distributionmoduleid){distributionmoduleInfo.C_STATIONID=""}
	blurData=[];
	$.post('/T_DISTRIBUTIONMODULE/save.action',
			distributionmoduleInfo,
			function(result){
		        closeDistributionmodule();
		        swal(result.title,'',"success");
		        $('#distributionmoduleTable').bootstrapTable('refresh');
	},"json");
}



/**
 *  查询
 */
function searchDistributionmoduleInfo(){
	$.post('/T_DISTRIBUTIONMODULE/queryPage.action',
		    {
		    "search.C_MODULENAME*like":'%'+$("#MODULENAME").val()+'%',
			"page_pn": 1,
			"page_size":10
		    },
    		function(data){
		        $('#distributionmoduleTable').bootstrapTable('load', data);
    },'json');
}
/**
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
	return dt.format("yyyy-MM-dd"); //扩展的Date的format方法(
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