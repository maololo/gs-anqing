var sd_residualcableData={};

function init(){
	sd_residualcableData.layer = excessiveObject.layer;
	sd_residualcableData.layer_name = excessiveObject.layerName;
	sd_residualcableData.DrawType = excessiveObject.DrawType;
	sd_residualcableData.field = 'Latlong';
	sd_residualcableData.features = layerAttributeTableData;
	excessiveObject = {};
	$("#residualcable_filterField").empty();
	$.ajax({
		// 请求地址
		url : "/" + sd_residualcableData.layer_name + "/querySpatialTableField.action",
		data : {},// 设置请求参数
		type : "post",// 请求方法
		async : false,
		dataType : "json",// 设置服务器响应类型
		// success：请求成功之后执行的回调函数 data：服务器响应的数据
		success : function(data) {
			$("#residualcable_filterField").append("<option value=''>请选择字段</option>");
			for ( var i in data) {
				if (data[i].FIELD != null && data[i].VALUE != "ID"
					&& data[i].VALUE != "OBJECTID") {
					$("#residualcable_filterField").append(
							"<option value='" + data[i].VALUE + "'>"+ data[i].FIELD + "</option>");
				}
			}
		}
	});
	
	
	// bootstrap table操作按钮 （查询结果表）
	window.operateEventsResidualcable = {
		'click .residualcableDeldteFeature' : function(e, value, row, index) {
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
					 editWFSFeature([row],'delete',sd_residualcableData.layer_name);
					 //删除地图上的Feature
					 sd_residualcableData.source.getSource().removeFeature(row);
					 //删除bootstrapTable表格里的Feature
					 $('#sd_residualcableTable').bootstrapTable('remove', {field: 'ID', values: row.values_.ID});
					swal("删除成功", '', "success");
				}
			});
		},
		'click .residualcableEditFeature' : function(e, value, row, index) {
			// 将jspanel弹窗缩成一行
			document.querySelector('#sd_residualcable1').jspanel.smallify();
			
			closeAttributeInfoObj();
			// 保存数据
			editObject = {};
			editObject.layer_name = sd_residualcableData.layer_name;
			editObject.feature = row;
			editObject.source = sd_residualcableData.layer.getSource();
			editObject.editType = "update";
			editObject.index = index;
			editObject.manually_modify = true;
			editObject.field = "";
			
			clearHighlightObj();
			
			var select = new ol.interaction.Select();
			// 设置要素高亮
			highlightObj = select.getFeatures();
			highlightObj.push(row);
			map.addInteraction(select);
			jsPanelAttributeInfo(sd_residualcableData.layer_name);
			
			// 获取要素的几何范围
			var latlon = row.getGeometry().flatCoordinates;
			map.getView().setCenter(latlon);
		    map.render();
		},
		'click .residualcablePositionFeature' : function(e, value, row, index) {
			// 将jspanel弹窗缩成一行
			document.querySelector('#sd_residualcable1').jspanel.smallify();
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
	displayResidualcableData(sd_residualcableData.features, sd_residualcableData.layer_name );
}

//更改图层下拉框后查询属性
function residualcableFilterField(fieldValue) {
	if (fieldValue != "请选择字段") {
		if (fieldValue.indexOf("(") > 0) {
			fieldValue = fieldValue.substring(0, fieldValue.indexOf("("));
		}
		var data = queryEnumerateByField(fieldValue);
		if (data != "" && data != null) {
			$('#residualcable_filterFieldInput').hide();
			$('#residualcable_filterFieldSelect').show();
			$("#residualcable_filterFieldSelectValue").empty();
			$("#residualcable_filterFieldSelectValue").append(
					"<option value=''>所有值</option>");
			for (var i = 0; i < data.length; i++) {
				$('#residualcable_filterFieldSelectValue').append(
						"<option value=" + data[i].C_VALUE + ">"
								+ data[i].C_NAME + "</option>");
			}

		} else {
			$('#residualcable_filterFieldSelect').hide();
			$('#residualcable_filterFieldInput').show();
		}
	}else{
		$('#residualcable_filterFieldInput').hide();
		$('#residualcable_filterFieldSelect').hide();
	}

}
//根据经纬度添加要素
function addResidualcableFeature(){
	editObject={};
	editObject.layer = sd_residualcableData.layer;
	editObject.layer_name = sd_residualcableData.layer_name;
	editObject.DrawType = sd_residualcableData.DrawType;
	editObject.field = sd_residualcableData.field;
	
	closeAttributeInfoObj();
	jsPanelAttributeInfo(sd_residualcableData.layer_name);
}

//将数据在table中显示
function displayResidualcableData(features, layerType) {
	// 销毁查询结果 bootstrapTable
	$('#sd_residualcableTable').bootstrapTable('destroy');
	$('#sd_residualcableTable').bootstrapTable({
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
		columns :   [ {
			field : 'ID',
			title : '所属光缆段ID',
			align : 'center',
			valign : 'top',
			sortable : true,
			visible : false,
			formatter : function(value, row, index) {
				return row.values_.ID;
			}
		}, {
			field : 'LENGTH',
			title : '长度',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.LENGTH;
			}
		}, {
			field : 'MAINTENANCEUNIT',
			title : '行政区划',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.MAINTENANCEUNIT;
			}
		}, {
			field : 'ASSETUNIT',
			title : '维护单位',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.ASSETUNIT;
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
			field : 'REMARK',
			title : '备注',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.REMARK;
			}
		}, {
			field : 'OPERATE',
			title : '操作',
			align : 'center',
			valign : 'middle',
			sortable : true,
			width : '125px',
			events : operateEventsResidualcable,  // 给按钮注册事件
			formatter : operateFormatResidualcable  // 表格中增加按钮
		} ]
	});
}

//bootstrap table操作按钮 （查询结果表）
function operateFormatResidualcable(val, row, index) {
	return ['<button class="residualcableEditFeature btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="修改"><span  class=" glyphicon glyphicon-edit " ><span></button>',
			'<button class="residualcableDeldteFeature  btn btn-sm rolebtn" style=" background: none;outline:none;color:red" title="删除"><span  class=" glyphicon glyphicon-trash " ><span></button>',
			'<button class="residualcablePositionFeature  btn btn-sm rolebtn" style="background: none;outline:none;color: #bf824c" title="定位"><span  class=" glyphicon glyphicon-record  " ><span></button>'
	       ].join('');
}
//属性表中的查询按钮
function queryResidualcableFeature() {
	var filter_field = $('#residualcable_filterField').val();
	var filterField = 'ID',filterValue = '*';
	if(filter_field!=""){
		// 获取过滤字段结果
		var field = $('#residualcable_filterField option:selected').text();
		var value = "",valueID="";
		if(field.indexOf("(") > 0) {
			field = field.substring(0, field.indexOf("("));
		}
		// 根据过滤字段查询后面是文本框还是下拉框，并获取其结果
		var data = queryEnumerateByField(field);
		if (data == "") {
			value = $('#residualcable_filterFieldInputValue').val();
			valueID = "#residualcable_filterFieldInputValue";
		} else {
			value = $('#residualcable_filterFieldSelectValue').val();
			valueID = "#residualcable_filterFieldSelectValue";
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
	if(sd_residualcableData.features.length==0){
		swal('此图层没有数据!', '', "warning");
		return;
	}
		
		$(".table-content").mLoading("show");
		var featureNS = "http://" + queryWFSURL() + "/anqing";
		var featureRequest = new ol.format.WFS().writeGetFeature({
			srsName : 'EPSG:4326',
			// featureNS: 'http://172.16.15.147:8080/pipeline',
//			featureNS : featureNS,
			featurePrefix : 'anqing',
			featureTypes : [ sd_residualcableData.layer_name ],
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
				$('#sd_residualcableTable').bootstrapTable('removeAll');
			} else {
				 $('#sd_residualcableTable').bootstrapTable('load', features);
				// 显示数据
				 displayResidualcableData(features, sd_residualcableData.layer_name);
				$(".table-content").mLoading("hide");
			}
		});
}