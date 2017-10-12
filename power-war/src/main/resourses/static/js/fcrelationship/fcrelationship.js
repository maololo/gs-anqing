
var fcrelationship = "";
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
        		$.post('/T_FCRELATIONSHIP/delete.action',
              		{
              	     "ID":row.C_ID
              		},
              		function(result){
              			if (result.success){    
              				swal(result.title,'',"success");
              				$('#fcrelationshipTable').bootstrapTable('refresh');
                          } else {
                          	swal(result.title,'',"error");
                          }
                 },'json');
        		});
        },
        'click .RoleOfEdit': function (e, value, row, index) {
        	rowData = row;
            $(this).css("background","#308374");
            openFcrelationshipDailog('/fcrelationship/fcrelationshipAdd.action','设备信息');
        }
    };
    $('#fcrelationshipTable').bootstrapTable({
    	url: '/T_FCRELATIONSHIP/queryPage.action',
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
            field: 'C_CODE',
            title: '编号',
            align: 'center',
            valign: 'top',
            sortable: true
        },{
            field: 'C_STARTOCSECTIONID',
            title: '开始段光缆段编号',
            align: 'center',
            valign: 'top',
            sortable: true
        },{
        	field: 'C_STARTSERIALNUMBER',
        	title: '开始段纤芯序号',
        	align: 'center',
        	valign: 'top',
        	sortable: true
        },{
        	field: 'C_BEARERLIGHTPATHTYPE',
        	title: '承载光路类型',
        	align: 'center',
        	valign: 'top',
        	sortable: true
        },{
        	field: 'C_ENDOCSECTIONID',
        	title: '结束段光缆段编号',
        	align: 'center',
        	valign: 'top',
        	sortable: true
        },{
        	field: 'C_ENDSERIALNUMBER',
        	title: '结束段纤芯序号',
        	align: 'center',
        	valign: 'top',
        	sortable: true
        },{
        	field: 'C_BEARERCONTENT',
        	title: '承载内容',
        	align: 'center',
        	valign: 'top',
        	sortable: true
        }, {
            field: '操作',
            title: '操作',
            align: 'center',
            valign: 'top',
            sortable: true,
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

function initFcrelationshipDailog(){
	initSelectpicker('承载光路类型',"C_BEARERLIGHTPATHTYPE");
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


function openFcrelationshipDailog(url,title){
	fcrelationship = $.jsPanel({
        id:			 "fcrelationship",
        position:    'center',
        theme:       "#308374",
        contentSize: {width: 'auto', height: 'auto'},
        headerTitle: title,
        border:      '1px solid #066868',
        contentAjax: {
            url: url,
            autoload: true,
            done: function (data, textStatus, jqXHR, panel) {
            	initFcrelationshipDailog();
            	if(rowData!=""){
            		rowData.C_RUNDATE = DateTimeFormatter(rowData.C_RUNDATE);
            		initUpdateFcrelationship(rowData);
            	}
              }
        },
        callback:    function () {
            this.content.css("padding", "5px");
        }
    });
}

function closeFcrelationship(){
	if(fcrelationship!=""){
		fcrelationship.close();
		fcrelationship="";		
	}
}

//添加
function addFcrelationship(){
	row = "";
	rowData = "";
	openFcrelationshipDailog('/fcrelationship/fcrelationshipAdd.action','纤芯承载信息');
}

//数据回写
function initUpdateFcrelationship(obj){
	for(var id in obj){
		var data = document.getElementById(id);
		if(data!=null && data.type == "select-one"){
 			 $('#'+id).selectpicker('val',obj[id]);
 		 }else if(id=="C_CODE"){
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
function submitFcrelationshipInfo(){
	$.post('/T_FCRELATIONSHIP/save.action',
			$("#fcrelationship_form").serialize(),
			function(result){
		        closeFcrelationship();
		        swal(result.title,'',"success");
		        $('#fcrelationshipTable').bootstrapTable('refresh');
	},"json");
}



/**
 *  查询
 */
function searchFcrelationshipInfo(){
//	$(".equipment-header").mLoading("show");
	$.post('/T_FCRELATIONSHIP/queryPage.action',
		    {
		    "search.C_CODE*like":'%'+$("#CODE").val()+'%',
			"page_pn": 1,
			"page_size":10
		    },
    		function(data){
		        $('#fcrelationshipTable').bootstrapTable('load', data);
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