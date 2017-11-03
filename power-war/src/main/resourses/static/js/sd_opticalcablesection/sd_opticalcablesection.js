var sd_opticalcablesectionData={};

function init(){
	sd_opticalcablesectionData.layer = excessiveObject.layer;
	sd_opticalcablesectionData.layer_name = excessiveObject.layerName;
	sd_opticalcablesectionData.DrawType = excessiveObject.DrawType;
	sd_opticalcablesectionData.field = 'Latlong';
	sd_opticalcablesectionData.features = layerAttributeTableData;
	excessiveObject = {};
	$("#cable_filterField").empty();
	$.ajax({
		// 请求地址
		url : "/" + sd_opticalcablesectionData.layer_name + "/querySpatialTableField.action",
		data : {},// 设置请求参数
		type : "post",// 请求方法
		async : false,
		dataType : "json",// 设置服务器响应类型
		// success：请求成功之后执行的回调函数 data：服务器响应的数据
		success : function(data) {
			$("#cable_filterField").append("<option value=''>请选择字段</option>");
			for ( var i in data) {
				if (data[i].FIELD != null && data[i].VALUE != "ID"
					&& data[i].VALUE != "OBJECTID") {
					$("#cable_filterField").append(
							"<option value='" + data[i].VALUE + "'>"+ data[i].FIELD + "</option>");
				}
			}
		}
	});
	
	
	// bootstrap table操作按钮 （查询结果表）
	window.operateEventsCable = {
		'click .cableDeldteFeature' : function(e, value, row, index) {
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
					 editWFSFeature([row],'delete',sd_opticalcablesectionData.layer_name);
					 //删除地图上的Feature
					 sd_opticalcablesectionData.source.getSource().removeFeature(row);
					 //删除bootstrapTable表格里的Feature
					 $('#sd_opticalcablesectionTable').bootstrapTable('remove', {field: 'ID', values: row.values_.ID});
					swal("删除成功", '', "success");
				}
			});
		},'click .cableFiberCore' : function(e, value, row, index) {
			//查询纤芯信息
			var  fiberCoreID = row.values_.ID;
			var title='';
			var titles = queryTableByData('/T_B_MODULE/search.action',{});
			for(var i in titles){
				var url = titles[i].C_URL;
				if(url==null){
					continue;
				}
				var name = url.split('/')[1].toLowerCase();
				if(name == 'fcrelationship'){
					title = titles[i].C_MODULENAME;
					break;
				}
			}
			var jsPanelID = window.jsPanel.activePanels.list;
			for(var i in jsPanelID){
			  if(jsPanelID[i] == 'fcrelationship' || jsPanelID[i] == 'fcrelationship1'){
				jsPanel.activePanels.getPanel(jsPanelID[i]).close();
				break;
			  }
		    }
			$.jsPanel({
				id : 'fcrelationship1',
				maximizedMargin : {
					top : 100,
					left : 170
				},
				dragit: {containment: [100, 0, 0,160]},
				position : 'center',
				theme : "rebeccapurple",
				contentSize : {
					width : 'auto',
					height : 'auto'
				},
				headerTitle : title,
				border : '2px solid rgb(7,102,104)',
				contentAjax : {
					url : '/fcrelationship/fcrelationship.action',
					autoload : true,
					done : function(data, textStatus, jqXHR, panel) {
						var data = queryTableByData("/T_FCRELATIONSHIP/queryMultiConditionData.action",
								{'C_STARTOCSECTIONID':fiberCoreID,
							    'C_ENDOCSECTIONID':fiberCoreID,});
						$('#fcrelationshipBody').hide();
						if(data==''){
							var startId = row.values_.STARTID;
							var endId = row.values_.ENDID;
							// 获取当前图层
							var layer = getLayerNodeByName('SD_OPTICALCABLESECTION').layer;
							 var features = layer.getSource().getFeatures();
							 if(startId.substring(0,4)=='0402'){
								 var id1="";
								 for(var i in features){
									 if(features[i].values_.ID != fiberCoreID ){
										 if(features[i].values_.STARTID==startId ||features[i].values_.ENDID==startId){
											 id1 = features[i].values_.ID;
											 break;
										 }
									 }
								 }
								 var newData = queryTableByData("/T_FCRELATIONSHIP/queryMultiConditionData.action",
											{'C_STARTOCSECTIONID':id1,
										    'C_ENDOCSECTIONID':id1,});
								 if(newData!=''){
									 showFcrelationshipTable(newData);
									 return;
								 }
							 }
							 if(endId.substring(0,4)=='0402'){
								 var id2="";
								 for(var i in features){
									 if(features[i].values_.ID != fiberCoreID ){
										 if(features[i].values_.STARTID==endId || features[i].values_.ENDID==endId){
											 id2 = features[i].values_.ID;
											 break;
										 }
									 }
								 }
								 var newData = queryTableByData("/T_FCRELATIONSHIP/queryMultiConditionData.action",
											{'C_STARTOCSECTIONID':id2,
										    'C_ENDOCSECTIONID':id2,});
								 if(newData!=''){
									 showFcrelationshipTable(newData);
									 return;
								 }
							 }
							 showFcrelationshipTable('');

						}else{
							showFcrelationshipTable(data);
						}
							 
					}
				},
				callback : function(panel) {
					this.content.css("padding", "5px");
				}
			});	
		},
		'click .cableEditFeature' : function(e, value, row, index) {
			var jsPanelID = window.jsPanel.activePanels.list;
			// 将jspanel弹窗缩成一行
			document.querySelector('#sd_opticalcablesection1').jspanel.smallify();
			
			closeAttributeInfoObj();
			// 保存数据
			editObject = {};
			editObject.layer_name = sd_opticalcablesectionData.layer_name;
			editObject.feature = row;
			editObject.source = sd_opticalcablesectionData.layer.getSource();
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
			jsPanelAttributeInfo(sd_opticalcablesectionData.layer_name);
			
			// 获取要素的几何范围
			var latlon = row.getGeometry().flatCoordinates;
			map.getView().setCenter(latlon);
		    map.render();
		},
		'click .cablePositionFeature' : function(e, value, row, index) {
			// 将jspanel弹窗缩成一行
			document.querySelector('#sd_opticalcablesection1').jspanel.smallify();
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
	displayCableData(sd_opticalcablesectionData.features, sd_opticalcablesectionData.layer_name );
}

//更改图层下拉框后查询属性
function cableFilterField(fieldValue) {
	if (fieldValue != "请选择字段") {
		if (fieldValue.indexOf("(") > 0) {
			fieldValue = fieldValue.substring(0, fieldValue.indexOf("("));
		}
		var data = queryEnumerateByField(fieldValue);
		if (data != "" && data != null) {
			$('#cable_filterFieldInput').hide();
			$('#cable_filterFieldSelect').show();
			$("#cable_filterFieldSelectValue").empty();
			$("#cable_filterFieldSelectValue").append(
					"<option value=''>所有值</option>");
			for (var i = 0; i < data.length; i++) {
				$('#cable_filterFieldSelectValue').append(
						"<option value=" + data[i].C_VALUE + ">"
								+ data[i].C_NAME + "</option>");
			}

		} else {
			$('#cable_filterFieldSelect').hide();
			$('#cable_filterFieldInput').show();
		}
	}else{
		$('#cable_filterFieldInput').hide();
		$('#cable_filterFieldSelect').hide();
	}

}
//根据经纬度添加要素
function addCableFeature(){
	editObject={};
	editObject.layer = sd_opticalcablesectionData.layer;
	editObject.layer_name = sd_opticalcablesectionData.layer_name;
	editObject.DrawType = sd_opticalcablesectionData.DrawType;
	editObject.field = sd_opticalcablesectionData.field;
	
	closeAttributeInfoObj();
	jsPanelAttributeInfo(sd_opticalcablesectionData.layer_name);
}

//将数据在table中显示
function displayCableData(features, layerType) {
	// 销毁查询结果 bootstrapTable
	$('#sd_opticalcablesectionTable').bootstrapTable('destroy');
	$('#sd_opticalcablesectionTable').bootstrapTable({
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
			width : '160px',
			formatter : function(value, row, index) {
				return row.values_.NAME;
			}
		}, {
			field : 'TYPE',
			title : '类型',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.TYPE;
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
			field : 'CORENUM',
			title : '芯数',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.CORENUM;
			}
		}, {
			field : 'VOLTAGECLASS',
			title : '线路电压等级',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.VOLTAGECLASS;
			}
		}, {
			field : 'LAYWAY',
			title : '敷设方式',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.LAYWAY;
			}
		}, {
			field : 'STARTID',
			title : '起点',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return formatfeatureName(row.values_.STARTID);
			}
		}, {
			field : 'ENDID',
			title : '终点',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return formatfeatureName(row.values_.ENDID);
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
			width : '170px',
			events : operateEventsCable,  // 给按钮注册事件
			formatter : operateFormatCable  // 表格中增加按钮
		} ]
	});
}

//bootstrap table操作按钮 （查询结果表）
function operateFormatCable(val, row, index) {
	return ['<button class="cableFiberCore btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="纤芯信息"><span  class="qxinfo_icon" style="display:block;" ><span></button>',
	        '<button class="cableEditFeature btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="修改"><span  class=" glyphicon glyphicon-edit " ><span></button>',
			'<button class="cableDeldteFeature  btn btn-sm rolebtn" style=" background: none;outline:none;color:red" title="删除"><span  class=" glyphicon glyphicon-trash " ><span></button>',
			'<button class="cablePositionFeature  btn btn-sm rolebtn" style="background: none;outline:none;color: #bf824c" title="定位"><span  class=" glyphicon glyphicon-record  " ><span></button>'
	       ].join('');
}
//属性表中的查询按钮
function queryCableFeature() {
	var filter_field = $('#cable_filterField').val();
	var filterField = 'ID',filterValue = '*';
	if(filter_field!=""){
		// 获取过滤字段结果
		var field = $('#cable_filterField option:selected').text();
		var value = "",valueID="";
		if(field.indexOf("(") > 0) {
			field = field.substring(0, field.indexOf("("));
		}
		// 根据过滤字段查询后面是文本框还是下拉框，并获取其结果
		var data = queryEnumerateByField(field);
		if (data == "") {
			value = $('#cable_filterFieldInputValue').val();
			valueID = "#cable_filterFieldInputValue";
		} else {
			value = $('#cable_filterFieldSelectValue').val();
			valueID = "#cable_filterFieldSelectValue";
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
//	if(sd_opticalcablesectionData.features.length==0){
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
			featureTypes : [ sd_opticalcablesectionData.layer_name ],
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
				$('#sd_opticalcablesectionTable').bootstrapTable('removeAll');
			} else {
				 $('#sd_opticalcablesectionTable').bootstrapTable('load', features);
				// 显示数据
				 displayCableData(features, sd_opticalcablesectionData.layer_name);
				$(".table-content").mLoading("hide");
			}
		});
}