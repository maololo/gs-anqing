var clickStatus = ""; // 点击radio状态描述
var $table = $('#Fiber-optic');
var $add = $('#addOptic');
var $remove = $('#delectOptic');
var lightData = [];

function init(){
	$.ajax({
		url:"/T_DISTRIBUTIONINFO/search.action",
    	data:{"search.C_EQUIPMENTCODE*eq":rowData.C_CODE},
    	type:"post",
        dataType:"Json",
        async:false,
        success: function(data){
        	if (!$.isEmptyObject(data)) {
        		lightData = data;
        	}
        }
    })
	
    // 在用 
    $('.opticGraph #span1').click(function(){
    	clickStatus = "在用";
    	$('#Fiber-optic td').click(function (){
    		$(this).children("span").css({"border":"none","background":"none","background-color":"red"});
    	});
    });
    
   	// 备用
    $('.opticGraph #span2').click(function(){
    	clickStatus = "备用";
    	$('#Fiber-optic td').click(function (){
    		$(this).children("span").css({"border":"none","background":"none","background-color":"#059929"});
        });
    });
    
   	// 故障芯
    $('.opticGraph #span3').click(function(){
    	clickStatus = "故障芯";
    	$('#Fiber-optic td').click(function (){
    		$(this).children("span").css({"background": "url(../../images/malfunction.png)","border":"0"});
    		$(this).children("span").addClass("selected");
        });
    });
    
   	// 空
    $('.opticGraph #span4').click(function(){
    	clickStatus = "空";
    	$('#Fiber-optic td').click(function (){
    		$(this).children("span").css({"border":"1px solid #64a3e6","background":"none"});
        });
    });
    
    // 封存
    $('.opticGraph #span5').click(function(){
    	clickStatus = "封存";
    	$('#Fiber-optic td').click(function (){
    		$(this).children("span").css({"background": "url(/images/safekeeping.png)","border":"0"});
    		$(this).children("span").addClass("selecteds");
        });
    });
    
    $table.bootstrapTable({
    	data: lightData,
        method:'post',
        dataType: "json",
        clickToSelect: false,
        sortName: "C_DISKID",
        sortOrder: "asc",
        striped: true, // 隔行变色
        columns: [{
        	field: 'ISCHK',
        	class: 'width-2',
            checkbox : true
        }
        ,{
        	field: 'C_DISKID',
            title: '盘序',
            class: 'width-2',
            formatter: indexFormatter
	    }
        ,{
        	field: 'C_CODE',
        	visible: false
        }
        ,{
            field: 'C_FF1STATUS',
            title: '1',
            class: 'width-2',
            formatter: lightFormatter
        }, 
        {
            field: 'C_FF2STATUS',
            title: '2',
            class: 'width-2',
            formatter: lightFormatter
        },
        {
            field: 'C_FF3STATUS',
            title: '3',
            class: 'width-2',
            formatter: lightFormatter
        },
        {
            field: 'C_FF4STATUS',
            title: '4',
            class: 'width-2',
            formatter: lightFormatter
        },
        {
            field: 'C_FF5STATUS',
            title: '5',
            class: 'width-2',
            formatter: lightFormatter
        },
        {
            field: 'C_FF6STATUS',
            title: '6',
            class: 'width-2',
            formatter: lightFormatter
        },
        {
            field: 'C_FF7STATUS',
            title: '7',
            class: 'width-2',
            formatter: lightFormatter
        },
        {
            field: 'C_FF8STATUS',
            title: '8',
            class: 'width-2',
            formatter: lightFormatter
        },
        {
            field: 'C_FF9STATUS',
            title: '9',
            class: 'width-2',
            formatter: lightFormatter
        },
        {
            field: 'C_FF10STATUS',
            title: '10',
            class: 'width-2',
            formatter: lightFormatter
        },
        {
            field: 'C_FF11STATUS',
            title: '11',
            class: 'width-2',
            formatter: lightFormatter
        },
        {
            field: 'C_FF12STATUS',
            title: '12',
            class: 'width-2',
            formatter: lightFormatter
        },
        {
            field: 'C_REMARK',
            title: '备注',
            class: 'width-3',
            formatter: inputFormatter
        },
        {
	    	field: 'C_ID',
	    	visible: false
	    }],
	    onPostBody: function (data) {
	    	if (!$.isEmptyObject(data)) {
	    		var trList = $table.children().children("tr");
	    		for(var i = 0; i < data.length; i++){
	    			var row = data[i];
	    			trList.eq(i + 1).find("input[name='c_id']").val(row.C_ID);
	    		}
	    	}
        },
        formatLoadingMessage: function () {
            return "请稍等，正在加载中...";
        },
        formatNoMatches: function () {
            return '无符合条件的记录';
        }
    });

    $remove.click(function () {
    	var ids = $.map($table.bootstrapTable('getSelections'), function (row) {
            return row.C_ID;
        });
    	if($.isEmptyObject(ids)){
    		swal("请选择需要删除的数据！",'',"error");
    	}else{
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
	  			// 先更新
	  			updateRemark();
	  	        // 后删除
	  	        $table.bootstrapTable('remove', {
	  	            field: 'C_ID',
	  	            values: ids
	  	        });
	  	        var flag = true;
	  	        for(var i = 0; i < ids.length; i++){
	  	        	$.post('/T_DISTRIBUTIONINFO/delete.action', {"ID":ids[i]},
	  	          		function(result){
	  	      				if (!result.success){ 
	  	      	            	flag = false;
	  	      	            }
	                  	},'json'
	              	);
	  	        }
	  	        if(flag){
					swal("删除成功！",'',"success");
	  	        }else{
	  	        	swal("删除失败！",'',"error");
	  	        }
	  		});
    	}
    });
    
    $add.click(function () {
    	// 先更新
    	updateRemark();
        // 后添加
    	var hang = $("#Fiber-optic input[type='checkbox']").length;
    	var d = "C_EQUIPMENTCODE=" + rowData.C_CODE + "&C_DISKID=" + hang;
        $.post('/T_DISTRIBUTIONINFO/save.action', d, function(result){
        	$.ajax({
        		url:"/T_DISTRIBUTIONINFO/search.action",
            	data:{"search.C_EQUIPMENTCODE*eq":rowData.C_CODE},
            	type:"post",
                dataType:"Json",
                async:false,
                success: function(data){
                	if (!$.isEmptyObject(data)) {
                		lightData = data;
                		$table.bootstrapTable('load', data);
                	}
                }
            });
        });
    });  
    
    // 点击某一列的时候触发
    $table.on('click-cell.bs.table', function (e, field, value, row) {
    	if(!isEmpty(clickStatus) && !isEmpty(field) && field != "C_REMARK" && field.indexOf("C_") >= 0){
    		var obj = {};
        	obj["search.C_ID*eq"] = row.C_ID;
    		obj[field] = clickStatus;
    		$.post('/T_DISTRIBUTIONINFO/update.action', obj);
    		init();
    	}
	});
    
    // 点击关闭按钮时触发
    $("#lightbox1 .jsglyph-close").click(function(){
    	updateRemark();
    });
}

function updateRemark(){
	var allData = [];
	$("input[name='C_REMARK']").each(function(i, item){
		// 盘号
		var disk = $(this).parent().parent().find("span[class='c_disk']").text();
		var c_id = $(this).parent().parent().find("input[name='c_id']").val();
		var objData = {};
		objData.C_DISKID = disk;
		objData.C_REMARK = item.value;
		objData["search.C_ID*eq"] = c_id;
		allData.push(objData);
    });
	for(var j = 0; j < allData.length; j++){
		$.post('/T_DISTRIBUTIONINFO/update.action', allData[j]);
	}
}

function lightFormatter(val, row, index){
	// 光缆名称 C_OCSECTIONID
	var line = "未设定";
	// 当前熔纤端芯数
	var port_r = "0";
	// 连接设备的名称
	var point_eqt = "未设定";
	// 连接光缆的名称
	var point_line = "未设定";
	// 连接光缆的盘号
	var point_disk = "0";
	// 连接光缆的端子号
	var point_port = "0";
	// 连接光缆熔纤端芯数
	var point_port_r = "0";
	
	var obj = getFeatureObjByCodeAndModel(row.C_OCSECTIONID, "SD_OPTICALCABLESECTION");
	if (!$.isEmptyObject(obj)) {         
        line = obj.NAME;
    }
	
	var f = this.field;
	if(!isEmpty(f)){
		// 当前端子号
		var reg = /^\+?[0-9][0-9]*$/;
		var num = f.substring(4, 5);
		var secNum = f.substring(5, 6);
		if(reg.test(secNum)){// 验证是否为数字
			num = num + secNum;
		}
		if(!isEmpty(num)){
			// 当前熔纤端芯数
			var r = eval("row.C_FF" + num);
			if(!isEmpty(r)){
				port_r = r;
			}
			// 跳纤端
			var t = eval("row.C_JF" + num);
			if(!isEmpty(t)){
				if(rowData.C_TYPE == "ODF"){
					// 获取连接设备编号
					var eCode = t.substring(0, 36);
					var tableObj = getTableObjByParamAndModel({"search.C_CODE*eq": eCode}, "T_EQUIPMENT");
					if (!$.isEmptyObject(tableObj)) {         
				        var d = tableObj[0];
				        point_eqt = d.C_NAME;
				    }
					// 获取连接光缆的端子号
					point_port = t.substring(t.length - 2, t.length);
					// 获取指向的盘序
					var point_disk = t.substring(36, t.length - 2);
					// 连接光缆的信息
					if(!isEmpty(point_disk) && !isEmpty(eCode)){
						var pointData = queryTableByData("/T_DISTRIBUTIONINFO/search.action", {"search.C_EQUIPMENTCODE*eq": eCode, "search.C_DISKID*eq": point_disk});
						if (!$.isEmptyObject(pointData[0])) {
							var pCode = pointData[0].C_OCSECTIONID;
							var info = getFeatureObjByCodeAndModel(pCode, "SD_OPTICALCABLESECTION");
							if (!$.isEmptyObject(info)) {         
						        point_line = info.NAME;
						    }
							if(!isEmpty(eval("pointData[0].C_FF" + parseInt(point_port)))){
								point_port_r = eval("pointData[0].C_FF" + parseInt(point_port));
							}
						}
					}
					if(val == "在用"){
						port_title = "熔纤信息：" + line + ",第" + port_r + "芯" ; 
						port_title = port_title + "&#10;跳纤信息：" + point_eqt + "," + parseInt(point_disk) + "-" + parseInt(point_port);
						port_title = port_title + "&#10;连接光缆：" + point_line + ",第" + point_port_r + "芯";
					}else if(val == "备用" || val == "故障芯" || val == "封存"){
						port_title = "熔纤信息：" + line + ",第" + port_r + "芯" ;
					}else{
						
					}
				}else{
					if(val == "在用"){
						port_title = "熔纤信息：" + line + ",第" + port_r + "芯" ; 
						port_title = port_title + "&#10;跳纤信息：" + (!isEmpty(point_eqt)) ? point_eqt : rowData.C_TYPE;
					}else if(val == "备用" || val == "故障芯" || val == "封存"){
						port_title = "熔纤信息：" + line + ",第" + port_r + "芯" ;
					}else{
						
					}
				}
			}
		}
	}
		
	var m;
   	if(val == "在用"){
   		m = '<span title="' + port_title + '" class="gjt-span zy-span RoleOfEdit btn btn-sm">' + parseInt(point_disk) + "-" + parseInt(point_port) + '<span>';
   	}else if(val == "备用"){
   		m = '<span title="' + port_title + '" class="gjt-span by-span RoleOfEdit btn btn-sm"><span>';
   	}else if(val == "故障芯"){
        m = '<span title="' + port_title + '" class="gjt-span gz-span RoleOfEdit btn btn-sm selecteds"><span>';
   	}else if(val == "封存"){
   		m = '<span title="' + port_title + '" class="gjt-span fc-span RoleOfEdit btn btn-sm selecteds"><span>';
   	}else if(val == "空"){
   		m = '<span title="' + port_title + '" class="gjt-span k-span RoleOfEdit btn btn-sm"><span>';
   	}else{
   		m = '<span class="gjt-span RoleOfEdit btn btn-sm"><span>';
   	}
    return m;
}

function indexFormatter(val, row, index){
    return '<span class="c_disk">' + val + '</span><input type="hidden" name="c_id" value=""/>';
}

function idFormatter(val, row, index){
	$(this).parent().parent().find("input[name='c_id']").val(val);
}

function inputFormatter(val, row, index){
	if(isEmpty(val)) val = '';
	return '<input type="text" class="form-control" name="C_REMARK" value="' + val + '"/>';
}

function upRow(){
	$table.find("tr[class='selected']").each(function(){ 
    	var $tr = $(this);
    	var i = $tr.index();
        if (i != 0) {
            $tr.fadeOut().fadeIn();
            $tr.prev().find("span[class='c_disk']").html(i + 1);
            $tr.prev().before($tr);
            $tr.find("span[class='c_disk']").html(i);
        }
	}) 
}

function downRow(){
	$table.find("tr[class='selected']").each(function(){ 
    	var $tr = $(this);
    	var i = $tr.index();
    	if (i != lightData.length - 1) {
            $tr.fadeOut().fadeIn();
            $tr.next().find("span[class='c_disk']").html(i + 1);
            $tr.next().after($tr);
            $tr.find("span[class='c_disk']").html(i + 2);
        }
	}) 
}

