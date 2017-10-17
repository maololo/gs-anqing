function init(){
	    window.operateEvents = {

	    };
	    $("#trouble-tab").bootstrapTable({
	        method:'post',
	        striped: true,
	        dataType: "json",
	        pagination: true,
	        queryParamsType: "limit",
	        singleSelect: false,
	        contentType: "application/x-www-form-urlencoded",
	        pageSize: 5,
	        pageNumber:1,
	        showColumns: false, //不显示下拉框（选择显示的列）
	        sidePagination: "client", //服务端请求
	        queryParams: queryParams,//分页参数
	        //		clickToSelect: true,
	        height:$(document).height() - 700,
	        columns: [{
	            field: 'id',
	            title: '序号',
	            align: 'center',
	            valign: 'top',
	        },{
	            field: 'name',
	            title: 'ODF数量',
	            align: 'center',
	            valign: 'top',
	            formatter:operateODF
	        },{
	            field: 'num',
	            title: '接头盒数量数量',
	            align: 'center',
	            valign: 'top',
	            formatter:operateNum
	        },{
	            field: 'length',
	            title: '长度',
	            align: 'center',
	            valign: 'top',
	        }, {
	            field: '操作',
	            title: '操作',
	            align: 'center',
	            valign: 'top',
	          //  sortable: true,
//		    	visible: false ,// 该列隐藏，界面不显示
	            //        events: operateEvents,//给按钮注册事件
	            formatter: operateFormatter,//表格中增加按钮
	        }]

	    });
	    $(".addimg").addClass("addicon");
}

function queryParams(params) {
    return {
        page_pn: params.pageNumber,
        sColumn:params.sort,
        order:params.order,
        page_size: params.limit
    }
};

function operateFormatter(val,row,index){
    return  [
        '<button class="RoleOfEdit btn btn-sm rolebtn" style="outline:none;color:#308374;background:none;  "><span class="glyphicon glyphicon-map-marker"></span></button>',
    ].join('');
}
function operateODF(val,row,index){
    return  ['<button class="RoleOfEdit btn btn-sm rolebtn" style="outline:none;color:#308374 ;background:none;"><span >4<span></button>',
        '<button class="RoleOfEdit btn btn-sm rolebtn" style="outline:none;color:#308374 ;background:none;"><span class="addimg" style="width: 15px;height: 15px;display:inline-block;"></span></button>',
    ].join('');
}
function operateNum(val,row,index){
    return  ['<button class="RoleOfEdit btn btn-sm rolebtn" style="outline:none;color:#308374 ;background:none;"><span>5<span></button>',
        '<button class="RoleOfEdit btn btn-sm rolebtn" style="outline:none;color:#308374 ;background:none;"><span class="addimg" style="width: 15px;height: 15px;display:inline-block;"></span></button>',
    ].join('');
}

function removeData(){
	$('#trouble-tab').bootstrapTable('removeAll');
}


function analysisData(){
	var datas = [];
	for (var i = 1; i < 20; ++i) {
        datas.push({
            "id":i,
            "length":1000+i,
        })
    }
	$('#trouble-tab').bootstrapTable('load', datas);
}
