var map = ""; //openLayers地图
var boxExtent = ""; //矩形、多边形查询的范围
var drawGeometry = ""; //鼠标画几何图形对象
var highlightObj =[]; //查询后的高亮对象
var propertyListWindow=""; //查询结果弹出框对象
var selectEvent ="";
var editObject={}; //编辑对象
var attributeInfoObj=""; //属性信息弹窗对象
var geomObj=""; //测量时生成对象的图层
var measureTooltipElement = ""; //度量工具提示元素.
var measureTooltip = ""; //测量结果对象

$(function(){
	showMenu();  //初始化导航
	initLayerTree();//初始图层列表
	$('.inactive').click(function(){
	    if($(this).siblings('ul').css('display')=='none'){
	        $(this).parent('li').siblings('li').removeClass('inactives');
	        $(this).addClass('inactives');
	        $(this).siblings('ul').slideDown(100).children('li');
	        if($(this).parents('li').siblings('li').children('ul').css('display')=='block'){
	            $(this).parents('li').siblings('li').children('ul').parent('li').children('a').removeClass('inactives');
	        }
	    }else{
	        //控制自身变成+号
	        $(this).removeClass('inactives');
	        //控制自身菜单下子菜单隐藏
	        $(this).siblings('ul').slideUp(100);
	        //控制自身子菜单变成+号
	        $(this).siblings('ul').children('li').children('ul').parent('li').children('a').addClass('inactives');
	        //控制自身菜单下子菜单隐藏
	        $(this).siblings('ul').children('li').children('ul').slideUp(100);
	        //控制同级菜单只保持一个是展开的（-号显示）
	        $(this).siblings('ul').children('li').children('a').removeClass('inactives');
	    }
	});
	/*左侧导航栏折叠*/
	$(".hamburger").click(function () {
	    $(".left_nav").css("display","none");
	    $(".nav1").css("display","inline-block");
	    $(this).css("display","none");
	    $(".hamburgerimg").css("display","inline-block");
	    $(".content-top").css("margin-left","-90px");
	    $("#right-sidebar").css("margin-left","-90px");
	});

	$(".hamburgerimg").click(function () {
	    $(".left_nav").css("display","block");
	    $(this).css("display","none");
	    $(".nav1").css("display","none");
	    $(".hamburger").css("display","inline-block");
	    $(".content-top").css("margin-left","0px");
	    $("#right-sidebar").css("margin-left","0px");
	});
	/*左侧导航栏折叠菜单悬浮二级菜单效果效果*/
	$(".nav1>ul>li").hover(function () {
	    index=$(".nav1>ul>li").index(this);
	    $(this).css("background","#01675e");
	    $(".nav1>ul>li .foldsecond").eq(index).css("display","block");
	    $(".nav1>ul>li .foldsecond>li .foldthird").eq(index).css("display","none");
	},function () {
	    $(".nav1>ul>li .foldsecond").eq(index).css("display","none");
	    $(this).css("background","#005a52");
	});
	/*左侧导航栏折叠菜单悬浮三级菜单效果效果*/
	$(".nav1>ul>li .foldsecond>li").hover(function () {
	    index=$(".nav1>ul>li .foldsecond>li").index(this);
	    $(".nav1>ul>li .foldsecond>li .foldthird").eq(index).css("display","block");
	},function () {
	    $(".nav1>ul>li .foldsecond>li .foldthird").eq(index).css("display","none");
	});
	
	$("#tb tr").hover(function () {
        index=$("#tb tr").index(this)-1;
        $("#tb tr button").eq(index).show();
    },function () {
        $("#tb tr button").eq(index).hide();
    })



    $('.modal').on('show.bs.modal', function () {
        $(".modal-backdrop").remove();

    })
    $('.modal').on('shown.bs.modal', function () {
        index=$(".modal").index(this);
        $(this).modal('show');
        $(".modal").not($(".modal:eq("+index+")")).hide();
    })
    /** 拖拽模态框*/
    /** 拖拽模态框*/
    var dragModal={
        mouseStartPoint:{"left":0,"top":  0},
        mouseEndPoint : {"left":0,"top":  0},
        mouseDragDown : false,
        basePoint : {"left":0,"top":  0},
        moveTarget:null,
        topleng:0
    }
    $(document).on("mousedown",".modal-header",function(e){
        if($(e.target).hasClass("close"))//点关闭按钮不能移动对话框
            return;
        dragModal.mouseDragDown = true;
        dragModal.moveTarget = $(this).parent().parent().parent();
        dragModal.mouseStartPoint = {"left":e.clientX,"top":  e.pageY};
        dragModal.basePoint = dragModal.moveTarget.offset();
        dragModal.topLeng=e.pageY-e.clientY;
    });
    $(document).on("mouseup",function(e){
        dragModal.mouseDragDown = false;
        dragModal.moveTarget = undefined;
        dragModal.mouseStartPoint = {"left":0,"top":  0};
        dragModal.basePoint = {"left":0,"top":  0};
    });
    $(document).on("mousemove",function(e){
        if(!dragModal.mouseDragDown || dragModal.moveTarget == undefined)return;
        var mousX = e.clientX;
        var mousY = e.pageY;
        if(mousX < 0)mousX = 0;
        if(mousY < 0)mousY = 25;
        dragModal.mouseEndPoint = {"left":mousX,"top": mousY};
        var width = dragModal.moveTarget.width();
        var height = dragModal.moveTarget.height();
        var clientWidth=document.body.clientWidth
        var clientHeight=document.body.clientHeight;
        if(dragModal.mouseEndPoint.left<dragModal.mouseStartPoint.left - dragModal.basePoint.left){
            dragModal.mouseEndPoint.left=160;
        }
        else if(dragModal.mouseEndPoint.left>=clientWidth-width+dragModal.mouseStartPoint.left - dragModal.basePoint.left){
            dragModal.mouseEndPoint.left=clientWidth-width;
        }else{
            dragModal.mouseEndPoint.left =dragModal.mouseEndPoint.left-(dragModal.mouseStartPoint.left - dragModal.basePoint.left);//移动修正，更平滑

        }
        if(dragModal.mouseEndPoint.top-(dragModal.mouseStartPoint.top - dragModal.basePoint.top)<dragModal.topLeng){
            dragModal.mouseEndPoint.top=dragModal.topLeng+110;
        }else if(dragModal.mouseEndPoint.top-dragModal.topLeng>clientHeight-height+dragModal.mouseStartPoint.top - dragModal.basePoint.top){
            dragModal.mouseEndPoint.top=clientHeight-height+dragModal.topLeng;
        }
        else{
            dragModal.mouseEndPoint.top = dragModal.mouseEndPoint.top - (dragModal.mouseStartPoint.top - dragModal.basePoint.top);
        }
        dragModal.moveTarget.offset(dragModal.mouseEndPoint);
    });

});


//初始化图层列表
function initLayerTree(){
	$('#powerLayerTree').jstree({
	    "plugins": ["checkbox", "contextmenu", "wholerow"],
	    "checkbox": {
	        "whole_node": false,
	        "keep_selected_style": false,
	        "tie_selection": false
	    },
	    "contextmenu": {
	        "show_at_node": false,
	        "items": {
	            "添加": {
	                "label": "添加",
	                "icon": "/images/1_07.png",
	                "action": function(data) {
	                    clearOnMapEvent(); //清除主动添加到地图上的事件
	                    var inst = jQuery.jstree.reference(data.reference);
	                    var obj = inst.get_node(data.reference);
	                    if (obj.children.length == 0 && obj.parent != "#") {
	                        //获取当前图层及类型
	                        var layer = obj.original.layer;
	                        var type = layer.getSource().getFeatures()[0].getGeometry().getType().toLowerCase();
	                        if (type == "point") {
	                            type = "Point";
	                        } else if (type == "line") {
	                            type = "Line"
	                        }
	                        //画矢量图形
	                        var draw = new ol.interaction.Draw({
	                            source: layer.getSource(),
	                            geometryName: 'SHAPE',
	                            type: (type)
	                        });
	                        map.addInteraction(draw);
	                        draw.on('drawend',
	                        function(e) {
	                            //保存编辑数据
	                            editObject.feature = e.feature;
	                            editObject.source = layer.getSource();
	                            editObject.editType = "add";
	                            editObject.layer_name = queryLayerNameByID(obj.id);
	                            //弹出属性窗口
	                            jsPanelAttributeInfo();
	                            //关闭draw事件
	                            map.removeInteraction(draw);
	                        },
	                        this);
	                    } else {
	                        swal('根节点不能添加!', '', "warning");
	                    }
	                }
	            },
	            "修改": {
	                "label": "修改",
	                "action": function(data) {
	                    clearOnMapEvent(); //清除主动添加到地图上的事件
	                    var inst = jQuery.jstree.reference(data.reference),
	                    obj = inst.get_node(data.reference);
	                    //获取当前图层和类型
	                    var layer = obj.original.layer;
	                    editObject.layer_name = queryLayerNameByID(obj.id);
	                    if (obj.children.length == 0 && obj.parent != "#") {
	                        var select = new ol.interaction.Select();
	                        var modify = new ol.interaction.Modify({
	                            features: select.getFeatures()
	                        });
	                        map.addInteraction(select);
	                        select.on('select',
	                        function(e) {
	                            if (e.selected[0] != undefined && e.selected[0].id_.split(".")[0] != editObject.layer_name) {
	                                modify.setActive(false);
	                            } else {
	                                modify.setActive(true);
	                                //保存数据
	                                editObject.feature = e.selected[0];
	                                editObject.source = layer.getSource();
	                                editObject.editType = "update";
	                                if (attributeInfoObj != "") {
	                                    attributeInfoObj.close();
	                                }
	                                jsPanelAttributeInfo();
	                            }
	                        });
	                        map.addInteraction(modify);
	                    } else {
	                        swal('根节点不能修改!', '', "warning");
	                    }
	                }
	            },
	            "删除": {
	                "label": "删除",
	                "action": function(data) {
	                    clearOnMapEvent(); //清除主动添加到地图上的事件
	                    var inst = jQuery.jstree.reference(data.reference);
	                    var obj = inst.get_node(data.reference);
	                    if (obj.children.length == 0 && obj.parent != "#") {
	                        //获取当前图层类型
	                        var layer_type = queryLayerNameByID(obj.id);
	                        var select = new ol.interaction.Select();
	                        map.addInteraction(select);
	                        select.on('select',
	                        function(e) {
	                            if (select.getFeatures().getArray().length == 0) {} else if (e.selected[0].id_.split(".")[0] != layer_type) {
	                                var name = getLayerNameTitle(layer_name);
	                                swal('不能删除!', '此数据不属于' + name + '图层', "warning");
	                            } else {
	                                swal({
	                                    title: "确定删除此数据？",
	                                    text: "删除后不可恢复,请谨慎操作!",
	                                    type: "warning",
	                                    showCancelButton: true,
	                                    confirmButtonColor: "#DD6B55",
	                                    confirmButtonText: "确定",
	                                    cancelButtonText: "取消",
	                                    closeOnConfirm: false
	                                },
	                                function(isConfirm) {
	                                    if (isConfirm) {
	                                        //获取当前图层
	                                        var layer = obj.original.layer;
	                                        editWFSFeature(e.target.getFeatures().getArray(), 'delete', layer_type);
	                                        layer.getSource().removeFeature(e.target.getFeatures().getArray()[0]);
	                                        e.target.getFeatures().clear();
	                                        map.removeInteraction(select);
	                                        swal("删除成功", '', "success");
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
	        }
	    },
	    "core": {
	        /*'force_text' : true,
	      "themes" : { "stripes" : true },
	      "animation" : 0,*/
	        "check_callback": true,
	        'data': getLayerTreeData()
	    }
	});
	//图层勾选事件
	$('#powerLayerTree').on("check_node.jstree",
	function(event, data) {
	    var childrens = $('#powerLayerTree').jstree("get_children_dom", data.node);
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
	//图层取消勾选事件
	$('#powerLayerTree').on("uncheck_node.jstree",
	function(event, data) {
	    //判断是否为父节点
	    var is_parent = $('#powerLayerTree').jstree("is_parent", data.node);
	    if (is_parent) {
	    	var childrens = $('#powerLayerTree').jstree("get_children_dom",data.node);
	        for (var i = 0; i < childrens.length; i++) {
	            var id = childrens[i].id;
	            var nodeLayer = $('#powerLayerTree').jstree().get_node("#" + id);
	            nodeLayer.original.layer.setVisible(false);
	        }
	    } else {
	        data.node.original.layer.setVisible(false);
	    }
	});

	//图层tree绑定单击事件 定位到图层场景
	$('#powerLayerTree').bind('select_node.jstree',
	function(event, data) {
	    if (data.node.children.length == 0) {
	        //定位到添加的图层位置
	        var bbox = data.node.original.bounds.split(',');
	        map.getView().fit(bbox, map.getSize());
	    }
	});
}


//获取图层列表数据
function getLayerTreeData(){
	var powerLayerTree = {id:-1,text: "图层管理",state : {"opened" : true }};
	var treeNodes = new Array();
	$.ajax({
    	//请求地址                               
       url:"/T_POWERLAYERS/search.action",
	   data:{"sort.C_ID":'DESC'},//设置请求参数 
	   type:"post",//请求方法
	   async:false, 
	   dataType:"json",//设置服务器响应类型
	  //success：请求成功之后执行的回调函数   data：服务器响应的数据
	   success:function(data){
			var bounds=[115.902731511993,39.5010013847293,117.174121256339,40.0926220582295];
			var layers = [];
			var treeId=0;
			var gaodeMapLayer = new ol.layer.Tile({  
                source: new ol.source.XYZ({  
                    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'  
                })  
            });
			layers.push(gaodeMapLayer);
			for(var i in data){
				//只加载默认图层在地图上
				if(data[i].C_ISDEFAULTLAYER=="1" && data[i].C_ISSHOW=="1"){
//					bounds = data[i].C_BBOX;
					   var wfsParams = {
					        service : 'WFS',
					        version : '1.1.0',
					        request : 'GetFeature',
					        typeName : data[i].C_LAYER,  //图层名称，可以是单个或多个
					        outputFormat : 'application/json'//'text/javascript',  //重点，不要改变
					    };
					    var vector_Source = new ol.source.Vector({
					    	wrapX: false,
					        format: new ol.format.GeoJSON(),
					        url: data[i].C_LAYERURL+'?'+ $.param(wfsParams),
					        url:'http://172.16.15.147:8080/geoserver/anqing/wfs?'+ $.param(wfsParams),
					        strategy: ol.loadingstrategy.bbox,
					        projection: 'EPSG:4326'
					    });
					    var layer = new ol.layer.Vector({
					        source: vector_Source
					        
					    });
					layers.push(layer);
					treeNodes[treeId] = {text:data[i].C_LAYERNAME,id:data[i].C_ID,layer:layer,bounds:data[i].C_BBOX,icon:"glyphicon glyphicon-file",state:{checked:true}}
					treeId++;
				}
			}
			var projection = new ol.proj.Projection({
			    code: 'EPSG:4326',
			    units: 'm',
			    axisOrientation: 'neu',
			    global: false
			}); 
			
			
			//初始化地图
			map = new ol.Map({
			    controls: ol.control.defaults({
			    	attribution:false,
			    	zoom:false
			    }).extend([]),
			    target: 'openlayersID',
			    projection: 'EPSG:4326',
			    layers:layers,
			    view: new ol.View({
			        projection: projection,
			        // 限制地图缩放最大级别为14，最小级别为10
	                minZoom: 6,
	                maxZoom: 35
			    })
			});
			//禁用双击地图放大功能
			map.getInteractions().getArray().forEach(function(interaction) {
				  if (interaction instanceof ol.interaction.DoubleClickZoom) {
					map.removeInteraction(interaction);
				  }
		    });
			 
			map.getView().fit(bounds, map.getSize());
		   
	   }
   });
	powerLayerTree.children=treeNodes;
	var arr = [powerLayerTree];
	return arr;
}
/**
 * 显示菜单数据
 */
function showMenu(){
	  $.ajax({
	      url:'/module/queryMenuInfo.action',
	      method: 'post',
	      data:{
	         id:'C_ID',
	         text:'C_MODULENAME',
	         parentId:'C_PARENT_ID'
	      },
	      async:false,
	      dataType:'json',    
	      success:function(data){
	        $("#left_nav1").html("");
	        $("#left_nav2").html("");
	    	var left_nav1_menu = '<ul class="nav nav-pills nav-stacked nav-management ">';
	    	var left_nav2_menu = '<ul class="nav nav-pills nav-stacked ">';
	        for(var i=0;i<data.length;i++){
	        	var menuData = data[i];
	        	if(menuData.id != 24 && menuData.text != "系统管理"){
	        		var childrenData = menuData.children;
	        		var imgSrc = menuData.attributes.C_ICONCLS;
	        		if(imgSrc ==null){
	        			imgSrc = "";
	        		}
	        		left_nav1_menu = left_nav1_menu+'<li><a href="javascript:;" class="inactive"><span class="iconfont '+imgSrc+'" style="margin-right: 5px;"></span>'+menuData.text+'</a><ul style="display: none">';
	        		left_nav2_menu = left_nav2_menu+'<li><a href="javascript:"><span class="iconfont '+imgSrc+'"></span></a><ul class="foldsecond"><li><a href="javascript:">'+menuData.text+'<span class="iconfont icon-xiala" style="float:right"></span></a><ul class="foldthird" style="display: none">';
	        		if(childrenData!=undefined){
	        			for(var j=0;j<childrenData.length;j++){
	        				var icon = childrenData[j].attributes.C_ICONCLS;
	        				left_nav1_menu = left_nav1_menu+"<li ><a href='javascript:;' onclick=res('"+childrenData[j].attributes.C_URL+"','"+childrenData[j].attributes.C_ISOUTLINK + "','"+childrenData[j].attributes.C_ISCOMMON + "',this);>"+childrenData[j].text+"</a></li>";
	        				left_nav2_menu = left_nav2_menu+"<li ><a href='javascript:;' onclick=res('"+childrenData[j].attributes.C_URL+"','"+childrenData[j].attributes.C_ISOUTLINK + "','"+childrenData[j].attributes.C_ISCOMMON + "',this);>"+childrenData[j].text+"</a></li>";
	        			} 
	        			left_nav1_menu = left_nav1_menu+"</ul></li>";
	        			left_nav2_menu = left_nav2_menu+"</ul></li></ul></li>";
	        		}
	        	}
	        }
	        left_nav1_menu = left_nav1_menu+"</ul>";
	        $("#left_nav1").append(left_nav1_menu);
	        left_nav2_menu = left_nav2_menu+"</ul>";
	        $("#left_nav2").append(left_nav2_menu);
	      },
	      error:function(data){
	        
	      }
	  });
}




function loadPage(url,title,id){
	LoadJS(url);
    $(".content-top").find("span").eq(4).text(title);
	 $.jsPanel({
	 id:			 id,
	 //position:    'center',
	 theme:       "#308374",
	 contentSize: {width: 'auto', height: 'auto'},
	 headerTitle: title,
	 border:      '1px solid #066868',
	 contentAjax: {
	 url: url,
	 autoload: true
	 },
	 callback:    function () {
	 this.content.css("padding", "5px");
	 }
	 });
}

/**
 * JS动态加载
 * @param src js路径
 * @constructor
 */
function LoadJS(url,callback)
{
    var findex = url.lastIndexOf("/");
    var lindex = url.lastIndexOf(".");
    var jssrc = url.substr(findex+1,lindex-findex-1);
    var js = "js/"+jssrc+".js";
    var css =  document.createElement("link");
    css.type = "text/css";
    css.rel = "stylesheet";
    css.id ="css";
    if(css.readyState){ // IE
        css.onreadystatechange = function(){
            if(css.readyState == "loaded" || css.readyState == "complete"){
                script.onreadystatechange = null;
                if (!$.isEmptyObject(callback)){
                    callback();
                }
            }
        };
    }else{ // FF, Chrome, Opera, ...
        css.onload = function(){
            if (!$.isEmptyObject(callback)){
                callback();
            }
        };
    }
    $("#css").remove();
    css.href = "css/"+jssrc+".css";
    document.getElementsByTagName("head")[0].appendChild(css);

    var script = document.createElement("script");
    script.type = "text/javascript";
    if(script.readyState){ // IE
        script.onreadystatechange = function(){
            if(script.readyState == "loaded" || script.readyState == "complete"){
                script.onreadystatechange = null;
                if (!$.isEmptyObject(callback)){
                    callback();
                }else{
                    try
                    {init();}
                    catch(err)
                    {console.info("异步加载的js中，未定义init方法");	}
                }
            }
        };
    }else{ // FF, Chrome, Opera, ...
        script.onload = function(){
            if (!$.isEmptyObject(callback)){
                callback();
            }else{
                try
                {init();}
                catch(err)
                {console.info("异步加载的js中，未定义init方法");	}
            }
        };
    }
    script.src = js;
    document.getElementsByTagName("head")[0].appendChild(script);
}

//关闭所有
function closeFunction(){
	closePropertyListWindow();
	clearDrawGeometry();
	clearHighlightObj();
	clearMeasureObj();
	clearOnMapEvent();

}

//清除高亮对象
function clearHighlightObj(){
	if(highlightObj.length!=0){
		highlightObj.clear();
	}
}
//清除画几何对象
function clearDrawGeometry(){
	if(drawGeometry!=""){
		map.removeInteraction(drawGeometry);
  		drawGeometry = "";
	}
}


//关闭属性列表弹出窗口
function closePropertyListWindow(){
	if(propertyListWindow!=""){
		propertyListWindow.close();
		propertyListWindow="";
	}
}

//测量
function measureOnMap(value) {
    clearMeasureObj();
    clearDrawGeometry();
    $('#measuretext').html("");
    // 添加一个绘制的线使用的layer
    geomObj = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                size: 2
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
        source: geomObj.getSource(),
        type: type,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    });
    map.addInteraction(drawGeometry);

    createMeasureTooltip();

    var results = ""; //测量结果
    var listener = ""; //
    drawGeometry.on('drawstart',
    function(evt) {
        // set sketch
        sketch = evt.feature;

        /** @type {ol.Coordinate|undefined} */
        var tooltipCoord = evt.coordinate;

        listener = sketch.getGeometry().on('change',
        function(evt) {
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
    },
    this);

    drawGeometry.on('drawend',
    function(event) {
        measureTooltipElement.className = 'tooltip tooltip-static';
        measureTooltip.setOffset([0, -7]);
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
    },
    this);
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
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
}

/**
       * 根据多线段获取长度.
       * @param {ol.geom.LineString} line The line.
       * @return {string} The formatted length.
       */
function formatLength(line) {
    var length;
    var geodesic = false; //true:计算平面距离；false:计算球面距离 
    if (geodesic) {
        var coordinates = line.getCoordinates();
        length = 0;
        var sourceProj = map.getView().getProjection();
        var wgs84Sphere = new ol.Sphere(6378137);
        for (var i = 0,
        ii = coordinates.length - 1; i < ii; ++i) {
            var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
            var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
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
       * @param {ol.geom.Polygon} polygon The polygon.
       * @return {string} Formatted area.
       */
function formatArea(polygon) {
    var area;
    var geodesic = false; //true:计算平面面积；false:计算球面面积 
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

//清除测量结果
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

//删除测量对象
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
//清除主动添加到地图的事件（画、选择、移动）
function clearOnMapEvent(){
	var events = map.getInteractions().getArray();
	for(var i=0;i<events.length;i++){
		var e = events[i];
		  if (e instanceof ol.interaction.Draw || e instanceof ol.interaction.Select ||
				  e instanceof ol.interaction.Modify) {
			map.removeInteraction(e);
			--i;
		  }
  }
}

//放大地图
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

//框选放大/缩小
function right_click_box(number){
	closeFunction();
	drawGeometry = new ol.interaction.Draw({
          source:new ol.source.Vector(),
          type: /** @type {ol.geom.GeometryType} */ ('Circle'),
          geometryFunction: ol.interaction.Draw.createBox()
         
        });
        map.addInteraction(drawGeometry);

        drawGeometry.on('drawend',
            function(event) {
              clearDrawGeometry();
              //获取框选范围
              var xy = event.target.sketchCoords_;
              //获取范围中心点
              var coord = ol.extent.getCenter([xy["0"]["0"],xy["0"][1],xy[1]["0"],xy[1][1]]);
              var view = map.getView();
              view.setCenter(coord);
              // 让地图的zoom增加1，从而实现地图放大
              view.setZoom(view.getZoom() + number);
              //重新渲染地图
              map.render();
            }, this);
}

//单选查询
function radioQuery(){
	closeFunction();
	//定义select控制器
	var select= new ol.interaction.Select();
	map.addInteraction(select);//map加载该控件，默认是激活可用的
	select.on('select', function(e) {
		if(e.selected.length>0){
			openDialg("/attributeList/attributeList.action","查询结果","radioQuery",e.selected);
			map.removeInteraction(select);
		}
	});
	
}



function openDialg(url,title,field,dataFeatures){
	
	propertyListWindow =$.jsPanel({
			id:          "openDialg",
	        position:    'center',
	        theme:       "rebeccapurple",
	        contentSize: {width:1000, height:535},
	        headerTitle: title,
	        border:      '2px solid rgb(7,102,104)',
	        contentAjax: {
	            url: url,
	            autoload: true,
	            done: function (data, textStatus, jqXHR, panel) {
	            	//图层tree根节点
	            	var root =$('#powerLayerTree').jstree().get_node("#-1");
	            	var childrens = $('#powerLayerTree').jstree("get_children_dom",root);
	            	
	            	$('#assemblageQueryOptions1').hide();
	            	$('#assemblageQueryOptions2').hide();
	            	if(field == 'radioQuery'){
	            		//获取查询图层类型
	    	        	var layerType = dataFeatures[0].id_.split('.');
	    	        	//展示数据
	    	        	displayData(dataFeatures,layerType[0]);
	            		
	            	}else if(field == 'boxQuery' || field == 'polygonQuery'){
	            		$("#powLayes1").empty();
		            	$("#powLayes1").append("<option value=''>请选择图层</option>");
	            		for(var i=0;i<childrens.length;i++){
            				var node=$('#powerLayerTree').jstree().get_node(childrens[i].id);
            				$("#powLayes1").append("<option value='"+node.original.id+"'>"+node.original.text+"</option>");
            			}
	            		$('#assemblageQueryOptions1').show();
	            	}else if(field == 'assemblageQuery'){
	            		$("#powLayes2").empty();
		            	$("#powLayes2").append("<option value=''>请选择图层</option>");
	            		for(var i=0;i<childrens.length;i++){
            				var node=$('#powerLayerTree').jstree().get_node(childrens[i].id);
            				$("#powLayes2").append("<option value='"+node.original.id+"'>"+node.original.text+"</option>");
            			}
	            		$('#assemblageQueryOptions2').show();
	            	}
	            	$('#search').modal('hide');//隐藏查询模态框
	            }
	        },
	        callback:function(panel){
	        	this.content.css("padding", "5px");
	        }
	    });
	}
//框选、多边形查询
function boxQuery(){
	closeFunction();
  	drawGeometry = new ol.interaction.Draw({
        source:new ol.source.Vector(),
        type: /** @type {ol.geom.GeometryType} */ ('Circle'),
        geometryFunction: ol.interaction.Draw.createBox(),
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 0, 0.7)'
            }),
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            })
          })
        })
      });
      map.addInteraction(drawGeometry);
      var listener ="";
      var sketch = null;
      drawGeometry.on('drawstart',
          function(evt) {
            // set sketch
            sketch = evt.feature;
            var coord = evt.coordinate;
            listener = sketch.getGeometry().on('change', function(evt) {
          	  var geom = evt.target;
              if (geom instanceof ol.geom.Geometry) {
                var extent = geom.getExtent();
                boxExtent  = extent;
              }
            });
          }, this);

      drawGeometry.on('drawend',
          function(event) {
            sketch = null;
            clearDrawGeometry();
            openDialg("/attributeList/attributeList.action","查询结果","boxQuery");
            ol.Observable.unByKey(listener);
          }, this);
	
}

//多边形查询
function polygonQuery(){
	closeFunction();
	drawGeometry = new ol.interaction.Draw({
        source:new ol.source.Vector(),
        type: /** @type {ol.geom.GeometryType} */ ('Polygon'),
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 0, 0.7)'
            }),
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            })
          })
        })
      });
      map.addInteraction(drawGeometry);
      var listener ="";
      var sketch = null;
      drawGeometry.on('drawstart',
          function(evt) {
            // set sketch
            sketch = evt.feature;
            /** @type {ol.Coordinate|undefined} */
            var coord = evt.coordinate;
            listener = sketch.getGeometry().on('change', function(evt) {
          	  var geom = evt.target;
              if (geom instanceof ol.geom.Polygon) {
                var extent = geom.getExtent();
                boxExtent  = extent;
              }
            });
          }, this);

      drawGeometry.on('drawend',
          function(event) {
            sketch = null;
            clearDrawGeometry();
            openDialg("/attributeList/attributeList.action","查询结果","polygonQuery");
            ol.Observable.unByKey(listener);
          }, this);
}

//更改图层下拉框后查询属性
function changeLayer(id){
	 clearHighlightObj();
	if(id != ""){
		var node=$('#powerLayerTree').jstree().get_node(id);
		var vector_Source = node.original.layer.getSource();
		$('#filterFieldOptions').show();
		var feature = vector_Source.getFeatures()[0];
		//获取查询图层类型
    	var layerTable = feature.id_.split('.');
    	$("#filterField").empty();
		$.ajax({
	    	//请求地址                               
	       url:"/"+layerTable[0]+"/querySpatialTableField.action",
		   data:{},//设置请求参数 
		   type:"post",//请求方法
		   async:false, 
		   dataType:"json",//设置服务器响应类型
		  //success：请求成功之后执行的回调函数   data：服务器响应的数据
		   success:function(data){
			   $("#filterField").append("<option value=''>请选择字段</option>");
			   for(var i in data){
				   if(data[i].FIELD !=null && data[i].VALUE !="ID" && data[i].VALUE !="OBJECTID"){
           				$("#filterField").append("<option value='"+data[i].VALUE+"'>"+data[i].FIELD+"</option>");
				   }
			   }
		   }
	   });
		
	}
}
//框选和多边形弹窗中的查询按钮
function queryFeature(){
	var id = $('#powLayes1').val();
	var field = $('#filterField').val();
	var value = $('#fieldValue').val();
	if(id ==""){
		$('#powLayes2').focus();
		swal('请先选择要查询的图层！','',"warning");
	}else {
		if(field !="" && value ==""){
			$('#fieldValue').focus();
			swal('请给'+field+'相应的值！','',"warning");
		}else{
//			$(".modal-content").mLoading("show");  
			var node=$('#powerLayerTree').jstree().get_node(id);
			var vector_Source = node.original.layer.getSource();  
	        selectEvent = new ol.interaction.Select();
			  map.addInteraction(selectEvent);
	          highlightObj = selectEvent.getFeatures();
	        
	        var timingFunction=setInterval(function(){
	        	var selectedFeatures=[];	
	        	vector_Source.forEachFeatureInExtent(boxExtent, function(feature) {
	        		selectedFeatures.push(feature);
	        		highlightObj.push(feature);
	        	});			
	        	if(selectedFeatures.length==0){
	        		clearInterval(timingFunction);
	        		$(".modal-content").mLoading("hide");
	        		swal('没有查到符合条件的数据','',"warning");
	        		$('#wfsFeatureTable').bootstrapTable('removeAll');
		        }else{
		        	$(".modal-content").mLoading("hide");
		        	//获取查询图层类型
		        	var layerType = selectedFeatures[0].id_.split('.');
		        	displayData(selectedFeatures,layerType[0]);
		        }
	        	//关闭定时函数
	        	clearInterval(timingFunction);
	        },1000);
		}
	}
		
}

//将数据在table中显示
function displayData(features,layerType){
	//销毁查询结果 bootstrapTable
	$('#wfsFeatureTable').bootstrapTable('destroy');
	var columns=[];
	switch (layerType) {
	case "SD_STATION": //局站
		columns = [{
	        field: 'ID',
	        title: '编码',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.ID;}
	    },{
	        field: 'NAME',
	        title: '名称',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.NAME;}
	    }, {
	    	field: 'DISTRICT',
	    	title: '行政区划',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.DISTRICT;}
	    }, {
	        field: 'ASSETUNIT',
	        title: '资产单位',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.ASSETUNIT;}
	    }, {
	        field: 'TYPE',
	        title: '类型',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.TYPE;}
	    }, {
	    	field: 'VOLTAGE',
	    	title: '电压等级',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.VOLTAGE;}
	    }, {
	    	field: 'OPERATIONDATE',
	    	title: '投运日期',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return operationdateFormatter(row.values_.OPERATIONDATE);}
	    }, {
	    	field: 'MAINTENANCEUNIT',
	    	title: '维护单位',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.MAINTENANCEUNIT;}
	    }, {
	    	field: '操作',
	    	title: '操作',
	    	align: 'center',
	    	valign: 'middle',
	    	sortable: true,
	    	events: operateEvents,//给按钮注册事件
	    	formatter: operateFormatter//表格中增加按钮
	    }];
		break;
	case "SD_JUNCTIONBOX":  //'接头盒'
		columns = [{
	        field: 'ID',
	        title: '编码',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.ID;}
	    },{
	        field: 'NAME',
	        title: '名称',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.NAME;}
	    }, {
	    	field: 'POSITION',
	    	title: '位置',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.POSITION;}
	    }, {
	    	field: 'SPECIFICATIONS',
	    	title: '规格标识',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.SPECIFICATIONS;}
	    }, {
	        field: 'ASSETUNIT',
	        title: '资产单位',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.ASSETUNIT;}
	    }, {
	    	field: 'MAINTENANCEUNIT',
	    	title: '维护单位',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.MAINTENANCEUNIT;}
	    }, {
	    	field: '操作',
	    	title: '操作',
	    	align: 'center',
	    	valign: 'middle',
	    	sortable: true,
	    	events: operateEvents,//给按钮注册事件
	    	formatter: operateFormatter//表格中增加按钮
	    }];
		break;
	case "SD_COMMUNICATIONPOLETOWER":  //'通信杆塔':
		columns = [{
	        field: 'NAME',
	        title: '杆塔名称',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.NAME;}
	    }, {
	    	field: 'HEIGHT',
	    	title: '高度',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.HEIGHT;}
	    }, {
	    	field: 'PMSID',
	    	title: 'PMS编码',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.PMSID;}
	    }, {
	    	field: 'TOWERMATERIAL',
	    	title: '杆塔材质',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.TOWERMATERIAL;}
	    }, {
	        field: 'ASSETUNIT',
	        title: '资产单位',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.ASSETUNIT;}
	    }, {
	    	field: 'MAINTENANCEUNIT',
	    	title: '维护单位',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.MAINTENANCEUNIT;}
	    }, {
	    	field: '操作',
	    	title: '操作',
	    	align: 'center',
	    	valign: 'middle',
	    	sortable: true,
	    	events: operateEvents,//给按钮注册事件
	    	formatter: operateFormatter//表格中增加按钮
	    }];
		break;
	case "SD_PERSONWELL":  //'人井'
		columns = [{
	        field: 'ID',
	        title: '编码',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.ID;}
	    },{
	        field: 'NAME',
	        title: '名称',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.NAME;}
	    }, {
	    	field: 'AFFILIATEDID',
	    	title: '附属对象ID',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.AFFILIATEDID;}
	    }, {
	        field: 'ASSETUNIT',
	        title: '资产单位',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.ASSETUNIT;}
	    }, {
	        field: 'MAINTENANCEUNIT',
	        title: '维护单位',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.MAINTENANCEUNIT;}
	    }, {
	    	field: 'REMARK',
	    	title: '备注',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.REMARK;}
	    }, {
	    	field: '操作',
	    	title: '操作',
	    	align: 'center',
	    	valign: 'middle',
	    	sortable: true,
	    	events: operateEvents,//给按钮注册事件
	    	formatter: operateFormatter//表格中增加按钮
	    }];
		break;
	case "SD_RESIDUALCABLE": //'余缆'
		columns = [{
	        field: 'ID',
	        title: '所属光缆段ID',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.ID;}
	    },{
	        field: 'LENGTH',
	        title: '长度',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.LENGTH;}
	    }, {
	    	field: 'MAINTENANCEUNIT',
	    	title: '行政区划',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.MAINTENANCEUNIT;}
	    }, {
	        field: 'ASSETUNIT',
	        title: '维护单位',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.ASSETUNIT;}
	    }, {
	        field: 'ASSETUNIT',
	        title: '资产单位',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.ASSETUNIT;}
	    }, {
	    	field: 'REMARK',
	    	title: '备注',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.REMARK;}
	    }, {
	    	field: '操作',
	    	title: '操作',
	    	align: 'center',
	    	valign: 'middle',
	    	sortable: true,
	    	events: operateEvents,//给按钮注册事件
	    	formatter: operateFormatter//表格中增加按钮

	    }];
		break;
	case "SD_OPTICALCABLESECTION":  //'光缆段'
		columns = [{
	        field: 'ID',
	        title: '编码',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.ID;}
	    },{
	        field: 'NAME',
	        title: '名称',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.NAME;}
	    }, {
	    	field: 'TYPE',
	    	title: '类型',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.TYPE;}
	    }, {
	    	field: 'LENGTH',
	    	title: '长度',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.LENGTH;}
	    }, {
	    	field: 'CORENUM',
	    	title: '芯数',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.CORENUM;}
	    }, {
	    	field: 'VOLTAGECLASS',
	    	title: '线路电压等级',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.VOLTAGECLASS;}
	    }, {
	    	field: 'LAYWAY',
	    	title: '敷设方式',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.LAYWAY;}
	    }, {
	    	field: 'STARTID',
	    	title: '起点',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.STARTID;}
	    }, {
	    	field: 'ENDID',
	    	title: '终点',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.ENDID;}
	    }, {
	        field: 'ASSETUNIT',
	        title: '资产单位',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.ASSETUNIT;}
	    }, {
	    	field: 'MAINTENANCEUNIT',
	    	title: '维护单位',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.MAINTENANCEUNIT;}
	    }, {
	    	field: '操作',
	    	title: '操作',
	    	align: 'center',
	    	valign: 'middle',
	    	sortable: true,
	    	events: operateEvents,//给按钮注册事件
	    	formatter: operateFormatter//表格中增加按钮
	    }];
		break;
	case "SD_CABLEDUCT": //'电缆管道':
		columns = [{
	        field: 'PMSID',
	        title: 'PMS系统编码',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.PMSID;}
	    },{
	        field: 'NAME',
	        title: '名称',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.NAME;}
	    }, {
	    	field: 'BURIEDLENGTH',
	    	title: '埋设长度(米)',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.BURIEDLENGTH;}
	    }, {
	    	field: 'BURIEDWIDTH',
	    	title: '埋设宽度(米)',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.BURIEDWIDTH;}
	    }, {
	    	field: 'STARTPOSITION',
	    	title: '起点井',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.STARTPOSITION;}
	    }, {
	    	field: 'ENDPOSITION',
	    	title: '终点井',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.ENDPOSITION;}
	    }, {
	        field: 'ASSETUNIT',
	        title: '资产单位',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.ASSETUNIT;}
	    }, {
	    	field: 'MAINTENANCEUNIT',
	    	title: '维护单位',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.MAINTENANCEUNIT;}
	    }, {
	    	field: '操作',
	    	title: '操作',
	    	align: 'center',
	    	valign: 'middle',
	    	sortable: true,
	    	events: operateEvents,//给按钮注册事件
	    	formatter: operateFormatter//表格中增加按钮
	    }];
		break;
	case "SD_CABLETRENCH":  //'电缆沟':
		columns = [{
	        field: 'PMSID',
	        title: 'PMS系统编码',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.PMSID;}
	    },{
	        field: 'NAME',
	        title: '名称',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.NAME;}
	    }, {
	    	field: 'BURIEDLENGTH',
	    	title: '埋设长度(米)',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.BURIEDLENGTH;}
	    }, {
	    	field: 'BURIEDWIDTH',
	    	title: '埋设宽度(米)',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.BURIEDWIDTH;}
	    }, {
	    	field: 'STARTPOSITION',
	    	title: '起点井',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.STARTPOSITION;}
	    }, {
	    	field: 'ENDPOSITION',
	    	title: '终点井',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.ENDPOSITION;}
	    }, {
	        field: 'ASSETUNIT',
	        title: '资产单位',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.ASSETUNIT;}
	    }, {
	    	field: 'MAINTENANCEUNIT',
	    	title: '维护单位',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.MAINTENANCEUNIT;}
	    }, {
	    	field: '操作',
	    	title: '操作',
	    	align: 'center',
	    	valign: 'middle',
	    	sortable: true,
	    	events: operateEvents,//给按钮注册事件
	    	formatter: operateFormatter//表格中增加按钮
	    }];
		break;
	case "SD_CABLETUNNEL":  //'电缆隧道':
		columns = [{
	        field: 'PMSID',
	        title: 'PMS系统编码',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.PMSID;}
	    },{
	        field: 'NAME',
	        title: '名称',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.NAME;}
	    }, {
	    	field: 'BURIEDLENGTH',
	    	title: '埋设长度(米)',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.BURIEDLENGTH;}
	    }, {
	    	field: 'BURIEDWIDTH',
	    	title: '埋设宽度(米)',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.BURIEDWIDTH;}
	    }, {
	    	field: 'STARTPOSITION',
	    	title: '起点井',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.STARTPOSITION;}
	    }, {
	    	field: 'ENDPOSITION',
	    	title: '终点井',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.ENDPOSITION;}
	    }, {
	        field: 'ASSETUNIT',
	        title: '资产单位',
	        align: 'center',
            valign: 'top',
            sortable: true,
            formatter:function(value,row,index){return row.values_.ASSETUNIT;}
	    }, {
	    	field: 'MAINTENANCEUNIT',
	    	title: '维护单位',
	    	align: 'center',
	    	valign: 'top',
	    	sortable: true,
	    	formatter:function(value,row,index){return row.values_.MAINTENANCEUNIT;}
	    }, {
	    	field: '操作',
	    	title: '操作',
	    	align: 'center',
	    	valign: 'middle',
	    	sortable: true,
	    	events: operateEvents,//给按钮注册事件
	    	formatter: operateFormatter//表格中增加按钮
	    }];
		break;
	default:
		break;
	}
	$('#wfsFeatureTable').bootstrapTable({
	    data: features,
	    method:'post',
	    striped: true,
		dataType: "json",
		pagination: true,
		queryParamsType: "limit",
		singleSelect: false,
		contentType: "application/x-www-form-urlencoded",
		pageSize: 10,
		pageNumber:1,
		showColumns: false, //不显示下拉框（选择显示的列）
		sidePagination: "client", 
		queryParams: queryParams,//分页参数
//		clickToSelect: true,
		height: 480,
	    columns:columns 
	});
}
//bootstrap table操作按钮 （查询结果表）
window.operateEvents = {
         'click .RoleOfPosition': function (e, value, row, index) {
        	//将jspanel弹窗缩成一行
 			propertyListWindow.smallify();
 			var feature = row;
 			clearHighlightObj();
 			selectEvent = new ol.interaction.Select();
 			  map.addInteraction(selectEvent);
 			  //设置要素高亮
 			highlightObj =selectEvent.getFeatures(); 
 			highlightObj.push(feature);
 			//获取要素的几何范围
 			 var extent=feature.getGeometry().getExtent();
 		     map.getView().fit(extent,map.getSize());
      }
     };  
/**
 * @requires jQuery
 * 
 * 格式化日期时间
 */
function operationdateFormatter(value) {
	if(value != null){
		return value.substring(0,value.indexOf('Z'));
	}
	return null;
}

//bootstrap table操作按钮 （查询结果表）
function operateFormatter(val,row,index){  
    return  ['<button type="button" class="RoleOfPosition btn btn-default  btn-sm" style="margin-right:15px;">定位</button>'
            ].join('');
      
}  
//设置传入参数
function queryParams(params) {
	return {
		page_pn: params.pageNumber,
		sColumn:params.sort,
		order:params.order,
		page_size: params.limit
//		"search.C_DISASTERNAME*like":'%'+$("#DISASTERNAME").val()+'%',
//		"search.C_DIRECTPERS*like":'%'+$("#DIRECTPERS").val()+'%',
//		"search.C_DISASTERADDR*like":'%'+$("#DISASTERADDR").val()+'%',
//		"search.C_HAPPENDTIME*eq":$("#HAPPENDTIME").val()
	}
};

 

/**
 * JS动态加载
 * @param src js路径
 * @constructor
 */
function LoadJS(src,tableName,callback){
	var css =  document.createElement("link");
	css.type = "text/css";
	css.rel = "stylesheet";
	css.id ="css";
	if(css.readyState){ // IE
		css.onreadystatechange = function(){
			if(css.readyState == "loaded" || css.readyState == "complete"){
				script.onreadystatechange = null;
				if (!$.isEmptyObject(callback)){
					callback();
				}
			}
		};
	}else{ // FF, Chrome, Opera, ...
		css.onload = function(){
			if (!$.isEmptyObject(callback)){
				callback();
			}
		};
	}
	$("#css").remove();
	var findex = src.lastIndexOf("/");
	var lindex = src.lastIndexOf(".");
	var csssrc = src.substr(findex+1,lindex-findex-1);
	css.href = "/css/"+csssrc+"/"+csssrc+".css";
	document.getElementsByTagName("head")[0].appendChild(css);
	
	var script = document.createElement("script");
	script.type = "text/javascript";
	if(script.readyState){ // IE
		script.onreadystatechange = function(){
			if(script.readyState == "loaded" || script.readyState == "complete"){
				script.onreadystatechange = null;
				if (!$.isEmptyObject(callback)){
					callback();
				}else{
					try
						{init(tableName);}
					catch(err)
					{console.info("异步加载的js中，未定义init方法");	}
				}
			}
		};
	}else{ // FF, Chrome, Opera, ...
		script.onload = function(){
			if (!$.isEmptyObject(callback)){
				callback();
			}else{
				try
				{init(tableName);}
				catch(err)
				{console.info("异步加载的js中，未定义init方法");	}
			}
		};
	}
	script.src = src;
	document.getElementsByTagName("head")[0].appendChild(script);
} 
function res(url,outlink,common,self,callback){
	url=url.toLocaleLowerCase();
	var tableName = "";
	var findex = url.lastIndexOf("/");
	var lindex = url.lastIndexOf(".");
	var jssrc = url.substr(findex+1,lindex-findex-1);
	/*if(common == 1){
		tableName = jssrc;
		jssrc = "common";
	}*/
	var js = "/js/"+jssrc+"/"+jssrc+".js";
	if(self != undefined && self !=''){
		var childNodes = self.parentNode.parentNode.parentNode.childNodes;
		$('#center-title').html(childNodes[0].innerText+" / "+self.innerHTML);
	}
	if(outlink==1){
		var content = '<iframe scrolling="no" frameborder="0"  src="'+url+'" style="width:100%;height:100%;"></iframe>';  
	 	$('#center-bottom').html(content);
	}else{
		
		$(".content-top").find("span").eq(4).text(self.innerHTML);
		 $.jsPanel({
		    id:self.innerHTML,
		    //position:    'center',
		    theme:   "#308374",
		    contentSize: {width: 'auto', height: 'auto'},
		    headerTitle: self.innerHTML,
		    border:      '1px solid #066868',
		    contentAjax: {
		   url: url,
		   autoload: true,
		    done: function (data, textStatus, jqXHR, panel) {
         	 LoadJS(js,tableName,callback);
           }
		   },
		   callback:    function () {
		   this.content.css("padding", "5px");
		  }
		 });
		
	}
}

/*var title='test'
var id='test3213416'
var url ="/test/test.action"
function res(url,title,id){
	LoadJS(url);
    $(".content-top").find("span").eq(4).text(title);
	 $.jsPanel({
	 id:			 id,
	 //position:    'center',
	 theme:       "#308374",
	 contentSize: {width: 'auto', height: 'auto'},
	 headerTitle: title,
	 border:      '1px solid #066868',
	 contentAjax: {
	 url: url,
	 autoload: true
	 },
	 callback:    function () {
	 this.content.css("padding", "5px");
	 }
	 });
}
*/
/**//**
 * JS动态加载
 * @param src js路径
 * @constructor
 *//*
function LoadJS(url,callback)
{
    var findex = url.lastIndexOf("/");
    var lindex = url.lastIndexOf(".");
    var jssrc = url.substr(findex+1,lindex-findex-1);
    var js = "js/"+jssrc+".js";
    var css =  document.createElement("link");
    css.type = "text/css";
    css.rel = "stylesheet";
    css.id ="css";
    if(css.readyState){ // IE
        css.onreadystatechange = function(){
            if(css.readyState == "loaded" || css.readyState == "complete"){
                script.onreadystatechange = null;
                if (!$.isEmptyObject(callback)){
                    callback();
                }
            }
        };
    }else{ // FF, Chrome, Opera, ...
        css.onload = function(){
            if (!$.isEmptyObject(callback)){
                callback();
            }
        };
    }
    $("#css").remove();
    css.href = "css/"+jssrc+".css";
    document.getElementsByTagName("head")[0].appendChild(css);

    var script = document.createElement("script");
    script.type = "text/javascript";
    if(script.readyState){ // IE
        script.onreadystatechange = function(){
            if(script.readyState == "loaded" || script.readyState == "complete"){
                script.onreadystatechange = null;
                if (!$.isEmptyObject(callback)){
                    callback();
                }else{
                    try
                    {init();}
                    catch(err)
                    {console.info("异步加载的js中，未定义init方法");	}
                }
            }
        };
    }else{ // FF, Chrome, Opera, ...
        script.onload = function(){
            if (!$.isEmptyObject(callback)){
                callback();
            }else{
                try
                {init();}
                catch(err)
                {console.info("异步加载的js中，未定义init方法");	}
            }
        };
    }
    script.src = js;
    document.getElementsByTagName("head")[0].appendChild(script);
}



}*/