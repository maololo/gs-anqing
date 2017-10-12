
var cableaffiliatedInfo = "";
var rowData="";//选择行数据
function init(){
	
    window.operateEvents = {
        'click .RoleOfdDeldte': function (e, value, row, index) {
            $(this).css("background","#308374")
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
        		$.post('/T_CABLEAFFILIATEDINFO/delete.action',
              		{
              	     "ID":row.C_ID
              		},
              		function(result){
              			if (result.success){    
              				swal(result.title,'',"success");
              				$('#cableaffiliatedInfoTable').bootstrapTable('refresh');
                          } else {
                          	swal(result.title,'',"error");
                          }
                 },'json');
        		});
        },
        'click .RoleOfEdit': function (e, value, row, index) {
        	rowData = row;
            $(this).css("background","#308374");
            openCableaffiliatedInfoDailog('/cableaffiliatedinfo/cableaffiliatedinfoAdd.action','光缆信息');
        }
    };
    $('#cableaffiliatedInfoTable').bootstrapTable({
    	url: '/T_CABLEAFFILIATEDINFO/queryPage.action',
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
            field: 'C_OPSECTIONID',
            title: '光缆段编号',
            align: 'center',
            valign: 'top',
            sortable: true
        },{
            field: 'C_AFFILIATEDID',
            title: '附属对象编号',
            align: 'center',
            valign: 'top',
            sortable: true
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


function openCableaffiliatedInfoDailog(url,title){
	cableaffiliatedInfo = $.jsPanel({
        id:			 "cableaffiliatedInfo",
        position:    'center',
        theme:       "#308374",
        contentSize: {width: 'auto', height: 'auto'},
        headerTitle: title,
        border:      '1px solid #066868',
        contentAjax: {
            url: url,
            autoload: true,
            done: function (data, textStatus, jqXHR, panel) {
            	if(rowData!=""){
            		initUpdateCableaffiliatedInfo(rowData);
            	}
              }
        },
        callback:    function () {
            this.content.css("padding", "5px");
        }
    });
}

function closeCableaffiliatedInfo(){
	if(cableaffiliatedInfo!=""){
		cableaffiliatedInfo.close();
		cableaffiliatedInfo="";		
	}
}

//添加
function addCableaffiliatedInfo(){
	row = "";
	rowData = "";
	openCableaffiliatedInfoDailog('/cableaffiliatedinfo/cableaffiliatedinfoAdd.action','光缆信息');
}

//数据回写
function initUpdateCableaffiliatedInfo(obj){
	for(var id in obj){
		var data = document.getElementById(id);
		if(data!=null && data.type == "select-one"){
 			 $('#'+id).selectpicker('val',obj[id]);
 		 }else if(id=="C_OPSECTIONID"){
 			$("#"+id).attr("readonly","true");
 			$('#'+id).val(obj[id]);
 		 }else{
 			 $('#'+id).val(obj[id]);
 		 }
	}
	rowData = "";
}

/**
 * 保存
 */
function submitCableaffiliatedInfo(){
	$.post('/T_CABLEAFFILIATEDINFO/save.action',
			$("#cableaffiliatedInfo_form").serialize(),
			function(result){
		       closeCableaffiliatedInfo();
		        swal(result.title,'',"success");
		        $('#cableaffiliatedInfoTable').bootstrapTable('refresh');
	},"json");
}



/**
 *  查询
 */
function searchCableaffiliatedInfo(){
//	$(".equipment-header").mLoading("show");
	$.post('/T_CABLEAFFILIATEDINFO/queryPage.action',
		    {
		    "search.C_OPSECTIONID*like":'%'+$("#OPSECTIONID").val()+'%',
			"page_pn": 1,
			"page_size":10
		    },
    		function(data){
		        $('#cableaffiliatedInfoTable').bootstrapTable('load', data);
//		        $(".equipment-header").mLoading("hide");
    },'json');
}
