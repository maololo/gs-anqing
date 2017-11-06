// 当前图片的索引
var curIndex = 0;
// 图片的数量
var imgLen = 0;
var imgDailog = "";
// 定时器
var autoChange;

function init(){
	if(autoChange){  
	    clearInterval(autoChange);
	} 
	// 加载图片
	loadImg();
	
	// 点击关闭按钮时触发
    $("#imgmsg1 .jsglyph-close").click(function(){
    	clearInterval(autoChange);
    });
    
    // 删除按钮滑入滑出事件处理
	$("#delBtn").hover(function(){
	    // 滑入清除定时器
	    clearInterval(autoChange);
	},function(){
	    // 滑出则重置定时器
	    autoChangeAgain();
	});
	
}

function loadImg(){
	$.ajax({
		url:"/PICTURE/search.action",
    	data:{"search.AFFILIATEDID*eq": rowData.C_CODE, "sort.C_ID": "DESC"},
    	type:"post",
        dataType:"Json",
        async:false,
        success: function(data){
        	if (!$.isEmptyObject(data)) {
        		curIndex = 0;
        		// 定时器自动变换2.5秒每次
        		autoChange = setInterval(function(){
        		    if(curIndex < imgLen-1){
        		        curIndex ++;
        		    }else{
        		        curIndex = 0;
        		    }
        		    // 调用变换处理函数
        		    changeTo(curIndex);
        		},2500);
        		
        		var imgUl = $(".imgUl");
        		imgUl.text("");
        		var infoUl = $(".infoUl");
        		infoUl.text("");
        		var indexUl = $(".indexUl");
        		indexUl.text("");
        		var smallUl = $(".smallUl");
        		smallUl.text("");
        		
        		// 控制图片最多显示五张
        		if(data.length >= 5){
        			imgLen = 5;
        		}else{
        			imgLen = data.length;
        		}
        		
        		for(var i = 0; i < imgLen; i++){
        			var pic = data[i];
        			var imgLi = $("<li>");
        			var img = $("<img>").attr({"src": "/upload/" + pic.FILENAME, "alt": ""}).css({"width": "500px", "height": "300px"});
        			img.appendTo(imgLi);
        			imgUl.append(imgLi);
        			// 隐藏域赋值用作删除
        			var input = $("<input>").attr({"type": "hidden", "id": "IMG" + i, "value": pic.C_ID});
        			imgUl.append(input);
        			
                    var txt = pic.REMARK,
                    textLeng = 78;
                    if(txt.length > textLeng){
                    	txt = txt.substring(0, textLeng) + "......";
                    } 
        			var infoLi = $("<li>").append(txt);
        			if(i == 0) infoLi.attr("class", "infoOn");
        			infoUl.append(infoLi);
        			
        			var indexLi = $("<li>");
        			if(i == 0) indexLi.attr("class", "indexOn");
        			indexUl.append(indexLi);
        			
        			var smallLi = $("<li>").attr("title", pic.REMARK);
        			var smallImg = $("<img>").attr({"src": "/upload/" + pic.FILENAME, "alt": ""}).css({"width": "90px", "height": "50px"});
        			var pImg = $("<p>").attr({"align": "center", "class": "small-p"}).append(pic.NAME);
        			smallImg.appendTo(smallLi);
        			pImg.appendTo(smallLi);
        			if(i == 0) smallLi.attr("class", "smallOn");
        			smallUl.append(smallLi);
        		}
        	}
        }
    })
	
	// 对small进行事件绑定处理等
	$(".smallUl").find("li").each(function(item){
	    $(this).click(function(){
	    	clearInterval(autoChange);
	    	changeTo(item);
	        curIndex = item;
	        autoChangeAgain();
	        changeTo(item);
	    });
	});
}

// 清除定时器时候的重置定时器--封装
function autoChangeAgain(){
    autoChange = setInterval(function(){
        if(curIndex < imgLen-1){
            curIndex ++;
        }else{
            curIndex = 0;
        }
        // 调用变换处理函数
        changeTo(curIndex);
    },2500);
}

function changeTo(num){
	var w = $("#banner").width();
    var goLeft = num * w;
    $(".imgUl").stop(true, true).animate({left: "-" + goLeft + "px"}, 500);
    $(".infoUl").find("li").removeClass("infoOn").eq(num).addClass("infoOn");
    $(".indexUl").find("li").removeClass("indexOn").eq(num).addClass("indexOn");
    $(".smallUl").find("li").removeClass("smallOn").eq(num).addClass("smallOn");
}

function addImg(){
	openDailog('/imgmsg/imgAdd.action', '添加图片');
}

function closeImg(){
	if(!isEmpty(imgDailog)){
		imgDailog.close();
		imgDailog = "";		
	}
}

function openDailog(url, title){
	imgDailog = $.jsPanel({
	 	headerControls: {controls: "closeonly"},
        id: "imgAdd",
        position: 'center',
        theme: "#308374",
        dragit: {containment: [100, 0, 0, 160]},
        contentSize: {width: 'auto', height: 'auto'},
        headerTitle: title,
        border: '1px solid #066868',
        contentAjax: {
            url: url,
            autoload: true,
            done: function (data, textStatus, jqXHR, panel) {
            	initAdd();
            }
        },
        callback:function(){
            this.content.css({"padding": "5px"});
        }
    });
}

function initAdd(){
	$("#E_NAME").val(rowData.C_NAME);
	$("#AFFILIATEDID").val(rowData.C_CODE);
}

function saveImg(){
	if (!$('#img_form').valid()) return null;
	$("body").mLoading("show");
	var option = {
	　　 url : '/PICTURE/picUploadFile.action',
	　　 type : 'POST',
	　　 dataType : 'json',
	　　 headers : {"ClientCallMode" : "ajax"}, // 添加请求头部
	　　 success : function(data) {
		 	$("body").mLoading("hide");
	　　           	swal('添加成功','',"success");
	　　           	imgDailog.close();
	　　           	if(autoChange){  
	　　          	    clearInterval(autoChange);
	　　          	} 
	　　           	loadImg();
		},
		error: function(data) {
			$("body").mLoading("hide");
		    swal('添加数据失败','',"error");
		}
	};
	$("#img_form").ajaxSubmit(option);
}

function delImg(){
	var delId = $("#IMG" + curIndex).val();
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
		$("body").mLoading("show");
    	$.post('/PICTURE/delete.action', {"ID": delId},
      		function(result){
    			$("body").mLoading("hide");
  				if (result.success){
  					swal("删除成功！",'',"success");
  					if(autoChange){  
  					    clearInterval(autoChange);
  					} 
  					loadImg();
  	            }else{
  	            	swal("删除失败！",'',"error");
  	            }
        	},'json'
    	);
	});
}

















