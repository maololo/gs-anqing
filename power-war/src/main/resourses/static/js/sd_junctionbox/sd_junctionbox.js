var sd_junctionboxData={};

function init(){
	sd_junctionboxData.layer = excessiveObject.layer;
	sd_junctionboxData.layer_name = excessiveObject.layerName;
	sd_junctionboxData.DrawType = excessiveObject.DrawType;
	sd_junctionboxData.field = 'Latlong';
	sd_junctionboxData.features = layerAttributeTableData;
	excessiveObject = {};
	$("#junctionbox_filterField").empty();
	$.ajax({
		// 请求地址
		url : "/" + sd_junctionboxData.layer_name + "/querySpatialTableField.action",
		data : {},// 设置请求参数
		type : "post",// 请求方法
		async : false,
		dataType : "json",// 设置服务器响应类型
		// success：请求成功之后执行的回调函数 data：服务器响应的数据
		success : function(data) {
			$("#junctionbox_filterField").append("<option value=''>请选择字段</option>");
			for ( var i in data) {
				if (data[i].FIELD != null && data[i].VALUE != "ID"
					&& data[i].VALUE != "OBJECTID") {
					$("#junctionbox_filterField").append(
							"<option value='" + data[i].VALUE + "'>"+ data[i].FIELD + "</option>");
				}
			}
		}
	});
	
	
	// bootstrap table操作按钮 （查询结果表）
	window.operateEventsJunctionbox = {
		'click .JunctionboxDeldteFeature' : function(e, value, row, index) {
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
					 editWFSFeature([row],'delete',sd_junctionboxData.layer_name);
					 //删除地图上的Feature
					 sd_junctionboxData.source.getSource().removeFeature(row);
					 //删除bootstrapTable表格里的Feature
					 $('#sd_junctionboxTable').bootstrapTable('remove', {field: 'ID', values: row.values_.ID});
					swal("删除成功", '', "success");
				}
			});
		},
		'click .JunctionboxEditFeature' : function(e, value, row, index) {
			// 将jspanel弹窗缩成一行
			document.querySelector('#sd_junctionbox1').jspanel.smallify();
			
			closeAttributeInfoObj();
			// 保存数据
			editObject = {};
			editObject.layer_name = sd_junctionboxData.layer_name;
			editObject.feature = row;
			editObject.source = sd_junctionboxData.layer.getSource();
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
			jsPanelAttributeInfo(sd_junctionboxData.layer_name);
			
			// 获取要素的几何范围
			var latlon = row.getGeometry().flatCoordinates;
			map.getView().setCenter(latlon);
		    map.render();
		},
		'click .JunctionboxPositionFeature' : function(e, value, row, index) {
			// 将jspanel弹窗缩成一行
			document.querySelector('#sd_junctionbox1').jspanel.smallify();
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
	displayJunctionboxData(sd_junctionboxData.features, sd_junctionboxData.layer_name );
}

//更改图层下拉框后查询属性
function JunctionboxFilterField(fieldValue) {
	if (fieldValue != "请选择字段") {
		if (fieldValue.indexOf("(") > 0) {
			fieldValue = fieldValue.substring(0, fieldValue.indexOf("("));
		}
		var data = queryEnumerateByField(fieldValue);
		if (data != "" && data != null) {
			$('#junctionbox_filterFieldInput').hide();
			$('#junctionbox_filterFieldSelect').show();
			$("#junctionbox_filterFieldSelectValue").empty();
			$("#junctionbox_filterFieldSelectValue").append(
					"<option value=''>所有值</option>");
			for (var i = 0; i < data.length; i++) {
				$('#junctionbox_filterFieldSelectValue').append(
						"<option value=" + data[i].C_VALUE + ">"
								+ data[i].C_NAME + "</option>");
			}

		} else {
			$('#junctionbox_filterFieldSelect').hide();
			$('#junctionbox_filterFieldInput').show();
		}
	}else{
		$('#junctionbox_filterFieldInput').hide();
		$('#junctionbox_filterFieldSelect').hide();
	}

}
//根据经纬度添加要素
function addJunctionboxFeature(){
	editObject={};
	editObject.layer = sd_junctionboxData.layer;
	editObject.layer_name = sd_junctionboxData.layer_name;
	editObject.DrawType = sd_junctionboxData.DrawType;
	editObject.field = sd_junctionboxData.field;
	
	closeAttributeInfoObj();
	jsPanelAttributeInfo(sd_junctionboxData.layer_name);
}

//将数据在table中显示
function displayJunctionboxData(features, layerType) {
	// 销毁查询结果 bootstrapTable
	$('#sd_junctionboxTable').bootstrapTable('destroy');
	$('#sd_junctionboxTable').bootstrapTable({
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
			field : 'POSITION',
			title : '位置',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.POSITION;
			}
		}, {
			field : 'SPECIFICATIONS',
			title : '规格标识',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.SPECIFICATIONS;
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
			events : operateEventsJunctionbox,  // 给按钮注册事件
			formatter : operateFormatJunctionbox  // 表格中增加按钮
		} ]
	});
}

//bootstrap table操作按钮 （查询结果表）
function operateFormatJunctionbox(val, row, index) {
	return ['<button class="JunctionboxEditFeature btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="修改"><span  class=" glyphicon glyphicon-edit " ><span></button>',
			'<button class="JunctionboxDeldteFeature  btn btn-sm rolebtn" style=" background: none;outline:none;color:red" title="删除"><span  class=" glyphicon glyphicon-trash " ><span></button>',
			'<button class="JunctionboxPositionFeature  btn btn-sm rolebtn" style="background: none;outline:none;color: #bf824c" title="定位"><span  class=" glyphicon glyphicon-record  " ><span></button>'
	       ].join('');
}
//属性表中的查询按钮
function queryJunctionboxFeature() {
	var filter_field = $('#junctionbox_filterField').val();
	var filterField = 'ID',filterValue = '*';
	if(filter_field!=""){
		// 获取过滤字段结果
		var field = $('#junctionbox_filterField option:selected').text();
		var value = "",valueID="";
		if(field.indexOf("(") > 0) {
			field = field.substring(0, field.indexOf("("));
		}
		// 根据过滤字段查询后面是文本框还是下拉框，并获取其结果
		var data = queryEnumerateByField(field);
		if (data == "") {
			value = $('#junctionbox_filterFieldInputValue').val();
			valueID = "#junctionbox_filterFieldInputValue";
		} else {
			value = $('#junctionbox_filterFieldSelectValue').val();
			valueID = "#junctionbox_filterFieldSelectValue";
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
	if(sd_junctionboxData.features.length==0){
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
			featureTypes : [ sd_junctionboxData.layer_name ],
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
				$('#sd_junctionboxTable').bootstrapTable('removeAll');
			} else {
				 $('#sd_junctionboxTable').bootstrapTable('load', features);
				// 显示数据
				 displayJunctionboxData(features, sd_junctionboxData.layer_name);
				$(".table-content").mLoading("hide");
			}
		});
}