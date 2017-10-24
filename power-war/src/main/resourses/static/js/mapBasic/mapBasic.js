


//DIV隐藏和显示
/*function showAndHide(hinedid){
	closePropertyListWindow();
	clearDrawGeometry();
	clearHighlightObj();
        if(hinedid=="bookMakerSelect"){
        	$("#editLayerSelect").hide();
            $("#editLayerSelect").attr("display","none");
        }else{
        	$("#bookMakerSelect").hide();
            $("#bookMakerSelect").attr("display","none");
        }
        
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
}*/

window.eventsEquipmentinfo = {
        'click .RoleOfdDeldte': function (e, value, row, index) {
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
        		$.post('/T_EQUIPMENT/delete.action',
              		{
              	     "ID":row.C_ID
              		},
              		function(result){
              			if (result.success){    
              				swal(result.title,'',"success");
              				$('#equipmentinfoTable').bootstrapTable('refresh');
                          } else {
                          	swal(result.title,'',"error");
                          }
                 },'json');
        		});
        },
        'click .RoleOfEdit': function (e, value, row, index) {
        	rowData = row;
        	closeEquipment();
            openEquipmentDailog('/equipment/equipmentAdd.action','设备信息');
        },
        'click .RoleOfImage': function (e, value, row, index) {
        	closeEquipment();
            openEquipmentDailog('/equipment/imgMessage.action','图片信息');
        },
        'click .RoleOfToEquipment': function (e, value, row, index) {
        	closePropertyListWindow();
        	var stationID = row.C_STATIONID;
        	// 获取查询图层类型
			var layerName = queryLayerNameByPMSID(stationID.substring(0,4));
			var node = getLayerNodeByName(layerName);
			var features = node.layer.getSource().getFeatures();
			var feature = '';
			for(var i in features){
				if(features[i].values_.ID==stationID){
					feature = features[i];
					break;
				}
			}
			openDialg("/attributeList/attributeList.action", node.text+"表信息","queryAll", [feature],layerName);
        }
    };



//设置传入参数
function queryParamsEquipmentinfo(params) {
	var params={
				page_pn: params.pageNumber,
				sColumn:params.sort,
				order:params.order,
				page_size: params.limit,
				"search.C_STATIONID*eq":filterFieldID
		}
		filterFieldID = "";
	return params;
};

function formatterEquipmentinfo(val,row,index){
	var icon = ""
	if(row.C_TYPE == "ODF"){
		icon = '<button class="RoleOfPosition btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="光交图"><span class="gj_icon" style="display:block;" ></span></button>'+
			   '<button class="RoleOfPosition btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="配线信息"><span class="pxinfo_icon" style="display:block;" ></span></button>'+
			'<button class="RoleOfPosition btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="配线模块"><span class="pxmodule_icon" style="display:block;" ></span></button>';
	}else if(row.C_TYPE == "分光器"){
		icon ='<button class="RoleOfPosition btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="分光器"><span class="fgq_icon" style="display:block;" ></span></button>';
	}
    return  [icon+'<button class="RoleOfImage  btn btn-sm rolebtn" style="background: none;outline:none;color: #0ad6bd" title="图片查看"><span  class=" glyphicon glyphicon-picture  " ><span></button>',
    	'<button class="RoleOfEdit btn btn-sm rolebtn" style="background: none;outline:none;color:#308374" title="修改"><span  class=" glyphicon glyphicon-edit " ><span></button>',
        '<button class="RoleOfdDeldte  btn btn-sm rolebtn" style=" background: none;outline:none;color:red" title="删除"><span  class=" glyphicon glyphicon-trash " ><span></button>',
        '<button class="RoleOfToEquipment  btn btn-sm rolebtn" style="background: none;outline:none;color: #6688b5" title="局站"><span  class=" glyphicon glyphicon-retweet " ><span></button>',
    ].join('');
}



