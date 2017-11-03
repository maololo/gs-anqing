package com.hnxt.power.service;

import java.util.List;
import java.util.Map;


/** 
 * @ClassName CommonService  
 * @Description 通用接口
 * @Author ..A..w.. 2262858312@qq.com Or qinfengchun101@Gmail.com    
 * @Date 2017年1月11日 下午3:17:29 
 * @修改历史  
 *     1. [2017年1月11日]创建文件 by ..A..w..
 */
public interface SpatialDataService {

     /**
     * @Title getModelInfo 获取空间数据字段集合
     * @Description  通过空间数据表名称获取数据字段集合
     * @param modelName 空间数据表名称
     * @Return L	ist<Map<String, Object>   集合 
     * @Throws 
     * @Date  2017年9月29日
     * @修改历史  
     *     1. [2017年9月29日]创建文件 hbx
     */
   public  List<Map<String, Object>> getSpatialData(String modelName);

   /**
    * @Title getMultiConditionData 多条件查询数据
    * @Description  通过空间数据表名称获取数据集合
    * @param modelName 空间数据表名称
    * @Return L	ist<Map<String, Object>   集合 
    * @Throws 
    * @Date  2017年9月29日
    * @修改历史  
    *     1. [2017年9月29日]创建文件 hbx
    */
   public  List<Map<String, Object>> getMultiConditionData(String modelName,Map<String, Object> map);
   
   
   /**
    * @Title getMultiConditionData 多条件查询数据
    * @Description  通过空间数据表名称获取数据集合
    * @param modelName 空间数据表名称
    * @Return <Map<String, Object>   条件集合 
    * @Throws 
    * @Date  2017年11月1日
    * @修改历史  
    *     1. [2017年11月1日]创建文件 hbx
    */
   public  List<Map<String, Object>> getMultiConditionByPage(String modelName,Map<String, Object> map);
   
   /** 
	  * //TODO 获取多条件分页查询的数据总条数
	  * @Title getMultiConditionCount 
	  * @Description TODO(这里用一句话描述重构方法的作用) 
	  * @param modelName 表名
	  * @param map 条件
	  * @return  int 总条数
	  * @see com.hnxt.basic.service.CommunService#queryCount(java.lang.String, java.util.List, java.lang.String)
	  * @Date  2017年11月1日
	  * @修改历史  
	  *     1.[2017年11月1日]创建文件 hbx 
	 **/
	public int getMultiConditionCount(String modelName, Map<String, Object> map); 
}
