
var lightsplitterinfo = "";
var rowData="";//选择行数据
function init(){
	 

	
    window.operateEvents = {
        'click .RoleOfdDeldte': function (e, value, row, index) {
            $(this).css("background","#308374")
           // openDelect('equipment/delecte.html','设备管理')
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
        		$.post('/T_LIGHTSPLITTERINFO/delete.action',
              		{
              	     "ID":row.C_ID
              		},
              		function(result){
              			if (result.success){    
              				swal(result.title,'',"success");
              				$('#lightsplitterinfoTable').bootstrapTable('refresh');
                          } else {
                          	swal(result.title,'',"error");
                          }
                 },'json');
        		});
        },
        'click .RoleOfEdit': function (e, value, row, index) {
        	rowData = row;
            $(this).css("background","#308374");
            openLightsplitterinfoDailog('/lightsplitterinfo/lightsplitterinfoAdd.action','分光器信息');
        }
    };
    $('#lightsplitterinfoTable').bootstrapTable({
    	url: '/T_LIGHTSPLITTERINFO/queryPage.action',
	    method:'post',
	    striped: true,
		dataType: "json",
		pagination: true,
		queryParamsType: "limit",
		singleSelect: false,
		contentType: "application/x-www-form-urlencoded",
		pageSize: 10,
		pageNumber:1,
//		search: true, //不显示 搜索框
		showColumns: false, //不显示下拉框（选择显示的列）
		sidePagination: "server", //服务端请求
		queryParams: queryParams,//分页参数
		clickToSelect: true,
		height: 400,
        //		clickToSelect: true,
        columns: [{
            field: 'C_EQUIPMENTID',
            title: '设备编号',
            align: 'center',
            valign: 'top',
            sortable: true
        },{
            field: 'C_UPORDOWN',
            title: '分光器端子类型',
            align: 'center',
            valign: 'top',
            sortable: true
        },{
        	field: 'C_TERMINALNUM',
        	title: '端子编号',
        	align: 'center',
        	valign: 'top',
        	sortable: true
        },{
        	field: 'C_TOEQUIPMENTID',
        	title: '连接的设备编号',
        	align: 'center',
        	valign: 'top',
        	sortable: true
        }, {
            field: '操作',
            title: '操作',
            align: 'center',
            valign: 'top',
            sortable: true,
//	    	visible: false ,// 该列隐藏，界面不显示
            events: operateEvents,//给按钮注册事件
            formatter: operateFormatter,//表格中增加按钮
        }]

    });

    
    $(".rolebtn").hover(function () {
       index=$(".rolebtn").index(this);
       $(this).css({"background":"#308374","color":"white"})
    },function () {
      $(this).css({"background":"none","color":"#666"})
    });
    
}

function initLightsplitterinfoDailog(){
	
	initSelectpicker('分光器端子类型','C_UPORDOWN');
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
	return {
		page_pn: params.pageNumber,
		sColumn:params.sort,
		order:params.order,
		page_size: params.limit
		
	}
};

function operateFormatter(val,row,index){
    return  ['<button class="RoleOfEdit btn btn-sm rolebtn" style="margin-right:15px;background: none;outline:none;color:#308374  "><span  class=" glyphicon glyphicon-edit " ><span></button>',
        '<button class="RoleOfdDeldte  btn btn-sm rolebtn" style="margin-right:15px; background: none;outline:none;color:red"><span  class=" glyphicon glyphicon-trash " ><span></button>'
        /*'<button class="RoleOfPosition  btn btn-sm rolebtn" style="margin-right:15px;background: none;outline:none;color: #6688b5"><span  class=" glyphicon glyphicon-retweet " ><span></button>',
        '<button class="RoleOfPosition  btn btn-sm rolebtn" style="margin-right:15px;background: none;outline:none;color: #bf824c"><span  class=" glyphicon glyphicon-record  " ><span></button>'*/
    ].join('');
}

function openLightsplitterinfoDailog(url,title){
	lightsplitterinfo = $.jsPanel({
        id:			 "lightsplitterinfo",
        position:    'center',
        theme:       "#308374",
        contentSize: {width: 'auto', height: 'auto'},
        headerTitle: title,
        border:      '1px solid #066868',
        contentAjax: {
            url: url,
            autoload: true,
            done: function (data, textStatus, jqXHR, panel) {
            	initLightsplitterinfoDailog();
            	if(rowData!=""){
            		initUpdateLightsplitterinfo(rowData);
            	}
              }
        },
        callback:    function () {
            this.content.css("padding", "5px");
        }
    });
}

function closeLightsplitterinfo(){
	if(lightsplitterinfo!=""){
		lightsplitterinfo.close();
		lightsplitterinfo="";		
	}
}

//添加
function addLightsplitterinfo(){
	row = "";
	rowData = "";
	openLightsplitterinfoDailog('/lightsplitterinfo/lightsplitterinfoAdd.action','分光器信息');
}

//数据回写
function initUpdateLightsplitterinfo(obj){
	for(var id in obj){
		var data = document.getElementById(id);
		if(data!=null && data.type == "select-one"){
 			 $('#'+id).selectpicker('val',obj[id]);
 		 }else if(id=="C_EQUIPMENTID"){
 			 $('#'+id).val(obj[id]);
 			$("#"+id).attr("readonly","true");
 		 }else{
 			 $('#'+id).val(obj[id]);
 		 }
	}
	rowData = "";
}

/**
 * 保存
 */
function submitLightsplitterinfo(){
	$.post('/T_LIGHTSPLITTERINFO/save.action',
			$("#lightsplitterinfo_form").serialize(),
			function(result){
		        closeLightsplitterinfo();
		        swal(result.title,'',"success");
		        $('#lightsplitterinfoTable').bootstrapTable('refresh');
	},"json");
}



/**
 *  查询
 */
function searchLightsplitterinfo(){
//	$(".equipment-header").mLoading("show");
	$.post('/T_LIGHTSPLITTERINFO/queryPage.action',
		    {
		    "search.C_EQUIPMENTID*like":'%'+$("#EQUIPMENTID").val()+'%',
			"page_pn": 1,
			"page_size":10
		    },
    		function(data){
		        $('#lightsplitterinfoTable').bootstrapTable('load', data);
//		        $(".equipment-header").mLoading("hide");
    },'json');
}
