var map = ""; // openLayers地图
var boxExtent = ""; // 矩形、多边形查询的范围
var drawGeometry = ""; // 鼠标画几何图形对象
var highlightObj = []; // 查询后的高亮对象
var propertyListWindow = ""; // 查询结果弹出框对象
var excessiveObject = {}; // 过度对象
var editObject = {}; // 编辑对象
var attributeInfoObj = ""; // 属性信息弹窗对象
var layerAttributeTableData = ''; // 保存图层属性表数据
var geomObj = ""; // 测量时生成对象的图层
var measureTooltipElement = ""; // 度量工具提示元素.
var measureTooltip = []; // 测量提示对象
var blurData = ""; // 存储模糊字段信息
var filterFieldID = ""; // 过滤字段ID
var index=""; //导航
var bookMarksObj = {}; //书签对象

$(function() {
	var mapWidth = document.documentElement.clientWidth;
	var mapHeight = document.documentElement.clientHeight;
	document.getElementById("openlayersID").style.width= mapWidth-160 +"px";
	document.getElementById("openlayersID").style.height= mapHeight-100 +"px";
	document.getElementById("right-sidebar").style.width= mapWidth-160 +"px";
	document.getElementById("right-sidebar").style.height= mapHeight-100 +"px";
	initLayerTree();// 初始图层列表
	$('.inactive').click(
			function() {
				if ($(this).siblings('ul').css('display') == 'none') {
					$(this).parent('li').siblings('li')
							.removeClass('inactives');
					$(this).addClass('inactives');
					$(this).siblings('ul').slideDown(100).children('li');
					if ($(this).parents('li').siblings('li').children('ul')
							.css('display') == 'block') {
						$(this).parents('li').siblings('li').children('ul')
								.parent('li').children('a').removeClass(
										'inactives');
					}
				} else {
					// 控制自身变成+号
					$(this).removeClass('inactives');
					// 控制自身菜单下子菜单隐藏
					$(this).siblings('ul').slideUp(100);
					// 控制自身子菜单变成+号
					$(this).siblings('ul').children('li').children('ul')
							.parent('li').children('a').addClass('inactives');
					// 控制自身菜单下子菜单隐藏
					$(this).siblings('ul').children('li').children('ul')
							.slideUp(100);
					// 控制同级菜单只保持一个是展开的（-号显示）
					$(this).siblings('ul').children('li').children('a')
							.removeClass('inactives');
				}
			});
	/* 左侧导航栏折叠 */
	$(".hamburger").click(function() {
		$(".left_nav").css("display", "none");
		$(".nav1").css("display", "inline-block");
		$(this).css("display", "none");
		$(".hamburgerimg").css("display", "inline-block");
		$(".content-top").css("margin-left", "-90px");
		$("#right-sidebar").css("margin-left", "-90px");
		document.getElementById("openlayersID").style.width= mapWidth-70 +"px";
		document.getElementById("right-sidebar").style.width= mapWidth-70 +"px";
	});

	$(".hamburgerimg").click(function() {
		$(".left_nav").css("display", "block");
		$(this).css("display", "none");
		$(".nav1").css("display", "none");
		$(".hamburger").css("display", "inline-block");
		$(".content-top").css("margin-left", "0px");
		$("#right-sidebar").css("margin-left", "0px");
		document.getElementById("openlayersID").style.width= mapWidth-160 +"px";
		document.getElementById("right-sidebar").style.width= mapWidth-160 +"px";
	});
	/* 左侧导航栏折叠菜单悬浮二级菜单效果效果 */
	$(".nav1>ul>li").hover(
			function() {
				index = $(".nav1>ul>li").index(this);
				$(this).css("background", "#01675e");
				$(".nav1>ul>li .foldsecond").eq(index).css("display", "block");
				$(".nav1>ul>li .foldsecond>li .foldthird").eq(index).css(
						"display", "none");
			}, function() {
				$(".nav1>ul>li .foldsecond").eq(index).css("display", "none");
				$(this).css("background", "#005a52");
			});
	/* 左侧导航栏折叠菜单悬浮三级菜单效果效果 */
	$(".nav1>ul>li .foldsecond>li").hover(
			function() {
				index = $(".nav1>ul>li .foldsecond>li").index(this);
				$(".nav1>ul>li .foldsecond>li .foldthird").eq(index).css(
						"display", "block");
			},
			function() {
				$(".nav1>ul>li .foldsecond>li .foldthird").eq(index).css(
						"display", "none");
			});

	$("#tb tr").hover(function() {
		index = $("#tb tr").index(this) - 1;
		$("#tb tr button").eq(index).show();
	}, function() {
		$("#tb tr button").eq(index).hide();
	});

	$('.modal').on('show.bs.modal', function() {
		$(".modal-backdrop").remove();

	});
	 $('.modal').on('shown.bs.modal', function () {
		index=$(".modal").index(this);
		$(this).css('z-index',"1052");
		$(".modal").not($(".modal:eq("+index+")")).css('z-index',"1050");
	});
	 $('.modal').on('click', function () {
         index=$(".modal").index(this);
         $(this).css('z-index',"1052");
         $(".modal").not($(".modal:eq("+index+")")).css('z-index',"1050");
     });	      

	
	 /*定位点击切换效果*/
    $("#accuratePositioning").click(function () {
		var flag = duChgDFM();
		if(flag){
			$(".switch").css("display","block");
			$(".switchDu").css("display","none");
		}
	});
	
	$("#secondPositioning").click(function () {
		var flag = dFMChgDu();
		if(flag){
			$(".switch").css("display","none");
		    $(".switchDu").css("display","block");
		}
	});
	
	/** 拖拽模态框 */
	/** 拖拽模态框 */
	var dragModal = {
		mouseStartPoint : {
			"left" : 0,
			"top" : 0
		},
		mouseEndPoint : {
			"left" : 0,
			"top" : 0
		},
		mouseDragDown : false,
		basePoint : {
			"left" : 0,
			"top" : 0
		},
		moveTarget : null,
		topleng : 0
	}
	
	$(document).on("mousedown", ".modal-header", function(e) {
		if ($(e.target).hasClass("close"))// 点关闭按钮不能移动对话框
			return;
		dragModal.mouseDragDown = true;
		dragModal.moveTarget = $(this).parent().parent().parent();
		dragModal.mouseStartPoint = {
			"left" : e.clientX,
			"top" : e.pageY
		};
		dragModal.basePoint = dragModal.moveTarget.offset();
		dragModal.topLeng = e.pageY - e.clientY;
	});
	
	$(document).on("mouseup", function(e) {
		dragModal.mouseDragDown = false;
		dragModal.moveTarget = undefined;
		dragModal.mouseStartPoint = {
			"left" : 0,
			"top" : 0
		};
		dragModal.basePoint = {
			"left" : 0,
			"top" : 0
		};
	});
	
	$(document).on("mousemove", function(e) {
		if (!dragModal.mouseDragDown || dragModal.moveTarget == undefined) return;
		var mousX = e.clientX;
		var mousY = e.pageY;
		if (mousX < 0)
			mousX = 0;
		if (mousY < 0)
			mousY = 25;
		dragModal.mouseEndPoint = {
			"left" : mousX,
			"top" : mousY
		};
		var width = dragModal.moveTarget.width();
		var height = dragModal.moveTarget.height();
		var clientWidth = document.body.clientWidth
		var clientHeight = document.body.clientHeight;
		if (dragModal.mouseEndPoint.left < dragModal.mouseStartPoint.left
				- dragModal.basePoint.left) {
			dragModal.mouseEndPoint.left = 160;
		} else if (dragModal.mouseEndPoint.left >= clientWidth
				- width + dragModal.mouseStartPoint.left
				- dragModal.basePoint.left) {
			dragModal.mouseEndPoint.left = clientWidth - width;
		} else {
			dragModal.mouseEndPoint.left = dragModal.mouseEndPoint.left
					- (dragModal.mouseStartPoint.left - dragModal.basePoint.left);// 移动修正，更平滑
		}
		if (dragModal.mouseEndPoint.top
				- (dragModal.mouseStartPoint.top - dragModal.basePoint.top) < dragModal.topLeng) {
			dragModal.mouseEndPoint.top = dragModal.topLeng + 110;
		} else if (dragModal.mouseEndPoint.top
				- dragModal.topLeng > clientHeight - height
				+ dragModal.mouseStartPoint.top
				- dragModal.basePoint.top) {
			dragModal.mouseEndPoint.top = clientHeight - height
					+ dragModal.topLeng;
		} else {
			dragModal.mouseEndPoint.top = dragModal.mouseEndPoint.top
					- (dragModal.mouseStartPoint.top - dragModal.basePoint.top);
		}
		dragModal.moveTarget.offset(dragModal.mouseEndPoint);
	});
	
	//关闭jspane窗口事件
	$(document).on('jspanelclosed', function (event, id) {
		clearHighlightObj();
		clearOnMapEvent();
		if(id=='attributeInfo'){
			//清除之前添加而没有保存的数据
			if (editObject.editType == "add") {
				var source = editObject.source;
				source.removeFeature(editObject.feature);
				editObject={};
			}else{
				editObject={};
			}
		}
	}); 
});

// 初始化图层列表
function initLayerTree() {
	$('#powerLayerTree').jstree({
						"plugins" : [ "checkbox", "contextmenu", "wholerow" ],
						"checkbox" : {
							"whole_node" : false,
							"keep_selected_style" : false,
							"tie_selection" : false
						},
						"contextmenu" : {
							"show_at_node" : false,
							"items" : {
								"属性表" : {
									"label" : "属性表",
									"action" : function(data) {
										clearOnMapEvent(); // 清除主动添加到地图上的事件
										var inst = jQuery.jstree.reference(data.reference);
										var obj = inst.get_node(data.reference);
										if (obj.children.length == 0 && obj.parent != "#") {
											var features = obj.original.layer.getSource().getFeatures();
												excessiveObject.layer = obj.original.layer;
												layerAttributeTableData = features;
												var layerName = obj.original.name;
												excessiveObject.layerName = layerName;
												excessiveObject.DrawType = getDrawType(layerName);
												resPopover("/"+layerName+"/"+layerName+".action",obj.text+"表信息");
										} else {
											swal('根节点不能定位!', '', "warning");
										}
									}
								},
							}
						},
						"core" : {
							/*
							 * 'force_text' : true, "themes" : { "stripes" :
							 * true }, "animation" : 0,
							 */
							"check_callback" : true,
							'data' : getLayerTreeData()
						}
					});
	// 图层勾选事件
	$('#powerLayerTree').on(
			"check_node.jstree",
			function(event, data) {
				var childrens = $('#powerLayerTree').jstree("get_children_dom",
						data.node);
				if (childrens.length > 0) {
					for (var i = 0; i < childrens.length; i++) {
						var id = childrens[i].id;
						var nodeLayer = $('#powerLayerTree').jstree().get_node("#" + id);
						nodeLayer.original.layer.setVisible(true);
					}
				} else {
					data.node.original.layer.setVisible(true);
				}
			});
	// 图层取消勾选事件
	$('#powerLayerTree').on(
			"uncheck_node.jstree",
			function(event, data) {
				// 判断是否为父节点
				var is_parent = $('#powerLayerTree').jstree("is_parent",
						data.node);
				if (is_parent) {
					var childrens = $('#powerLayerTree').jstree(
							"get_children_dom", data.node);
					for (var i = 0; i < childrens.length; i++) {
						var id = childrens[i].id;
						var nodeLayer = $('#powerLayerTree').jstree().get_node(
								"#" + id);
						nodeLayer.original.layer.setVisible(false);
					}
				} else {
					data.node.original.layer.setVisible(false);
				}
			});

	
}

// 获取图层列表数据
function getLayerTreeData() {
	var powerLayerTree = {
		id : -1,
		text : "图层管理",
		state : {
			"opened" : true
		}
	};
	var treeNodes = new Array();
	$.ajax({
				//请求地址                               
				url : "/T_POWERLAYERS/search.action",
				data : {
					"sort.C_ID" : 'DESC'
				},//设置请求参数 
				type : "post",//请求方法
				async : false,
				dataType : "json",//设置服务器响应类型
				//success：请求成功之后执行的回调函数   data：服务器响应的数据
				success : function(data) {
					var bounds = [ 117.044453027202, 30.5066687301743,117.110272065313, 30.5599371735666 ];
					var layers = [];
					var treeId = 0;
					for ( var i in data) {
						if(data[i].C_ISDEFAULTLAYER == '1' && data[i].C_ISSHOW == '1'){
							if(data[i].C_LAYERTYPE == '3'){
								var code = [];
								code.push(i);
								var extent = data[i].C_LAYER.split(',');
								var newExtent = [];
								extent.forEach(function(newData,index,arr){  
									newExtent.push(+newData);  
							    });  
								var resolutions = data[i].C_BBOX.split(',');
								var newResolutions = [];
								resolutions.forEach(function(newData,index,arr){  
									newResolutions.push(+newData);  
							    });
								var testLayer = new ol.layer.Tile({  
							        extent: newExtent,  
							        source:new ol.source.XYZ({  
							            projection: ol.proj.get(data[i].C_SERVICETYPE),  
							            maxZoom: 21,  
							            minZoom: 0,  
							            tileGrid: new ol.tilegrid.TileGrid({  
							                extent: ol.proj.get(data[i].C_SERVICETYPE).getExtent(),  
							                origin: [-180,-90],  
							                resolutions: newResolutions,  
							            }),  
							            tileUrlFunction: function(tileCoord){ 
							            	for(var j in code){
							            		var index = code[j];
							            		var z = tileCoord[0];  
							            		var x = tileCoord[1];  
							            		var y = tileCoord[2];  
							            		return data[index].C_LAYERURL+'/'+z+'/'+x+'/'+y+'.png'  
							            	}
							            }  
							        })  
							    });  
								layers.push(testLayer);
							}else { //只加载默认图层在地图上
								
								var wfsParams = {
										service : 'WFS',
										version : '1.1.0',
										request : 'GetFeature',
										typeName : data[i].C_LAYER, //图层名称，可以是单个或多个
										outputFormat : 'application/json'//'text/javascript',  //重点，不要改变
								};
								var vector_Source = new ol.source.Vector(
										{
											wrapX : false,
											format : new ol.format.GeoJSON(),
											url : data[i].C_LAYERURL + '?'
											+ $.param(wfsParams),
											strategy : ol.loadingstrategy.bbox,
											projection : 'EPSG:4326'
										});
								var scale = 1.8;
								var imgHeight = 18;
								var layerStyle = null;
								if (data[i].C_LAYERNAME == "接头盒")
									layerStyle = new ol.style.Style({
										image : new ol.style.Icon({
											src : '../../images/接头盒.svg',
											scale : scale
										})
									});
								else if (data[i].C_LAYERNAME == "通信杆塔")
									layerStyle = new ol.style.Style({
										image : new ol.style.Icon({
											src : '../../images/通信杆塔.svg',
											scale : scale
										})
									});
								else if (data[i].C_LAYERNAME == "人井")
									layerStyle = new ol.style.Style({
										image : new ol.style.Icon({
											src : '../../images/人井.svg',
											scale : scale
										})
									});
								else if (data[i].C_LAYERNAME == "余缆")
									layerStyle = new ol.style.Style({
										image : new ol.style.Icon({
											src : '../../images/余缆.svg',
											scale : scale
										})
									});
								var layer;
								if (layerStyle == null) {
									if (data[i].C_LAYERNAME == "局站")
										layer = new ol.layer.Vector(
												{
													source : vector_Source,
													style : function(feature) {
														if (feature.get('TYPE') == '机房大楼')
															return new ol.style.Style(
																	{
																		image : new ol.style.Icon(
																				{
																					src : '../../images/机房.svg',
																					scale : scale
																				}),
																				text : new ol.style.Text(
																						{
																							text : feature
																							.get('NAME'),
																							offsetY : Math
																							.sqrt(imgHeight
																									* scale) / 2 + 20,
																									font : '20px Calibri,sans-serif', // 字体与大小
																									fill : new ol.style.Fill(
																											{ // 文字填充色
																												color : '#0000ff'
																											})
																						})
																	});
														else if (feature
																.get('TYPE') == '光交箱')
															return new ol.style.Style(
																	{
																		image : new ol.style.Icon(
																				{
																					src : '../../images/光交箱.svg',
																					scale : scale
																				}),
																				text : new ol.style.Text(
																						{
																							text : feature
																							.get('NAME'),
																							offsetY : Math
																							.sqrt(imgHeight
																									* scale) / 2 + 20,
																									font : '20px Calibri,sans-serif', // 字体与大小
																									fill : new ol.style.Fill(
																											{ // 文字填充色
																												color : '#0000ff'
																											})
																						})
																	});
														else
															return new ol.style.Style(
																	{
																		image : new ol.style.Icon(
																				{
																					src : '../../images/变电站.svg',
																					scale : scale
																				}),
																				text : new ol.style.Text(
																						{
																							text : feature
																							.get('NAME'),
																							offsetY : Math
																							.sqrt(imgHeight
																									* scale) / 2 + 20,
																									font : '20px Calibri,sans-serif', // 字体与大小
																									fill : new ol.style.Fill(
																											{ // 文字填充色
																												color : '#0000ff'
																											})
																						})
																	});
													}
												});
									else if (data[i].C_LAYERNAME == "光缆段") {
										layer = new ol.layer.Vector(
												{
													source : vector_Source,
													style : function(feature) {
														return new ol.style.Style(
																{
																	fill : new ol.style.Fill(
																			{
																				color : 'rgba(0, 0, 0, 1)'
																			}),
																			stroke : new ol.style.Stroke(
																					{
																						color : 'rgba(0, 0, 0, 1)',
																						width : feature
																						.get('CORENUM') == null ? 1
																								: feature
																								.get('CORENUM') / 12
																					})
																});
														
													}
												});
										layer.setTextPathStyle(
												function(feature) {
													return [ new ol.style.Style(
															{
																text : new ol.style.TextPath(
																		{
																			text : feature
																			.get('TYPE')
																			+ '/'
																			+ feature
																			.get('CORENUM')
																			+ '芯/'
																			+ feature
																			.get('LENGTH')
																			+ '米',
																			font : "16px Calibri,sans-serif",
																			fill : new ol.style.Fill(
																					{
																						color : "#0000ff"
																					}),
																					stroke : new ol.style.Stroke(
																							{
																								color : "#0000ff",
																								width : 0
																							}),
																							textBaseline : 'bottom',
																							textAlign : 'center',
																							rotateWithView : true,
																							textOverflow : 'visible',
																							minWidth : 0
																		}),
																		geometry : null
															}) ]
												}, 0.00005);
										
									} else
										layer = new ol.layer.Vector({
											source : vector_Source
										});
								} else
									layer = new ol.layer.Vector({
										source : vector_Source,
										style : layerStyle
									});
								layers.push(layer);
								var name = data[i].C_LAYER.split(':');
								treeNodes[treeId] = {
										text : data[i].C_LAYERNAME,
										id : data[i].C_ID,
										layer : layer,
										bounds : data[i].C_BBOX,
										name : name[1],
										icon : "glyphicon glyphicon-file",
										state : {
											checked : true
										}
								}
								treeId++;
							}
						}
					}
					var projection = new ol.proj.Projection({
						  code: 'EPSG:4326',
				          units: 'degrees',
				          axisOrientation: 'neu',
				          global: true
					});

					//初始化地图
					map = new ol.Map({
						controls : ol.control.defaults({
							attribution : false,
							zoom : false
						}).extend([
							new ol.control.MousePosition({
					            coordinateFormat: ol.coordinate.createStringXY(6)
					        }), //鼠标位置
				            new ol.control.OverviewMap(),  //鸟瞰图控件
				            new ol.control.ScaleLine(),   //比例尺
			            ]),
						target : 'openlayersID',
						projection : 'EPSG:4326',
						layers : layers,
						view : new ol.View({
							projection : projection,
							// 限制地图缩放最大级别为22，最小级别为6
							minZoom : 6,
							maxZoom : 22
						})
					});
					//禁用双击地图放大功能
					map.getInteractions().getArray().forEach(
									function(interaction) {
										if (interaction instanceof ol.interaction.DoubleClickZoom) {
											map.removeInteraction(interaction);
										}
									});

					map.getView().fit(bounds, map.getSize());

				}
			});
	var newtree = [];
	for(var k=treeNodes.length-1;k>=0;k--){
		newtree.push(treeNodes[k]);
	}
	powerLayerTree.children = newtree;
	var arr = [ powerLayerTree ];
	return arr;
}

// 关闭所有
function closeFunction() {
	closePropertyListWindow();
	clearDrawGeometry();
	clearHighlightObj();
	clearMeasureObj();
	clearOnMapEvent();

}

// 清除高亮对象
function clearHighlightObj() {
	if (highlightObj.length != 0) {
		highlightObj.clear();
	}
}
// 清除画几何对象
function clearDrawGeometry() {
	if (drawGeometry != "") {
		map.removeInteraction(drawGeometry);
		drawGeometry = "";
	}
}

// 关闭属性列表弹出窗口
function closePropertyListWindow() {
	if (propertyListWindow != "") {
		propertyListWindow.close();
		propertyListWindow = "";
	}
}

// 测量
function measureOnMap(value) {
//	clearMeasureObj();
	clearDrawGeometry();
	$('#measuretext').html("");
	// 添加一个绘制的线使用的layer
	if(geomObj==""){
		geomObj = new ol.layer.Vector({
			source : new ol.source.Vector(),
			style : new ol.style.Style({
				stroke : new ol.style.Stroke({
//				color : '#ffcc33',
					color : 'red',
					size : 2
				})
			})
		});
		map.addLayer(geomObj);
	}
	var type = ""
	if (value == 'area') {
		$('#measureName').html('面积');
		type = "Polygon";
	} else if (value == 'length') {
		$('#measureName').html('长度');
		type = "LineString";
	}
	drawGeometry = new ol.interaction.Draw({
		source : geomObj.getSource(),
		type : type,
		style : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(255, 255, 255, 0.2)'
			}),
			stroke : new ol.style.Stroke({
				color : 'rgba(0, 0, 0, 0.5)',
				lineDash : [ 10, 10 ],
				width : 2
			}),
			image : new ol.style.Circle({
				radius : 5,
				stroke : new ol.style.Stroke({
					color : 'rgba(0, 0, 0, 0.7)'
				}),
				fill : new ol.style.Fill({
					color : 'rgba(255, 255, 255, 0.2)'
				})
			})
		})
	});
	map.addInteraction(drawGeometry);

	createMeasureTooltip();
	/**
	 * 创建显示结果的提示工具
	 */
	if (measureTooltipElement) {
		measureTooltipElement.parentNode.removeChild(measureTooltipElement);
	}
	measureTooltipElement = document.createElement('div');
	measureTooltipElement.className = 'tooltip tooltip-measure';
	var tooltip = new ol.Overlay({
		element : measureTooltipElement,
		offset : [ 0, -15 ],
		positioning : 'bottom-center'
	});
	map.addOverlay(tooltip);
	measureTooltip.push(tooltip);
	
	var results = ""; // 测量结果
	var listener = ""; //
	var sketch = ""; 
	drawGeometry.on('drawstart', function(evt) {
		// set sketch
		sketch = evt.feature;

		/** @type {ol.Coordinate|undefined} */
		var tooltipCoord = evt.coordinate;

		listener = sketch.getGeometry().on('change', function(evt) {
			var geom = evt.target;
			var output;
			if (geom instanceof ol.geom.Polygon) {
				output = formatArea(geom);
				tooltipCoord = geom.getInteriorPoint().getCoordinates();
			} else if (geom instanceof ol.geom.LineString) {
				output = formatLength(geom);
				tooltipCoord = geom.getLastCoordinate();

			}
			results = output;
			measureTooltipElement.innerHTML = output;
			tooltip.setPosition(tooltipCoord);
		});
	}, this);

	drawGeometry.on('drawend', function(event) {
		measureTooltipElement.className = 'tooltip tooltip-static';
		tooltip.setOffset([ 0, -7 ]);
		// unset sketch
		sketch = null;
		// unset tooltip so that a new one can be created
		measureTooltipElement = null;

		if (drawGeometry != "") {
			map.removeInteraction(drawGeometry);
			drawGeometry = "";
		}
		ol.Observable.unByKey(listener);
		$('#measuretext').html(results);
	}, this);
}


/**
 * 根据多线段获取长度.
 * 
 * @param {ol.geom.LineString}
 *            line The line.
 * @return {string} The formatted length.
 */
function formatLength(line) {
	var length;
	var geodesic = true; // true:计算平面距离；false:计算球面距离
	if (geodesic) {
		var coordinates = line.getCoordinates();
		length = 0;
//		var sourceProj = map.getView().getProjection();
		var wgs84Sphere = new ol.Sphere(6378137);
		for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
//			var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
//			var c2 = ol.proj.transform(coordinates[i + 1], sourceProj,
//					'EPSG:4326');
			length += wgs84Sphere.haversineDistance(coordinates[i], coordinates[i + 1]);
		}
	} else {
		length = Math.round(line.getLength() * 100) / 100;
	}
	var output;
	if (length > 10000) {
		output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
	} else {
		output = (Math.round(length * 100) / 100) + ' ' + 'm';
	}
	return output;
};

/**
 * 根据多边形获取面积.
 * 
 * @param {ol.geom.Polygon}
 *            polygon The polygon.
 * @return {string} Formatted area.
 */
function formatArea(polygon) {
	var area;
	var geodesic = true; // true:计算平面面积；false:计算球面面积
	if (geodesic) {
		var sourceProj = map.getView().getProjection();
		var geom =
		/** @type {ol.geom.Polygon} */
		(polygon.clone().transform(sourceProj, 'EPSG:4326'));
		var coordinates = geom.getLinearRing(0).getCoordinates();
		var wgs84Sphere = new ol.Sphere(6378137);
		area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
	} else {
		area = polygon.getArea();
	}
	var output;
	if (area > 100000) {
		output = (area / 1000000).toFixed(2) + ' ' + 'km<sup>2</sup>';
	} else {
		output = area.toFixed(2) + ' ' + 'm<sup>2</sup>';
	}
	return output;
};

// 清除测量结果
function clearMeasure() {
	clearMeasureObj();
	$('#measureName').html('测量');
	$('#measuretext').html('');
	if (drawGeometry != "") {
		map.removeInteraction(drawGeometry);
		drawGeometry = "";
	}
	if (measureTooltip.length != 0) {
		for(var i in measureTooltip){
			map.removeOverlay(measureTooltip[i]);
		}
		measureTooltip = [];
	}
}

// 删除测量对象
function clearMeasureObj() {
	if (geomObj != "") {
		map.removeLayer(geomObj);
		geomObj = "";
	}

	if (measureTooltip.length != 0) {
		for(var i in measureTooltip){
			map.removeOverlay(measureTooltip[i]);
		}
		measureTooltip = [];
	}

}
// 清除主动添加到地图的事件（画、选择、移动）
function clearOnMapEvent() {
	var events = map.getInteractions().getArray();
	for (var i = 0; i < events.length; i++) {
		var e = events[i];
		if (e instanceof ol.interaction.Draw
				|| e instanceof ol.interaction.Select
				|| e instanceof ol.interaction.Split
				|| e instanceof ol.interaction.Modify) {
			map.removeInteraction(e);
			--i;
		}
	}
}

// 放大地图
function zoomInMap() {
	clearOnMapEvent();
	var view = map.getView();
	// 让地图的zoom增加1，从而实现地图放大
	view.setZoom(view.getZoom() + 1);
}

// 缩小地图
function zoomOutMap() {
	clearOnMapEvent();
	var view = map.getView();
	// 让地图的zoom减小1，从而实现地图缩小
	view.setZoom(view.getZoom() - 1);
}

// 框选放大/缩小
function right_click_box(number) {
	clearOnMapEvent();
	drawGeometry = new ol.interaction.Draw({
		source : new ol.source.Vector(),
		type : /** @type {ol.geom.GeometryType} */
		('Circle'),
		geometryFunction : ol.interaction.Draw.createBox()

	});
	map.addInteraction(drawGeometry);

	drawGeometry.on('drawend', function(event) {
		clearDrawGeometry();
		// 获取框选范围
		var xy = event.target.sketchCoords_;
		// 获取范围中心点
		var coord = ol.extent.getCenter([ xy["0"]["0"], xy["0"][1], xy[1]["0"],
				xy[1][1] ]);
		var view = map.getView();
		view.setCenter(coord);
		// 让地图的zoom增加1，从而实现地图放大
		view.setZoom(view.getZoom() + number);
		// 重新渲染地图
		map.render();
	}, this);
}

/*** 框选查询 END ***/
function openDialg(title, field, dataFeatures, layerName, display) {
	closePropertyListWindow();
	propertyListWindow = $.jsPanel({
		id : "openDialg",
		maximizedMargin : { top : 100, left : 170 },
		dragit: {containment: [100, 0, 0,160]},
		position : 'center',
		theme : "rebeccapurple",
		contentSize : { width : 'auto', height : 'auto' },
		headerTitle : title,
		border : '2px solid rgb(7,102,104)',
		contentAjax : {
			url : "/attributeList/attributeList.action",
			autoload : true,
			done : function(data, textStatus, jqXHR, panel) {
				// 图层tree根节点
				var root = $('#powerLayerTree').jstree().get_node("#-1");
				var childrens = $('#powerLayerTree').jstree("get_children_dom", root);
				/*
				$('#assemblageQueryOptions1').hide();
				$('#queryAllOptions').hide();
				*/
				
				// 获取查询图层类型
				/*
				var obj = dataFeatures.values_;
    			var code = obj.ID.substring(0,4);
    			var layerType = queryLayerNameByPMSID(code);
				*/
				
				var html = $("#queryDiv");
				html.empty();
				
				if (field == 'radioQuery') {
					// 单选查询
					var t = $("<table id='dataTableRadio' class='query-table'>");
					t.appendTo(html);
					if(!$.isEmptyObject(dataFeatures)){
		    			var obj = dataFeatures.values_;
		    			var code = obj.ID.substring(0,4);
		    			var layerType = queryLayerNameByPMSID(code);
		    			loadTableData(dataFeatures, layerType, "Radio");
					}
				} else if (field == 'boxQuery' || field == 'polygonQuery') {
					// 多选查询
					var queryUl = $("<ul class='nav nav-tabs'>");
					queryUl.empty();
					var queryDiv = $("<div class='tab-content'>");
					queryDiv.empty();
					for (var i = 0; i < childrens.length; i++) {
						var node = $('#powerLayerTree').jstree().get_node(childrens[i].id);
						var nodeId = node.original.id;
						var nodeText = node.original.text;
						// tab头
						var queryLi = $("<li>");
						// tab内容
						var queryCtDiv = $("<div>");
						if(i == 0){
							queryLi.attr("class", "active");
							queryCtDiv.attr({"id": "tab" + nodeId, "class": "tab-pane active"});
						}else{
							queryCtDiv.attr({"id": "tab" + nodeId, "class": "tab-pane"});
						}
						// 页面tab头显示
						var queryA = $("<a>").attr({"href": "#tab" + nodeId, "data-toggle": "tab"}).append(nodeText);
						queryLi.append(queryA);
						queryLi.appendTo(queryUl);
						// 内容table筛选条
						var tableHead = $("<div style='margin-top: 12px;'>").attr({"id": "head" + nodeId, "class": "check"});
						tableHead.append("过滤字段：");
						var sel = $("<select id='selFilter" + nodeId + "' class='sel-filter' onchange='chgFilter(this.options[this.options.selectedIndex].text, " + nodeId + ")'>");
						sel.append("<option value=''>请选择字段</option>");
						if (!$.isEmptyObject(node)) {
							var vector_Source = node.original.layer.getSource();
							var feature = vector_Source.getFeatures()[0];
							// 获取查询图层类型
							if(!$.isEmptyObject(feature) && !isEmpty(feature.values_.ID)){
								var code = feature.values_.ID.substring(0,4);
								var layerTable = queryLayerNameByPMSID(code);
								$.ajax({
									url : "/" + layerTable + "/querySpatialTableField.action",
									data : {},
									type : "post",
									async : false,
									dataType : "json",
									success : function(data) {
										for ( var i in data) {
											if (data[i].FIELD != null && data[i].VALUE != "ID" && data[i].VALUE != "OBJECTID") {
												sel.append("<option value='" + data[i].VALUE + "'>"+ data[i].FIELD + "</option>");
											}
										}
									}
								});
							}
						}
						tableHead.append(sel);
						// 查询按钮
						var btn = $("<button type='button' class='query-btn' onclick='queryFeature(" + nodeId + ")'>");
						btn.append("查询");
						tableHead.append(btn);
						tableHead.appendTo(queryCtDiv);
						// 数据table
						var table = $("<table id='dataTable" + nodeId + "' class='query-table'>");
						table.appendTo(queryCtDiv);
						// 选中tab内容显示
						queryCtDiv.appendTo(queryDiv);
						
						html.append(queryUl);
						html.append(queryDiv);
						
						//loadTableData(features, layerType, nodeId);
					}
				} 
				
				$('#search').modal('hide');// 隐藏查询模态框
			}
		},
		callback : function(panel) {
			this.content.css("padding", "5px");
		}
	});
}

// 查找时 过滤字段改变事件
function chgFilter(selVal, tabId) {
	var oldSel = $("#selSelect" + tabId);
	if(oldSel.length > 0){
		oldSel.remove();
	}
	var oldInput = $("#selInput" + tabId);
	if(oldInput.length > 0){
		oldInput.remove();
	}
	if (!isEmpty(selVal) && selVal != "请选择字段") {
		if (selVal.indexOf("(") > 0) {
			selVal = selVal.substring(0, selVal.indexOf("("));
		}
		var data = queryEnumerateByField(selVal);
		var tableHead = $("#head" + tabId);
		if (!isEmpty(data)) {
			var newSel = $("<select id='selSelect" + tabId + "' class='sel-val'>");
			newSel.append("<option value=''>所有值</option>");
			for (var i = 0; i < data.length; i++) {
				newSel.append( "<option value=" + data[i].C_VALUE + ">" + data[i].C_NAME + "</option>");
			}
			tableHead.append(newSel);
		} else {
			var newInput = $("<input type='text' id='selInput" + tabId + "' class='sel-input'>");
			tableHead.append(newInput);
		}
	}
}

// 框选和多边形弹窗中的查询按钮
function queryFeature(tabId) {
	var value;
	var field = $('#selFilter'+ tabId);
	var selSelect = $('#selSelect'+ tabId);
	var selInput = $('#selInput'+ tabId);
	if(field.length > 0){
		value = selSelect.val();
	}else{
		value = selInput.val();
	}
	if(isEmpty(field.val())){
		swal('请给过滤字段相应的值！', '', "warning");
		return "";
	}
	
	$(".table-content").mLoading("show");
	
	var filterValue = isEmpty(value) ? "*" : "*" + value + "*";
	var filterField = field.val();
	
	var nodeLayer = $('#powerLayerTree').jstree().get_node("#" + tabId);
	var layer_name = nodeLayer.original.name;
	var featureRequest = new ol.format.WFS().writeGetFeature({
		srsName : 'EPSG:4326',
		featurePrefix : 'anqing',
		featureTypes : [ layer_name ],
		outputFormat : 'application/json',
		geometryName : "the_geom",
		filter : ol.format.filter.and(
		ol.format.filter.bbox('SHAPE', boxExtent, 'EPSG:4326'),
		ol.format.filter.like(filterField, filterValue))
	});

	// 然后发布请求并将接收到数据在表格中显示
	var featureUrl = "http://" + queryWFSURL(layer_name) + "/geoserver/wfs";
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
			$('#dataTable' + tabId).bootstrapTable('destroy');
		} else {
			// 获取查询图层类型
			var code = features[0].values_.ID.substring(0,4);
			var layerType = queryLayerNameByPMSID(code);
			loadTableData(features, layerType, tabId);
			$(".table-content").mLoading("hide");
		}
	});
}

// 将数据在table中显示
function loadTableData(features, layerType, tabId) {
	$('#dataTable' + tabId).bootstrapTable('destroy');
	var columns = getColumnsBylayerType(layerType);
	$('#dataTable' + tabId).bootstrapTable({
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
		columns : columns
	});
}

//单选查询
/*
function radioQuery() {
	closeFunction();
	// 定义select控制器
	var select = new ol.interaction.Select();
	map.addInteraction(select);// map加载该控件，默认是激活可用的
	select.on('select', function(e) {
		if (e.selected.length > 0) {
			openDialg("查询结果", "radioQuery", e.selected);
			map.removeInteraction(select);
		}
	});
}
*/
function radioQuery() {
	closeFunction();
	var select = new ol.interaction.Select();
	map.addInteraction(select);
	select.on('select', function(event) {
		if(!$.isEmptyObject(event)){
			var f = event.selected[0]; 
			/*
			f.setStyle(new ol.style.Style({
	            image: new ol.style.Circle({
	                radius: 10,
	                fill: new ol.style.Fill({
	                    color: 'blue'
	                })
	            })
	        }));
			*/
			openDialg("查询结果", "radioQuery", f);
			map.removeInteraction(select);
		}
	});
}


// 规则图形框选
function boxQuery() {
	closeFunction();
	drawGeometry = new ol.interaction.Draw({
		source : new ol.source.Vector(),
		type : /** @type {ol.geom.GeometryType} */
		('Circle'),
		geometryFunction : ol.interaction.Draw.createBox(),
		style : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(255, 255, 255, 0.2)'
			}),
			stroke : new ol.style.Stroke({
				color : 'rgba(0, 0, 0, 0.5)',
				lineDash : [ 10, 10 ],
				width : 2
			}),
			image : new ol.style.Circle({
				radius : 5,
				stroke : new ol.style.Stroke({
					color : 'rgba(0, 0, 0, 0.7)'
				}),
				fill : new ol.style.Fill({
					color : 'rgba(255, 255, 255, 0.2)'
				})
			})
		})
	});
	map.addInteraction(drawGeometry);
	var listener = "";
	var sketch = null;
	drawGeometry.on('drawstart', function(evt) {
		// set sketch
		sketch = evt.feature;
		var coord = evt.coordinate;
		listener = sketch.getGeometry().on('change', function(evt) {
			var geom = evt.target;
			if (geom instanceof ol.geom.Geometry) {
				var extent = geom.getExtent();
				boxExtent = extent;
			}
		});
	}, this);

	drawGeometry.on('drawend', function(event) {
		clearDrawGeometry();
		openDialg("查询结果", "boxQuery", event.feature);
		ol.Observable.unByKey(listener);
	}, this);

}

// 多边形查询
/*
function polygonQuery() {
	closeFunction();
	drawGeometry = new ol.interaction.Draw({
		source : new ol.source.Vector(),
		type : *//** @type {ol.geom.GeometryType} *//*
		('Polygon'),
		style : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(255, 255, 255, 0.2)'
			}),
			stroke : new ol.style.Stroke({
				color : 'rgba(0, 0, 0, 0.5)',
				lineDash : [ 10, 10 ],
				width : 2
			}),
			image : new ol.style.Circle({
				radius : 5,
				stroke : new ol.style.Stroke({
					color : 'rgba(0, 0, 0, 0.7)'
				}),
				fill : new ol.style.Fill({
					color : 'rgba(255, 255, 255, 0.2)'
				})
			})
		})
	});
	map.addInteraction(drawGeometry);
	var listener = "";
	var sketch = null;
	drawGeometry.on('drawstart', function(evt) {
		// set sketch
		sketch = evt.feature;
		*//** @type {ol.Coordinate|undefined} *//*
		var coord = evt.coordinate;
		listener = sketch.getGeometry().on('change', function(evt) {
			var geom = evt.target;
			if (geom instanceof ol.geom.Polygon) {
				var extent = geom.getExtent();
				boxExtent = extent;
			}
		});
	}, this);

	drawGeometry.on('drawend', function(event) {
		sketch = event.feature;
		clearDrawGeometry();
		openDialg( "查询结果", "polygonQuery", sketch);
		ol.Observable.unByKey(listener);
	}, this);
}
*/
function polygonQuery() {
	closeFunction();
	drawGeometry = new ol.interaction.Draw({
		source : new ol.source.Vector(),
		type : "Polygon",
		style : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(255, 255, 255, 0.2)'
			}),
			stroke : new ol.style.Stroke({
				color : 'rgba(0, 0, 0, 0.5)',
				lineDash : [ 10, 10 ],
				width : 2
			}),
			image : new ol.style.Circle({
				radius : 5,
				stroke : new ol.style.Stroke({
					color : 'rgba(0, 0, 0, 0.7)'
				}),
				fill : new ol.style.Fill({
					color : 'rgba(255, 255, 255, 0.2)'
				})
			})
		})
	});
	map.addInteraction(drawGeometry);
	
	// 监听线绘制结束事件
	drawGeometry.on('drawend', function(event) {
		clearDrawGeometry();
		openDialg( "查询结果", "polygonQuery", event.feature);
	}, this);
}

/*** 框选查询 END ***/

// 更改图层下拉框后查询属性
function changeLayer(id) {
	clearHighlightObj();
	if (id != "") {
		var node = $('#powerLayerTree').jstree().get_node(id);
		var vector_Source = node.original.layer.getSource();
//		$('#filterFieldOptions').show();
		var feature = vector_Source.getFeatures()[0];
		// 获取查询图层类型
		var code = feature.values_.ID.substring(0,4);
		var layerTable = queryLayerNameByPMSID(code);
		$("#filterField1").empty();
		$.ajax({
			// 请求地址
			url : "/" + layerTable + "/querySpatialTableField.action",
			data : {},// 设置请求参数
			type : "post",// 请求方法
			async : false,
			dataType : "json",// 设置服务器响应类型
			// success：请求成功之后执行的回调函数 data：服务器响应的数据
			success : function(data) {
				$("#filterField1").append("<option value=''>请选择字段</option>");
				for ( var i in data) {
					if (data[i].FIELD != null && data[i].VALUE != "ID"
							&& data[i].VALUE != "OBJECTID") {
						$("#filterField1").append(
								"<option value='" + data[i].VALUE + "'>"+ data[i].FIELD + "</option>");
					}
				}
			}
		});

	}
}
// 更改图层下拉框后查询属性
function changeFilterField(fieldValue,divId) {
	if (fieldValue != "请选择字段") {
		if (fieldValue.indexOf("(") > 0) {
			fieldValue = fieldValue.substring(0, fieldValue.indexOf("("));
		}
		var data = queryEnumerateByField(fieldValue);
		if (data != "" && data != null) {
			$('#filterFieldInput'+divId).hide();
			$('#filterFieldSelect'+divId).show();
			$("#filterFieldSelectValue"+divId).empty();
			$("#filterFieldSelectValue"+divId).append(
					"<option value=''>所有值</option>");
			for (var i = 0; i < data.length; i++) {
				$('#filterFieldSelectValue'+divId).append(
						"<option value=" + data[i].C_VALUE + ">"
								+ data[i].C_NAME + "</option>");
			}

		} else {
			$('#filterFieldSelect'+divId).hide();
			$('#filterFieldInput'+divId).show();
		}
	}else{
		$('#filterFieldInput'+divId).hide();
		$('#filterFieldSelect'+divId).hide();
	}

}

// 根据字段结果查询枚举表
function queryEnumerateByField(field) {
	var fieldData = "";
	$.ajax({
		url : "/T_ENUMERATE/search.action",
		data : {
			"search.C_TYPE*eq" : field,
			"sort.C_SORTID" : 'ASC'
		},// 设置请求参数
		type : "post",// 请求方法
		dataType : "Json",
		async : false,
		success : function(data) {
			fieldData = data;
		}
	})
	return fieldData;
}

/*
// 框选和多边形弹窗中的查询按钮
function queryFeature() {
	var id = $('#powLayes1').val();
	if (id == "") {
		$('#powLayes1').focus();
		swal('请先选择要查询的图层！', '', "warning");
	} else {
		// 获取过滤字段结果
		var field = $('#filterField1 option:selected').text();
		var value = "", valueId = "";
		if(field != "请选择字段"){
			if (field.indexOf("(") > 0) {
				field = field.substring(0, field.indexOf("("));
			}
			// 根据过滤字段查询后面是文本框还是下拉框，并获取其结果
			
			var data = queryEnumerateByField(field);
			if (data == "") {
				value = $('#filterFieldInputValue1').val();
				valueId = '#filterFieldInputValue1';
			} else {
				value = $('#filterFieldSelectValue1').val();
				valueId = '#filterFieldSelectValue1';
			}
		}
		if (field != "请选择字段" && value == "") {
			$(valueId).focus();
			swal('请给过滤字段相应的值！', '', "warning");
		} else {
			$(".table-content").mLoading("show");
			var filterValue = value == "" ? "*" : "*"+value+"*";
			var filterField = field == "请选择字段" ? "ID" : $('#filterField1').val();
			var nodeLayer = $('#powerLayerTree').jstree().get_node("#" + id);
			var layer_name = nodeLayer.original.name;
//			var featureNS = "http://" + queryWFSURL() + "/anqing";
			var featureRequest = new ol.format.WFS().writeGetFeature({
				srsName : 'EPSG:4326',
//				featureNS : featureNS,
				featurePrefix : 'anqing',
				featureTypes : [ layer_name ],
				outputFormat : 'application/json',
				geometryName : "the_geom",
				filter : ol.format.filter.and(
				ol.format.filter.bbox('SHAPE', boxExtent, 'EPSG:4326'),
				ol.format.filter.like(filterField,filterValue))
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
					$('#wfsFeatureTable').bootstrapTable('removeAll');
				} else {
					// 获取查询图层类型
					var code = features[0].values_.ID.substring(0,4);
					var layerType = queryLayerNameByPMSID(code);
					displayData(features, layerType);
					$(".table-content").mLoading("hide");
				}
			});
		}
	}
}
*/

// 属性表中的查询按钮
function queryClientFeature() {
	// 获取过滤字段结果
	var field = $('#filterField2 option:selected').text();
	var value = "",valueID="";
	if(field == "请选择字段"){
		$('#filterField2').focus();
		swal('请选择过滤字段！', '', "warning");
	}else{
		if(field.indexOf("(") > 0) {
			field = field.substring(0, field.indexOf("("));
		}
		// 根据过滤字段查询后面是文本框还是下拉框，并获取其结果
		var data = queryEnumerateByField(field);
		if (data == "") {
			value = $('#filterFieldInputValue2').val();
			valueID = "#filterFieldInputValue2";
		} else {
			value = $('#filterFieldSelectValue2').val();
			valueID = "#filterFieldSelectValue2";
			
		}
	}
	var filterField = $('#filterField2').val();
	
	if(field != "请选择字段" && value == ""){
		$(valueID).focus();
		swal('请给'+field+'相应的值！', '', "warning");
	}
	var filterValue = "*"+value+"*";
	
	//判断图层是否为空
	if(layerAttributeTableData.length==0){
		swal('此图层没有数据!', '', "warning");
		return;
	}
		// 获取查询图层类型
		var code = layerAttributeTableData[0].values_.ID.substring(0,4);
		var layerType = queryLayerNameByPMSID(code);
		var columns = getColumnsBylayerType(layerType);
		
		$(".table-content").mLoading("show");
		var wfsURL = queryWFSURL(layerType);
		var featureNS = "http://" + wfsURL + "/anqing";
		var featureRequest = new ol.format.WFS().writeGetFeature({
			srsName : 'EPSG:4326',
			// featureNS: 'http://172.16.15.147:8080/pipeline',
//			featureNS : featureNS,
			featurePrefix : 'anqing',
			featureTypes : [ layerType ],
			outputFormat : 'application/json',
			geometryName : "the_geom",
			filter : ol.format.filter.like(filterField,filterValue)
		});

		// 然后发布请求并将接收到数据在表格中显示
		var featureUrl = "http://" + wfsURL + "/geoserver/wfs";
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
				$('#wfsFeatureTable').bootstrapTable('removeAll');
			} else {
				 $('#wfsFeatureTable').bootstrapTable('load', features);
				// 获取查询图层类型
//				var code = features[0].values_.ID.substring(0,4);
//				var layerType = queryLayerNameByPMSID(code);
//				displayData(features, layerType);
				$(".table-content").mLoading("hide");
			}
		});
}
//更具图层名获取图层字段
function getColumnsBylayerType(layerType){
	var columns = [];
	switch (layerType) {
	case "SD_STATION": // 局站
		columns = [ {
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
			events : operateEventsFeature,// 给按钮注册事件
			formatter : operateFormatterFeature
		// 表格中增加按钮
		} ];
		break;
	case "SD_JUNCTIONBOX": // '接头盒'
		columns = [ {
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
			events : operateEventsFeature,// 给按钮注册事件
			formatter : operateFormatterFeature
		// 表格中增加按钮
		} ];
		break;
	case "SD_COMMUNICATIONPOLETOWER": // '通信杆塔':
		columns = [ {
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
			field : 'NAME',
			title : '杆塔名称',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.NAME;
			}
		}, {
			field : 'HEIGHT',
			title : '高度',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.HEIGHT;
			}
		}, {
			field : 'PMSID',
			title : 'PMS编码',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.PMSID;
			}
		}, {
			field : 'TOWERMATERIAL',
			title : '杆塔材质',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.TOWERMATERIAL;
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
			events : operateEventsFeature,// 给按钮注册事件
			formatter : operateFormatterFeature
		// 表格中增加按钮
		} ];
		break;
	case "SD_PERSONWELL": // '人井'
		columns = [ {
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
			field : 'AFFILIATEDID',
			title : '附属对象ID',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.AFFILIATEDID;
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
			events : operateEventsFeature,// 给按钮注册事件
			formatter : operateFormatterFeature
		// 表格中增加按钮
		} ];
		break;
	case "SD_RESIDUALCABLE": // '余缆'
		columns = [ {
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
			events : operateEventsFeature,// 给按钮注册事件
			formatter : operateFormatterFeature
		// 表格中增加按钮

		} ];
		break;
	case "SD_OPTICALCABLESECTION": // '光缆段'
		columns = [ {
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
			events : operateEventsFeature,// 给按钮注册事件
			formatter : operateFormatterFeature
		// 表格中增加按钮
		} ];
		break;
	case "SD_CABLEDUCT": // '电缆管道':
		columns = [ {
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
			events : operateEventsFeature,// 给按钮注册事件
			formatter : operateFormatterFeature
		// 表格中增加按钮
		} ];
		break;
	case "SD_CABLETRENCH": // '电缆沟':
		columns = [ {
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
			events : operateEventsFeature,// 给按钮注册事件
			formatter : operateFormatterFeature
		// 表格中增加按钮
		} ];
		break;
	case "SD_CABLETUNNEL": // '电缆隧道':
		columns = [ {
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
			events : operateEventsFeature,// 给按钮注册事件
			formatter : operateFormatterFeature
		// 表格中增加按钮
		} ];
		break;
	default:
		break;
	}
	return  columns;
}
// 将数据在table中显示
function displayData(features, layerType) {
	// 销毁查询结果 bootstrapTable
	$('#wfsFeatureTable').bootstrapTable('destroy');
	var columns = getColumnsBylayerType(layerType);
	$('#wfsFeatureTable').bootstrapTable({
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
		columns : columns
	});
}

//根据feature ID格式化 feature名称
function formatfeatureName(id){
	var name = null;
	if(id == null ||id==""){
		return name;
	}
	// 获取查询图层类型
	var code = id.substring(0,4);
	var layer_type = queryLayerNameByPMSID(code);
	if(layer_type=='EQUIPMENT'){
		var data = queryTableByData('/T_EQUIPMENT/search.action',{"search.C_CODE*eq" : id});
		name = data[0].C_NAME;
	}else{
		// 获取当前图层
		var layer = getLayerNodeByName(layer_type).layer;
		var features = layer.getSource().getFeatures();
		for(var i in features){
			if(features[i].values_.ID == id){
				name = features[i].values_.NAME;
				break;
			}
		}
	}
	 return name;
}

// bootstrap table操作按钮 （查询结果表）
window.operateEventsFeature = {
	'click .RoleOfdDeldteFeature' : function(e, value, row, index) {
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
				// 获取当前图层名
				var code = row.values_.ID.substring(0,4);
				var layer_type = queryLayerNameByPMSID(code);
				// 获取当前图层
				var layer = getLayerNodeByName(layer_type).layer;

				 editObject.editType = "delete";
				 //删除数据库Feature
				 editWFSFeature([row],'delete',layer_type);
				 //删除地图上的Feature
				 layer.getSource().removeFeature(row);
				 //删除bootstrapTable表格里的Feature
//				 $('#wfsFeatureTable').bootstrapTable('removeByUniqueId', row.values_.ID);
				 $('#wfsFeatureTable').bootstrapTable('remove', {field: 'ID', values: row.values_.ID});
				swal("删除成功", '', "success");
			}
		});
	},
	'click .RoleOfEditFeature' : function(e, value, row, index) {
		// 将jspanel弹窗缩成一行
		propertyListWindow.smallify();
		// 获取查询图层类型
		var code = row.values_.ID.substring(0,4);
		var layer_type = queryLayerNameByPMSID(code);
		// 获取当前图层
		var layer = getLayerNodeByName(layer_type).layer;
		// 保存数据
		
		editObject.layer_name = layer_type;
		editObject.feature = row;
		editObject.source = layer.getSource();
		editObject.editType = "update";
		editObject.index = index;
		editObject.manually_modify = true;
		clearHighlightObj();
		
		var select = new ol.interaction.Select();
		// 设置要素高亮
		highlightObj = select.getFeatures();
		highlightObj.push(row);
		map.addInteraction(select);
		jsPanelAttributeInfo(layer_type);
		
		// 获取要素的几何范围
//		var extent = row.getGeometry().getExtent();
		var latlon = row.getGeometry().flatCoordinates;
//		map.getView().fit(extent, map.getSize());
		map.getView().setCenter(latlon);
	    map.render();
	},
	'click .RoleOfPositionFeature' : function(e, value, row, index) {
		// 将jspanel弹窗缩成一行
		propertyListWindow.smallify();
		var feature = row;
		clearHighlightObj();
		var selectEvent = new ol.interaction.Select();
		map.addInteraction(selectEvent);
		// 设置要素高亮
		highlightObj = selectEvent.getFeatures();
		highlightObj.push(feature);
		// 获取要素的经纬度
//		var extent = feature.getGeometry().getExtent();
		var latlon = feature.getGeometry().flatCoordinates;
//		map.getView().fit(extent, map.getSize());
		map.getView().setCenter(latlon);
	    map.render();
	},'click .RoleOfFiberCore' : function(e, value, row, index) {
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
	},'click .RoleOfEquipment' : function(e, value, row, index) {
		//查询设备信息
		filterFieldID = row.values_.ID;
		resPopover('/EQUIPMENT/EQUIPMENT.action','设备信息');
	} 

};
/**
 * @requires jQuery
 * 
 * 格式化日期时间
 */
function operationdateFormatter(value) {
	if (value != null) {
		return value.substring(0, value.indexOf('Z'));
	}
	return null;
}

// bootstrap table操作按钮 （查询结果表）
function operateFormatterFeature(val, row, index) {
	var detail = "";
	var tableName = queryLayerNameByPMSID(row.values_.ID.substring(0,4));
	if(tableName=='SD_OPTICALCABLESECTION'){
		detail = '<button class="RoleOfFiberCore btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="纤芯信息"><span  class="qxinfo_icon" style="display:block;" ><span></button>';
	}else if(tableName =='SD_STATION'){
		detail = '<button class="RoleOfEquipment btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="设备信息"><span  class="detail_icon" style="display:block;"><span></button>'
	}else if(tableName =='SD_COMMUNICATIONPOLETOWER'){
		detail = '<button class="RoleOfAppendant btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="附属物"><span  class="detail_icon" style="display:block;"><span></button>'
	}
	return [detail+
			'<button class="RoleOfEditFeature btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="修改"><span  class=" glyphicon glyphicon-edit " ><span></button>',
			'<button class="RoleOfdDeldteFeature  btn btn-sm rolebtn" style=" background: none;outline:none;color:red" title="删除"><span  class=" glyphicon glyphicon-trash " ><span></button>',
			'<button class="RoleOfPositionFeature  btn btn-sm rolebtn" style="background: none;outline:none;color: #bf824c" title="定位"><span  class=" glyphicon glyphicon-record  " ><span></button>'

	].join('');

}
// 设置传入参数
function queryParams(params) {
	return {
		page_pn : params.pageNumber,
		sColumn : params.sort,
		order : params.order,
		page_size : params.limit
	// "search.C_DISASTERNAME*like":'%'+$("#DISASTERNAME").val()+'%',
	// "search.C_DIRECTPERS*like":'%'+$("#DIRECTPERS").val()+'%',
	// "search.C_DISASTERADDR*like":'%'+$("#DISASTERADDR").val()+'%',
	// "search.C_HAPPENDTIME*eq":$("#HAPPENDTIME").val()
	}
};

// 根据图层名称  查询 layerTree ID
function queryIdByLayerName(layer_name) {
	var id = "";
	var layer = "anqing:"+layer_name;
	$.ajax({
		// 请求地址
		url : "/T_POWERLAYERS/search.action",
		data : {
			"search.C_LAYER*eq" : layer
		},// 设置请求参数
		type : "post",// 请求方法
		async : false,
		dataType : "json",// 设置服务器响应类型
		// success：请求成功之后执行的回调函数 data：服务器响应的数据
		success : function(data) {
			if (data != "") {
				id = data[0].C_ID;
			}
		}
	});
	return id;
}
// 根据系统编码查询空间数据图层名称
function queryLayerNameByPMSID(PMSID) {
	var layer_name = "";
	$.ajax({
		// 请求地址
		url : "/SYSTEMCODE/search.action",
		data : {
			"search.CODE*eq" : PMSID
		},// 设置请求参数
		type : "post",// 请求方法
		async : false,
		dataType : "json",// 设置服务器响应类型
		// success：请求成功之后执行的回调函数 data：服务器响应的数据
		success : function(data) {
			if (data != "") {
				layer_name = data[0].TABLENAME;
			}
		}
	});
	return layer_name;
}

/**
 * 根据data数据查询表
 * url: '/T_FCRELATIONSHIP/search.action'
 * data: {"search.CODE*eq" : "cod"}
*/
function queryTableByData(url,data) {
	var newData = "";
	$.ajax({
		// 请求地址
		url : url,
		data : data,// 设置请求参数
		type : "post",// 请求方法
		async : false,
		dataType : "json",// 设置服务器响应类型
		// success：请求成功之后执行的回调函数 data：服务器响应的数据
		success : function(data) {
			if (data != "") {
				newData = data;
			}
		}
	});
	return newData;
}


function queryWFSURL(layerName) {
	var url = "";
	$.ajax({
		// 请求地址
		url : "/T_POWERLAYERS/search.action",
		// data:{"search.C_ID*eq":id},//设置请求参数
		data : {},// 设置请求参数
		type : "post",// 请求方法
		async : false,
		dataType : "json",// 设置服务器响应类型
		// success：请求成功之后执行的回调函数 data：服务器响应的数据
		success : function(data) {
			for(var i in  data){
				var name =data[i].C_LAYER.split(':')[1]; 
				if (name==layerName) {
					url = data[i].C_LAYERURL;
					break;
				}
			}
		}
	});
	var wfsURL = url.split("/")[2];
	return wfsURL;
}

// 弹出属性字段信息框
function jsPanelAttributeInfo(layer_name) {
	var	name =layer_name.toLowerCase();
	var	url = "/" + name + "/" + name + "attr.action";
	var	title = getLayerNodeByName(layer_name).text + "数据属性";
    var	title = "新增"+getLayerNodeByName(layer_name).text;// + "数据属性";
	if(editObject.editType == "update"){
		title = "修改"+getLayerNodeByName(layer_name).text;// + "数据属性";
	}
	attributeInfoObj = $.jsPanel({
				id : "attributeInfo",
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
						if(editObject.field == 'Latlong'){
							$('#'+name+'_coordinate').show();
						}else{
							$('#'+name+'_coordinate').hide();
							if (editObject.editType == "add") {
								if(layer_name == 'SD_STATION'){
									$('#TYPE').selectpicker('val', editObject.stationType);
//									$('#TYPE').prop('disabled', true);
								}
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
								var feature = editObject.feature.values_;
								if(editObject.manually_modify){//是否显示经纬度坐标修改
									$('#'+name+'_coordinate').show();
									if(getDrawType(editObject.layer_name)=="LineString"){
										var  lat_lon= feature.geometry.flatCoordinates;//经度和纬度
										var $tab = $('#sd_opticalcablesection_table');
										$('#sd_opticalcablesection_table').bootstrapTable("removeAll");
										for(var i=0;i<lat_lon.length;i++){
											var sd_optionId=i;
											$tab.bootstrapTable('append', [{ID:sd_optionId,LONG:"<input type='text' class='latlongInput long"+sd_optionId+"' value="+lat_lon[i]+" />",LAT:"<input type='text' class='latlongInput lat"+sd_optionId+"' value="+lat_lon[i+1]+" />"}]);
											i++;
										}
										
									}else{
										var  lat_lon= feature.geometry.flatCoordinates;//经度和纬度
										$("#longitude").val(lat_lon[0]);
										$("#latitude").val(lat_lon[1]);
									}
								}
								//回写数据
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

// 设置featureID
function setFeatureID(feature, featureType) {
	$.ajax({
		// 请求地址
		url : "/SYSTEMCODE/search.action",
		data : {
			"search.TABLENAME*eq" : featureType
		},// 设置请求参数
		type : "post",// 请求方法
		async : false,
		dataType : "json",// 设置服务器响应类型
		// success：请求成功之后执行的回调函数 data：服务器响应的数据
		success : function(data) {
			if (data != "") {
				feature.set("ID", data[0].CODE + guid());
			}
		}
	});
}

// 生成guid编码
function guid() {
	return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

// 根据数据库表名获取图层树节点中文名
function getLayerNodeByName(layer_name) {
	var node = "";
	var nodeID = $('#powerLayerTree').jstree().get_node("#-1").children;
	for(var i=0;i<nodeID.length;i++){
		var data = $('#powerLayerTree').jstree().get_node(nodeID[i]).original;
		if(data.name == layer_name){
			node = data;
			break;
		}
	}
	
	return node;
}

// 取消保存
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
// 空间数据属性弹出框
function closeAttributeInfoObj() {
	if (attributeInfoObj != "") {
		attributeInfoObj.close();
		attributeInfoObj = "";
	}
}
// 保存feature
function saveFeature() {
	$("#attributeInfo").mLoading("show");
	clearOnMapEvent();// 清除主动添加到地图上的事件
	//局站名字不能为空
	if(layerName=='SD_STATION' && $('#NAME').val().trim()==''){
		$('#NAME').focus();
		swal('局站名字不能为空！', '', "warning");
		return;
	}
	if (editObject.field=='Latlong') {
		var layerName = editObject.layer_name;
		var type = editObject.DrawType;
		var source = editObject.layer.getSource();
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
					return;
				}
				var latitude = $('.'+latKey).val();
				if(!validLatDu(latitude)){
					$('.'+latKey).focus();
					swal('纬度填写不符合规范！', '经度范围0~90', "warning");
					return;
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

        $('#'+layerName.toLowerCase()+'Table').bootstrapTable('prepend', [fea]);
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
		if(editObject.manually_modify){
			if(getDrawType(featureType)=="LineString"){
				var data = $('#'+featureType.toLowerCase()+'_table').bootstrapTable('getData');
				// 先保存数据
				var latlongs=[];
				if(data.length<2){
					swal('经纬度数据至少要有两组！', '', "warning");
					return;
				}
				var length = 0;
				for(var i in data){
					var map = {};
					var longKey = 'long'+data[i].ID;
					var latKey = 'lat'+data[i].ID;
					var longitude = $('.'+longKey).val();
					if(!validLonDu(longitude)){
						$('.'+latKey).focus();
						swal('经度填写不符合规范！', '经度范围0~180', "warning");
						return;
					}
					var latitude = $('.'+latKey).val();
					if(!validLatDu(latitude)){
						$('.'+latKey).focus();
						swal('纬度填写不符合规范！', '经度范围0~90', "warning");
						return;
					}
					latlongs.push([parseFloat(longitude),parseFloat(latitude)]);
					length = length+2;
				}
				fea.getGeometry().setCoordinates(latlongs);
			}else{
				var lat = $("#latitude").val();
				var lon = $("#longitude").val();
				fea.getGeometry().setCoordinates([lon,lat]);
			}
		}
		var feature = fea.clone();// 此处clone
		var geo = feature.getGeometry();// 为为了实现绘制结束后，添加的对象还在，否提交完成后数据就不显示了，必须刷新
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
			$('#'+featureType.toLowerCase()+'Table').bootstrapTable('updateRow', {index: editObject.index, row: feature.values_});
			swal("修改成功", '', "success");
		}else if(editType == "add"){
			$('#'+featureType.toLowerCase()+'Table').bootstrapTable('prepend', [fea]);
			swal("保存成功", '', "success");
		}

	}
	editObject = {};
	// 关闭属性弹窗
	closeAttributeInfoObj();
	$("#attributeInfo").mLoading("hide");

}

// 将序列化对象转成json
function getFormJson(form,type) {
	var o = {};
	var a;
	if(type=='1'){
		a = $("#" + form).serializeArray();
		for(var i in a){
			a[i].name = a[i].name.split('1')[0];
		}
	}else if(type=='2'){
		a = $("#" + form).serializeArray();
		for(var i in a){
			a[i].name = a[i].name.split('2')[0];
		}
	}else{
		a = $("#" + form).serializeArray();
	}
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [ o[this.name] ];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
}

// 编辑操作
function editWFSFeature(features, editType, featureType) {
	var serviceID = queryWFSURL(featureType);
	var featureNS = "http://" + serviceID + "/anqing";
	var WFSTSerializer = new ol.format.WFS({
		featureNS : featureNS,
		featureType : "anqing:" + featureType,
		version : '2.0.0'
	});
	var featObject;
	if (editType == 'add') {
		featObject = WFSTSerializer.writeTransaction(features, null, null, {
			featureNS : featureNS,// 为创建工作区时的命名空间URI
			featurePrefix : "anqing",
			version : '2.0.0',
			featureType : featureType, // feature对应图层
			srsName : 'EPSG:4326'// 坐标系
		});
	} else if (editType == 'update') {
		featObject = WFSTSerializer.writeTransaction(null, features, null, {
			featureNS : featureNS,// 为创建工作区时的命名空间URI
			featurePrefix : "anqing",// 作为前缀
			featureType : featureType,
			version : '2.0.0',
			srsName : 'EPSG:4326'// 坐标系
		});
	} else if (editType == 'delete') {
		featObject = WFSTSerializer.writeTransaction(null, null, features, {
			featureNS : featureNS,// 为创建工作区时的命名空间URI
			featurePrefix : "anqing",// 作为前缀
			featureType : featureType, // feature对应图层
			version : '2.0.0',
			srsName : 'EPSG:4326'// 坐标系
		});
	}

	var serializer = new XMLSerializer();
	// 将参数转换为xml格式数据
	var featString = serializer.serializeToString(featObject);
	var request = new XMLHttpRequest();
	
	request.open('POST', 'http://'+serviceID+'/geoserver/wfs?service=wfs');
	request.setRequestHeader('Content-Type', 'text/xml');
	request.send(featString);
	
}

//全幅
function fullView(){
	clearOnMapEvent();
	var bounds = [ 117.044453027202, 30.5066687301743,
					117.110272065313, 30.5599371735666 ];
	  map.getView().fit(bounds, map.getSize());
	  map.render();
}

/************** 经纬度验证、定位 BEGIN ******************/
/**
 * 获取度分秒经纬度
 */
function getLonDFM(){
	var lonDFM;
	var dfm = $("#lonDFMFrom").serializeJson();
	var lonD = dfm.lonD;
	var lonF = dfm.lonF;
	var lonM = dfm.lonM;
	if(!isEmpty(lonD) && !isEmpty(lonF) && !isEmpty(lonM)){
		lonDFM = lonD + "°" + lonF + "′" + lonM + '″';
	}else if(!isEmpty(lonD) && !isEmpty(lonF) && isEmpty(lonM)){
		lonDFM = lonD + "°" + lonF + "′";
	}else if(!isEmpty(lonD) && isEmpty(lonF) && isEmpty(lonM)){
		lonDFM = lonD + "°";
	}else{
		lonDFM = "";
	}
	return lonDFM;
}

function getLatDFM(){
	var latDFM;
	var dfm = $("#LatDFMFrom").serializeJson();
	var latD = dfm.latD;
	var latF = dfm.latF;
	var latM = dfm.latM;
	if(!isEmpty(latD) && !isEmpty(latF) && !isEmpty(latM)){
		latDFM = latD + "°" + latF + "′" + latM + '″';
	}else if(!isEmpty(latD) && !isEmpty(latF) && isEmpty(latM)){
		latDFM = latD + "°" + latF + "′";
	}else if(!isEmpty(latD) && isEmpty(latF) && isEmpty(latM)){
		latDFM = latD + "°";
	}else{
		latDFM = "";
	}
	return latDFM;
}

/**
 * 经纬度切换
 */
function dFMChgDu(){
	var lon;
	var lonDFM = getLonDFM();
	if(!isEmpty(lonDFM)){
		if(!validLonDFM(lonDFM)){
			swal('请填写正确的经度数据!', '', "warning");
			return false;
		}
		lon = dFMConvertDu(lonDFM);
		$("#lon").val(lon);
	}
	var lat;
	var latDFM = getLatDFM();
	if(!isEmpty(latDFM)){
		if(!validLatDFM(latDFM)){
			swal('请填写正确的纬度数据!', '', "warning");
			return false;
		}
		lat = dFMConvertDu(latDFM);
		$("#lat").val(lat);
	}
	return true;
}

function duChgDFM(){
	var du = $("#duFrom").serializeJson();
	var lon = du.lon;
	var lat = du.lat;
	if(!isEmpty(lon)){
		if(!validLonDu(lon)){
			swal('请填写正确的经度数据!', '', "warning");
			return false;
		}
		var lonDFM = duConvertDFM(lon);
		var d = lonDFM.split("°")[0];  
        var f = lonDFM.split("°")[1].split("′")[0];  
        var m = lonDFM.split("°")[1].split("′")[1].split('″')[0];
        if(!isEmpty(d)){
        	$("#lonD").val(d);
        }
        if(!isEmpty(f)){
        	$("#lonF").val(f);
        }
        if(!isEmpty(m)){
        	$("#lonM").val(m);
        }
	}
	if(!isEmpty(lat)){
		if(!validLatDu(lat)){
			swal('请填写正确的纬度数据!', '', "warning");
			return false;
		}
		var latDFM = duConvertDFM(lat);
		var latD = latDFM.split("°")[0];  
        var latF = latDFM.split("°")[1].split("′")[0];  
        var latM = latDFM.split("°")[1].split("′")[1].split('″')[0]; 
        if(!isEmpty(latD)){
        	$("#latD").val(latD);
        }
        if(!isEmpty(latF)){
        	$("#latF").val(latF);
        }
        if(!isEmpty(latM)){
        	$("#latM").val(latM);
        }
	}
	return true;
}

/**
 * 度数定位
 */
function duFix(){
	var du = $("#duFrom").serializeJson();
	var lon = du.lon;
	var lat = du.lat;
	if(!isEmpty(lon) && !isEmpty(lat)){
		if(!validLonDu(lon)){
			swal('请填写正确的经度数据!', '', "warning");
			return;
		}
		if(!validLatDu(lat)){
			swal('请填写正确的纬度数据!', '', "warning");
			return;
		}
		map.getView().setCenter([parseFloat(lon), parseFloat(lat)]);
	    map.render();
    }else{
    	swal('请填写正确的经纬度!', '', "warning");
		return;
    }
}

/**
 * 度分秒定位
 */
function dFMFix(){
	var lon;
	var lat;
	var lonDFM = getLonDFM();
	var latDFM = getLatDFM();
	if(!isEmpty(lonDFM) && !isEmpty(latDFM)){
		if(!validLonDFM(lonDFM)){
			swal('请填写正确的经度数据!', '', "warning");
			return;
		}
		if(!validLatDFM(latDFM)){
			swal('请填写正确的纬度数据!', '', "warning");
			return;
		}
		lon = dFMConvertDu(lonDFM);
		lat = dFMConvertDu(latDFM);
		map.getView().setCenter([parseFloat(lon), parseFloat(lat)]);
	    map.render();
	}else{
		swal('请填写正确的经纬度!', '', "warning");
		return;
	}
}
/************** 经纬度验证、定位 END ******************/

//根据空间数据名称 获取添加空间数据的类型
function getDrawType(layerName){
	var drawType = '';
	switch (layerName) {
	case "SD_STATION":
	case "SD_JUNCTIONBOX":
	case "SD_COMMUNICATIONPOLETOWER":
	case "SD_RESIDUALCABLE":
	case "SD_PERSONWELL":
		drawType = 'Point';
		break;
	case "SD_OPTICALCABLESECTION":
	case "SD_CABLEDUCT":
	case "SD_CABLETRENCH":
	case "SD_CABLETUNNEL":
		drawType = 'LineString';
		break;
	default:
		break;
	}
	return drawType;
}

function selectStartIDOrEndID(inputID){
	
	var jsPanelID = window.jsPanel.activePanels.list;
	var select = new ol.interaction.Select();
	map.addInteraction(select);
	select.on('select',function(e) {
		if (e.selected[0] != undefined ) {
			var data = e.selected[0].values_;
			var code = data.ID.substring(0,4);
			if(code=='0401' || code=='0402'){
				$('#'+inputID).val(data.NAME);
				map.removeInteraction(select);
				for(var i in jsPanelID){
					//恢复弹出框  
				   jsPanel.activePanels.getPanel(jsPanelID[i]).normalize();
				}
			}
		}		 
	});
	for(var i in jsPanelID){
		//最小化弹出框  
	   jsPanel.activePanels.getPanel(jsPanelID[i]).minimize();
	}
}

/** 地图选取局站、光缆信息  
 * inputType 选取类型
 * callback 回调函数
 */
// 局站
var jz = new Array("0401", "0402"); 
// 光缆段
var gl = new Array("0406");

function selObjByMap(inputType, callback){
	var jsPanelID = window.jsPanel.activePanels.list;
	var select = new ol.interaction.Select();
	map.addInteraction(select);
	select.on('select',function(e) {
		if (!isEmpty(e.selected[0])) {
			var data = e.selected[0].values_;
			var code = data.ID.substring(0,4);
			var arr = new Array();
			if(inputType == "jz"){
				arr = jz;
			}else if(inputType == "gl"){
				arr = gl;
			}
			if(contains(arr, code)){
				$('.' + inputType).val(data.NAME);
				map.removeInteraction(select);
				for(var i in jsPanelID){
					//恢复弹出框  
				   jsPanel.activePanels.getPanel(jsPanelID[i]).normalize();
				}
			}
		}	
		if(!isEmpty(callback)){
			eval(callback + "('" + data.ID + "')");
		}
	});
	for(var i in jsPanelID){
		//最小化弹出框  
	   jsPanel.activePanels.getPanel(jsPanelID[i]).minimize();
	}
}

/**
 * 选择局站后显示设备信息
 * @param inputID
 */
function selectStationToEquip(inputID){
	
	var jsPanelID = window.jsPanel.activePanels.list;
	var select = new ol.interaction.Select();
	map.addInteraction(select);
	select.on('select',function(e) {
		if (e.selected[0] != undefined ) {
			var data = e.selected[0].values_;
			var code = data.ID.substring(0,4);
			if(code=='0401' || code=='0402'){
				$.ajax({
		            url:"/T_EQUIPMENT/search.action",
		              data:{"search.C_STATIONID*eq":data.ID},//设置请求参数 
		              type:"post",//请求方法 
		                dataType: "Json",
		                async:true,
		                success: function (data) {
		                    if (data!="" ||data!=null) {
		                    	$('#'+inputID).empty();
		                        for(var i=0;i<data.length;i++) {
		                          $('#'+inputID+'.selectpicker').append("<option value=" + data[i].C_CODE + ">" + data[i].C_NAME + "</option>");
		                        }
		                        $("#"+inputID).selectpicker('refresh');
		                       
		                    }
		                }
		            })
				map.removeInteraction(select);
				for(var i in jsPanelID){
					//恢复弹出框  
				   jsPanel.activePanels.getPanel(jsPanelID[i]).normalize();
				}
			}
		}		 
	});
	for(var i in jsPanelID){
		//最小化弹出框  
	   jsPanel.activePanels.getPanel(jsPanelID[i]).minimize();
	}
}


//根据表名获取获取模糊数据  数组
function getBlurDate(tableNames){
	var name =[];
	var nodeID = $('#powerLayerTree').jstree().get_node("#-1").children;
	for(var i=0;i<tableNames.length;i++){
		for(var j=0;j<nodeID.length;j++){
			var data = $('#powerLayerTree').jstree().get_node(nodeID[j]).original;
			if(tableNames[i] == data.name){
				var features = data.layer.getSource().getFeatures();
				for (var k = 0; k < features.length; k++) {
					if(features[k].values_.NAME!="" && features[k].values_.NAME!=null){
						name.push({ ID: features[k].values_.ID, Name:features[k].values_.NAME});
					}
				}
			}
		}
	}
	return name;
}

//根据经纬度添加要素
/*function addFeatureBylatlong(){
	editObject.source = excessiveObject.source;
	editObject.layer_name = excessiveObject.layerName;
	editObject.DrawType = excessiveObject.DrawType;
	editObject.field = 'Latlong';
	jsPanelAttributeInfo('Latlong');
	excessiveObject={};
}*/

//判断object对象是否为空
function isEmptyObject(e) {  
    var t;  
    for (t in e)  
        return !1;  
    return !0  
}  

//添加空间数据
function addSpaceData(layerName,stationType){
	    clearOnMapEvent(); // 清除主动添加到地图上的事件
		closeAttributeInfoObj();
		//清除之前添加而没有保存的数据
		if (editObject.editType == "add") {
			var source = editObject.source;
			source.removeFeature(editObject.feature);
			editObject={};
		}
		// 获取当前图层及类型
		var layer = getLayerNodeByName(layerName).layer;
			var type = getDrawType(layerName);
			// 画矢量图形
			var draw = new ol.interaction.Draw(
					{
						source : layer.getSource(),
						geometryName : 'SHAPE',
						type : (type)
					});
			map.addInteraction(draw);
			draw.on('drawend',function(e) {
				// 保存编辑数据
				editObject.feature = e.feature;
				editObject.source = layer.getSource();
				editObject.editType = "add";
				editObject.layer_name = layerName;
				editObject.stationType = stationType;
				// 弹出属性窗口
				jsPanelAttributeInfo(layerName);
				// 关闭draw事件
				map.removeInteraction(draw);
			}, this);				
}
//修改空间数据
function updateSpaceData(){
	clearOnMapEvent(); // 清除主动添加到地图上的事件
	closeAttributeInfoObj();
		var select = new ol.interaction.Select();
		var modify = new ol.interaction.Modify({
					features : select.getFeatures()
				});
		map.addInteraction(select);
		map.addInteraction(modify);
		var feaId="";
		select.on('select',function(e) {
			//获取选中对象
			var features = e.target.getFeatures().getArray();
			if (features.length != 0) {
				if(feaId!="" && feaId != features[0].values_.ID){
					closeAttributeInfoObj();
				}
			feaId = features[0].values_.ID;
			// 获取查询图层类型
			var code = feaId.substring(0,4);
			var layer_name = queryLayerNameByPMSID(code);
			// 获取当前图层
			var layer = getLayerNodeByName(layer_name).layer;
				// 保存数据
				editObject.feature = features[0];
				editObject.source = layer.getSource();
				editObject.editType = "update";
				editObject.layer_name = layer_name;
				editObject.manually_modify = false;
				jsPanelAttributeInfo(layer_name);
			}
		});
}

//删除空间数据
function deleteSpaceData(){
	closeFunction();
	drawGeometry = new ol.interaction.Draw({
		source : new ol.source.Vector(),
		type : /** @type {ol.geom.GeometryType} */
		('Circle'),
		geometryFunction : ol.interaction.Draw.createBox(),
		style : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(255, 255, 255, 0.2)'
			}),
			stroke : new ol.style.Stroke({
				color : 'rgba(0, 0, 0, 0.5)',
				lineDash : [ 10, 10 ],
				width : 2
			}),
			image : new ol.style.Circle({
				radius : 5,
				stroke : new ol.style.Stroke({
					color : 'rgba(0, 0, 0, 0.7)'
				}),
				fill : new ol.style.Fill({
					color : 'rgba(255, 255, 255, 0.2)'
				})
			})
		})
	});
	map.addInteraction(drawGeometry);
	var listener = "";
	var sketch = null;
	drawGeometry.on('drawstart', function(evt) {
		// set sketch
		sketch = evt.feature;
		var coord = evt.coordinate;
		listener = sketch.getGeometry().on('change', function(evt) {
			var geom = evt.target;
			if (geom instanceof ol.geom.Geometry) {
				var extent = geom.getExtent();
				boxExtent = extent;
			}
		});
	}, this);

	drawGeometry.on('drawend', function(event) {
		sketch = null;
		clearDrawGeometry();
		ol.Observable.unByKey(listener);
		swal({
			title : "确定删除此数据？",
			text : "删除后不可恢复,请谨慎操作!",
			type : "warning",
			showCancelButton : true,
			confirmButtonColor : "#DD6B55",
			confirmButtonText : "确定",
			cancelButtonText : "取消",
			closeOnConfirm : false
		},function(isConfirm) {
			if (isConfirm) {
				swal.close();
				var layerTable = queryTableByData('/SYSTEMCODE/search.action',{});
				var deleteFeatures=[];
				for(var i in layerTable){
					var layer_name = layerTable[i].TABLENAME;
					if(layer_name != 'EQUIPMENT'){
						var featureRequest = new ol.format.WFS().writeGetFeature({
							srsName : 'EPSG:4326',
							featurePrefix : 'anqing',
							featureTypes : [ layer_name ],
							outputFormat : 'application/json',
							geometryName : "the_geom",
							filter :ol.format.filter.bbox('SHAPE', boxExtent, 'EPSG:4326'),
						});
						
						// 然后发布请求并将接收到数据在表格中显示
						var featureUrl = "http://" + queryWFSURL(layer_name) + "/geoserver/wfs";
						fetch(featureUrl, {
							method : 'POST',
							body : new XMLSerializer().serializeToString(featureRequest)
						}).then(function(response) {
							return response.json();
						}).then(function(json) {
							var features = new ol.format.GeoJSON().readFeatures(json);
							if (features.length == 0) {
//								swal('没有查到符合条件的数据', '', "warning");
							} else {
								// 获取查询图层类型
								var code = features[0].values_.ID.substring(0,4);
								var layerType = queryLayerNameByPMSID(code);
								// 获取当前图层
								var layer = getLayerNodeByName(layerType).layer;
								var map={};
								map[layer]=features;
								deleteFeatures.push(map);
								editWFSFeature(features,'delete',layerType);
//								for(var k in features){
//									layer.getSource().removeFeature(features);
//								}
							}
						});
					}
				}
			} else {
//				map.removeInteraction(select);
			}

		});
		
	}, this);
}

//分割线段
function splitCable(){
	closeFunction();
	clearOnMapEvent(); // 清除主动添加到地图上的事件
	var source = getLayerNodeByName('SD_OPTICALCABLESECTION').layer.getSource();
	var split = new ol.interaction.Split ({
	       sources: source
		});
    map.addInteraction(split);
	
	//监听分割事件
	source.on("aftersplit", function(e){
		editObject.editType = "split";
		editObject.source = source;
		editObject.feature = e.features;
		editObject.original = e.original;
         map.removeInteraction(split);
     	 closeAttributeInfoObj();
     	attributeInfoObj = $.jsPanel({
			id : "attributeInfo",
			headerControls : {
				controls : "closeonly"
			},
			position : {
				right : 20,
				top : 100
			},
			dragit: {containment: [100, 0, 0,160]},
			theme : "rebeccapurple",
			contentSize : 'auto auto',
			headerTitle : '分割光缆段信息',
			contentAjax : {
				url : '/splitcable/splitcable.action',
				autoload : true,
				done : function(data, textStatus, jqXHR, panel) {
					//回写数据
					var feature = e.features[0].values_;
					for ( var id in feature) {
						if (id != "SHAPE" && id != "ID" && id !="geometry" ) {
							if(document.getElementById(id+'1').type== "select-one"){
								$('#' + id+'1') .selectpicker('val', feature[id]);
								$('#' + id+'2') .selectpicker('val', feature[id]);
							}else if(id=='ENDID' || id == 'STARTID'){
								var value = formatfeatureName(feature[id]);
								$('#' + id+'1').val(value);
								$('#' + id+'2').val(value);
							}else if(id=='LENGTH'){
							}else{
								$('#' + id+'1').val(feature[id]);
								$('#' + id+'2').val(feature[id]);
							}
						} 
					}
				}
			},
			callback : function(panel) {
			}
		});
    });

}

//保存光缆分割数据
function saveSplitcable() {
	
	var features = editObject.feature;
	var coordinate = features[0].getGeometry().flatCoordinates;
	var longitude = coordinate[coordinate.length-2];
	var latitude = coordinate[coordinate.length-1];
	var junctionbox =new ol.Feature( new ol.geom.Point([parseFloat(longitude),parseFloat(latitude)]));
	var junctionboxID = '0402'+guid();
	// 获取接头盒属性字段的json
	var junctionboxJson = getFormJson("junctionbox_form");
	var junctionboxSource = getLayerNodeByName('SD_JUNCTIONBOX').layer.getSource();
	//保存接头盒信息
	saveSpaceData(junctionbox,junctionboxJson,junctionboxID,'SD_JUNCTIONBOX',junctionboxSource);
	// 获取第一段光缆段属性字段的json
	var cable1Json = getFormJson("opticalcablesection_form1",'1');
	// 获取第二段光缆段属性字段的json
	var cable2Json = getFormJson("opticalcablesection_form2",'2');
	
	//从数据看删除原来的光缆段
	editWFSFeature([editObject.original],'delete','SD_OPTICALCABLESECTION');
	if(true){
		var start_id = true,end_id=true;
		//根据选择的模糊数据转换成空间数据ID
		for(var i=0;i<blurData.length;i++){
			if(blurData[i].Name == cable1Json.STARTID){
				cable1Json.STARTID = blurData[i].ID;
				start_id = false;
			}
			if(blurData[i].Name == cable2Json.ENDID){
				cable2Json.ENDID = blurData[i].ID;
				end_id = false;
			}
		}
		if(start_id){cable1Json.STARTID=""}
		cable1Json['ENDID'] = junctionboxID;
		if(end_id){cable2Json.ENDID=""}
		cable2Json['STARTID'] = junctionboxID;
		blurData=[];
	}
	//保存光缆段1数据
	var cable1ID = editObject.original.values_.ID;
	saveSpaceData(features[0],cable1Json,cable1ID,'SD_OPTICALCABLESECTION',editObject.source);
	//保存光缆段2数据
	var cable2ID = '0406'+guid();
	saveSpaceData(features[1],cable2Json,cable2ID,'SD_OPTICALCABLESECTION',editObject.source);
	
	//修改纤芯承载表关联ID
	var data = queryTableByData("/T_FCRELATIONSHIP/queryMultiConditionData.action",
			{'C_STARTOCSECTIONID':cable1ID,'C_ENDOCSECTIONID':cable1ID,});
	if(data!=''){
		for(var i in data){
			if(data[i].C_STARTOCSECTIONID == data[i].C_ENDOCSECTIONID ){
				var obj = {};
	        	obj["search.C_ID*eq"] = data[i].C_ID;
	    		obj['C_ENDOCSECTIONID'] = cable2ID;
	    		$.post('/T_FCRELATIONSHIP/update.action', obj);
	    		continue;
			}else{
				var startId = editObject.original.values_.STARTID;
				var endId = editObject.original.values_.ENDID;
				// 获取当前图层
				 var layer = getLayerNodeByName('SD_OPTICALCABLESECTION').layer;
				 var features = layer.getSource().getFeatures();
				
				//更新纤芯承载表关联ID
				 modificationFcrrlationship([cable1ID],features,startId,cable1ID,data[i].C_ENDOCSECTIONID,cable2ID,data[i].C_ID);
				 
			}
		}
		
	}
	closeAttributeInfoObj();
	editObject = {};
	swal("保存成功",'',"success");
	
}
/*//更新纤芯承载表关联ID
 * filtrationID:过滤的光缆段ID
 * features:所有光缆段集合
 * startId：原光缆段的起点ID
 * cable1ID：分割后的第一段光缆段的ID，也是原光缆段ID
 * cable2ID：分割后的第二段光缆段的ID（新设置的）
 * eligibleID：根据分割光缆段（原光缆段）ID从纤芯承载管理表查询出来符合条件的光缆段ID
 * C_ID : 根据此ID修改纤芯承载管理表
*/
function modificationFcrrlationship(filtrationID,features,startId,cable1ID,eligibleID,cable2ID,C_ID){
	if(startId.substring(0,4)=='0402'){ //只查询接头盒
		 for(var i in features){
			 for(var k in filtrationID){
				 if(features[i].values_.ID != filtrationID[k]){
					 if(features[i].values_.STARTID==startId || features[i].values_.ENDID==startId){
						 if(features[i].values_.ID==eligibleID){
							 var obj = {};
							 obj["search.C_ID*eq"] = C_ID;
							 obj['C_STARTOCSECTIONID'] = cable2ID;
							 $.post('/T_FCRELATIONSHIP/update.action', obj);
							 filtrationID =[];
							 return;
					     }else{
					    	 filtrationID.push(features[i].values_.ID);
					    	 modificationFcrrlationship(filtrationID,features[i].values_.STARTID,cable1ID,eligibleID,cable2ID);
					     } 
					 }
				 }
			 }
			 
		 }
	 }
}

//保存空间数据信息
function saveSpaceData(fea,attributeJson,ID,layerName,source){
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
	fea.set("ID", ID);
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
}
//取消分割
function unSaveSplitcable() {
	clearOnMapEvent();// 清除主动添加到地图上的事件
	if (editObject.editType == "add") {
		var source = editObject.source;
		source.removeFeature(editObject.feature);
	}else if(editObject.editType == "split"){
		var source = editObject.source;
		var features = editObject.feature;
		source.removeFeature(features[0]);
		source.removeFeature(features[1]);
		source.addFeature(editObject.original);
	}
	if (editObject != "") {
		editObject = {};
	}
	closeAttributeInfoObj();
}
//图形编辑工具栏鼠标悬停效果
function imgmouseenter(id,name) {
   $("#"+id+" img").attr("src","/images/img/"+name+".png");
}
//图形编辑工具栏鼠标离开效果
function imgmouseleave(id,name) {
    $("#"+id+" img").attr("src","/images/img/"+name+".png");
}






/************** 书签 BEGIN *****************/
function loadBookMark(){
	var divshow = $(".bookmark-table");
	divshow.text("");
	$.ajax({
		url:"/T_POWERBOOKMARK/search.action",
    	data:{"sort.C_ID": 'DESC'},
    	type:"post",
        dataType:"Json",
        async:false,
        success: function(data){
        	if (!$.isEmptyObject(data)) {
        		for(var i = 0; i < data.length; i++){
        			var mark = data[i];
        			var tr = $("<tr>");
        			var td1 = $("<td onClick = 'markFix(" + mark.C_LONGITUDE + "," + mark.C_LATITUDE + "," + mark.C_VIEWGRADE + ")'>");
        			td1.append(mark.C_BOOKNAME);
        			tr.append(td1);
        			
        			var td2 = $("<td>");
        			// 删除
        	        $("<button onClick = 'delMark(" + mark.C_ID + ")'>")
        	            .attr('class', "mark-btn-b")
        	            .css("margin-left","6px")
        	            .append("删除")
        	            .appendTo(td2);
        	        // 编辑
        	    	$("<button onClick = 'editMark(" + mark.C_ID + ")'>")
        	            .attr('class', "mark-btn-b")
        	            .append("编辑")
        	            .appendTo(td2);
        	    	tr.append(td2);
                    divshow.append(tr);
        		}
        	}
        }
    })
}

function editMark(id){
    swal({
        title: "编辑书签",
        text: "修改书签名称",
        type: "input",
        showCancelButton:true,
        closeOnConfirm:false,
        confirmButtonText:"确认",
        cancelButtonText:"取消",
        animation: "slide-from-top",
        inputPlaceholder: "输入书签名称"
    },
    function (inputValue){
        if(inputValue){
        	var obj = {};
        	obj["search.C_ID*eq"] = id;
    		obj["C_BOOKNAME"] = inputValue;
    		$.post('/T_POWERBOOKMARK/update.action', obj, function(){
    			swal("书签修改成功",'',"success");
    			loadBookMark();
    		});
        }else if(queryField("T_POWERBOOKMARK", inputValue)){
        	swal("此书签名称已存在，请从新输入!",'',"warning");
		    return; 
        }else{
        	swal("书签名称不能为空!",'',"warning");
		    return;
        }
    });
}

function delMark(id){
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
    	$.post('/T_POWERBOOKMARK/delete.action', {"ID":id},
      		function(result){
  				if (result.success){ 
  					swal("删除成功！",'',"success");
  					loadBookMark();
  	            }else{
  	            	swal("删除失败！",'',"error");
  	            }
        	},'json'
    	)
	});
}

function addMark(){
	var mark = $("#bookmark").val();
	if (isEmpty(mark)) { 
	    swal("书签名称不能为空!",'',"warning");
	    return;
	}
	if(queryField("T_POWERBOOKMARK", mark)){
		swal("此书签名已存在，请从新输入!",'',"warning");
	    return; 
	}
	var view = map.getView(); 
	$.post('/T_POWERBOOKMARK/save.action',{
		'C_BOOKNAME': mark,
		'C_LONGITUDE': view.getCenter()[0],
		'C_LATITUDE': view.getCenter()[1],
		'C_VIEWGRADE': view.getZoom(),
		'C_ID':""
    },
	function(result){
	    if(result.success){
	    	swal("书签添加成功!", "新建书签为: " + mark, "success");
	    	$("#bookmark").val("");
	    	loadBookMark();
	    }
	},"json");	
}

function markFix(lon, lat, zoom){
	var du = [lon, lat];
	var view = map.getView();
	view.setCenter(du);
	view.setZoom(zoom);
}

function queryField(name){
	$.ajax({
		url:"/T_POWERBOOKMARK/search.action",
    	data:{"search.C_BOOKNAME*eq": name},
    	type:"post",
        dataType:"Json",
        async:false,
        success: function(data){
        	if (!$.isEmptyObject(data)) {
        		return false;
        	}else{
        		return true;
        	}
        }
    })
}
/************** 书签 END *****************/
function displayResult(item, val, text) {
    console.log(item);
//    $('.alert').show().html('You selected <strong>' + val + '</strong>: <strong>' + text + '</strong>');
}
function test() {
	queryWFSURL('SD_STATION');
//	$("#"+name+" img").attr("src","/images/img/"+name+"1.png");
//	map.getView().setZoom(30);
	/*map.getView().setCenter([ 114.31, 30.52 ]);
    map.render();*/

//    var asdsd = queryTableByData("SD_OPTICALCABLESECTION",{});
}