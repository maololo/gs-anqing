var map = "";
var sketch = "";

/**
 * 度量工具提示元素.
 * @type {Element}
 */
var measureTooltipElement = "";


/**
 * 点击继续绘制polygonoverlay显示测量.
 * @type {ol.Overlay}
 */
var measureTooltip = "";



 
  var geomObj=""; //测量时生成的对象
var draw = "";
var flag = 0;
$(function () {
	
	var raster = new ol.layer.Tile({
        source: new ol.source.OSM()
      });
//
//	var format = 'image/png';
//	var bounds = [297500.0001,202600.0323,300000.0001,204200.5024];
//	var untiled = new ol.layer.Image({
//	    source: new ol.source.ImageWMS({
//	        ratio: 1,
//	        url: 'http://172.16.15.114:8080/geoserver/pipeline/wms',
//	        params: {'FORMAT': format,
//	            //'VERSION': '1.1.1',
//	            STYLES: '',
//	            LAYERS: 'pipeline:DHXLINE,pipeline:DHXPOINT',
//	        }
//	    })
//	});
//	var tiled = new ol.layer.Tile({
//        visible: false,
//        source: new ol.source.TileWMS({
//          url: 'http://172.16.15.91:8080/geoserver/pipeline/wms',
//          params: {'FORMAT': format, 
//                   'VERSION': '1.1.1',
//                   tiled: true,
//                STYLES: '',
//                LAYERS: 'pipeline:DHXLINE,pipeline:DHXPOINT',
//             tilesOrigin: 297500.00009999983 + "," + 202600.03680000082
//          }
//        })
//      });
	
//	var layers = [untiled];
//	var projection = new ol.proj.Projection({
//	    code: 'EPSG:2439',
//	    units: 'm',
//	    axisOrientation: 'neu',
//	    global: false
//	});
//	map = new ol.Map({
////	    controls: ol.control.defaults({
////	        attribution: false
////	    }),
//	    controls: ol.control.defaults().extend([
//  	                                          new ol.control.FullScreen()
//  	                                        ]),
//	    target: 'openlayersID',
//	    projection: 'EPSG:4326',
//	    layers: layers,
//	    view: new ol.View({
//	        projection: projection
//	    })
//	});
////	alert(map.getLayers());
//	map.getView().fit(bounds, map.getSize());


	
     
	
    var index=0;
    $(".baseLayer").click(function () {
        index=$(".baseLayer").index(this);
        /*$(".baseLayer span").hide();*/
        $(".baseLayer span").eq(index).slideToggle();
        $(".baseLayer span").not($(".baseLayer span:eq("+index+")")).slideUp();
        alert('已选中第'+index+'张')
    });
    $(".dropdown-menu").on("click", "[data-stopPropagation]", function(e) {
        e.stopPropagation();
    });
    $('#openlayersID').click(function(e) {
        e.stopPropagation();
    });
    $("#foldBtn").click(function () {
        $("#btnGroup").hide();
        $("#expandBtn").show();
    });
    $("#expandBtn").click(function () {
        $("#btnGroup").show();
        $(this).hide();
    });
  /*  $(".settingBtn .choose").click(function () {
        index=$(".settingBtn .choose").index(this);
        $(this).hide();
        $(".unchoose").eq(index).show();
    });
    $(".settingBtn .unchoose").click(function () {
        index=$(".settingBtn .unchoose").index(this);
        $(this).hide();
        $(".choose").eq(index).show();
    });
    

  
    $(".modalUncheck").click(function () {
        $(this).hide();
        $(".modalCheck").show();
        $(".data").show()
    })
    $(".modalCheck").click(function () {
        $(this).hide();
        $(".modalUncheck").show();
        $(".data").hide()
    })
    $(".basecheck").click(function () {
        $(this).hide();
        $(".unbasecheck").show()
    })
    $(".unbasecheck").click(function () {
        $(this).hide();
        $(".basecheck").show()
    })
    */
    
    
    
    /*--------------//测量------------------*/
     

//    var sdsd =ol.proj.toLonLat(bounds);

//      map = new ol.Map({
//    	  controls: ol.control.defaults().extend([
//    	                                          new ol.control.FullScreen()
//    	                                        ]),
//        layers: [raster],
//        target: 'openlayersID',
//        view: new ol.View({
////          center: ol.proj.fromLonLat([114.3935,30.5084], 'EPSG:3857','EPSG:4326'),
//          center:[114.3935,30.5084],
//          projection: 'EPSG:4326',
//          zoom: 10
//        })
//      });
      
      
      
      
       
      //初始化书签列表tree
    		$('#bookMakerTree').jstree({
    			"plugins" : ["contextmenu","wholerow"],
    			 "contextmenu":{
    	                "show_at_node":false,
    			     	 "items":{
    			            "添加书签":{  
    			                     "label":"添加书签",  
    			                     "action":function(data){  
    			                         var inst = jQuery.jstree.reference(data.reference); 
    			                        var obj = inst.get_node(data.reference);
    			                		if(obj.parent == "#"){
    			                			swal({ 
    			                				  title: "书签名称:", 
    			                				  type: "input", 
    			                				  allowEscapeKey: true,
    			                				  showCancelButton: true, 
    			                			      closeOnConfirm: false,
    			                			      animation: "slide-from-top", 
    			                			      confirmButtonColor: "#DD6B55",
    			                		 		  confirmButtonText: "确定",
    			                		 		  cancelButtonText: "取消",
    			                				  inputPlaceholder: "名称" 
    			                				},
    			                				function(inputValue){ 
    			                					if (inputValue === false) return; 
    			                					var name = inputValue.trim();
    			                					
    			                				  if (inputValue == "" || name == "") { 
    			                				    swal.showInputError("书签名称不能为空!");
    			                				    return;
    			                				  }else if(queryField("T_POWERBOOKMARK",name)){
    			                					swal.showInputError("此书签名已存在，请从新输入!");
      			                				    return; 
    			                				  }
    			                				  var view = map.getView(); 
    			                				  $.post('/T_POWERBOOKMARK/save.action',{
    			                						'C_BOOKNAME':name,
    			                						 'C_LONGITUDE':view.getCenter()[0],
    			                						 'C_LATITUDE':view.getCenter()[1],
    			                						 'C_VIEWGRADE':view.getZoom(),
    			                					     'C_ID':""
    			                					    },
    			                					function(result){
    			                					    if(result.success){	
    			                					    	var ref = $('#bookMakerTree').jstree(true),
    		    			                                  sel = ref.get_selected();
    		    			                				  ref.create_node(sel[0], 
    		    	                               		                {text:name,
    		    	                                                     id:result.data.C_ID, 
    		    	                                                     icon:"glyphicon glyphicon-file"},
    		    	                                              "first",
    		    	                                              function() {
    		    	                                                      // alert("added");
    		    	                                                    	 swal("书签添加成功!", "新建书签为: " + name, "success");
    		    	                                               });
    			                					    }
    			                					},"json");		
    			                				});
    			                		}else{
    			                			swal('子节点不能添加书签!','',"warning");
    			                		}
    			                     }  
    			                 },  
    			              "修改书签":{  
    			                     "label":"修改书签",  
    			                     "action":function(data){  
    			                         var inst = jQuery.jstree.reference(data.reference),  
    			                          obj = inst.get_node(data.reference);
    				                	 if(obj.children.length==0 && obj.parent != "#"){
    		                                 swal({ 
   			                				  title: "新书签名称:", 
   			                				  type: "input", 
   			                				  allowEscapeKey: true,
   			                				  showCancelButton: true, 
   			                			      closeOnConfirm: false,
   			                			      animation: "slide-from-top", 
   			                			      confirmButtonColor: "#DD6B55",
   			                		 		  confirmButtonText: "确定",
   			                		 		  cancelButtonText: "取消"
   			                				},
   			                				function(inputValue){ 
   			                					if (inputValue === false) return; 
   			                					var name = inputValue.trim();
   			                					
   			                				  if (inputValue == "" || name == "") { 
   			                				    swal.showInputError("新书签名称不能为空!");
   			                				    return;
   			                				  }else if(queryField("T_POWERBOOKMARK",name)){
   			                					swal.showInputError("此书签名称已存在，请从新输入!");
     			                				    return; 
   			                				  }
   			                				  $.post('/T_POWERBOOKMARK/save.action',{
		                						'C_BOOKNAME':name,
		                					     'C_ID':obj.id
		                					    },
		                					  function(result){
		                					    	if(result.success){
		                					    		var ref = $('#bookMakerTree').jstree(true);
		     		                                   var sel = ref.get_selected();
		     		                                  if(!sel.length) { return false; }
		     		                                   sel = sel[0];
		                					    		ref.rename_node(sel,name);
		                					    		swal(result.title,'',"success");
		                					    	}
		                					  },"json");		
   			                				  });
    				                		}else{
    				                			swal('根节点不能修改!','',"warning");
    				                		}
    			                       
    			                     }  
    			                 },
    			                 "删除书签":{  
    			                     "label":"删除书签",  
    			                     "action":function(data){  
    			                         var inst = jQuery.jstree.reference(data.reference); 
    			                        var obj = inst.get_node(data.reference);
    			                		if(obj.children.length==0 && obj.parent != "#"){
    			                			 swal({
   				                     		  title: "确定删除此书签？",
   				                     		  text: "删除后不可恢复,请谨慎操作!",
   				                     		  type: "warning",
   				                     		  showCancelButton: true,
   				                     		  confirmButtonColor: "#DD6B55",
   				                     		  confirmButtonText: "确定",
   				                     		  cancelButtonText: "取消",
   				                     		  closeOnConfirm: false
   				                     		},
   				                     	function(){
   				                     		$.post('/T_POWERBOOKMARK/delete.action',
   				             					{"ID":obj.original.id},
   				             					function(result){
   				             						if (result.success){    
   				             						   var ref = $('#bookMakerTree').jstree(true),
   	   				                     			   sel = ref.get_selected();
   	   				                     			   if(!sel.length) { return false; }
   	   				                     			   ref.delete_node(sel[0]);
   				             							swal(result.title,'',"success");
   				             						} else {
   				             							swal(result.title,'',"error");
   				             						}
   				             					},'json');
   				                     		});
    			                		}else{
    			                			swal('根节点不能删除!','',"warning");
    			                		}
    			                     }  
    			                 },  
    			                 
    			                 
    			           }
    			          },
    		    'core' : {
    		    	"check_callback" : true ,
    		    	'data' :initBookMarkTree()
    		    }
    		  });
    		
    		//书签管理绑定单击事件 定位到书签场景
    		$('#bookMakerTree').bind('select_node.jstree',function(event, data){
    			var childrens = $('#bookMakerTree').jstree("get_children_dom",data.node);
    			var parent = $('#bookMakerTree').jstree("get_parent",data.node);
    			if(childrens.length==0 && parent != "#"){
    				var id=data.node.original.id;
    				$.ajax({
    					//请求地址                               
    					url:"/T_POWERBOOKMARK/search.action",
    					data:{"search.C_ID*eq":id},//设置请求参数 
    					type:"post",//请求方法
    					dataType:"json",//设置服务器响应类型
    					//success：请求成功之后执行的回调函数   data：服务器响应的数据
    					success:function(data){
    						if(data !=""){
    							var latlng =[data[0].C_LONGITUDE,data[0].C_LATITUDE];
    							var view = map.getView();
        						view.setCenter(latlng);     //设置视图中心坐标
                				view.setZoom(data[0].C_VIEWGRADE); //设置视图显示层级
    						}
    					}
    				});
    			}
    	    });
    	
    	
    	//初始化图层列表
    	$('#powerLayerTree').jstree({
                "plugins" : ["checkbox","contextmenu","wholerow"],
                "checkbox" : {
                     "whole_node" : false,
                    "keep_selected_style" : false,
                      "tie_selection" : false
                   },
                   "contextmenu":{
   	                "show_at_node":false,
   			     	 "items":{
   			               "移除图层":{  
   			                     "label":"移除图层",  
   			                     "action":function(data){  
   			                         var inst = jQuery.jstree.reference(data.reference); 
   			                        var obj = inst.get_node(data.reference);
   			                		if(obj.children.length==0 && obj.parent != "#"){
   			                			if(obj.id=="1" || obj.id=="2"){
   			                				swal('默认图层不能移除!','',"warning");
   			                			}else{
   			                				swal({
     				                     		  title: "确定移除此图层？",
     				                     		  type: "warning",
     				                     		  showCancelButton: true,
     				                     		  confirmButtonColor: "#DD6B55",
     				                     		  confirmButtonText: "确定",
     				                     		  cancelButtonText: "取消",
     				                     		  closeOnConfirm: false
     				                     		},
     				                     	function(){
     				                     		var ref = $('#powerLayerTree').jstree(true),
	   				                     		sel = ref.get_selected();
	   				                     			if(!sel.length) { return false; }
	   				                     		ref.delete_node(sel[0]);
	   				                     	   map.removeLayer(obj.original.layer);
				             				   swal("移除成功",'',"success");		   
     				                        });
   			                			}
   			                		}else{
   			                			swal('根节点不能移除!','',"warning");
   			                		}
   			                     }  
   			                 },  
   			           }
   			          },   
                "core" : {
                  /*'force_text' : true,
                  "themes" : { "stripes" : true },
                  "animation" : 0,*/
                  "check_callback" : true,
                   'data' :initpowerLayerTree()}
    	});
    	//图层勾选事件
    	$('#powerLayerTree').on("check_node.jstree", function (event, data) {
    		var childrens = $('#powerLayerTree').jstree("get_children_dom",data.node);
    		if(childrens.length>0){
    			for(var i=0;i<childrens.length;i++){
    				var id = childrens[i].id;
    				var nodeLayer =$('#powerLayerTree').jstree().get_node("#"+id);
    				nodeLayer.original.layer.setVisible(true);
    			}
    		}else{
    			data.node.original.layer.setVisible(true);
    		}
    	  });
    	//图层取消勾选事件
    	$('#powerLayerTree').on("uncheck_node.jstree", function (event, data) {
    		var childrens = $('#powerLayerTree').jstree("get_children_dom",data.node);
    		if(childrens.length>0){
    			for(var i=0;i<childrens.length;i++){
    				var id = childrens[i].id;
    				var nodeLayer =$('#powerLayerTree').jstree().get_node("#"+id);
    				nodeLayer.original.layer.setVisible(false);
    			}
    		}else{
    			data.node.original.layer.setVisible(false);
    		}
    	});
    	
    	//图层tree绑定单击事件 定位到图层场景
		$('#powerLayerTree').bind('select_node.jstree',function(event, data){
			var childrens = $('#bookMakerTree').jstree("get_children_dom",data.node);
			var parent = $('#bookMakerTree').jstree("get_parent",data.node);
			if(childrens.length==0 && parent != "#"){
				//定位到添加的图层位置
				  var bbox = data.node.original.bounds.split(',');
				  map.getView().fit(bbox, map.getSize());
			}
	    });
    	
    	$.ajax({
	    	//请求地址                               
	       url:"/T_POWERLAYERS/search.action",
		   data:{},//设置请求参数 
		   type:"post",//请求方法
//		   async:false, 
		   dataType:"json",//设置服务器响应类型
		  //success：请求成功之后执行的回调函数   data：服务器响应的数据
		   success:function(data){
			   for(var i in data){
				   //只加载显示的图层
				   if(data[i].C_ISSHOW == "1"){
					   var html = '<div class="col-sm-6">'+
					   '<a href="#" class="thumbnail" onclick="andWMSLayer('+data[i].C_ID+')">'+
					   '<img src="/images/'+data[i].C_IMAGE+'" alt="...">'+
					   '</a><p style="text-align: center;margin-top: -15px;">'+data[i].C_LAYERNAME+'</p></div>';
					   $('#webServiceLater').append(html);
				   }
			   }
		   }
	   });
    	
})

//初始化书签列表tree
function initBookMarkTree(){
	var bookMarkTree = {id:-1,text: "书签管理",state : {"opened" : true }};
	var treeNodes = new Array();
	$.ajax({
    	//请求地址                               
       url:"/T_POWERBOOKMARK/search.action",
	   data:{},//设置请求参数 
	   type:"post",//请求方法
	   async:false, 
	   dataType:"json",//设置服务器响应类型
	  //success：请求成功之后执行的回调函数   data：服务器响应的数据
	   success:function(data){
		   for(var i in data){
			   treeNodes[i] = {text:data[i].C_BOOKNAME,id:data[i].C_ID, icon:"glyphicon glyphicon-file"}
		   }
	   }
   });
	bookMarkTree.children=treeNodes;
	var arr = [bookMarkTree];
	return arr;
}

var layerImages =[];
//初始化图层列表tree
function initpowerLayerTree(){
	var powerLayerTree = {id:-1,text: "图层管理",state : {"opened" : true }};
	var treeNodes = new Array();
	$.ajax({
    	//请求地址                               
       url:"/T_POWERLAYERS/search.action",
	   data:{},//设置请求参数 
	   type:"post",//请求方法
	   async:false, 
	   dataType:"json",//设置服务器响应类型
	  //success：请求成功之后执行的回调函数   data：服务器响应的数据
	   success:function(data){
		   var format = 'image/png';
			var bounds = [297500.0001,202600.0323,300000.0001,204200.5024];
			
			var layers = [];
			for(var i in data){
				var layer = new ol.layer.Image({
					source: new ol.source.ImageWMS({
						ratio: 1,
						url: data[i].C_LAYERURL,
						params: {'FORMAT': 'image/png',
							//'VERSION': '1.1.1',
							STYLES: '',
							LAYERS: data[i].C_LAYER,
						}
					})
				});
				//只加载默认图层在地图上
				if(data[i].C_ISDEFAULTLAYER=="1"){
//					layers.push(layer);
					layerImages.push(layer);
					treeNodes[i] = {text:data[i].C_LAYERNAME,id:data[i].C_ID,layer:layer,bounds:data[i].C_BBOX,icon:"glyphicon glyphicon-file",state:{checked:true}}
				}
			}
			var projection = new ol.proj.Projection({
			    code: 'EPSG:2439',
			    units: 'm',
			    axisOrientation: 'neu',
			    global: false
			});
			//初始化地图
			map = new ol.Map({
//			    controls: ol.control.defaults({
//			        attribution: false
//			    }),
			    controls: ol.control.defaults().extend([
		  	           new ol.control.FullScreen()
		  	         ]),
			    target: 'openlayersID',
			    projection: 'EPSG:4326',
			    layers: layerImages,
			    view: new ol.View({
			        projection: projection
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



//判断数据库T_POWERBOOKMARK表里是否存在此标签名(标签名称)
// 返回   false：数据库没有此数据；  true：数据库有此数据
function queryField(value){
	var flag="";
	$.ajax({
    	//请求地址                               
       url:"/T_POWERBOOKMARK/search.action",
	   data:{"search.C_BOOKNAME*eq":value},//设置请求参数 
	   type:"post",//请求方法
	   async:false, 
	   dataType:"json",//设置服务器响应类型
	  //success：请求成功之后执行的回调函数   data：服务器响应的数据
	   success:function(data){
		   if(data==""){
			   flag=false; 
		   }else{
			   flag=true;
		   }
	   }
   });
	return flag;
}

    
      //添加WMS图层
      function andWMSLayer(val){
    	  //图层tree根节点
    	  var root =$('#powerLayerTree').jstree().get_node("#-1");
    	  var childrens = $('#powerLayerTree').jstree("get_children_dom",root);
    	  var falg = true;
    	  //判断此图层是否已添加
    	  for(var i in childrens){
    		  if(childrens[i].id == val){
    			  alert("图层已添加");
    			  falg = false;
    			  break;
    		  }
    	  }
    	  if(falg){
    		  $.ajax({
    			  //请求地址                               
    			  url:"/T_POWERLAYERS/search.action",
    			  data:{"search.C_ID*eq":val},//设置请求参数 
    			  type:"post",//请求方法
//  		   async:false, 
    			  dataType:"json",//设置服务器响应类型
    			  //success：请求成功之后执行的回调函数   data：服务器响应的数据
    			  success:function(data){
    				  if(data !=""){
    					  var format = 'image/png';
    					  var layer = new ol.layer.Image({
    						  source: new ol.source.ImageWMS({
    							  ratio: 1,
    							  url: data[0].C_URL,
    							  params: {'FORMAT': format,
    								  //'VERSION': '1.1.1',
    								  STYLES: '',
    								  LAYERS: data[0].C_LAYER,
    							  }
    						  })
    					  });
    					  var ref = $('#powerLayerTree').jstree(true);
    					  ref.create_node(root, 
    						  {text:data[0].C_LAYERNAME,
    						  id:data[0].C_ID,
    						  layer:layer,
    						  bounds:data[0].C_BBOX,
    						  icon:"glyphicon glyphicon-file",
    						  state:{checked:true}},
                            "last",
                            function() {
    							  //定位到添加的图层位置
    							  var bbox = data[0].C_BBOX.split(',');
    							  map.getView().fit(bbox, map.getSize());
                             });
    					  
    				  }
    			  }
    		  });
    	  }
    	  
      }
   
 //删除图层及其节点     
function removeNode(){
	var ref = $('#bookMakerTree').jstree(true),
	sel = ref.get_selected();
	if(!sel.length) { return false; }
		   ref.delete_node(sel[0]);
} 
      
 //删除测量对象
function clearMeasureObj(){
	if(geomObj !=""){
		map.removeLayer (geomObj);
		geomObj="";
	}
	 
	 if(measureTooltip !=""){
	 	 map.removeOverlay (measureTooltip);
	 }

}

//全幅
function fullView(){
	var box= "297500.0001,202600.0323,300000.0001,204200.5024";
	 var bbox = box.split(',');
	  map.getView().fit(bbox, map.getSize());
}

//框选放大
function right_click_box(){
	  draw = new ol.interaction.Draw({
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
        map.addInteraction(draw);

        var coord ="";
        draw.on('drawstart',
            function(evt) {
              // set sketch
              sketch = evt.feature;
              /** @type {ol.Coordinate|undefined} */
              coord = evt.coordinate;
              listener = sketch.getGeometry().on('change', function(evt) {
            	  var geom = evt.target;
                if (geom instanceof ol.geom.Geometry) {
                  var extent = geom.getExtent();
                  coord  = ol.extent.getCenter(extent);
                }
              });
            }, this);

        draw.on('drawend',
            function(event) {
              sketch = null;
              if(draw!=""){
            	  map.removeInteraction(draw);
            	  draw = "";
              }
              
              var view = map.getView();
              view.setCenter(coord);
              // 让地图的zoom增加1，从而实现地图放大
              view.setZoom(view.getZoom() + 1);
              map.render();
              ol.Observable.unByKey(listener);
            }, this);
}


//测量
 function addInteraction(value) {
	 clearMeasureObj();
 	flag = 1;
 	
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
        if(value == 'area'){
        	$('#measureName').html('面积');
        	type = "Polygon";
        }else if(value == 'length'){
        	$('#measureName').html('长度');
        	type = "LineString";
        }else if(value == 'circle'){
        	type = "Circle";
        }
        draw = new ol.interaction.Draw({
          source: geomObj.getSource(),
          type: /** @type {ol.geom.GeometryType} */ (type),
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
        map.addInteraction(draw);

        createMeasureTooltip();

       
        var results=""; //测量结果
        draw.on('drawstart',
            function(evt) {
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

        draw.on('drawend',
            function(event) {
              measureTooltipElement.className = 'tooltip tooltip-static';
              measureTooltip.setOffset([0, -7]);
              // unset sketch
              sketch = null;
              // unset tooltip so that a new one can be created
              measureTooltipElement = null;

              if(draw!=""){
          		map.removeInteraction(draw);
          		draw = "";
          	 }

              ol.Observable.unByKey(listener);
              $('#measuretext').html(results);
            }, this);
      }

      /**
       * Creates a new measure tooltip
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

      var geodesicCheckbox=true;
      /**
       * Format length output.
       * @param {ol.geom.LineString} line The line.
       * @return {string} The formatted length.
       */
      var formatLength = function(line) {
        var length;
        if (geodesicCheckbox) {
          var coordinates = line.getCoordinates();
          length = 0;
          var sourceProj = map.getView().getProjection();
          var wgs84Sphere = new ol.Sphere(6378137);
          for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
            var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
            var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
            length += wgs84Sphere.haversineDistance(c1, c2);
          }
        } else {
          length = Math.round(line.getLength() * 100) / 100;
        }
        var output;
        if (length > 10000) {
          output = (Math.round(length / 1000 * 100) / 100) +
              ' ' + 'km';
        } else {
          output = (Math.round(length * 100) / 100) +
              ' ' + 'm';
        }
        return output;
      };


      /**
       * Format area output.
       * @param {ol.geom.Polygon} polygon The polygon.
       * @return {string} Formatted area.
       */
      var formatArea = function(polygon) {
        var area;
        if (geodesicCheckbox) {
          var sourceProj = map.getView().getProjection();
          var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
              sourceProj, 'EPSG:4326'));
          var coordinates = geom.getLinearRing(0).getCoordinates();
          var wgs84Sphere = new ol.Sphere(6378137);
          area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
        } else {
          area = polygon.getArea();
        }
        var output;
        if (area > 100000) {
          output = (Math.round(area / 1000000 * 100) / 100) +
              ' ' + 'km<sup>2</sup>';
        } else {
          output = (Math.round(area * 100) / 100) +
              ' ' + 'm<sup>2</sup>';
        }
        return output;
      };


function changeIcon(name) {
    $("#icontext").text(name)
}
function check(classname) {
    $(".check").click(function () {
        $(this).hide();
        $(".uncheck").show()
    })
}
function uncheck() {
    $(".uncheck").click(function () {
        $(this).hide();
        $(".check").show()
    })
}

//清除测量结果
function clearMeasure(){
	clearMeasureObj();
	$('#measureName').html('测量');
	$('#measuretext').html('');
	if(draw!=""){
		map.removeInteraction(draw);
		draw = "";
	}
	if(measureTooltip!=""){
		map.removeOverlay (measureTooltip);
		measureTooltip = "";
	}
}

//隐藏和显示
function showAndHide(hinedid){
        var att = document.getElementById(hinedid).style.display;
        if(att=="none"){
            $("#"+hinedid).show();
            $("#"+hinedid).attr("display","block");
        }else{
            $("#"+hinedid).hide();
            $("#"+hinedid).attr("display","none");
        }
}

// 向左移动地图
function moveToLeft() {
    var view = map.getView();
    var mapCenter = view.getCenter();
    var xy = map.getPixelFromCoordinate(mapCenter);
    // 让地图中心的x值增加，即可使得地图向左移动，增加的值根据效果可自由设定
    xy[0] = xy[0] + 400;
    var latlng = map.getCoordinateFromPixel(xy);
    view.setCenter(latlng);
    map.render();
}

// 向右移动地图
function moveToRight() {
    var view = map.getView();
    var mapCenter = view.getCenter();
    var xy = map.getPixelFromCoordinate(mapCenter);
    // 让地图中心的x值减少，即可使得地图向右移动，减少的值根据效果可自由设定
    xy[0] = xy[0] - 400;
    var latlng = map.getCoordinateFromPixel(xy);
    view.setCenter(latlng);
    map.render();
}

// 向上移动地图
function moveToUp() {
    var view = map.getView();
    var mapCenter = view.getCenter();
    var xy = map.getPixelFromCoordinate(mapCenter);
    // 让地图中心的y值减少，即可使得地图向上移动，减少的值根据效果可自由设定
    xy[1] = xy[1] - 350;
    var latlng = map.getCoordinateFromPixel(xy);
    view.setCenter(latlng);
    map.render();
}

// 向下移动地图
function moveToDown() {
    var view = map.getView();
    var mapCenter = view.getCenter();
    var xy = map.getPixelFromCoordinate(mapCenter);
    // 让地图中心的y值增加，即可使得地图向下移动，增加的值根据效果可自由设定
    xy[1] = xy[1] + 350;
    var latlng = map.getCoordinateFromPixel(xy);
    view.setCenter(latlng);
    map.render();
}

// 移动到成都
function moveToChengDu() {
    var view = map.getView();
    // 设置地图中心为成都的坐标，即可让地图移动到成都
    view.setCenter(ol.proj.transform([104.06, 30.67], 'EPSG:4326', 'EPSG:3857'));
    map.render();
}

// 放大地图
function zoomIn() {
    var view = map.getView();
    // 让地图的zoom增加1，从而实现地图放大
    view.setZoom(view.getZoom() + 1);
}

// 缩小地图
function zoomOut() {
    var view = map.getView();
    // 让地图的zoom减小1，从而实现地图缩小
    view.setZoom(view.getZoom() - 1);
}

function radioQuery(){
	  map.on('singleclick', function(evt) {
		  alert();
	        document.getElementById('nodelist').innerHTML = "Loading... please wait...";
	        var view = map.getView();
	        var viewResolution = view.getResolution();
	        var source = layerImages[0].get('visible') ? layerImages[0].getSource() : layerImages[1].getSource();
	        var url = source.getGetFeatureInfoUrl(
	          evt.coordinate, viewResolution, view.getProjection(),
	          {'INFO_FORMAT': 'text/html', 'FEATURE_COUNT': 50});
	        if (url) {
	        	$("#nodelist").show();
	          document.getElementById('nodelist').innerHTML = '<iframe seamless src="' + url + '"></iframe>';
	        }
	      });
}
