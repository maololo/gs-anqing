var rowData = "";//选择行数据
$(function () {
    window.operateEventFcrelationship = {
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
            function () {
                $.post('/T_FCRELATIONSHIP/delete.action', { "ID": row.C_ID }, function (result) {
                    if (result.success) {
                        swal(result.title, '', "success");
                        $('#fcrelationshipTable').bootstrapTable('refresh');
                    } else {
                        swal(result.title, '', "error");
                    }
                }, 'json');
            });
        },
        'click .RoleOfEdit': function (e, value, row, index) {
            rowData = row;
            closeFcrelationship();
            openFcrelationshipDailog('/fcrelationship/fcrelationshipAdd.action', '设备信息');
        }
    };
})

function showFcrelationshipTable(data) {
    $('#fcrelationshipTable').bootstrapTable({
        data: data,
        method: 'post',
        striped: true,
        dataType: "json",
        pagination: true,
        queryParamsType: "limit",
        singleSelect: false,
        contentType: "application/x-www-form-urlencoded",
        pageSize: 10,
        pageNumber: 1,
        undefinedText: "",
        showColumns: false, //不显示下拉框（选择显示的列）
        sidePagination: "client", //客户端请求
        queryParams: queryParams,//分页参数
        clickToSelect: true,
        columns: [{
            field: '',
            title: '序号',
            align: 'center',
            valign: 'top',
            sortable: true,
            formatter: function (value, row, index) {
                return index + 1;
            }

        }, {
            field: 'C_STARTOCSECTIONID',
            title: '开始光缆段',
            align: 'center',
            valign: 'top',
            sortable: true,
            formatter: function (value, row, index) {
                return formatfeatureName(value);
            }
        }, {
            field: 'C_STARTSERIALNUMBER',
            title: '开始段纤芯序号',
            align: 'center',
            valign: 'top',
            sortable: true
        }, {
            field: 'C_ENDOCSECTIONID',
            title: '结束光缆段',
            align: 'center',
            valign: 'top',
            sortable: true,
            formatter: function (value, row, index) {
                return formatfeatureName(value);
            }
        }, {
            field: 'C_ENDSERIALNUMBER',
            title: '结束段纤芯序号',
            align: 'center',
            valign: 'top',
            sortable: true
        }, {
            field: 'C_BEARERLIGHTPATHTYPE',
            title: '承载光路类型',
            align: 'center',
            valign: 'top',
            sortable: true
        }, {
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
            width: '125px',
            events: operateEventFcrelationship,//给按钮注册事件
            formatter: operateFormatterFcrelationship,//表格中增加按钮
        }]
    });
}

function initFcrelationshipDailog() {
    initSelectpicker('承载光路类型', "C_BEARERLIGHTPATHTYPE");
}

//初始化下拉列表
function initSelectpicker(val, id) {
    $.ajax({
        url: "/T_ENUMERATE/search.action",
        data: {"search.C_TYPE*eq": val, "sort.C_SORTID": 'ASC'},//设置请求参数 
        type: "post",//请求方法 
        dataType: "Json",
        async: false,
        success: function (data) {
            if (data != "" || data != null) {
                for (var i = 0; i < data.length; i++) {
                    $('#' + id).append("<option value=" + data[i].C_VALUE + ">" + data[i].C_NAME + "</option>");
                }
            }
        }
    })
}

function operateFormatterFcrelationship(val, row, index) {
    return ['<button class="RoleOfEdit btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="修改"><span  class=" glyphicon glyphicon-edit " ><span></button>',
        '<button class="RoleOfdDeldte  btn btn-sm rolebtn" style="background: none;outline:none;color:red" title="删除"><span  class=" glyphicon glyphicon-trash " ><span></button>'
    ].join('');
}

function openFcrelationshipDailog(url, title) {
    $.jsPanel({
        id: "fcrelationshipAdd",
        dragit: {containment: [100, 0, 0, 160]},
        headerControls: {
            maximize: 'remove',
            smallify: 'remove'
        },
        resizeit: {
            disable: true //禁止窗口大小调整
        },
        position: 'center',
        theme: "#308374",
        contentSize: {width: 'auto', height: 'auto'},
        headerTitle: title,
        border: '1px solid #066868',
        contentAjax: {
            url: url,
            autoload: true,
            done: function (data, textStatus, jqXHR, panel) {
                initFcrelationshipDailog();
                if (rowData != "") {

                    initUpdateFcrelationship(rowData);
                }
            }
        },
        callback: function () {
            this.content.css("padding", "5px");
        }
    });
}

function closeFcrelationship() {
    var panel = document.querySelector('#fcrelationshipAdd');
    if (panel != null) {
        panel.jspanel.close();
    }
}

//添加
function addFcrelationship() {
    rowData = "";
    openFcrelationshipDailog('/fcrelationship/fcrelationshipAdd.action', '纤芯承载信息');
}

//数据回写
function initUpdateFcrelationship(obj) {
    for (var id in obj) {
    	if (id == "C_STARTOCSECTIONID" || id == "C_ENDOCSECTIONID") {
            var name = formatfeatureName(obj[id]);
            $('#' + id).val(name);
        } else {
            $('#' + id).val(obj[id]);
        }
    }
    rowData = "";
}

/**
 * 保存
 */
function submitFcrelationshipInfo() {
    var fcrelationshipInfo = getFormJson('fcrelationship_form');
    var flag1 = true, flag1 = true;
    //根据选择的模糊数据转换成空间数据ID
    for (var i = 0; i < blurData.length; i++) {
        if (blurData[i].Name == fcrelationshipInfo.C_STARTOCSECTIONID) { //开始光缆段
            fcrelationshipInfo.C_STARTOCSECTIONID = blurData[i].ID;
            flag1 = false;
        } else if (blurData[i].Name == fcrelationshipInfo.C_ENDOCSECTIONID) { //结束光缆段
            fcrelationshipInfo.C_ENDOCSECTIONID = blurData[i].ID;
            flag2 = false;
        }
    }
    if (flag1) {
        fcrelationshipInfo.C_STARTOCSECTIONID = "";
    }
    if (flag2) {
        fcrelationshipInfo.C_ENDOCSECTIONID = "";
    }
    $.post('/T_FCRELATIONSHIP/save.action', fcrelationshipInfo, function (result) {
        closeFcrelationship();
        swal(result.title, '', "success");
        $('#fcrelationshipTable').bootstrapTable('refresh');
    }, "json");
}

/**
 *  查询
 */
function searchFcrelationshipInfo() {
    $.post('/T_FCRELATIONSHIP/queryPage.action',
    {
        "search.C_BEARERCONTENT*like": '%' + $("#fibercore_content").val() + '%',
        "page_pn": 1,
        "page_size": 10
    },
    function (data) {
        $('#fcrelationshipTable').bootstrapTable('load', data);
    }, 'json');
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
    return dt.format("yyyy-MM-dd"); //扩展的Date的format方法(
}

Date.prototype.format = function (format) {
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
