var distributionInfo = "";
var rowData="";//选择行数据
function init(){
    window.operateEvents = {
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
	        		$.post('/T_DISTRIBUTIONINFO/delete.action',
	              		{
	              	     	"ID":row.C_ID
	              		},
	              		function(result){
	              			if (result.success){    
	              				swal(result.title,'',"success");
	              				$('#distributioninfoTable').bootstrapTable('refresh');
	              			} else {
	              				swal(result.title,'',"error");
	              			}
	              		},'json'
	        		);
        		}
    		);
        },
        'click .RoleOfEdit': function (e, value, row, index) {
        	rowData = row;
            openDistributionInfoDailog('/distributioninfo/distributioninfoAdd.action','配线信息');
        }
    };
    
    $('#distributioninfoTable').bootstrapTable({
    	url: '/T_DISTRIBUTIONINFO/queryPage.action',
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
        columns: [
            {
                title: '操作',
                align: 'center',
                valign: 'top',
                sortable: true,
                width: '100px',
//    	    	visible: false ,// 该列隐藏，界面不显示
                events: operateEvents,//给按钮注册事件
                formatter: operateFormatter,//表格中增加按钮
            },
	    	{
	            field: 'C_CODE',
	            title: '配线信息编号',
	            align: 'center',
	            valign: 'top',
	            sortable: true
	        },
	        {
	            field: 'C_DMID',
	            title: '配线模块编号',
	            align: 'center',
	            valign: 'top',
	            sortable: true
	        },
	        {
	        	field: 'C_DISKID',
	        	title: '盘号',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_OTHEREND',
	        	title: '对端（局站）',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_NAME',
	        	title: '名称',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF1',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF1STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_JF1',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF2',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF2STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_JF2',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF3',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF3STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_JF3',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF4',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF4STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_JF4',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF5',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF5STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_JF5',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF6',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF6STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_JF6',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF7',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF7STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_JF7',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF8',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF8STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_JF8',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF9',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF9STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_JF9',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF10',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF10STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_JF10',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF11',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF11STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_JF11',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF12',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_FF12STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_JF12',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_OCSECTIONID',
	        	title: '所属光缆段',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true,
	        	formatter:function(value,row,index){return formatfeatureName(value);}
	        },
	        {
	        	field: 'C_EQUIPMENTCODE',
	        	title: '设备名称',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true,
	        	formatter:function(value,row,index){return formatfeatureName(value);}
	        },
	        {
	        	field: 'C_REMARK',
	        	title: '备注',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        }
        ]
    });
    
}

function initDistributionInfoDailog(){
	initSelectpicker('熔纤端使用状态',"C_FF1STATUS");
	initSelectpicker('熔纤端使用状态',"C_FF2STATUS");
	initSelectpicker('熔纤端使用状态',"C_FF3STATUS");
	initSelectpicker('熔纤端使用状态',"C_FF4STATUS");
	initSelectpicker('熔纤端使用状态',"C_FF5STATUS");
	initSelectpicker('熔纤端使用状态',"C_FF6STATUS");
	initSelectpicker('熔纤端使用状态',"C_FF7STATUS");
	initSelectpicker('熔纤端使用状态',"C_FF8STATUS");
	initSelectpicker('熔纤端使用状态',"C_FF9STATUS");
	initSelectpicker('熔纤端使用状态',"C_FF10STATUS");
	initSelectpicker('熔纤端使用状态',"C_FF11STATUS");
	initSelectpicker('熔纤端使用状态',"C_FF12STATUS");
}
//初始化下拉列表
function initSelectpicker(val,id){
	$.ajax({
		url:"/T_ENUMERATE/search.action",
    	data:{"search.C_TYPE*eq":val,"sort.C_SORTID":'ASC'},//设置请求参数 
    	type:"post",//请求方法 
        dataType: "Json",
        async:false,
        success: function (data) {
            if (data!="" ||data!=null) {         
                for(var i=0;i<data.length;i++) {
                	$('#'+id+'.selectpicker').append("<option value=" + data[i].C_VALUE + ">" + data[i].C_NAME + "</option>");
                }
                $("#"+id).selectpicker('refresh');
            }
        }
    })
}

//设置传入参数
function queryParams(params) {
	var params={};
	if(filterFieldID==""){
		params = {
			page_pn: params.pageNumber,
			sColumn:params.sort,
			order:params.order,
			page_size: params.limit
		}
	}else{
		params ={
			page_pn: params.pageNumber,
			sColumn:params.sort,
			order:params.order,
			page_size: params.limit,
			"search.C_EQUIPMENTCODE*eq":filterFieldID
		}
		filterFieldID = "";
		$('#distributioninfoBody').hide();
	}
	return params;
};

function operateFormatter(val,row,index){
    return  ['<button class="RoleOfEdit btn btn-sm rolebtn" style="margin-right:15px;background:none; outline:none; color:#308374"><span class=" glyphicon glyphicon-edit"><span></button>',
        '<button class="RoleOfdDeldte btn btn-sm rolebtn" style="margin-right:15px; background:none; outline:none; color:red"><span class=" glyphicon glyphicon-trash" ><span></button>'
        /*'<button class="RoleOfPosition  btn btn-sm rolebtn" style="margin-right:15px;background: none;outline:none;color: #6688b5"><span  class=" glyphicon glyphicon-retweet " ><span></button>',
        '<button class="RoleOfPosition  btn btn-sm rolebtn" style="margin-right:15px;background: none;outline:none;color: #bf824c"><span  class=" glyphicon glyphicon-record  " ><span></button>'*/
    ].join('');
}

function openDistributionInfoDailog(url,title){
	distributionInfo = $.jsPanel({
		headerControls: {
	    	maximize: 'remove',
	        smallify: 'remove'
	    },
	    resizeit: {
	        disable: true //禁止窗口大小调整
	    },
		id:"distributionInfoAdd",
		position:'center',
		theme:"#308374",
		contentSize:{width: 'auto', height: 'auto'},
		headerTitle:title,
		border:'1px solid #066868',
		contentAjax:{
			url: url,
			autoload: true,
			done: function (data, textStatus, jqXHR, panel) {
				initDistributionInfoDailog();
            	if(rowData!=""){
            		rowData.C_RUNDATE = DateTimeFormatter(rowData.C_RUNDATE);
            		initUpdateDistributionInfo(rowData);
            	}
			}
		},
		callback:function(){
			this.content.css("padding", "5px");
		}
	});
}

function closeDistributionInfo(){
	if(distributionInfo!=""){
		distributionInfo.close();
		distributionInfo="";		
	}
}

//添加
function addDistributionInfo(){
	row = "";
	rowData = "";
	openDistributionInfoDailog('/distributioninfo/distributioninfoAdd.action','配线信息');
}

//数据回写
function initUpdateDistributionInfo(obj){
	for(var id in obj){
		var data = document.getElementById(id);
		if(data!=null && data.type == "select-one"){
 			$('#'+id).selectpicker('val',obj[id]);
 		/*	 
		}else if(id=="C_CODE"){
			$("#"+id).attr("readonly","true");
			$('#'+id).val(obj[id]);
		*/ 
		}else{
			$('#'+id).val(obj[id]);
		}
	}
	rowData = "";
}

/**
 * 保存
 */
function submitDistributionInfo(){
	$.post('/T_DISTRIBUTIONINFO/save.action',
			$("#distributioninfo_form").serialize(),
			function(result){
		        closeDistributionInfo();
		        swal(result.title,'',"success");
		        $('#distributioninfoTable').bootstrapTable('refresh');
	},"json");
}

/**
 *  查询
 */
function searchDistributionInfo(){
//	$(".distributionInfo-header").mLoading("show");
	$.post('/T_DISTRIBUTIONINFO/queryPage.action',
	    {
	    "search.C_EQUIPMENTCODE*like":'%'+$("#EQUIPMENTCODE").val()+'%',
		"page_pn": 1,
		"page_size":10
	    },
		function(data){
	        $('#distributioninfoTable').bootstrapTable('load', data);
//		        $(".distributionInfo-header").mLoading("hide");
	    },'json'
	);
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