var popupPage="";

$(function(){
	showMenu();
	$(".hamburger").click(function() {
		$(".main .left-nav").css("display", "none");
		$("#center-left").css("width", "70px");
		$(".layout-split-west").css("width", "70px");
		$(".layout-panel-center").css("left", "70px");
		$(".panel-header").css("width", "1850px");
		$(this).css("display", "none");
		$(".hamburgerimg").css("display", "inline-block");
	});
	$(".hamburgerimg").click(function() {
		$(".main .left-nav").css("display", "inline-block");
		$("#center-left").css("width", "160px");
		$(".layout-split-west").css("width", "160px");
//		$(".layout-panel-center").css("left", "160px");
		$(this).css("display", "none");
		$(".hamburger").css("display", "inline-block");
	});
	//子页面默认页面
/*	$('#center-bottom').panel({
		href:defurl
	});*/
	//res('index/index.action','statics/script/default.js');
	{
		$(".sub-menu:first>div").children("a").eq(0).css('background','#01675e');
		//$(".sub-menu:first").css("display","block");
	}
	$(".menu").click(function(){
		var $arrow = $(this).find(".right");
		var vSrc = $arrow.attr("src");
		if (vSrc == "/images/home-page-pandect/choice-right.png") {
			$arrow.attr("src", "/images/home-page-pandect/choice-down.png");
		} else {
			$arrow.attr("src", "/images/home-page-pandect/choice-right.png");
		}
		$(this).siblings(".sub-menu").slideToggle("slow");
	});

	$(".sub-menu>div").children("a").click(function(){
		$(this).parent().siblings().find("a").css('background','');
		$(".sub-menu>div").siblings().find("a").css('background','');
		$(this).css('background','#01675e');
	});
	$("#APPTYPE").combobox({
		url: '/T_B_APPMANAGER/search.action?search.C_STATUS*eq=1&sort.C_SORT_NUMBER=ASC',
		method: 'post',
		valueField:"C_URL",   
		textField:"C_APPNAME",  
		required:false,
		onSelect: function(obj){
//			document.forms[0].action="/systemSwith/systemSwith.action?url="+obj.C_URL;
//			document.forms[0].submit();
			window.location.href=obj.C_URL;
		}
	});
	initLogo();
	initUserName();
});

function initLogo(){
	$.ajax({
        url:'/t_b_appmanager/search.action?columnNames=C_LOGOPATH,C_APPDESC',
        type:'POST',
        data:{"search.C_URL*eq":'/sys/index.action'},
        dataType:'json',    
        success:function(result,textStatus,jqXHR){
        	if(result[0]=="" || result[0]!=null){
        		var imgpath = "/upload/"+result[0].C_LOGOPATH;	
                var desc = result[0].C_APPDESC;
                if(result[0].C_LOGOPATH!=null&& result[0].C_LOGOPATH!=''){
                	$("#logo").attr("src",imgpath);
                }
//                $("#sysTitle").html(desc);
                $("#APPTYPE").combobox("setValue",'/sys/index.action');
        	}
        },
        error:function(xhr,textStatus){
          
        }
    })
}

/**
 * JS动态加载
 * @param src js路径
 * @constructor
 */
function LoadJS(src,tableName,callback)
{
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
	if(common == 1){
		tableName = jssrc;
		jssrc = "common";
	}
	var js = "/js/"+jssrc+"/"+jssrc+".js";
	if(self != undefined && self !=''){
		var childNodes = self.parentNode.parentNode.parentNode.childNodes;
		$('#center-title').html(childNodes[0].innerText+" / "+self.innerHTML);
	}
	if(outlink==1){
		var content = '<iframe scrolling="no" frameborder="0"  src="'+url+'" style="width:100%;height:100%;"></iframe>';  
	 	$('#center-bottom').html(content);
	}else{
		$('#center-bottom').panel({
			href:url,
			onLoad: function (param){
				//
				if(url.indexOf("editer")<0){
					LoadJS(js,tableName,callback);
				}
			}
		});
		/*var button = "<";
		popupPage =$.jsPanel({
			id:          self.innerHTML,
	        position:    {my:      "left-top",
	            at:      "left-top",
	            offsetX: 160,
	            offsetY: 117},
	        theme:       "rebeccapurple",
	        contentSize: {width:1600, height:800},
//	        contentSize: 'auto auto',
	        headerTitle: self.innerHTML,
	        border:      '2px solid rgb(7,102,104)',
	        contentAjax: {
	            url: url,
	            autoload: true,
	            done: function (data, textStatus, jqXHR, panel) {
	            	LoadJS(js,tableName,callback);
	            }
	        },
	        callback:function(panel){
	        	this.content.css("padding", "5px");
	        }
	    });*/
	}
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
	        $("#menu").html("");
	        for(var i=0;i<data.length;i++){
	          var menuData = data[i];
	          var childrenData = menuData.children;
	          var imgSrc = menuData.attributes.C_ICONCLS;
	          if(imgSrc ==null){
	        	  imgSrc = "";
	          }
	          
	          var menuTreeData = "<dl><dt class='menu'><i class='home'><img src='"+imgSrc+"' height='16' width='18' /></i><a href='javascript:;'>"+menuData.text+"</a><i class='arrow'><img class='right' src='/images/home-page-pandect/choice-right.png' height='11' width='12' /></i></dt>";
	          if(childrenData!=undefined){
	        	  for(var j=0;j<childrenData.length;j++){
	  	            var icon = childrenData[j].attributes.C_ICONCLS;
	  	            menuTreeData = menuTreeData+"<dd class='sub-menu' style='display: none'><div><a class='text' href='javascript:;' onclick=res('"+childrenData[j].attributes.C_URL+"','"+childrenData[j].attributes.C_ISOUTLINK + "','"+childrenData[j].attributes.C_ISCOMMON + "',this);>"+childrenData[j].text+"</a></div><div style='clear: both;'></div></dd>";
	  	          } 
	          }
	          menuTreeData = menuTreeData+"</dl>";
	          $("#menu").append(menuTreeData);
	        }
	      },
	      error:function(data){
	        
	      }
	  });
}

/**
 * 获取登陆名
 */
function initUserName(){
	$.ajax({
	      url:'/login/getUserName.action',
	      method: 'post',
	      dataType:'json',    
	      success:function(data){
	       $("#loginName").html(data.username)
	      },
	      error:function(data){
	        
	      }
	  });
}