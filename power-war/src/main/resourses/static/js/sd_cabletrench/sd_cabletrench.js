var sd_cabletrenchData={};

function init(){
	sd_cabletrenchData.layer = excessiveObject.layer;
	sd_cabletrenchData.layer_name = excessiveObject.layerName;
	sd_cabletrenchData.DrawType = excessiveObject.DrawType;
	sd_cabletrenchData.field = 'Latlong';
	sd_cabletrenchData.features = layerAttributeTableData;
	excessiveObject = {};
	$("#cabletrench_filterField").empty();
	$.ajax({
		// 请求地址
		url : "/" + sd_cabletrenchData.layer_name + "/querySpatialTableField.action",
		data : {},// 设置请求参数
		type : "post",// 请求方法
		async : false,
		dataType : "json",// 设置服务器响应类型
		// success：请求成功之后执行的回调函数 data：服务器响应的数据
		success : function(data) {
			$("#cabletrench_filterField").append("<option value=''>请选择字段</option>");
			for ( var i in data) {
				if (data[i].FIELD != null && data[i].VALUE != "ID"
					&& data[i].VALUE != "OBJECTID") {
					$("#cabletrench_filterField").append(
							"<option value='" + data[i].VALUE + "'>"+ data[i].FIELD + "</option>");
				}
			}
		}
	});
	
	
	// bootstrap table操作按钮 （查询结果表）
	window.operateEventsCabletrench = {
		'click .cabletrenchDeldteFeature' : function(e, value, row, index) {
			$(this).css("background", "#308374")
			swal({
				title : "确定删除此数据？",
				text : "删除后不可恢复,请谨慎操作!",
				type : "warning",
				showCancelButton : true,
				confirmButtonColor : "#DD6B55",
				confirmButtonText : "确定",
				cancelButtonText : "取消",
				closeOnConfirm : false
			}, function(isConfirm) {
				if (isConfirm) {
					 //删除数据库Feature
					 editWFSFeature([row],'delete',sd_cabletrenchData.layer_name);
					 //删除地图上的Feature
					 sd_cabletrenchData.source.getSource().removeFeature(row);
					 //删除bootstrapTable表格里的Feature
					 $('#sd_cabletrenchTable').bootstrapTable('remove', {field: 'ID', values: row.values_.ID});
					swal("删除成功", '', "success");
				}
			});
		},
		'click .cabletrenchEditFeature' : function(e, value, row, index) {
			// 将jspanel弹窗缩成一行
			document.querySelector('#sd_cabletrench1').jspanel.smallify();
			
			closeAttributeInfoObj();
			// 保存数据
			editObject = {};
			editObject.layer_name = sd_cabletrenchData.layer_name;
			editObject.feature = row;
			editObject.source = sd_cabletrenchData.layer.getSource();
			editObject.editType = "update";
			editObject.index = index;
			editObject.field = "";
			
			clearHighlightObj();
			
			var select = new ol.interaction.Select();
			// 设置要素高亮
			highlightObj = select.getFeatures();
			highlightObj.push(row);
			var modify = new ol.interaction.Modify({
				features : select.getFeatures()
			});
			map.addInteraction(select);
			map.addInteraction(modify);
			select.on('select',function(e) {
				highlightObj={};
						if (e.selected[0] != undefined && e.selected[0].id_ == row.id_) {
							modify.setActive(true);
						} else {
							modify.setActive(false);
						}
					});
			jsPanelAttributeInfo(sd_cabletrenchData.layer_name);
			
			// 获取要素的几何范围
			var latlon = row.getGeometry().flatCoordinates;
			map.getView().setCenter(latlon);
		    map.render();
		},
		'click .cabletrenchPositionFeature' : function(e, value, row, index) {
			// 将jspanel弹窗缩成一行
			document.querySelector('#sd_cabletrench1').jspanel.smallify();
			var feature = row;
			clearHighlightObj();
			var selectEvent = new ol.interaction.Select();
			map.addInteraction(selectEvent);
			// 设置要素高亮
			highlightObj = selectEvent.getFeatures();
			highlightObj.push(feature);
			// 获取要素的经纬度
			var latlon = feature.getGeometry().flatCoordinates;
			map.getView().setCenter(latlon);
		    map.render();
		}

	};
	
	// 展示数据
	displayCabletrenchData(sd_cabletrenchData.features, sd_cabletrenchData.layer_name );
}

//更改图层下拉框后查询属性
function cabletrenchFilterField(fieldValue) {
	if (fieldValue != "请选择字段") {
		if (fieldValue.indexOf("(") > 0) {
			fieldValue = fieldValue.substring(0, fieldValue.indexOf("("));
		}
		var data = queryEnumerateByField(fieldValue);
		if (data != "" && data != null) {
			$('#cabletrench_filterFieldInput').hide();
			$('#cabletrench_filterFieldSelect').show();
			$("#cabletrench_filterFieldSelectValue").empty();
			$("#cabletrench_filterFieldSelectValue").append(
					"<option value=''>所有值</option>");
			for (var i = 0; i < data.length; i++) {
				$('#cabletrench_filterFieldSelectValue').append(
						"<option value=" + data[i].C_VALUE + ">"
								+ data[i].C_NAME + "</option>");
			}

		} else {
			$('#cabletrench_filterFieldSelect').hide();
			$('#cabletrench_filterFieldInput').show();
		}
	}else{
		$('#cabletrench_filterFieldInput').hide();
		$('#cabletrench_filterFieldSelect').hide();
	}

}
//根据经纬度添加要素
function addCabletrenchFeature(){
	editObject={};
	editObject.layer = sd_cabletrenchData.layer;
	editObject.layer_name = sd_cabletrenchData.layer_name;
	editObject.DrawType = sd_cabletrenchData.DrawType;
	editObject.field = sd_cabletrenchData.field;
	
	closeAttributeInfoObj();
	jsPanelAttributeInfo(sd_cabletrenchData.layer_name);
}

//将数据在table中显示
function displayCabletrenchData(features, layerType) {
	// 销毁查询结果 bootstrapTable
	$('#sd_cabletrenchTable').bootstrapTable('destroy');
	$('#sd_cabletrenchTable').bootstrapTable({
		data : features,
		method : 'post',
		striped : true,
		dataType : "json",
		pagination : true,
		queryParamsType : "limit",
		singleSelect : false,
		undefinedText:"",
		contentType : "application/x-www-form-urlencoded",
		pageSize : 10,
		pageNumber : 1,
		showColumns : false, // 不显示下拉框（选择显示的列）
		sidePagination : "client",
		queryParams : queryParams,// 分页参数
		uniqueId:'ID',
//		search:true,
		// clickToSelect: true,
		// height: 480,
		columns :  [ {
			field : 'ID',
			title : '编码',
			align : 'center',
			valign : 'top',
			sortable : true,
			visible : false,
			formatter : function(value, row, index) {
				return row.values_.ID;
			}
		},{
			field : 'PMSID',
			title : 'PMS系统编码',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.PMSID;
			}
		}, {
			field : 'NAME',
			title : '名称',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.NAME;
			}
		}, {
			field : 'BURIEDLENGTH',
			title : '埋设长度(米)',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.BURIEDLENGTH;
			}
		}, {
			field : 'BURIEDWIDTH',
			title : '埋设宽度(米)',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.BURIEDWIDTH;
			}
		}, {
			field : 'STARTPOSITION',
			title : '起点井',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.STARTPOSITION;
			}
		}, {
			field : 'ENDPOSITION',
			title : '终点井',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.ENDPOSITION;
			}
		}, {
			field : 'ASSETUNIT',
			title : '资产单位',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.ASSETUNIT;
			}
		}, {
			field : 'MAINTENANCEUNIT',
			title : '维护单位',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.MAINTENANCEUNIT;
			}
		}, {
			field : 'OPERATE',
			title : '操作',
			align : 'center',
			valign : 'middle',
			sortable : true,
			width : '125px',
			events : operateEventsCabletrench,  // 给按钮注册事件
			formatter : operateFormatCabletrench  // 表格中增加按钮
		} ]
	});
}
//设置传入参数
function queryParams(params) {
	return {
		page_pn : params.pageNumber,
		sColumn : params.sort,
		order : params.order,
		page_size : params.limit
	}
}
//bootstrap table操作按钮 （查询结果表）
function operateFormatCabletrench(val, row, index) {
	return ['<button class="cabletrenchEditFeature btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="修改"><span  class=" glyphicon glyphicon-edit " ><span></button>',
			'<button class="cabletrenchDeldteFeature  btn btn-sm rolebtn" style=" background: none;outline:none;color:red" title="删除"><span  class=" glyphicon glyphicon-trash " ><span></button>',
			'<button class="cabletrenchPositionFeature  btn btn-sm rolebtn" style="background: none;outline:none;color: #bf824c" title="定位"><span  class=" glyphicon glyphicon-record  " ><span></button>'
	       ].join('');
}
//属性表中的查询按钮
function queryCabletrenchFeature() {
	var filter_field = $('#cabletrench_filterField').val();
	var filterField = 'ID',filterValue = '*';
	if(filter_field!=""){
		// 获取过滤字段结果
		var field = $('#cabletrench_filterField option:selected').text();
		var value = "",valueID="";
		if(field.indexOf("(") > 0) {
			field = field.substring(0, field.indexOf("("));
		}
		// 根据过滤字段查询后面是文本框还是下拉框，并获取其结果
		var data = queryEnumerateByField(field);
		if (data == "") {
			value = $('#cabletrench_filterFieldInputValue').val();
			valueID = "#cabletrench_filterFieldInputValue";
		} else {
			value = $('#cabletrench_filterFieldSelectValue').val();
			valueID = "#cabletrench_filterFieldSelectValue";
		}
		if(value == ""){
			$(valueID).focus();
			swal('请给'+field+'相应的值！', '', "warning");
			return;
		}
		filterField = filter_field;
		filterValue = '*'+value+'*';
	}
	//判断图层是否为空
//	if(sd_cabletrenchData.features.length==0){
//		swal('此图层没有数据!', '', "warning");
//		return;
//	}
		
		$(".table-content").mLoading("show");
		var featureNS = "http://" + queryWFSURL() + "/anqing";
		var featureRequest = new ol.format.WFS().writeGetFeature({
			srsName : 'EPSG:4326',
			// featureNS: 'http://172.16.15.147:8080/pipeline',
//			featureNS : featureNS,
			featurePrefix : 'anqing',
			featureTypes : [ sd_cabletrenchData.layer_name ],
			outputFormat : 'application/json',
			geometryName : "the_geom",
			filter : ol.format.filter.like(filterField,filterValue)
		});

		// 然后发布请求并将接收到数据在表格中显示
		var featureUrl = "http://" + queryWFSURL() + "/geoserver/wfs";
		fetch(featureUrl, {
			method : 'POST',
			body : new XMLSerializer().serializeToString(featureRequest)
		}).then(function(response) {
			return response.json();
		}).then(function(json) {
			var features = new ol.format.GeoJSON().readFeatures(json);
			if (features.length == 0) {
				$(".table-content").mLoading("hide");
				swal('没有查到符合条件的数据', '', "warning");
				$('#sd_cabletrenchTable').bootstrapTable('removeAll');
			} else {
				 $('#sd_cabletrenchTable').bootstrapTable('load', features);
				// 显示数据
				 displayCabletrenchData(features, sd_cabletrenchData.layer_name);
				$(".table-content").mLoading("hide");
			}
		});
}