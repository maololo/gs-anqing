/**
 * Created by Administrator on 2017/3/29.
 */


/**
 * 加载指定模块页面
 * 1.html
 * 2.css
 * 3.js
 * 4.模块默认回调方法
 * @param name
 * @param url
 * @param js
 * @param css
 * @param callback
 */
function LoadPage(url,js,css,callback){
	init=function(){
		console.info("异步加载的js中，未定义init方法");
		console.info("功能页面没有设置默认的回调方法 init()  请在对应的模块js上添加init 方法");
	};
        $("#content-bottom").html("");
        $("#content-bottom").load(url);

  /*  $(".content-top").find("span").eq(1).text(name);*/
	LoadCss(css);
	LoadJS(js,callback);
}
/**
 * JS动态加载
 * @param src js路径
 * @constructor
 */
function LoadJS(src,callback) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	if(script.readyState){ // IE
		script.onreadystatechange = function(){
			if(script.readyState == "loaded" || script.readyState == "complete"){
				script.onreadystatechange = null;
				if (!$.isEmptyObject(callback)){
					callback();
				}else{
					init();
				}
			}
		};
	}else{ // FF, Chrome, Opera, ...
		script.onload = function(){
			if (!$.isEmptyObject(callback)){
				callback();
			}else{
				init();
			}
		};
	}
	script.src = src;
	document.getElementsByTagName("head").item(0).appendChild(script);
}

// 动态加载css文件
function LoadCss(file){
	var cssTag = document.getElementById('loadCss');
	var head = document.getElementsByTagName('head').item(0);
	if(cssTag) head.removeChild(cssTag);
	var css = document.createElement('link');
	css.href = "/css/"+file;
	css.rel = 'stylesheet';
	css.type = 'text/css';
	css.id = 'loadCss';
	head.appendChild(css);
}

function init(){
	console.info("异步加载的js中，未定义init方法");
	console.info("功能页面没有设置默认的回调方法 init()  请在对应的模块js上添加init 方法");
}
