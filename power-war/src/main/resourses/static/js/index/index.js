var map = ""; //openLayers地图
var boxExtent = ""; //矩形、多边形查询的范围
var drawGeometry = ""; //鼠标画几何图形对象
var highlightObj =[]; //查询后的高亮对象
var propertyListWindow=""; //查询结果弹出框对象
var selectEvent ="";
var editObject={}; //编辑对象
var attributeInfoObj=""; //属性信息弹窗对象
$(function () {
//	LoadPage('/default/index.action','/js/index/index.js','default/index.css');
	var raster = new ol.layer.Tile({
        source: new ol.source.OSM()
      });
     
	
    
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
    
    
    
  //初始化书签列表tree
//    initBookMarkTree();
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
   		            "添加":{  
   		                     "label":"添加", 
                             "icon":"/images/1_07.png",
   		                     "action":function(data){
   		                    	clearOnMapEvent();//清除主动添加到地图上的事件
   		                         var inst = jQuery.jstree.reference(data.reference); 
   		                        var obj = inst.get_node(data.reference);
   		                		if(obj.children.length==0 && obj.parent != "#"){
   		                			//获取当前图层及类型
   		                			var layer = obj.original.layer;
   		                			var type = layer.getSource().getFeatures()[0].getGeometry().getType().toLowerCase();
   		                			if(type=="point"){
   		                				type="Point";
   		                			}else if(type=="multilinestring"){
   		                				type="MultiLineString"
   		                			}
   		                			//画矢量图形
   		                			var draw = new ol.interaction.Draw({
   		                	             source: layer.getSource(),
   		                	             geometryName:'SHAPE', 
   		                	             type: (type)
   		                	         });
   		                	         map.addInteraction(draw);
   		                	         draw.on('drawend',function(e) {
   		                	              //保存编辑数据
   		                	              editObject.feature = e.feature;
		                	        	     editObject.source = layer.getSource();
		                	        	     editObject.editType = "add";
		                	        	     editObject.layer_name = queryLayerNameByID(obj.id);
		                	        	     map.removeInteraction(draw);
		                	        	     jsPanelAttributeInfo("/sd_station/sd_station.action","局站数据属性",500,360);
   		                	         }, this);
   		                		}else{
   		                			swal('根节点不能添加!','',"warning");
   		                		}
   		                     }  
   		                 },  
   		              "修改":{  
   		                     "label":"修改",  
   		                     "action":function(data){ 
   		                    	clearOnMapEvent();//清除主动添加到地图上的事件
   		                         var inst = jQuery.jstree.reference(data.reference),  
   		                          obj = inst.get_node(data.reference);
   			                	 if(obj.children.length==0 && obj.parent != "#"){
   			                		 var select = new ol.interaction.Select();
   			                         var modify = new ol.interaction.Modify({
   			                             features: select.getFeatures()
   			                         });
   			                         map.addInteraction(select);
   			                         map.addInteraction(modify);
   			                         modify.on('modifyend', function (e) {
   			                        	var layer = $('#powerLayerTree').jstree().get_node("#"+obj.id).original.layer;
   			                        	 editObject.feature = e.features.getArray()[0];
   		                	        	 editObject.source = layer.getSource();
   		                	        	 editObject.editType = "update";
		                	        	     editObject.layer_name = queryLayerNameByID(obj.id);
//   			                        	 var geomType = e.features.getArray()[0].getGeometry().getType().toLowerCase();
   			                        	 jsPanelAttributeInfo(e.features.getArray()[0]);
   			                             map.removeInteraction(modify);
   			                             map.removeInteraction(select);
   			                         }); 
   			                	 }else{
   			                			swal('根节点不能修改!','',"warning");
   			                	 }
   		                       
   		                     }  
   		                 },
   		                 "删除":{  
   		                     "label":"删除",  
   		                     "action":function(data){ 
   		                    	clearOnMapEvent();//清除主动添加到地图上的事件
   		                         var inst = jQuery.jstree.reference(data.reference); 
   		                        var obj = inst.get_node(data.reference);
   		                		if(obj.children.length==0 && obj.parent != "#"){
   		                			
   		                			var select = new ol.interaction.Select();
   		                	         map.addInteraction(select);
   		                	         select.on('select', function (e) {
   		                	             if(select.getFeatures().getArray().length == 0){
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
   					                     	  function(isConfirm){
   					                     		  if(isConfirm){
   					                     			//获取当前图层及类型
     						                			var layer = $('#powerLayerTree').jstree().get_node("#"+obj.id).original.layer;
//     					                     			operatWFS(e.target.getFeatures(),'delete');
//     				                	                 var geomType = e.target.getFeatures().getArray()[0].getGeometry().getType().toLowerCase();
//     				                	                 var f = vector_Source_point.getFeatureById(e.target.getFeatures().getArray()[0].getId());
     						                			layer.getSource().removeFeature(e.target.getFeatures().getArray()[0]);
     				                	                  e.target.getFeatures().clear();
     				                	                map.removeInteraction(select);
     				                	                swal("删除成功",'',"success"); 
   					                     		  }else{
        					                     		 map.removeInteraction(select);
        					                     	 }
   					                     			
   					                     	 });
   		                	                 
   		                	             }
   		                	         });
   		                			 
   		                		}else{
   		                			swal('根节点不能删除!','',"warning");
   		                		}
   		                     }  
   		                 },  
   		           }
   			     	 /*"items":{
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
   			           }*/
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
    		//判断是否为父节点
    		var is_parent = $('#powerLayerTree').jstree("is_parent",data.node);
    		if(is_parent){
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
    			if(data.node.children.length == 0){
    				//定位到添加的图层位置
    				  var bbox = data.node.original.bounds.split(',');
    				  map.getView().fit(bbox, map.getSize());
    			}
	    });
    	
    	/*$.ajax({
	    	//请求地址                               
	       url:"/T_POWERLAYERS/search.action",
		   data:{},//设置请求参数 
		   type:"post",//请求方法
		   dataType:"json",//设置服务器响应类型
		  //success：请求成功之后执行的回调函数   data：服务器响应的数据
		   success:function(data){
			   for(var i in data){
				   //只加载显示的图层
				   if(data[i].C_ISSHOW == "1"){
					   var html = '<div class="col-sm-6">'+
					   '<a href="#" class="thumbnail" onclick="addWMSLayer('+data[i].C_ID+')">'+
					   '<img src="/images/'+data[i].C_IMAGE+'" alt="...">'+
					   '</a><p style="text-align: center;margin-top: -15px;">'+data[i].C_LAYERNAME+'</p></div>';
					   $('#webServiceLater').append(html);
				   }
			   }
		   }
	   });*/
    	
    		
    	//关闭jspane窗口事件
    	$(document).on('jspanelclosed', function (event, id) {
    		clearHighlightObj();
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


//初始化图层列表tree
function initpowerLayerTree(){
	var powerLayerTree = {id:-1,text: "图层管理",state : {"opened" : true }};
	var treeNodes = new Array();
	$.ajax({
    	//请求地址                               
       url:"/T_POWERLAYERS/search.action",
	   data:{"sort.C_ID":'ASC'},//设置请求参数 
	   type:"post",//请求方法
	   async:false, 
	   dataType:"json",//设置服务器响应类型
	  //success：请求成功之后执行的回调函数   data：服务器响应的数据
	   success:function(data){
			var bounds=[115.902731511993,39.5010013847293,117.174121256339,40.0926220582295];
			var layers = [];
			var treeId=0;
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
			    	attribution:false
			    }).extend([]),
			    target: 'openlayersID',
			    projection: 'EPSG:4326',
			    layers:layers,
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





    
      //添加WMS图层
     /* function addWMSLayer(val){
    	  //图层tree根节点
    	  var root =$('#powerLayerTree').jstree().get_node("#-1");
    	  var childrens = $('#powerLayerTree').jstree("get_children_dom",root);
    	  var falg = true;
    	  //判断此图层是否已添加
    	  for(var i in childrens){
    		  if(childrens[i].id == val){
    			  swal('此图层已添加','',"warning");
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
    					  var wfsParams = {
    						        service : 'WFS',
    						        version : '1.1.0',
    						        request : 'GetFeature',
    						        typeName : data[0].C_LAYER,  //图层名称，可以是单个或多个
    						        outputFormat : 'application/json'//'text/javascript',  //重点，不要改变
    						    };
    				  	 var vector_Source = new ol.source.Vector({
    						    	wrapX: false,
    						        format: new ol.format.GeoJSON(),
    						        url:'http://172.16.15.147:8080/geoserver/wfs?'+ $.param(wfsParams),
    						        strategy: ol.loadingstrategy.bbox,
    						        projection: 'EPSG:2439'
    					 });
    				     var layer = new ol.layer.Vector({
    						   source: vector_Source
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
    	  
      }*/
      
      //查询结果jspanel弹窗绑定关闭事件
      $(document).on('jspanelbeforeclose', function (event, id) {
    	  if(id == "openDialg"){
    		  $('#search').modal('show');//显示查询模态框
    	  }
      });
    //初始化编辑列表tree
      /*function initEdit(){
      	$('#editLayerTree').jstree({
      		"plugins" : ["contextmenu","wholerow"],
      		 "contextmenu":{
                      "show_at_node":false,
      		     	 "items":{
      		            "添加":{  
      		                     "label":"添加",  
      		                     "action":function(data){
      		                    	clearOnMapEvent();//清除主动添加到地图上的事件
      		                    	debugger;
      		                         var inst = jQuery.jstree.reference(data.reference); 
      		                        var obj = inst.get_node(data.reference);
      		                		if(obj.children.length==0 && obj.parent != "#"){
      		                			//获取当前图层及类型
      		                			var layer = $('#powerLayerTree').jstree().get_node("#"+obj.id).original.layer;
      		                			var type = layer.getSource().getFeatures()[0].getGeometry().getType().toLowerCase();
      		                			if(type=="point"){
      		                				type="Point";
      		                			}else if(type=="multilinestring"){
      		                				type="MultiLineString"
      		                			}
      		                			var geometryName = "the_geom";
      		                			//画矢量图形
      		                			var draw = new ol.interaction.Draw({
      		                	             source: layer.getSource(),
      		                	             geometryName:geometryName, 
      		                	             type: (type)
      		                	         });
      		                	         map.addInteraction(draw);
      		                	       draw.on('drawend',function(e) {
      		                	    	     e.feature.set('the_geom',e.feature.getGeometry());
//      		                	    	    editWFSFeature([e.feature],'add','pipeline:DHXPOINT');
      		                	    	     //保存编辑数据
      		                	    	     editObject.feature = e.feature;
  		                	        	     editObject.source = layer.getSource();
  		                	        	     editObject.editType = "add";
  		                	        	     editObject.layer_name = queryLayerNameByID(obj.id);
  		                	        	     map.removeInteraction(draw);
//  		                	        	     jsPanelAttributeInfo();
      		                	         }, this);
      		                		}else{
      		                			swal('根节点不能添加!','',"warning");
      		                		}
      		                     }  
      		                 },  
      		              "修改":{  
      		                     "label":"修改",  
      		                     "action":function(data){ 
      		                    	clearOnMapEvent();//清除主动添加到地图上的事件
      		                         var inst = jQuery.jstree.reference(data.reference),  
      		                          obj = inst.get_node(data.reference);
      			                	 if(obj.children.length==0 && obj.parent != "#"){
      			                		 var select = new ol.interaction.Select();
      			                         var modify = new ol.interaction.Modify({
      			                             features: select.getFeatures()
      			                         });
      			                         map.addInteraction(select);
      			                         map.addInteraction(modify);
      			                         modify.on('modifyend', function (e) {
      			                        	var layer = $('#powerLayerTree').jstree().get_node("#"+obj.id).original.layer;
      			                        	 editObject.feature = e.features.getArray()[0];
      		                	        	 editObject.source = layer.getSource();
      		                	        	 editObject.editType = "update";
 		                	        	     editObject.layer_name = queryLayerNameByID(obj.id);
//      			                        	 var geomType = e.features.getArray()[0].getGeometry().getType().toLowerCase();
      			                        	 jsPanelAttributeInfo(e.features.getArray()[0]);
      			                             map.removeInteraction(modify);
      			                             map.removeInteraction(select);
      			                         }); 
      			                	 }else{
      			                			swal('根节点不能修改!','',"warning");
      			                	 }
      		                       
      		                     }  
      		                 },
      		                 "删除":{  
      		                     "label":"删除",  
      		                     "action":function(data){ 
      		                    	clearOnMapEvent();//清除主动添加到地图上的事件
      		                         var inst = jQuery.jstree.reference(data.reference); 
      		                        var obj = inst.get_node(data.reference);
      		                		if(obj.children.length==0 && obj.parent != "#"){
      		                			
      		                			var select = new ol.interaction.Select();
      		                	         map.addInteraction(select);
      		                	         select.on('select', function (e) {
      		                	             if(select.getFeatures().getArray().length == 0){
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
      					                     	  function(isConfirm){
      					                     		  if(isConfirm){
      					                     			//获取当前图层及类型
        						                			var layer = $('#powerLayerTree').jstree().get_node("#"+obj.id).original.layer;
//        					                     			operatWFS(e.target.getFeatures(),'delete');
//        				                	                 var geomType = e.target.getFeatures().getArray()[0].getGeometry().getType().toLowerCase();
//        				                	                 var f = vector_Source_point.getFeatureById(e.target.getFeatures().getArray()[0].getId());
        						                			layer.getSource().removeFeature(e.target.getFeatures().getArray()[0]);
        				                	                  e.target.getFeatures().clear();
        				                	                map.removeInteraction(select);
        				                	                swal("删除成功",'',"success"); 
      					                     		  }else{
           					                     		 map.removeInteraction(select);
           					                     	 }
      					                     			
      					                     	 });
      		                	                 
      		                	             }
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
      	    	'data' :initEditLayerTree()
      	    }  
      	  });
      }*/

//全幅
function fullView(){
	closeFunction();
	var box= "115.840072190847,39.6361366726513,116.508648762049,40.0926220582295";
	 var bbox = box.split(',');
	  map.getView().fit(bbox, map.getSize());
}

//框选放大
function right_click_box(){
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
//              var asd = ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857');
              // 让地图的zoom增加1，从而实现地图放大
              view.setZoom(view.getZoom() + 1);
              //重新渲染地图
              map.render();
            }, this);
}



//框选查询
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

//组合查询
/*function assemblageQuery(){
	closeFunction();
	openDialg("/attributeList/attributeList.action","查询结果","assemblageQuery");
}*/

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

//过滤字段下拉列表值改变事件
function changeFilterField(val){
	alert(val);
	
}
//框选查询和多边形查询
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
			$(".modal-content").mLoading("show");  
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

//组合查询中的框选查询
/*function regionQuery(){
	var id=$('#powLayes2').val();
	if(id ==""){
		$('#powLayes2').focus();
		swal('请先选择要查询的图层！','',"warning");
	}else{
		//最小化弹出框
		propertyListWindow.minimize();
		var layer_name = queryLayerNameByID(id);
		
		drawGeometry = new ol.interaction.Draw({
	        source:new ol.source.Vector(),
	        type: *//** @type {ol.geom.GeometryType} *//* ('Circle'),
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
	      var extent="";
	      drawGeometry.on('drawstart',
	          function(evt) {
	            // set sketch
	            sketch = evt.feature;
	            *//** @type {ol.Coordinate|undefined} *//*
	            var coord = evt.coordinate;
	            listener = sketch.getGeometry().on('change', function(evt) {
	          	  var geom = evt.target;
	              if (geom instanceof ol.geom.Geometry) {
	                extent = geom.getExtent();
	              }
	            });
	          }, this);

	      drawGeometry.on('drawend',
	          function(event) {
	            sketch = null;
	            clearDrawGeometry();
	            //恢复弹出框
	            propertyListWindow.normalize();
	            $(".modal-content").mLoading("show");
	            queryfeature(layer_name,extent);
	            $(".modal-content").mLoading("hide");
	            ol.Observable.unByKey(listener);
	          }, this);
	}
}
*/



//组合查询
/*function combinationQuery(){
	var id=$('#powLayes2').val();
	if(id ==""){
		$('#powLayes2').focus();
		swal('请先选择要查询的图层！','',"warning");
	}else{
		var layer_name = queryLayerNameByID(id);
		clearDrawGeometry();
		$(".modal-body").mLoading("show"); 
		queryfeature(layer_name);
	}
		$(".modal-body").mLoading("hide");
}*/

//根据id查询图层名称
function queryLayerNameByID(id){
	var layer_name="";
	$.ajax({
	    //请求地址                               
	    url:"/T_POWERLAYERS/search.action",
	    data:{"search.C_ID*eq":id},//设置请求参数 
	     type:"post",//请求方法
	    async:false, 
	    dataType:"json",//设置服务器响应类型
	   //success：请求成功之后执行的回调函数   data：服务器响应的数据
	    success:function(data){
	       if(data!=""){
	    	   var layer = data[0].C_LAYER;
	    	   layer_name = layer.substring(layer.indexOf(':')+1);
	       }
	    }
	}); 
	return layer_name;
}

//根据图层及范围查询要素
/*function queryfeature(layer_name,extent){
	if(extent=="" || extent==undefined){
		extent=[-180.0,-90.0,180.0,90.0];
	}
	var QSDW = $('#communicate').val(); //通讯单位
	var TCDW = $('#detectionUnit').val(); //探测单位
	var SZDL = $('#roadAddress').val(); //所在道路
	var ISLOCK = $('#is_Lock').val(); //是否锁定
	
	var featureRequest = new ol.format.WFS().writeGetFeature({
        srsName: 'EPSG:2439',
        featureNS: 'http://172.16.15.147:8080/pipeline',
        featurePrefix: 'osm',
        featureTypes: [layer_name],
        outputFormat: 'application/json',
        geometryName:"the_geom", 
        filter:ol.format.filter.and(
//      	  ol.format.filter.equalTo('QSDW', '*'),
        		ol.format.filter.bbox('the_geom', extent, 'EPSG:2439'),
        		ol.format.filter.like('QSDW', QSDW ),
        		ol.format.filter.like('SZDL',SZDL),
        		ol.format.filter.like('TCDW', TCDW),
        		ol.format.filter.like('ISLOCK',ISLOCK)
        )
    });

    // 然后发布请求并将接收到数据在表格中显示
    fetch('http://172.16.15.147:8080/geoserver/wfs', {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest)
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        var features = new ol.format.GeoJSON().readFeatures(json);
        if(features.length==0){
            swal('没有查到符合条件的数据','',"warning");
            $('#wfsFeatureTable').bootstrapTable('removeAll');
//            if($("#wfsFeatureTable").datagrid("getData").total != 0){
//            	$('#wfsFeatureTable').datagrid('loadData',{total:0,rows:[]});
//            }
        }else{
        	displayData(features);
        }
    });
}*/
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


//关闭所有
function closeFunction(){
	closePropertyListWindow();
	clearDrawGeometry();
	clearHighlightObj();
	clearMeasureObj();
	clearOnMapEvent();

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



//保存feature
function saveFeature(){
	
	$("#attributeInfo").mLoading("show");
	clearOnMapEvent();//清除主动添加到地图上的事件
	if(editObject !=""){
         var fea = editObject.feature.clone();//此处clone 为为了实现绘制结束后，添加的对象还在，否提交完成后数据就不显示了，必须刷新
           var geo = fea.getGeometry();
            // 调换经纬度坐标，以符合wfs协议中经纬度的位置，epsg:4326 下，取值是neu,会把xy互换，此处需要处理，根据实际坐标系处理
            geo.applyTransform(function(flatCoordinates, flatCoordinates2, stride) {
                     for (var j = 0; j < flatCoordinates.length; j += stride) {
                                  var y = flatCoordinates[j];
                        var x = flatCoordinates[j + 1];
                                 flatCoordinates[j] = x;
                                  flatCoordinates[j + 1] = y;
                            }
                        });
         
             fea.set('SHAPE',geo);
		
		var featureType = editObject.layer_name;
		var editType = editObject.editType;
		//设置featureID
		setFeatureID(fea,featureType);
		
		//获取属性字段的json
		var attributeJson = getFormJson(featureType.toLowerCase()+"_form");
		//设置feature对应的属性
		for(var field in attributeJson){
			fea.set(field,attributeJson[field]);
		}
		
		editWFSFeature([fea],editType,featureType);
		editObject = {};
		//关闭属性弹窗
		attributeInfoObj.close();
		$("#attributeInfo").mLoading("hide");

	}
	 
}

//将序列化对象转json
function getFormJson(form) {
	var o = {};
	var a = $("#"+form).serializeArray();
	$.each(a, function () {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
			    o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
}


//编辑操作
function editWFSFeature(features,editType,featureType){
	var WFSTSerializer =  new ol.format.WFS({
        featureNS: "http://172.16.15.147:8080/anqing",
        featureType: "anqing:"+featureType,
        version:'2.0.0'
    });
    var featObject;
    if(editType == 'add'){
        featObject= WFSTSerializer.writeTransaction(features,
                null, null, {
        	    featureNS: 'http://172.16.15.147:8080/anqing',//为创建工作区时的命名空间URI
                featurePrefix: "anqing",
                version:'2.0.0',
                featureType: featureType, //feature对应图层
                srsName: 'EPSG:4326'// 坐标系
          });
    }else if(editType == 'update') {
        featObject = WFSTSerializer.writeTransaction( null,features, null, {
                    featureNS: 'http://172.16.15.147:8080/pipeline',//为创建工作区时的命名空间URI
                    //featurePrefix: "osm",
                    featureType: featureType,
                    version:'2.0.0',
                    srsName: 'EPSG:2439'// 坐标系}
                });
   }else if(editType == 'delete'){
        featObject= WFSTSerializer.writeTransaction(
                null,null,features, {
                    featureNS: 'http://172.16.15.147:8080/pipeline',//为创建工作区时的命名空间URI
//                    featurePrefix: "osm",
                    version:'2.0.0',
                    featureType: featureType, //feature对应图层
//                featureType:'pipeline:DHXPOINT',
//                    srsName: 'EPSG:3857'// 坐标系
                    srsName: 'EPSG:2439'// 坐标系
                });
    }


    var serializer = new XMLSerializer();
    // 将参数转换为xml格式数据
    var featString = serializer.serializeToString(featObject);
    var request = new XMLHttpRequest();
    request.open('POST', 'http://172.16.15.147:8080/geoserver/wfs?service=wfs');
    request.setRequestHeader('Content-Type', 'text/xml');
    request.send(featString);
     
	swal("保存成功",'',"success");
}

//弹出属性字段信息框
function jsPanelAttributeInfo(url,title,width,height,features){
	attributeInfoObj = $.jsPanel({
		id:          "attributeInfo",
		position:    {right: 20, top: 100},
		theme:       "rebeccapurple",
//		paneltype:   'modal',
		contentSize: {width: width, height: height},
		headerTitle: title,
		contentAjax: {
            url: url,
            autoload: true,
            done: function (data, textStatus, jqXHR, panel) {
            	//图层tree根节点
            	var root =$('#powerLayerTree').jstree().get_node("#-1");
            	var childrens = $('#powerLayerTree').jstree("get_children_dom",root);
            	//新添加的feature在没保存之前都可以移动位置
            	if(editObject.editType == "add"){
            		var select = new ol.interaction.Select();
            	    var modify = new ol.interaction.Modify({
            	        features: select.getFeatures()
            	    });
            	    map.addInteraction(select);
            	    select.on('select', function (e) {
            	    	if(e.selected[0].id_ != undefined){
            	    		e.selected=[];
            	    	}
            	    });
            	    map.addInteraction(modify);
      	      }
            }
        },
	    callback:    function (panel) {
//	        this.content.css("padding", "15px");
	      
	    }
	});
}

//设置featureID
function setFeatureID(feature,featureType){
	$.ajax({
	    //请求地址                               
	    url:"/SYSTEMCODE/search.action",
	    data:{"search.TABLENAME*eq":featureType},//设置请求参数 
	     type:"post",//请求方法
	    async:false, 
	    dataType:"json",//设置服务器响应类型
	   //success：请求成功之后执行的回调函数   data：服务器响应的数据
	    success:function(data){
	       if(data!=""){
	    	   feature.set("ID",data[0].CODE+guid());
	       }
	    }
	});  
}


//生成guid编码
function guid() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}