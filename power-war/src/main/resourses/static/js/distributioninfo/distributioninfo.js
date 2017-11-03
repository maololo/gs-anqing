var rowData = "";// 选择行数据
var eCode = "";// 设备ID
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
	              				swal(result.title, '', "success");
	              				$('#distributioninfoTable').bootstrapTable('refresh');
	              			} else {
	              				swal(result.title, '', "error");
	              			}
	              		},'json'
	        		);
        		}
    		);
        },
        'click .RoleOfEdit': function (e, value, row, index) {
        	rowData = row;
			eCode = row.C_EQUIPMENTCODE;            openDistributionInfoDailog('/distributioninfo/distributioninfoAdd.action','配线信息');
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
		sidePagination: "server",
		queryParams: queryParams,
		clickToSelect: true,
        columns: [
            {
                title: '操作',
                align: 'center',
                valign: 'top',
                events: operateEvents,
                formatter: operateFormatter
            },
	        {
	        	field: 'C_NAME',
	        	title: '名称',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_EQUIPMENTCODE',
	        	title: '设备名称',
	        	align: 'center',
	        	valign: 'top',
	        	formatter:function(value, row, index){
	        		return formatfeatureName(value);
        		}
	        },
	        {
	        	field: 'C_DISKID',
	        	title: '盘号',
	        	align: 'center',
	        	valign: 'top',
	        	sortable: true
	        },
	        {
	        	field: 'C_OCSECTIONID',
	        	title: '所属光缆段',
	        	align: 'center',
	        	valign: 'top',
	        	formatter:function(value, row, index){
	        		return formatfeatureName(value);
        		}
	        },
	        {
	        	field: 'C_FF1',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF1STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_JF1',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF2',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF2STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_JF2',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF3',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF3STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_JF3',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF4',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF4STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_JF4',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF5',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF5STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_JF5',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF6',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF6STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_JF6',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF7',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF7STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_JF7',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF8',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF8STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_JF8',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF9',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF9STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_JF9',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF10',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF10STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_JF10',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF11',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF11STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_JF11',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF12',
	        	title: '熔纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_FF12STATUS',
	        	title: '熔纤端使用状态',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_JF12',
	        	title: '跳纤端',
	        	align: 'center',
	        	valign: 'top'
	        },
	        {
	        	field: 'C_REMARK',
	        	title: '备注',
	        	align: 'center',
	        	valign: 'top'
	        }
        ]
    });
}

function stationFtn(selId){
	$.ajax({
		url:"/T_EQUIPMENT/search.action",
    	data:{"search.C_STATIONID*eq": selId},
    	type:"post",
        dataType: "Json",
        async:false,
        success: function (data) {
        	var eSel = $('.e-sel');
        	eSel.attr("onchange", "chgEq(this.options[this.options.selectedIndex])");
        	var newSel = $('#C_EQUIPMENTCODE');
        	eSel.empty();
        	newSel.empty();
        	eSel.append("<option value=''>请选择</option>");
        	newSel.append("<option value=''>请选择</option>");
            if (!$.isEmptyObject(data)) { 
                for(var i = 0; i < data.length; i++) {
                	var d = data[i];
                	eSel.append("<option value=" + d.C_CODE + " data-type=" + d.C_TYPE + ">" + d.C_NAME + "</option>");
                	if(d.C_TYPE == "ODF"){
                		newSel.append("<option value=" + d.C_CODE + " data-type=" + d.C_TYPE + ">" + d.C_NAME + "</option>");
                	}
                }
            }
        }
    })
}

function glFtn(selId){
	$("#C_OCSECTIONID").val(selId);
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
function initSelectpicker(val, id){
	$.ajax({
		url:"/T_ENUMERATE/search.action",
    	data:{"search.C_TYPE*eq": val,"sort.C_SORTID": 'ASC'},
    	type:"post",
        dataType: "Json",
        async:false,
        success: function (data) {
            if (!$.isEmptyObject(data)) {         
                for(var i = 0; i < data.length; i++) {
                	$('#' + id).append("<option value=" + data[i].C_VALUE + ">" + data[i].C_NAME + "</option>");
                }
            }
        }
    })
}

//编辑 数据回写
function initUpdateDistributionInfo(obj){
	var stationId = "";
	// 根据设备ID 得到局站ID
	var param = {"search.C_CODE*eq": obj.C_EQUIPMENTCODE};
	var data = getTableObjByParamAndModel(param, "T_EQUIPMENT");
	if (!$.isEmptyObject(data)) {         
        var e = data[0];
        stationId = e.C_STATIONID;
    }
    // 根据局站ID 查询局站信息
    if(!isEmpty(stationId)){
    	var fObj = getFeatureObjByCodeAndModel(stationId, "SD_STATION");
    	if(!$.isEmptyObject(fObj)){
    		$(".jz").val(fObj.NAME);
			stationFtn(stationId);
			// 初始化下拉框后赋值
			$('#C_EQUIPMENTCODE').val(domVal);
    	}
    }
	
	for(var id in obj){
		var domVal = obj[id];
		if(id == "C_OCSECTIONID"){// 所属光缆段
	    	var fObj = getFeatureObjByCodeAndModel(domVal, "SD_OPTICALCABLESECTION");
	    	if(!$.isEmptyObject(fObj)){
	    		$(".gl").val(fObj.NAME);
	    	}
			$("#C_OCSECTIONID").val(domVal);
		}else if(id.indexOf("C_JF") >= 0){// 跳纤端
			if(!isEmpty(domVal)){
				if(domVal.length > 36){
					// 获取连接设备的编号
					var eId = domVal.substring(0, 36);
					// 获取指向的盘序
					var pan = domVal.substring(36, domVal.length - 2);
					// 获取连接光缆的端子号
					var dz = domVal.substring(domVal.length - 2, domVal.length);
					
					var selDom = $("div[data-mark = " + id + "]").children(".e-sel");
					selDom.val(eId);
					// 初始化DOM
					var option = selDom.children("option[value=" + eId + "]");
					chgEq(option);
					$("div[data-mark = " + id + "]").children("input.pan").val(pan);
					$("div[data-mark = " + id + "]").children("input.dz").val(dz);
				}
			}
		}else{
			var dom = $('#' + id);
			if(dom.length > 0){
				$('#' + id).val(domVal);
			}
		}
	}
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
    return  ['<button class="btn-opre-l RoleOfEdit btn btn-sm rolebtn"><span class="glyphicon glyphicon-edit"><span></button>',
        '<button class="btn-opre-r RoleOfdDeldte btn btn-sm rolebtn"><span class="glyphicon glyphicon-trash"><span></button>'
    ].join('');
}

function openDistributionInfoDailog(url, title){
	$.jsPanel({
		headerControls: {
	    	maximize: 'remove',
	        smallify: 'remove'
	    },
	    resizeit: {
	        disable: true
	    },
		id: "distributionInfoAdd",
		position: 'center',
		theme: "#308374",
		contentSize: {width: 'auto', height: 'auto'},
		headerTitle: title,
		border: '1px solid #066868',
		contentAjax: {
			url: url,
			autoload: true,
			done: function (data, textStatus, jqXHR, panel) {
				initDistributionInfoDailog();
            	if(!$.isEmptyObject(rowData)){
            		initUpdateDistributionInfo(rowData);
            	}
			}
		},
		callback: function(){
			this.content.css("padding", "5px");
		}
	});
}

function closeDistributionInfo(){
	
	var panel = document.querySelector('#distributionInfoAdd');
	if(panel != null){
		panel.jspanel.close();
	}
}

// 添加
function addDistributionInfo(){
	row = "";
	rowData = "";
	eCode = "";
	openDistributionInfoDailog('/distributioninfo/distributioninfoAdd.action','配线信息');
}

/**
 * 保存
 */
function submitDistributionInfo(){
	var info = $("#distributioninfo_form").serializeJson()
	// 获取跳纤端DIV,拼接页面上输入的值
	var dataMarkDiv = $("div[data-mark]");
	if(dataMarkDiv.length > 0){
		for(var i = 0; i < dataMarkDiv.length; i++){
			var divDom = dataMarkDiv[i];
			var filed = $(divDom).attr("data-mark");
			var divChildDom = $(divDom).children();
			if(filed.length > 0 && divChildDom.length > 0){
				var tq = "";
				for(var j = 0; j < divChildDom.length; j++){
					var dom = divChildDom[j];
					if($(dom).hasClass("sel-input")){
						// 这里每个设备的盘序不能超过99
						if(!isDigit($(dom).val()) || $(dom).val().length != 2){
							swal("端子号" + filed.substring(filed.length - 1, filed.length) + "跳纤端盘序或者端子号格式输入不正确，请输入两位数字。",'',"warning");
							return "";
						}
						if($(dom).hasClass("dz")){
							if(!isDigit($(dom).val()) || $(dom).val() > 12){
								swal("端子号" + filed.substring(filed.length - 1, filed.length) + "跳纤端端子号格式输入不正确，请输入小于12的两位数字。",'',"warning");
								return "";
							}
						}
					}
					tq = tq + $(dom).val();
				}
				info[filed] = tq
			}
		}
	}
	$.post('/T_DISTRIBUTIONINFO/save.action', info , function(result){
        closeDistributionInfo();
        swal(result.title,'',"success");
        $('#distributioninfoTable').bootstrapTable('refresh');
	},"json");
}

/**
 *  查询
 */
function searchDistributionInfo(){
$.post('/T_DISTRIBUTIONINFO/queryPage.action',
	    {
	    "search.C_EQUIPMENTCODE*like":'%'+$("#EQUIPMENTCODE").val()+'%',
		"page_pn": 1,
		"page_size":10
	    },
		function(data){
	        $('#distributioninfoTable').bootstrapTable('load', data);
	    },'json'
	);}

/** 选择设备后的回调函数
 * obj 选中的 option
 */
function chgEquipment(obj){
	var selCode = $(obj).attr("value");
	// 根据设备id查询配线信息
	$.ajax({
		url: "/T_DISTRIBUTIONINFO/search.action",
		data: {"search.C_EQUIPMENTCODE*eq": selCode},
		type: "post",
		dataType: "Json",
		success: function(data){
			if(!isEmpty(eCode)){
				if(selCode == eCode){
					$("#C_DISKID").val(data.length);
				}else{
					$("#C_DISKID").val(data.length + 1);
				}
			}else{
				$("#C_DISKID").val(data.length + 1);
			}
		}
	});
}

/** 选择跳纤端设备后
 * obj 选中的 option
 */
function chgEq(obj){
	var type = $(obj).attr("data-type");
	var tqDiv = $(obj).parent().parent(".tq-div");
	var tqInput = tqDiv.children(".sel-input");
	if(tqInput.length > 0){
		tqInput.remove();
	}
	if(type == "ODF"){
		var panInput = $("<input type='text' class='pan sel-input col-sm-2'>");
		var dzInput = $("<input type='text' class='dz sel-input col-sm-2'>");
		tqDiv.append(panInput);
		tqDiv.append(dzInput);
	}
}


