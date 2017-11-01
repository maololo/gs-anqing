var sd_stationData={};
var sd_station = '';
function init(){
	sd_stationData.layer = excessiveObject.layer;
	sd_stationData.layer_name = excessiveObject.layerName;
	sd_stationData.DrawType = excessiveObject.DrawType;
	sd_stationData.field = 'Latlong';
	sd_stationData.features = layerAttributeTableData;
	excessiveObject = {};
	$("#sd_station_filterField").empty();
	$.ajax({
		// 请求地址
		url : "/" + sd_stationData.layer_name + "/querySpatialTableField.action",
		data : {},// 设置请求参数
		type : "post",// 请求方法
		async : false,
		dataType : "json",// 设置服务器响应类型
		// success：请求成功之后执行的回调函数 data：服务器响应的数据
		success : function(data) {
			$("#sd_station_filterField").append("<option value=''>请选择字段</option>");
			for ( var i in data) {
				if (data[i].FIELD != null && data[i].VALUE != "ID"
					&& data[i].VALUE != "OBJECTID") {
					$("#sd_station_filterField").append(
							"<option value='" + data[i].VALUE + "'>"+ data[i].FIELD + "</option>");
				}
			}
		}
	});
	
	
	// bootstrap table操作按钮 （查询结果表）
	window.operateEventsStation = {
		'click .stationDeldteFeature' : function(e, value, row, index) {
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
					 editWFSFeature([row],'delete',sd_stationData.layer_name);
					 //删除地图上的Feature
					 sd_stationData.source.getSource().removeFeature(row);
					 //删除bootstrapTable表格里的Feature
					 $('#sd_stationTable').bootstrapTable('remove', {field: 'ID', values: row.values_.ID});
					swal("删除成功", '', "success");
				}
			});
		},
		'click .stationEditFeature' : function(e, value, row, index) {
			// 将jspanel弹窗缩成一行
			document.querySelector('#sd_station1').jspanel.smallify();
			closeAttributeInfoObj();
			// 保存数据
			
			editObject = {};
			editObject.layer_name = sd_stationData.layer_name;
			editObject.feature = row;
			editObject.source = sd_stationData.layer.getSource();
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
			jsPanelAttributeInfo(sd_stationData.layer_name);
			
			// 获取要素的几何范围
			var latlon = row.getGeometry().flatCoordinates;
			map.getView().setCenter(latlon);
		    map.render();
		},
		'click .stationPositionFeature' : function(e, value, row, index) {
			// 将jspanel弹窗缩成一行
			document.querySelector('#sd_station1').jspanel.smallify();
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
		},'click .stationEquipment' : function(e, value, row, index) {
			//查询设备信息
			filterFieldID = row.values_.ID;
			resPopover('/EQUIPMENT/EQUIPMENT.action','设备信息');
		} 

	};
	
	// 展示数据
	displayStationData(sd_stationData.features, sd_stationData.layer_name );
}

//更改图层下拉框后查询属性
function stationFilterField(fieldValue) {
	if (fieldValue != "请选择字段") {
		if (fieldValue.indexOf("(") > 0) {
			fieldValue = fieldValue.substring(0, fieldValue.indexOf("("));
		}
		var data = queryEnumerateByField(fieldValue);
		if (data != "" && data != null) {
			$('#sd_station_filterFieldInput').hide();
			$('#sd_station_filterFieldSelect').show();
			$("#sd_station_filterFieldSelectValue").empty();
			$("#sd_station_filterFieldSelectValue").append(
					"<option value=''>所有值</option>");
			for (var i = 0; i < data.length; i++) {
				$('#sd_station_filterFieldSelectValue').append(
						"<option value=" + data[i].C_VALUE + ">"
								+ data[i].C_NAME + "</option>");
			}

		} else {
			$('#sd_station_filterFieldSelect').hide();
			$('#sd_station_filterFieldInput').show();
		}
	}else{
		$('#sd_station_filterFieldInput').hide();
		$('#sd_station_filterFieldSelect').hide();
	}

}
//根据经纬度添加要素
function addStationFeature(){
	editObject={};
	editObject.layer = sd_stationData.layer;
	editObject.layer_name = sd_stationData.layer_name;
	editObject.DrawType = sd_stationData.DrawType;
	editObject.field = sd_stationData.field;
	
	closeAttributeInfoObj();
//	jsPanelStationAttributeInfo('新增局站');
	jsPanelAttributeInfo(sd_stationData.layer_name);
}

//弹出属性字段信息框
function jsPanelStationAttributeInfo(title) {
	var	name =sd_stationData.layer_name.toLowerCase();
	var	url = "/" + name + "/" + name + "attr.action";
//	var	title = getLayerNodeByName(sd_stationData.layer_name).text + "数据属性";
	sd_station = $.jsPanel({
				id : "sd_stationAttr",
				headerControls: {
			    	maximize: 'remove',
			        smallify: 'remove'
			    },
			    resizeit: {
			        disable: true //禁止窗口大小调整
			    },
				position : {
					right : 20,
					top : 100
				},
				dragit: {containment: [100, 0, 0,160]},
				theme : "rebeccapurple",
				contentSize : 'auto auto',
				headerTitle : title,
				contentAjax : {
					url : url,
					autoload : true,
					done : function(data, textStatus, jqXHR, panel) {
						if(sd_stationData.field == 'Latlong'){
							$('#'+name+'_coordinate').show();
						}else{
							$('#'+name+'_coordinate').hide();
							if (editObject.editType == "add") {
//								if(editObject.layer_name == 'SD_STATION'){
//									$('#TYPE').selectpicker('val', editObject.stationType);
////									$('#TYPE').prop('disabled', true);
//								}
								var select = new ol.interaction.Select();
								var modify = new ol.interaction.Modify({
									features : select.getFeatures()
								});
								map.addInteraction(select);
								select.on('select', function(e) {
									if (e.selected[0].id_ != undefined) {
										modify.setActive(false);
									} else {
										modify.setActive(true);
									}
								});
								map.addInteraction(modify);
							} else if (editObject.editType == "update") {
								//回写数据
								var feature = editObject.feature.values_;
								for ( var id in feature) {
									if (id != "SHAPE" && id != "ID" && id !="geometry" ) {
										if(document.getElementById(id).type== "select-one"){
											$('#' + id) .selectpicker('val', feature[id]);
										}else if(id=='ENDID' || id == 'STARTID'){
											var value = formatfeatureName(feature[id]);
											$('#' + id).val(value);
										}else {
											$('#' + id).val(feature[id]);
										}
									} 
								}
							}
						}
					}
				},
				callback : function(panel) {
				}
			});
}
//将数据在table中显示
function displayStationData(features, layerType) {
	// 销毁查询结果 bootstrapTable
	$('#sd_stationTable').bootstrapTable('destroy');
	$('#sd_stationTable').bootstrapTable({
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
				value = row.values_.ID;
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
			field : 'DISTRICT',
			title : '行政区划',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.DISTRICT;
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
			field : 'TYPE',
			title : '类型',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.TYPE;
			}
		}, {
			field : 'VOLTAGE',
			title : '电压等级',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.VOLTAGE;
			}
		}, {
			field : 'OPERATIONDATE',
			title : '投运日期',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return operationdateFormatter(row.values_.OPERATIONDATE);
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
			width : '180px',
			events : operateEventsStation,// 给按钮注册事件
			formatter : operateFormattertation
		// 表格中增加按钮
		} ]
	});
}

//bootstrap table操作按钮 （查询结果表）
function operateFormattertation(val, row, index) {
	return ['<button class="stationEquipment btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="设备信息"><span  class="detail_icon" style="display:block;"><span></button>',
			'<button class="stationEditFeature btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="修改"><span  class=" glyphicon glyphicon-edit " ><span></button>',
			'<button class="stationDeldteFeature  btn btn-sm rolebtn" style=" background: none;outline:none;color:red" title="删除"><span  class=" glyphicon glyphicon-trash " ><span></button>',
			'<button class="stationPositionFeature  btn btn-sm rolebtn" style="background: none;outline:none;color: #bf824c" title="定位"><span  class=" glyphicon glyphicon-record  " ><span></button>'
			].join('');

}
//属性表中的查询按钮
function queryStationFeature() {
	var filter_field = $('#sd_station_filterField').val();
	var filterField = 'ID',filterValue = '*';
	if(filter_field!=""){
		// 获取过滤字段结果
		var field = $('#sd_station_filterField option:selected').text();
		var value = "",valueID="";
		if(field.indexOf("(") > 0) {
			field = field.substring(0, field.indexOf("("));
		}
		// 根据过滤字段查询后面是文本框还是下拉框，并获取其结果
		var data = queryEnumerateByField(field);
		if (data == "") {
			value = $('#sd_station_filterFieldInputValue').val();
			valueID = "#sd_station_filterFieldInputValue";
		} else {
			value = $('#sd_station_filterFieldSelectValue').val();
			valueID = "#sd_station_filterFieldSelectValue";
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
	if(sd_stationData.features.length==0){
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
			featureTypes : [ sd_stationData.layer_name ],
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
				$('#sd_stationTable').bootstrapTable('removeAll');
			} else {
				 $('#sd_stationTable').bootstrapTable('load', features);
				// 显示数据
				 displayStationData(features, sd_stationData.layer_name);
				$(".table-content").mLoading("hide");
			}
		});
}

//取消保存
function unSaveFeature() {
//	clearOnMapEvent();// 清除主动添加到地图上的事件
	if (editObject.editType == "add") {
		var source = editObject.source;
		source.removeFeature(editObject.feature);
	}
	if (editObject != "") {
		editObject = {};
	}
	editObject={};
	closeAttributeInfoObj();
}
// 关闭局站属性弹出框
function closeStationObj() {
	if (sd_station != "") {
		sd_station.close();
		sd_station = "";
	}
}
// 保存feature
function saveStationFeature() {
	$("#attributeInfo").mLoading("show");
	clearOnMapEvent();// 清除主动添加到地图上的事件
	//局站名字不能为空
	if($('#NAME').val().trim()==''){
		$('#NAME').focus();
		swal('局站名字不能为空！', '', "warning");
		return;
	}
	if (editObject.field=='Latlong') {
		var layerName = editObject.layer_name;
		var type = editObject.DrawType;
		var source = editObject.source;
		var fea = '';
		
		if(type == 'Point'){
			var longitude = $('#longitude').val();
			var latitude = $('#latitude').val();
			if(!validLonDu(longitude)){
				$('#longitude').focus();
				swal('经度填写不符合规范！', '经度范围0~180', "warning");
			}
			if(!validLonDu(latitude)){
				$('#latitude').focus();
				swal('纬度填写不符合规范！', '经度范围0~90', "warning");
			}
			
		    fea =new ol.Feature( new ol.geom.Point([parseFloat(longitude),parseFloat(latitude)]));
		}else{
			var data = $('#'+layerName.toLowerCase()+'_table').bootstrapTable('getData');
			// 先保存数据
			var latlongs=[];
			if(data.length<2){
				swal('经纬度数据至少要有两组！', '', "warning");
				return;
			}
			for(var i in data){
			    var map = {};
			    var longKey = 'long'+data[i].ID;
				var latKey = 'lat'+data[i].ID;
				var longitude = $('.'+longKey).val();
				if(!validLonDu(longitude)){
					$('.'+latKey).focus();
					swal('经度填写不符合规范！', '经度范围0~180', "warning");
				}
				var latitude = $('.'+latKey).val();
				if(!validLatDu(latitude)){
					$('.'+latKey).focus();
					swal('纬度填写不符合规范！', '经度范围0~90', "warning");
				}
				latlongs.push([parseFloat(longitude),parseFloat(latitude)]);
			}
			fea =new ol.Feature( new ol.geom.LineString(latlongs));
		}
		// 获取属性字段的json
		var attributeJson = getFormJson(layerName.toLowerCase() + "_form");
		if(layerName == "SD_OPTICALCABLESECTION"){
			var startid = true,endid=true;
			//根据选择的模糊数据转换成空间数据ID
			for(var i=0;i<blurData.length;i++){
				if(blurData[i].Name == attributeJson.STARTID){
					attributeJson.STARTID = blurData[i].ID;
					startid = false;
				}else if(blurData[i].Name == attributeJson.ENDID){
					attributeJson.ENDID = blurData[i].ID;
					endid = false;
				}
			}
			if(startid){attributeJson.STARTID=""}
			if(endid){attributeJson.ENDID=""}
			blurData=[];
		}
		// 设置feature对应的属性
		for ( var field in attributeJson) {
			// 如果输入内容为空，将其改为null
			if (attributeJson[field] == "") {
				fea.set(field, null);
			} else {
				fea.set(field, attributeJson[field]);
			}
		}
		
		// 设置featureID
		setFeatureID(fea, layerName);
		source.addFeature(fea.clone());
		
		var feature = fea.clone();// 此处clone
		// 为为了实现绘制结束后，添加的对象还在，否提交完成后数据就不显示了，必须刷新
        var geo = feature.getGeometry();
         // 调换经纬度坐标，以符合wfs协议中经纬度的位置，epsg:4326 下，取值是neu,会把xy互换，此处需要处理，根据实际坐标系处理
         geo.applyTransform(function(flatCoordinates, flatCoordinates2, stride) {
            for (var j = 0; j < flatCoordinates.length; j += stride) {
               var y = flatCoordinates[j];
               var x = flatCoordinates[j + 1];
               flatCoordinates[j] = x;
               flatCoordinates[j + 1] = y;
             }
         });
        feature.set('SHAPE', geo);
        editWFSFeature([feature], 'add', layerName);

        $('#wfsFeatureTable').bootstrapTable('prepend', [feature]);
        swal("保存成功", '', "success");
	}else{
		var featureType = editObject.layer_name;
		var editType = editObject.editType;
		var fea = editObject.feature;

		// 获取属性字段的json
		var attributeJson = getFormJson(featureType.toLowerCase() + "_form");
		if(featureType == "SD_OPTICALCABLESECTION"){
			var startid = true,endid=true;
			//根据选择的模糊数据转换成空间数据ID
			for(var i=0;i<blurData.length;i++){
				if(blurData[i].Name == attributeJson.STARTID){
					attributeJson.STARTID = blurData[i].ID;
					startid = false;
				}else if(blurData[i].Name == attributeJson.ENDID){
					attributeJson.ENDID = blurData[i].ID;
					endid = false;
				}
			}
			if(startid){attributeJson.STARTID=""}
			if(endid){attributeJson.ENDID=""}
			blurData=[];
		}
		// 设置feature对应的属性
		for ( var field in attributeJson) {
			// 如果输入内容为空，将其改为null
			if (attributeJson[field] == "") {
				fea.set(field, null);
			} else {
				fea.set(field, attributeJson[field]);
			}
		}

		if (editType == "add") {
			// 设置featureID
			setFeatureID(fea, featureType);
		} 
		var feature = fea.clone();// 此处clone
									// 为为了实现绘制结束后，添加的对象还在，否提交完成后数据就不显示了，必须刷新
		var geo = feature.getGeometry();
		// 调换经纬度坐标，以符合wfs协议中经纬度的位置，epsg:4326 下，取值是neu,会把xy互换，此处需要处理，根据实际坐标系处理
		geo.applyTransform(function(flatCoordinates, flatCoordinates2, stride) {
			for (var j = 0; j < flatCoordinates.length; j += stride) {
				var y = flatCoordinates[j];
				var x = flatCoordinates[j + 1];
				flatCoordinates[j] = x;
				flatCoordinates[j + 1] = y;
			}
		});

		if (editType == "update") {
			feature.setId(editObject.feature.getId()); // 注意ID是必须，通过ID才能找到对应修改的feature

			// 此处需要将原有的geometry空间字段删除，否则提交不成功，如果服务空间表空间就是geometry，则不需要处理
			feature.unset(feature.getGeometryName());
			// 设置空间字段名，以wfs服务为准
			// feature.setGeometryName('SHAPE');
			// feature.setGeometry(geo);
		}
		
		feature.set('SHAPE', geo);
		editWFSFeature([feature], editType, featureType);
		if(editType == "update" ){
			$('#wfsFeatureTable').bootstrapTable('updateRow', {index: editObject.index, row: feature.values_});
			swal("修改成功", '', "success");
		}else if(editType == "add"){
			$('#wfsFeatureTable').bootstrapTable('prepend', [feature]);
			swal("保存成功", '', "success");
		}

	}
	editObject = {};
	// 关闭属性弹窗
	closeAttributeInfoObj();
	$("#attributeInfo").mLoading("hide");

}