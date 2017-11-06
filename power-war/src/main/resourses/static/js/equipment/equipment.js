
var rowData="";//选择行数据
function init(){
    window.operateEventsEquipment = {
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
        		$.post('/T_EQUIPMENT/delete.action',
              		{
              	     "ID":row.C_ID
              		},
              		function(result){
              			if (result.success){    
              				swal(result.title,'',"success");
              				$('#equipmentTable').bootstrapTable('refresh');
                          } else {
                          	swal(result.title,'',"error");
                          }
                 },'json');
        		});
        },
        'click .RoleOfEdit': function (e, value, row, index) {
        	rowData = row;
        	closeEquipment();
            openEquipmentDailog('/equipment/equipmentAdd.action','设备信息');
        },
        'click .RoleOfImage': function (e, value, row, index) {
            rowData = row;
            resPopover('/imgmsg/imgmsg.action','图片信息');
        },
        'click .RoleOfToEquipment': function (e, value, row, index) {
        	var stationId = row.C_STATIONID;
        	if(isEmpty(stationId)){
        		swal('所属局站为空!', '', "warning");
        		return;
        	}
        	stationViewDailog(stationId, "/equipment/stationView.action", '局站信息');
        },
        'click .RoleOfLight': function (e, value, row, index) {
        	rowData = row;
            resPopover('/lightbox/lightbox.action','光交图-'+row.C_NAME);
        },
        'click .RoleOfDistributionmodule': function (e, value, row, index) {
        	//查询设备信息
    		filterFieldID = row.C_CODE;
    		/*var title='';
    		var titles = queryTableByData('/T_B_MODULE/search.action',{});
    		for(var i in titles){
    			var url = titles[i].C_URL;
    			if(url==null){
    				continue;
    			}
    			var name = url.split('/')[1].toLowerCase();
    			if(name == 'equipment'){
    				title = titles[i].C_MODULENAME;
    				break;
    			}
    		}*/
    		resPopover('/DISTRIBUTIONMODULE/DISTRIBUTIONMODULE.action','配线模块信息');
        },
        'click .RoleOfDistributioninfo': function (e, value, row, index) {
        	//查询设备信息
        	filterFieldID = row.C_CODE;
        	resPopover('/DISTRIBUTIONINFO/DISTRIBUTIONINFO.action','配线信息');
        },
        'click .RoleOfFgq':function(e, value, row, index) {
        	//查询设备信息
        	filterFieldID = row.C_CODE;
        	resPopover('/LIGHTSPLITTERINFO/LIGHTSPLITTERINFO.action','分光器信息');
        }
    };
    $('#equipmentTable').bootstrapTable({
    	url: '/T_EQUIPMENT/queryPage.action',
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
            title: '设备编号',
            align: 'center',
            valign: 'top',
            sortable: true,
            visible: false
        },{
            field: 'C_NAME',
            title: '名称',
            align: 'center',
            valign: 'top',
            sortable: true
        },{
        	field: 'C_TYPE',
        	title: '设备类型',
        	align: 'center',
        	valign: 'top',
        	sortable: true
        },{
        	field: 'C_STATIONID',
        	title: '所属局站',
        	align: 'center',
        	valign: 'top',
        	sortable: true,
        	formatter:function(value,row,index){return formatfeatureName(value);}
        },{
        	field: 'C_MANUFACTURER',
        	title: '生产厂家',
        	align: 'center',
        	valign: 'top',
        	sortable: true
        },{
        	field: 'C_MODEL',
        	title: '设备型号',
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
        	field: 'C_RUNINGSTATE',
        	title: '运行状态',
        	align: 'center',
        	valign: 'top',
        	sortable: true
        }, {
            field: '操作',
            title: '操作',
            align: 'right',
            valign: 'top',
            sortable: true,
            width : '330px',
            events: operateEventsEquipment,//给按钮注册事件
            formatter: operateFormatterEquipment//表格中增加按钮
        }]
    });
}

function initEquipmentDailog(){
	$("#checkEquipmentDate").datetimepicker({
		  language: 'zh-CN',//显示中文
		  format: 'yyyy-mm-dd',//显示格式
		  minView: "month",//设置只显示到月份
		  initialDate: new Date(),//初始化当前日期
		  autoclose: true,//选中自动关闭
		  todayBtn: true//显示今日按钮
	});
	
	initSelectpicker('运行状态',"C_RUNINGSTATE");
	initSelectpicker('设备类型','C_TYPE');
	initSelectpicker('生产厂家','C_MANUFACTURER');
	initSelectpicker('设备型号','C_MODEL');
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
                	$('#' + id).append("<option value=" + data[i].C_VALUE + ">" + data[i].C_NAME + "</option>");
                }
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
			"search.C_STATIONID*eq":filterFieldID
		}
		filterFieldID = "";
		$('#equipmentBody').hide();
	}
	return params;
}

function operateFormatterEquipment(val,row,index){
	var icon = ""
	if(row.C_TYPE == "ODF"){
		icon = '<button class="RoleOfLight btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="光交图"><span class="gj_icon" style="display:block;" ></span></button>'+
			   '<button class="RoleOfDistributioninfo btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="配线信息"><span class="pxinfo_icon" style="display:block;" ></span></button>'+
			'<button class="RoleOfDistributionmodule btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="配线模块"><span class="pxmodule_icon" style="display:block;" ></span></button>';
	}else if(row.C_TYPE == "分光器"){
		icon ='<button class="RoleOfFgq btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="分光器"><span class="fgq_icon" style="display:block;" ></span></button>';
	}
    return  [icon+'<button class="RoleOfImage  btn btn-sm rolebtn" style="background: none;outline:none;color: #0ad6bd" title="图片查看"><span  class=" glyphicon glyphicon-picture  " ><span></button>',
    	'<button class="RoleOfEdit btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="修改"><span  class=" glyphicon glyphicon-edit " ><span></button>',
        '<button class="RoleOfdDeldte  btn btn-sm rolebtn" style=" background: none;outline:none;color:red" title="删除"><span  class=" glyphicon glyphicon-trash " ><span></button>',
        '<button class="RoleOfToEquipment  btn btn-sm rolebtn" style="background: none;outline:none;color: #6688b5" title="局站"><span  class=" glyphicon glyphicon-retweet " ><span></button>',
//        '<button class="RoleOfPosition  btn btn-sm rolebtn" style="background: none;outline:none;color: #bf824c" title="定位"><span  class=" glyphicon glyphicon-record  " ><span></button>',
    ].join('');
}


function openEquipmentDailog(url,title){
	$.jsPanel({
		headerControls: {
	    	maximize: 'remove',
	        smallify: 'remove'
	    },
	    resizeit: {
	        disable: true //禁止窗口大小调整
	    },
        id:			 "equipmentAdd",
        position:    'center',
        theme:       "#308374",
        dragit: {containment: [100, 0, 0,160]},
        contentSize: {width: 'auto', height: 'auto'},
        headerTitle: title,
        border:      '1px solid #066868',
        contentAjax: {
            url: url,
            autoload: true,
            done: function (data, textStatus, jqXHR, panel) {
            	initEquipmentDailog();
            	if(rowData!=""){
            		rowData.C_RUNDATE = DateTimeFormatter(rowData.C_RUNDATE);
            		initUpdateEquipment(rowData);
            	}
              }
        },
        callback:    function () {
            this.content.css("padding", "5px");
        }
    });
}

function closeEquipment(){
	var panel = document.querySelector('#equipmentAdd');
	if(panel != null){
		panel.jspanel.close();
	}
}

//添加
function addEquipment(){
	row = "";
	rowData = "";
	closeEquipment();
	openEquipmentDailog('/equipment/equipmentAdd.action','设备信息');
}

//数据回写
function initUpdateEquipment(obj){
	for(var id in obj){
		if(id == "C_STATIONID"){
 			var typeName = formatfeatureName(obj[id]);
			$("#" + id).val(typeName);
		}else{
			$('#' + id).val(obj[id]);
		}
	}
	rowData = "";
}

/**
 * 保存
 */
function submitEquipmentInfo(){
	var equipmentInfo = getFormJson('equipment_form');
	if(equipmentInfo.C_ID==''){
		equipmentInfo.C_CODE = '0410'+guid();
	}
	var stationid = true;
	//根据选择的模糊数据转换成空间数据ID
	for(var i=0;i<blurData.length;i++){
		if(blurData[i].Name == equipmentInfo.C_STATIONID){
			equipmentInfo.C_STATIONID = blurData[i].ID;
			stationid = false;
			break;
		}
	}
	if(stationid){equipmentInfo.C_STATIONID=""}
	blurData=[];
	$.post('/T_EQUIPMENT/save.action',
			equipmentInfo,
			function(result){
		        closeEquipment();
		        swal(result.title,'',"success");
		        $('#equipmentTable').bootstrapTable('refresh');
	},"json");
}



/**
 *  查询
 */
function searchEquipmentInfo(){
//	$(".equipment-header").mLoading("show");
	$.post('/T_EQUIPMENT/queryPage.action',
		    {
		    "search.C_NAME*like":'%'+$("#equipment_name").val()+'%',
			"page_pn": 1,
			"page_size":10
		    },
    		function(data){
		        $('#equipmentTable').bootstrapTable('load', data);
//		        $(".equipment-header").mLoading("hide");
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

/** 查询局站弹框 **/
function stationViewDailog(stationId, url, title){
	$.jsPanel({
	 	headerControls: {controls: "closeonly"},
        id: "stationView",
        position: 'center',
        theme: "#308374",
        dragit: {containment: [100, 0, 0, 160]},
        contentSize: {width: 'auto', height: 'auto'},
        headerTitle: title,
        border: '1px solid #066868',
        contentAjax: {
            url: url,
            autoload: true,
            done: function (data, textStatus, jqXHR, panel) {
            	initStationInfo(stationId);
            }
        },
        callback:function(){
            this.content.css({"padding": "5px"});
        }
    });
}

/** 初始化页面值 **/
function initStationInfo(stationId){
	// 局站信息
	var station = getFeatureObjByCodeAndModel(stationId, "SD_STATION");
	if(!$.isEmptyObject(station)){
		var du = station.geometry.getCoordinates();
		if(!$.isEmptyObject(du)){
			if(!isEmpty(du[0])){
				$("input[name='longitude']").val(du[0]);
			}else{
				$("input[name='longitude']").val("未设定");
			}
			if(!isEmpty(du[1])){
				$("input[name='latitude']").val(du[1]);
			}else{
				$("input[name='latitude']").val("未设定");
			}
		}
		for(var s in station){
			var domVal = station[s];
			var dom = $("input[name=" + s + "]");
			if(dom.length > 0){
				if(!isEmpty(domVal)){
					$("input[name=" + s + "]").val(domVal);
				}else{
					$("input[name=" + s + "]").val("未设定");
				}
			}
		}
	}
}


