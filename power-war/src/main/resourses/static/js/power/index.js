var map = ""; // openLayers地图
var boxExtent = ""; // 矩形、多边形查询的范围
var drawGeometry = ""; // 鼠标画几何图形对象
var highlightObj = []; // 查询后的高亮对象
var propertyListWindow = ""; // 查询结果弹出框对象
var selectEvent = "";
var editObject = {}; // 编辑对象
var attributeInfoObj = ""; // 属性信息弹窗对象
var layerData = {}; // 保存图层属性表数据
var layerDatafield = ""; // 
var geomObj = ""; // 测量时生成对象的图层
var measureTooltipElement = ""; // 度量工具提示元素.
var measureTooltip = ""; // 测量结果对象
var index=""; //导航

$(function() {
	var mapWidth = document.documentElement.clientWidth;
	var mapHeight = document.documentElement.clientHeight;
	document.getElementById("openlayersID").style.width= mapWidth-160 +"px";
	document.getElementById("openlayersID").style.height= mapHeight-100 +"px";
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
	});

	$(".hamburgerimg").click(function() {
		$(".left_nav").css("display", "block");
		$(this).css("display", "none");
		$(".nav1").css("display", "none");
		$(".hamburger").css("display", "inline-block");
		$(".content-top").css("margin-left", "0px");
		$("#right-sidebar").css("margin-left", "0px");
		document.getElementById("openlayersID").style.width= mapWidth-160 +"px";
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
//	$('.modal').on('shown.bs.modal', function() {
//		index = $(".modal").index(this);
//		$(this).modal('show');
//		$(".modal").not($(".modal:eq(" + index + ")")).hide();
//	})
	
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
	$.fn.serializeJson=function(){  
        var serializeObj={};  
        var array=this.serializeArray();  
        var str=this.serialize();  
        $(array).each(function(){  
            if(serializeObj[this.name]){  
                if($.isArray(serializeObj[this.name])){  
                    serializeObj[this.name].push(this.value);  
                }else{  
                    serializeObj[this.name]=[serializeObj[this.name],this.value];  
                }  
            }else{  
                serializeObj[this.name]=this.value;   
            }  
        });  
        return serializeObj;  
    };  
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
	$(document).on(
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
											var layer= obj.original.layer;
											var layerName = obj.original.name;
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
																// 弹出属性窗口
																jsPanelAttributeInfo();
																// 关闭draw事件
																map.removeInteraction(draw);
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
										var layer_name = obj.original.name;
										if (obj.children.length == 0
												&& obj.parent != "#") {
											var select = new ol.interaction.Select();
											var modify = new ol.interaction.Modify(
													{
														features : select.getFeatures()
													});
											map.addInteraction(select);
											select.on('select',function(e) {
												// 获取查询图层类型
//												var code = e.selected[0].values_.ID.substring(0,4);
												var sdsdsd = e.selected[0].id_.split(".");
												var layerType = queryLayerNameByPMSID(sdsdsd[0]);
																if (e.selected[0] == undefined) {
																	modify.setActive(true);
																} else if (layerType != layer_name) {
																	modify.setActive(false);
																} else {
																	modify.setActive(true);
																	// 保存数据
																	editObject.feature = e.selected[0];
																	editObject.source = layer.getSource();
																	editObject.editType = "update";
																	editObject.layer_name = layer_name;
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
											var layer_type = obj.original.name;
											var select = new ol.interaction.Select();
											map.addInteraction(select);
											select.on('select',function(e) {
												// 获取当前图层名
												var code = e.selected[0].values_.ID.substring(0,4);
												var type = queryLayerNameByPMSID(code);
												if (select.getFeatures().getArray().length == 0) {
												} else if (type != layer_type) {
													var name = getLayerNameTitle(type);
													swal('不能删除!','此数据不属于'+ name+ '图层',"warning");
												} else {
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
															// 获取当前图层
															var layer = obj.original.layer;
															editWFSFeature(
																	e.target.getFeatures().getArray(),
																	'delete',
																	layer_type);
															layer.getSource().removeFeature(e.target.getFeatures()
																					.getArray()[0]);
															e.target.getFeatures().clear();
															map.removeInteraction(select);
															swal("删除成功",'',"success");
														} else {
															map.removeInteraction(select);
														}

													});		

												}
											});				

										} else {
											swal('根节点不能删除!', '', "warning");
										}
									}
								},
								"属性表" : {
									"label" : "属性表",
									"action" : function(data) {
										clearOnMapEvent(); // 清除主动添加到地图上的事件
										var inst = jQuery.jstree.reference(data.reference);
										var obj = inst.get_node(data.reference);
										if (obj.children.length == 0 && obj.parent != "#") {
											var features = obj.original.layer.getSource().getFeatures();
											if(features.length == 0){
												swal('此图层没有数据!', '', "warning");
											}else{
												layerData.features = features;
												var layerName = obj.original.name;
												openDialg("/attributeList/attributeList.action", obj.text+"表信息","queryAll", features,layerName);
											}
										} else {
											swal('根节点不能定位!', '', "warning");
										}
									}
								},
/*								"定位" : {
									"label" : "定位",
									"action" : function(data) {
										clearOnMapEvent(); // 清除主动添加到地图上的事件
										var inst = jQuery.jstree
										.reference(data.reference);
										var obj = inst.get_node(data.reference);
										if (obj.children.length == 0 && obj.parent != "#") {
											// 定位到添加的图层位置
											var bbox = obj.original.bounds.split(',');
											map.getView().fit(bbox, map.getSize());
										} else {
											swal('根节点不能定位!', '', "warning");
										}
									}
								},
*/							}
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
					var treeId = data.length-1;
					var gaodeMapLayer = new ol.layer.Tile(
							{
								source : new ol.source.XYZ(
										{
											url : 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
										})
							});
					layers.push(gaodeMapLayer);
					for ( var i in data) {
						//只加载默认图层在地图上
						if (data[i].C_ISDEFAULTLAYER == "1"
								&& data[i].C_ISSHOW == "1") {
							//					bounds = data[i].C_BBOX;
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
							treeId--;
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
						           new ol.control.MousePosition(), //鼠标位置
						            new ol.control.OverviewMap(),  //鸟瞰图控件
						            new ol.control.ScaleLine(),  //比例尺
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
//				color : '#ffcc33',
				color : 'red',
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

function openDialg(url, title, field, dataFeatures,layerName) {
	closePropertyListWindow();
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
				$('#queryAllOptions').hide();
				if (field == 'radioQuery') {
					// 获取查询图层类型
					var code = dataFeatures[0].values_.ID.substring(0,4);
					var layerType = queryLayerNameByPMSID(code);
					// 展示数据
					displayData(dataFeatures, layerType);

				} else if (field == 'boxQuery' || field == 'polygonQuery') {
					$('#assemblageQueryOptions1').show();
					$("#powLayes1").empty();
					$("#powLayes1").append("<option value=''>请选择图层</option>");
					for (var i = 0; i < childrens.length; i++) {
						var node = $('#powerLayerTree').jstree().get_node(childrens[i].id);
						$("#powLayes1").append("<option value='" + node.original.id + "'>"+ node.original.text + "</option>");
					}
				}else if(field == 'queryAll'){
					$('#queryAllOptions').show();
					var layerTable = layerName;
					$("#filterField2").empty();
					$.ajax({
						// 请求地址
						url : "/" + layerTable + "/querySpatialTableField.action",
						data : {},// 设置请求参数
						type : "post",// 请求方法
						async : false,
						dataType : "json",// 设置服务器响应类型
						// success：请求成功之后执行的回调函数 data：服务器响应的数据
						success : function(data) {
							$("#filterField2").append("<option value=''>请选择字段</option>");
							for ( var i in data) {
								if (data[i].FIELD != null && data[i].VALUE != "ID"
										&& data[i].VALUE != "OBJECTID") {
									$("#filterField2").append(
											"<option value='" + data[i].VALUE + "'>"+ data[i].FIELD + "</option>");
								}
							}
						}
					});
					
					// 展示数据
					displayData(dataFeatures, layerTable);
			     }
					 
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
//			var field =  $('#filterField').val();
			var filterField = field == "请选择字段" ? "ID" : $('#filterField1').val();
			var nodeLayer = $('#powerLayerTree').jstree().get_node("#" + id);
			var layer_name = nodeLayer.original.name;
			var featureNS = "http://" + queryWFSURL() + "/anqing";
			var featureRequest = new ol.format.WFS().writeGetFeature({
				srsName : 'EPSG:4326',
				// featureNS: 'http://172.16.15.147:8080/pipeline',
//				featureNS : featureNS,
				featurePrefix : 'anqing',
				featureTypes : [ layer_name ],
				outputFormat : 'application/json',
				geometryName : "the_geom",
				filter : ol.format.filter.and(
				// ol.format.filter.equalTo('QSDW', '*'),
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
// 属性表中的查询按钮
function queryClientFeature() {
	// 获取过滤字段结果
	var field = $('#filterField2 option:selected').text();
	var value = "";valueID="";
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
	
		// 获取查询图层类型
		var code = layerData.features[0].values_.ID.substring(0,4);
		var layerType = queryLayerNameByPMSID(code);
		var columns = getColumnsBylayerType(layerType);
		
		$(".table-content").mLoading("show");
		var featureNS = "http://" + queryWFSURL() + "/anqing";
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
				return formatterfeatureName(row.values_.STARTID);
			}
		}, {
			field : 'ENDID',
			title : '终点',
			align : 'center',
			valign : 'top',
			sortable : true,
			formatter : function(value, row, index) {
				return formatterfeatureName(row.values_.ENDID);
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
//		search:true,
		// clickToSelect: true,
		// height: 480,
		columns : columns
	});
}

//根据feature ID格式化 feature名称
function formatterfeatureName(id){
	var name = null;
	if(id == null){
		return name;
	}
	// 获取查询图层类型
	var code = id.substring(0,4);
	var layer_type = queryLayerNameByPMSID(code);
	//根据图层名获取对应layertree的Id
	var layertreeID = queryIdByLayerName(layer_type);
	//根据 layertree的Id获取节点对象
	 var node=$('#powerLayerTree').jstree().get_node("#"+layertreeID);
	 var features = node.original.layer.getSource().getFeatures();
	 for(var i in features){
		 if(features[i].values_.ID == id){
			 name = features[i].values_.NAME;
			 break;
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
				//根据图层名获取对应layertree的Id
				var id = queryIdByLayerName(layer_type);
				//根据 layertree的Id获取节点对象
				 var node=$('#powerLayerTree').jstree().get_node("#"+id);
				 var layer = node.original.layer;

				 editObject.editType = "delete";
				 //删除数据库Feature
				 editWFSFeature([row],'delete',layer_type);
				 //删除地图上的Feature
				 layer.getSource().removeFeature(row);
				 //删除bootstrapTable表格里的Feature
				 $('#wfsFeatureTable').bootstrapTable('removeByUniqueId', row.values_.ID);
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
		//根据图层名获取对应layertree的Id
		var id = queryIdByLayerName(layer_type);
		//根据 layertree的Id获取节点对象
		 var node=$('#powerLayerTree').jstree().get_node("#"+id);
		 var layer = node.original.layer;
		// 保存数据
		
		editObject.layer_name = layer_type;
		editObject.feature = row;
		editObject.source = layer.getSource();
		editObject.editType = "update";
//		editObject.table = true;
		editObject.index = index;
		
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
		jsPanelAttributeInfo();
		
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
		selectEvent = new ol.interaction.Select();
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
	if(row.values_.DISTRICT!=undefined){
		detail = '<button class=" btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="设备信息"><span  class="detail_icon" style="display:block;"><span></button>'
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
							//回写数据
							var feature = editObject.feature.values_;
							for ( var id in feature) {
								if (id != "SHAPE" && id != "ID" && id !="geometry" ) {
									if(document.getElementById(id).type== "select-one"){
										$('#' + id) .selectpicker('val', feature[id]);
									}else if(id=='ENDID' || id == 'STARTID'){
										var value = formatterfeatureName(feature[id]);
										$('#' + id).val(value);
									}else {
										$('#' + id).val(feature[id]);
									}
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
		if(editType == "update" && $('#wfsFeatureTable').bootstrapTable('getData')!=""){
			$('#wfsFeatureTable').bootstrapTable('updateRow', {index: editObject.index, row: feature.values_});
			swal("修改成功", '', "success");
		}else if(editType == "add"){
			swal("保存成功", '', "success");
		}
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
	var featureNS = "http://" + queryWFSURL() + "/anqing";
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
	var serviceID = queryWFSURL();
	request.open('POST', 'http://'+serviceID+'/geoserver/wfs?service=wfs');
	request.setRequestHeader('Content-Type', 'text/xml');
	request.send(featString);
	
}

//全幅
function fullView(){
	closeFunction();
	var bounds = [ 117.044453027202, 30.5066687301743,
					117.110272065313, 30.5599371735666 ];
	  map.getView().fit(bounds, map.getSize());
	  map.render();
}

/************** 经纬度验证、定位 BEGIN ******************/
function isEmpty(val){
	if(val == undefined || val == "" || val == null){  
		return true;
	} else {
		return false;
	}
}

/**
 * 验证经度
 */
function validLonDu(val){
	var state; 
	var lonReg= /^-?((0|1?[0-7]?[0-9]?)(([.][0-9]{1,4})?)|180(([.][0]{1,4})?))$/;
    state = lonReg.test(val);   
    if(state){  
        return true;  
    }else{  
        return false;  
    }  
}

function validLonDFM(v){
	var state; 
	var lonTest1 = /^((\d|[1-9]\d|1[0-7]\d)[°](\d|[0-5]\d)[′](\d|[0-5]\d)(\.\d{1,6})?[\″]$)|(180[°]0[′]0[\″]$)/;  
	var lonTest2 = /^((\d|[1-9]\d|1[0-7]\d)[°](\d|[0-5]\d)(\.\d{1,6})?[′]$)|(180[°]0[′]$)/;  
	var lonTest3 = /^((\d|[1-9]\d|1[0-7]\d)(\.\d{1,6})?[°]$)|(180[°]$)/;
    var s1 = v.split("°");  
    if(s1[1] != '' && s1[1] != null){  
        var s2 = s1[1].split("′");  
        if(s2[1] != '' && s2[1] != null){  
            var s3 = s2[1].split("″");  
            state = lonTest1.test(v);  
        }else{  
            state = lonTest2.test(v);  
        }  
    }else{  
        state =  lonTest3.test(v);   
    }  
    if(state){  
        return true;  
    }else{  
        return false;  
    } 
}

/**
 * 验证緯度
 */
function validLatDu(val){
	var state; 
	var latReg= /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/; 
	state =  latReg.test(val);   
   	if(state){  
   		return true;  
   	}else{  
   		return false;  
   	}  
}

function validLatDFM(v){
	var state;  
	var latTest1 = /^((\d|[1-8]\d)[°](\d|[0-5]\d)[′](\d|[0-5]\d)(\.\d{1,6})?[\″]$)|(90[°]0[′]0[\″]$)/;  
    var latTest2 = /^((\d|[1-8]\d)[°](\d|[0-5]\d)(\.\d{1,6})?[′]$)|(90[°]0[′]$)/;  
    var latTest3 = /^((\d|[1-8]\d)(\.\d{1,6})?[°]$)|(90[°]$)/;  
    var s1 = v.split("°");  
    if(s1[1] != '' && s1[1] != null){  
    	var s2 = s1[1].split("′");  
    	if(s2[1] != '' && s2[1] != null){  
    		var s3 = s2[1].split("″");  
           	state = latTest1.test(v);  
    	}else{  
    		state = latTest2.test(v);  
    	}  
    }else{  
    	state =  latTest3.test(v);   
         
    }  
    if(state){  
    	return true;  
    }else{  
    	return false;  
    } 
}

/**
 * 将度转换成为度分秒 
 */
function duConvertDFM(val) {
	var s1 = val.split(".");
	var d = s1[0];
	if(isEmpty(s1[1])){
		s1[1] = 0;
	}
	var temp = "0." + s1[1]
	var temp = String(temp * 60);
	var s2 = temp.split(".");
	var f = s2[0];
	if(isEmpty(s2[1])){
		s2[1] = 0;
	}
	temp = "0." + s2[1];
	temp = temp * 60;
	var m = temp.toFixed(2);
	return d + "°" + f + "′" + m + "″";  
}

/**
 * 度分秒转换成为度
 */
function dFMConvertDu(value) {
	var d  = value.split("°")[0];  
    var f = value.split("°")[1].split("′")[0];  
    var m = value.split("°")[1].split("′")[1].split('″')[0];
	var f = parseFloat(f) + parseFloat(m/60);
	var du = parseFloat(f/60) + parseFloat(d);		
	return du;
}

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


function test() {
//	map.getView().setZoom(30);
	map.getView().setCenter([ 114.31, 30.52 ]);
    map.render();
	// map.getView().setCenter(ol.proj.fromLonLat([-72.980624870461128,
	// 48.161307640513321]));

}