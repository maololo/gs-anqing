$(function(){
	showMenu();  //初始化导航
	
	$.extend( $.validator, {
		messages: {
			required: "不能为空"
		}
	});
});


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
	        				if(childrenData[j].id!="51"){
	        					left_nav1_menu = left_nav1_menu+"<li ><a href='javascript:;' onclick=res('"+childrenData[j].attributes.C_URL+"','"+childrenData[j].attributes.C_ISOUTLINK + "','"+childrenData[j].attributes.C_ISCOMMON + "',this);>"+childrenData[j].text+"</a></li>";
	        					left_nav2_menu = left_nav2_menu+"<li ><a href='javascript:;' onclick=res('"+childrenData[j].attributes.C_URL+"','"+childrenData[j].attributes.C_ISOUTLINK + "','"+childrenData[j].attributes.C_ISCOMMON + "',this);>"+childrenData[j].text+"</a></li>";
	        				}
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

function res(url, outlink, common, self, callback){
	var url = url.toLowerCase();
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
		
		var jsPanelID = window.jsPanel.activePanels.list;
		for(var i in jsPanelID){
			if(jsPanelID[i] == jssrc+1){
				jsPanel.activePanels.getPanel(jsPanelID[i]).close();
				break;
			}else if(jsPanelID[i] == jssrc){ //如果此弹出框存在就将面板标准化到之前的位置
				jsPanel.activePanels.getPanel(jsPanelID[i]).normalize();
				jsPanel.activePanels.getPanel(jsPanelID[i]).front();
				return;
			}
		}
		
		$(".content-top").find("span").eq(4).text(self.innerHTML);
		
		 $.jsPanel({
			 maximizedMargin: {
	             top:    0,
	             left:   10
	         },
	         dragit: {
	             containment: [0, 0, 0,0]
	         },
		    id:jssrc,
		    theme:   "#308374",
		    position: {
	             my:  'center-top',
	             at:  'center-top',
	         },
            onwindowresize: true,
            container: "#right-sidebar",
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

function resPopover(url,title,callback){
	var tableName = "";
	var url = url.toLowerCase();
	var findex = url.lastIndexOf("/");
	var lindex = url.lastIndexOf(".");
	var jssrc = url.substr(findex+1,lindex-findex-1);
	var js = "/js/"+jssrc+"/"+jssrc+".js";
	var jsPanelID = window.jsPanel.activePanels.list;
	for(var i in jsPanelID){
		if(jsPanelID[i] == jssrc+1 || jsPanelID[i] == jssrc){
			jsPanel.activePanels.getPanel(jsPanelID[i]).close();
			break;
		}
	}
	 $.jsPanel({
		  maximizedMargin: {
	             top:    100,
	             left:   170
	         },
	    dragit: {containment: [100, 0, 0,160]},
	    id:jssrc+1,
	    theme:   "#308374",
	    contentSize: {width: 'auto', height: 'auto'},
	    headerTitle: title,
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

/** 公用方法 BEGIN **/
// 判断是否都是数字
function isDigit(str) {
    var reg = /^\d+$/;
    return reg.test(str);
};

// 判断某个元素是否在数组内
function contains(arr, obj) {  
    var i = arr.length;  
    while (i--) {  
        if (arr[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
} 

// 判断字符串是否为空     判断对象是否为空直接用$.isEmptyObject
function isEmpty(val){
	if(val == undefined || val == "" || val == null){  
		return true;
	} else {
		return false;
	}
}

// 初始化页面表单元素为JSON格式
$.fn.serializeJson = function(){  
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

// 度 格式验证经度  保留六位小数
function validLonDu(val){
	if(val.trim()==""){
		return false;
	}
	var lonReg= /^-?((0|1?[0-7]?[0-9]?)(([.][0-9]{1,6})?)|180(([.][0]{1,6})?))$/;
    var state = lonReg.test(val);   
    if(state){  
        return true;  
    }else{  
        return false;  
    }  
}

// 度分秒 格式验证经度 保留六位小数
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

// 度 格式验证纬度 保留六位小数
function validLatDu(val){
	if(val.trim()==""){
		return false;
	}
	var latReg= /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,6})?)|90(([.][0]{1,6})?))$/; 
	var state =  latReg.test(val);   
   	if(state){  
   		return true;  
   	}else{  
   		return false;  
   	}  
}

// 度分秒 格式验证纬度 保留六位小数
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

// 将度转换成为度分秒  保留整数
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
	var m = parseInt(temp);
	return d + "°" + f + "′" + m + "″";  
}

// 度分秒转换成为度  保留六位小数
function dFMConvertDu(value) {
	var d  = value.split("°")[0];  
    var f = value.split("°")[1].split("′")[0];  
    var m = value.split("°")[1].split("′")[1].split('″')[0];
	var f = parseFloat(f) + parseFloat(m/60);
	var du = parseFloat(f/60) + parseFloat(d);		
	return du.toFixed(6);
}

/**
 * 根据编号和模型名称取图层数据
 * code 数据编号
 * tableName 模型名称
 */
function getFeatureObjByCodeAndModel(code, tableName){
	var fObj;
	if(!isEmpty(code)){
		var node = getLayerNodeByName(tableName);
    	if(!$.isEmptyObject(node)){
    		var features = node.layer.getSource().getFeatures();
    		if(!$.isEmptyObject(features)){
    			for(var i in features){
	    			var obj = features[i].values_;
	    			if(!$.isEmptyObject(obj) && !isEmpty(obj.ID)){
	    				if(code == obj.ID){
	    					fObj = obj;
	    					break;
	    				}
	    			}
	    		}
    		}
    	}
	}
	return fObj;
}

/**
 * 根据参数和模型名称取表对象数据
 * param 查询参数
 * tableName 模型名称
 */
function getTableObjByParamAndModel(param, tableName){
	var tableObj;
	$.ajax({
		url: "/" + tableName + "/search.action",
    	data: param,
    	type: "post",
        dataType: "Json",
        async:false,
        success: function (data) {
            tableObj = data;
        }
    })
	return tableObj;
}

/** 公用方法 END **/

