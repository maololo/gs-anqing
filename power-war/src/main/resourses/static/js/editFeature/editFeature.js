
$(function () {
	
});






//取消保存
function unSaveFeature(){
	clearOnMapEvent();//清除主动添加到地图上的事件
	if(editObject.editType == "add"){
		var source = editObject.source;
		source.removeFeature(editObject.feature);
	}
	if(editObject !=""){
		editObject = {};
	}
	if(attributeInfoObj != ""){
		attributeInfoObj.close();
	}
}

//编辑列表   tree节点获取
function initEditLayerTree(){
	var editLayerTree = {id:-1,text: "编辑类型",state : {"opened" : true }};
	//获取图层管理树的节点的id
	 var childrensID =$('#powerLayerTree').jstree().get_node("#-1").children;
	 var treeNodes=[];
	 for(var i=0;i<childrensID.length;i++){
		 //根据id获取绑定在tree节点上的数据
		 var node = $('#powerLayerTree').jstree().get_node("#"+childrensID[i]).original;
	     treeNodes[i] = {text:node.text,layer:node.layer,id:node.id,icon:"glyphicon glyphicon-file"}
	 }
	 editLayerTree.children=treeNodes;
	var arr = [editLayerTree];
	return arr;
}




/*发送wfs请求*/
function addWfs(features) {
	var nodeLayer =$('#powerLayerTree').jstree().get_node("#"+2);
	var pointLayer = nodeLayer.original.layer;
	
      var WFSTSerializer = new ol.format.WFS();
      // 添加要素
      var featObject = WFSTSerializer.writeTransaction(features,
        null, null, {
    	  featureNS: 'http://172.16.15.147:8080/pipeline',//为创建工作区时的命名空间URI
    	  featurePrefix: "osm", 
          featureType: 'DHXPOINT', //feature对应图层
          srsName: 'EPSG:2439'// 坐标系
        });
//      var request = new XMLHttpRequest();
//      request.open('POST', 'http://172.16.15.147:8080/geoserver/wfs?service=wfs');
//      request.setRequestHeader('Content-Type', 'text/xml');
//      request.send(featString);
      
      
      /*var serializer = new XMLSerializer();
      // 将参数转换为xml格式数据
      var featString = serializer.serializeToString(featObject);
      
      $.ajax('http://172.16.15.147:8080/geoserver/wfs',{  
          type: 'POST',  
          dataType: 'xml',  
          processData: false,  
          contentType: 'text/xml',  
          data: featString  
      }).done();  */
      
    }



/** TRANSACTION FUNCTION */  
function transact(transType, feat, geomType) { 
	var nodeLayer =$('#powerLayerTree').jstree().get_node("#"+2);
	var pointLayer = nodeLayer.original.layer;
	
    var formatWFS = new ol.format.WFS();  
    var formatGML = new ol.format.GML({  
        featureNS: 'http://172.16.15.147:8080/pipeline', // Your namespace  
        featureType: pointLayer, //此处填写图层名称，本程序中图层名称依次为point、line和polygon，  
                               //是通过要素几何类型获取的，有一定的特殊性，容易被迷惑  
        srsName: 'EPSG:2439'  
    });  
    switch (transType) {  
        case 'insert':  
            node = formatWFS.writeTransaction([feat], null, null, formatGML);  
            break;  
        case 'update':  
            node = formatWFS.writeTransaction(null, [feat], null, formatGML);  
            break;  
        case 'delete':  
            node = formatWFS.writeTransaction(null, null, [feat], formatGML);  
            break;  
    }  

   var  s = new XMLSerializer();  
   var  str = s.serializeToString(node);  
    console.log(str);  
    $.ajax('http://172.16.15.147:8080/geoserver/wfs',{  
        type: 'POST',  
        dataType: 'xml',  
        processData: false,  
        contentType: 'text/xml',  
        data: str  
    }).done();  

}