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
  var geomObj=""; //测量时生成对象的图层

//测量
  function addInteraction(value) {
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
  	var type=""
         if(value == 'area'){
         	$('#measureName').html('面积');
         	type = "Polygon";
         }else if(value == 'length'){
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

        
         var results=""; //测量结果
         var listener=""; //
         drawGeometry.on('drawstart',
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

         drawGeometry.on('drawend',
             function(event) {
               measureTooltipElement.className = 'tooltip tooltip-static';
               measureTooltip.setOffset([0, -7]);
               // unset sketch
               sketch = null;
               // unset tooltip so that a new one can be created
               measureTooltipElement = null;

               if(drawGeometry!=""){
           		map.removeInteraction(drawGeometry);
           		drawGeometry = "";
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

      
      /**
       * Format length output.
       * @param {ol.geom.LineString} line The line.
       * @return {string} The formatted length.
       */
   var formatLength = function(line) {
        var length;
        var geodesic=false; //true:计算平面距离；false:计算球面距离 
        if (geodesic) {
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
        var geodesic=false; //true:计算平面面积；false:计算球面面积 
        if (geodesic) {
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
          output = (area /1000000).toFixed(2) +
              ' ' + 'km<sup>2</sup>';
        } else {
          output = area.toFixed(2) + 
              ' ' + 'm<sup>2</sup>';
        }
        return output;
      };

      
      
      
    //清除测量结果
      function clearMeasure(){
      	clearMeasureObj();
      	$('#measureName').html('测量');
      	$('#measuretext').html('');
      	if(drawGeometry!=""){
      		map.removeInteraction(drawGeometry);
      		drawGeometry = "";
      	}
      	if(measureTooltip!=""){
      		map.removeOverlay (measureTooltip);
      		measureTooltip = "";
      	}
      }
      
    //删除测量对象
      function clearMeasureObj(){
      	if(geomObj !=""){
      		map.removeLayer(geomObj);
      		geomObj="";
      	}
      	 
      	 if(measureTooltip !=""){
      	 	 map.removeOverlay(measureTooltip);
      	 }

      }      