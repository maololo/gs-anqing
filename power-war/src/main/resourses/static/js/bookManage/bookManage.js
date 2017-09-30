

//判断数据库T_POWERBOOKMARK表里是否存在此标签名(标签名称)
// 返回   false：数据库没有此数据；  true：数据库有此数据
function queryField(value){
	var flag="";
	$.ajax({
    	//请求地址                               
       url:"/T_POWERBOOKMARK/search.action",
	   data:{"search.C_BOOKNAME*eq":value},//设置请求参数 
	   type:"post",//请求方法
	   async:false, 
	   dataType:"json",//设置服务器响应类型
	  //success：请求成功之后执行的回调函数   data：服务器响应的数据
	   success:function(data){
		   if(data==""){
			   flag=false; 
		   }else{
			   flag=true;
		   }
	   }
   });
	return flag;
}