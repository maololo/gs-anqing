$(function(){
	showMenu();  //初始化导航
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
function res(url,outlink,common,self,callback){
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
			  maximizedMargin: {
		             top:    100,
		             left:   170
		         },
		    id:self.innerHTML,
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