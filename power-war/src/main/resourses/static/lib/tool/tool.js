/*
用途：校验ip地址的格式 
输入：strIP：ip地址 
返回：如果通过验证返回true,否则返回false； 
*/ 
function isIP(strIP) { 
if (isNull(strIP)) return false; 
var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g //匹配IP地址的正则表达式 
if(re.test(strIP)) 
{ 
if( RegExp.$1 <256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256) return true; 
} 
return false; 
} 

/* 
用途：检查输入字符串是否为空或者全部都是空格 
输入：str 
返回： 
如果全是空返回true,否则返回false 
*/ 
function isNull( str ){ 
if ( str == "" ) return true; 
var regu = "^[ ]+$"; 
var re = new RegExp(regu); 
return re.test(str); 
} 

  
/* 
用途：检查输入对象的值是否符合整数格式 
输入：str 输入的字符串 
返回：如果通过验证返回true,否则返回false 
*/ 
function isInteger( str ){  
var regu = /^[-]{0,1}[0-9]{1,}$/; 
return regu.test(str); 
} 

/* 
用途：验证输入的值只能是数字或小数 
输入：str 输入的字符串 
返回：如果通过验证返回true,否则返回false 
*/ 
function validateNum(s){

	var regu =/^(([1-9]\d*)+|0)(\.\d+)?$/; 
	var re = new RegExp(regu); 
	if(re.test(s)){
		return true;
	}else{
		return false;
	}

}

/* 
用途：检查输入手机号码是否正确 
输入： 
s：字符串 
返回： 
如果通过验证返回true,否则返回false 

*/ 
function checkMobile( s ){   
var regu =/^[1][3-9][0-9]{9}$/; 
var re = new RegExp(regu); 
if (re.test(s)) { 
return true; 
}else{ 
return false; 
} 
} 


  
/* 
用途：检查输入字符串是否符合正整数格式 
输入： 
s：字符串 
返回： 
如果通过验证返回true,否则返回false 

*/ 
function isNumber( s ){   
var regu = "^[0-9]+$"; 
var re = new RegExp(regu); 
if (s.search(re) != -1) { 
return true; 
} else { 
return false; 
} 
} 

/* 
用途：检查输入字符串是否是带小数的数字格式 
输入： 
s：字符串 
返回： 
如果通过验证返回true,否则返回false 

*/ 
function isDecimal( str ){   
if(isInteger(str)) return true; 
var re = /^[+-]?(\d+)[\.]+(\d+)$/; 
if (re.test(str)) { 
if(RegExp.$1==0&&RegExp.$2==0) return false; 
return true; 
} else { 
return false; 
} 
} 



/* 
用途：检查输入对象的值是否符合端口号格式 
输入：str 输入的字符串 
返回：如果通过验证返回true,否则返回false 

*/ 
function isPort( str ){  
return (isNumber(str) && str<65536); 
} 

/* 
用途：检查输入对象的值是否符合E-Mail格式 
输入：str 输入的字符串 
返回：如果通过验证返回true,否则返回false 

*/ 
function isEmail( str ){  
var myReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/; 
if(myReg.test(str)) return true; 
return false; 
} 

/* 
用途：检查输入字符串是否符合金额格式 
格式定义为带小数的正数，小数点后最多三位 
输入： 
s：字符串 
返回： 
如果通过验证返回true,否则返回false 

*/ 
function isMoney( s ){   
var regu = "^[0-9]+[\.][0-9]{0,3}$"; 
var re = new RegExp(regu); 
if (re.test(s)) { 
return true; 
} else { 
return false; 
} 
} 
/* 
用途：检查输入字符串是否只由英文字母和数字和下划线组成 
输入： 
s：字符串 
返回： 
如果通过验证返回true,否则返回false 

*/ 
function isNumberOr_Letter( s ){//判断是否是数字或字母 

var regu = "^[0-9a-zA-Z\_]+$"; 
var re = new RegExp(regu); 
if (re.test(s)) { 
return true; 
}else{ 
return false; 
} 
} 
/* 
用途：检查输入字符串是否只由英文字母和数字组成 
输入： 
s：字符串 
返回： 
如果通过验证返回true,否则返回false 

*/ 
function isNumberOrLetter( s ){//判断是否是数字或字母 

var regu = "^[0-9a-zA-Z]+$"; 
var re = new RegExp(regu); 
if (re.test(s)) { 
return true; 
}else{ 
return false; 
} 
} 
/* 
用途：检查输入字符串是否只由汉字、字母、数字组成 
输入： 
value：字符串 
返回： 
如果通过验证返回true,否则返回false 

*/ 
function isChinaOrNumbOrLett( s ){//判断是否是汉字、字母、数字组成 

var regu = "^[0-9a-zA-Z\u4e00-\u9fa5]+$";   
var re = new RegExp(regu); 
if (re.test(s)) { 
return true; 
}else{ 
return false; 
} 
} 

/* 
用途：判断是否是日期 
输入：date：日期；fmt：日期格式 
返回：如果通过验证返回true,否则返回false 
*/ 
function isDate( date, fmt ) { 
if (fmt==null) fmt="yyyyMMdd"; 
var yIndex = fmt.indexOf("yyyy"); 
if(yIndex==-1) return false; 
var year = date.substring(yIndex,yIndex+4); 
var mIndex = fmt.indexOf("MM"); 
if(mIndex==-1) return false; 
var month = date.substring(mIndex,mIndex+2); 
var dIndex = fmt.indexOf("dd"); 
if(dIndex==-1) return false; 
var day = date.substring(dIndex,dIndex+2); 
if(!isNumber(year)||year>"2100" || year< "1900") return false; 
if(!isNumber(month)||month>"12" || month< "01") return false; 
if(day>getMaxDay(year,month) || day< "01") return false; 
return true; 
} 

function getMaxDay(year,month) { 
if(month==4||month==6||month==9||month==11) 
return "30"; 
if(month==2) 
if(year%4==0&&year%100!=0 || year%400==0) 
return "29"; 
else 
return "28"; 
return "31"; 
} 

/* 
用途：字符1是否以字符串2结束 
输入：str1：字符串；str2：被包含的字符串 
返回：如果通过验证返回true,否则返回false 

*/ 
function isLastMatch(str1,str2) 
{  
var index = str1.lastIndexOf(str2); 
if(str1.length==index+str2.length) return true; 
return false; 
} 

  
/* 
用途：字符1是否以字符串2开始 
输入：str1：字符串；str2：被包含的字符串 
返回：如果通过验证返回true,否则返回false 

*/ 
function isFirstMatch(str1,str2) 
{  
var index = str1.indexOf(str2); 
if(index==0) return true; 
return false; 
} 

/* 
用途：字符1是包含字符串2 
输入：str1：字符串；str2：被包含的字符串 
返回：如果通过验证返回true,否则返回false 

*/ 
function isMatch(str1,str2) 
{  
var index = str1.indexOf(str2); 
if(index==-1) return false; 
return true; 
} 

  
/* 
用途：检查输入的起止日期是否正确，规则为两个日期的格式正确， 
且结束如期>=起始日期 
输入： 
startDate：起始日期，字符串 
endDate：结束如期，字符串 
返回： 
如果通过验证返回true,否则返回false 

*/ 
function checkTwoDate( startDate,endDate ) { 
if( !isDate(startDate) ) { 
alert("起始日期不正确!"); 
return false; 
} else if( !isDate(endDate) ) { 
alert("终止日期不正确!"); 
return false; 
} else if( startDate > endDate ) { 
alert("起始日期不能大于终止日期!"); 
return false; 
} 
return true; 
} 

/* 
用途：检查输入的Email信箱格式是否正确 
输入： 
strEmail：字符串 
返回： 
如果通过验证返回true,否则返回false 

*/ 
function checkEmail(strEmail) { 
//var emailReg = /^[_a-z0-9]+@([_a-z0-9]+\.)+[a-z0-9]{2,3}$/; 
var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/; 
if( emailReg.test(strEmail) ){ 
return true; 
}else{ 
alert("您输入的Email地址格式不正确！"); 
return false; 
} 
} 

/* 
用途：检查输入的电话号码格式是否正确 
输入： 
strPhone：字符串 
返回： 
如果通过验证返回true,否则返回false 

*/ 
function checkPhone( strPhone ) { 
var phoneRegWithArea = /^[0][1-9]{2,3}-{0,1}[0-9]{5,10}$/; 
var phoneRegNoArea = /^[1-9]{1}[0-9]{5,8}$/; 
var prompt = "您输入的电话号码不正确!" 
if( strPhone.length > 9 ) { 
if( phoneRegWithArea.test(strPhone) ){ 
return true; 
}else{ 
return false; 
} 
}else{ 
if( phoneRegNoArea.test( strPhone ) ){ 
return true; 
}else{ 
return false; 
} 

  
} 
} 

function checkDate( value ) { 
if(value=='') return true; 
if(value.length!=8 || !isNumber(value)) return false;  
var year = value.substring(0,4); 
if(year>"2100" || year< "1900") 
return false; 

var month = value.substring(4,6); 
if(month>"12" || month< "01") return false; 

var day = value.substring(6,8); 
if(day>getMaxDay(year,month) || day< "01") return false; 

return true;  
} 

/* 
用途：检查输入的起止日期是否正确，规则为两个日期的格式正确或都为空 
且结束日期>=起始日期 
输入： 
startDate：起始日期，字符串 
endDate：  结束日期，字符串 
返回： 
如果通过验证返回true,否则返回false 

*/ 
function checkPeriod( startDate,endDate ) { 
if( !checkDate(startDate) ) { 
alert("起始日期不正确!"); 
return false; 
} else if( !checkDate(endDate) ) { 
alert("终止日期不正确!"); 
return false; 
} else if( startDate > endDate ) { 
alert("起始日期不能大于终止日期!"); 
return false; 
} 
return true; 
} 



/**
去掉空格方法
*/
String.prototype.Trim = function() {
	var m = this.match(/^\s*(\S+(\s+\S+)*)\s*$/);
	return (m == null) ? "" : m[1];
};

/**
* 增强版去空格(左右中间)
*/
String.prototype.TrimAll = function(){
	var result;
	var is_global = "g";
	result = this.replace(/(^\s+)|(\s+$)/g,"");
	if(is_global.toLowerCase()=="g")
	result = result.replace(/\s/g,"");
	return result;
}

/**
 * 
 * 对Date的扩展，将Date 转化为指定格式的String
 * 
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用1-2 个占位符
 * 
 * 年(y)可以用1-4 个占位符，毫秒(S)只能用1 个占位符(是1-3 位的数字)
 * 
 * eg:
 * 
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * 
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二20:09:04
 * 
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二08:09:04
 * 
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二08:09:04
 * 
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 * 
 */

// var date = new Date();
// window.alert(date.pattern("yyyy-MM-dd hh:mm:ss"));
// -->

Date.prototype.pattern = function(fmt) {
	var o = {

		"M+" : this.getMonth() + 1, // 月份

		"d+" : this.getDate(), // 日

		"h+" : this.getHours(), // 小时

		"H+" : this.getHours(), // 小时

		"m+" : this.getMinutes(), // 分

		"s+" : this.getSeconds(), // 秒

		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度

		"S" : this.getMilliseconds()
	// 毫秒

	};

	var week = {

		"0" : "\u65e5",

		"1" : "\u4e00",

		"2" : "\u4e8c",

		"3" : "\u4e09",

		"4" : "\u56db",

		"5" : "\u4e94",

		"6" : "\u516d"

	};

	if (/(y+)/.test(fmt)) {

		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));

	}

	if (/(E+)/.test(fmt)) {

		fmt = fmt
				.replace(
						RegExp.$1,
						((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f"
								: "\u5468")
								: "")
								+ week[this.getDay() + ""]);

	}

	for ( var k in o) {

		if (new RegExp("(" + k + ")").test(fmt)) {

			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));

		}

	}

	return fmt;

};



 /**
  *对象拷贝
  */
 function extend(source) {
 	var destination=new Object();
	for ( var p in source) {
		if (getType(source[p]) == "array" || getType(source[p]) == "object") {
			destination[p] = getType(source[p]) == "array" ? [] : {};
			arguments.callee(destination[p], source[p]);
		} else {
			destination[p] = source[p];
		}
	}
	return destination;
}
function getType(o) {
	var _t;
	return ((_t = typeof (o)) == "object" ? o == null && "null"
			|| Object.prototype.toString.call(o).slice(8, -1) : _t)
			.toLowerCase();
}

//将String转换成date
function formatDate(time){
 	  var time1 = time.split("-");
 	  if(time1.length==3){
      	var date =new Date(time1[0],(time1[1]-1),time1[2],0,0);
 	  }else if(time1.length==2){
 	    var date =new Date(time1[0],(time1[1]-1),0,0,0);
 	  }else{
 	    var date =new Date(time1[0],0,0,0,0);
 	  }
     return date;
}


/**
 *四舍五入方法的精度改写
 */
Number.prototype.toFixed  =   function ( exponent)
{ 
     return  parseInt( this   *  Math.pow(  10 , exponent)  +   0.5 )/Math.pow(10,exponent);
}

/**
 *格式化数据
 */
function _formatnumber(value, num) {            
	 var a, b, c, i;                               
	 a = value.toString();                         
	 b = a.indexOf(".");                           
	 c = a.length;                                 
	 if (num == 0) {                               
	     if (b != -1) {                            
	         a = a.substring(0, b);                
	     }                                         
	 } else {                                      
	     if (b == -1) {                            
	         a = a + ".";                          
	         for (i = 1; i <= num; i++) {          
	             a = a + "0";                      
	         }                                     
	     } else {                                  
	         a = a.substring(0, b + num + 1);      
	         for (i = c; i <= b + num; i++) {      
	             a = a + "0";                      
	         }                                     
	     }                                         
	 }                                             
	 return a;                                     
}

function _round(num,n){                             
    var   dd=1;                                       
    var   tempnum;                                    
    for(i=0;i<n;i++){                                 
        dd*=10;                                       
    }                                                 
    tempnum=num*dd;                                   
    tempnum=Math.round(tempnum);                      
    return _formatnumber(tempnum/dd,n);                
}                                                     
   //验证数组是否有值重复                                             
  function isRepeat(arr){

     var hash = {};

     for(var i in arr) {

         if(hash[arr[i]])

             return true;

         hash[arr[i]] = true;

     }

     return false;

}


