var map = ""; // openLayers地图
var boxExtent = ""; // 矩形、多边形查询的范围
var drawGeometry = ""; // 鼠标画几何图形对象
var highlightObj = []; // 查询后的高亮对象
var propertyListWindow = ""; // 查询结果弹出框对象
var selectEvent = "";
var editObject = {}; // 编辑对象
var attributeInfoObj = ""; // 属性信息弹窗对象
var geomObj = ""; // 测量时生成对象的图层
var measureTooltipElement = ""; // 度量工具提示元素.
var measureTooltip = ""; // 测量结果对象

$(function() {
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
	});

	$(".hamburgerimg").click(function() {
		$(".left_nav").css("display", "block");
		$(this).css("display", "none");
		$(".nav1").css("display", "none");
		$(".hamburger").css("display", "inline-block");
		$(".content-top").css("margin-left", "0px");
		$("#right-sidebar").css("margin-left", "0px");
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
	})

	$('.modal').on('show.bs.modal', function() {
		$(".modal-backdrop").remove();

	})
	$('.modal').on('shown.bs.modal', function() {
		index = $(".modal").index(this);
		$(this).modal('show');
		$(".modal").not($(".modal:eq(" + index + ")")).hide();
	})
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
	$(document)
			.on(
					"mousemove",
					function(e) {
						if (!dragModal.mouseDragDown
								|| dragModal.moveTarget == undefined)
							return;
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

});

// 初始化图层列表
function initLayerTree() {
	$('#powerLayerTree')
			.jstree(
					{
						"plugins" : [ "checkbox", "contextmenu", "wholerow" ],
						"checkbox" : {
							"whole_node" : false,
							"keep_selected_style" : false,
							"tie_selection" : false
						},
						"contextmenu" : {
							"show_at_node" : false,
							"items" : {
								"添加" : {
									"label" : "添加",
									"icon" : "/images/1_07.png",
									"action" : function(data) {
										clearOnMapEvent(); // 清除主动添加到地图上的事件
										var inst = jQuery.jstree
												.reference(data.reference);
										var obj = inst.get_node(data.reference);
										if (obj.children.length == 0
												&& obj.parent != "#") {
											// 获取当前图层及类型
											var layer = obj.original.layer;
											var type = layer.getSource()
													.getFeatures()[0]
													.getGeometry().getType()
													.toLowerCase();
											if (type == "point") {
												type = "Point";
											} else if (type == "linestring") {
												type = "LineString"
											}
											// 画矢量图形
											var draw = new ol.interaction.Draw(
													{
														source : layer
																.getSource(),
														geometryName : 'SHAPE',
														type : (type)
													});
											map.addInteraction(draw);
											draw
													.on(
															'drawend',
															function(e) {
																// 保存编辑数据
																editObject.feature = e.feature;
																editObject.source = layer
																		.getSource();
																editObject.editType = "add";
																editObject.layer_name = queryLayerNameByID(obj.id);
																// 弹出属性窗口
																jsPanelAttributeInfo();
																// 关闭draw事件
																map
																		.removeInteraction(draw);
															}, this);
										} else {
											swal('根节点不能添加!', '', "warning");
										}
									}
								},
								"修改" : {
									"label" : "修改",
									"action" : function(data) {
										clearOnMapEvent(); // 清除主动添加到地图上的事件
										var inst = jQuery.jstree
												.reference(data.reference), obj = inst
												.get_node(data.reference);
										// 获取当前图层和类型
										var layer = obj.original.layer;
										editObject.layer_name = queryLayerNameByID(obj.id);
										if (obj.children.length == 0
												&& obj.parent != "#") {
											var select = new ol.interaction.Select();
											var modify = new ol.interaction.Modify(
													{
														features : select
																.getFeatures()
													});
											map.addInteraction(select);
											select
													.on(
															'select',
															function(e) {
																if (e.selected[0] == undefined) {
																	modify
																			.setActive(true);
																} else if (e.selected[0].id_
																		.split(".")[0] != editObject.layer_name) {
																	modify
																			.setActive(false);
																} else {
																	modify
																			.setActive(true);
																	// 保存数据
																	editObject.feature = e.selected[0];
																	editObject.source = layer
																			.getSource();
																	editObject.editType = "update";
																	closeAttributeInfoObj();
																	jsPanelAttributeInfo();
																}
															});
											map.addInteraction(modify);
										} else {
											swal('根节点不能修改!', '', "warning");
										}
									}
								},
								"删除" : {
									"label" : "删除",
									"action" : function(data) {
										clearOnMapEvent(); // 清除主动添加到地图上的事件
										var inst = jQuery.jstree
												.reference(data.reference);
										var obj = inst.get_node(data.reference);
										if (obj.children.length == 0
												&& obj.parent != "#") {
											// 获取当前图层类型
											var layer_type = queryLayerNameByID(obj.id);
											var select = new ol.interaction.Select();
											map.addInteraction(select);
											select
													.on(
															'select',
															function(e) {
																if (select
																		.getFeatures()
																		.getArray().length == 0) {
																} else if (e.selected[0].id_
																		.split(".")[0] != layer_type) {
																	var name = getLayerNameTitle(layer_name);
																	swal(
																			'不能删除!',
																			'此数据不属于'
																					+ name
																					+ '图层',
																			"warning");
																} else {
																	swal(
																			{
																				title : "确定删除此数据？",
																				text : "删除后不可恢复,请谨慎操作!",
																				type : "warning",
																				showCancelButton : true,
																				confirmButtonColor : "#DD6B55",
																				confirmButtonText : "确定",
																				cancelButtonText : "取消",
																				closeOnConfirm : false
																			},
																			function(
																					isConfirm) {
																				if (isConfirm) {
																					// 获取当前图层
																					var layer = obj.original.layer;
																					editWFSFeature(
																							e.target
																									.getFeatures()
																									.getArray(),
																							'delete',
																							layer_type);
																					layer
																							.getSource()
																							.removeFeature(
																									e.target
																											.getFeatures()
																											.getArray()[0]);
																					e.target
																							.getFeatures()
																							.clear();
																					map
																							.removeInteraction(select);
																					swal(
																							"删除成功",
																							'',
																							"success");
																				} else {
																					map
																							.removeInteraction(select);
																				}

																			});

																}
															});

										} else {
											swal('根节点不能删除!', '', "warning");
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
						var nodeLayer = $('#powerLayerTree').jstree().get_node(
								"#" + id);
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

	// 图层tree绑定单击事件 定位到图层场景
	$('#powerLayerTree').bind('select_node.jstree', function(event, data) {
		if (data.node.children.length == 0) {
			// 定位到添加的图层位置
			var bbox = data.node.original.bounds.split(',');
			map.getView().fit(bbox, map.getSize());
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
	$
			.ajax({
				// 请求地址
				url : "/T_POWERLAYERS/search.action",
				data : {
					"sort.C_ID" : 'DESC'
				},// 设置请求参数
				type : "post",// 请求方法
				async : false,
				dataType : "json",// 设置服务器响应类型
				// success：请求成功之后执行的回调函数 data：服务器响应的数据
				success : function(data) {
					var bounds = [ 115.902731511993, 39.5010013847293,
							117.174121256339, 40.0926220582295 ];
					var layers = [];
					var treeId = 0;
					var gaodeMapLayer = new ol.layer.Tile(
							{
								source : new ol.source.XYZ(
										{
											url : 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
										})
							});
					layers.push(gaodeMapLayer);
					for ( var i in data) {
						// 只加载默认图层在地图上
						if (data[i].C_ISDEFAULTLAYER == "1"
								&& data[i].C_ISSHOW == "1") {
							// bounds = data[i].C_BBOX;
							var wfsParams = {
								service : 'WFS',
								version : '1.1.0',
								request : 'GetFeature',
								typeName : data[i].C_LAYER, // 图层名称，可以是单个或多个
								outputFormat : 'application/json'// 'text/javascript',
																	// //重点，不要改变
							};
							var vector_Source = new ol.source.Vector({
								wrapX : false,
								format : new ol.format.GeoJSON(),
								url : data[i].C_LAYERURL + '?'
										+ $.param(wfsParams),
								// url:'http://172.16.15.147:8080/geoserver/anqing/wfs?'+
								// $.param(wfsParams),
								strategy : ol.loadingstrategy.bbox,
								projection : 'EPSG:4326'
							});
							var layer = new ol.layer.Vector({
								source : vector_Source

							});
							layers.push(layer);
							treeNodes[treeId] = {
								text : data[i].C_LAYERNAME,
								id : data[i].C_ID,
								layer : layer,
								bounds : data[i].C_BBOX,
								icon : "glyphicon glyphicon-file",
								state : {
									checked : true
								}
							}
							treeId++;
						}
					}
					var projection = new ol.proj.Projection({
						code : 'EPSG:4326',
						units : 'm',
						axisOrientation : 'neu',
						global : false
					});

					// 初始化地图
					map = new ol.Map({
						controls : ol.control.defaults({
							attribution : false,
							zoom : false
						}).extend([]),
						target : 'openlayersID',
						projection : 'EPSG:4326',
						layers : layers,
						view : new ol.View({
							projection : projection,
							// 限制地图缩放最大级别为14，最小级别为10
							minZoom : 6,
							maxZoom : 35
						})
					});
					// 禁用双击地图放大功能
					map
							.getInteractions()
							.getArray()
							.forEach(
									function(interaction) {
										if (interaction instanceof ol.interaction.DoubleClickZoom) {
											map.removeInteraction(interaction);
										}
									});

					map.getView().fit(bounds, map.getSize());

				}
			});
	powerLayerTree.children = treeNodes;
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
	clearMeasureObj();
	clearDrawGeometry();
	$('#measuretext').html("");
	// 添加一个绘制的线使用的layer
	geomObj = new ol.layer.Vector({
		source : new ol.source.Vector(),
		style : new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : '#ffcc33',
				size : 2
			})
		})
	});
	map.addLayer(geomObj);
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

	var results = ""; // 测量结果
	var listener = ""; //
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
			measureTooltip.setPosition(tooltipCoord);
		});
	}, this);

	drawGeometry.on('drawend', function(event) {
		measureTooltipElement.className = 'tooltip tooltip-static';
		measureTooltip.setOffset([ 0, -7 ]);
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
 * 创建显示结果的提示工具
 */
function createMeasureTooltip() {
	if (measureTooltipElement) {
		measureTooltipElement.parentNode.removeChild(measureTooltipElement);
	}
	measureTooltipElement = document.createElement('div');
	measureTooltipElement.className = 'tooltip tooltip-measure';
	measureTooltip = new ol.Overlay({
		element : measureTooltipElement,
		offset : [ 0, -15 ],
		positioning : 'bottom-center'
	});
	map.addOverlay(measureTooltip);
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
	var geodesic = false; // true:计算平面距离；false:计算球面距离
	if (geodesic) {
		var coordinates = line.getCoordinates();
		length = 0;
		var sourceProj = map.getView().getProjection();
		var wgs84Sphere = new ol.Sphere(6378137);
		for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
			var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
			var c2 = ol.proj.transform(coordinates[i + 1], sourceProj,
					'EPSG:4326');
			length += wgs84Sphere.haversineDistance(c1, c2);
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
	var geodesic = false; // true:计算平面面积；false:计算球面面积
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
	if (measureTooltip != "") {
		map.removeOverlay(measureTooltip);
		measureTooltip = "";
	}
}

// 删除测量对象
function clearMeasureObj() {
	if (geomObj != "") {
		map.removeLayer(geomObj);
		geomObj = "";
	}

	if (measureTooltip != "") {
		map.removeOverlay(measureTooltip);
		measureTooltip = "";
	}

}
// 清除主动添加到地图的事件（画、选择、移动）
function clearOnMapEvent() {
	var events = map.getInteractions().getArray();
	for (var i = 0; i < events.length; i++) {
		var e = events[i];
		if (e instanceof ol.interaction.Draw
				|| e instanceof ol.interaction.Select
				|| e instanceof ol.interaction.Modify) {
			map.removeInteraction(e);
			--i;
		}
	}
}

// 放大地图
function zoomInMap() {
	var view = map.getView();
	// 让地图的zoom增加1，从而实现地图放大
	view.setZoom(view.getZoom() + 1);
}

// 缩小地图
function zoomOutMap() {
	var view = map.getView();
	// 让地图的zoom减小1，从而实现地图缩小
	view.setZoom(view.getZoom() - 1);
}

// 框选放大/缩小
function right_click_box(number) {
	closeFunction();
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

// 单选查询
function radioQuery() {
	closeFunction();
	// 定义select控制器
	var select = new ol.interaction.Select();
	map.addInteraction(select);// map加载该控件，默认是激活可用的
	select.on('select', function(e) {
		if (e.selected.length > 0) {
			openDialg("/attributeList/attributeList.action", "查询结果",
					"radioQuery", e.selected);
			map.removeInteraction(select);
		}
	});

}

function openDialg(url, title, field, dataFeatures) {

	propertyListWindow = $.jsPanel({
		id : "openDialg",
		maximizedMargin : {
			top : 100,
			left : 170
		},
		position : 'center',
		theme : "rebeccapurple",
		contentSize : {
			width : 'auto',
			height : 'auto'
		},
		headerTitle : title,
		border : '2px solid rgb(7,102,104)',
		contentAjax : {
			url : url,
			autoload : true,
			done : function(data, textStatus, jqXHR, panel) {
				// 图层tree根节点
				var root = $('#powerLayerTree').jstree().get_node("#-1");
				var childrens = $('#powerLayerTree').jstree("get_children_dom",
						root);

				$('#assemblageQueryOptions1').hide();
				$('#assemblageQueryOptions2').hide();
				if (field == 'radioQuery') {
					// 获取查询图层类型
					var layerType = dataFeatures[0].id_.split('.');
					// 展示数据
					displayData(dataFeatures, layerType[0]);

				} else if (field == 'boxQuery' || field == 'polygonQuery') {
					$("#powLayes1").empty();
					$("#powLayes1").append("<option value=''>请选择图层</option>");
					for (var i = 0; i < childrens.length; i++) {
						var node = $('#powerLayerTree').jstree().get_node(
								childrens[i].id);
						$("#powLayes1").append(
								"<option value='" + node.original.id + "'>"
										+ node.original.text + "</option>");
					}
					$('#assemblageQueryOptions1').show();
				}/*
					 * else if(field == 'assemblageQuery'){
					 * $("#powLayes2").empty(); $("#powLayes2").append("<option
					 * value=''>请选择图层</option>"); for(var i=0;i<childrens.length;i++){
					 * var
					 * node=$('#powerLayerTree').jstree().get_node(childrens[i].id);
					 * $("#powLayes2").append("<option
					 * value='"+node.original.id+"'>"+node.original.text+"</option>"); }
					 * $('#assemblageQueryOptions2').show(); }
					 */
				$('#search').modal('hide');// 隐藏查询模态框
			}
		},
		callback : function(panel) {
			this.content.css("padding", "5px");
		}
	});
}
// 框选、多边形查询
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
		sketch = null;
		clearDrawGeometry();
		openDialg("/attributeList/attributeList.action", "查询结果", "boxQuery");
		ol.Observable.unByKey(listener);
	}, this);

}

// 多边形查询
function polygonQuery() {
	closeFunction();
	drawGeometry = new ol.interaction.Draw({
		source : new ol.source.Vector(),
		type : /** @type {ol.geom.GeometryType} */
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
		/** @type {ol.Coordinate|undefined} */
		var coord = evt.coordinate;
		listener = sketch.getGeometry().on('change', function(evt) {
			var geom = evt.target;
			if (geom instanceof ol.geom.Polygon) {
				var extent = geom.getExtent();
				boxExtent = extent;
			}
		});
	}, this);

	drawGeometry.on('drawend',
			function(event) {
				sketch = null;
				clearDrawGeometry();
				openDialg("/attributeList/attributeList.action", "查询结果",
						"polygonQuery");
				ol.Observable.unByKey(listener);
			}, this);
}

// 更改图层下拉框后查询属性
function changeLayer(id) {
	clearHighlightObj();
	if (id != "") {
		var node = $('#powerLayerTree').jstree().get_node(id);
		var vector_Source = node.original.layer.getSource();
		$('#filterFieldOptions').show();
		var feature = vector_Source.getFeatures()[0];
		// 获取查询图层类型
		var layerTable = feature.id_.split('.');
		$("#filterField").empty();
		$.ajax({
			// 请求地址
			url : "/" + layerTable[0] + "/querySpatialTableField.action",
			data : {},// 设置请求参数
			type : "post",// 请求方法
			async : false,
			dataType : "json",// 设置服务器响应类型
			// success：请求成功之后执行的回调函数 data：服务器响应的数据
			success : function(data) {
				$("#filterField").append("<option value=''>请选择字段</option>");
				for ( var i in data) {
					if (data[i].FIELD != null && data[i].VALUE != "ID"
							&& data[i].VALUE != "OBJECTID") {
						$("#filterField").append(
								"<option value='" + data[i].VALUE + "'>"
										+ data[i].FIELD + "</option>");
					}
				}
			}
		});

	}
}
// 更改图层下拉框后查询属性
function changeFilterField(fieldValue) {
	if (fieldValue != "请选择字段") {
		if (fieldValue.indexOf("(") > 0) {
			fieldValue = fieldValue.substring(0, fieldValue.indexOf("("));
		}
		var data = queryEnumerateByField(fieldValue);
		if (data != "" && data != null) {
			$('#filterFieldInput').hide();
			$('#filterFieldSelect').show();
			$("#filterFieldSelectValue").empty();
			$("#filterFieldSelectValue").append(
					"<option value=''>请选择字段</option>");
			for (var i = 0; i < data.length; i++) {
				$('#filterFieldSelectValue').append(
						"<option value=" + data[i].C_VALUE + ">"
								+ data[i].C_NAME + "</option>");
			}

		} else {
			$('#filterFieldSelect').hide();
			$('#filterFieldInput').show();
		}
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

// 框选和多边形弹窗中的查询按钮
function queryFeature() {
	var id = $('#powLayes1').val();
	if (id == "") {
		$('#powLayes2').focus();
		swal('请先选择要查询的图层！', '', "warning");
	} else {
		// 获取过滤字段结果
		var field = $('#filterField option:selected').text();
		if (field.indexOf("(") > 0) {
			field = field.substring(0, field.indexOf("("));
		}
		// 根据过滤字段查询后面是文本框还是下拉框，并获取其结果
		var value = "", valueId = "";
		var data = queryEnumerateByField(field);
		if (data == "") {
			value = $('#filterFieldInputValue').val();
			valueId = '#filterFieldInputValue';
		} else {
			value = $('#filterFieldSelectValue').val();
			valueId = '#filterFieldSelectValue';
		}
		if (field != "请选择字段" && value == "") {
			$(valueId).focus();
			swal('请给过滤字段相应的值！', '', "warning");
		} else {
			// $(".modal-content").mLoading("show");
			// var node=$('#powerLayerTree').jstree().get_node(id);
			// var vector_Source = node.original.layer.getSource();
			// selectEvent = new ol.interaction.Select();
			// map.addInteraction(selectEvent);
			// highlightObj = selectEvent.getFeatures();
			var filterValue = value == "" ? "*" : value;
			var layer_name = queryLayerNameByID(id);
			var featureNS = "http://" + queryWFSURL() + "/pipeline";
			var featureRequest = new ol.format.WFS().writeGetFeature({
				srsName : 'EPSG:4326',
				// featureNS: 'http://172.16.15.147:8080/pipeline',
				featureNS : featureNS,
				featurePrefix : 'osm',
				featureTypes : [ layer_name ],
				outputFormat : 'application/json',
				geometryName : "the_geom",
				filter : ol.format.filter.and(
				// ol.format.filter.equalTo('QSDW', '*'),
				ol.format.filter.bbox('the_geom', boxExtent, 'EPSG:2439'),
						ol.format.filter.like($('#filterField').val(),
								filterValue))
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
					$(".modal-content").mLoading("hide");
					swal('没有查到符合条件的数据', '', "warning");
					$('#wfsFeatureTable').bootstrapTable('removeAll');
				} else {
					// 获取查询图层类型
					var layerType = features[0].id_.split('.');
					displayData(features, layerType[0]);
					$(".modal-content").mLoading("hide");
				}
			});

			/*
			 * var timingFunction=setInterval(function(){ var
			 * selectedFeatures=[];
			 * vector_Source.forEachFeatureInExtent(boxExtent, function(feature) {
			 * selectedFeatures.push(feature); highlightObj.push(feature); });
			 * if(selectedFeatures.length==0){ clearInterval(timingFunction);
			 * $(".modal-content").mLoading("hide");
			 * swal('没有查到符合条件的数据','',"warning");
			 * $('#wfsFeatureTable').bootstrapTable('removeAll'); }else{
			 * //获取查询图层类型 var layerType = selectedFeatures[0].id_.split('.');
			 * displayData(selectedFeatures,layerType[0]);
			 * $(".modal-content").mLoading("hide"); } //关闭定时函数
			 * clearInterval(timingFunction); },1000);
			 */
		}
	}

}

// 将数据在table中显示
function displayData(features, layerType) {
	// 销毁查询结果 bootstrapTable
	$('#wfsFeatureTable').bootstrapTable('destroy');
	var columns = [];
	switch (layerType) {
	case "SD_STATION": // 局站
		columns = [ {
			field : 'ID',
			title : '编码',
			align : 'center',
			valign : 'top',
			sortable : true,
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
			field : '操作',
			title : '操作',
			align : 'center',
			valign : 'middle',
			sortable : true,
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
			field : '操作',
			title : '操作',
			align : 'center',
			valign : 'middle',
			sortable : true,
			events : operateEventsFeature,// 给按钮注册事件
			formatter : operateFormatterFeature
		// 表格中增加按钮
		} ];
		break;
	case "SD_COMMUNICATIONPOLETOWER": // '通信杆塔':
		columns = [ {
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
			field : '操作',
			title : '操作',
			align : 'center',
			valign : 'middle',
			sortable : true,
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
			field : '操作',
			title : '操作',
			align : 'center',
			valign : 'middle',
			sortable : true,
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
			field : '操作',
			title : '操作',
			align : 'center',
			valign : 'middle',
			sortable : true,
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
				return row.values_.STARTID;
			}
		}, {
			field : 'ENDID',
			title : '终点',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return row.values_.ENDID;
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
			field : '操作',
			title : '操作',
			align : 'center',
			valign : 'middle',
			sortable : true,
			events : operateEventsFeature,// 给按钮注册事件
			formatter : operateFormatterFeature
		// 表格中增加按钮
		} ];
		break;
	case "SD_CABLEDUCT": // '电缆管道':
		columns = [ {
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
			field : '操作',
			title : '操作',
			align : 'center',
			valign : 'middle',
			sortable : true,
			events : operateEventsFeature,// 给按钮注册事件
			formatter : operateFormatterFeature
		// 表格中增加按钮
		} ];
		break;
	case "SD_CABLETRENCH": // '电缆沟':
		columns = [ {
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
			field : '操作',
			title : '操作',
			align : 'center',
			valign : 'middle',
			sortable : true,
			events : operateEventsFeature,// 给按钮注册事件
			formatter : operateFormatterFeature
		// 表格中增加按钮
		} ];
		break;
	case "SD_CABLETUNNEL": // '电缆隧道':
		columns = [ {
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
			field : '操作',
			title : '操作',
			align : 'center',
			valign : 'middle',
			sortable : true,
			events : operateEventsFeature,// 给按钮注册事件
			formatter : operateFormatterFeature
		// 表格中增加按钮
		} ];
		break;
	default:
		break;
	}
	$('#wfsFeatureTable').bootstrapTable({
		data : features,
		method : 'post',
		striped : true,
		dataType : "json",
		pagination : true,
		queryParamsType : "limit",
		singleSelect : false,
		contentType : "application/x-www-form-urlencoded",
		pageSize : 10,
		pageNumber : 1,
		showColumns : false, // 不显示下拉框（选择显示的列）
		sidePagination : "client",
		queryParams : queryParams,// 分页参数
		// clickToSelect: true,
		// height: 480,
		columns : columns
	});
}
// bootstrap table操作按钮 （查询结果表）
window.operateEventsFeature = {
	'click .RoleOfdDeldte' : function(e, value, row, index) {
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
				// 获取当前图层
				// var layer = obj.original.layer;
				// editWFSFeature(e.target.getFeatures().getArray(),'delete',layer_type);
				// layer.getSource().removeFeature(e.target.getFeatures().getArray()[0]);
				// e.target.getFeatures().clear();
				swal("删除成功", '', "success");
			}
		});
	},
	'click .RoleOfEdit' : function(e, value, row, index) {
		rowData = row;
		// $(this).css("background","#308374");
		// openEquipmentDailog('/equipment/equipmentAdd.action','设备信息');
	},
	'click .RoleOfPosition' : function(e, value, row, index) {
		// 将jspanel弹窗缩成一行
		propertyListWindow.smallify();
		var feature = row;
		clearHighlightObj();
		selectEvent = new ol.interaction.Select();
		map.addInteraction(selectEvent);
		// 设置要素高亮
		highlightObj = selectEvent.getFeatures();
		highlightObj.push(feature);
		// 获取要素的几何范围
		var extent = feature.getGeometry().getExtent();
		map.getView().fit(extent, map.getSize());
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
	return [
			'<button class="RoleOfEdit btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="修改"><span  class=" glyphicon glyphicon-edit " ><span></button>',
			'<button class="RoleOfdDeldte  btn btn-sm rolebtn" style=" background: none;outline:none;color:red" title="删除"><span  class=" glyphicon glyphicon-trash " ><span></button>',
			'<button class="RoleOfPosition  btn btn-sm rolebtn" style="background: none;outline:none;color: #bf824c" title="定位"><span  class=" glyphicon glyphicon-record  " ><span></button>'

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

// 根据id查询图层名称
function queryLayerNameByID(id) {
	var layer_name = "";
	$.ajax({
		// 请求地址
		url : "/T_POWERLAYERS/search.action",
		data : {
			"search.C_ID*eq" : id
		},// 设置请求参数
		type : "post",// 请求方法
		async : false,
		dataType : "json",// 设置服务器响应类型
		// success：请求成功之后执行的回调函数 data：服务器响应的数据
		success : function(data) {
			if (data != "") {
				var layer = data[0].C_LAYER;
				layer_name = layer.substring(layer.indexOf(':') + 1);
			}
		}
	});
	return layer_name;
}

// 根据id查询图层名称
function queryWFSURL() {
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
			if (data != "") {
				url = data[0].C_LAYERURL;
			}
		}
	});
	var wfsURL = url.split("/")[2];
	return wfsURL;
}

// 弹出属性字段信息框
function jsPanelAttributeInfo() {
	var name = editObject.layer_name.toLowerCase();
	var url = "/" + name + "/" + name + ".action";
	var title = getLayerNameTitle(editObject.layer_name) + "数据属性";
	attributeInfoObj = $
			.jsPanel({
				id : "attributeInfo",
				headerControls : {
					controls : "closeonly"
				},
				position : {
					right : 20,
					top : 100
				},
				theme : "rebeccapurple",
				// paneltype: 'modal',
				contentSize : 'auto auto',
				// contentSize: {width: width, height: height},
				headerTitle : title,
				contentAjax : {
					url : url,
					autoload : true,
					done : function(data, textStatus, jqXHR, panel) {
						// 图层tree根节点
						// var root
						// =$('#powerLayerTree').jstree().get_node("#-1");
						// var childrens =
						// $('#powerLayerTree').jstree("get_children_dom",root);
						if (editObject.editType == "add") {
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
							for ( var id in feature) {
								if (id != "geometry"
										&& id != "ID"
										&& document.getElementById(id).type == "select-one") {
									$('#' + id)
											.selectpicker('val', feature[id]);
								} else {
									$('#' + id).val(feature[id]);
								}
							}
						}
					}
				},
				callback : function(panel) {
					// this.content.css("padding", "15px");

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

// 根据数据库表名获取图层中文名
function getLayerNameTitle(layer_name) {
	var value = "";
	switch (layer_name) {
	case "SD_STATION": // 局站
		value = "局站";
		break;
	case "SD_JUNCTIONBOX": // '接头盒'
		value = "接头盒";
		break;
	case "SD_COMMUNICATIONPOLETOWER": // '通信杆塔'
		value = "通信杆塔";
		break;
	case "SD_PERSONWELL": // '人井'
		value = "人井";
		break;
	case "SD_RESIDUALCABLE": // '余缆'
		value = "余缆";
		break;
	case "SD_OPTICALCABLESECTION": // '光缆段'
		value = "光缆段";
		break;
	case "SD_CABLEDUCT": // '电缆管道'
		value = "电缆管道";
		break;
	case "SD_CABLETRENCH": // '电缆沟'
		value = "电缆沟";
		break;
	case "SD_CABLETUNNEL": // '电缆隧道'
		value = "电缆隧道";
		break;
	default:
		break;
	}
	return value;
}

// 取消保存
function unSaveFeature() {
	clearOnMapEvent();// 清除主动添加到地图上的事件
	if (editObject.editType == "add") {
		var source = editObject.source;
		source.removeFeature(editObject.feature);
	}
	if (editObject != "") {
		editObject = {};
	}
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
	if (editObject != "") {
		var featureType = editObject.layer_name;
		var editType = editObject.editType;
		var fea = editObject.feature;

		// 获取属性字段的json
		var attributeJson = getFormJson(featureType.toLowerCase() + "_form");
		// 设置feature对应的属性
		for ( var field in attributeJson) {
			// 如果输入内容为空，将其改为null
			if (attributeJson[field] == "") {
				fea.set(field, null);
			} else {
				fea.set(field, attributeJson[field]);
			}
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

		if (editType == "add") {
			// 设置featureID
			setFeatureID(feature, featureType);
		} else if (editType == "update") {
			feature.setId(editObject.feature.getId()); // 注意ID是必须，通过ID才能找到对应修改的feature

			// 此处需要将原有的geometry空间字段删除，否则提交不成功，如果服务空间表空间就是geometry，则不需要处理
			feature.unset(feature.getGeometryName());
			// 设置空间字段名，以wfs服务为准
			// feature.setGeometryName('SHAPE');
			// feature.setGeometry(geo);
		}
		feature.set('SHAPE', geo);
		editWFSFeature([ feature ], editType, featureType);
		editObject = {};
		// 关闭属性弹窗
		closeAttributeInfoObj();
		$("#attributeInfo").mLoading("hide");

	}

}

// 将序列化对象转成json
function getFormJson(form) {
	var o = {};
	var a = $("#" + form).serializeArray();
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
	var WFSTSerializer = new ol.format.WFS({
		featureNS : "http://172.16.15.147:8080/anqing",
		featureType : "anqing:" + featureType,
		version : '2.0.0'
	});
	var featObject;
	if (editType == 'add') {
		featObject = WFSTSerializer.writeTransaction(features, null, null, {
			featureNS : 'http://172.16.15.147:8080/anqing',// 为创建工作区时的命名空间URI
			featurePrefix : "anqing",
			version : '2.0.0',
			featureType : featureType, // feature对应图层
			srsName : 'EPSG:4326'// 坐标系
		});
	} else if (editType == 'update') {
		featObject = WFSTSerializer.writeTransaction(null, features, null, {
			featureNS : 'http://172.16.15.147:8080/anqing',// 为创建工作区时的命名空间URI
			featurePrefix : "anqing",// 作为前缀
			featureType : featureType,
			version : '2.0.0',
			srsName : 'EPSG:4326'// 坐标系
		});
	} else if (editType == 'delete') {
		featObject = WFSTSerializer.writeTransaction(null, null, features, {
			featureNS : 'http://172.16.15.147:8080/anqing',// 为创建工作区时的命名空间URI
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
	request.open('POST', 'http://172.16.15.147:8080/geoserver/wfs?service=wfs');
	request.setRequestHeader('Content-Type', 'text/xml');
	request.send(featString);
	// 刷新
	// editObject.source.refresh();
	// 重新渲染地图
	map.render();
	swal("保存成功", '', "success");
}

function test() {
	map.getView().setZoom(30);
	map.getView().setCenter([ 114.31, 30.52 ]);
	// map.getView().setCenter(ol.proj.fromLonLat([-72.980624870461128,
	// 48.161307640513321]));

}