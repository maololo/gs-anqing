


//DIV隐藏和显示
function showAndHide(hinedid){
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
}







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
