function init(){
	$("#fiberpath-tab").bootstrapTable({
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
        height:$(document).height() - 650,
        columns: [{
            field: 'id',
            title: '序号',
            align: 'center',
            valign: 'top',
        },{
            field: 'fibername',
            title: 'ODF数量',
            align: 'center',
            valign: 'top',

        },{
            field: 'startname',
            title: '接头盒数量数量',
            align: 'center',
            valign: 'top',
        },{
            field: 'endname',
            title: '长度',
            align: 'center',
            valign: 'top',
        },
            {
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
//	    	visible: false ,// 该列隐藏，界面不显示
            //        events: operateEvents,//给按钮注册事件
            formatter: operateFormatter,//表格中增加按钮
        }]

    });
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

function queryData(){
	var data = [{
        id:'1',
        fibername:'DMADC',
        startname:'xxx',
        endname:'xxxx',
        length:'xxxx',
    },{

        id:'2',
        fibername:'DMADC',
        startname:'xxx',
        endname:'xxxx',
        length:'xxxx',
    },{
        id:'3',
        fibername:'DMADC',
        startname:'xxx',
        endname:'xxxx',
        length:'xxxx',
    },{
        id:'4',
        fibername:'DMADC',
        startname:'xxx',
        endname:'xxxx',
        length:'xxxx',
    },{
        id:'5',
        fibername:'DMADC',
        startname:'xxx',
        endname:'xxxx',
        length:'xxxx',
    },{
        id:'6',
        fibername:'DMADC',
        startname:'xxx',
        endname:'xxxx',
        length:'xxxx',
    }];
	 $('#fiberpath-tab').bootstrapTable('load', data);
}

function removeData(){
	$('#fiberpath-tab').bootstrapTable('removeAll');
}